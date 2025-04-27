#!/usr/bin/luajit
package.path = package.path .. '../?;../?.lua;../../?;../libs/?.lua;../cdefs/?.lua'

local redis = require("redis")
local utils = require("utils")

local GAI_CONF = "/etc/gai.conf"

-- These default values are given in RFC 6724 Section 2.1
-- NOTE: the gai.conf man page gives a different default table (from the obsoleted RFC 3484)

local DEFAULT_POLICY_TABLE = {
	["::1/128"] 		= { Precedence = 50 , Label = 0  },
	["::/0"] 			= { Precedence = 40 , Label = 1  },
	["::ffff:0:0/96"] 	= { Precedence = 35 , Label = 4  },
	["2002::/16"] 		= { Precedence = 30 , Label = 2  },
	["2001::/32"] 		= { Precedence = 5  , Label = 5  },
	["fc00::/7"] 		= { Precedence = 3  , Label = 13 },
	["::/96"] 			= { Precedence = 1  , Label = 3  },
	["fec0::/10"] 		= { Precedence = 1  , Label = 11 },
	["3ffe::/16"] 		= { Precedence = 1  , Label = 12 },
}

local DEFAULT_PRECEDENCE_CONF = 
[[
precedence  ::1/128        50
precedence  ::/0           40
precedence  ::ffff:0:0/96  35
precedence  2002::/16      30
precedence  2001::/32      5
precedence  fc00::/7       3
precedence  ::/96          1
precedence  fec0::/10      1
precedence  3ffe::/16      1

]]

local DEFAULT_LABEL_CONF = 
[[
label  ::1/128        0
label  ::/0           1
label  ::ffff:0:0/96  4
label  2002::/16      2
label  2001::/32      5
label  fc00::/7       13
label  ::/96          3
label  fec0::/10      11
label  3ffe::/16      12

]]

local params = {
	scheme = 'unix',
	path = CONFIG.redis_sock,
	-- host = CONFIG.redis_host,
	-- port = CONFIG.redis_port,
	timeout = 0
}

AddressSelection = {}

AddressSelection._PolicyTable = {}

local db = nil
local function _open_redis()
	db = redis:connect(params)
end

local function _close_redis()
	if db and type(db.quit) == "function" then
		db:quit()
	end
	db = nil
end

function AddressSelection:setTableKey(table_root)
	self._table_root = table_root
end

function AddressSelection:getPrecedence(prefix)

	local entry = db:hget(self._table_root, prefix)

	if type(entry) == "string" then
		local p, l = string.match(entry, "^(%d*):(%d*)$")

		return entry and p
	end
end

function AddressSelection:getLabel(prefix)

	local entry = db:hget(self._table_root, prefix)

	if type(entry) == "string" then
		local p, l = string.match(entry, "^(%d*):(%d*)$")

		return entry and l
	end
end

function AddressSelection:getPolicy(prefix)

	local entry = db:hget(self._table_root, prefix)

	if type(entry) == "string" then
		local p, l = string.match(entry, "^(%d*):(%d*)$")

		return { Precedence = tonumber(p) and p, Label = tonumber(l) and l }
	end
end

function AddressSelection:getPolicyTable()

	local redis_policy_table = db:hgetall(self._table_root)
	local polTable = {}

	for prefix, entry in pairs(redis_policy_table) do

		if type(entry) == "string" then

			local p, l = string.match(entry, "^(%d*):(%d*)$")
			polTable[prefix] = {
				Precedence = tonumber(p) and p,
				Label = tonumber(l) and l
			}

		end
	end

	return polTable
end

function AddressSelection:setPrecedence(prefix, precedence, forceSync)

	local entry = db:hget(self._table_root, prefix)

	local p, l = string.match(entry, "^(%d*):(%d*)$")

	local packed_entry = precedence .. ":" .. l or ""
	db:hset(self._table_root, prefix, packed_entry)

	if forceSync then self:writeToConf() end
end

function AddressSelection:setLabel(prefix, label, forceSync)

	local entry = db:hget(self._table_root, prefix)

	local p, l = string.match(entry, "^(%d*):(%d*)$")

	local packed_entry = p or "" .. ":" .. label or ""
	db:hset(self._table_root, prefix, packed_entry)

	if forceSync then self:writeToConf() end
end

function AddressSelection:setPolicy(prefix, precedence, label, forceSync)

	local packed_entry = precedence or "" .. ":" .. label or ""
	db:hset(self._table_root, prefix, packed_entry)

	self:_setIPAddressLabel(prefix, label)

	if forceSync then self:writeToConf() end
end

function AddressSelection:setPolicyTable(table, forceSync)

	for prefix, entry in pairs(table) do
		self:setPolicy(prefix, entry.Precedence, entry.Label, false)
	end

	if forceSync then self:writeToConf() end
end

function AddressSelection:deletePrecedence(prefix, forceSync)

	local entry = db:hget(self._table_root, prefix)

	local p, l = string.match(entry, "^(%d*):(%d*)$")

	if tonumber(l) then
		db:hset(self._table_root, prefix, ":"..l)
	else
		db:hdel(self._table_root, prefix)
	end

	if forceSync then self:writeToConf() end
end

function AddressSelection:deleteLabel(prefix, forceSync)

	local entry = db:hget(self._table_root, prefix)

	local p, l = string.match(entry, "^(%d*):(%d*)$")

	if tonumber(p) then
		db:hset(self._table_root, prefix, p..":")
	else
		db:hdel(self._table_root, prefix)
	end

	self:_deleteIPAddressLabel(prefix)

	if forceSync then self:writeToConf() end
end

function AddressSelection:deletePolicy(prefix, forceSync)

	db:hdel(self._table_root, prefix)

	self:_deleteIPAddressLabel(prefix)

	if forceSync then self:writeToConf() end
end

function AddressSelection:deletePolicyTable(forceSync)

	db:del(self._table_root)

	os.execute("ip addrlabel flush")

	if forceSync then self:writeToConf() end
end

function AddressSelection:_setIPAddressLabel(prefix, label)

	if prefix and tonumber(label) then os.execute(string.format("ip addrlabel add prefix %s label %s", prefix, label)) end

end

function AddressSelection:_deleteIPAddressLabel(prefix)

	if prefix then os.execute(string.format("ip addrlabel del prefix %s", prefix)) end

end

function AddressSelection:readFromRedis(table_root)

	local redis_policy_table = db:hgetall(table_root)

	local pol_table = {}
	for prefix, entry in pairs(redis_policy_table) do

		if type(entry) == "string" then

			local p, l = string.match(entry, "^(%d*):(%d*)$")
			pol_table[prefix] = {
				Precedence = tonumber(p) and p,
				Label = tonumber(l) and l
			}

		end
	end

	return pol_table
end

function AddressSelection:writeToRedis(policy_table, table_root)

	db:del(table_root)
	db:pipeline(function (pipe)
		for prefix, entry in pairs(policy_table) do
			local packed_entry = entry.Precedence or "" .. ":" .. entry.Label or ""
			pipe:hset(table_root, prefix, packed_entry)
		end
	end)

end

function AddressSelection:readFromConf()
	conf_fd = io.open(GAI_CONF, "r")
	if conf_fd == nil then error(err) end

	local policy_table = {}
	for line in conf_fd:lines() do
		local trimmed = line:match("^%s*(.+)$")
		if trimmed and trimmed:sub(1,1) ~= "#" then
			local command, prefix, value = trimmed:match("^(%w+)%s+([%x:/]+)%s+(%d+)%s*$")

			policy_table[prefix] = policy_table[prefix] or {}

			if command == "precedence" then
				policy_table[prefix].Precedence = value
			elseif command == "label" then
				policy_table[prefix].Label = value
			end
		end
	end
	conf_fd:close()

	return policy_table
end

function AddressSelection:writeToConf(policy_table)
	conf_fd, err = io.open(GAI_CONF, "w+")
	if conf_fd == nil then error(err) end

	conf_fd:write("# Address policy table: see man 5 gai.conf\n\n")

	local polTable = self:getPolicyTable()
	-- if gai.conf is empty, the kernel will use the default values, so we may as well set our local copy to the defaults for consistency
	if type(polTable) ~= "table" or next(polTable) == nil then
		polTable = DEFAULT_POLICY_TABLE
	end

	local precedences = {}
	local labels = {}
	for prefix, entry in pairs(polTable) do
		if entry.Precedence ~= nil then
			table.insert(precedences, string.format("precedence  %-15s  %s", prefix, entry.Precedence))
		end
		if entry.Label ~= nil then
			table.insert(labels, string.format("label  %-15s  %s", prefix, entry.Label))
		end
	end

	conf_fd:write(table.concat(precedences, "\n"))
	conf_fd:write("\n\n")
	conf_fd:write(table.concat(labels, "\n"))
	conf_fd:write("\n\n")
	conf_fd:close()

	-- print(table.concat(precedences, "\n"))
	-- print("\n\n")
	-- print(table.concat(labels, "\n"))
	-- print("\n\n")
	
end

for k,v in pairs(AddressSelection.__index) do

	if type(v) == "function" then
		self.__index[k] = function(...)
			local res = {}

			_open_redis()
			res = {v(...)}
			_close_redis()

			return unpack(res)
		end
	end
end

return AddressSelection