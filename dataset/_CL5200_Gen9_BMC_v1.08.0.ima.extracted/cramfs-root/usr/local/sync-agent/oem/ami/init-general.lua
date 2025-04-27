local env = require('environment')

-- To call C functions, the FFI library must first be used
local ffi = require("ffi")
-- With the FFI library loaded, a cdef of the function declaration is done
ffi.cdef[[
INT8U GetLanOEMParamValue (INT8U ParamSelect);       
]]
-- The library also needs to be loaded in using FFI.
-- If the library file is not found in /usr/local/lib, then you will need to use the path to the library
-- If the name contains no dot, the extension .so is appended. Also, the lib prefix is prepended if necessary.
-- For example, the below statement will actually load /usr/local/lib/libipmiparams.so
local params = ffi.load("ipmiparams")

local oem_general_init = {}

-- The PreHook is passed the redis database instance for any operations is needs to do
oem_general_init.PreHook = function(db)
    -- Do OEM PreHook operations

    -- By having a nonzero return value, the default network initialization PreHook() function is skipped
    return 1
end

-- The Initialize is passed the redis database instance for any operations is needs to do
oem_general_init.Initialize = function(db)
    -- The OEM PreHook function is called by the default PreHook function, so no need to call it here

    -- When possible, use a pipeline to handle a series of database operations
  --Daisy add it for EIP 368756 QXCR1001601262 GET missing Systems instance succeed in URL Systems/missing_id below 1 line 20171117
    --[[
    local replies = db:pipeline(function(pl)
        -- There is a global libipmi object that needs to be used for libipmi calls instead of creating a new one.
        -- On success, all libipmi calls will return a success value as the first value and then the data requested will be returned following that
--Daisy add it for EIP 368756 QXCR1001601262 GET missing Systems instance succeed in URL Systems/missing_id below 2 line 20171117	
	print("Initializing oem module...")			
	-- FRU information write into redis DB only if required
        local ret, fru = libipmi.fru:get_FRUInfo()
        if fru and fru.System then
            for i = 1, fru.System.TotalFRUs do
                pl:set("Redfish:Systems:" .. i .. ":AssetTag", fru.System.AssetTag[i])
                pl:set("Redfish:Systems:" .. i .. ":Manufacturer", fru.System.Manufacturer[i])
                pl:set("Redfish:Systems:" .. i .. ":Model", fru.System.Model[i])
                pl:set("Redfish:Systems:" .. i .. ":SerialNumber", fru.System.SerialNumber[i])
                pl:set("Redfish:Systems:" .. i .. ":PartNumber", fru.System.PartNumber[i])
            end
        end
    
        -- Here is an example of using the functions from the external library that was loaded above
        params.GetLanOEMParamValue(196)
    end)
 --Daisy add it for EIP 368756 QXCR1001601262 GET missing Systems instance succeed in URL Systems/missing_id below 1 line 20171117   
    ]]--
    -- The OEM PostHook function is called by the default PostHook function, so no need to call it here

    -- By returning zero, the default network Initialize() function is run after this function
    return 0
end

-- The PostHook is passed the redis database instance for any operations is needs to do
oem_general_init.PostHook = function(db)
    -- Do OEM posthook operations

    -- By having a nonzero return value, the default network initialization PostHook() function is skipped
    return 1
end

return oem_general_init