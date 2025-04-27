"use strict";

var lang;
var ikvmBtnObj;
var ikvmBtnKeyMacros;
var rmm_set;
var MAXIMUM_KEY_MACROS = 9;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/launch_redirection_hlp.html";
    ikvmBtnObj = document.getElementById("launchikvm");
    ikvmBtnObj.value = lang.LANG_MAN_IKVM_LAUNCH_CON;
    ikvmBtnObj.disabled = true;

    ikvmBtnKeyMacros = document.getElementById("savekeymacros");
    ikvmBtnKeyMacros.value = lang.LANG_MAN_IKVM_KEYBOARD_MACROS_SAVE;

    var btnSave = document.getElementById("savekeymacros");
    if(btnSave != null) {
        btnSave.addEventListener("click", WriteKeyboardMacros)
    }
    OutputString();
    InputValidation();
    CheckUserPrivilege(PrivilegeCallBack);
    ReadKeyMacros();
}

function RMMCallBack(Mode) {
    "use strict";
    if (Mode == "ON") {
        checkIKVMServiceStatus();
    } else {
        ikvmBtnObj.disabled = true;
        document.getElementById("_m0_value").disabled = true;
        document.getElementById("_m0_name").disabled = true;
        document.getElementById("_m1_value").disabled = true;
        document.getElementById("_m1_name").disabled = true;
        document.getElementById("_m2_value").disabled = true;
        document.getElementById("_m2_name").disabled = true;
        document.getElementById("_m3_value").disabled = true;
        document.getElementById("_m3_name").disabled = true;
        document.getElementById("_m4_value").disabled = true;
        document.getElementById("_m4_name").disabled = true;
        document.getElementById("_m5_value").disabled = true;
        document.getElementById("_m5_name").disabled = true;
        document.getElementById("_m6_value").disabled = true;
        document.getElementById("_m6_name").disabled = true;
        document.getElementById("_m7_value").disabled = true;
        document.getElementById("_m7_name").disabled = true;
        document.getElementById("_m8_value").disabled = true;
        document.getElementById("_m8_name").disabled = true;
        document.getElementById("_m9_value").disabled = true;
        document.getElementById("_m9_name").disabled = true;
        ikvmBtnKeyMacros.disabled = true;
        alert(lang.LANG_SYS_INFO_RMM_KEY_MODULE_IS_NOT_INSTALLED);
    }
}

function OutputString() {
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_MAN_IKVM_CAPTION;
    document.getElementById("kb_macros_legend").textContent = lang.LANG_MAN_IKVM_KEYBOARD_MACROS;
    document.getElementById("kb_macros_desc").textContent = lang.LANG_MAN_IKVM_KEYBOARD_MACROS_DESC;
    document.getElementById("key_filed_lbl").textContent = lang.LANG_MAN_IKVM_KEYBOARD_MACROS_KEY_FIELD;
    document.getElementById("name_field_lbl").textContent = lang.LANG_MAN_IKVM_KEYBOARD_MACROS_NAME_FIELD;
}

function initCheckEmptyListener(obj_id, field_title, keymacro_idx) {
    "use strict";
    if(obj_id != null) {
        var element = document.getElementById(obj_id);
        if(element != null) {
            var check_title = field_title;
            var check_id = obj_id;
            var keysequence_title = keymacro_idx;
            element.onchange = function () {
                var tmpElement = document.getElementById(check_id);
                if(tmpElement != null) {
                    if(tmpElement.value == "") {
                        //show alert message the key macros will be remove.
                        var msg = keysequence_title + ", " + lang.LANG_MAN_IKVM_KEYBOARD_MACROS_REMOVE_ALERT;
                        alert(msg);
                    }
                }
            }
        }
    }
}

function InputValidation() {
    "use strict";
    var keySequence, btnName, k, idx;
    for(var i = 0; i <= MAXIMUM_KEY_MACROS; i++) {
        var key_id = "_m" + i +"_value";
        var btn_id = "_m" + i +"_name";
        k = i + 1;
        idx = "#" + k;
        initCheckInputListener(key_id, lang.LANG_MAN_IKVM_KEYBOARD_MACROS_KEY_FIELD + idx, INPUT_FIELD.KEYMACROS);
        initCheckInputListener(btn_id, lang.LANG_MAN_IKVM_KEYBOARD_MACROS_NAME_FIELD + idx, INPUT_FIELD.KEYMACROS_NAME);
        initCheckEmptyListener(key_id, lang.LANG_MAN_IKVM_KEYBOARD_MACROS_KEY_FIELD + idx, idx);
        initCheckEmptyListener(btn_id, lang.LANG_MAN_IKVM_KEYBOARD_MACROS_NAME_FIELD + idx, idx);
    }
}

function SwlCallBack(swl_type, swl_status)
{
    "use strict";
    if (swl_type == "SWLIC") {
        checkIKVMServiceStatus();
    } else {
        GetRMMKeyStatus(RMMCallBack);
    }
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if (Privilege == '04') {
        ikvmBtnKeyMacros.disabled = false;
        getSwlStatus(SwlCallBack);
        document.body.style.display = "inline";
    } else {
        location.href = SubMainPage;
        return;
    }
    return;
}

function GenerateQueryXML() {
    "use strict";
    var result = "<?xml version=\"1.0\"?>\n";
    result += "<IKVM_KEYMACROS>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "</IKVM_KEYMACROS>\n"
        return result;
}


function checkKeymacrosNoname() {
    "use strict";
    var name = "";
    var keymacro = "";
    var result = true;
    var wrong_message = ""
        for (var idx = 0; idx < 10; idx++) {
            var target_id = "_m" + idx + "_value";
            var temp_edit = document.getElementById(target_id);
            if(temp_edit != null) {
                keymacro = temp_edit.value;
            }

            target_id = "_m" + idx + "_name";
            temp_edit = document.getElementById(target_id);
            if(temp_edit != null) {
                name = temp_edit.value;
            }
        }

    return result;
}

function GenerateKeymacrosXML() {
    "use strict";
    var result = "<?xml version=\"1.0\"?>\n";
    result += "<IKVM_KEYMACROS>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    for (var idx = 0; idx < 10; idx++) {
        var KeyMacroName;
        var KeyMacroKeys;
        var KeyNameObj;
        var KeyValueObj;
        var FieldStr;

        for (idx = 0; idx < 10; idx++) {
            FieldStr = "_m" + idx + "_name"
                KeyNameObj = document.getElementById(FieldStr);
            FieldStr = "_m" + idx + "_value"
                KeyValueObj = document.getElementById(FieldStr);
            if(KeyNameObj != null &&
                    KeyValueObj != null &&
                    KeyNameObj.value != null &&
                    KeyNameObj.value.length > 0 &&
                    KeyValueObj.value != null &&
                    KeyValueObj.value.length > 0) {
                result += "    <KEYMACRO NAME=\"" + KeyNameObj.value + "\"  KEYS=\"" + KeyValueObj.value + "\"/>\n";
            }
        }
    }
    result += "</IKVM_KEYMACROS>\n";
    return result;
}

function checkIKVMServiceStatus() {
    "use strict";
    checkKeymacrosNoname();
    var ajax_url = '../cgi/getnwservice.cgi';
    var ajax_param = '';
    var ajax_data = GenerateQueryXML();
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'POST',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: responseIKVMServiceStatus }//register callback function
            );
}

//handler for write keyboard macros
function WriteKeyMacrosHandler(originalRequest)
{
    "use strict";
    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText;
        var xml_obj = GetResponseXML(response);
        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if(result == "OK") {
            alert(lang.LANG_MAN_IKVM_KEYBOARD_MACROS_UPDATE_SUCCESS,
                    {title: lang.LANG_GENERAL_SUCCESS,
                        onClose: function() {ReadKeyMacros();}});
        }
        else {
            alert(lang.LANG_MAN_IKVM_KEYBOARD_MACROS_UPDATE_FAIL);
        }
    }
}

function WriteKeyboardMacros()
{
    "use strict";
    checkKeymacrosNoname();
    var ajax_url = '../cgi/keymacros.cgi';
    var ajax_param = '';
    var ajax_data = GenerateKeymacrosXML();
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'UPDATE',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: WriteKeyMacrosHandler }//register callback function
            );
}

//handler for read keyboard macros
function ReadKeyMacrosHandler(originalRequest)
{
    "use strict";
    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText;
        var xml_obj = GetResponseXML(response);
        if(xml_obj != null)
        {
            var idx = 0;
            var KEYMACROSRoot = xml_obj.documentElement;
            var KeyMacros = KEYMACROSRoot.getElementsByTagName('KEYMACRO');//point to KEYMACRO
            var KeyMacroName;
            var KeyMacroKeys;
            var KeyNameObj;
            var KeyValueObj;
            var FieldStr;
            if(KeyMacros != null) {
                for (idx = 0; idx < KeyMacros.length; idx++) {
                    KeyMacroName = KeyMacros[idx].getAttribute("NAME");
                    KeyMacroKeys = KeyMacros[idx].getAttribute("KEYS");
                    FieldStr = "_m" + idx + "_name";
                    KeyNameObj = document.getElementById(FieldStr);
                    FieldStr = "_m" + idx + "_value";
                    KeyValueObj = document.getElementById(FieldStr);
                    if(KeyNameObj != null && KeyValueObj != null) {
                        KeyNameObj.value = KeyMacroName;
                        KeyNameObj.defaultValue = KeyMacroName;
                        KeyValueObj.value = KeyMacroKeys;
                        KeyValueObj.defaultValue = KeyMacroKeys;
                    }
                }

                for (idx = KeyMacros.length; idx <= MAXIMUM_KEY_MACROS; idx++) {
                    FieldStr = "_m" + idx + "_name";
                    KeyNameObj = document.getElementById(FieldStr);
                    FieldStr = "_m" + idx + "_value";
                    KeyValueObj = document.getElementById(FieldStr);
                    if (KeyNameObj != null && KeyValueObj != null) {
                        KeyNameObj.value = "";
                        KeyNameObj.defaultValue = "";
                        KeyValueObj.value = "";
                        KeyValueObj.defaultValue = "";
                    }
                }
            }
        }
    }
}

function responseIKVMServiceStatus(response) {
    "use strict";
    //<?xml version="1.0"?>
    //<IPMI>
    //  <NETWORK_SERVICE>
    //    <GET_STATUS SMASH_SSH_SERVICE="1" SOL_SSH_SERVICE="1" HTTP_SERVICE="1" RMCP_SERVICE="1" IKVM_SERVICE="1"/>
    //  </NETWORK_SERVICE>
    //</IPMI>
    var iKVMServiceReady = false;
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        //check session & privilege result
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        if(xml_obj != null) {
            var root = xml_obj.documentElement;
            var rmm_info = root.getElementsByTagName("NETWORK_SERVICE")[0];
            var rmm_status = rmm_info.getElementsByTagName("GET_STATUS")[0];
            var status = rmm_status.getAttribute("IKVM_SERVICE");
            if(status == "1") {
                iKVMServiceReady = true;
            }
        }
    }

    if(iKVMServiceReady == true) {
        GetJNLPRequest(ikvmBtnObj, 0);
        ikvmBtnObj.disabled = false;
    }
    else {
        ikvmBtnObj.disabled = true;
    }
}

function ReadKeyMacros()
{
    "use strict";
    var ajax_url = '../cgi/keymacros.cgi';
    var ajax_param = '';
    var ajax_data = GenerateQueryXML();
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'POST',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: ReadKeyMacrosHandler }//register callback function
            );
}
