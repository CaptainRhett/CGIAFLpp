#!/usr/bin/luajit
package.path = package.path .. '../?;../?.lua;../../?;../libs/?.lua;../cdefs/?.lua'

local utils = require 'utils'

local ffi = require("ffi")
local C = ffi.C
ffi.cdef[[
    int printf(const char *fmt, ...);
]]
require("cdefs.libnetwork_ffi")

DEFAULT_TIMEOUT = 5
SUCCESS = 0


print("LibNetwork.lua : Initializing LibNetwork..")
local libnetwork = require("nwcfg_const")
print("LibNetwork.lua : nwcfg.h constants loaded..")
local c_libnet = ffi.load("network")
print("LibNetwork.lua : Shared library loaded..")

c_libnet.InitIfcNameTable()
print("LibNetwork.lua : Interface name table initialized..")
c_libnet.GetNwCfgInfo()
print("LibNetwork.lua : Network Config data initialized..")

libnetwork.printNWCFG6 = function (nwcfg6_struct_c)

	print(string.format("enable: %d", nwcfg6_struct_c.enable))
	print(string.format("CfgMethod: %d", nwcfg6_struct_c.CfgMethod))
	print(string.format("IFName: %s", ffi.string(nwcfg6_struct_c.IFName)))

	print(string.format("MAC: %02X:%02X:%02X:%02X:%02X:%02X", nwcfg6_struct_c.MAC[0], nwcfg6_struct_c.MAC[1], nwcfg6_struct_c.MAC[2], nwcfg6_struct_c.MAC[3], nwcfg6_struct_c.MAC[4], nwcfg6_struct_c.MAC[5]))
	print(string.format("Gateway: %s", utils.ipv6_ntop(nwcfg6_struct_c.Gateway)))

	print(string.format("LinkIPAddr: %s", utils.ipv6_ntop(nwcfg6_struct_c.LinkIPAddr)))
	print(string.format("LinkPrefix: %d", nwcfg6_struct_c.LinkPrefix))
	
	print(string.format("SiteIPAddr: %s", utils.ipv6_ntop(nwcfg6_struct_c.SiteIPAddr)))
	print(string.format("SitePrefix: %d", nwcfg6_struct_c.SitePrefix))

	print("GlobalIPAddr: \n\t{")
	for i=0,libnetwork.MAX_IPV6ADDRS-1 do
		print(string.format("\t\t%s", utils.ipv6_ntop(nwcfg6_struct_c.GlobalIPAddr[i])))
	end
	print("\t}")

	print("GlobalPrefix: \n\t{")
	for i=0,libnetwork.MAX_IPV6ADDRS-1 do
		print(string.format("\t\t%d", nwcfg6_struct_c.GlobalPrefix[i]))
	end
	print("\t}")
	

end

libnetwork.printNwCfg4 = function (nwcfg_struct_c)
	print("Not yet implemented! sorry.")
end

libnetwork.GetEthIndexByInterfaceName = function (ifc_name)

	local ifc_table = ffi.new("IfcName_T["..libnetwork.MAX_CHANNEL.."]")

	local wRet = libnetwork.GetIfcNameTable(ifc_table)
	if wRet ~= SUCCESS then
		print("Error while getting libnetwork.GetIfcNameTable(): ", tostring(wRet))
		return wRet
	end

	for i=0,libnetwork.MAX_CHANNEL-1 do
		if ffi.string(ifc_table[i].Ifcname) == ifc_name then
			return tonumber(ifc_table[i].Index)
		end
	end

	return -1
end

libnetwork.ipv4_pton = function (ipv4_string)
	if type(ipv4_string) == "string" then

		local address_n = ffi.new("unsigned char[4]")
		local wRet = C.inet_pton(libnetwork.AF_INET, ipv4_string, address_n)

		if wRet == -1 then
			wRet = ffi.errno()
			print("Error while converting IPv4 address string to numeric: ERRNO - ".. tostring(wRet))
			return wRet
		elseif wRet == 0 then
			print("Invalid IPv4 address string passed to libnetwork.ipv4_pton()")
			return wRet
		end

		return address_n
	end
end

libnetwork.ipv6_pton = function (ipv6_string)
	if type(ipv6_string) == "string" then

		local address_n = ffi.new("unsigned char[16]")
		local wRet = C.inet_pton(libnetwork.AF_INET6, ipv6_string, address_n) or -1

		if wRet == -1 then
			wRet = ffi.errno()
			print("Error while converting IPv6 address string to numeric: ERRNO - ".. tostring(wRet))
			return wRet
		elseif wRet == 0 then
			print("Invalid IPv6 address string passed to libnetwork.ipv6_pton()")
			return wRet
		end

		return address_n
	else
		print("Non-string argument passed to libnetwork.ipv6_pton()")
	end
end

-- return libnetwork with constants/functions in the same namespace
setmetatable(libnetwork, { __index = c_libnet })

print("LibNetwork.lua : LibNetwork is ready..")
return libnetwork
