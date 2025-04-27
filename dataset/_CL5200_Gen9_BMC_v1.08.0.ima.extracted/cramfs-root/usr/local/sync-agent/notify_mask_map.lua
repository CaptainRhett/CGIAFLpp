local posix = require("posix")
local _ = require("underscore")
local utils = require("utils")
local inotify = require('inotify')

os.execute( "touch /tmp/reload-notify")

local map = {}
map['/tmp/reload-notify'] = {inotify.IN_MODIFY}

-- Getting notify_map entries from all the extensions
local extension_modules = utils.get_modules("extensions", "notify_mask_map")
for _i, mod in pairs(extension_modules) do
    _.extend(map, mod)
end

local extension_extend_modules = utils.get_modules("extensions", "notify_mask_extend_map")
for _i, mod in pairs(extension_extend_modules) do
    utils.extend_notify_map(map, mod)
end

-- Getting notify_map entries from all the OEMs
local oem_modules = utils.get_modules("oem", "notify_mask_map")
for _i, mod in pairs(oem_modules) do
    _.extend(map, mod)
end

local oem_extend_modules = utils.get_modules("oem", "notify_mask_extend_map")
for _i, mod in pairs(oem_extend_modules) do
    utils.extend_notify_map(map, mod)
end

return map