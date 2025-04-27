package.path = package.path .. ";oem/ami/?;oem/ami/?.lua"

local IPMI = require("ipmi_commands")

--When the IPMI function is called, the sync function will be triggered with one argument, the changed value as lua string
local ipmi_map = {
	[IPMI.NETFN.NETFN_STORAGE] = {
        [IPMI.STORAGE_CMD.CMD_SET_SEL_TIME] = {"oem.ami.ipmi2redfish.storage#get_SEL_Timezone"}
    }
}

return ipmi_map