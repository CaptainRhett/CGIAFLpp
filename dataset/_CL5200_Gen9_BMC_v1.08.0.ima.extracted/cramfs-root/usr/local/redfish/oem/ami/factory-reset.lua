local RedfishHandler = require("redfish-handler")
local CONSTANTS = require("constants")
local turbo = require("turbo")
local utils = require("utils")
local _ = require("underscore")
local CONFIG = require("config")

local FactoryResetHandler = class("FactoryResetHandler", RedfishHandler)

local yield = coroutine.yield

function FactoryResetHandler:get(id)    
    if id == "/redfish/v1/Managers/Self/Actions/Manager.FactoryReset" then
        -- When an HTTP method is rejected with status code 405, we must set an Allow header that lists valid HTTP methods for the URI
        self:set_header("Allow", "POST")
        -- Normal instance shouldn't be PATCHed directly, use settings object
        self:error_method_not_allowed()
    else
        self:error_resource_missing_at_uri()
    end
end

function FactoryResetHandler:put(id)
    if id == "/redfish/v1/Managers/Self/Actions/Manager.FactoryReset" then
        -- When an HTTP method is rejected with status code 405, we must set an Allow header that lists valid HTTP methods for the URI
        self:set_header("Allow", "POST")
        -- Normal instance shouldn't be PATCHed directly, use settings object
        self:error_method_not_allowed()
    else
        self:error_resource_missing_at_uri()
    end
end

function FactoryResetHandler:patch(id)
    if id == "/redfish/v1/Managers/Self/Actions/Manager.FactoryReset" then
        -- When an HTTP method is rejected with status code 405, we must set an Allow header that lists valid HTTP methods for the URI
        self:set_header("Allow", "POST")
        -- Normal instance shouldn't be PATCHed directly, use settings object
        self:error_method_not_allowed()
    else
        self:error_resource_missing_at_uri()
    end
end

function FactoryResetHandler:post(id)
    local request_data = self:get_json()

    if id == "/redfish/v1/Managers/Self/Actions/Manager.FactoryReset" then
        -- Verifying all the necessary fields are in the request
        if request_data["FactoryResetType"] then
            if request_data["FactoryResetType"] == "ResetAll" then
                local redis = self:get_db()

                yield(redis:flushall())
                yield(redis:set("Redfish:Managers:Self:ClearIPMILogs", "0"))
                os.execute("./db_init/redis-init.sh")
                os.execute("echo 3 > /tmp/redfish-start")

                self:set_status(204)
            else
                self:error_action_parameter_unknown("FactoryResetType", request_data["FactoryResetType"])
            end
        else
            self:error_action_parameter_missing("FactoryResetType")
        end
    elseif self:get_request().path:find("Actions") then
        self:error_action_not_supported()
    else 
        self:error_resource_missing_at_uri()
    end

end

return FactoryResetHandler