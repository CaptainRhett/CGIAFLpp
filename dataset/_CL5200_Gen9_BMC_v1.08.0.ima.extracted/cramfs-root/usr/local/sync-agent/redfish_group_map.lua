local utils = require("utils")

local map = {}
local temp_map = {}

-- Getting all the redfish_group_map entries from all the extensions
local extension_modules = utils.get_modules("extensions", "redfish_group_map")

-- Putting the extension maps together
for _i, mod in pairs(extension_modules) do
    for _mod_map_i, entry in pairs(mod) do
        if entry.extend == true then
            if temp_map[entry.group_name] == nil then
                temp_map[entry.group_name] = entry.sync_fns
            else
                utils.array_merge(temp_map[entry.group_name], entry.sync_fns)
            end
        else
            temp_map[entry.group_name] = entry.sync_fns
        end
    end
end

-- Getting all the redfish_group_map entries from all the OEMs
local oem_modules = utils.get_modules("oem", "redfish_group_map")

-- Adding the OEM enties and overrriding any existing entries
for _i, mod in pairs(oem_modules) do
    for _mod_map_i, entry in pairs(mod) do
        if entry.extend == true then
            if temp_map[entry.group_name] == nil then
                temp_map[entry.group_name] = entry.sync_fns
            else
                utils.array_merge(temp_map[entry.group_name], entry.sync_fns)
            end
        else
            temp_map[entry.group_name] = entry.sync_fns
        end
    end
end

-- Putting the result map in the correct format
for group, fns in pairs(temp_map) do
    local entry_map = {}
    entry_map["group_name"] = group
    entry_map["sync_fns"] = fns

    table.insert(map, entry_map)
end

return map