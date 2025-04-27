-- Provides all the compiler macros defined in nwcfg.h

return {
	
	INET_ADDRSTRLEN = 16,

	--[[ External dependencies ]]
	PROC_NET_ROUTE_FILE =	"/proc/net/route",
	PROC_NET_ARP_FILE =	"/proc/net/arp",

	--[[ ipv6 ]]
	PROC_NET_IPV6ROUTE_FILE = "/proc/net/ipv6_route",
	DHCPD_PID_FILE =		"/var/run/udhcpc.eth0.pid",
	DHCP6C_PID_FILE =		"/var/run/dhcp6c.pid",

	DHCPD_CONFIG_FILE =   "/conf/dhcpc-config",
	DHCPD_CONFIG_FILE_TEMP =      "/var/dhcp-config.tmp",
	RESOLV_CONF_FILE =    "/conf/resolv.conf",
	RESOLV_CONF_DISABLED_FILE =    "/conf/resolv_disabled.conf",
	RESOLV_CONF_FILE_TEMP =    "/var/resolv.conf.tmp",
	DNS_CONFIG_FILE =   "/conf/dns.conf",
	DNS_CONFIG_FILE_TEMP =      "/var/dns.conf.tmp",
	IFUP_BIN_PATH =       "/sbin/ifup",
	IFDOWN_BIN_PATH =     "/sbin/ifdown",
	ZERO_IP =         "0.0.0.0",
	DEFAULT_GW_STR =      "0.0.0.0",
	--[[ /etc/network/interfaces file defines ]]
	NETWORK_IF_FILE =		"/etc/network/interfaces",
	NETWORK_IF_FILE_TMP =         "/conf/interfaces.tmp",
	NETWORK_DNS_TMP =             "/conf/dns.tmp",
	NETWORK_IP_SRC_FILE =	"/conf/ipaddrsource",
	AUTO_LOCAL_STR =		"auto lo\n",
	AUTO_LOCAL_LOOPBACK_STR =	"iface lo inet loopback\n",
	IF_STATIC_IP_STR =	"address",
	IF_STATIC_MASK_STR =	"netmask",
	IF_STATIC_BCAST_STR =	"broadcast",
	IF_STATIC_GW_STR =	"gateway",
	IF_STATIC_MTU_STRING = "mtu",
	DEFAULT_GW_FLAGS =	0x0003,
	DEV_FILE =	"/proc/net/dev",

	VLAN_ID_SETTING_STR = "vlanid",
	VLAN_INTF_NAME =       "interface_name",
	VLAN_INTERFACES_FILE =    "/conf/vlaninterfaces",
	VLAN_PRIORITY_SETTING_STR =     "vlanpriority",
	VLAN_INDEX_STR =       "index",
	VLANSETTING_CONF_FILE = "/conf/vlansetting.conf",

	VLAN_NETWORK_DECONFIG_FILE =    "/etc/init.d/vlannetworking stop",
	VLAN_NETWORK_CONFIG_FILE =    "/etc/init.d/vlannetworking start",
	VLAN_ONLY_IFDOWN =    "/etc/init.d/vlannetworking downvlan",
	VLAN_PROC_SYS_RAC_NCSI_ENABLE_LAN =    "echo 1 > /proc/sys/ractrends/ncsi/Enable",

	VLAN_NETWORK_IP_CONFIGFILE =    "/etc/init.d/vlannetworking enableip",
	IF_STATIC_ADDR_STR = "up ip addr add",
	IF_STATIC_ROUTER_ADDR_STR = "up ip route add",

	--[[Bond]]
	BONDING_CONF_FILE =   "/conf/bond.conf",
	BONDING_SYSTEM_FILE = "/sys/class/net",
	PROC_NET_BONDING =    "/proc/net/bonding/bond0",
	IFACE_ENABLED =     0x01,
	IFACE_DISABLED =      0x00,
	BOND_ROUND_ROBIN =    0x00,
	BOND_ACTIVE_BACKUP =  0x01,
	MAX_BOND_MODE =           0x06,
	MAX_BOND =                0x03,
	ETH_IFACE_TYPE =      0x01,
	BOND_IFACE_TYPE =     0x02,
	BOND_MAX_SLAVE =      8,

	MAX_CHANNEL =    0x04,
	MAX_ETH =   5,
	MAC_ADDR_SECTION = "Permanent HW addr",
	SLAVE_INTF_SECTION = "Slave Interface",
	DMON_CONFIG_FILE =        "/conf/dhcpmonitor.conf",
	VLANCONFIG_FILE =         "/conf/vlansetting.conf",
	VLANCONFIG_DEF_FILE =     "/etc/defconfig/vlansetting.conf",

	IPV4_PROTO =      0x1,
	IPV6_PROTO =      0x2,

	--[[ IPv6 ]]
	KERNEL_IPV6_FILE = "/proc/net/if_inet6",

	MAX_MAC_LEN = 	64,
	MAC_ADDR_LEN =	6,
	IP_ADDR_LEN =	4,
	IP6_ADDR_LEN =	16,
	IP6_PREFIX_MAXLEN =	16,
	MAX_STR_LENGTH = 	128,
	ROUTE_GW_LENGTH = 100,

	MAX_IPV6ADDRS =  16,
	DOMAIN_DHCP_LEN =  7,
	LOOPBACK_ADDR_LEN = 9,
	STR1_LEN = 1,
	STR2_LEN = 2,
	STR3_LEN = 3,
	STR4_LEN = 4,
	STR5_LEN = 5,

	--[[ DNS ]]
	MAX_HOST_NAME_STRING_SIZE =       128,
	MAX_DOMAIN_NAME_STRING_SIZE =     256,
	HOSTNAME_SETTING_MANUAL =			0,
	HOSTNAME_SETTING_AUTO =			1,
	ONELINE_LEN =                     300,
	DNS_SERVERIP_LEN =                26,

	REG_BMC_ENABLE =                  0x01,	-- 0th bit enable of BMC register
	REG_BMC_TSIG =                    0x02,	-- 1st bit enable of BMC register
	REG_BMC_FQDN =                    0x10,	-- DHCP Option 81
	REG_BMC_HOSTNAME =                0x20,	-- DHCP Option 12
	REG_BMC_OPTION =                  0x30,	-- Register BMC by Nsupdate, DHCP or Hostname
	REG_BMC_MDNS =					0x04,	-- 3rd bit enable of MDNS


	REG_BMC_RESERVED =                0xCE,	-- Binary value 1100 1110
	REG_BMC_RESERVED_TSIG =           0xFD,	-- Binary value 1111 1101
	REG_BMC_RESERVED_MDNS =			0xFB,    -- Binary value 1111 1011

	--[[ TSIG Configuration ]]
	CONF_LOCATION =				"/conf/",
	TEMP_LOCATION =				"/tmp/",
	TSIG_PRIVATE_FILE =			"tsig.private",
	CONF_TSIG_PRIVATE_FILE =		"/conf/tsig.private",
	TEMP_TSIG_PRIVATE_FILE =		"/tmp/tsig.private",
	MAX_TSIG_PRIVKEY_SIZE =		(8 * 1024),
	TSIG_ALG_TYPE_HMAC_MD5 =		"Algorithm: 157 (HMAC_MD5)\n",

	--[[ Type of network configuration ]]
	CFGMETHOD_STATIC =    1,
	CFGMETHOD_DHCP =      2,
	CFGMETHOD_BIOS =      3,
	CFGMETHOD_OTHER =     4,

	NWCFGTYPE_STATIC =        0x1,
	NWCFGTYPE_DHCP =          0x2,
	NWCFGTYPE_DHCPFIRST =     0x4,

	--[[Interface enable state]]
	NW_INTERFACE_ENABLE =     0x1,
	NW_INTERFACE_DISABLE =    0x2,
	NW_INTERFACE_UNKNOWN =    0x3,

	NW_AUTO_NEG_ON =  0x1,
	NW_AUTO_NEG_OFF = 0x2,

	NW_DUPLEX_FULL = 0x1,
	NW_DUPLEX_HALF = 0x2,

	--[[
	 * ETHSET FLAG: See nwSetNWExtEthCfg API
	 ]]
	NWEXT_ETHCFG_LAMAC =      0x1,
	NWEXT_ETHCFG_BURNEDMAC =  0x2,
	NWEXT_ETHCFG_SPEED =      0x4,
	NWEXT_ETHCFG_DUPLEX =     0x8,
	NWEXT_ETHCFG_AUTONEG =    0x10,
	NWEXT_ETHCFG_MTU =        0x20,
	NWEXT_ETHCFG_WOL =        0x40,
	NWEXT_ETHCFG_ALL = 		  0x7F,

	--[[
	 * NWSET FLAG: See nwSetNWExtIPCfg API
	 ]]
	NWEXT_IPCFG_INTFSTATE =   0x1,
	NWEXT_IPCFG_CFGMETHOD =   0x2,
	NWEXT_IPCFG_IP =          0x4,
	NWEXT_IPCFG_MASK =        0x8,
	NWEXT_IPCFG_GW =          0x10,
	NWEXT_IPCFG_FBIP =        0x20,
	NWEXT_IPCFG_FBMASK =      0x40,
	NWEXT_IPCFG_FBGW =        0x80,
	NWEXT_IPCFG_ALL = 		  0xFF,

	MAX_RESTART_SERVICE =     4,

	MAX_SERVICE =    5,

	--[[ Enable or disable Auto-Negotiation ]]
	AUTONEG_DISABLE =		0x00,
	AUTONEG_ENABLE =		0x01,

	--[[ Network Link modes ]]
	PHY_SPEED_10 =		10,
	PHY_SPEED_100 =		100,
	PHY_SPEED_1000 =		1000,

	PHY_DUPLEX_HALF =	0x0,
	PHY_DUPLEX_FULL =	0x1,

	PHY_SPEED_AN_MASK =	0x8000,    --[[Auto-Negotiation Mask for Speed]]
	PHY_DUPLEX_AN_MASK =	0x4000,    --[[Auto-Negotiation Mask for Duplex]]


	--[[ MII registers for PHY ]]
	MII_BMCR =            0x00,        --[[ Basic mode control register ]]
	MII_BMSR =            0x01,        --[[ Basic mode status register  ]]
	MII_PHY_ID1 =         0x02,        --[[ PHY identifier 1            ]]
	MII_PHY_ID2 =         0x03,        --[[ PHY identifier 2            ]]
	MII_ADVERTISE =       0x04,        --[[ Advertisement control reg   ]]
	MII_LPA =             0x05,        --[[ Link partner ability reg    ]]
	MII_EXPANSION =       0x06,        --[[ Expansion register          ]]
	MII_CTRL1000 =        0x09,        --[[ 1000BASE-T control          ]]
	MII_STAT1000 =        0x0a,        --[[ 1000BASE-T status           ]]

	--[[ Mask for BMCR Register settings for Speed/Duplex ]]
	PHY_BMCR_10_FD =    0x0100,
	PHY_BMCR_10_HD =    0x0000,
	PHY_BMCR_100_FD =   0x2100,
	PHY_BMCR_100_HD =   0x2000,
	PHY_BMCR_1000_FD =  0x1140,
	PHY_BMCR_AUTO_NEG = 0x3000,

	--[[ Mask for ADVERTISE Register settings for Speed/Duplex ]]
	PHY_ADV_AUTO_NEG =  0x05e1,
	PHY_ADV_1000_FD =   0x0401,

	--[[ Mask for Gigabit Control Register settings for Speed/Duplex ]]
	PHY_GBCR_AUTO_NEG = 0x0300,

	DUID_LENGTH = 16,
	DUID_TYPE3_LEN = 12,
	DUID_FILE =  "/conf/dhcp6c_duid",
	IPV6_CONF = "/proc/sys/net/ipv6/conf/",
	HOP_LIMIT = "/hop_limit",

	DNSCFG_MAX_DOMAIN_NAME_LEN = 256, -- with ull
	DNSCFG_MAX_RAC_NAME_LEN =    64,
	DNS_MANUAL_ENABLE =   0x1,
	DNS_MANUAL_DISABLE =  0x2,
	DOMAIN_V4 = 1,
	DOMAIN_V6 = 2,
	CONFDNSCONF = "/conf/dns.conf",
	CONFDNSCONF_TMP = "/conf/dns.conf.tmp",

	AF_INET = 2,
	AF_INET6 = 10,
}