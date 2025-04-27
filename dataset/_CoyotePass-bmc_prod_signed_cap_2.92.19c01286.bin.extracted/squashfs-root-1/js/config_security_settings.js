"use strict";
/* Configuration -- Security Settings  */

var lang;
var SOLsshPrevious = false;
var HTTPservicePrevious = false;
var HTTPsrvPrevious = false;
var RMservicePrevious = false;
var RMCPservicePrevious = false;
var selectOP;
var KCSMODE = '';
var KCSMODEPrevious = '';
var PWD_POLICY = '';
var PWD_POLICYPrevious = '';
var PWD_DEPTH = '';
var PWD_DEPTHPrevious = '';
var SSL_CIPHER_CTL = '';
var SSL_CIPHER_CTLPrevious = '';
var HTTPsPORTPrevious = '';
var FAILEDTIMESPrevious = '';
var LOCKOUTIMEPrevious = '';
var failedAttempts = '';
var LANCipherPrevious = [{"lan_enable":false,"cs3_enable":false},
                         {"lan_enable":false,"cs3_enable":false},
                         {"lan_enable":false,"cs3_enable":false}];

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit() {
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_security_hlp.html";
    var SOLsshService = document.getElementById("SOLsshService");
    var httpService = document.getElementById("httpService");
    var httpSrv = document.getElementById("httpSrv");
    var rmcpService = document.getElementById("rmcpService");
    var RemoteMediaService = document.getElementById("RemoteMediaService");
    var passwordService_select = document.getElementById("passwordService_select");
    var passwordDepth_select = document.getElementById("passwordDepth_select");

    var saveBtn = document.getElementById("saveBtn");
    saveBtn.setAttribute("value", lang.CONF_LOGIN_STR_SAVE);
    saveBtn.onclick= btnSaved;
    init();

    var saveBtn = document.getElementById("saveBtn");
    failedAttempts = document.getElementById("failedAttempts");
    failedAttempts.addEventListener("keypress", validateNumeric);
    failedAttempts.addEventListener("keydown", validateNumeric);

    var lockoutTime = document.getElementById("lockoutTime");
    lockoutTime.addEventListener("keypress", validateNumeric);
    lockoutTime.addEventListener("keydown", validateNumeric);

    var httpsPort = document.getElementById("httpsPort");
    httpsPort.addEventListener("keypress", validateNumeric);
    httpsPort.addEventListener("keydown", validateNumeric);

    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function init()
{
    "use strict";
    initKCSPolicyControlMode();
    initSSLCipherPolicy();
    initpwdPolicy();
    initpwdDepth();
}

function initpwdDepth()
{
    "use strict";
    let pwd_depth = {
        "disabled": lang.CONF_PWD_DEPTH_0,
        "d1": lang.CONF_PWD_DEPTH_1,
        "d2": lang.CONF_PWD_DEPTH_2,
        "d3": lang.CONF_PWD_DEPTH_3,
        "d4": lang.CONF_PWD_DEPTH_4,
        "d5": lang.CONF_PWD_DEPTH_5
    };
    let i = 0;

    for(let prop in pwd_depth) {
        passwordDepth_select.add(new Option(pwd_depth[prop], prop),
                                 browser_ie? i: null);
        i++;
    }
    passwordDepth_select.onchange = sel_pwd_depth;
}

function sel_pwd_depth()
{
    "use strict";
    PWD_DEPTH = passwordDepth_select.value;
}

function initpwdPolicy()
{
    "use strict";
    let pwdPolicy = {
        "disabled": lang.CONF_PWD_POLICY_DISABLED,
        "medium": lang.CONF_PWD_POLICY_MEDIUM,
        "low": lang.CONF_PWD_POLICY_LOW,
        "high": lang.CONF_PWD_POLICY_HIGH
    };
    let i = 0;

    for(let prop in pwdPolicy) {
        passwordService_select.add(new Option(pwdPolicy[prop], prop),
                                   browser_ie ? i : null);
        i++;
    }
    passwordService_select.onchange = sel_pwd_policy;
}

function sel_pwd_policy()
{
    "use strict";
    PWD_POLICY = passwordService_select.value;
}

function initKCSPolicyControlMode()
{
    "use strict";
    let KCSTypeCategory = {
        "allow_all": lang.CONF_KCS_ALLOW_ALL_MODE,
        "restricted": lang.CONF_KCS_RESTRICTED_MODE,
        "deny_all": lang.CONF_KCS_DENY_ALL_MODE
    };

    selectOP = document.getElementById("kcs_type_select");
    let i = 0;
    for(let prop in KCSTypeCategory) {
        selectOP.add(new Option(KCSTypeCategory[prop], prop),
                     browser_ie ? i : null);
        i++;
    }
    selectOP.onchange = storeKCSmode;
}

function storeKCSmode()
{
    "use strict";
    KCSMODE = selectOP.value;
}

function OutputString() {
    "use strict";
    document.getElementById("title_div").textContent = lang.CONF_LOGIN_PAGE_TITLE;
    document.getElementById("attemp_legen").textContent = lang.CONF_LEGEND_LOGIN_ATTEMPT;
    document.getElementById("failed_attempts_lbl").textContent = lang.CONF_LOGIN_STR_FAILED_ATTEMPTS;
    document.getElementById("lockout_time_lbl").textContent = lang.CONF_LOGIN_STR_LOCKOUT_TIME;
    document.getElementById("port_setting_legend").textContent = lang.CONF_LEGEND_PORT_SETTING;
    document.getElementById("https_port_lbl").textContent = lang.CONF_LOGIN_STR_HTTP_SEC_PORT;
    document.getElementById("network_services_legend").textContent = lang.CONF_LEGEND_NETWORK_SERVICES;
    document.getElementById("login_enable_lbl").textContent = lang.CONF_LOGIN_STR_ENABLE;
    document.getElementById("sol_service_lbl").textContent = lang.CONF_LOGIN_STR_SOL_SSH_SERVICE;
    document.getElementById("login2_enable_lbl").textContent = lang.CONF_LOGIN_STR_ENABLE;
    document.getElementById("http_service_lbl").textContent = lang.CONF_LOGIN_STR_HTTP_SERVICE;
    document.getElementById("https_service_lbl").textContent = lang.CONF_LOGIN_STR_HTTPS_SERVICE;
    document.getElementById("login3_enable_lbl").textContent = lang.CONF_LOGIN_STR_ENABLE;
    document.getElementById("rmcp_service_lbl").textContent = lang.CONF_LOGIN_STR_RMCP_SERVICE;
    document.getElementById("login4_enable_lbl").textContent = lang.CONF_LOGIN_STR_ENABLE;
    document.getElementById("rm_service_lbl").textContent = lang.CONF_LOGIN_STR_RM_SERVICE;
    document.getElementById("login5_enable_lbl").textContent = lang.CONF_LOGIN_STR_ENABLE;
    document.getElementById("caption_legend").textContent = lang.CONF_LEGNED_CS3_SERVICES;
    document.getElementById("kcs_policy_control_mode_legend").textContent = lang.CONF_LEGNED_KCS_POLICY_CONTROL_MODE;
    document.getElementById("kcs_pcm_lbl").textContent = lang.CONF_KCS_RESTRICTION_MODE;
    document.getElementById("cipher_suite_legend").textContent = lang.CONF_LEGNED_SSL_CIPHER_POLICY_CTL;
    document.getElementById("cs_lbl").textContent = lang.CONF_SSL_CIPHER_MODE;
    document.getElementById("password_services_legend").textContent = lang.CONF_LEGNED_PASSWORD_MODE_SERVICES;
    document.getElementById("password_service_lbl").textContent = lang.CONF_COMPLEX_PASSWORD_SERVICES;
    document.getElementById("password_depth_lbl").textContent = lang.CONF_COMPLEX_PASSWORD_DEPTH;
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if (Privilege == '04')
    {
        getUserBlockout();
        getServicesStatus();
        getwebPortNo();
        requestCS3Staus("0","0");
        requestKCSMode();
        req_ssl_cipher_ctl_mode();
        req_pwd_policy();
        req_pwd_depth();
    }
    else if (Privilege == '03')
    {
        getUserBlockout();
        getServicesStatus();
        getwebPortNo();
        requestCS3Staus("0","0");
        requestKCSMode();
        saveBtn.disabled= true;
        req_ssl_cipher_ctl_mode();
        req_pwd_policy();
        req_pwd_depth();
    }
    else
    {
        location.href = SubMainPage;
        saveBtn.disabled= true;
    }
    httpService.onclick = function() {
        "use strict";
        httpSrv.disabled = !(this.checked);
    }
}

function SSLCipherSt(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "FAIL") {
            alert(lang.CONF_CIPHER_TYPE_UPDATE_FAIL);
            return;
        }
        SSL_CIPHER_CTLPrevious = SSL_CIPHER_CTL;
    }
}

function setSSLCipherMode()
{
    "use strict";
    var url = '../cgi/sslCipherCtl.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = "<?xml version=\"1.0\"?>\n"+
                    "<IPMI>\n"+
                    "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
                    "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
                    "<SSL CIPHER_TYPE=\"" + SSL_CIPHER_CTL + "\"/>\n"+
                    "</IPMI>\n";
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'UPDATE',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: SSLCipherSt
                                    });
}

function setPWDepth()
{
    "use strict";
    var url = '../cgi/pwdpolicycfg.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = "<?xml version=\"1.0\"?>\n"+
                    "<IPMI>\n"+
                    "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
                    "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
                    "<SECURITY PWDepth=\"" + PWD_DEPTH + "\"/>\n"+
                    "<PWD_MODE ACTION=\"DEPTH\"/>\n"+
                    "</IPMI>\n";
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'UPDATE',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: PWDepthStatus
                                    });
}

function PWDepthStatus(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "FAIL") {
            alert(lang.CONF_PWD_MODE_UPDATE_FAIL);
            return;
        }
        PWD_DEPTHPrevious = PWD_DEPTH;
        //alert(lang.CONF_SECUR_SET_OK);
    }
}

function setPWDPolicy()
{
    "use strict";
    var url = '../cgi/pwdpolicycfg.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = "<?xml version=\"1.0\"?>\n"+
                    "<IPMI>\n"+
                    "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
                    "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
                    "<SECURITY PWDPolicy=\"" + PWD_POLICY + "\"/>\n"+
                    "<PWD_MODE ACTION=\"POLICY\"/>\n"+
                    "</IPMI>\n";
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'UPDATE',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: PWDPolicyStatus
                                    });
}

function PWDPolicyStatus(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "FAIL") {
            alert(lang.CONF_PWD_MODE_UPDATE_FAIL);
            return;
        }
        PWD_POLICYPrevious = PWD_POLICY;
        //alert(lang.CONF_SECUR_SET_OK);
    }
}

function setKCSMode()
{
    "use strict";
    var url = '../cgi/kcsmodecfg.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = "<?xml version=\"1.0\"?>\n"+
                    "<IPMI>\n"+
                    "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
                    "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
                    "<SECURITY RestrictionMode=\"" + KCSMODE + "\"/>\n"+
                    "</IPMI>\n";
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'UPDATE',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: KCSModeStatus
                                    });
}

function KCSModeStatus(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "FAIL") {
            alert(lang.CONF_KCS_UPDATE_FAIL);
            return;
        }
        CreateSessionStorage("KCSMode", KCSMODE);
        KCSMODEPrevious = KCSMODE;
        Check_bmc_security_control_mode_warning(lang.CONF_KCS_BANNER);
    }
}

function set_kcs_mode(root)
{
    "use strict";
    let node = root.getElementsByTagName("KCS_MODE")[0];
    if (node != null) {
        let KCSMode = node.getAttribute("STATE");
        if (KCSMode != null) {
            switch (KCSMode) {
                case "ALLOW_ALL":
                  CreateSessionStorage("KCSMode", "allow_all");
                  selectOP.selectedIndex = 0;
                  KCSMODEPrevious = KCSMODE = "allow_all";
                  break;
                case "RESTRICTED":
                  CreateSessionStorage("KCSMode", "restricted");
                  selectOP.selectedIndex = 1;
                  KCSMODEPrevious = KCSMODE = "restricted";
                  break;
                case "DENY_ALL":
                  CreateSessionStorage("KCSMode", "deny_all");
                  selectOP.selectedIndex = 2;
                  KCSMODEPrevious = KCSMODE = "deny_all";
                  break;
                default:
                  CreateSessionStorage("KCSMode", "deny_all");
                  KCSMODEPrevious = KCSMODE = "deny_all";
                  selectOP.selectedIndex = 2;
            }
        }
    }
    Check_bmc_security_control_mode_warning(lang.CONF_KCS_BANNER);
}

function getKCSStatus(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        let result = GetXMLNodeValue(xml_obj, "RESULT");

        if (result == "FAIL") {
            //console.log("request KCS mode fail.");
            return;
        }

        var root = xml_obj.documentElement;
        set_kcs_mode(root);
    }
}

function genCommonAjaXData(action)
{
    "use strict";
    let ajax_data = "<?xml version=\"1.0\"?>\n"+
                    "<IPMI>\n"+
                    "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
                    "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
                    if (action != null) {
                        ajax_data += "<PWD_MODE ACTION=\""+ action +"\"/>\n";
                    }

                    ajax_data += "</IPMI>\n";
    return ajax_data;
}

function initSSLCipherPolicy()
{
    "use strict";
    let CipherTypeCategory = {
        "advanced": lang.CONF_SSL_CIPHER_POLICY_ADVANCED,
        "board": lang.CONF_SSL_CIPHER_POLICY_BROAD,
        "widest": lang.CONF_SSL_CIPHER_POLICY_WIDEST,
        "legacy": lang.CONF_SSL_CIPHER_POLICY_LEGACY
    };
    let sel_ssl_op = document.getElementById("cs_type_select");
    let i = 0;

    for(let prop in CipherTypeCategory) {
        sel_ssl_op.add(new Option(CipherTypeCategory[prop], prop),
                     browser_ie ? i : null);
        i++;
    }
    sel_ssl_op.onchange = set_ssl_cipher_type;
}

function set_ssl_cipher_type()
{
    "use strict";
    let sel_ssl_op = document.getElementById("cs_type_select");

    SSL_CIPHER_CTL = sel_ssl_op.value;
}

function change_ssl_mode(root)
{
    "use strict";
    let node = root.getElementsByTagName("CIPHER_TYPE")[0];

    if (node != null) {
        let CipherType = node.getAttribute("STATE");

        if (CipherType != null) {
            let sel_ssl_t = document.getElementById("cs_type_select");
            switch (CipherType) {
                case "ADVANCED":
                  sel_ssl_t.selectedIndex = 0;
                  break;
                case "BROAD":
                  sel_ssl_t.selectedIndex = 1;
                  break;
                case "WIDEST":
                  sel_ssl_t.selectedIndex = 2;
                  break;
                case "LEGACY":
                  sel_ssl_t.selectedIndex = 3;
                  break;
                default:
                  break;
            }
            SSL_CIPHER_CTL = SSL_CIPHER_CTLPrevious = sel_ssl_t.value;
        }
    }
}

function change_pwdepth(root)
{
    "use strict";
    let node = root.getElementsByTagName("PWD_DEPTH")[0];

    if (node != null) {
        let Passwordepth = node.getAttribute("STATE");

        if (Passwordepth != null) {
            switch (Passwordepth) {
                case "DISABLED":
                  passwordDepth_select.selectedIndex = 0;
                  break;
                case "MODE_1":
                  passwordDepth_select.selectedIndex = 1;
                  break;
                case "MODE_2":
                  passwordDepth_select.selectedIndex = 2;
                  break;
                case "MODE_3":
                  passwordDepth_select.selectedIndex = 3;
                  break;
                case "MODE_4":
                  passwordDepth_select.selectedIndex = 4;
                  break;
                case "MODE_5":
                  passwordDepth_select.selectedIndex = 5;
                  break;
                default:
                  break;
            }
            PWD_DEPTH = PWD_DEPTHPrevious = passwordDepth_select.value;
        }
    }
}

function getPWDepth(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        let text = response.responseText.replace(/^\s+|\s+$/g,"");
        let xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        let result = GetXMLNodeValue(xml_obj, "RESULT");

        if (result == "FAIL") {
            return;
        }

        let root = xml_obj.documentElement;
        change_pwdepth(root);
    }
}

function req_pwd_depth()
{
    "use strict";
    var url = '../cgi/pwdpolicycfg.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = genCommonAjaXData("DEPTH");
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'POST',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: getPWDepth
                                    });
}

function change_pwdpolicy(root)
{
    "use strict";
    let node = root.getElementsByTagName("PWD_POLICY")[0];

    if (node != null) {
        let PasswordMode = node.getAttribute("STATE");

        if (PasswordMode != null) {
            //let sel_ssl_t = document.getElementById("cs_type_select");
            switch (PasswordMode) {
                case "DISABLED":
                  passwordService_select.selectedIndex = 0;
                  break;
                case "MEDIUM":
                  passwordService_select.selectedIndex = 1;
                  break;
                case "LOW":
                  passwordService_select.selectedIndex = 2;
                  break;
                case "HIGH":
                  passwordService_select.selectedIndex = 3;
                  break;
                default:
                  break;
            }
            PWD_POLICY = PWD_POLICYPrevious = passwordService_select.value;
        }
    }
}

function getPWDPolicy(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        let text = response.responseText.replace(/^\s+|\s+$/g,"");
        let xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        let result = GetXMLNodeValue(xml_obj, "RESULT");

        if (result == "FAIL") {
            return;
        }

        let root = xml_obj.documentElement;
        change_pwdpolicy(root);
    }
}

function req_pwd_policy()
{
    "use strict";
    var url = '../cgi/pwdpolicycfg.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = genCommonAjaXData("POLICY");
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'POST',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: getPWDPolicy
                                    });
}

function getSSLCipherPolicy(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        let text = response.responseText.replace(/^\s+|\s+$/g,"");
        let xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        let result = GetXMLNodeValue(xml_obj, "RESULT");

        if (result == "FAIL") {
            //console.log("request Cipher mode fail.");
            return;
        }

        let root = xml_obj.documentElement;
        change_ssl_mode(root);
    }
}

function req_ssl_cipher_ctl_mode()
{
    "use strict";
    var url = '../cgi/sslCipherCtl.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = genCommonAjaXData("");
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'POST',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: getSSLCipherPolicy
                                    });

}

function requestKCSMode()
{
    "use strict";
    var url = '../cgi/kcsmodecfg.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = genCommonAjaXData("");
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'POST',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: getKCSStatus
                                    });
}

function requestCS3Staus(channel, nicnum)
{
    "use strict";
    var ajax_url = '../cgi/netip4cfg.cgi';
    var ajax_param = 'ipv4conf.xml';
    var ajax_data = geneConfigXML(channel, nicnum, "0", "0", "0",
                                  "0.0.0.0", "", "00-00-00-00-00-00",
                                  "0.0.0.0", "0.0.0.0", "0", "0.0.0.0",
                                  "0.0.0.0");
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'POST',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      parameters: ajax_param,
                                      onComplete: readCIPHERConfig }//register callback function
                                   );
}

function geneConfigXML(nic_index,
                       nic_num,
                       sharemode,
                       failover,
                       enable,
                       ip, hostname, mac,
                       mask,
                       gateway,
                       dhcp, dns1, dns2)
{
    "use strict";
    var result = "";
        result += "<?xml version=\"1.0\"?>\n";
        result += "<IPMI>\n";
        result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
        result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
        result += "    <TOTAL_NUMBER LAN=\"" + nic_num + "\" USER=\"0\"/>\n";
        result += "    <LAN_IF SHAREMODE_EN=\"" + sharemode +
                           "\" FAILOVER_EN=\"" + failover +
                           "\" NIC_SLAVE=\"" + get_nic_slaves() +
                           "\" PRIMARY_NIC=\"" + get_primary_nic() +
                           "\" INTERFACE=\"" + nic_index +
                           "\" INTERFACE_EN=\"" + enable + "\"/>\n";
        result += "    <LAN BMC_IP=\"" + ip +
                        "\" BMC_MAC=\"" + mac +
                        "\" BMC_NETMASK=\"" + mask +
                        "\" GATEWAY_IP=\"" + gateway +
                        "\" DHCP_EN=\"" + dhcp + "\"/>\n";
        result += "    <DNS DNS_SERVER=\"" + dns1 + "\" DNS_SERVER2=\"" + dns2 + "\"/>\n";
        result += "    <HOSTNAME NAME=\"" + hostname + "\" />\n";
        result += "</IPMI>\n";
    return result;
}


function readCIPHERConfig(response) {
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        //alert("response:\n\n" + response.responseText);
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response for nic config:\n" + text);
        var xml_obj = GetResponseXML(text);

        if(xml_obj != null) {
            var result = GetXMLNodeValue(xml_obj, "RESULT");
            if(result == "FAIL") {
                alert(lang.LANG_CONF_NETWORK_UPDATE_FAIL);
                return;
            }

            var idx = 0;
            var root = xml_obj.documentElement;
            updateChannelCS3List(root);
        }
     }
 }

function updateChannelCS3List(root) {
    "use strict";
    var numChannels;
    var channel_id;
    var cs3_enable;
    var node = root.getElementsByTagName("TOTAL_NUMBER")[0];
    if(node != null) {
        numChannels = node.getAttribute("LAN");
    }

    var node = root.getElementsByTagName("LAN_ID");

    for(var idx = 0; idx < numChannels; idx++) {
       channel_id = node[numChannels-1-idx].getAttribute("AVAILABLE");
       cs3_enable = node[numChannels-1-idx].getAttribute("CS3_STATUS");
       InsertCS3Table(channel_id,cs3_enable);
    }
}

function InsertCS3Table(channel_id,cs3_enable) {
   "use strict";
   var tb= document.getElementById("cs3_service_table");
   var newTr=tb.insertRow(0);
   var newTd1=newTr.insertCell();
   newTd1.setAttribute("width","25px");
   newTd1.innerHTML="&nbsp";
   var newTd2=newTr.insertCell();
   newTd2.setAttribute("class","bold");  //channel-name
   newTd2.setAttribute("width","245");
   var newTd3=newTr.insertCell();  //check-bpx
   var newTd4=newTr.insertCell(); //nbsp
   newTd4.innerHTML="&nbsp";
   var newTd5=newTr.insertCell();
   var newTd6=newTr.insertCell();
   switch(channel_id) {
      case "1":
        newTd2.innerHTML = "<label class ='labelhead'>"+lang.LANG_CONF_NETWORK_BONDING_CHANNEL_1;
        LANCipherPrevious[0].lan_enable = true;
        if(cs3_enable == "ENABLE") {
           newTd3.innerHTML = "<input type ='checkbox' checked= 'true' id ='channel-1'/><label class ='labelhead' for='channel-1'>&nbsp"+lang.CONF_LOGIN_STR_ENABLE;
           LANCipherPrevious[0].cs3_enable = true;
        } else
           newTd3.innerHTML = "<input type ='checkbox' id ='channel-1'/><label class ='labelhead' for='channel-1'>&nbsp"+lang.CONF_LOGIN_STR_ENABLE;
      break;
      case "2":
        newTd2.innerHTML = "<label class ='labelhead'>"+lang.LANG_CONF_NETWORK_BONDING_CHANNEL_2;
        LANCipherPrevious[1].lan_enable = true;
        if(cs3_enable == "ENABLE"){
           newTd3.innerHTML = "<input type ='checkbox' checked='true' id ='channel-2'/><label class ='labelhead' for='channel-2'>&nbsp"+lang.CONF_LOGIN_STR_ENABLE;
           LANCipherPrevious[1].cs3_enable = true;
        } else
           newTd3.innerHTML = "<input type ='checkbox' id ='channel-2'/><label class ='labelhead' for='channel-2'>&nbsp"+lang.CONF_LOGIN_STR_ENABLE;
      break;
      case "3":
          LANCipherPrevious[2].lan_enable = true;
          newTd2.innerHTML = "<label class ='labelhead'>"+lang.LANG_CONF_NETWORK_BONDING_CHANNEL_3;
        if(cs3_enable == "ENABLE"){
           newTd3.innerHTML = "<input type ='checkbox' checked='true' id ='channel-3'/><label class ='labelhead' for='channel-3'>&nbsp"+lang.CONF_LOGIN_STR_ENABLE;
           LANCipherPrevious[2].cs3_enable = true;
        } else
           newTd3.innerHTML = "<input type ='checkbox' id ='channel-3'/><label class ='labelhead' for='channel-3'>&nbsp"+lang.CONF_LOGIN_STR_ENABLE;
      break;
      default:
      break;
   }
}


onload = function() {
    "use strict";
	document.title = lang.CONF_LOGIN_STR_TITLE;
}

function btnSaved(){
    "use strict";
        var cmdSended = 0;
        var cs3_temp_enable = 0;
        if(FAILEDTIMESPrevious != failedAttempts.value ||
           LOCKOUTIMEPrevious != lockoutTime.value)
        {
                if(parseInt(failedAttempts.value) <= 255 && parseInt(lockoutTime.value) <= 65535){
                        setUserBlockout();
                        cmdSended = 1;
                }
                else{
                        if(parseInt(failedAttempts.value) > 255){
                           alert(lang.CONF_LOGIN_STR_FAILED_ATTEMPTS_WARN);
                           return;
                        }
                        if(parseInt(lockoutTime.value) > 65535){
                           alert(lang.CONF_LOGIN_STR_LOCKOUT_TIME_WARN);
                        }
                        return;
                }
        }
        if(HTTPsPORTPrevious != httpsPort.value){
                if(parseInt(httpsPort.value) != 0 &&
                   parseInt(httpsPort.value) <= 65535)
                {
                    UtilsConfirm(lang.CONF_LOGIN_PORT_WARN, {
                        onOk: function() {
                            "use strict";
                            setwebPortNo();
                            cmdSended = 1;
                        }
                    });
                } else {
                        alert(lang.LANG_CONF_PORTERR_WARNING);
                }
        }else{
                getwebPortNo();
        }

        for(var i=0; i<3 ; i++) {
             if(LANCipherPrevious[i].lan_enable == true){
                  var lan_id="channel-"+(i+1);
                  cs3_temp_enable= document.getElementById(lan_id).checked;
                  if(cs3_temp_enable != LANCipherPrevious[i].cs3_enable){
                      LANCipherPrevious[i].cs3_enable = cs3_temp_enable;
                      cmdSended = 1;
                  }
             }
        }

        if(cmdSended ||
           SOLsshService.checked != SOLsshPrevious ||
           httpService.checked != HTTPservicePrevious ||
           httpSrv.checked != HTTPsrvPrevious ||
           RemoteMediaService.checked != RMservicePrevious ||
           rmcpService.checked != RMCPservicePrevious ||
           KCSMODEPrevious != KCSMODE ||
           SSL_CIPHER_CTL != SSL_CIPHER_CTLPrevious ||
           PWD_DEPTHPrevious != PWD_DEPTH ||
           PWD_POLICY != PWD_POLICYPrevious)
        {
            if (KCSMODEPrevious != KCSMODE) {
                setKCSMode();
            }

            if (SSL_CIPHER_CTL != SSL_CIPHER_CTLPrevious) {
                setSSLCipherMode();
            }

            setHttpServices();
        }
}

function PasswordServiceResponse(originalRequest){
    "use strict";
    Loading(false);
    if(originalRequest.readyState == 4 && originalRequest.status == 200){
        var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xmldoc= GetResponseXML(response);
        if(xmldoc == null){
            SessionTimeout();
            return ;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return ;
        }
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_CONFALERT_FAILSAVE);
            return ;
        }
        alert(lang.CONF_SECUR_SET_OK);
        setTimeout(function(){ location.href = "../cgi/url_redirect.cgi?url_name=config_security_settings"; }, 2000);
    } else {
        alert(lang.LANG_CONFALERT_FAILSAVE);
		location.href = "../cgi/url_redirect.cgi?url_name=config_security_settings";
    }
    return ;
}

function setSysPasswordServices(){
    "use strict";

    var complexPWDservice = "0";

    if(passwordService.checked != ComplexPasswordPrevious) {
        if(passwordService.checked)
            complexPWDservice = "1";
        else
            complexPWDservice = "0";
        ComplexPasswordPrevious = passwordService.checked;
    }
    Loading(true);
    var url = '/cgi/system_passwordcfg.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data= "<?xml version=\"1.0\"?>\n"+
	    "<IPMI>\n"+
        "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
	    "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
		"<SYS_PASSWORD_INFO  MODE=\""+complexPWDservice+"\"/>\n"+
        "</IPMI>\n";
    var myAjax = new Ajax.Request(
                                url,
                                {method: 'UPDATE',
                                contentType: 'text/xml',
                                xml_data: ajax_data,
                                parameters: pars, onComplete: PasswordServiceResponse});
}

function CS3ServiceResponse(originalRequest){
    "use strict";
  Loading(false);
  if(originalRequest.readyState == 4 && originalRequest.status == 200){
    var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
    var xmldoc= GetResponseXML(response);
    if(xmldoc == null){
      SessionTimeout();
      return ;
    }
    //check session & privilege.
    if (CheckInvalidResult(xmldoc) < 0) {
        return ;
    }
    var result = GetXMLNodeValue(xmldoc, "RESULT");
    if (result == "FAIL") {
        alert(lang.LANG_CONFALERT_FAILSAVE);
        return ;
    }
    setPWDPolicy();
    setPWDepth();
    alert(lang.CONF_SECUR_SET_OK);
  }
  return ;
}


function setCS3Services(){
  "use strict";
  Loading(true);
  var url= '/cgi/setlancipher.cgi';
  var pars= 'time_stamp='+ (new Date());
  var ajax_data ="";

  ajax_data += "<?xml version=\"1.0\"?>\n";
  ajax_data += "<IPMI>\n";
  ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
  ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
  for (var i=0; i<3 ; i++) {
      if (LANCipherPrevious[i].lan_enable == true){
          var lan_id ="channel-"+(i+1);
          if (true == LANCipherPrevious[i].cs3_enable)
              ajax_data +="    <LAN-"+(i+1)+"  CS3_ENABLE=\"1\""+"/>\n";
          else
              ajax_data +="    <LAN-"+(i+1)+"  CS3_ENABLE=\"0\""+"/>\n";
      }
  }
  ajax_data += "</IPMI>\n";

  var myAjax= new Ajax.Request(
        url,
        {
        method: 'update',
        contentType: 'text/xml',
        xml_data: ajax_data,
        parameters: pars,
        onComplete: CS3ServiceResponse
        });
}


function setHttpServices(){
    "use strict";
	// http, ssh, rmcp
	var smashSSHservice= "0";
	var solSSHservice= "0";
        var HTTP_Service = "0"; // http://url
	var HTTPS_Service= "0"; // https://url
	var RMCPservice= "0";
        var RMservice = "0";

        var NOTsmashSSHservice= "1";
        var NOTsolSSHservice= "0";
        var NOTHTTPsrv = "0"; // http://url
        var NOTHTTPservice= "0"; // https://url
        var NOTRMCPservice= "0";
        var NOTRMservice = "0";

	if(SOLsshService.checked!= SOLsshPrevious) {
		if(SOLsshService.checked)
			solSSHservice= "1";
		else
			NOTsolSSHservice= "1";

        SOLsshPrevious = SOLsshService.checked;
    }

    if (httpSrv.checked != HTTPsrvPrevious && httpService.checked == true) {
        if (!httpSrv.checked)
            NOTHTTPsrv = "1";
        else
            HTTP_Service = "1";

        HTTPsrvPrevious = httpSrv.checked;
    }

	if(httpService.checked!= HTTPservicePrevious) {
		if(!httpService.checked)
			NOTHTTPservice= "1";
		else
			HTTPS_Service= "1";

        HTTPservicePrevious = httpService.checked;
    }

	if(rmcpService.checked!= RMCPservicePrevious) {
		if(rmcpService.checked)
			RMCPservice= "1";
		else
			NOTRMCPservice= "1";

        RMCPservicePrevious = rmcpService.checked;
    }

    if (RemoteMediaService.checked != RMservicePrevious) {
        if (RemoteMediaService.checked)
            RMservice = "1";
        else
            NOTRMservice = "1";

        RMservicePrevious = RemoteMediaService.checked;
    }

	var url = '/cgi/setnwservice.cgi';
	var pars = 'time_stamp='+ (new Date());
	var ajax_data= geneConfigXML(smashSSHservice, solSSHservice,
                                     HTTPS_Service, HTTP_Service,
                                     RMCPservice, RMservice,
                                     NOTsmashSSHservice, NOTsolSSHservice,
				     NOTHTTPservice, NOTHTTPsrv,
                                     NOTRMCPservice, NOTRMservice);
	if(httpService.checked == false) {
           UtilsConfirm(lang.CONF_LOGIN_CLOSE_WEB_SERVICE_WARN, {
                onOk: function() {
                    "use strict";
                    sendData(url, pars, ajax_data, 'update', checkserviceResult);
                }
           });
	} else {
           if (HTTPsrvPrevious != httpSrv.checked) {
               UtilsConfirm(lang.CONF_LOGIN_CLOSE_WEB_HTTP_SERVICE_WARN, {
                    onOk: function() {
                        "use strict";
                        sendData(url, pars, ajax_data, 'update', checkserviceResult);
                    }
               });
           } else {
               sendData(url, pars, ajax_data, 'update', checkserviceResult);
           }
	}
}
function checkserviceResult(originalRequest){
    "use strict";
	if (originalRequest.readyState== 4&& originalRequest.status== 200){
		Loading(false);
		var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
		var xmldoc= GetResponseXML(response);
		if(xmldoc== null){
			SessionTimeout();
			return;
		}

        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        let result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_CONFALERT_FAILSAVE);
            return;
        }
        //alert(lang.CONF_SECUR_SET_OK);
        setCS3Services();
    } else {
		alert(lang.CONF_SECUR_SET_OK);
		setTimeout(function(){ location.href = "../cgi/url_redirect.cgi?url_name=config_security_settings"; }, 2000);
	}
}
function sendData(url, pars, ajax_data, methodtype, callback){
    "use strict";
	if(typeof(callback) != 'function')
		return;
	Loading(true);
	var myAjax = new Ajax.Request(
				url,
				{
				method: methodtype,
				contentType: 'text/xml',
				xml_data: ajax_data,
				parameters: pars,
				onComplete: callback
				});
}

function getServicesStatus(){
    "use strict";
	Loading(true);
	var url = '/cgi/getnwservice.cgi';
	var pars = 'time_stamp='+ (new Date());
	var ajax_data= GeneGenericRequestXML();
	var myAjax = new Ajax.Request(
				url,
				{method: 'post',
				contentType: 'text/xml',
				xml_data: ajax_data,
				parameters: pars, onComplete: servicesStateResult});
}

function servicesStateResult(originalRequest){
    "use strict";
	Loading(false);
	if(originalRequest.readyState== 4&& originalRequest.status== 200){
		var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
		var xmldoc= GetResponseXML(response);
		if(xmldoc== null){
			SessionTimeout();
			return;
		}

            //check session & privilege result
            if(CheckInvalidResult(xmldoc) < 0) {
                return;
            }

            var IPMIRoot = xmldoc.documentElement;//point to IPMI

		var networkService=IPMIRoot.getElementsByTagName('NETWORK_SERVICE');
		var getStatus = networkService[0].getElementsByTagName('GET_STATUS');
		var solSSHservice = getStatus[0].getAttribute('SOL_SSH_SERVICE');
		var httpsService = getStatus[0].getAttribute('HTTPS_SERVICE');
		var http = getStatus[0].getAttribute('HTTP_SERVICE');
		var rmcpservice = getStatus[0].getAttribute('RMCP_SERVICE');
                var RMservice = getStatus[0].getAttribute('RM_SERVICE');

		if(solSSHservice != '0')
			SOLsshPrevious= SOLsshService.checked= true;
		else
			SOLsshPrevious= SOLsshService.checked= false;
		if(httpsService != '0')
			HTTPservicePrevious= httpService.checked= true;
		else
			HTTPservicePrevious= httpService.checked= false;
                if(http != '0')
                        HTTPsrvPrevious = httpSrv.checked= true;
                else
                        HTTPsrvPrevious = httpSrv.checked= false;

                if (RMservice != '0')
                    RMservicePrevious = RemoteMediaService.checked = true;
                else
                    RMservicePrevious = RemoteMediaService.checked = false;

		if(rmcpservice != '0')
			RMCPservicePrevious= rmcpService.checked= true;
		else
			RMCPservicePrevious= rmcpService.checked= false;
	}
	else{
		location.href = "../cgi/url_redirect.cgi?url_name=config_security_settings";
	}
}

function setUserBlockout(){
    "use strict";
	Loading(true);
	var url= '/cgi/config_user_blockout.cgi';
	var pars= 'time_stamp='+ (new Date());
	var ajax_data= "<?xml version=\"1.0\"?>\n"+
			"<IPMI>\n"+
            "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
			"<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
			"<BLOCKOUT>\n"+
			"<BADTHRESHOLD>"+parseInt(failedAttempts.value)+"</BADTHRESHOLD>\n"+
			"<LOCKOUTINTERVAL>"+parseInt(lockoutTime.value)+"</LOCKOUTINTERVAL>\n"+
			"</BLOCKOUT>\n"+
			"</IPMI>\n";
	var myAjax= new Ajax.Request(
				url,
				{
				method: 'update',
				contentType: 'text/xml',
				xml_data: ajax_data,
				parameters: pars,
				onComplete: UserBlockoutSeted
				});
}
function UserBlockoutSeted(originalRequest){
    "use strict";
	Loading(false);
	if(originalRequest.readyState== 4&& originalRequest.status== 200){
		var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
		var xmldoc= GetResponseXML(response);
		if(xmldoc == null){
			SessionTimeout();
			return;
		}
                //check session & privilege.
                if (CheckInvalidResult(xmldoc) < 0) {
                    return;
                }
                var result = GetXMLNodeValue(xmldoc, "RESULT");
                if (result == "FAIL") {
                    alert(lang.LANG_CONFALERT_FAILSAVE);
                    return;
                }
                getUserBlockout();
	}
}
function getUserBlockout(){
    "use strict";
	Loading(true);
	var url= '/cgi/config_user_blockout.cgi';
	var pars= 'time_stamp='+ (new Date());
	var ajax_data= GeneGenericRequestXML();
	var myAjax= new Ajax.Request(
				url,
				{
				method: 'post',
				contentType: 'text/xml',
				xml_data: ajax_data,
				parameters: pars,
				onComplete: getUserBlockoutResult
				});
}
function getUserBlockoutResult(originalRequest){
    "use strict";
	Loading(false);
	if(originalRequest.readyState== 4&& originalRequest.status== 200){
		var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
		var xmldoc= GetResponseXML(response);
		if(xmldoc== null){
			SessionTimeout();
			return;
		}
                //check session & privilege.
                if (CheckInvalidResult(xmldoc) < 0) {
                    return;
                }
		var IPMIRoot= xmldoc.documentElement;
		var failTimes= IPMIRoot.getElementsByTagName('BADTHRESHOLD')[0].childNodes[0].nodeValue;
		var blockoutTime= IPMIRoot.getElementsByTagName('LOCKOUTINTERVAL')[0].childNodes[0].nodeValue;
		FAILEDTIMESPrevious= failedAttempts.value= failTimes;
		LOCKOUTIMEPrevious= lockoutTime.value= blockoutTime;
	}
}

function setwebPortNo(){
    "use strict";
	Loading(true);
	var url= '/cgi/nsportscfg.cgi';
	var pars= 'time_stamp='+ (new Date());
	var ajax_data= "<?xml version=\"1.0\"?>\n"+
			"<IPMI>\n"+
            "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
			"<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
			"<PORT_INFO HTTPS_PORT=\""+ parseInt(httpsPort.value)+
				"\" isRestart=\""+ isRestart()+
				"\"/>\n"+
			"</IPMI>\n";
	var myAjax= new Ajax.Request(
				url,
				{method: 'update',
				contentType: 'text/xml',
				xml_data: ajax_data,
				parameters: pars, onComplete: redirectLogin});
}

function redirectLogin(originalRequest) {
    "use strict";
	Loading(false);
	var redirect_url = location.host;
	if(!isRestart()){
		if(originalRequest.readyState== 4&& originalRequest.status== 200){
			var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
			getwebPortNo();
			setHttpServices();
		}
	}
	//if(originalRequest.readyState== 4&& originalRequest.status== 200){
	//	var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
		var colon_pos = redirect_url.indexOf(":");
		if(colon_pos >= 0) {
			var temp = redirect_url.substring(0, colon_pos);
			redirect_url = temp;
		}

		if(HTTPsPORTPrevious != httpsPort.value){
			redirect_url = window.location.protocol + "//" + redirect_url + ":" + httpsPort.value;
			setTimeout(function() {top.location.assign(redirect_url);}, 2500);
		}
		else{
			location.href = "../cgi/url_redirect.cgi?url_name=config_security_settings";
		}
		//alert(lang.CONF_SECUR_SET_OK);
		//getServicesStatus();
	//}
}

function getwebPortNo(){
    "use strict";
	Loading(true);
        var url = '/cgi/nsportscfg.cgi';
        var pars = 'time_stamp='+ (new Date());
        var ajax_data= "<?xml version=\"1.0\"?>\n"+
			"<IPMI>\n"+
            "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
			"<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
			"<PORT_INFO GET_PORT=\"1\"/>\n"+
			"</IPMI>\n";
        var myAjax = new Ajax.Request(
                                url,
                                {method: 'post',
                                contentType: 'text/xml',
                                xml_data: ajax_data,
                                parameters: pars, onComplete: webPortNoStatus});
}
function webPortNoStatus(originalRequest){
    "use strict";
	Loading(false);
        if(originalRequest.readyState== 4&& originalRequest.status== 200){
                var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
                var xmldoc= GetResponseXML(response);
                if(xmldoc== null){
                        SessionTimeout();
                        return;
                }
                var IPMIRoot=xmldoc.documentElement;
		//check session & privilege
                if (CheckInvalidResult(xmldoc) < 0) {
                    return;
                }
                var webPort=IPMIRoot.getElementsByTagName('GET_HTTP_PORT');
                var portInfo = webPort[0].getElementsByTagName('PORT_INFO');
                var httpsPortNo = portInfo[0].getAttribute('HTTPS_PORT');
		HTTPsPORTPrevious= httpsPort.value= httpsPortNo;
	}
}

function geneConfigXML(smashSSHservice, solSSHservice,
                       HTTPS_Service, HTTP_Service,
                       RMCPservice, RMservice,
                       NOTsmashSSHservice, NOTsolSSHservice,
                       NOTHTTPservice, NOTHTTPsrv,
                       NOTRMCPservice, NOTRMservice)
{
    "use strict";
	//<?xml version="1.0"?>
        //<IPMI>
        //    <TOTAL_NUMBER LAN="0" USER="0"/>
        //    <LAN_IF SHAREMODE_EN="0" FAILOVER_EN="0" INTERFACE="0" INTERFACE_EN="0"/>
        //</IPMI>

	var result = "";
        result += "<?xml version=\"1.0\"?>\n";
        result += "<IPMI>\n";
        result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
        result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
        result += "    <NETWORK_SERVICE>\n";
        result += "        <SET_STATUS_ENABLED SMASH_SSH_SERVICE=\""+ smashSSHservice+ "\"";
        result += "                            SOL_SSH_SERVICE=\""+ solSSHservice+ "\"";
        result += "                            HTTPS_SERVICE=\""+ HTTPS_Service+ "\"";
        result += "                            HTTP_SERVICE=\""+ HTTP_Service+ "\"";
        result += "                            RM_SERVICE=\""+ RMservice+ "\"";
        result += "                            RMCP_SERVICE=\""+ RMCPservice+ "\"/>\n";
        result += "        <SET_STATUS_DISABLED SMASH_SSH_SERVICE=\""+ NOTsmashSSHservice+ "\"";
        result += "                             SOL_SSH_SERVICE=\""+ NOTsolSSHservice+ "\"";
        result += "                             HTTPS_SERVICE=\""+ NOTHTTPservice+ "\"";
        result += "                             HTTP_SERVICE=\""+ NOTHTTPsrv+ "\"";
        result += "                             RM_SERVICE=\""+ NOTRMservice+ "\"";
        result += "                             RMCP_SERVICE=\""+ NOTRMCPservice+ "\"/>\n";
        result += "    </NETWORK_SERVICE>\n";
        result += "</IPMI>\n";
        return result;
}

function isRestart(){
    "use strict";
	if(HTTPsPORTPrevious == httpsPort.value){
		return 0;
	}
	else
		return 1;
}
