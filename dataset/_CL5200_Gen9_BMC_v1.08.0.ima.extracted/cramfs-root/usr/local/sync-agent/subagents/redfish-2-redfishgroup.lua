package.path = package.path .. ";./libs/?;./libs/?.lua;"

local utils = require('utils')

local redis = require('redis')

local CONFIG = require("config")

local _ = require('underscore')

local map = require("redfish_intermediate_map")

-- Exiting if the redfish_intermediate_map is empty
if next(map) == nil then
	print("Empty intermediate map. Exiting...")
	os.exit()
end

utils.daemon("/var/run/redfish2redfishgroup.pid")

local params = {
	scheme = 'unix',
	path = CONFIG.redis_sock,
	-- host = CONFIG.redis_host,
	-- port = CONFIG.redis_port,
	timeout = 0
}


local client = redis.connect(params)
local db = redis.connect(params)

local redis_db_index = 0
-- choose db if needed
client:select(redis_db_index)

-- Set the keyspace notification as redis conf
client:config('set', 'notify-keyspace-events','KEA')


-- TODO: change this to configurable option. Where they can choose keyspace or keyevent notification
-- From this channel we will know any operation performed on any key
-- We will be most interested in SET, SADD, HSET, HMSET, MSET kind of operations
-- Identify all possible set commands required and subscribe individually, to avoid subscription overload
local channels = {}

local ch_prefix = '__keyspace@'.. redis_db_index ..'__:'

_.each(map, function(item) 
	table.insert(channels, ch_prefix .. item.redis_key)
end)

local make_group_name = function(key, gname)
	local segments = utils.split(key, ':')
	local group_segments = utils.split(gname, ':')
	local gname = group_segments[1]

	if #group_segments > 1 then
		for i=2,#group_segments do
			local pat = group_segments[i]
			local index = tonumber(pat)
			if index then

				if index < 0 then
					pat = "%"..pat
					index = #segments + index + 1
				end

				gname = gname..":"..segments[index]

			elseif pat then

				for j, v in ipairs(segments) do
					if v == pat then
						gname = gname..":"..segments[j+1]
					end
				end

			end
		end
	end

	return gname
end


local changes = client:pubsub({psubscribe = channels})

-- Primary coroutine that listens on the channel and performs the function triggers for registered keys change events
local sync_redfish_to_redfishgroup = coroutine.wrap(function()

	while true do
		-- The changes is a coroutine wrap which when called, resumes automatically
		local msg, abort = changes()

		-- ignore the psubscribe notification that you get as soon as you subscribe
		if msg and msg.kind ~= "psubscribe" and msg.payload ~= "del" then
			-- can be a string or table
		    local value = nil

		    local key_pattern = string.sub(msg.pattern, string.len(ch_prefix)+1)

		    -- Skip unwanted key patterns
		    -- all sensor updates can be ignored
		    -- If the changed key_pattern is valid
		    if key_pattern then

				local filtered_map = _.select(map, function(item)
		    		-- Check if the incoming redis key is matching any registered item in the redfish map
					return string.find(key_pattern, item.redis_key, nil, true)
		    	end)
				
				-- Get the actual key (not pattern) that matched the subscription
				local real_key = string.sub(msg.channel, string.len(ch_prefix)+1)

		    	-- If there is any map item matching the incoming value
		    	if #filtered_map then
			    	
					-- Insert the group to pending operations, matching group argument captures as
					-- described in redfish_intermediate_map.lua
		    		for lind, litem in ipairs(filtered_map) do
						local group_name = make_group_name(real_key, litem.group_name)
						db:sadd("Redfish:PendingOperations", group_name)
		    		end

		    	end
		    end

	    end
	    coroutine.yield()
	end
end)

while true do

	sync_redfish_to_redfishgroup()

end