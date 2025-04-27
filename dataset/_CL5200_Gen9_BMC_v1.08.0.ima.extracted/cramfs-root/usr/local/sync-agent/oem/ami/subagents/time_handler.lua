package.path = package.path .. ";./libs/?;./libs/?.lua;"

local redis = require('redis')
local CONFIG = require('config')
local utils = require('utils')

-- Connecting to Redis Database
local params = {
    scheme = 'unix',
    path = CONFIG.redis_sock,
    timeout = 0
}
local db = redis.connect(params)

local cur_time = arg[1]
db:set("Redfish:Manager:Self:DateTime", utils.iso8601_time(tonumber(cur_time)))