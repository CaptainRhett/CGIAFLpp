"use strict";
var VMHTML5PAGE="../cgi/url_redirect.cgi?url_name=man_vm_html5";
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit() {
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting +
        "/vm_html5_hlp.html";
    document.getElementById("caption_div").textContent = lang.LANG_VM_HTML5_CAPTION;
    document.getElementById("launch").textContent = lang.LANG_VM_HTML5_LAUNCH;
    var vmhtml5BtnObj = document.getElementById("launchVmHtml5");
    vmhtml5BtnObj.value = lang.LANG_VM_HTML5_BUTTON;
    vmhtml5BtnObj.disabled = true;
    CheckUserPrivilege(PrivilegeCallBack);
}

function GenerateQueryXML() {
    "use strict";
    var result = "<?xml version=\"1.0\"?>\n";
    result += "<IKVM_KEYMACROS>\n";
    result += "    <SID></SID>\n";
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
    var vmhtml5BtnObj = document.getElementById("launchVmHtml5");
    iKVMServiceReady = true;
    if (iKVMServiceReady == true) {
        vmhtml5BtnObj.disabled = false;
    } else {
        vmhtml5BtnObj.disabled = true;
    }
}

function checkIKVMServiceStatus() {
    "use strict";
    //checkKeymacrosNoname();
    var ajax_url = '../cgi/getnwservice.cgi';
    var ajax_param = '';
    var QueryXML = GenerateQueryXML();
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
    var vmhtml5BtnObj = document.getElementById("launchVmHtml5");
    if (swl_type == "SWLIC") {
        if (swl_status == "ACTIVED") {
            checkIKVMServiceStatus();
        } else {
            vmhtml5BtnObj.disabled = true;
            alert(lang.LANG_SYS_INFO_SOFT_LICENSE_INACTIVATED);
        }
    } else { // RMM
        GetRMMKeyStatus(RMMCallBack);
    }
}

function RMMCallBack(Mode) {
    "use strict";
    var vmhtml5BtnObj = document.getElementById("launchVmHtml5");
    if (Mode == "ON") {
        checkIKVMServiceStatus();
    }
    else {
        vmhtml5BtnObj.disabled = true;
        alert(lang.LANG_SYS_INFO_RMM_KEY_MODULE_IS_NOT_INSTALLED);
    }
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    var vmhtml5BtnObj = document.getElementById("launchVmHtml5");
    if(Privilege == '04')
    {
        getSwlStatus(SwlCallBack);
        "use strict";
        vmhtml5BtnObj.onclick=function() {
            window.open(VMHTML5PAGE, 'VM_HTML5', 'menubar=yes,toolbar=no,scrollbars=yes,resizable=yes,channelmode=no,height=380,width=670');
        };
    }
    else
    {
        location.href = SubMainPage;
    }
    return;
}
