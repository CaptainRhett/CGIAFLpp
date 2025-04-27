local system_init = {}

-- The PreHook is passed the redis database instance for any operations is needs to do
system_init.PreHook = function(db)
    -- Do OEM PreHook operations
end

-- The Initialize is passed the redis database instance for any operations is needs to do
system_init.Initialize = function(db)
    system_init.PreHook(db)

    -- When possible, use a pipeline to handle a series of database operations
    local replies = db:pipeline(function(pl)
        -- There is a global libipmi object that needs to be used for libipmi calls instead of creating a new one.
        -- On success, all libipmi calls will return a success value as the first value and then the data requested will be returned following that
--Daisy add it for EIP 368756 QXCR1001601262 GET missing Systems instance succeed in URL Systems/missing_id below 1 line 20171117
--[[
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
]]--
--Daisy add it for EIP 368756 QXCR1001601262 GET missing Systems instance succeed in URL Systems/missing_id before 1 line 20171117
    end)
    
    system_init.PostHook()
end

-- The PostHook is passed the redis database instance for any operations is needs to do
system_init.PostHook = function(db)
    -- Do OEM posthook operations
end

return system_init