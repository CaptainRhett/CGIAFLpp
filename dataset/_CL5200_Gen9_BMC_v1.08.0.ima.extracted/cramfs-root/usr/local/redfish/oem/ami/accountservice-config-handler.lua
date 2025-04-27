local RedfishHandler = require("redfish-handler")
local CONSTANTS = require("constants")
local turbo = require("turbo")
local utils = require("utils")
local _ = require("underscore")
local CONFIG = require("config")

local AccountServiceConfigHandler = class("AccountServiceConfigHandler", RedfishHandler)

local yield = coroutine.yield

local PAM_MODULES = {  
                        ["IPMI"] = 1,
                        ["LDAP"] = 2,
                        ["ACTIVE DIRECTORY"] = 3,
                        ["RADIUS"] = 4
                    }

function AccountServiceConfigHandler:get()
    local response = {}
    self:get_configs(response)
    
    self:set_response(response)

    self:output()
end

function AccountServiceConfigHandler:get_configs(response)
    local db = self:get_db()
    local pl = db:pipeline()

    pl:get("Redfish:AccountService:PAMEnabled")
    pl:lrange("Redfish:AccountService:PAMOrder", 0, 3)
    local db_result = yield(pl:run())

    local enabled, order = unpack(db_result)

    response["Id"] = "Configurations"
    response["Name"] = "AccountService Configurations"
    response["PAMEnabled"] = enabled == "true"
    if #order > 0 then
        response["PAMOrder"] = order
    end

    self:set_allow_header("GET, PATCH")
    self:set_context("Configurations/$entity")
    self:set_type(CONSTANTS.ACCOUNT_SERVICE_CONFIGURATIONS_TYPE)
end


-- ### PATCH request handler for OEM
function AccountServiceConfigHandler:patch()
    local request_data = turbo.escape.json_decode(self:get_request().body)

    if self:can_user_do("ConfigureComponents") == true then
        local db = self:get_db()
        local pam_order_set = false
		local pam_order = {}

        if request_data.PAMEnabled ~= nil then
            if type(request_data.PAMEnabled) ~= "boolean" then
                self:error_property_value_type("PAMEnabled", tostring(request_data.PAMEnabled))
            else
                yield(db:set("Redfish:AccountService:PAMEnabled", tostring(request_data.PAMEnabled)))
                request_data.PAMEnabled = nil
            end
        end

        if request_data.PAMOrder ~= nil then
            if type(request_data.PAMOrder) ~= "table" then
                self:error_property_value_type("PAMOrder", tostring(request_data.PAMOrder))
            elseif #request_data.PAMOrder ~= #_.keys(PAM_MODULES) then
                self:error_property_value_not_in_list("PAMOrder", _.join(request_data.PAMOrder, ", "))
            else
                for _i, entry in pairs(request_data.PAMOrder) do
                    if PAM_MODULES[entry] == nil then
                        self:error_property_value_not_in_list(entry, "PAMOrder")
                    end
                end
            end
            
            local cur_order = yield(db:lrange("Redfish:AccountService:PAMOrder", 0, 3))
            if not _.is_equal(cur_order, request_data.PAMOrder) then
                yield(db:lpush("PATCH:Redfish:AccountService:PAMOrder", unpack(_.reverse(request_data.PAMOrder))))
                pam_order_set = true
            end
            pam_order = request_data.PAMOrder 
            request_data.PAMOrder = nil
        end

        local leftover_fields = utils.table_len(request_data)
        if leftover_fields ~= 0 then
            local keys = _.keys(request_data)
            self:error_property_unknown(turbo.util.join(",", keys))
        end

        local response = {}
        self:get_configs(response)
        if pam_order_set then
            response["PAMOrder@Message.ExtendedInfo"] = self:create_message("AmiOem.1.0.0", "WebServerRestarting")
            response["PAMOrder"] = pam_order
        end

        self:set_response(response)
        self:output()

    else
        self:error_insufficient_privilege()
    end
end

return AccountServiceConfigHandler