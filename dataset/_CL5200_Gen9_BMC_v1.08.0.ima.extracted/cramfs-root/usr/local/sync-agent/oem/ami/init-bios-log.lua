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

local oem_bios_log_init = {}

-- The PreHook is passed the redis database instance for any operations is needs to do
oem_bios_log_init.PreHook = function(db)
    -- Do OEM PreHook operations

    -- By having a nonzero return value, the default network initialization PreHook() function is skipped
    return 1
end

-- The Initialize is passed the redis database instance for any operations is needs to do
oem_bios_log_init.Initialize = function(db)
    -- The OEM PreHook function is called by the default PreHook function, so no need to call it here

    local replies = db:pipeline(function(pl)
        -- When possible, use a pipeline to handle a series of database operations
        -- pl:set("Redfish:Managers:" .. env.ManagerSelf .. ":EthernetInterfaces:1:Description", "Management Ethernet Interface")
    end)

    -- There is a global libipmi object that needs to be used for libipmi calls instead of creating a new one.
    -- On success, all libipmi calls will return a success value as the first value and then the data requested will be returned following that
    local ret, if_state, lan_count = libipmi.network:getIFACEState()

    -- To call a C function from the FFI library that was loaded above, you use the variable you loaded the library into and just call the function as you normally would
    params.GetLanOEMParamValue(196)
    
    -- The OEM PostHook function is called by the default PostHook function, so no need to call it here

    -- By returning zero, the default network Initialize() function is run after this function
    return 0
end

-- The PostHook is passed the redis database instance for any operations is needs to do
oem_bios_log_init.PostHook = function(db)
    -- Do OEM posthook operations

    -- By having a nonzero return value, the default network initialization PostHook() function is skipped
    return 1
end

return oem_bios_log_init