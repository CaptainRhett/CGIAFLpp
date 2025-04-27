"use strict";

var CONFPAGE="../cgi/url_redirect.cgi?url_name=remote";
var HTML5PAGE="../cgi/url_redirect.cgi?url_name=man_ikvm_html5_auto";
var ikvmhtml5BtnObj;
var ikvmBtnKeyMacros;
var QueryXML;
var KeyMacrosResult;
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting +
        "/ikvm_html5_hlp.html";
    document.getElementById("caption_div").textContent = lang.LANG_MAN_IKVM_HTML5_CAPTION;
    ikvmhtml5BtnObj = document.getElementById("launchikvmhtml5");
    ikvmhtml5BtnObj.value = lang.LANG_MAN_IKVM_HTML5_LAUNCH_CON;
    ikvmhtml5BtnObj.disabled=true;

    document.getElementById("desc").textContent = lang.LANG_MAN_IKVM_HTML5_DESC;
    /*
       var btnSave = document.getElementById("savekeymacros");
       if(btnSave != null) {
       btnSave.onclick = WriteKeyboardMacros;
    // btnSave.attachEvent("click", WriteKeyboardMacros);
    }
    */
    CheckUserPrivilege(PrivilegeCallBack);
    ReadKeyMacros();
}

function GenerateQueryXML() {
    "use strict";
    var result = "<?xml version=\"1.0\"?>\n";
    result += "<IKVM_KEYMACROS>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "</IKVM_KEYMACROS>\n";
    return result;
}

function responseIKVMServiceStatus(response) {
    "use strict";
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

    if (iKVMServiceReady == true) {
        ikvmhtml5BtnObj.disabled = false;
    } else {
        ikvmhtml5BtnObj.disabled = true;
    }
}

function checkIKVMServiceStatus() {
    "use strict";
    //checkKeymacrosNoname();
    var ajax_url = '../cgi/getnwservice.cgi';
    var ajax_param = '';
    QueryXML = GenerateQueryXML();
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'POST',
                contentType: "text/xml",
                xml_data: QueryXML,
                parameters: ajax_param,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: responseIKVMServiceStatus }//register callback function
            );
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

function RMMCallBack(Mode) {
    "use strict";
    if (Mode == "ON") {
        checkIKVMServiceStatus();
    } else {
        ikvmhtml5BtnObj.disabled = true;
        alert(lang.LANG_SYS_INFO_RMM_KEY_MODULE_IS_NOT_INSTALLED);
    }
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if(Privilege == '04')
    {
        getSwlStatus(SwlCallBack);

        ikvmhtml5BtnObj.onclick=function() {
            // menubar=yes and channelbarmode=no are for IE Developer tool
            window.open(HTML5PAGE, 'iKVM_HTML5', 'menubar=yes,toolbar=no,scrollbars=yes,resizable=yes,channelmode=no');
        };
    }
    else
    {
        location.href = SubMainPage;
    }
    return;
}

function WriteKeyboardMacros()
{
    "use strict";
    var ajax_url = '/cgi/keymacros.cgi';
    var ajax_param = 'SET_KEYMACROS.XML';
    var ajax_data;
    ajax_data = GenerateQueryXML();
    var ajax_req = new Ajax.Request(
            ajax_url,
            {method: 'post', contentType: "text/xml", xml_data: ajax_data, parameters: ajax_param, onComplete: WriteKeyMacrosHandler}//register callback function
            );
}

function ReadKeyMacros()
{
    "use strict";
    var ajax_url = '/cgi/keymacros.cgi';
    var ajax_param = '';
    var ajax_data = GenerateQueryXML();
    var ajax_req = new Ajax.Request(ajax_url, {
        method: 'POST',
        contentType: "text/xml",
        xml_data: ajax_data,
        parameters: ajax_param,
        timeout: g_CGIRequestTimeout,
        ontimeout: onCGIRequestTimeout,
        onComplete: ReadKeyMacrosHandler
    } //register callback function
    );
}

function ReadKeyMacrosHandler(originalRequest) {
    "use strict";
    KeyMacrosResult = originalRequest;
}
