-- Redis DB is going to notify each key change as separate update, so we define an intermediate map
-- which will associate a set of keys to a group (similar to that of the C structure). This group will be
-- pushed to a redis set on any key change under the group. Since it is redis set, the group will be inserted
-- only once even for multiple key change under the same group. Finally the redish_group_map will have the map between
-- the group and the ipmi functions. The group set is processed in a separate coroutine which will trigger
-- the corresponding libipmi function that handles all the data (keys) for a group.

local Env = require("environment")

-- When the redis_key is SET, this group will be inserted to the db
-- Redis key here can have regular expressions
local redfish_intermediate_map = {
--judy add 20171115 for eip372251 Unable to modify DateTime via Redfish+[
	--{redis_key="PATCH:Redfish:Managers:" .. Env.ManagerSelf .. ":LogServices:SEL:DateTime*", group_name="PATCH_SEL_Timezone"}
	--BSW0229097- {redis_key="PATCH:Redfish:Managers:" .. Env.ManagerSelf .. ":LogServices:SEL:DateTimeLocalOffset", group_name="PATCH_SEL_Timezone"}
	{redis_key="PATCH:Redfish:Managers:" .. Env.ManagerSelf .. ":LogServices:SEL:DateTimeLocalOffset", group_name="PATCH_SEL_Timezone"},			--BSW0229097+
	{redis_key="PATCH:Redfish:Managers:" .. Env.ManagerSelf .. ":LogServices:AuditLog:DateTimeLocalOffset", group_name="PATCH_AuditLog_Timezone"}, 	--BSW0229097+
	{redis_key="PATCH:Redfish:Managers:" .. Env.ManagerSelf .. ":LogServices:EventLog:DateTimeLocalOffset", group_name="PATCH_EventLog_Timezone"} 	--BSW0229097+
}

return redfish_intermediate_map
