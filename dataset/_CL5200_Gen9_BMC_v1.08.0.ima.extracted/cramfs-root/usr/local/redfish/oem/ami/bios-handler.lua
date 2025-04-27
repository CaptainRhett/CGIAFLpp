local turbo = require("turbo")
local RedfishHandler = require("redfish-handler")
local OEM_CONSTANTS = require("constants")
local CONFIG = require("config")
local utils = require("utils")
local _ = require("underscore")
local BiosHandler = class("BiosHandler", RedfishHandler)
local yield = coroutine.yield
-- ### POST request handler for OEM
function BiosHandler:post()
    local response = {}
    local url_segments = self:get_url_segments();
    if self:can_user_do("ConfigureComponents") == true then
		local collection, id, secondary_collection, instance   = url_segments[1], url_segments[2], url_segments[3], url_segments[4]
		local prefix = "Redfish:" .. collection .. ":" .. id .. ":" .. secondary_collection .. ":" .. instance
		local request_data = turbo.escape.json_decode(self:get_request().body)
	    	local redis = self:get_db()
		local pl = redis:pipeline()
		local status = yield(redis:get(prefix .. ":Status:State"))
        
		if secondary_collection == "Memory" then
			local memory_present = yield(redis:hget("SMBIOS:MemoryDevice", "MemSize:Size:" .. instance))
			if memory_present ~= nil then
			   local memsize = math.floor(tonumber(memory_present))
				if ( memsize ~= 0 and status ~= "Absent" ) or ( memsize == 0 and status ~= "Absent" ) then
					-- TODO: need to validate incoming ID and Instance for injection attacks
					if request_data.State == "Enabled" or request_data.State == "Disabled" then
						
					-- Setting offset to database key that will trigger sync functions
						pl:set("PATCH:Redfish:Systems:"..id..":Memory:"..instance..":State", request_data.State)
						
						-- Calling function that will cause the response to be delayed until the sync operation is finished
						local patch_errors, timedout_keys, result = self:doPATCH({"Redfish:Systems:"..id..":Memory:"..instance..":Status:State"}, pl, CONFIG.PATCH_TIMEOUT)
							self:set_status(204);
					else
						self:error_property_value_not_in_list("State",request_data.State, nil)
					end
				else
						self:error_not_acceptable(response)
				end
			else
				--Throwing error if user is not authorized
				error(turbo.web.HTTPError:new(403))
			end
		elseif secondary_collection == "PCIeDevices" then
			if request_data.State == "Enabled" or request_data.State == "Disabled" then
						
				-- Setting offset to database key that will trigger sync functions
				pl:set("PATCH:Redfish:Chassis:"..id..":PCIeDevices:"..instance..":State", request_data.State)
						
				-- Calling function that will cause the response to be delayed until the sync operation is finished
				local patch_errors, timedout_keys, result = self:doPATCH({"Redfish:Chassis:"..id..":PCIeDevices:"..instance..":Status:State"}, pl, CONFIG.PATCH_TIMEOUT)
					self:set_status(204);
			else
				self:error_property_value_not_in_list("State",request_data.State, nil)
			end
		end
	end
end
return BiosHandler
