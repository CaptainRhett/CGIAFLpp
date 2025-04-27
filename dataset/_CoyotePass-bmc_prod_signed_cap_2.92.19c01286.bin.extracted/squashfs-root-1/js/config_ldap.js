"use strict";
var CONFPAGE = "../cgi/url_redirect.cgi?url_name=configuration";
var LDAP_SSL_Enable = false;
var LDAP_SSL_Port = 0;
var EnableLDAPSwitch;
var EnableLDAPoverSSL;
var LDPort;
var LDIP;
var LDBinPW;
var LDBinDN;
var LDBase;
var LDGrpFilter;
var LDOperFilter;
var LDUserFilter;
var LDSave;
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_ldap_hlp.html";
    document.getElementById("ButtonSave").value = lang.LANG_CONFIG_LDAP_SAVE;
    EnableLDAPSwitch = document.getElementById("SwitchLDAP");
    EnableLDAPSwitch.addEventListener("click", onLDAPEnable);

    EnableLDAPoverSSL = document.getElementById("enLDAPSSL");
    EnableLDAPoverSSL.addEventListener("click", checkSSL);

    LDPort = document.getElementById("LDAPPORT");
    LDIP = document.getElementById("LDAPIP");
    LDBinPW = document.getElementById("LDAPBINDPW");
    LDBinDN = document.getElementById("LDAPBINDWN");
    LDBase = document.getElementById("LDAPBASE");
    LDGrpFilter = document.getElementById("ADMINGRPFILTER");
    LDOperFilter = document.getElementById("OPERGRPFILTER");
    LDUserFilter = document.getElementById("USERGRPFILTER");

    LDSave = document.getElementById("ButtonSave");
    LDSave.addEventListener("click", saveLDAPconfig);

    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_CONFIG_LDAP_CAPTION;
    document.getElementById("ldap_en_span").textContent = lang.LANG_CONFIG_LDAP_EN;
    document.getElementById("ladp_ssl_span").textContent = lang.LANG_CONFIG_LDAP_SSL;
    document.getElementById("ldap_port_span").textContent = lang.LANG_CONFIG_LDAP_PORT;
    document.getElementById("ldap_ip_span").textContent = lang.LANG_CONFIG_LDAP_IP;
    document.getElementById("ldap_pwd_span").textContent = lang.LANG_CONFIG_LDAP_PWD;
    document.getElementById("ldap_dn_span").textContent = lang.LANG_CONFIG_LDAP_DN;
    document.getElementById("ldap_sb_span").textContent = lang.LANG_CONFIG_LDAP_SB;
    document.getElementById("ldap_gf0_span").textContent = lang.LANG_CONFIG_LDAP_ARF;
    document.getElementById("ldap_gf1_span").textContent = lang.LANG_CONFIG_LDAP_ORF;
    document.getElementById("ldap_gf2_span").textContent = lang.LANG_CONFIG_LDAP_URF;
    document.getElementById("ldap_gf_header_span").textContent = lang.LANG_CONFIG_LDAP_GF_TITLE;
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if(Privilege == '04') {
        requestReadLDAPInfo();
    }
    else if(Privilege == '03' || Privilege == '02') {
        //alert(lang.LANG_CONFIG_LDAP_NOPRIVI);
        LDSave.disabled = true;
        requestReadLDAPInfo();
    }
    else {
        location.href = SubMainPage;
        return;
    }
}

function geneXML(ssl_en, ip, enable, port, base, bind, password, ldap_grp_filter,ldap_oper_filter,ldap_user_filter,ldap_callbk_filter) {
    "use strict";
    //<?xml version="1.0"?>
    //<IPMI>
    //    <LDAP LDAP_SSL="0" LDAP_IP="172.018.004.218" LDAP_EN="1" LDAP_PORT="00389" BASE_DN="ou=insyde, dc=bmc, dc=com" BINDDN="dc=bmc, dc=com" BIND_PWD="password"/>
    //</IPMI>
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <LDAP LDAP_SSL=\"" + ssl_en + "\"";
    result += " LDAP_IP=\"" + ip + "\"";
    result += " LDAP_EN=\"" + enable + "\"";
    result += " LDAP_PORT=\"" + port + "\"";
    result += " BASE_DN=\"" + base + "\"";
    result += " BINDDN=\"" + bind + "\"";
    result += " BIND_PWD=\"" + password + "\"";
    result += " GROUP_FILTER_0=\"" + escape(ldap_grp_filter) + "\"";
    result += " GROUP_FILTER_1=\"" + escape(ldap_oper_filter) + "\"";
    result += " GROUP_FILTER_2=\"" + escape(ldap_user_filter) + "\"";
    result += "/>\n"
    result += "</IPMI>\n";
    return result;
}

function requestReadLDAPInfo()
{
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/netldapcfg.cgi';
    var ajax_param = '';
    var ajax_data = geneXML("0", "0", "0", "0", "0", "0", "0", "0", "0", "0");
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'POST',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      onComplete: responseLDAPInfo }//register callback function
                                   );
}

function responseWriteLDAPInfo(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        var result = "FAIL";
        if(xmldoc != null) {
            result = GetXMLNodeValue(xmldoc, "RESULT");
            result = result.toLowerCase();
        }
        if(result == "ok") {
            alert(lang.LANG_CONFIG_LDAP_UPDATE_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS});
        }
        else if(result == "SESSION_INVALID") {
            ClearInvalidSession();
        }
        else {
            alert(lang.LANG_CONFIG_LDAP_UPDATE_FAIL);
            requestReadLDAPInfo();
        }
    }
}

function responseLDAPInfo(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //var response = geneXML("0", "172.0.0.111", "1", "2234", "ou=xxx, dc=com", "ou=xxx, dc=com", "12345678");
        var xmldoc = GetResponseXML(response);
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if(result == "SESSION_INVALID") {
            ClearInvalidSession();
            return;
        }

        var root = xmldoc.documentElement;
        var ldap = root.getElementsByTagName("LDAP")[0];
        var ssl_enable = ldap.getAttribute("LDAP_SSL");
        var ldap_ip    = ldap.getAttribute("LDAP_IP");
        var ldap_en    = ldap.getAttribute("LDAP_EN");
        var ldap_port  = ldap.getAttribute("LDAP_PORT");
        var ldap_base  = ldap.getAttribute("BASE_DN");
        var ldap_bind  = ldap.getAttribute("BINDN");
        var ldap_pwd   = ldap.getAttribute("BIN_PWD");
        var ldap_grp_filter   = ldap.getAttribute("GROUP_FILTER_0");
        var ldap_oper_filter   = ldap.getAttribute("GROUP_FILTER_1");
        var ldap_user_filter   = ldap.getAttribute("GROUP_FILTER_2");

        if(ldap_en == "1") {
            EnableLDAPSwitch.checked = true;
        }
        else {
            EnableLDAPSwitch.checked = false;
        }
        enableLDAPInfos(EnableLDAPSwitch.checked);

        if(ssl_enable == "1") {
            EnableLDAPoverSSL.checked = true;
        }
        else {
            EnableLDAPoverSSL.checked = false;
        }
        LDAP_SSL_Enable = EnableLDAPoverSSL.checked;
        LDAP_SSL_Port = ldap_port;

        LDIP.value = ldap_ip;
        LDPort.value = ldap_port;
        LDBinPW.value = ldap_pwd;
        LDBinDN.value = ldap_bind;
        LDBase.value = ldap_base;
        LDGrpFilter.value = ldap_grp_filter;
        LDOperFilter.value = ldap_oper_filter;
        LDUserFilter.value = ldap_user_filter;
    }
}

function saveLDAPconfig()
{
    "use strict";
    var ldap_en = "0";
    var ssl_enable = "0";
    var ldap_ip = "0.0.0.0";
    var ldap_port = "0";
    var ldap_pwd = "0000";
    var ldap_bind = "0";
    var ldap_base = "0";
    var ldap_grp_filter = "0";
    var ldap_oper_filter = "0";
    var ldap_user_filter = "0";

    if(EnableLDAPSwitch.checked == true) {
        ldap_en = "1";
    }
    if(EnableLDAPoverSSL.checked == true) {
        ssl_enable = "1";
    }

    ldap_ip = LDIP.value;
    ldap_port = LDPort.value;
    ldap_pwd = LDBinPW.value;
    ldap_bind = LDBinDN.value;
    ldap_base = LDBase.value;
    ldap_grp_filter = LDGrpFilter.value;
    ldap_oper_filter = LDOperFilter.value;
    ldap_user_filter = LDUserFilter.value;

    /* Query filter must contain '%s' to append the username. */
    if((ldap_grp_filter.length != 0)&& (ldap_grp_filter.search("%s") == -1))
    {
        alert(lang.LANG_CONFIG_LDAP_INVALID_GROUP);
        return;
    }
    if((ldap_oper_filter.length != 0)&& (ldap_oper_filter.search("%s") == -1))
    {
        alert(lang.LANG_CONFIG_LDAP_INVALID_GROUP);
        return;
    }
    if((ldap_user_filter.length != 0)&& (ldap_user_filter.search("%s") == -1))
    {
        alert(lang.LANG_CONFIG_LDAP_INVALID_GROUP);
        return;
    }

    var ajax_url = '../cgi/netldapcfg.cgi';
    var ajax_param = '';
    var ajax_data = geneXML(ssl_enable, ldap_ip, ldap_en, ldap_port, ldap_base, ldap_bind, ldap_pwd, ldap_grp_filter, ldap_oper_filter, ldap_user_filter);
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'PUT',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                onComplete: responseWriteLDAPInfo }//register callback function
            );

}

function saveresult(originalRequest)
{
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        alert(lang.LANG_CONFIG_LDAP_SUCCSAVE, {title: lang.LANG_GENERAL_SUCCESS});
      requestReadLDAPInfo();
    }
    else {
       alert(lang.LANG_COMMON_UNSAVE);
    }
}

function enableLDAPInfos(enable) {
    "use strict";
    EnableLDAPoverSSL.disabled = !enable;
    LDPort.disabled = !enable;
    LDIP.disabled = !enable;
    LDBinPW.disabled = !enable;
    LDBinDN.disabled = !enable;
    LDBase.disabled = !enable;
    LDGrpFilter.disabled = !enable;
    LDOperFilter.disabled = !enable;
    LDUserFilter.disabled = !enable;
}

function onLDAPEnable() {
    "use strict";
    enableLDAPInfos(EnableLDAPSwitch.checked);
}

function checkSSL()
{
    "use strict";
    if(EnableLDAPoverSSL.checked == LDAP_SSL_Enable) {
        LDPort.value = LDAP_SSL_Port;
    }
    else if(EnableLDAPoverSSL.checked == true) {
        LDPort.value = '636';
    }
    else {
        LDPort.value = '389';
    }
}
