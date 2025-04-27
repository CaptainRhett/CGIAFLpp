package.path = package.path .. ";./libs/?.lua;./libs/?;./libnetwork/?.lua;./libnetwork/?;"

local utils = require("utils")
local _ = require("underscore")
local map = require("redfish_group_map")

if next(map) == nil then
    print("Empty group map. Exiting...")
    os.exit()
end

local arg_i = 1

while arg[arg_i] do
    local value = arg[arg_i]
    local grp_segments = utils.split(value, ':')
    local group_name = grp_segments[1]
    local group_args = _.slice(grp_segments, 2, #grp_segments-1)

    local filtered_map = _.select(map, function(item) 
        -- Check if the incoming redis key is matching any registered item in the redfish map
        return string.find(group_name, "^" .. item.group_name .. "$")
    end)
    
    -- invoke all matching item's function
    for lind, litem in ipairs(filtered_map) do
        for fn_index, fn_ptr in ipairs(litem.sync_fns) do
            local result = fn_ptr(unpack(grp_segments))
            --litem.libipmi_context[litem.libipmi_fn](litem.libipmi_context, value)
        end
    end

    arg_i = arg_i + 1
end