local redis = require('redis')
local CONFIG = require('config')
local ENV = require('environment')
local libipmi = require("libipmi")


local params = {
    scheme = 'unix',
    path = CONFIG.redis_sock,
    timeout = 0
}

local db = redis.connect(params)

local man_prefix = "Redfish:Managers:".. ENV.ManagerSelf

local storage = {}

-- Function will be called when the key that is mapped to the 'example' group is set
storage.get_SEL_Timezone = function()
    print("OEM storage.get_SEL_Timezone")
    local caller = "storage.get_SEL_DateTime()"
    
    -- When possible, use a pipeline to handle a series of database operations
    local ret = db:pipeline(function(pl)
        local wRet, datetime_offset = libipmi.SEL:getSELtimeoffset()
        if wRet ~= 0 then
            WARNING("SEL:getSELtimeoffset()", caller, wRet)
            return wRet
        end

        -- Performing operations on offset from IPMI to format it into what Redfish expects
        local off_hour = math.floor(math.abs(datetime_offset) / 60)
        local off_min = math.abs(datetime_offset) % 60
        local off_sign = datetime_offset < 0 and "-" or "+"
        local off_string = string.format("%s%02d:%02d", off_sign, tonumber(off_hour), tonumber(off_min))
        
        -- Setting the offset to the proper database locations
        pl:set(man_prefix .. ":DateTimeLocalOffset", off_string)
        pl:set(man_prefix .. ":LogServices:SEL:DateTimeLocalOffset", off_string)
    end)
end

return storage