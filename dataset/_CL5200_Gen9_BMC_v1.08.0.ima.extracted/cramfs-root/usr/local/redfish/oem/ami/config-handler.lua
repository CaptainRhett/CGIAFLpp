local RedfishHandler = require("redfish-handler")
local CONSTANTS = require("constants")
local turbo = require("turbo")
local utils = require("utils")
local _ = require("underscore")

local ConfigHandler = class("ConfigHandler", RedfishHandler)

local yield = coroutine.yield

function ConfigHandler:get()
	local response = {}
	self:get_configs(response)
	
	self:set_response(response)

	self:output()
end

function ConfigHandler:get_configs(response)
    local decoded_path_file = io.open(CONSTANTS.CA_URL_CONFIG_PATH, "r") or io.open(CONSTANTS.CA_URL_DECODED_PATH, "r")
    local ca_path = ""

    if decoded_path_file then
        ca_path = decoded_path_file:read("*all")
        decoded_path_file:close()
    else
        local ca_path_file = io.open(CONSTANTS.CA_URL_PATH, "r")

        if ca_path_file ~= nil then
            local ca_path_contents = ca_path_file:read("*all")
            ca_path_file:close()
            local byte_index = 1
            local byte = ca_path_contents:sub(1, 2)
            while byte ~= "" and byte ~= "00" do
                ca_path = ca_path .. string.char(tonumber(byte, 16))
                byte_index = byte_index + 2
                byte = ca_path_contents:sub(byte_index, byte_index + 1)
            end
        end
    end

    if ca_path ~= "" then
        response["CertificateAuthorityUrl"] = ca_path
    end
    -- DaisyX add blow two line for Properties display incomplete on redfish QXCR1001602215 20171031 
	self.response_table["Id"] = "E40F4400"
	self.response_table["Name"] = "LegoWave2"

    self:set_allow_header("GET, PATCH")
    self:set_context("configurations/$entity")
    self:set_type(CONSTANTS.CONFIGURATIONS_TYPE)
end


-- ### PATCH request handler for OEM
function ConfigHandler:patch()
    local request_data = turbo.escape.json_decode(self:get_request().body)

    if self:can_user_do("ConfigureComponents") == true then
        local ca_path_set = false
    	if request_data.CertificateAuthorityUrl ~= nil then
    		os.remove(CONSTANTS.CA_ETAG_PATH)
    		local ca_path_file = io.open(CONSTANTS.CA_URL_CONFIG_PATH, "w")
    		ca_path_file:write(request_data.CertificateAuthorityUrl)
    		ca_path_file:close()

            ca_path_file = io.open(CONSTANTS.CA_URL_DECODED_PATH, "w")
            ca_path_file:write(request_data.CertificateAuthorityUrl)
            ca_path_file:close()

    		request_data.CertificateAuthorityUrl = nil
            ca_path_set = true
    	end

    	local leftover_fields = utils.table_len(request_data)
		if leftover_fields ~= 0 then
			local keys = _.keys(request_data)
			self:error_property_unknown(turbo.util.join(",", keys))
		end

		--self:set_status(204)
        local response = {}
        self:get_configs(response)

        if ca_path_set then
            response["CertificateAuthorityUrl@Message.ExtendedInfo"] = self:create_message("AmiOem.1.0.0", "WebServerRestarting")
        end
        self:set_response(response)

        self:output()

	else
		self:error_insufficient_privilege()
	end
end

return ConfigHandler