package.path = package.path .. ";./oem/ami/?.lua;./oem/ami/?;./libs/?.lua;./libs/?;"

local sync_time = require("subagents.sync_time")

local agent = coroutine.wrap(function()
    while true do
        sync_time()

        coroutine.yield()
    end
end)

return agent