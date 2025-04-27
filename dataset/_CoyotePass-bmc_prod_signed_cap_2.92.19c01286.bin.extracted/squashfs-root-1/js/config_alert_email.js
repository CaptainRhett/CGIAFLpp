"use strict";
var MaxAlertTableRows = 16;
var MaxAlertTableColumns = 6;
var GridTable;
var TableTitles = [
    ["Alert No", "15%", "center"],
    ["Alert Level", "40%", "center"],
    ["Destination Address", "45%", "center"]
];

var lang;
var ButtonSaveOBJ;
var AlertTableArray = new Array();
//var ModifyURL = "../cgi/url_redirect.cgi?url_name=modify_alert"

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit() {
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_alert_email_hlp.html";

    ButtonSaveOBJ = document.getElementById("btn_save");
    ButtonSaveOBJ.value = lang.LANG_MODALERT_BTNSAVE;
    ButtonSaveOBJ.addEventListener("click", onSave);

    OutputString();

    document.getElementById("_text_auth_method").addEventListener("change",
            function() {
                setDisabledOps(this)
            });

    //check input format
    initCheckInputListener("_text_smtp_address", lang.LANG_CONFALERT_SMTP_SERVERIP, INPUT_FIELD.IPV4);
    initCheckInputListener("_text_smtp_port", lang.LANG_CONFALERT_SMTP_SERVERPORT, INPUT_FIELD.PORT);
    initCheckInputListener("_text_sender_user", lang.LANG_CONFALERT_SENDER_USER, INPUT_FIELD.SMTPAUTHUSERNAME);
    initCheckInputListener("_text_sender_password", lang.LANG_CONFALERT_SENDER_PASSWORD, INPUT_FIELD.PASSWORD);

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("email_caption_div").textContent = lang.LANG_CONFALERT_EMAIL_CAPTION;
    document.getElementById("smtp_serverip_lbl").textContent = lang.LANG_CONFALERT_SMTP_SERVERIP;
    document.getElementById("smtp_serverport_lbl").textContent = lang.LANG_CONFALERT_SMTP_SERVERPORT;
    document.getElementById("sender_address_lbl").textContent = lang.LANG_CONFALERT_SENDER_ADDRESS;
    document.getElementById("smtp_auth_method_lbl").textContent = lang.LANG_CONFALERT_SMTP_AUTH_METHOD;

    var smtp_user_prompt = document.getElementById("smtp_user_prompt");
    smtp_user_prompt.textContent = lang.LANG_CONFALERT_SENDER_USER;

    var smtp_pass_prompt = document.getElementById("smtp_pass_prompt");
    smtp_pass_prompt.textContent = lang.LANG_CONFALERT_SENDER_PASSWORD;

    var obj = document.getElementById("_text_auth_method");
    var option0,option1,option2;
    if(obj != null) {
        option0 = document.createElement("option");
        option0.value = 0;
        option0.text = lang.LANG_CONFALERT_SMTP_AUTH_NONE ;
        obj.appendChild(option0);
        option1 = document.createElement("option");
        option1.value = 1;
        option1.text = lang.LANG_CONFALERT_SMTP_STARTTLS ;
        obj.appendChild(option1);
        option2 = document.createElement("option");
        option2.value = 2;
        option2.text = lang.LANG_CONFALERT_SMTP_AUTH_SSLTLS ;
        obj.appendChild(option2);
    }
}

function PrivilegeCallBack(Privilege) {
    "use strict";
    //full access
    if(Privilege == '04') {
        requestConfig();
        ButtonSaveOBJ.disabled = false;
    }
    //only view
    else if(Privilege == '03' || Privilege == '02') {
        requestConfig();
        ButtonSaveOBJ.disabled = true;

    }
    //no access
    else {
        location.href = SubMainPage;
        return;
    }

}

function onSave() {
    "use strict";
    if(validateFormat() == true) {
        var ajax_url = '../cgi/config_alert_email.cgi';
        var ajax_param = '';
        var ajax_data = readConfigXML();
        //console.log("onSave()\n", ajax_data);
        Loading(true);
        var ajax_req = new Ajax.Request(ajax_url,
                { method: 'UPDATE',
                    contentType: "text/xml",
                    xml_data: ajax_data,
                    timeout: g_CGIRequestTimeout,
                    ontimeout: onCGIRequestTimeout,
                    parameters: ajax_param,
                    onComplete: responseSaveAlertEmail });
    }
}

function validateFormat() {
    "use strict";
    var result = false;
    var svr_ip = null;
    var obj = null;
    var usr = null;
    var pwd = null;
    var value = null;

    svr_ip = document.getElementById("_text_smtp_address");
    if(svr_ip != null) {
        if (svr_ip.value) {
            if (!CheckIP6(svr_ip.value)) {
                alert(lang.LANG_CONFALERT_SMTP_SERVERIP + "\n" +
                        lang.LANG_CONFIG_NETWORK_ERR_INVALID_IP +
                        " \"" + obj.value + "\"", {type: "pre"});
                return false;
            }
        }
        obj = document.getElementById("_text_smtp_port");
        if ((obj.value && !svr_ip.value) || (!obj.value && svr_ip.value)) {
            alert(lang.LANG_CONFALERT_SMTP_SERVERIP + "\n" +
                    lang.LANG_CONFALERT_SMTP_SERVERPORT + "\n" +
                    lang.LANG_GENERAL_INTERDEPENDENT_VALUE, {type: "pre"});
            return false;
        } else if (obj.value && !CheckPortNumber(obj.value)) {
            alert(lang.LANG_CONFALERT_SMTP_SERVERPORT + "\n" +
                    lang.LANG_SMTP_INVALID_PORT +
                    " \"" + obj.value + "\"", {type: "pre"});
            return false;
        }

        obj = document.getElementById("_text_sender_address");
        if ((obj.value && !svr_ip.value) || (!obj.value && svr_ip.value)) {
            alert(lang.LANG_CONFALERT_SMTP_SERVERIP + "\n" +
                    lang.LANG_CONFALERT_SENDER_ADDRESS + "\n" +
                    lang.LANG_GENERAL_INTERDEPENDENT_VALUE, {type: "pre"});
            return false;
        } else if (obj.value && !CheckEmail(obj.value)) {
            alert(lang.LANG_CONFALERT_SENDER_ADDRESS + "\n" +
                    lang.LANG_MODALERT_ERRMAIL +
                    " \"" + obj.value + "\"", {type: "pre"});
            return false;
        }

        obj = document.getElementById("_text_auth_method");
        if (obj.value != '0') {
            usr = document.getElementById("_text_sender_user");
            pwd = document.getElementById("_text_sender_password");
            if (!usr.value || !pwd.value) {
                alert(lang.LANG_CONFALERT_SMTP_USER_PWD_REQ);
                return false;
            } else if (!svr_ip.value) {
                alert(lang.LANG_CONFALERT_SMTP_SERVERIP + "\n" +
                        lang.LANG_CONFALERT_SENDER_USER + "\n" +
                        lang.LANG_CONFALERT_SENDER_PASSWORD + "\n" +
                        lang.LANG_GENERAL_INTERDEPENDENT_VALUE, {type: "pre"});
                return false;
            } else if (pwd.value.length > 20) {
                alert(lang.LANG_CONFALERT_SENDER_PASSWORD + "\n" +
                        lang.LANG_CONFUSER_ADD_PWD_TOO_LONG, {type: "pre"});
                return false;
            }
        }
    }
    return true;
}

function getTextTag(tag, text) {
    "use strict";
    var result = "";
    result = "<" + tag + ">" + text + "</" + tag + ">";
    return result;
}

function requestConfig() {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/config_alert_email.cgi';
    var ajax_param = '';
    var ajax_data = readConfigXML();
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'POST',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                parameters: ajax_param,
                onComplete: responseAlertEmail }
            );

}

function readXMLNodeValue(record, name) {
    "use strict";
    var result = null;
    var nodes = null;
    if(record != null && name != null) {
        nodes = record.getElementsByTagName(name);
        if(nodes != null && nodes.length > 0) {
            if(nodes[0].firstChild != null) {
                result = nodes[0].firstChild.nodeValue;
            }
        }
    }
    return result;
}

function responseAlertEmail(originalRequest) {
    "use strict";
    var obj = null;
    var value = null;
    var oInput = null;

    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            //SessionTimeout();
            return;
        }
        //console.log("response from config_alert_email.cgi\n" + response);
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        //<?xml version="1.0"?>
        //<IPMI>
        //    <ALERTEMAIL>
        //        <SMTPSERVER>xxx.xxx.xxx.xxx</SMTPSERVER>
        //        <SMTPPORT>portnum</SMTPPORT>
        //        <AUTHMETHOD>0, 1 or 2</AUTHMETHOD>
        //        <SENDERADDR>xxx.xxx.xxx.xxx</SENDERADDR>
        //    </ALERTEMAIL>
        //</IPMI>

        var IPMIRoot = xmldoc.documentElement;//point to IPMI
        var AlertElements = IPMIRoot.getElementsByTagName('ALERTEMAIL');
        updateToken(IPMIRoot);
        //console.log("AlertElements.length:" + AlertElements.length + "\n" + response);

        if(AlertElements != null && AlertElements.length > 0) {
            for(var idx = 0; idx < AlertElements.length; idx++) {
                var record = AlertElements[idx];

                value = readXMLNodeValue(record, "SMTPSERVER");
                obj = document.getElementById("_text_smtp_address");
                obj.value = value;

                value = readXMLNodeValue(record, "SMTPPORT");
                obj = document.getElementById("_text_smtp_port");
                obj.value = value;

                value = readXMLNodeValue(record, "SENDERADDR");
                obj = document.getElementById("_text_sender_address");
                obj.value = value;

                value = readXMLNodeValue(record, "SENDERUSER");
                obj = document.getElementById("_text_sender_user");
                obj.value = value;

                value = readXMLNodeValue(record, "SENDERPWD");
                obj = document.getElementById("_text_sender_password");
                obj.value = value;

                value = readXMLNodeValue(record, "AUTHMETHOD");
                obj = document.getElementById("_text_auth_method");
                obj.value = value;

                setDisabledOps(obj);
            }
        }

        obj = document.getElementById("_checkbox_global_filtering_enable");
        updateCheckboxObj(obj, value);

    }
}

function setDisabledOps(selobj) {
    "use strict";
    if (selobj.value > 0) {
        document.getElementById("_text_sender_user").disabled = false;
        document.getElementById("_text_sender_password").disabled = false;
        document.getElementById("smtp_pass_prompt").className = 'labelhead';
        document.getElementById("smtp_user_prompt").className = 'labelhead';
    } else {
        document.getElementById("_text_sender_user").disabled = true;
        document.getElementById("_text_sender_password").disabled = true;
        document.getElementById("smtp_pass_prompt").className = 'labelhead disabled';
        document.getElementById("smtp_user_prompt").className = 'labelhead disabled';
    }
}

function responseSaveAlertEmail(originalRequest) {
    "use strict";
    var obj = null;
    var value = null;
    var oInput = null;

    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response from save config_alert_email.cgi\n" + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            //SessionTimeout();
            return;
        }

        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        } else {
            var result = GetXMLNodeValue(xmldoc, "RESULT");
            var IPMIRoot = xmldoc.documentElement;//point to IPMI
            updateToken(IPMIRoot);
            if(result == "OK") {
                alert(lang.LANG_CONFALERT_EMAIL_SUCCSAVE, {title:lang.LANG_SAVECONF_SAVE_BTN});
            }
        }
    }
}

function readConfigXML() {
    "use strict";
    var obj = null;
    var oInput = null;
    var result = "";

    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <ALERTEMAIL>\n";

    obj = document.getElementById("_text_smtp_address");
    result += "        " + getTextTag("SMTPSERVER", obj.value) + "\n";

    obj = document.getElementById("_text_smtp_port");
    result += "        " + getTextTag("SMTPPORT", obj.value) + "\n";

    obj = document.getElementById("_text_auth_method");
    result += "        " + getTextTag("AUTHMETHOD", obj.value) + "\n";

    obj = document.getElementById("_text_sender_address");
    result += "        " + getTextTag("SENDERADDR", obj.value) + "\n";

    obj = document.getElementById("_text_sender_user");
    result += "        " + getTextTag("SENDERUSER", obj.value) + "\n";

    obj = document.getElementById("_text_sender_password");
    result += "        " + getTextTag("SENDERPWD", obj.value) + "\n";

    result += "    </ALERTEMAIL>\n";
    result += "</IPMI>\n";
    return result;
}
