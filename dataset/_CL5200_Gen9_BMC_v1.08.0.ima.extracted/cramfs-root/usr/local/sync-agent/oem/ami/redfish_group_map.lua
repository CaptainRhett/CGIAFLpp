package.path = package.path .. ";oem/ami/?;oem/ami/?.lua"

local sync = require("redfish2ipmi.SEL")

local Env = require("environment")

-- When the group is SET, the corresponding sync functions will be triggered with one argument: the changed group name as lua string
local redfish_map = {

	--BSW0229097- {group_name="PATCH_SEL_Timezone", sync_fns={sync.patchSELTimezone}}
	{group_name="PATCH_SEL_Timezone", sync_fns={sync.patchSELTimezone}},		--BSW0229097+
	{group_name="PATCH_AuditLog_Timezone", sync_fns={sync.patchSELTimezone}},	--BSW0229097+
	{group_name="PATCH_EventLog_Timezone", sync_fns={sync.patchSELTimezone}}	--BSW0229097+
}

return redfish_map
