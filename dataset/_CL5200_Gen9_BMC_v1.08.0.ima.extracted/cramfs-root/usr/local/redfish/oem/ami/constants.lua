local CONFIG = require("config")
local constants = {}
constants.SCHEMA_URIS = {}

-- Defining constants to be used as the @odata.type field in responses
constants.CONFIGURATIONS_TYPE = "Configurations.v1_0_0.Configurations"
constants.ACCOUNT_SERVICE_CONFIGURATIONS_TYPE = "AccountServiceConfigurations.v1_0_0.Configurations"

-- Defining URI that points to the schema for the corresponding type listed above
constants.SCHEMA_URIS[constants.CONFIGURATIONS_TYPE] = "<" .. CONFIG.SERVICE_PREFIX .. "/JsonSchemas/Configurations.v1_0_0.json>"
constants.SCHEMA_URIS[constants.ACCOUNT_SERVICE_CONFIGURATIONS_TYPE] = "<" .. CONFIG.SERVICE_PREFIX .. "/JsonSchemas/AccountServiceConfigurations.v1_0_0.json>"

constants.CA_ETAG_PATH = "/conf/redfish/ca_etag"
constants.CA_URL_PATH = "/conf/redfish/ca_url"
constants.CA_URL_DECODED_PATH = "/conf/redfish/ca_url_decoded"
constants.CA_URL_CONFIG_PATH = "/conf/redfish/ca_url_config"

return constants