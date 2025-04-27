
#pragma pack (1)
typedef struct
{
    INT8U AutoNegotiationEnable;
    INT16U Speed;
    INT8U Duplex;
    INT8U Interface;
    INT8U CapabilitiesSupported;
} __attribute__ ((packed)) PHYConfig_T;

typedef struct
{
    INT8U   Enable;                                                             /*Enable/Disable*/
    INT8U   BondIndex;                                                      /*Index value of Bond Interface*/
    INT8U   BondMode;                                                       /*Bond Mode*/
    INT16U   MiiInterval;                                                     /*MII Interval*/
    INT8U   Slaves;                                                           /*Each bit represents the interface Index value i.e 0-7*/
    INT8U   AutoConf;
}__attribute__ ((packed)) BondIface;
typedef struct{
	unsigned char CfgMethod; /* This field can either be NWCFGTYPE_DHCP or NWCFGTYPE_STATIC */
	unsigned char MAC[6];
	unsigned char Local_MAC[6];
	unsigned char IPAddr[4];
	unsigned char Broadcast[4];
	unsigned char Mask[4];
	unsigned char Gateway[4];
	unsigned char  BackupGateway[4];
	  /* If interface is enabled, value is
     * NW_INTERFACE_ENABLE otherwise NW_INTERFACE_DISABLE
     */
    unsigned char enable;
	unsigned char IFName[10];
	unsigned short VLANID;
	unsigned char vlanpriority;
        unsigned char Master;
        unsigned char Slave;
        unsigned char BondIndex;
} __attribute__ ((packed)) NWCFG_STRUCT;
/*ipv6*/
typedef struct{
	unsigned char enable;
       unsigned char MAC[6];
	unsigned char CfgMethod; /* This field can either be NWCFGTYPE_DHCP or NWCFGTYPE_STATIC */
	unsigned char LinkIPAddr[16];
	unsigned char LinkPrefix;
	unsigned char SiteIPAddr[16];
	unsigned char SitePrefix;
	unsigned char GlobalIPAddr[16][16];   //anyCast Globel address    //UniCast Globel address
	unsigned char GlobalPrefix[16];
	unsigned char Gateway[16];
       unsigned char IFName[10];
} __attribute__ ((packed)) NWCFG6_STRUCT;

typedef struct {
        unsigned char Enable;
        unsigned short MiiInterval;
        unsigned char BondMode;
        unsigned char Slave;
}__attribute__ ((packed)) BondConf;

typedef struct {
    unsigned char Upslave;
}__attribute__ ((packed)) ActiveConf;

typedef struct
{
    INT8 Ifcname[16];
    INT8U Index;
    INT8U Enabled;
}__attribute__ ((packed)) IfcName_T;

typedef struct{
	unsigned short Family;
		NWCFG_STRUCT 	IPv4;
		NWCFG6_STRUCT	IPv6;
} __attribute__ ((packed)) ALL_NWCFG_STRUCT;
#pragma pack ()

typedef struct{
	NWCFG_STRUCT NwInfo[10];
	int IFCount;
} __attribute__ ((packed)) NWCFGS;

typedef struct
{
    /* This field can either be NW_DUPLEX_FULL or NW_DUPLEX_HALF */
    long speed;

    /* This field can either be NW_DUPLEX_FULL or NW_DUPLEX_HALF */
    int duplex;

    /* This field can either be  NW_AUTO_NEG_ON or NW_AUTO_NEG_OFF,
     * Auto negotiation is applicable for both speed & duplex.
     */
    int autoneg;

    /* This field features the link modes that are supported by the interface */
    unsigned char supported; 

    /*Max transmission unit*/
    long maxtxpkt;

    unsigned long wolsupported;
    unsigned long wolopts;
 
} __attribute__ ((packed)) ETHCFG_STRUCT;

typedef struct{
        ETHCFG_STRUCT EthInfo[10];
} __attribute__ ((packed)) ETHCFGS;


typedef struct{

    /* Name of the interface, example: eth0, eth1, ethernet,...*/
    char IFName[10];

    /*
     * This field can either be NWCFGTYPE_DHCP or
     * NWCFGTYPE_STATIC or NWCFGTYPE_DHCPFIRST
     */
    unsigned char CfgMethod;

    /*
     *  If interface is enabled, value is NW_INTERFACE_ENABLE
     *  otherwise NW_INTERFACE_DISABLE
     */
    unsigned char Enable;

    /*
     * Current IP Origin NWCFGTYPE_DHCP or NWCFGTYPE_STATIC
     */
    unsigned char IPOrigin;

    /*
     * IP assigned: If IPOrgin is DHCP, then this is DHCP IP,
     * if the IPOrigin is Static, then this is Static IP address
     */
    unsigned char IPAddr[4];
    unsigned char Mask[4];
    unsigned char Gateway[4];

    /*
     *  Manually configured Fall back (FB) IP
     */
    unsigned char FB_IPAddr[4];
    unsigned char FB_Mask[4];
    unsigned char FB_Gateway[4];

} __attribute__ ((packed)) NWEXT_IPCFG;


typedef struct
{
    /*Burned-in MAC address*/
    unsigned char BurnedMAC[6];

    /* Locally admin-MAC: Setting Local MAC to other than 00:00:00:00:00:00
     * makes it as current MAC. If a platform does not support. If this is
     * non-zero then this is current MAC while getting
     */
    unsigned char Local_MAC[6];

}__attribute__ ((packed)) NWEXT_MACCFG;


typedef struct
{

    /* MAC Configuration */
    NWEXT_MACCFG mac_cfg;

    /* Ethernet Configuration */
    ETHCFG_STRUCT eth_cfg;

} __attribute__ ((packed)) NWEXT_ETHCFG;

typedef struct
{
    unsigned char DNSDhcpEnable;                             /*Specifies that the DNS server IP addresses should be assigned from the DHCP server*/
    unsigned char DNSServerEthIndex;                         /*Specifies that from which DHCP server the IP addresses should be assigned */
    unsigned char DNSServer1[4];                   /*Specifies the IP address for DNS server 1*/
    unsigned char DNSServer2[4];                   /*Specifies the IP address for DNS server 2*/
    unsigned char v4v6;
    unsigned char RegisterBMCFQDN[0x04];  	     /*Register the BMC host name using FQDN method */
    unsigned char DNSRegisterBMC[0x04];               /*Enable registering the BMC host name on the DNS server*/
    unsigned char DNSBMCHostSetting;                         /*Specifies host name is Automatic or Manual */
    unsigned char DNSBMCHostNameLen;
    unsigned char DNSBMCHostName[128];          /*Specifies the DNS BMC host name*/
    unsigned char DNSDomainNameDhcpEnable;                   /*Specifies that the DNS domain name should be assigned from the DHCP server*/
    unsigned char DNSDomainNameEthIndex;                     /*Specifies that from which DHCP server the DNS domain name should be assigned */    
    unsigned char DNSDomainNameLen;
    unsigned char DNSDomainName[256];/*The DNS domain name string*/

}  __attribute__ ((packed)) DNS_CONFIG;

typedef struct
{
    unsigned char dnsEnable;
    unsigned char manualDNSDomain1Length;
    char manualDNSDomainName1[256];
    unsigned char manualDNSDomain2Length;
    char manualDNSDomainName2[256];
    struct in_addr manualDNSServer1;
    struct in_addr manualDNSServer2;
    struct in_addr manualDNSServer3;

} __attribute__ ((packed)) MANUAL_DNS_CONFIG;


/*********************************/
/* DNS Configuration structures */
/*********************************/

typedef struct
{
    INT8U HostSetting;                         /*Specifies host name is Automatic or Manual */
    INT8U HostNameLen;
    INT8U HostName[128];          /*Specifies the DNS BMC host name*/
    
}__attribute__ ((packed)) HOSTNAMECONF;

typedef struct
{
    INT8U    dhcpEnable;
    INT8U    EthIndex;
    INT8U    v4v6;
    INT8U    domainname[256];
    INT8U    domainnamelen;
}__attribute__ ((packed)) DOMAINCONF;

typedef struct
{
    INT8U   DNSIP1[16];
    INT8U   DNSIP2[16];
    INT8U   DNSIP3[16];
    INT8U   DNSEnable;
    INT8U   DNSDHCP;
    INT8U   DNSIndex;
    INT8U   IPPriority;
}__attribute__ ((packed)) DNSCONF;



/* Define the network interface */
typedef enum
{
    PENDING=1, // Interface having configured/pending settings
    ACTIVE     // Interface having current/active settings
}NW_INTERFACE;

typedef struct
{
	INT8U param;
	INT8U NwRestartNeeded; 	
}__attribute__ ((packed)) MONSETLANPARAM_STRUCT;


typedef struct
{
	NWCFG_STRUCT cfgIPv4[5];
	NWCFG6_STRUCT cfgIPv6[5];
	BondIface BondConfig;
	PHYConfig_T   PHYConfig[5];
	unsigned short mtu_size[5];
	HOSTNAMECONF HostnameConfig;
	DOMAINCONF DomainConfig;
	INT8U regBMC_FQDN[0x04];
	INT8U TypeOfService[5];
	DNSCONF DnsIPConfig;
}__attribute__ ((packed)) DELAYEDLANRESTART_NWDATA;

typedef struct
{
    INT8U               IPv6_RA_Conf_Cntl_Enable;
    INT8U               IPv6_Router1_IPAddr[16];
    INT8U               IPv6_Router1_MACAddr[6];
    INT8U               IPv6_Router1_PrefixLen;
    INT8U               IPv6_Router1_PrefixValue[16];
    INT8U               IPv6_Router2_IPAddr[16];
    INT8U               IPv6_Router2_MACAddr[6];
    INT8U               IPv6_Router2_PrefixLen;
    INT8U               IPv6_Router2_PrefixValue[16];
    INT8U               IPv6_RA_Dynamic_InfoSetNum;
    INT8U               IPv6_RA_Dynamic_InfoIPAddr [16][16];
    INT8U               IPv6_RA_Dynamic_InfoMACAddr [16][6];
    INT8U               IPv6_RA_Dynamic_InfoPrefixLen[16];
    INT8U               IPv6_RA_Dynamic_InfoPrefixValue[16][16];
    INT8U               IPv6_RA_Dynamic_RecvHopLimit;

} __attribute__ ((packed)) RACFG_T;

//#pragma pack ()

/* Functions to read/write current network status */
int nwReadNWCfgs(NWCFGS *cfg, ETHCFGS *ethcfg);
int IsLinkModeSupported(ETHCFG_STRUCT *ethcfg,INT16U speed,INT8U duplex);
int nwGetEthInformation(ETHCFG_STRUCT *ethcfg, char * IFName);
int nwSetEthInformation(unsigned long speed, unsigned int duplex, char * IFName);
int nwWriteNWCfgNoUpDown(NWCFG_STRUCT *cfg);
int nwSetEthMTUSize(int mtu, char * IFName);

int nwSetBkupGWyAddr(unsigned char *ip,INT8U EthIndex);
int nwGetBkupGWyAddr(unsigned char *ip,INT8U EthIndex);
/* One should pass the buffer of size MAX_MAC_LEN to the following function */
int nwGetMACAddr(char *MAC);
int nwSetMACAddr(char *MAC, int Index);
int nwSetGateway(INT8U* GwIP,INT8U EthIndex);
int nwDelExistingGateway(INT8U EthIndex);

/* Functions to set/get MDIO PHY registers */
/* These can be used by OEMs to monitor/control the speed/duplex of the PHY */
int nwGetPHYRegister(char regNo, char *IfcName);
int nwSetPHYRegister(unsigned short regValue, char regNo, char *IfcName);

/* Function to generate an IPv6 address based on EUI-64 algo */
int nwFormIPv6Addr_EUI64(INT8U *IPv6Addr, INT8U EthIndex, int GlobalIPv6);

int nwGetNWInformations(NWCFG_STRUCT *cfg,char *IFName);
int nwGetNWInformation(NWCFG_STRUCT *cfg,INT8U EthIndex);

int nwMakeIFDown(INT8U EthIndex);
int nwMakeIFUp(INT8U  EthIndex);
extern void GetNwCfgInfo(void);
extern int GetNoofInterface(void);

/* Extended API for network*/
int GetHostEthbyIPAddr(char *IPAddr);
int GetHostEthByIPv6Addr(char *IPAddr);
int GetIfcNameByIndex(int Index, char * IfcName);
int nwGetSrcMacAddr(INT8U* IpAddr,INT8U EthIndex,INT8U *MacAddr);
int nwGetSrcCacheMacAddr(INT8U* IpAddr, INT8U EthIndex, INT8U *MacAddr);
int nwGetSrcMacAddr_IPV6(INT8U* IpAddr,INT8U *MacAddr);
int nwGetNWExtEthCfg(NWEXT_ETHCFG *cfg);
int nwGetNWInterfaceStatus(void);
int nwSetNWExtEthCfg(NWEXT_ETHCFG *cfg, int nwSetFlag);
int nwSetNWExtIPCfg (NWEXT_IPCFG *cfg, int nwSetFlag,int global_ipv6);
int GetNwLinkStatus(int fd,char *ifname);
int GetNwLinkType_mii(char *ifname);

/**
*@fn nwUpdateVLANInterfacesFile
*@brief This function is invoked to update vlan interfaces file
*/
int nwUpdateVLANInterfacesFile(void);

/**
*@fn ReadVLANFile
*@brief This function is invoked to read the vlan configuration files
*@param SettingStr - Pointer to setting name that we want to read from vlan configurations file
*@param desArr - pointer to an array where the reading has to be stored
*/
int ReadVLANFile(char *SettingStr, INT16U *desArr);

/**
*@fn ReadIfcVLANID
* Gets the VLANID based on the interface name.
*@param SettingStr - Pointer to setting name that we want to read from vlan configurations file
*@param IfcName- Interface name to which vlan id need to find.
*@param desArr - pointer to an array where the reading has to be stored
*@brief This function is invoked to read all the vlan configuration files
*@return Returns 0 on success and -1 on fails
*/
int ReadIfcVLANID (char *SettingStr, char *IfcName, INT16U  *desArr);

/**
*@fn WriteVLANFile
*@brief This function is invoked to write all the vlan configuration files
*@param SettingStr - Pointer to setting name that we want to write into vlan configurations file
*@param desArr - pointer to an array where the reading has to be stored
*@param EthIndex - char value to Ethernet index
*@param val - short int to the value that has to be written
*/
int WriteVLANFile(char *SettingStr, INT16U *desArr, INT8U EthIndex, INT16U val);

/*ipv6*/
void ConvertIP6numToStr(unsigned char *var, unsigned int len,unsigned char *string) ;
int nwReadNWCfg_IPv6(NWCFG6_STRUCT *cfg,INT8U EthIndex);
int GetDefaultGateway_ipv6(unsigned char *gw,INT8U *Interface);
int nwGetResolvConf_v4_v6(char* DNS1,char*DNS2,char *DNS3, INT8U DNSIPPriority,char* domain,unsigned char* domainnamelen);

/**
*@fn nwReadNWCfg_v4_v6
*@brief This function is invoked to Get the current network status of both IPv4 and IPv6 networks.
*@		If there is no need of IPv6 data means, then just pass NULL to IPv6 pointer.
*@param cfg - Pointer to Structure used to get IPv4 network configurations.
*@param cfg6 - Pointer to Structure used to get IPv6 network configurations.
*@param EthIndex - pointer to char used to store Interface Index value.
*@return Returns 0 on success and -1 on fails
*/
int nwReadNWCfg_v4_v6(NWCFG_STRUCT *cfg, NWCFG6_STRUCT *cfg6, INT8U EthIndex,int global_ipv6);

/**
*@fn nwWriteNWCfg_ipv4_v6
*@brief This function is invoked to set both IPv4 and IPv6 network configurations.
*@		If there is no need to write IPv6 data means, then just pass NULL to IPv6 pointer.
*@param cfg - Pointer to Structure used to set IPv4 network configurations
*@param cfg6 - Pointer to Structure used to set IPv6 network configurations
*@param EthIndex - pointer to char used to store Interface Index value.
*@return Returns 0 on success and -1 on fails
*/
int nwWriteNWCfg_ipv4_v6(NWCFG_STRUCT *cfg, NWCFG6_STRUCT *cfg6, INT8U EthIndex);

/*
 * @fn nwConfigureBonding
 * @brief This function will Enable/Disable the bonding support
 * @param BondCfg [in] Bonding configuration table
 * @param BondIndex [in] Index value of Bond interface to be configured
 * @return 0 on success, -1 on failure
 */
int nwConfigureBonding(BondIface *BondCfg,INT8U EthIndex,int timeoutd_sess_timeout,int global_ipv6);

/*
 * @fn nwGetBondConf
 * @brief This function will Get the bonding Configuration of Specified index
 * @param BondCfg [out] Bonding configuration table
 * @param BondIndex [in] Index value of Bond interface 
 * @return 0 on success, -1 on failure
 */
int nwGetBondConf(BondIface *BondCfg,INT8U BondIndex);

/*
 * @fn CheckIfcEntry
 * @brief This function will check the interface presence in ifcname table
 * @param Index [in] index value 
 * @param IfcType [in] interface type
 * @return 0 in success, -1 on failure
 */
int CheckIfcEntry(INT8U Index,INT8U IfcType);

/*
 * @fn CheckBondSlave
 * @brief This function will check the given interfaces slave status
 * @param EthIndex[in] interface's Ethindex value
 * @returns 1 if the interface is a slave of any bond interface, otherwise 0
 */
int CheckBondSlave(INT8U EthIndex);

/*
 * @fn CheckIfcLinkStatus
 * @brief This function will check the interface's Link health
 * @param Index [in] index value 
 * @return -1 on failure
 */
int CheckIfcLinkStatus(INT8U Index);

/*
 * @fn InitIfcNameTable
 * @brief This function is used to initialize the Ifcname table based on NIC count
 * @return -1 on failure
 */
int InitIfcNameTable();

/*
 * @fn GetIfcNameTable
 * @brief This function retrieves the Ifcnametable values.
 * @return 0 on success
 */
int GetIfcNameTable (IfcName_T *Ifctable);

/**
*@fn IsKernelIPv6Enabled
*@brief This function is used to check for IPv6 support in the kernel.
*@return Returns 1 on success and 0 on fails
*/
int IsKernelIPv6Enabled();

/*
 * @fn nwActiveSlave
 * @brief This function will active the single slave for the bonding interface
 * @param SlaveIndex to be activated
 * @return 0 on success, -1 on failure
*/
int nwActiveSlave(INT8U BondIndex,INT8U SlaveIndex);

/*
 * @fn nwGetActiveSlave
 * @brief This function will gets the active interface of specified bondindex
 * @param Bondindex [in] bonding index, Activeindex[out] active slaves
 * @return 0 on success, -1 on failure
 */
int nwGetActiveSlave(INT8U BondIndex,INT8U *ActiveIndex);

/**
*@fn Write_dhcp6c_conf
*@brief This function is used to write interface wise entries for dhcp6c.conf file.
*@return Returns 0 on success and -1 on fails
*/
int Write_dhcp6c_conf();

/**
*@fn IsValidGlobalIPv6Addr
*@brief This function will check the given IPv6 address as global IP address or not
*@return Return 0 on success and -1 on failure
*/
int IsValidGlobalIPv6Addr(struct in6_addr * IPv6Addr);

/* DNS */
int nwSetResolvConf_v4_v6(char* dns1,char* dns2,char* dnsv3,char* domain);

int ReadDNSConfFile ( DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN);
int WriteDNSConfFile ( DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig, INT8U *regBMC_FQDN);
int nwGetAllDNSConf( HOSTNAMECONF *HostnameConfig, DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN );
int nwSetAllDNSConf( HOSTNAMECONF *HostnameConfig, DOMAINCONF *DomainConfig, DNSCONF *DnsIPConfig,INT8U *regBMC_FQDN );
int nwGetBondCfg();

/* Library for AMI Extended DNS command  */
int nwSetHostName(char *name);
int nwGetDNSConf(unsigned char* UseDHCPForDNS,unsigned char* UseDHCPForDomain,unsigned char* DoDDNS);
int nwGetAllDNSCfg(DNS_CONFIG* dnscfg);
int nwSetDNSConf(unsigned char UseDHCPForDNS,unsigned char UseDHCPForDomain,unsigned char DoDDNS);
int nwSetAllDNSCfg_NotRestart(DNS_CONFIG* dnscfg);

int nwGetDHCPServerIP(char *dhcpServerIP);
/*!
* @brief Reading current/active network configuration using netman script
* #param[out] cfg - IP, Netmask, Gateway, Conf method(dhcp/statis)
* @returns 0 on succee , -1 on failure
*/
int nwGetNwActIPCfg( NWEXT_IPCFG *cfg );
int GetIPAdrressType(INT8U* IPAddr);

int nwSyncNWCfg_ipv4_v6(NWCFG_STRUCT *cfg,NWCFG6_STRUCT *cfg6, INT8U EthIndex);
int nwGetMACAddrInBondConf ( NWCFG_STRUCT *cfg, char *EthIndex );

#endif /* _NW_CFG_H */

/**
*@fn GetIPAddrstr
*@brief This function is used to get IP address string for given ip or hostname
*@param addr - pointer to string of IP address of hostname
*@param pResIPaddr - pointer to IP address string
*@return Returns address family (AF_INET or AF_INET6) on success and -1 on failure
*/

int GetIPAddrstr(unsigned char *addr, char *pResIPaddr);
int getFullyQualifiedDName(char *fqdname, INT8U EthIndex);
int nwGetExtMACAddr(unsigned char *MAC);


/*
 * @fn IsBMCNFSMode
 * @brief Check whether BMC is in BMC Mode.
 * @return 0 for FALSE,
 *         1 for TRUE.
 */
int IsBMCNFSMode();

int nwSyncBondCfg(BondIface *pBondCfg);
void GetNwStruct_v4_v6(NWCFG_STRUCT *pCFGIPv4,NWCFG6_STRUCT *pCFGIPv6);
int HandleDelayedNwRestart(DELAYEDLANRESTART_NWDATA *pDelyedLAN_NwCfgs, INT8U Flag_SetDNS, INT8U EthIndex);
int SetNWSpeed(PHYConfig_T *pPHYConfig, char * IFName);

int SetNWMTUSize(int mtu, char * IFName);
int SetVLANPriority(INT16U vlanID, INT8U VLANPriority, INT8U TypeOfService, char *IfcName);
int UpdateServiceStatus(INT8U ServiceBit,INT8U EthIndex,INT8U State);
int nwGetBondActiveSlave(INT8U BondIndex,INT8U *ActiveIndex);
int nwReadRACfg(RACFG_T *rcfg, INT8U EthIndex);
int nwWriteRACfg(RACFG_T * wcfg,INT8U EthIndex);
int getportenable(char* ifacename);
int CheckVLAN(char* Ifcname,int* VlanID);
int getpidnum(char* ifacename,int protocol);
int servSLPDReset ();
int ReadIPv6DUID(INT8U *DUID);
int ReadHopLimit(char* IfcName);
int updateARPGatewayip(unsigned char *ifcname);

