package.path = package.path .. ";./libs/?.lua;./libs/?;./libnetwork/?.lua;./libnetwork/?;"

local utils = require('utils')

local JSON = require("turbo.3rdparty.JSON")

local redis = require('redis')

local CONFIG = require("config")

local posix = require("posix")

local _ = require('underscore')



utils.daemon("/var/run/redfishgroup2fns.pid")

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

local ch_prefix = '__keyspace@'.. redis_db_index ..'__:'

local channels = {ch_prefix .. 'Redfish:PendingOperations'}

local changes = client:pubsub({psubscribe = channels})

-- Primary coroutine that listens on the channel and performs the function triggers for registered keys change events
local sync_redfish_to_fns = coroutine.wrap(function()

	while true do
		-- The changes is a coroutine wrap which when called, resumes automatically
		local msg, abort = changes()

		-- ignore the psubscribe notification that you get as soon as you subscribe
		if msg and msg.kind ~= "psubscribe" and msg.payload == "sadd" then 
			-- can be a string or table

		    local redis_key = string.sub(msg.channel, string.len(ch_prefix)+1)
		    -- Skip unwanted key patterns
		    -- all sensor updates can be ignored
		    -- If the changed redis_key is valid
		    if redis_key == 'Redfish:PendingOperations' then
		    	-- This delay is to prevent multiple processes being launched when the same group name is added to the set multiple times
		    	os.execute("sleep 0.1")
		    	local pending_ops = db:smembers(redis_key)
	            db:del(redis_key)

	            utils.sub_process_nonblocking("subagents/groupfns_handler.lua", unpack(pending_ops))
		    	
		    end

	    end
	    coroutine.yield()
	end
end)

while true do

	sync_redfish_to_fns()

end