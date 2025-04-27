"use strict";
var ButtonSaveOBJ;
var ButtonSendOBJ;
var ButtonSnmpSaveOBJ;
var ButtonSnmpTrapSaveOBJ;
var lang;
var snmpSupport = true;

//var ModifyURL = "../cgi/url_redirect.cgi?url_name=modify_alert"

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit() {
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_alerts_hlp.html";

    //Grid table Init
    var AlertTable = document.getElementById("HtmlAlertTable");

    var btn = document.getElementById("_checkAllBtn");
    btn.value = lang.LANG_CONFALERT_CHECK_ALL;
    btn.addEventListener("click", onCheckAll);

    btn = document.getElementById("_clearAllBtn");
    btn.value = lang.LANG_CONFALERT_CLEAR_ALL;
    btn.addEventListener("click", onClearAll);

    btn = document.getElementById("_saveBtn");
    btn.value = lang.LANG_MODALERT_BTNSAVE;
    btn.addEventListener("click", onSave);

    btn = document.getElementById("_alert_dest1_snmp");
    btn.addEventListener("click", function() {
        onChangeAlertDestination("1", "snmp")
    });

    btn = document.getElementById("_alert_dest1_email");
    btn.addEventListener("click", function() {
        onChangeAlertDestination("1", "email")
    });

    btn = document.getElementById("_alert_dest2_snmp");
    btn.addEventListener("click", function() {
        onChangeAlertDestination("2", "snmp")
    });

    btn = document.getElementById("_alert_dest2_email");
    btn.addEventListener("click", function() {
        onChangeAlertDestination("2", "email")
    });

    btn = document.getElementById("_input_alert1_snmp_address");
    btn.value = "0.0.0.0";

    btn = document.getElementById("_input_alert2_snmp_address");
    btn.value = "0.0.0.0";

    btn = document.getElementById("_sendTestAlertsBtn");
    btn.value = lang.LANG_CONFALERT_BTNTESTALR;
    btn.addEventListener("click", onSendTestAlert);

    btn = document.getElementById("_input_alert1_snmp_address");
    btn.disabled = true;

    btn = document.getElementById("_input_alert1_email_address");
    btn.disabled = true;

    btn = document.getElementById("_input_alert2_snmp_address");
    btn.disabled = true;

    btn = document.getElementById("_input_alert2_email_address");
    btn.disabled = true;

    ButtonSaveOBJ = document.getElementById("_saveBtn");
    ButtonSendOBJ = document.getElementById("_sendTestAlertsBtn");

    if(snmpSupport){
        var checkbox = document.getElementById("_check_enable_snmp_server");
        checkbox.addEventListener("click", function(){
            onChangeSNMPServer(this.checked);
        });

        ButtonSnmpSaveOBJ = document.getElementById("_saveSNMPBtn");
        ButtonSnmpSaveOBJ.value = lang.LANG_CONFALERT_SNMP_SERVER_SAVE_BTN;
        ButtonSnmpSaveOBJ.addEventListener("click", onSaveSnmp);

        var btns = document.querySelectorAll("input[type='radio'][name='snmp_trap_version']");
        btns.forEach(function(btn){
            btn.addEventListener("change", function(){
                onChangeSNMPTrapVersion(this.value);
            });
        });

        ButtonSnmpTrapSaveOBJ = document.getElementById("_sendSNMPTrapBtn");
        ButtonSnmpTrapSaveOBJ.value = lang.LANG_CONFALERT_SNMP_TRAP_SAVE_BTN;
        ButtonSnmpTrapSaveOBJ.addEventListener("click", onSaveSnmpTrap);
    }

    OutputString();
    //check input format
    initCheckInputListener("_input_alert1_snmp_address", lang.LANG_CONFALERT_ALERT_SNMP_IP, INPUT_FIELD.IPV4ANDIPV6);
    initCheckInputListener("_input_alert1_email_address", lang.LANG_CONFALERT_ALERT_MAIL_TO, INPUT_FIELD.EMAIL);
    initCheckInputListener("_input_alert2_snmp_address", lang.LANG_CONFALERT_ALERT_SNMP_IP, INPUT_FIELD.IPV4ANDIPV6);
    initCheckInputListener("_input_alert2_email_address", lang.LANG_CONFALERT_ALERT_MAIL_TO, INPUT_FIELD.EMAIL);

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_CONFALERT_CAPTION;
    document.getElementById("event_filtering_lbl").textContent = lang.LANG_CONFALERT_EVENT_FILTERING;
    document.getElementById("log_event_lbl").textContent = lang.LANG_CONFALERT_LOG_EVENT;
    document.getElementById("trigger_alert_legeng").textContent = lang.LANG_CONFALERT_TRIGGER_ALERTS;
    document.getElementById("event_temperature_lbl").textContent = lang.LANG_CONFALERT_EVENT_TEMPERATURE;
    document.getElementById("event_out_of_range_lbl").textContent = lang.LANG_CONFALERT_EVENT_VOLTAGE_OUT_OF_RANGE;
    document.getElementById("fan_fail_lbl").textContent = lang.LANG_CONFALERT_EVENT_FAN_FAILURE;
    document.getElementById("chassis_instrusion_lbl").textContent = lang.LANG_CONFALERT_EVENT_CHASSIS_INSTRUSION;
    document.getElementById("psu_fail_lbl").textContent = lang.LANG_CONFALERT_EVENT_PSU_FAILURE;
    document.getElementById("memory_error_lbl").textContent = lang.LANG_CONFALERT_EVENT_MEMORY_ERROR;
    document.getElementById("post_error_lbl").textContent = lang.LANG_CONFALERT_EVENT_POST_ERROR;
    document.getElementById("frb_fail_lbl").textContent = lang.LANG_CONFALERT_EVENT_FRB_FAILURE;
    document.getElementById("nm_exception_lbl").textContent = lang.LANG_CONFALERT_EVENT_NM_EXCEPTION;
    document.getElementById("watchdog_timer_lbl").textContent = lang.LANG_CONFALERT_EVENT_WATCHDOG_TIMER;
    document.getElementById("system_restart_lbl").textContent = lang.LANG_CONFALERT_EVENT_SYSTEM_RESTART;
    document.getElementById("hdd_fail_lbl").textContent = lang.LANG_CONFALERT_EVENT_HDD_FAILURE;
    document.getElementById("redundancy_fail_lbl").textContent = lang.LANG_CONFALERT_EVENT_POWER_UNIT_REDUNDANCY_FAIL;
    document.getElementById("temp_shutdown_lbel").textContent = lang.LANG_CONFALERT_EVENT_FP_AUTO_TEMP_SHUTDOWN;
    document.getElementById("fan_redundancy_fail_lbl").textContent = lang.LANG_CONFALERT_EVENT_FAN_REDUNDANCY_FAIL;
    document.getElementById("unit_status_lbl").textContent = lang.LANG_CONFALERT_EVENT_POWER_UNIT_STATUS;
    document.getElementById("therm_trip_lbl").textContent = lang.LANG_CONFALERT_EVENT_PROCESSOR_THERM_TRIP;
    document.getElementById("dimm_therm_trip_lbl").textContent = lang.LANG_CONFALERT_EVENT_PROCESSOR_DIMM_THERM_TRIP;

    document.getElementById("liq_leakage_detection_lbl").textContent = lang.LANG_CONFALERT_EVENT_LIQ_LEAKAGE_DETECTION;
    document.getElementById("liq_leakage_shutdown_lbl").textContent = lang.LANG_CONFALERT_EVENT_LIQ_LEAKAGE_SHUTDOWN;
    document.getElementById("alert_dest1_legend").textContent = lang.LANG_CONFALERT_ALERT_DEST1;
    document.getElementById("alert_snmp_lbl").textContent = lang.LANG_CONFALERT_ALERT_SNMP;
    document.getElementById("alert_snmp_ip_lbl").textContent = lang.LANG_CONFALERT_ALERT_SNMP_IP;
    document.getElementById("alert_email_lbl").textContent = lang.LANG_CONFALERT_ALERT_EMAIL;
    document.getElementById("alert_mail_to_lbl").textContent = lang.LANG_CONFALERT_ALERT_MAIL_TO;
    document.getElementById("alert_dest2_legend").textContent = lang.LANG_CONFALERT_ALERT_DEST2;
    document.getElementById("alert2_snmp_lbl").textContent = lang.LANG_CONFALERT_ALERT_SNMP;
    document.getElementById("alert2_snmp_ip_lbl").textContent = lang.LANG_CONFALERT_ALERT_SNMP_IP;
    document.getElementById("alert2_email_lbl").textContent = lang.LANG_CONFALERT_ALERT_EMAIL;
    document.getElementById("alert2_mail_to_lbl").textContent = lang.LANG_CONFALERT_ALERT_MAIL_TO;

    if(snmpSupport){
        document.getElementById("_legend_snmp_server").textContent = lang.LANG_CONFALERT_SNMP_SERVER_LEGEND;
        document.getElementById("_label_enable_snmp_server").textContent = lang.LANG_CONFALERT_SNMP_SERVER_ENABLE;
        document.getElementById("_label_enable_snmp_v1_v2c").textContent = lang.LANG_CONFALERT_SNMP_SERVER_V1_V2C_ENABLE;
        document.getElementById("_label_ro_comm_string").textContent = lang.LANG_CONFALERT_SNMP_SERVER_RO_COMM_STR;
        document.getElementById("_label_rw_comm_string").textContent = lang.LANG_CONFALERT_SNMP_SERVER_RW_COMM_STR;
        document.getElementById("_legend_snmp_trap").textContent = lang.LANG_CONFALERT_SNMP_TRAP_LEGEND;
        document.getElementById("_label_snmp_trap_version").textContent = lang.LANG_CONFALERT_SNMP_TRAP_VERSION;
        document.getElementById("_label_snmp_trap_version_v1").textContent = lang.LANG_CONFALERT_SNMP_TRAP_VERSION_1;
        document.getElementById("_label_snmp_trap_version_v2c").textContent = lang.LANG_CONFALERT_SNMP_TRAP_VERSION_2C;
        document.getElementById("_label_snmp_trap_version_v3").textContent = lang.LANG_CONFALERT_SNMP_TRAP_VERSION_3;
        document.getElementById("_label_network_channel").textContent = lang.LANG_CONF_NETWORK_LAN_CHANNEL;
        document.getElementById("_label_snmp_trap_comm_string").textContent = lang.LANG_CONFALERT_SNMP_TRAP_COMMUNITY_STRING;
        document.getElementById("_label_snmp_trap_username").textContent = lang.LANG_CONFALERT_SNMP_TRAP_USERNAME;
        document.getElementById("_label_snmp_trap_auth_proto").textContent = lang.LANG_CONFALERT_SNMP_TRAP_AUTH_PROTOCOL;
        document.getElementById("_label_snmp_trap_auth_proto_md5").textContent = lang.LANG_CONFALERT_SNMP_TRAP_AUTH_PROTOCOL_MD5;
        document.getElementById("_label_snmp_trap_auth_proto_sha").textContent = lang.LANG_CONFALERT_SNMP_TRAP_AUTH_PROTOCOL_SHA;
        document.getElementById("_label_snmp_trap_auth_passphrase").textContent = lang.LANG_CONFALERT_SNMP_TRAP_AUTH_PASSPHRASE;
        document.getElementById("_label_snmp_trap_sec_level").textContent = lang.LANG_CONFALERT_SNMP_TRAP_SEC_LEVEL;
        document.getElementById("_label_snmp_trap_sec_level_auth_no_priv").textContent = lang.LANG_CONFALERT_SNMP_TRAP_SEC_LEVEL_AUTH_NO_PRIV;
        document.getElementById("_label_snmp_trap_sec_level_auth_priv").textContent = lang.LANG_CONFALERT_SNMP_TRAP_SEC_LEVEL_AUTH_PRIV;
        document.getElementById("_label_snmp_trap_priv_proto").textContent = lang.LANG_CONFALERT_SNMP_TRAP_PRIV_PROTOCOL;
        document.getElementById("_label_snmp_trap_priv_proto_aes").textContent = lang.LANG_CONFALERT_SNMP_TRAP_PRIV_PROTOCOL_AES;
        document.getElementById("_label_snmp_trap_priv_passphrase").textContent = lang.LANG_CONFALERT_SNMP_TRAP_PRIV_PASSPHRASE;
    }
}

function PrivilegeCallBack(Privilege) {
    "use strict";
    //full access
    if (Privilege == '04') {
        GetAlerts();
    }
    //only view
    else if (Privilege == '03') {
        GetAlerts();
        var tmp = document.getElementById("_checkAllBtn");
        tmp.disabled = true;
        tmp = document.getElementById("_clearAllBtn");
        tmp.disabled = true;
        ButtonSaveOBJ.disabled = true;
        ButtonSendOBJ.disabled = true;
        if(snmpSupport){
            ButtonSnmpSaveOBJ.disabled = true;
            ButtonSnmpTrapSaveOBJ.disabled = true;
        }
        //alert (lang.LANG_CONFALERT_NOPRIVI_CONF);
    }
    //no access
    else {
        location.href = SubMainPage;
        return;
    }
}

function geneXML(enable) {
    "use strict";
    //<?xml version="1.0"?>
    //<IPMI>
    //    <LIQUID ENABLE="0"/>
    //</IPMI>
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <LIQUID ENABLE=\"" + enable + "\"/>\n";
    result += "</IPMI>\n";
    return result;
}

function updateLiquidInfo(root) {
    "use strict";
    if(root != null) {
        var enable = root.getElementsByTagName("LIQUID")[0].getAttribute("ENABLE");
        var objEnable=document.getElementById("_check_liq_leakage_shutdown");
        var lblEnable=document.getElementById("liq_leakage_shutdown_lbl");
        var objDtcEnable=document.getElementById("_check_liq_leakage_detection");
        var lblDtcEnable=document.getElementById("liq_leakage_detection_lbl");
        if(enable == "1") {
            objEnable.style.visibility="visible";
            lblEnable.style.visibility="visible";
            objDtcEnable.style.visibility="visible";
            lblDtcEnable.style.visibility="visible";
        }
    }
}

function GetLiquidConfigHandler(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var text = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);
        if(xml_obj == null) {
            SessionTimeout();
            return;
        } else {
            var root = xml_obj.documentElement;
            updateLiquidInfo(root);
        }
    }
}

function GetLiquidConfig() {
    "use strict";
    var enable = 0;
    var ajax_url = '../cgi/get_liquid_enable.cgi';
    var ajax_data = geneXML(enable);
    var ajax_req = new Ajax.Request(
            ajax_url, {
                method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                onComplete: GetLiquidConfigHandler });
}

function CompleteTestAlert() {
    "use strict";
    alert(lang.LANG_CONFALERT_ALERTSENT, {title:lang.LANG_CONFALERT_BTNTESTALR});
    location.reload();
}

function GetAlerts() {
    "use strict";
    Loading(true);
    var ajax_url = "../cgi/config_alert_snmp.cgi";
    var ajax_param = "";
    var ajax_data = GenDataRequestXML();

    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'POST',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                parameters: ajax_param,
                onComplete: ShowAlertTable }
            );
}

function updateCheckboxObj(obj, checked) {
    "use strict";
    if(obj != null) {
        if(checked != null && checked == "1") {
            obj.checked = true;
        }
        else {
            obj.checked = false;
        }
    }
}

function updateTextObj(obj, value) {
    "use strict";
    if(obj != null) {
        if(value != null) {
            obj.value = value;
        }
    }
}

function updateRadioObj(objs, value){
    objs.forEach(function(obj){
        if(obj.value == value) obj.checked = true;
        else obj.checked = false;
    });
}

function responseSaveAlertSNMP(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response of responseSaveAlertSNMP:\n" + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            return;
        }

        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        } else {
            var result = GetXMLNodeValue(xmldoc, "RESULT");
            var IPMIRoot = xmldoc.documentElement;//point to IPMI
            updateToken(IPMIRoot);
            if(result == "OK") {
                alert(lang.LANG_CONFALERT_SUCCSAVE, {title:lang.LANG_MODALERT_BTNSAVE});
            } else {
                alert(lang.LANG_CONFALERT_FAILSAVE);
            }
        }
    }
}

function responseTestAlertSNMP(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            return;
        }
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        } else {
            var result = GetXMLNodeValue(xmldoc, "RESULT");
            var IPMIRoot = xmldoc.documentElement;//point to IPMI
            updateToken(IPMIRoot);
            if(result == "OK") {
                alert(lang.LANG_CONFALERT_ALERTSENT, {title:lang.LANG_CONFALERT_BTNTESTALR});
            } else {
                result = GetXMLNodeValue(xmldoc, "DEST1_RESULT");
                if(result == "FAIL") {
                    alert(lang.LANG_CONFALERT_ALERT_DEST1 + ": " + lang.LANG_CONFALERT_ALERTFAIL);
                } else {
                    result = GetXMLNodeValue(xmldoc, "DEST2_RESULT");
                    if(result == "FAIL") {
                        alert(lang.LANG_CONFALERT_ALERT_DEST2 + ": " + lang.LANG_CONFALERT_ALERTFAIL);
                    } else {
                        alert(lang.LANG_CONFALERT_ALERTFAIL);
                    }
                }
            }
        }
    }
}

function responseSaveSNMPServer(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response of responseSaveAlertSNMP:\n" + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            return;
        }

        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        } else {
            var result = GetXMLNodeValue(xmldoc, "RESULT");
            var IPMIRoot = xmldoc.documentElement;//point to IPMI
            updateToken(IPMIRoot);
            if(result == "OK") {
                alert(lang.LANG_CONFALERT_SNMP_SERVER_SUCCSAVE, {title:lang.LANG_MODALERT_BTNSAVE});
            } else {
                alert(lang.LANG_CONFALERT_SNMP_SERVER_FAILSAVE);
            }
        }
    }
}

function responseSaveSNMPTrap(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response of responseSaveAlertSNMP:\n" + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            return;
        }

        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        } else {
            var result = GetXMLNodeValue(xmldoc, "RESULT");
            var IPMIRoot = xmldoc.documentElement;//point to IPMI
            updateToken(IPMIRoot);
            if(result == "OK") {
                alert(lang.LANG_CONFALERT_SNMP_TRAP_SUCCSAVE, {title:lang.LANG_MODALERT_BTNSAVE});
            } else {
                alert(lang.LANG_CONFALERT_SNMP_TRAP_FAILSAVE);
            }
        }
    }
}

function ShowAlertTable(originalRequest) {
    "use strict";
    var Nodes = null;
    var obj = null;
    var value = null;
    var oInput = null;

    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response GetAlerts: " + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
            //SessionTimeout();
            return;
        }

        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        //console.log("response from config_alert_snmp.cgi\n" + response);
        //<?xml version="1.0"?>
        //<IPMI>
        //  <ALERTS>
        //    <EVENTFILTER>1</EVENTFILTER>
        //    <LOGEVENT>1</LOGEVENT>
        //    <TEMPERATURE>1</TEMPERATURE>
        //    <SYSTEM_RESTART>1</SYSTEM_RESTART>
        //    <FAN_FAILURE>1</FAN_FAILURE>
        //    <PSU_FAILURE>0</PSU_FAILURE>
        //    <POST_ERROR>1</POST_ERROR>
        //    <NM_EXCEPTION>1</NM_EXCEPTION>
        //    <VOLTAGE_OUT_OF_RANGE>0</VOLTAGE_OUT_OF_RANGE>
        //    <WATCHDOG_TIMER>0</WATCHDOG_TIMER>
        //    <CHASSIS_INSTRUSION>0</CHASSIS_INSTRUSION>
        //    <MEMORY_ERROR>1</MEMORY_ERROR>
        //    <FRB_FAILURE>1</FRB_FAILURE>
        //    <HDD_FAILURE>0</HDD_FAILURE>
        //    <DESTIP1SNMP>1.2.3.4</DESTIP1SNMP>
        //    <DEST1EMAIL>xxx@2.3.4.5</DEST1EMAIL>
        //    <DESTIP2SNMP>4.5.6.7</DESTIP2SNMP>
        //    <DEST2EMAIL>xxx@7.8.9.1</DEST2EMAIL>
        //  </ALERTS>
        //</IPMI>

        var IPMIRoot = xmldoc.documentElement;//point to IPMI
        var AlertElements = IPMIRoot.getElementsByTagName('ALERTS');
        var Nodes = null;
        //console.log("AlertElements.length:" + AlertElements.length + "\n" + response);
        updateToken(IPMIRoot);
        if(AlertElements != null && AlertElements.length > 0) {
            for(var idx = 0; idx < AlertElements.length; idx++) {
                var record = AlertElements[idx];
                value = record.getElementsByTagName('EVENTFILTER')[0].firstChild.nodeValue;
                obj = document.getElementById("_checkbox_global_filtering_enable");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('LOGEVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_checkbox_log_event_on_filtering_enable");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('TEMPERATURE')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_temperature");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('VOLTAGE_OUT_OF_RANGE')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_voltage_out_of_range");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('FAN_FAILURE')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_fan_failure");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('CHASSIS_INSTRUSION')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_chassis_instrusion");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('PSU_FAILURE')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_psu_failure");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('MEMORY_ERROR')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_memeory_error");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('POST_ERROR')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_bios_post_error");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('FRB_FAILURE')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_frb_failure");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('NM_EXCEPTION')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_nm_exception");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('WATCHDOG_TIMER')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_watchdog_timer");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('SYSTEM_RESTART')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_system_restart");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('HDD_FAILURE')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_hdd_failure");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('POWER_UNIT_REDUNDANCY_FAILURE_EVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_power_unit_redundancy_fail");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('FP_AUTO_TEMP_SHUTDOWN_EVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_fp_auto_temp_shutdown");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('FAN_REDUNDANCY_FAILURE_EVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_fan_redundancy_fail");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('POWER_UNIT_STATUS_EVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_power_unit_status");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('PROCESSOR_THERM_TRIP_EVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_processor_therm_trip");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('PROCESSOR_DIMM_THREM_TRIP_EVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_processor_dimm_therm_trip");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('LIQ_LEAKAGE_DETECTION_EVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_liq_leakage_detection");
                updateCheckboxObj(obj, value);

                value = record.getElementsByTagName('LIQ_LEAKAGE_SHUTDOWN_EVENT')[0].firstChild.nodeValue;
                obj = document.getElementById("_check_liq_leakage_shutdown");
                updateCheckboxObj(obj, value);
                GetLiquidConfig();

                Nodes = record.getElementsByTagName('DESTIP1SNMP');
                if(Nodes != null && Nodes.length > 0) {
                    if(Nodes[0].firstChild != null) {
                        value = Nodes[0].firstChild.nodeValue;
                        obj = document.getElementById("_input_alert1_snmp_address");
                        if(obj != null) {
                            obj.value = "0.0.0.0";
                            obj.defaultValue = "0.0.0.0";
                        }
                        updateTextObj(obj, value);
                    }
                }

                Nodes = record.getElementsByTagName('DEST1EMAIL');
                if(Nodes != null && Nodes.length > 0) {
                    if(Nodes[0].firstChild != null) {
                        value = Nodes[0].firstChild.nodeValue;
                        obj = document.getElementById("_input_alert1_email_address");
                        if(obj != null) {
                            obj.value = "";
                            obj.defaultValue = "";
                        }
                        updateTextObj(obj, value);
                    }
                }

                Nodes = record.getElementsByTagName('DESTIP2SNMP');
                if(Nodes != null && Nodes.length > 0) {
                    if(Nodes[0].firstChild != null) {
                        value = Nodes[0].firstChild.nodeValue;
                        obj = document.getElementById("_input_alert2_snmp_address");
                        if(obj != null) {
                            obj.value = "0.0.0.0";
                            obj.defaultValue = "0.0.0.0";
                        }
                        updateTextObj(obj, value);
                    }
                }

                Nodes = record.getElementsByTagName('DEST2EMAIL');
                if(Nodes != null && Nodes.length > 0) {
                    if(Nodes[0].firstChild != null) {
                        value = Nodes[0].firstChild.nodeValue;
                        obj = document.getElementById("_input_alert2_email_address");
                        if(obj != null) {
                            obj.value = "";
                            obj.defaultValue = "";
                        }
                        updateTextObj(obj, value);
                    }
                }

                value = record.getElementsByTagName('ALERT_DEST1')[0].firstChild.nodeValue;
                value = value.toLowerCase();
                if(value == "email") {
                    obj = document.getElementById("_alert_dest1_email");
                    obj.checked = true;
                    oInput = document.getElementById("_input_alert1_email_address");
                    oInput.disabled = false;
                    oInput = document.getElementById("_input_alert1_snmp_address");
                    oInput.disabled = true;
                }
                else if(value == "snmp") {
                    obj = document.getElementById("_alert_dest1_snmp");
                    obj.checked = true;
                    oInput = document.getElementById("_input_alert1_snmp_address");
                    oInput.disabled = false;
                    oInput = document.getElementById("_input_alert1_email_address");
                    oInput.disabled = true;
                }

                value = record.getElementsByTagName('ALERT_DEST2')[0].firstChild.nodeValue;
                value = value.toLowerCase();
                if(value == "email") {
                    obj = document.getElementById("_alert_dest2_email");
                    obj.checked = true;
                    oInput = document.getElementById("_input_alert2_email_address");
                    oInput.disabled = false;
                    oInput = document.getElementById("_input_alert2_snmp_address");
                    oInput.disabled = true;
                }
                else if(value == "snmp") {
                    obj = document.getElementById("_alert_dest2_snmp");
                    obj.checked = true;
                    oInput = document.getElementById("_input_alert2_snmp_address");
                    oInput.disabled = false;
                    oInput = document.getElementById("_input_alert2_email_address");
                    oInput.disabled = true;
                }
                //console.log("EventFilter:" + event_filter +
                //          " LogEvent:" + log_event +
                //          " EventStrigger:" + event_strigger +
                //          " SNMP1:" + dest1_snmp +
                //          " Email1:" + dest1_email +
                //          " SNMP2:" + dest2_snmp +
                //          " Email2:" + dest2_email);
            }
        }

        // snmp
        if(snmpSupport){
            var SNMPElements = IPMIRoot.getElementsByTagName('SNMP');
            if(SNMPElements != null){
                var SNMPServer = SNMPElements[0];
                var SNMPServerElements = SNMPServer.firstElementChild;
                if(SNMPServerElements != null){
                    // enable
                    value = SNMPServerElements.getElementsByTagName('ENABLE')[0].textContent;
                    obj = document.getElementById("_check_enable_snmp_server");
                    updateCheckboxObj(obj, value);
                    onChangeSNMPServer(Boolean(value == "1"));

                    // enable v1v2c
                    value = SNMPServerElements.getElementsByTagName('EnableV1V2C')[0].textContent;
                    obj = document.getElementById("_check_enable_snmp_v1_v2c");
                    updateCheckboxObj(obj, value);

                    // current channel
                    value = SNMPServerElements.getElementsByTagName('CHANNEL')[0].textContent;
                    obj = document.getElementById("_lanChannel");
                    obj.textContent = "Channel-" + value;

                    // read-only community string
                    value = SNMPServerElements.getElementsByTagName('RO_COMM_STR')[0].textContent;
                    obj = document.getElementById("_input_ro_comm_str");
                    updateTextObj(obj, value);

                    // read-write community string
                    value = SNMPServerElements.getElementsByTagName('RW_COMM_STR')[0].textContent;
                    obj = document.getElementById("_input_rw_comm_str");
                    updateTextObj(obj, value);
                }
                var SNMPTrapElements = SNMPServer.lastElementChild;
                if(SNMPTrapElements != null){
                    // version
                    value = SNMPTrapElements.getElementsByTagName('VERSION')[0].textContent;
                    var radios = document.querySelectorAll("input[type='radio'][name='snmp_trap_version']");
                    updateRadioObj(radios, value);
                    onChangeSNMPTrapVersion(value);

                    // community string
                    value = SNMPTrapElements.getElementsByTagName('COMM_STR')[0].textContent;
                    obj = document.getElementById("_input_snmp_trap_comm_str");
                    updateTextObj(obj, value);

                    // username
                    value = SNMPTrapElements.getElementsByTagName('USERNAME')[0].textContent;
                    obj = document.getElementById("_input_snmp_trap_username");
                    updateTextObj(obj, value);

                    // auth protocol
                    value = SNMPTrapElements.getElementsByTagName('AUTH_PROTO')[0].textContent;
                    radios = document.querySelectorAll("input[type='radio'][name='snmp_trap_auth_proto']");
                    updateRadioObj(radios, value);

                    // security level
                    value = SNMPTrapElements.getElementsByTagName('SEC_LEVEL')[0].textContent;
                    radios = document.querySelectorAll("input[type='radio'][name='snmp_trap_sec_level']");
                    updateRadioObj(radios, value);

                    // privacy protocol
                    value = SNMPTrapElements.getElementsByTagName('PRIV_PROTO')[0].textContent;
                    radios = document.querySelectorAll("input[type='radio'][name='snmp_trap_priv_proto']");
                    updateRadioObj(radios, value);
                }
            }
        }
    }
}

function getCheckedTag(tag, checked) {
    "use strict";
    var result = "";
    if(checked == true) {
        result = "<" + tag + ">1</" + tag + ">";
    }
    else {
        result = "<" + tag + ">0</" + tag + ">";
    }
    return result;
}

function getTextTag(tag, text) {
    "use strict";
    var result = "";
    result = "<" + tag + ">" + text + "</" + tag + ">";
    return result;
}

// Create the XML to request data from the backend.
function GenDataRequestXML() {
    "use strict";
    var obj = null;
    var oInput = null;
    var result = "";

    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "</IPMI>\n";
    return result
}

function readConfigXML() {
    "use strict";
    var obj = null;
    var oInput = null;
    var result = "";

    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <ALERTS>\n";
    {
        obj = document.getElementById("_checkbox_global_filtering_enable");
        result += "        " + getCheckedTag("EVENTFILTER", obj.checked) + "\n";

        obj = document.getElementById("_checkbox_log_event_on_filtering_enable");
        result += "        " + getCheckedTag("LOGEVENT", obj.checked) + "\n";

        obj = document.getElementById("_check_temperature");
        result += "        " + getCheckedTag("TEMPERATURE", obj.checked) + "\n";

        obj = document.getElementById("_check_voltage_out_of_range");
        result += "        " + getCheckedTag("VOLTAGE_OUT_OF_RANGE", obj.checked) + "\n";

        obj = document.getElementById("_check_fan_failure");
        result += "        " + getCheckedTag("FAN_FAILURE", obj.checked) + "\n";

        obj = document.getElementById("_check_chassis_instrusion");
        result += "        " + getCheckedTag("CHASSIS_INSTRUSION", obj.checked) + "\n";

        obj = document.getElementById("_check_psu_failure");
        result += "        " + getCheckedTag("PSU_FAILURE", obj.checked) + "\n";

        obj = document.getElementById("_check_memeory_error");
        result += "        " + getCheckedTag("MEMORY_ERROR", obj.checked) + "\n";

        obj = document.getElementById("_check_bios_post_error");
        result += "        " + getCheckedTag("POST_ERROR", obj.checked) + "\n";

        obj = document.getElementById("_check_frb_failure");
        result += "        " + getCheckedTag("FRB_FAILURE", obj.checked) + "\n";

        obj = document.getElementById("_check_nm_exception");
        result += "        " + getCheckedTag("NM_EXCEPTION", obj.checked) + "\n";

        obj = document.getElementById("_check_watchdog_timer");
        result += "        " + getCheckedTag("WATCHDOG_TIMER", obj.checked) + "\n";

        obj = document.getElementById("_check_system_restart");
        result += "        " + getCheckedTag("SYSTEM_RESTART", obj.checked) + "\n";

        obj = document.getElementById("_check_hdd_failure");
        result += "        " + getCheckedTag("HDD_FAILURE", obj.checked) + "\n";

        obj = document.getElementById("_check_power_unit_redundancy_fail");
        result += "        " + getCheckedTag("POWER_UNIT_REDUNDANCY_FAILURE_EVENT", obj.checked) + "\n";

        obj = document.getElementById("_check_fp_auto_temp_shutdown");
        result += "        " + getCheckedTag("FP_AUTO_TEMP_SHUTDOWN_EVENT", obj.checked) + "\n";

        obj = document.getElementById("_check_fan_redundancy_fail");
        result += "        " + getCheckedTag("FAN_REDUNDANCY_FAILURE_EVENT", obj.checked) + "\n";

        obj = document.getElementById("_check_power_unit_status");
        result += "        " + getCheckedTag("POWER_UNIT_STATUS_EVENT", obj.checked) + "\n";

        obj = document.getElementById("_check_processor_therm_trip");
        result += "        " + getCheckedTag("PROCESSOR_THERM_TRIP_EVENT", obj.checked) + "\n";

        obj = document.getElementById("_check_processor_dimm_therm_trip");
        result += "        " + getCheckedTag("PROCESSOR_DIMM_THREM_TRIP_EVENT", obj.checked) + "\n";

        obj = document.getElementById("_check_liq_leakage_detection");
        result += "        " + getCheckedTag("LIQ_LEAKAGE_DETECTION_EVENT", obj.checked) + "\n";

        obj = document.getElementById("_check_liq_leakage_shutdown");
        result += "        " + getCheckedTag("LIQ_LEAKAGE_SHUTDOWN_EVENT", obj.checked) + "\n";
    }
    {
        obj = document.getElementById("_alert_dest1_snmp");
        if(obj.checked == true) {
            oInput = document.getElementById("_input_alert1_snmp_address");
            result += "        " + getTextTag("DESTIP1SNMP", oInput.value) + "\n";
            result += "        " + getTextTag("ALERT_DEST1", "snmp") + "\n";
        }

        obj = document.getElementById("_alert_dest1_email");
        if(obj.checked == true) {
            oInput = document.getElementById("_input_alert1_email_address");
            result += "        " + getTextTag("DEST1EMAIL", oInput.value) + "\n";
            result += "        " + getTextTag("ALERT_DEST1", "email") + "\n";
        }

        obj = document.getElementById("_alert_dest2_snmp");
        if(obj.checked == true) {
            oInput = document.getElementById("_input_alert2_snmp_address");
            result += "        " + getTextTag("DESTIP2SNMP", oInput.value) + "\n";
            result += "        " + getTextTag("ALERT_DEST2", "snmp") + "\n";
        }

        obj = document.getElementById("_alert_dest2_email");
        if(obj.checked == true) {
            oInput = document.getElementById("_input_alert2_email_address");
            result += "        " + getTextTag("DEST2EMAIL", oInput.value) + "\n";
            result += "        " + getTextTag("ALERT_DEST2", "email") + "\n";
        }
    }
    result += "    </ALERTS>\n";
    result += "</IPMI>\n";
    return result;
}

function readSNMPConfigXML() {
    "use strict";
    var obj = null;
    var result = "";
    var spaceAdd = function(num){
        if(num == undefined) num = 1;
        var str = "";
        for(var i = 0; i < num ; i++) str += "    ";
        return str;
    }
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <SNMPSERVER>\n";
    {
        obj = document.getElementById("_check_enable_snmp_server");
        result += spaceAdd(2) + getCheckedTag("SNMP_SERVER_ENABLE", obj.checked) + "\n";

        obj = document.getElementById("_check_enable_snmp_v1_v2c");
        result += spaceAdd(2) + getCheckedTag("SNMP_SERVER_ENABLEV1V2C", obj.checked) + "\n";

        obj = document.getElementById("_input_ro_comm_str");
        result += spaceAdd(2) + getTextTag("SNMP_SERVER_RO_COMM_STR", obj.value) + "\n";

        obj = document.getElementById("_input_rw_comm_str");
        result += spaceAdd(2) + getTextTag("SNMP_SERVER_RW_COMM_STR", obj.value) + "\n";
    }
    result += "    </SNMPSERVER>\n";
    result += "</IPMI>\n";
    return result;
}

function readSNMPTrapConfigXML() {
    "use strict";
    var obj = null;
    var result = "";
    var spaceAdd = function(num){
        if(num == undefined) num = 1;
        var str = "";
        for(var i = 0; i < num ; i++) str += "    ";
        return str;
    }
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <SNMPTRAP>\n";
    {
        obj = document.querySelector("input[name='snmp_trap_version']:checked");
        if(obj != null) result += spaceAdd(2) + getTextTag("SNMP_TRAP_VERSION", obj.value) + "\n";
        else result += spaceAdd(2) + getTextTag("SNMP_TRAP_VERSION", "0") + "\n";

        obj = document.getElementById("_input_snmp_trap_comm_str");
        result += spaceAdd(2) + getTextTag("SNMP_TRAP_COMM_STR", obj.value) + "\n";

        obj = document.getElementById("_input_snmp_trap_username");
        result += spaceAdd(2) + getTextTag("SNMP_TRAP_USERNAME", obj.value) + "\n";

        obj = document.querySelector("input[name='snmp_trap_auth_proto']:checked");
        if(obj != null) result += spaceAdd(2) + getTextTag("SNMP_TRAP_AUTH_PROTO", obj.value) + "\n";
        else result += spaceAdd(2) + getTextTag("SNMP_TRAP_AUTH_PROTO", "0") + "\n";

        obj = document.getElementById("_input_snmp_trap_auth_passphrase");
        result += spaceAdd(2) + getTextTag("SNMP_TRAP_AUTH_PASSPHRASE", btoa(obj.value)) + "\n";

        obj = document.querySelector("input[name='snmp_trap_sec_level']:checked");
        if(obj != null) result += spaceAdd(2) + getTextTag("SNMP_TRAP_SEC_LEVEL", obj.value) + "\n";
        else result += spaceAdd(2) + getTextTag("SNMP_TRAP_SEC_LEVEL", "0") + "\n";

        obj = document.querySelector("input[name='snmp_trap_priv_proto']:checked");
        if(obj != null) result += spaceAdd(2) + getTextTag("SNMP_TRAP_PRIV_PROTO", obj.value) + "\n";
        else result += spaceAdd(2) + getTextTag("SNMP_TRAP_PRIV_PROTO", "0") + "\n";

        obj = document.getElementById("_input_snmp_trap_priv_passphrase");
        result += spaceAdd(2) + getTextTag("SNMP_TRAP_PRIV_PASSPHRASE", btoa(obj.value)) + "\n";
    }
    result += "    </SNMPTRAP>\n";
    result += "</IPMI>\n";
    return result;
}

function checkAll(checked) {
    "use strict";
    var obj = null;

    obj = document.getElementById("_check_temperature");
    obj.checked = checked;

    obj = document.getElementById("_check_voltage_out_of_range");
    obj.checked = checked;

    obj = document.getElementById("_check_fan_failure");
    obj.checked = checked;

    obj = document.getElementById("_check_chassis_instrusion");
    obj.checked = checked;

    obj = document.getElementById("_check_psu_failure");
    obj.checked = checked;

    obj = document.getElementById("_check_memeory_error");
    obj.checked = checked;

    obj = document.getElementById("_check_bios_post_error");
    obj.checked = checked;

    obj = document.getElementById("_check_frb_failure");
    obj.checked = checked;

    obj = document.getElementById("_check_nm_exception");
    obj.checked = checked;

    obj = document.getElementById("_check_watchdog_timer");
    obj.checked = checked;

    obj = document.getElementById("_check_system_restart");
    obj.checked = checked;

    obj = document.getElementById("_check_hdd_failure");
    obj.checked = checked;

    obj = document.getElementById("_check_power_unit_redundancy_fail");
    obj.checked = checked;

    obj = document.getElementById("_check_fp_auto_temp_shutdown");
    obj.checked = checked;

    obj = document.getElementById("_check_fan_redundancy_fail");
    obj.checked = checked;

    obj = document.getElementById("_check_power_unit_status");
    obj.checked = checked;

    obj = document.getElementById("_check_processor_therm_trip");
    obj.checked = checked;

    obj = document.getElementById("_check_processor_dimm_therm_trip");
    obj.checked = checked;

    obj = document.getElementById("_check_liq_leakage_detection");
    obj.checked = checked;

    obj = document.getElementById("_check_liq_leakage_shutdown");
    obj.checked = checked;
}

function onCheckAll() {
    "use strict";
    //alert("check all");
    checkAll(true);
}

function onClearAll() {
    "use strict";
    //alert("clear all");
    checkAll(false);
}

function onSave() {
    "use strict";

    // request
    var ajax_url = '../cgi/config_alert_snmp.cgi';
    var ajax_param = '';
    var ajax_data = readConfigXML();
    //console.log("onSave:\n" + ajax_data);
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'PUT',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                parameters: ajax_param,
                onComplete: responseSaveAlertSNMP }
            );
}

function onSendTestAlert() {
    "use strict";
    //console.log("onSave:\n" + result);
    var ajax_url = '../cgi/config_alert_test.cgi';
    var ajax_param = '';
    var ajax_data = readConfigXML();
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'PUT',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                parameters: ajax_param,
                onComplete: responseTestAlertSNMP }
            );
}

function onSaveSnmp() {
    "use strict";

    var snmpserverEnable = document.getElementById("_check_enable_snmp_server").checked;
    if(snmpserverEnable){
        var read_only_comm_str = document.getElementById("_input_ro_comm_str").value;
        var read_write_comm_str = document.getElementById("_input_rw_comm_str").value;

        if( !(CheckStringLength(read_only_comm_str, 0, 32))){
            alert(lang.LANG_CONFALERT_SNMP_SERVER_COMM_STR_ERR1);
            return;
        }

        if( !(CheckStringLength(read_write_comm_str, 0, 32))){
            alert(lang.LANG_CONFALERT_SNMP_SERVER_COMM_STR_ERR2);
            return;
        }

        if(read_only_comm_str.length != 0 || read_write_comm_str.length != 0){
            if(read_only_comm_str === read_write_comm_str){
                alert(lang.LANG_CONFALERT_SNMP_SERVER_COMM_STR_ERR3)
                return;
            }
        }
    }

    var ajax_url = '../cgi/config_alert_snmp.cgi';
    var ajax_param = '';
    var ajax_data = readSNMPConfigXML();
    //console.log("onSave:\n" + ajax_data);
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'PUT',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                parameters: ajax_param,
                onComplete: responseSaveSNMPServer }
            );
}

function onSaveSnmpTrap() {
    "use strict";

    var snmptrapVer = document.querySelector("input[name='snmp_trap_version']:checked").value;
    if(snmptrapVer === '3'){
        var securityLevel = document.querySelector("input[name='snmp_trap_sec_level']:checked").value;
        var auth_passphrase = document.getElementById("_input_snmp_trap_auth_passphrase").value;
        var priv_passphrase = document.getElementById("_input_snmp_trap_priv_passphrase").value;
        if( !(CheckStringLength(auth_passphrase, 8, 12)
            && CheckPrintableChar(auth_passphrase))) {
                alert(lang.LANG_CONFALERT_SNMP_TRAP_ERR1);
                return;
        }

        if( securityLevel === '3' ){
            if( !(CheckStringLength(priv_passphrase, 8, 12)
                && CheckPrintableChar(priv_passphrase))) {
                    alert(lang.LANG_CONFALERT_SNMP_TRAP_ERR2);
                    return;
            }
        }
    }

    var ajax_url = '../cgi/config_alert_snmp.cgi';
    var ajax_param = '';
    var ajax_data = readSNMPTrapConfigXML();
    //console.log("onSave:\n" + ajax_data);
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'PUT',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                parameters: ajax_param,
                onComplete: responseSaveSNMPTrap }
            );
}

function onChangeSNMPServer(enable){
    var enableServer = !Boolean(enable);
    document.getElementById("_check_enable_snmp_v1_v2c").disabled = enableServer;
    document.getElementById("_input_ro_comm_str").disabled = enableServer;
    document.getElementById("_input_rw_comm_str").disabled = enableServer;
}

function onChangeSNMPTrapVersion(version){
    version = parseInt(version);
    var enableOnVersionV3 = !(version == 3); //
    document.getElementById("_input_snmp_trap_comm_str").disabled = !enableOnVersionV3;
    document.getElementById("_input_snmp_trap_username").disabled = enableOnVersionV3;
    document.getElementById("_radio_snmp_trap_auth_proto_md5").disabled = enableOnVersionV3;
    document.getElementById("_radio_snmp_trap_auth_proto_sha").disabled = enableOnVersionV3;
    document.getElementById("_input_snmp_trap_auth_passphrase").disabled = enableOnVersionV3;
    document.getElementById("_radio_snmp_trap_sec_level_auth_no_priv").disabled = enableOnVersionV3;
    document.getElementById("_radio_snmp_trap_sec_level_auth_priv").disabled = enableOnVersionV3;
    document.getElementById("_radio_snmp_trap_priv_proto_aes").disabled = enableOnVersionV3;
    document.getElementById("_input_snmp_trap_priv_passphrase").disabled = enableOnVersionV3;
}

function onChangeAlertDestination(dest, type) {
    "use strict";
    var obj = null;
    if(dest == "1") {
        if(type == "snmp") {
            obj = document.getElementById("_input_alert1_snmp_address");
            obj.disabled = false;
            obj = document.getElementById("_input_alert1_email_address");
            obj.disabled = true;
        }
        else if(type == "email") {
            obj = document.getElementById("_input_alert1_snmp_address");
            obj.disabled = true;
            obj = document.getElementById("_input_alert1_email_address");
            obj.disabled = false;
        }
    }
    else if(dest == "2") {
        if(type == "snmp") {
            obj = document.getElementById("_input_alert2_snmp_address");
            obj.disabled = false;
            obj = document.getElementById("_input_alert2_email_address");
            obj.disabled = true;
        }
        else if(type == "email") {
            obj = document.getElementById("_input_alert2_snmp_address");
            obj.disabled = true;
            obj = document.getElementById("_input_alert2_email_address");
            obj.disabled = false;
        }
    }
    //alert("onChangeAlertDestination(" + dest + ")");
}