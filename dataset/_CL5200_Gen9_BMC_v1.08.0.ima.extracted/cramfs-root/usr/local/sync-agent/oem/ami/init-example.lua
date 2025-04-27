local example_oem_init = {}

-- The PreHook is passed the redis database instance for any operations is needs to do
example_oem_init.PreHook = function(db)
    -- Do OEM PreHook operations
end

-- The Initialize is passed the redis database instance for any operations is needs to do
example_oem_init.Initialize = function(db)
    example_oem_init.PreHook(db)
    -- The OEM PreHook function is called by the default PreHook function, so no need to call it here

    local replies = db:pipeline(function(pl)
        -- When possible, use a pipeline to handle a series of database operations
        -- pl:set("Redfish:Managers:" .. env.ManagerSelf .. ":EthernetInterfaces:1:Description", "Management Ethernet Interface")
    end)

    -- There is a global libipmi object that needs to be used for libipmi calls instead of creating a new one.
    -- On success, all libipmi calls will return a success value as the first value and then the data requested will be returned following that
    local ret, if_state, lan_count = libipmi.network:getIFACEState()
    
    example_oem_init.PostHook()
end

-- The PostHook is passed the redis database instance for any operations is needs to do
example_oem_init.PostHook = function(db)
    -- Do OEM posthook operations
end

return example_oem_init