package.path = package.path .. ";./extensions/ipmi/?.lua;./libs/?.lua;./libs/?;"

local utils = require('utils')
local notify = require("subagents.notify")
local posix = require("posix")
utils.daemon("/var/run/sync-agent.pid")

local extension_agents = {}

-- Getting all agents from extensions
local extension_modules = utils.get_modules("extensions", "agent")
utils.array_merge(extension_agents, extension_modules)

local oem_modules = utils.get_modules("oem", "agent")
utils.array_merge(extension_agents, oem_modules)

while true do
    notify()

    for _i, agent in pairs(extension_agents) do
        agent()
    end
    os.execute("sleep 0.1")
end