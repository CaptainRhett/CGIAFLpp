local posix_present, posix = pcall(require, "posix")
local bit = require("libs.bit")
local _ = require("underscore")
local JSON = require("turbo.3rdparty.JSON")

local utils = {}

utils.get_dirs = function(base_dir)
    if not posix_present then return {} end

    local files, errstr, errno = posix.dir("./" .. base_dir)

    local dirs = {}

    if files then
        for fi, fn in ipairs(files) do
            if fn ~= "." and fn ~= ".." then
                table.insert(dirs, base_dir .. "." .. fn)
            end
        end
    else
        print("Unable to load dirs in " .. base_dir)
    end

    return dirs
end

utils.get_modules = function(base_dir, module_name)
    local modules = {}
    local dirs = utils.get_dirs(base_dir)

    for _i, dir in pairs(dirs) do
        local exists, mod = pcall(require, dir .. "." .. module_name)
        if exists then
            table.insert(modules, mod)
        elseif not mod:find("not found:") then
            print(mod)
        end
    end

    return modules
end


utils.split = function(str, pattern)
    
    local tbl = {}

    for s in string.gmatch(str, "([^" .. pattern .. "]+)") do
        table.insert(tbl, s)
    end

    return tbl

end

-- utility to help standardize error printouts
local verbose_warnings = true
utils.WARNING = function(callee, caller, code)
    if verbose_warnings then
        print("Error returned by " .. tostring(callee) .. " when called by " .. tostring(caller) .. " : " .. tostring(code))
    end
end

utils.sub_process = function(lj_task, ...)

    if not posix_present then return end

    local ppid = posix.getpid("ppid")
    
    local pid = posix.fork()
    if pid < 0 then
        print("Forking process failed:" .. lj_task)
        posix._exit(1)
    elseif pid == 0 then
        local wait = posix.execp("luajit",lj_task, ...)
        posix._exit(0)
    else
        posix.wait(pid)
    end
    

    return wait
end

utils.daemon = function(pidfile)

    if not posix then return end

    local ppid = posix.getpid("ppid")
    if posix.getpid("ppid") == 1 then
        return
    end
    if pidfile then
        if posix.access(pidfile) then
            print("PID already exists")
            posix._exit(1)
        end
    end
    local pid = posix.fork()
    if pid < 0 then
        print("Daemonizing failed")
        posix._exit(1)
    elseif pid ~= 0 then
        local f = io.open(pidfile, "w")
        if f then
            f:write(string.format("%d\n", pid))
            f:close()
        else
            posix.kill(pid)
            posix.wait(pid)
            posix._exit(1)
        end
        posix._exit(0)
    end
    posix.signal(posix.SIGTERM, function() os.remove(pidfile); posix._exit(0) end)

end

utils.sub_process_nonblocking = function(lj_task, ...)
    if not posix_present then return end

    local pid1 = posix.fork()
    local pid2 = -1

    if pid1 > 0 then
        posix.wait(pid1)
    elseif pid1 == 0 then
        pid2 = posix.fork()
        if pid2 > 0 then
            posix._exit(0)
        elseif pid2 == 0 then
            posix.execp("luajit",lj_task, ...)
        else
            turbo.log.error("Forking process failed:" .. lj_task)
            posix._exit(1)
        end
    else
        turbo.log.error("Forking process failed:" .. lj_task)
        posix._exit(1)
    end    

end

-- Same as sub_process_nonblocking but won't do anything if an instance of the task is already running
utils.sub_process_nonblocking_unique = function(lj_task, ...)
    if not posix_present then return end

    local ps_cmd = string.format('ps axo state,pid,args | grep -e "[l]uajit %s"', lj_task)
    local fh = io.popen(ps_cmd)
    local existing_process = fh:read("*l")
    fh:close()

    if existing_process ~= nil then
        local proc_state, proc_pid = string.match(existing_process, "^(%S+)%s+(%S+)%s+")
        if proc_state == "Z" or proc_state == "X" then
            posix.kill(tonumber(proc_pid), posix.SIGKILL)
        else
            return
        end
    end

    local pid1 = posix.fork()
    local pid2 = -1

    if pid1 > 0 then
        posix.wait(pid1)
    elseif pid1 == 0 then
        pid2 = posix.fork()
        if pid2 > 0 then
            posix._exit(0)
        elseif pid2 == 0 then
            posix.execp("luajit",lj_task, ...)
        else
            turbo.log.error("Forking process failed:" .. lj_task)
            posix._exit(1)
        end
    else
        turbo.log.error("Forking process failed:" .. lj_task)
        posix._exit(1)
    end    

end

-- Same as sub_process_nonblocking but won't do anything if an instance of the task is already running
utils.sub_process_nonblocking_unique_pid_file = function(pid_file_path, lj_task, ...)
    if not posix_present then return end

    local pid_file = io.open(pid_file_path, "r")
    if pid_file then
        local existing_pid = pid_file:read("*all")
        if existing_pid then
            local process_exists = io.open("/proc/" .. tostring(existing_pid) .. "/cmdline", "r")
            if process_exists then
                    process_exists:close()
                    return
            else
                os.remove(pid_file_path)
            end
        end
        pid_file:close()
    end

    local pid1 = posix.fork()
    local pid2 = -1

    if pid1 > 0 then
        posix.wait(pid1)
    elseif pid1 == 0 then
        pid2 = posix.fork()
        if pid2 > 0 then
            local f = io.open(pid_file_path, "w")
            f:write(pid2)
            f:close()
            posix._exit(0)
        elseif pid2 == 0 then
            posix.execp("luajit",lj_task, ...)
        else
            turbo.log.error("Forking process failed:" .. lj_task)
            posix._exit(1)
        end
    else
        turbo.log.error("Forking process failed:" .. lj_task)
        posix._exit(1)
    end    

end

utils.table_equals = function(o1, o2, ignore_meta)
    if o1 == o2 then return true end
    local o1Type = type(o1)
    local o2Type = type(o2)
    if o1Type ~= o2Type then return false end
    if o1Type ~= 'table' then return false end

    if not ignore_mt then
        local mt1 = getmetatable(o1)
        if mt1 and mt1.__eq then
            --compare using built in method
            return o1 == o2
        end
    end

    local keySet = {}

    for key1, value1 in pairs(o1) do
        local value2 = o2[key1]
        if value2 == nil or equals(value1, value2, ignore_mt) == false then
            return false
        end
        keySet[key1] = true
    end

    for key2, _ in pairs(o2) do
        if not keySet[key2] then return false end
    end
    return true
end

-- helper function for converting ipv6 addresses from ipmi, takes in cdata array of ipv6 bytes, writes to abbreviated string
utils.ipv6_ntop = function(address_n)
    -- convert from UINT8 to hex string with colon delimiters
    local address_p = string.format("%02x%02x", tonumber(address_n[0]), tonumber(address_n[1]))
    for i=2,14,2 do
        address_p = address_p .. string.format(":%02x%02x", tonumber(address_n[i]), tonumber(address_n[i+1]))
    end
    -- remove leading zeros within groups
    address_p = address_p:gsub("0000", "0")
    address_p = address_p:gsub("^0+([^:]+):", "%1:")
    address_p = address_p:gsub(":0+([^:]+)", ":%1")
    -- combine sequential zero groups, takes some tricks since Lua doesnt support repeated sub-patterns
    while string.find(address_p, ":0:") do
        address_p = address_p:gsub(":0:", "::")
    end
    -- mark the largest set of sequential zeros
    address_p = address_p:gsub(":::+", "XX", 1)
    -- put the zeros back into other groups, there can be only one zero abbreviation or ipv6 is invalid
    address_p = address_p:gsub("::", ":0:")
    -- replace the mark we made with double colon (abbreviated zeros)
    address_p = address_p:gsub("XX", "::")
    address_p = address_p:gsub("^0::", "::")
    address_p = address_p:gsub("::0$", "::")
    -- return string
    return address_p
end

utils.ipv4_ntop = function(address_n)
    return string.format("%u.%u.%u.%u", bit.band(address_n[0], 0xFF), bit.band(address_n[1], 0xFF), bit.band(address_n[2], 0xFF), bit.band(address_n[3], 0xFF))
end

-- with_timezone can be boolean in which case, the used timezone is of systems
-- it can also be a number in which case, it must be timezone difference in seconds

utils.iso8601_time = function(unix_timestamp, with_timezone)
    if with_timezone then
        local tz = type(with_timezone) == "number" and with_timezone or utils.timezone()
        return os.date('%Y-%m-%dT%H:%M:%S') .. utils.tz_offset(tz)
    else
        return os.date('%Y-%m-%dT%H:%M:%SZ')        
    end
end

utils.timezone = function()
    local now = os.time()
    return os.difftime(now, os.time(os.date("!*t", now)))
end

utils.tz_offset = function(timezone)
    local h,m = math.modf(timezone/3600)
    return string.format("%+.2d:%.2d", h, math.abs(m*60))
end

-- computes the difference of two small arrays, probably inefficient for large arrays
-- returns two arrays, elements in first array but not the second, and elements in second array but not the first

utils.small_difference = function(first, second)
    -- make a deep copy of the arrays, we don't want to modify original
    local only_first = _.to_array(first)
    local only_second = _.to_array(second) 
    -- remove elements found in both arrays, leaving elements unique to each
    only_first = _.reject(only_first, _.curry(_.include, second))
    only_second = _.reject(only_second,  _.curry(_.include, first))
    -- return both results
    return only_first, only_second
end

utils.iso8601_time_to_unix = function(time_str)
    local year, month, day, hour, min, sec = time_str:match("(%d+)-(%d+)-(%d+)T(%d+):(%d+):(%d+)%.?%d*Z")
    if not year then
        local year, month, day, hour, min, sec, tz_hour, tz_min = time_str:match("(%d+)-(%d+)-(%d+)T(%d+):(%d+):(%d+)%.?%d*-(%d+):(%d+)")

        if not year then
            local year, month, day, hour, min, sec, tz_hour, tz_min = time_str:match("(%d+)-(%d+)-(%d+)T(%d+):(%d+):(%d+)%.?%d*+(%d+):(%d+)")

            if not year then
                return nil
            end

            return os.time({day=day,month=month,year=year,hour=hour,min=min,sec=sec}) - ((tz_hour * 60 * 60) + (tz_min * 60))
        else
            return os.time({day=day,month=month,year=year,hour=hour,min=min,sec=sec}) + ((tz_hour * 60 * 60) + (tz_min * 60))
        end
    else
        return os.time({day=day,month=month,year=year,hour=hour,min=min,sec=sec})
    end
end

utils.get_bits = function(orig, startBit, endBit)
    local temp = orig
    local mask = 0
    
    for i = startBit, endBit, -1 do
        local shifted = bit.blshift(1, i)
        mask = bit.bor(mask, shifted)
    end

    return bit.band(temp, mask)
end

utils.bool = function(string)
    return string == "true" and true or false
end

utils.array_merge = function(a, b)
    for k,v in pairs(b) do 
        table.insert(a, v)
    end
end

utils.split = function(self, sep, max, pattern)
    assert(sep ~= '', "Separator is not a string or a empty string.")
    assert(max == nil or max >= 1, "Max is 0 or a negative number.")
    local record = {}
    if self:len() > 0 then
        local plain = not pattern
        max = max or -1
        local field=1 start=1
        local first, last = self:find(sep, start, plain)
        while first and max ~= 0 do
            record[field] = self:sub(start, first-1)
            field = field+1
            start = last+1
            first, last = self:find(sep, start, plain)
            max = max-1
        end
        record[field] = self:sub(start)
    end
    return record
end

utils.update_lastmodified = function(db, scope, timestamp, depth)
    if timestamp == nil then
        timestamp = os.time()
    end
    local tscope = utils.split(scope, ":")
    local limit = #tscope - (depth or #tscope)
    while #tscope > limit do
        db:set(table.concat(tscope, ":") .. ":LastModified", timestamp)
        table.remove(tscope)
    end
end

utils.recursive_table_merge = function(t1, t2)
    for k,v in pairs(t2) do
        if type(v) == "table" then
            if type(t1[k] or false) == "table" then
                utils.recursive_table_merge(t1[k] or {}, t2[k] or {})
            else
                t1[k] = v
            end
        else
            t1[k] = v
        end
    end
    
    return t1
end

utils.extend_notify_map = function(map, mod)
    for k, v in pairs(mod) do
        if map[k] ~= nil then
            utils.array_merge(map[k], v)
        else
            map[k] = v
        end
    end

    return map
end

--Converts something like 0:key1 val1, 0:key2 val2, 1:key1 val3, 1:key2 val4
--to [{'key1': 'val1', 'key2': val2}, {'key1': 'val3', 'key2': val4}]
utils.convertHashListToArray = function(hash_list)
    local ary= {}
    local ary2= {}

    for key, val in pairs(hash_list) do
        if not string.find(key, ":") then
            return {}
        end

        local key_set = utils.split(key, ":")
        local ind = tonumber(key_set[1])

        if not ary[ind] then ary[ind] = {} end

        if tonumber(val) ~= nil then val = tonumber(val) end

        if val == "true" then val = true end

        if val == "false" then val = false end

        if key_set[3] == nil then
            ary[ind][key_set[2]] = val
        else
            ary[ind][key_set[2]] = {}
            ary[ind][key_set[2]][key_set[3]] = val
        end
    end

    for key, val in pairs(ary) do
        table.insert(ary2, val)
    end

    return ary2
end

-- util to print array output from utils.convertHashListToArray()
utils.printHashArray = function(hash_array, name)

    print(name .. ":")
    if type(hash_array) == 'table' then
        print("[")
        for i,v in pairs(hash_array) do
            if type(v) == 'table' then
                print("    "..i..": {")
                for j,l in pairs(v) do
                    print("    ", j, l)
                end
                print("    }")
            else
                print(i, v)
            end
        end
        print("]")
    else
        print(hash_array)
    end

end

-- This utility will stringify an error object and publish it to the redfish service
-- Parameters:
-- db - database object used to publish to redis
-- error_table - object containing details of the error message e.g. registry, id, message args, etc.; the structure of this object left up to the user
-- key - redfish key to use for publish; this function assumes its publishing to a channel set up by RedfishHandler:doPatch() and appends ":ERROR" to the key
utils.send_redfish_error = function(db, error_table, key)
    local error_json = JSON:encode(error_table)
    local error_channel = key .. ":ERROR"
    db:publish(error_channel, error_json)
end

utils.indexOf = function (list, value, start)
  if not list then return 0 end
  start = start or 1

  for index = start, #list, 1 do
    if value == list[index] then
      return index
    end
  end

  return 0
end
utils.sub_process_nonblocking = function(lj_task, ...)
    if not posix_present then return end

    local pid1 = posix.fork()
    local pid2 = -1

    if pid1 > 0 then
        posix.wait(pid1)
    elseif pid1 == 0 then
        pid2 = posix.fork()
        if pid2 > 0 then
            posix._exit(0)
        elseif pid2 == 0 then
            posix.execp("luajit",lj_task, ...)
        else
            turbo.log.error("Forking process failed:" .. lj_task)
            posix._exit(1)
        end
    else
        turbo.log.error("Forking process failed:" .. lj_task)
        posix._exit(1)
    end    

end

utils.base64_decode = function(data)
    local chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    data = string.gsub(data, '[^' .. chars .. '=]', '')
    return (data:gsub('.', function(x)
        if (x == '=') then
            return ''
        end

        local result = ''
        local offset = chars:find(x) - 1
        for i = 6, 1, -1 do 
            result = result .. (offset % 2^i - offset % 2^(i-1) > 0 and '1' or '0') 
        end

        return result;
    end):gsub('%d%d%d?%d?%d?%d?%d?%d?', function(x)
        if(#x ~= 8) then
            return ''
        end
        local char = 0
        for i = 1, 8 do 
            char = char + (x:sub(i, i) == '1' and 2^(8 - i) or 0)
        end
        return string.char(char)
    end))
end

utils.getODataID = function(redis_key, strip)
    if strip == nil then
        strip = 0
    end

    local key_ary = redis_key and utils.split(redis_key, ":") or {}
    return "/redfish/v1/" .. table.concat(key_ary, "/", 2, #key_ary - strip)
end

utils.add_event_entry = function(db, log_service_prefix, reg_name, msg_id, msg_args, entry_type, entry_code, origin, sensor_type, sensor_num, event_id, event_type)
    local success
    success, reg = pcall(dofile, "/usr/local/redfish/message_registries/" .. reg_name .. ".lua")
    if not success then
        print("In add_event_entry(): Message Registry: '" .. reg_name .. "' not found!")
        return nil
    end

    if not db then
        print("In add_event_entry(): Invalid database")
        return nil
    end

    local msg_template = reg.Messages[msg_id]

    if type(msg_args) == "string" then
        msg_args = utils.split(msg_args, ",")
    elseif type(msg_args) == "number" then
        msg_args = {msg_args}
    end

    local msg_args_count = msg_args and #msg_args or 0
    if msg_args_count ~= msg_template.NumberOfArgs then
        print("In add_event_entry(): Wrong number of MessageArgs provided")
    end

    for i=1,msg_template.NumberOfArgs do
        if type(msg_args[i]) ~= msg_template.ParamTypes[i] then
            print("In add_event_entry(): MessageArg #"..i..
                            " - Expected '"..msg_template.ParamTypes[i]..
                            "', but found '"..type(msg_args[i]).."'")
        end
    end

    local replacer = function(arg) 
                        local i = tonumber(arg:sub(2))
                        return msg_args and msg_args[i] or whole 
                     end

    local message = string.gsub(msg_template.Message, "(%%%d+)", replacer)

    local reg_id = reg.Id:match("(.-%.%d+%.%d+)")

    local enabled = db:get(log_service_prefix .. ":ServiceEnabled")
    local health = db:hget(log_service_prefix .. ":Status", "Health")
    if enabled ~= "true" or health ~= "OK" then
        return
    end

    local prefix = log_service_prefix .. ":Entries:"

    local index = db:zcard(prefix.."SortedIDs") or 0

    local max_records = db:get(log_service_prefix .. ":MaxNumberOfRecords")

    if index == nil or max_records == nil then
        return
    end
    
    -- Checking if the maximum number of records has been exceeded
    if index >= tonumber(max_records) then
        local overwrite = db:get(log_service_prefix .. ":OverWritePolicy")
        -- Only handles new log entries if the overwrite policy is WrapsWhenFull
        if overwrite == "WrapsWhenFull" then
            -- Getting index of most recent entry and incrementing to find index for current entry
            index = tonumber(db:zrange(prefix.."SortedIDs", index - 1, index - 1, "WITHSCORES")[2]) + 1

            -- Finding oldest entry and deleting entry from set
            local oldest_key = db:zrange(prefix.."SortedIDs", 0, 0)[1]
            db:zrem(prefix.."SortedIDs", oldest_key)

            -- Deleting oldest entry data from database
            local entry_keys = db:keys(oldest_key .. ":*")
            if entry_keys then
                db:del(entry_keys)
            end
        else
            return
        end
    else
        index = index + 1
    end

    local event_data = {}
    local log_data = {}
    local mset_prefix = prefix .. tostring(index) .. ":"

    if entry_type ~= nil then
        table.insert(event_data, "EntryType")
        table.insert(event_data, entry_type)
        table.insert(log_data, mset_prefix .. "EntryType")
        table.insert(log_data, entry_type)
    end

    if entry_code ~= nil then
        table.insert(event_data, "EntryCode")
        table.insert(event_data, entry_code)
        table.insert(log_data, mset_prefix .. "EntryCode")
        table.insert(log_data, entry_code)
    end

    if sensor_type ~= nil then
        table.insert(event_data, "SensorType")
        table.insert(event_data, sensor_type)
        table.insert(log_data, mset_prefix .. "SensorType")
        table.insert(log_data, sensor_type)
    end

    if sensor_num ~= nil then
        table.insert(event_data, "SensorNumber")
        table.insert(event_data, sensor_num)
        table.insert(log_data, mset_prefix .. "SensorNumber")
        table.insert(log_data, sensor_num)
    end

    if origin ~= nil then
        table.insert(event_data, "OriginOfCondition")
        table.insert(event_data, origin)
        table.insert(log_data, mset_prefix .. "OriginOfCondition")
        table.insert(log_data, origin)
    end

    if event_id ~= nil then
        table.insert(event_data, "EventId")
        table.insert(event_data, event_id)
    end

    if event_type ~= nil then
        table.insert(event_data, "EventType")
        table.insert(event_data, event_type)
    end

    db:zadd(prefix .. "SortedIDs", index, prefix .. tostring(index))
    db:hmset(prefix .. tostring(index),
        "Name", "Log entry " .. tostring(index),
        "Severity", msg_template.Severity,
        "Created", utils.iso8601_time(os.time(), true),
        "EventTimestamp", utils.iso8601_time(os.time(), true),
        "Message", message,
        "MessageId", reg_id .. "." .. msg_id,
        unpack(event_data)
    )

    db:expire(prefix .. tostring(index), 30)
    
    local mset_prefix = prefix .. tostring(index) .. ":"
    db:mset(mset_prefix .. "Name", "Log entry " .. tostring(index),
        mset_prefix .. "Severity", msg_template.Severity,
        mset_prefix .. "Created", utils.iso8601_time(os.time(), true),
        mset_prefix .. "Message", message,
        mset_prefix .. "MessageId", reg_id .. "." .. msg_id,
        unpack(log_data)
    )
    if msg_args ~= nil then
        db:sadd(mset_prefix .. "MessageArgs", unpack(msg_args))
    end
end

utils.PadZeros = function(final_length, str)
	local i;
	for i=#str, final_length-1 do
		 str = "0" .. str
    end
    
	return  str
end

return utils
