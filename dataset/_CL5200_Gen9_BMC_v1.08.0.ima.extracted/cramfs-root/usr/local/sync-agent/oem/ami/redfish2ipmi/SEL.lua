local JSON = require("turbo.3rdparty.JSON")

local redis = require('redis')

local posix = require('posix')

local CONFIG = require("config")

local ENV = require("environment")

local utils = require("utils")
local WARNING = utils.WARNING

local _ = require 'underscore'

local params = {
    scheme = 'unix',
    path = CONFIG.redis_sock,
    timeout = 0
}

local db = redis.connect(params)

-- ### Sync helper module for Redfish Managers/LogServices/SEL POST and PATCH operations
local man_prefix = "PATCH:Redfish:Managers:".. ENV.ManagerSelf

local SEL = {}

-- Sync a Managers/LogServices/SEL PATCH to SEL config
SEL.patchSELTimezone = function(group_name)
    local caller = "patchSEL()"
	local utc_offset_str --BSW0229097+
    if group_name == "PATCH_SEL_Timezone" then

        -- Get offset from redis
        --BSW0229097- local utc_offset_str = db:get(man_prefix..":LogServices:SEL:DateTimeLocalOffset")
		print("patching SELTimeZone") --BSW0229097+[
		utc_offset_str = db:get(man_prefix..":LogServices:SEL:DateTimeLocalOffset") 
	elseif group_name == "PATCH_AuditLog_Timezone" then
		print("patching AuditLogimeZone")
		utc_offset_str = db:get(man_prefix..":LogServices:AuditLog:DateTimeLocalOffset") 
	elseif group_name == "PATCH_EventLog_Timezone" then
		print("patching EventLogimeZone") 
		utc_offset_str = db:get(man_prefix..":LogServices:EventLog:DateTimeLocalOffset")	
	else
		return -1
	end		--BSW0229097+]
        -- Update SEL UTC Offset
        if utc_offset_str then
            -- Formatting offset from database into format IPMI expects
            local utc_sign = utc_offset_str:sub(1, 1) == "+" and 1 or -1
            local utc_hr = tonumber(utc_offset_str:sub(2, 3))
            local utc_mn = tonumber(utc_offset_str:sub(5, 6))
            local utc_offset = utc_sign * (utc_hr * 60 + utc_mn)

            local wRet = libipmi.SEL:setSELtimeoffset(utc_offset)
            print('setSELtimeoffset', wRet)
            if wRet ~= 0 then
                WARNING("SEL:setSELtimeoffset()", caller, wRet)
                return wRet
            end
        end

        return 0
--[[BSW0229097-    else
        return -1
    end	--BSW0229097--]]

end

return SEL