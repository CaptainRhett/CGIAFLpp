local CONFIG = require("config")

local factory_reset_type_allowable_vals = {"ResetAll"}
local extension = function(self)
    local url_segments = self:get_url_segments();
    
    local collection, instance, secondary_collection, id = 
        url_segments[1], url_segments[2], url_segments[3], url_segments[4];
    
    self:add_oem_action({
        ["#Manager.FactoryReset"] = {
            target = "/redfish/v1/Managers/Self/Actions/Manager.FactoryReset",
            ["FactoryResetType@Redfish.AllowableValues"] = factory_reset_type_allowable_vals
        }
    })
end

return extension