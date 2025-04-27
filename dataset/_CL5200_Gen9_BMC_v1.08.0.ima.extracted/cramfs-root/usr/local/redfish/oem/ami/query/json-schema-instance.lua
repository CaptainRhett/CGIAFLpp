local posix = require("posix")
local CONFIG = require("config")
local JSON = require("turbo.3rdparty.JSON")

local yield = coroutine.yield    

local json_instance = function(rf_self)
    local url_segments = rf_self:get_url_segments()
    local collection, id = url_segments[1], url_segments[2]

    local result = {}

    if string.find(id, ".json$") then
        local schema_file = io.open("./oem/ami/schemas/" .. id)
        if schema_file then
            result = JSON:decode(schema_file:read("*all"))
            schema_file:close()
	    local odata_type = id:gsub('%.json', '') .. "." .. id:gsub('%.([^/]+)', '')
	    		local odata_context = id:gsub('%.([^/]+).json', '') .. "." .. id:gsub('%.([^/]+)', '')
	    		result["@odata.type"] = "#" .. odata_type
			result["@odata.context"] = "/redfish/v1/$metadata#" .. odata_context
        else
            rf_self:error_resource_missing_at_uri()
            return
        end
    else
        result["Id"] = id
        result["Name"] = id .. " schema"
        result["Description"] = id .. " schema"
        result["Languages"] = {"en"}
--        result["Schema"] = id .. "." .. id:match("(.-)%.")
	if id:match("(.-)%.") == nil then 
			result["Schema"] = id .. "." .. id
		else
        result["Schema"] = id .. "." .. id:match("(.-)%.")
		end
        result["Location"] = {
            [1] = {
                ["Language"] = "en",         
                ["Uri"] = "/redfish/v1/JsonSchemas/" .. id .. ".json",
            }
        }

    end

    return result
end

return json_instance