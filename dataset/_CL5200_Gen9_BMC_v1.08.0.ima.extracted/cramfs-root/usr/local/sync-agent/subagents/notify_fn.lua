package.path = package.path .. ";./libs/?.lua;./libs/?;./libnetwork/?.lua;./libnetwork/?;"

--local sync = require("ipmi-sync-helpers")

local map = require("notify_fn_map")

local utils = require("utils")


local path = arg[1]
local file_name = arg[2]

for _i, callback in pairs(map[path]) do 
    if type(callback) == "function" then
        callback(file_name)
    elseif type(callback) == "string" then
        if file_name then
            utils.sub_process(callback, file_name)
        else
            utils.sub_process(callback)
        end
    end
end