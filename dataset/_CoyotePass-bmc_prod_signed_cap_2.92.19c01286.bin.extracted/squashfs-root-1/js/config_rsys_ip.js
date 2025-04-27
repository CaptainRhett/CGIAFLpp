"use strict";
/* configuration firmware update page */
var lang;

(function($) {
"use strict";

$( document ).ready(function() { $.PageInit(); });
if (parent.lang) { lang = parent.lang; }

$.PageInit = function() {
    "use strict";
    document.title = lang.LANG_CONFIG_SUBMENU_FWUPD;
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/config_sysrd_ip_hlp.html";
    $("#saveBtn").attr("value", lang.LANG_AD_ADV_SAVE).click(RsysIp_update);
    $("#enable_remote_syslog").change(function() {
        var objEnable = document.getElementById("enable_remote_syslog");
        if(objEnable.checked == true) {
            $('#newRsysIp').attr("disabled", false);
        }else{
            $('#newRsysIp').val('');
            $('#newRsysIp').attr("disabled", true);
        }
    });
    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function updateInfo() {
    "use strict";
    GetRsysIpInfo();
}


function OutputString() {
    "use strict";
    document.getElementById("submenu_div").textContent = lang.LANG_CONFIG_SUBMENU_RSYS_LOG_IP;
    document.getElementById("desc_p").textContent = lang.LANG_CONFIG_RSYS_LOG_IP_DESC;
    document.getElementById("submenu_legend").textContent = lang.LANG_CONFIG_SUBMENU_RSYS_LOG_IP;
    document.getElementById("current_rsys_ip_address").textContent = lang.LANG_SYS_INFO_CURRENT_RSYS_LOG_ADDRESS;
    document.getElementById("new_rsys_ip_address").textContent = lang.LANG_SYS_INFO_NEW_RSYS_LOG_ADDRESS;
    document.getElementById("enable_remote_syslog_header").textContent = lang.LANG_ENABLE_SYSLOG_SERVER_HEADER;
    document.getElementById("syslog_server_port_header").textContent=lang.LANG_SYSLOG_SERVER_PORT;
}

function PrivilegeCallBack(Privilege){
    "use strict";
    //full access
    var saveBtn = $("#saveBtn");
    var newRsysip = $('#newRsysIp');
    if(Privilege == '04')
    {
        saveBtn.prop("disabled", false);
        newRsysip.attr("disabled", true);
        updateInfo();
    }
    //only view
    else if(Privilege == '03' || Privilege == '02')
    {
        saveBtn.prop("disabled", true);
        newRsysip.attr("disabled", true);
        updateInfo();
    }
    //no access
    else
    {
        location.href = SubMainPage;
        saveBtn.prop("disabled", true);
        newRsysip.attr("disabled", true);
    }
}


function GetRsysIpInfo()
{
    "use strict";
    Loading(true);
    var ajax_url = '/cgi/config_sysrd_ip.cgi';
    var ajax_data = GeneGenericRequestXML();
    var ajax_param= 'timestamp='+(new Date());
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
            method: 'post',
            contentType: 'text/xml',
            xml_data: ajax_data,
            parameters:ajax_param,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            onComplete: ParseRsysIp}//register callback function
            );
}



function ParseRsysIp(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj=GetResponseXML(response);
        if(xml_obj == null)
        {
            SessionTimeout();
            return;
        }else{
           //check session & privilege result
           if(CheckInvalidResult(xml_obj) < 0) {
               return;
           }
           var result = GetXMLNodeValue(xml_obj, "RESULT");
           if(result == "FAIL") {
                $('#curRsysIp').text("0.0.0.0");
                $('#newRsysip').attr("disabled", true);
                $('#enable_remote_syslog').attr('checked',false);
                $('#newRsysIp').attr("disabled", true);
                return;
           }
            var IPMIRoot = xml_obj.documentElement;
            var SYSTEM_INFO = IPMIRoot.getElementsByTagName('SYSRD_INFO');//point to SYSTEM_INFO
            var SYSRD_ENABLE=SYSTEM_INFO[0].getAttribute("SYSRD_EN");
            var SYSRD_IP = SYSTEM_INFO[0].getAttribute("IP");
            if(SYSRD_ENABLE=="1"){
                $('#curRsysIp').text(SYSRD_IP);
                $('#newRsysip').attr("disabled", false);
                $('#enable_remote_syslog').attr('checked',true);
                $('#newRsysIp').attr("disabled", false);
            }else {
                $('#curRsysIp').text("0.0.0.0");
                $('#newRsysip').attr("disabled", true);
                $('#enable_remote_syslog').attr('checked',false);
                $('#newRsysIp').attr("disabled", true);
            }
        }

    }
}


function generate_config_xml(ip,enable_state){
    "use strict";
    var result ="";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <SYSRD_INFO ENABLE=\"" + enable_state + "\" IP=\"" + ip + "\"/>\n";
    result += "</IPMI>\n";
    return result;
}

function updateconfig(response) {
    "use strict";
    Loading(false);
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);
        if(xml_obj != null) {
            var result = GetXMLNodeValue(xml_obj, "RESULT");
            if(result == "OK") {
                var item = document.getElementById("enable_remote_syslog");
                if(item.checked==true){
                    var ipAddr=$('#newRsysIp').val();
                    $('#curRsysIp').text(ipAddr);
                    alert(lang.LANG_CONF_SYSRD_IP_UPDATE_SUCCESS);
                }
                else{
                    $('#curRsysIp').text('0.0.0.0');
                    alert(lang.LANG_CONF_SYSRD_IP_DISABLE_SUCCESS);
                }
            }
            else if(result == "SESSION_INVALID") {
                ClearInvalidSession();
            }
            else {
                alert(lang.LANG_CONF_SYSRD_IP_UPDATE_FAIL);
            }
        }
    }
}


function RsysIp_update(){
    "use strict";

	var ipAddr="0.0.0.0";
    var enable_state="0";
    var item = document.getElementById("enable_remote_syslog");
    if(item.checked==true){
        ipAddr=$('#newRsysIp').val();
        if(!CheckIP(ipAddr)){
            alert(lang.LANG_CONFIG_NETWORK_ERR_INVALID_IP);
            return;
        }
        enable_state="1";
    }

    Loading(true);
    var ajax_url = '/cgi/config_sysrd_ip.cgi';
    var ajax_data = generate_config_xml(ipAddr,enable_state);
    var ajax_param= '';
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
            method: 'UPDATE',
            contentType: 'text/xml',
            xml_data: ajax_data,
            parameters:ajax_param,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            onComplete: updateconfig}//register callback function
            );
}



})(jQuery);
