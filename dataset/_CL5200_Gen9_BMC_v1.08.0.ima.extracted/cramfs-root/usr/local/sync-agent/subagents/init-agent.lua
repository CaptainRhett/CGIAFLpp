package.path = package.path .. ";./libs/?;./libs/?.lua;"

local utils = require("utils")

-- Finds and requires all "init-agent.lua" files in the extensions directories, causing them all to be executed
utils.get_modules("extensions", "init-agent")

-- Finds and requires all "init-agent.lua" files in the OEM directories, causing them all to be executed
utils.get_modules("oem", "init-agent")