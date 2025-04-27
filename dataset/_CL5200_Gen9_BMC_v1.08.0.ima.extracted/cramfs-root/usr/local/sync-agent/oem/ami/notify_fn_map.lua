package.path = package.path .. ";oem/ami/?;oem/ami/?.lua"

local sync = require("ipmi2redfish.storage")

local map = {}

map['/var/run/ntpd.pid'] = {sync.get_SEL_Timezone}

return map