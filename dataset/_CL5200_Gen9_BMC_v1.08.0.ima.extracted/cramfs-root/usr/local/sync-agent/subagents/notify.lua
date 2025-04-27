package.path = package.path .. ";./extensions/ipmi/?.lua;./libs/?.lua;./libs/?;"

local inotify = require('inotify')
local utils = require('utils')

local handle = inotify.init({["blocking"] = false})
local wd_map = {}
local prev_wd_map = {}

local function unload_watches()
    prev_wd_map = {}
    for wd, file in pairs(wd_map) do
        prev_wd_map[wd] = file
        local success, err = handle:rmwatch(wd)
        if success == nil then
            print("remove watch failed: ", file, err)
        end
    end
    wd_map = {}
end

local function load_watches()
    local notify_mask_map = require("notify_mask_map")
    for file, data in pairs(notify_mask_map) do
        local wd = handle:addwatch(file, unpack(data))
        if wd ~= nil then
            wd_map[wd] = file
        else
            print("watch fail", file)
        end
    end
end

load_watches()

local notify = coroutine.wrap(function()
    while true do
        local events = handle:read()
        local reload_map = false

        for _, ev in pairs(events) do
            -- The IN_IGNORED event is generated when a watch is deleted, so it should to be ignored
            if ev.wd ~= nil and (wd_map[ev.wd] ~= nil or prev_wd_map[ev.wd] ~= nil) and ev.mask ~= inotify.IN_IGNORED then
                ev_filename = wd_map[ev.wd] or prev_wd_map[ev.wd]

                if ev_filename == "/tmp/reload-notify" then
                    reload_map = true
                else
                    local name = ev.name
                    if name then
                        utils.sub_process("subagents/notify_fn.lua", ev_filename, name)
                    else
                        utils.sub_process("subagents/notify_fn.lua", ev_filename)
                    end
                end
            end
        end

        if reload_map == true then
            unload_watches()
            load_watches()
        end

        coroutine.yield()
    end
end)

return notify