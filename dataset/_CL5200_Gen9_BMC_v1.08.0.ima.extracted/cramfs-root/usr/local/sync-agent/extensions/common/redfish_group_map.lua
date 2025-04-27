package.path = package.path .. ";./extensions/common/?.lua;./libs/?;./libs/?.lua;"


local sync = require("sync-helpers")

-- When the group is SET, the corresponding sync functions will be triggered with one argument: the changed group name as lua string
local redfish_map = {

	{group_name="SessionExpire", sync_fns={sync.session_expire}}
}

return redfish_map
