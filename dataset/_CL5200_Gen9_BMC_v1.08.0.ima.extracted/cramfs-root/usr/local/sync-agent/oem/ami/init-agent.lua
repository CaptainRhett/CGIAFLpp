package.path = package.path .. ";./oem/ami/?;./oem/ami/?.lua"

local redis = require('redis')
local CONFIG = require("config")
local utils = require("utils")
local example = require("init-example")
local system = require("init-system")

-- Creating database instance that will be passed to Initialize functions
local params = {
    scheme = 'unix',
    path = CONFIG.redis_sock,
    timeout = 0
}
local db = redis.connect(params)
local success, msg

print("Initializing System...")
success, msg = pcall(system.Initialize, db)
if not success then
    print("Init system Failure: " .. msg)
end

print("Initializing Example...")
success, msg = pcall(example.Initialize, db)
if not success then
    print("Init Example Failure: " .. msg)
end
