package.path = package.path .. ";./oem/ami/?.lua;./oem/ami/?;./?.lua;./?;./libs/?.lua;./libs/?;"
local ConfigHandler = require("config-handler")
local BiosHandler = require("bios-handler")
local AccountServiceConfigHandler = require("accountservice-config-handler")
local FactoryResetHandler = require("factory-reset")
local CONFIG = require("config")

local route = {
-- Format is {URL, Handler}
	{CONFIG.SERVICE_PREFIX .. "/configurations$", ConfigHandler},
	{CONFIG.SERVICE_PREFIX .. "/Systems/([^/]+)/Memory/([^/]+)/Actions/AmiBios.ChangeState$", BiosHandler},
	{CONFIG.SERVICE_PREFIX .. "/Chassis/([^/]+)/PCIeDevices/([^/]+)/Actions/AmiBios.ChangeState$", BiosHandler},
   	{CONFIG.SERVICE_PREFIX .. "/AccountService/Configurations$", AccountServiceConfigHandler},
	{CONFIG.SERVICE_PREFIX .. "/Managers/Self/Actions/Manager.FactoryReset$", FactoryResetHandler}
}

return route
