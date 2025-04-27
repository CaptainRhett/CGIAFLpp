Lua_table_ami = {
    ["@Redfish.Copyright"] = "Copyright AMI 2016",
    ["@odata.type"] = "#MessageRegistry.1.0.0.MessageRegistry",
    ["Id"] = "AmiOem.1.0.0",
    ["Name"] = "AmiOem Message Registry",
    ["Language"] = "en",
    ["Description"] = "This registry defines messages for representing AmiOem errors in Redfish",
    ["RegistryPrefix"] = "AmiOem",
    ["RegistryVersion"] = "1.0.0",
    ["OwningEntity"] = "AMI",
    ["Messages"] = {
        ["WebServerRestarting"] = {
            ["Description"] = "Indicates that the web server is restarting, so it will be unreachable for a few seconds.",
            ["Message"] = "Web server is being restarted. It will be unreachable for a few seconds.",
            ["Severity"] = "OK",
            ["NumberOfArgs"] = 0,
            ["Resolution"] = "Wait a few seconds before sending additional requests."
        }
    }
}

return Lua_table_ami