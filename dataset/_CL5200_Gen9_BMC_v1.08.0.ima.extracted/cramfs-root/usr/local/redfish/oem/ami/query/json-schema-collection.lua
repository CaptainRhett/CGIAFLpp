local posix = require("posix")
local CONFIG = require("config")

local yield = coroutine.yield    

local json_collection = function(rf_self)
    local result = {}
    local members = {}
    local files, errstr, errno = posix.dir("./oem/ami/schemas")

    if files then
        for fi, fn in ipairs(files) do
            if fn ~= "." and fn ~= ".." then
                local entry = {}
                entry["@odata.id"] = CONFIG.SERVICE_PREFIX .. "/JsonSchemas/" .. fn:sub(1, -6)
                table.insert(members, entry)
            end
        end
    end

    if #members > 0 then
        result = {
            ["Members"] = members,
            ["Members@odata.count"] = #members
        }
    end

    return result
end

return json_collection