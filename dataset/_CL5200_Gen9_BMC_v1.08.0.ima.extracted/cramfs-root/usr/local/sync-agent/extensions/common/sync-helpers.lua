package.path = package.path .. ";./libs/?;./libs/?.lua;../redfish/libs/?.lua;"
local redis = require('redis')
local CONFIG = require('config')

local params = {
    scheme = 'unix',
    path = CONFIG.redis_sock,
    -- host = CONFIG.redis_host,
    -- port = CONFIG.redis_port,
    timeout = 0
}

local db = redis.connect(params)

local sync_helpers = {}

sync_helpers.session_expire = function(groupname)
    db:set("Redfish:SessionService:Sessions:LastModified", os.time())
end

return sync_helpers