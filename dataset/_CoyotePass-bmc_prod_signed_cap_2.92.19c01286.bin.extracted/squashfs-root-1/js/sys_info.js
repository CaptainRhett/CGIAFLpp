"use strict";
/* system information page */

var lang;
var current_state;
var action;
var rmm_key_status;
var dev_ave;
var bios_id;
var boot_fw_rev;
var sdr_rev;
var me_rev;
var baseboard_sn;
var LEDHealthGreen;
var LEDFaultAmber;
var LEDIDBlue;
var var_sess_timeout;
var var_fw_rev;
var var_bak_fw_rev;
var var_build_time;
var var_capture_preview;
var image;
var var_sess_timeout;
var srcName;
var state_to_expect = 0xf;
var MaxRetries = 5;
var DisableOperate = 1;
var UseExternalBMC = 0;

window.addEventListener('load', PageInit);

if (parent.lang) { lang = parent.lang; }

var msgCableChkBMC = lang.LANG_CHASSIS_CHECK1;
var msgCableChkFeature = lang.LANG_CHASSIS_CHECK2;

function PageInit()
{
    "use strict";
    document.getElementById("soft_lice").hide();
    document.getElementById("rmm_key").hide();
    rmm_key_status = document.getElementById("rmm_key_status");
    dev_ave = document.getElementById("dev_ave");
    bios_id = document.getElementById("bios_id");
    boot_fw_rev = document.getElementById("boot_fw_rev");
    sdr_rev = document.getElementById("sdr_rev");
    me_rev = document.getElementById("me_rev");
    baseboard_sn = document.getElementById("baseboard_sn");
    LEDHealthGreen = document.getElementById("LEDHealthGreen");
    LEDFaultAmber = document.getElementById("LEDFaultAmber");
    LEDIDBlue = document.getElementById("LEDIDBlue");

    OutputString();

    var_fw_rev=document.getElementById("fw_rev");
    var_bak_fw_rev=document.getElementById("backup_fw_rev");
    var_build_time=document.getElementById("build_time");
    var_capture_preview=document.getElementById("capture_preview");
    var_capture_preview.value = lang.LANG_SYS_INFO_REFRESH_PREVIEW_IMG;
    image = document.getElementById('img1');

    var_sess_timeout=document.getElementById("session_timeout_opt1");
    image.onmouseover = function()
    {
        "use strict";
        image.style.cursor = 'pointer';
        return;
    }
    var_capture_preview.onclick = CapturePreviewTask;
    if(browser_ie)
    {
        var_sess_timeout.add(new Option('30 '+lang.CONF_LOGIN_STR_WEB_UNIT_MINUTES,30), 0);
        var_sess_timeout.add(new Option('1 '+lang.CONF_LOGIN_STR_WEB_UNIT_HOUR,60), 1);
        var_sess_timeout.add(new Option('2 '+lang.CONF_LOGIN_STR_WEB_UNIT_HOUR,120), 2);
        var_sess_timeout.add(new Option('4 '+lang.CONF_LOGIN_STR_WEB_UNIT_HOUR,240), 3);
        var_sess_timeout.add(new Option('8 '+lang.CONF_LOGIN_STR_WEB_UNIT_HOUR,480), 4);
        var_sess_timeout.add(new Option('1 '+lang.CONF_LOGIN_STR_WEB_UNIT_DAY,1440), 5);
        var_sess_timeout.add(new Option(lang.CONF_LOGIN_STR_WEB_TIMEOUT_DISABLE,0), 6);
    } else {
        var_sess_timeout.add(new Option('30 '+lang.CONF_LOGIN_STR_WEB_UNIT_MINUTES,30), null);
        var_sess_timeout.add(new Option('1 '+lang.CONF_LOGIN_STR_WEB_UNIT_HOUR,60), null);
        var_sess_timeout.add(new Option('2 '+lang.CONF_LOGIN_STR_WEB_UNIT_HOUR,120), null);
        var_sess_timeout.add(new Option('4 '+lang.CONF_LOGIN_STR_WEB_UNIT_HOUR,240), null);
        var_sess_timeout.add(new Option('8 '+lang.CONF_LOGIN_STR_WEB_UNIT_HOUR,480), null);
        var_sess_timeout.add(new Option('1 '+lang.CONF_LOGIN_STR_WEB_UNIT_DAY,1440), null);
        var_sess_timeout.add(new Option(lang.CONF_LOGIN_STR_WEB_TIMEOUT_DISABLE,0), null);
    }
    var cookie_sess_timeout  = ReadSessionStorage("SESSIONTIMEOUT");
    if(cookie_sess_timeout == null) {
        var_sess_timeout.value = 30;
    } else {
        switch(cookie_sess_timeout) {
            case '30':
            case '60':
            case '120':
            case '240':
            case '480':
            case '1440':
            case '0':
                var_sess_timeout.value = ReadSessionStorage("SESSIONTIMEOUT");
                break;
            default:
                var_sess_timeout.value = 30;
        }
    }
    var_sess_timeout.onchange = function() {
        "use strict";
        var timeout = var_sess_timeout.value;
        switch(timeout) {
            case '240':
                timeout = 0xc1;
                break;
            case '480':
                timeout = 0xc2;
                break;
            case '1440':
                timeout = 0xc3;
                break;
        }

        var url = '/cgi/config_session_timeout.cgi';
        var ajax_data = '';
        ajax_data += "<?xml version=\"1.0\"?>\n";
        ajax_data += "<IPMI>\n";
        ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
        ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
        ajax_data += "    <SESSIONINFO>\n";
        ajax_data += "        <TOUTTIME>" + timeout + "</TOUTTIME>\n";
        ajax_data += "    </SESSIONINFO>\n";
        ajax_data += "</IPMI>\n";
        Loading(true);
        var myAjax = new Ajax.Request(
                url,
                {  method: 'update',
                   contentType: "text/xml",
                   xml_data: ajax_data,
                   timeout: g_CGIRequestTimeout,
                   ontimeout: onCGIRequestTimeout,
                   onComplete: ConfigWebSessionHandler
                });
    }
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_SYS_INFO_CAPTION;
    document.getElementById("caption_legend").textContent = lang.LANG_SYS_INFO_CAPTION;
    document.getElementById("host_pwr_st_label").textContent = lang.LANG_SYS_INFO_HOST_PWR_ST;
    document.getElementById("soft_license_st_label").textContent = lang.LANG_SYS_INFO_SOFT_LICENSE_ST;
    document.getElementById("rmm_key_module_label").textContent = lang.LANG_SYS_INFO_RMM_KEY_MODULE;
    document.getElementById("dev_ave_label").textContent = lang.LANG_SYS_INFO_DEV_AVE;
    document.getElementById("build_time_label").textContent = lang.LANG_SYS_INFO_BUILD_TIME;
    document.getElementById("bios_id_label").textContent = lang.LANG_SYS_INFO_BIOS_ID;
    document.getElementById("fw_rev_label").textContent = lang.LANG_SYS_INFO_FW_REV;
    document.getElementById("back_fw_label").textContent = lang.LANG_SYS_INFO_BAK_FW_REV;
    document.getElementById("boot_fw_label").textContent = lang.LANG_SYS_INFO_BOOT_FW_REV;
    document.getElementById("sdr_pkg_rev_label").textContent = lang.LANG_SYS_INFO_SDR_PKG_REV;
    document.getElementById("mw_fw_rev_label").textContent = lang.LANG_SYS_INFO_ME_FW_REV;
    document.getElementById("baseboard_sn_no_label").textContent = lang.LANG_SYS_INFO_BASEBOARD_SN_NO;
    document.getElementById("sys_health_label").textContent = lang.LANG_SYS_INFO_OVERALL_SYS_HEALTH;
    document.getElementById("sess_timeout_legend").textContent = lang.LANG_SYS_INFO_USER_SESS_TIMEOUT;
    document.getElementById("remote_console_legend").textContent = lang.LANG_SYS_INFO_REMOTE_CONSOLE_GROUP;
    document.getElementById("web_timeout_legend").textContent = lang.CONF_LOGIN_STR_WEB_TIMEOUT;
}

function ConfigWebSessionHandler(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }
        var IPMIRoot = xmldoc.documentElement; //point to IPMI

        //check session & privilege
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var RESULT = GetXMLNodeValue(xmldoc, "RESULT");
        if (RESULT == 'OK') {
            alert(lang.LANG_CONFIG_WEBSESSION_TIMEOUT_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS});
            checkSessionExpired();
            parent.resetIdleTimer();
        } else {
            alert(lang.LANG_CONFIG_WEBSESSION_TIMEOUT_FAIL);
            return;
        }
    }
}
function PrivilegeCallBack(Privilege)
{
    "use strict";
    //full access
    if(Privilege == '04')
    {
        DisableOperate = 0;
        var_sess_timeout.disabled = false;
        //GetJNLPRequest(image, 0);
        GetSystemInfo(0);
        GetSystemHealth();
        getPwrStatus();
        getSwlStatus(SwlCallBack);
        requestKCSMode();
    }
    else if(Privilege == '03')
    {
        DisableOperate = 1;
        //GetJNLPRequest(image, 0);
        var_capture_preview.disabled = true;
        var_sess_timeout.disabled = true;
        GetSystemInfo(0);
        GetSystemHealth();
        getPwrStatus();
        getSwlStatus(SwlCallBack);
        requestKCSMode();
    }
    //only view
    else if(Privilege == '02')
    {
        DisableOperate = 1;
        var_capture_preview.disabled = true;
        var_sess_timeout.disabled = true;
        GetSystemInfo(0);
        GetSystemHealth();
        getPwrStatus();
        getSwlStatus(SwlCallBack);
        requestKCSMode();
    }
    //no access
    else
    {
        location.href = SubMainPage;
        var_capture_preview.disabled = true;
        var_sess_timeout.disabled = true;
        return;
    }
}
function GetSystemInfo(get_preview)
{
    "use strict";
    Loading(true);
    if(get_preview == 1) {
        /*
        var_capture_preview.disabled = true;
        var ajax_url = '/cgi/CapturePreview.cgi';
        var ajax_param = 'IKVM_PREVIEW.XML=(0,0)&time_stamp='+(new Date());
        var ajax_req = new Ajax.Request(
                     ajax_url,
                     {method: 'get',parameters:ajax_param}//register callback function
                     );
        setTimeout(ReloadImage,3000);*/
    }
    var ajax_url = '/cgi/getsysteminfo.cgi';
    var ajax_param = 'time_stamp='+(new Date());
    var ajax_data= GeneGenericRequestXML();
    //console.log(">>>> GetSystemInfo() with XML:" + ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
            method: 'post',
            contentType: 'text/xml',
            xml_data: ajax_data,
            parameters:ajax_param,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            onComplete: onSystemInfoResponse}//register callback function
            );

    //GetRMMKeyStatus();
    GetRMMKeyStatus(RMMCallBack);
}

function SystemHealthHandler(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }
        /*
        <?xml version="1.0"?>
        <IPMI>
            <GET_SYSTEMHEALTH>
                <LED_STATUS GREEN_LED_STATUS="0" AMBER_LED_STATUS="1" BLUE_LED_STATUS="2"/>
            </GET_SYSTEMHEALTH>
        </IPMI>

        GREEN_LED_STATUS = 0h mean that LED Green not light
        GREEN_LED_STATUS = 1h mean that LED Solid Green
        GREEN_LED_STATUS = 2h mean that LED Blinking Green

        icon file mapping
        ex:
        green_0.gif --> Green not light
        green_1.gif --> Blinking Green
        green_2.gif --> Solid Green
        */

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;//point to IPMI
        var ledstatus = IPMIRoot.getElementsByTagName("LED_STATUS");
        var greenLed = ledstatus[0].getAttribute("GREEN_LED_STATUS");
        var amberLed = ledstatus[0].getAttribute("AMBER_LED_STATUS");
        var blueLed = ledstatus[0].getAttribute("BLUE_LED_STATUS");

        var green_img = document.createElement('IMG');
        srcName = "../images/green_" + greenLed + ".gif";
        green_img.setAttribute('src', srcName);
        LEDHealthGreen.appendChild(green_img);

        var amber_img = document.createElement('IMG');
        srcName = "../images/amber_" + amberLed + ".gif";
        amber_img.setAttribute('src', srcName);
        LEDFaultAmber.appendChild(amber_img);

        var blue_img = document.createElement('IMG');
        srcName = "../images/blue_" + blueLed + ".gif";
        blue_img.setAttribute('src', srcName);
        LEDIDBlue.appendChild(blue_img);
    }
}

function GetSystemHealth()
{
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/getsyshealthled.cgi';
    var ajax_data= GeneGenericRequestXML();
    //alert(ajax_data);
    //console.log(">>>> GetSystemHealth() with TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
            method: 'post',
            contentType: 'text/xml',
            xml_data: ajax_data,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            onComplete: SystemHealthHandler}//register callback function
            );
}

function getPwrStatus()
{
    "use strict";
    Loading(true);
    var url = '../cgi/server_power_control.cgi';
    var ajax_data = '';
        ajax_data += "<?xml version=\"1.0\"?>\n";
        ajax_data += "<POSTDATA>\n";
        ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
        ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
        ajax_data += "    <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>\n";
        ajax_data += "    <PARAMETERS>\n";
        ajax_data += "        <GET_CHASSIS_STATUS>1</GET_CHASSIS_STATUS>\n";
        ajax_data += "    </PARAMETERS>\n";
        ajax_data += "</POSTDATA>\n";
    //alert(ajax_data);
    //console.log(">>>> GetPwrStatus() with TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    var myAjax = new Ajax.Request(
                url,
                {
                    method: 'post',
                    contentType: "text/xml",
                    xml_data: ajax_data,
                    timeout: g_CGIRequestTimeout,
                    ontimeout: onCGIRequestTimeout,
                    onComplete: getPwrStatusHandler
                });
}

function getPwrStatusHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;//point to IPMI
        var POWER_INFO = IPMIRoot.getElementsByTagName('POWER_INFO');//point to SENSOR_INFO
        var POWER = POWER_INFO[0].getElementsByTagName('POWER');
        var pwrStatus = POWER[0].getAttribute("STATUS");
        var currentPwrStatus = (pwrStatus == "OFF") ? 0 : 1;
        var host_pwr_st = document.getElementById("host_pwr_st");

        if(currentPwrStatus == 0)
        {
            host_pwr_st.textContent = lang.LANG_S_POWER_CONTROL_STATUS_OFF;
            host_pwr_st.className = 'labeltext text_power_state_off';
            host_pwr_st.style.color = "#990000";
            host_pwr_st.style.fontWeight = "bold";
        }
        else
        {
            host_pwr_st.textContent = lang.LANG_S_POWER_CONTROL_STATUS_ON;
            host_pwr_st.className = 'labeltext text_power_state_on';
            host_pwr_st.style.color = "#009900";
            host_pwr_st.style.fontWeight = "bold";
        }
    }
}

function SwlCallBack(swl_type, swl_status)
{
    if (swl_type == "SWLIC") {
        document.getElementById("soft_lice").show();

        if (swl_status == "ACTIVED") {
            document.getElementById("soft_license_st").textContent = lang.LANG_CONFIG_SOFT_LICENSE_ACTIVED;
        } else {
            document.getElementById("soft_license_st").textContent = lang.LANG_CONFIG_SOFT_LICENSE_UNACTIVE;
        }
        top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/sys_info_hlp_2.html";
    } else {
        document.getElementById("rmm_key").show();
        top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/sys_info_hlp.html";
    }
}

function ReloadImage()
{
    "use strict";
    image.src='/images/Snapshot.bmp?ts='+new Date().getTime();
    setTimeout(DisplayImage,1000);
}

function DisplayImage()
{
    "use strict";
    Loading(true);
    image.style.visibility = 'visible';
    var_capture_preview.disabled = false;
    Loading(false);
}

function CapturePreviewTask()
{
    "use strict";
    image.style.visibility = 'hidden';
    var_capture_preview.disabled = true;
    var ajax_url = '/cgi/CapturePreview.cgi';
    var ajax_param = 'IKVM_PREVIEW.XML=(0,0)&time_stamp='+(new Date());
    var ajax_req = new Ajax.Request(ajax_url,
                                    {
                                        method: 'get',
                                        parameters:ajax_param,
                                        timeout: g_CGIRequestTimeout,
                                        ontimeout: onCGIRequestTimeout
                                    });

    setTimeout(ReloadImage,3000);
}
function onSystemInfoResponse(originalRequest)
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
        }
        //check session & privilege result
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;
        var SYSTEM_INFO = IPMIRoot.getElementsByTagName('SYSTEM_INFO');//point to SYSTEM_INFO
        var SYSTEM = SYSTEM_INFO[0].getElementsByTagName('SYSTEM');
        var dev_available = SYSTEM[0].getAttribute("DEVICE_AVAILABLE");
        var fw_bldtime = SYSTEM[0].getAttribute("IPMIFW_BLDTIME");
        var biosID = SYSTEM[0].getAttribute("BIOS_ID");
        var fw_version = SYSTEM[0].getAttribute("BMCFW_VERSION");
        var bak_fw_version = SYSTEM[0].getAttribute("BACKUP_BMCFW_VERSION");
        var bootfw_rev = SYSTEM[0].getAttribute("BOOTFW_VERSION");
        var sdrRev = SYSTEM[0].getAttribute("SDR_VERSION");
        var meVer = SYSTEM[0].getAttribute("ME_VERSION");
        var baseboardSN = SYSTEM[0].getAttribute("BASEBOARD_SN");

        dev_ave.textContent = dev_available;
        var_build_time.textContent = fw_bldtime;
        bios_id.textContent = biosID;
        var_fw_rev.textContent = fw_version;
        var_bak_fw_rev.textContent = bak_fw_version;
        boot_fw_rev.textContent = bootfw_rev;
        sdr_rev.textContent = sdrRev;
        me_rev.textContent = meVer;
        baseboard_sn.textContent = atob(baseboardSN.replace(/\s+$/, ''));
    }
}

function RMMCallBack(Mode) {
    "use strict";
    if(Mode == "OFF")
        rmm_key_status.textContent = lang.LANG_SYS_INFO_RMM_KEY_MODULE_NOT_INSTALLED;
    else if(Mode == "ON")
        rmm_key_status.textContent = lang.LANG_SYS_INFO_RMM_KEY_MODULE_INSTALLED;
    else
        rmm_key_status.textContent = lang.LANG_SYS_INFO_RMM_KEY_MODULE_UNKNOW;
}
