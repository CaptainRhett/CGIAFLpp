local CONFIG = require("config")
local extension = function(self)
	local url_segments = self:get_url_segments();
	
	local collection, instance, secondary_collection, id = 
		url_segments[1], url_segments[2], url_segments[3], url_segments[4];
	
	self:add_oem_action({
		["#AmiBios.ChangeState"] = {
			target = CONFIG.SERVICE_PREFIX.."/"..collection.."/"..instance.."/"..secondary_collection.."/"..id.."/Actions/AmiBios.ChangeState",
			["State@Redfish.AllowableValues"] = {"Enabled","Disabled"}
		}
	})
end
return extension