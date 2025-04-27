"use strict";

//declare all global variables
var isSuperUser = 0;
var isISOmounted = 0;
var devstat = [];
var mLangMap = null;
var var_sav_btn;
var var_mount_btn;
var var_unmount_btn;
var var_refresh_btn;
var var_share_host;
var var_path_arg;
var var_user_arg;
var var_pwd_arg;
var lang;
var var_mount_type;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit() {
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/vm_webiso_hlp.html";
    mLangMap = top.frames.topmenu.gLang;
    var_sav_btn = document.getElementById("save_btn");
    var_sav_btn.setAttribute("value", lang.LANG_VM_WEBISO_SAVE);
    var_mount_btn = document.getElementById("mount_btn");
    var_mount_btn.setAttribute("value", lang.LANG_VM_WEBISO_MOUNT);
    var_unmount_btn = document.getElementById("unmount_btn");
    var_unmount_btn.setAttribute("value", lang.LANG_VM_FLOPPY_UNMOUNT);
    var_refresh_btn = document.getElementById("refresh_status_btn");
    var_refresh_btn.setAttribute("value", lang.LANG_VM_FLOPPY_REFRESH);

    devstat.push($("#dev_stat"));
    //devstat.push($("#dev4_stat"));
    OutputString();

    var_mount_type = document.getElementById("mount_type");
    var_share_host = document.getElementById("share_host");
    var_path_arg = document.getElementById("path_argument");
    var_user_arg = document.getElementById("user_argument");
    var_pwd_arg = document.getElementById("pwd_argument");

    var_sav_btn.onclick = SetSharedImageConfig;
    var_mount_btn.onclick = MountSharedImage;
    var_unmount_btn.onclick = UnmountTask;
    var_refresh_btn.onclick = GetVMSTatus;
    userSelectChange();

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);

    //check input format
    initCheckInputListener("share_host", lang.LANG_VM_WEBISO_HOST, INPUT_FIELD.IPV4);
    initCheckInputListener("path_argument", lang.LANG_VM_WEBISO_PATH, INPUT_FIELD.PATH);
    initCheckInputListener("pwd_argument", lang.LANG_VM_WEBISO_PWD, INPUT_FIELD.PASSWORD);
}

function disabledUnmount(enabled) {
    "use strict";
    if (enabled)
        var_unmount_btn.disabled = true;
    else
        var_unmount_btn.disabled = false;
}

function disabledMount(enabled) {
    "use strict";
    if (enabled)
        var_mount_btn.disabled = true;
    else
        var_mount_btn.disabled = false;
}

function isMountISO(enabled) {
    "use strict";
    if (enabled) {
        disabledMount(true);
        disabledUnmount(false);
    } else {
        disabledMount(false);
        disabledUnmount(true);
    }
}

function OutputString() {
    "use strict";
    document.getElementById("div_caption").textContent = lang.LANG_VMEDIA_WEB_ISO;
    document.getElementById("div_device").textContent = lang.LANG_VM_DEVICE;
    document.getElementById("div_type").textContent = lang.LANG_VM_WEBISO_TYPE;
    document.getElementById("div_host").textContent = lang.LANG_VM_WEBISO_HOST;
    document.getElementById("div_path").textContent = lang.LANG_VM_WEBISO_PATH;
    document.getElementById("div_user").textContent = lang.LANG_VM_WEBISO_USER;
    document.getElementById("div_pwd").textContent = lang.LANG_VM_WEBISO_PWD;
}

function RMMCallBack(Mode)
{
    if (Mode == "ON") {
        isSuperUser = 1;
        Func_Enable();
        GetVMSTatus();
        GetVMCDROMConfig();
    } else {
        var_sav_btn.disabled = true;
        var_mount_btn.disabled = true;
        var_unmount_btn.disabled = true;
        var_refresh_btn.disabled = true;
        var_share_host.disabled = true;
        var_path_arg.disabled = true;
        var_user_arg.disabled = true;
        var_pwd_arg.disabled = true;
        document.getElementById("mount_type").disabled = true;
        alert(lang.LANG_SYS_INFO_RMM_KEY_MODULE_IS_NOT_INSTALLED);
    }
}

function SwlCallBack(swl_type, swl_status)
{
    "use strict";
    if (swl_type == "SWLIC") {
        if (swl_status == "ACTIVED") {
            isSuperUser = 1;
            Func_Enable();
            GetVMSTatus();
            //GetSharedImageConfig();
            GetVMCDROMConfig();
        } else {
            var_sav_btn.disabled = true;
            var_mount_btn.disabled = true;
            var_unmount_btn.disabled = true;
            var_refresh_btn.disabled = true;
            var_share_host.disabled = true;
            var_path_arg.disabled = true;
            var_user_arg.disabled = true;
            var_pwd_arg.disabled = true;
            document.getElementById("mount_type").disabled = true;
            alert(lang.LANG_SYS_INFO_SOFT_LICENSE_INACTIVATED);
        }
    } else { // RMM
        GetRMMKeyStatus(RMMCallBack);
    }
}

function PrivilegeCallBack(Privilege) {
    "use strict";
    //full access
    if (Privilege == '04') {
        getSwlStatus(SwlCallBack);
    } else {
        location.href = SubMainPage;
        return;
    }
    return;
}

function OnMountSharedImageRsp(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xml_obj = GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }
        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "OK") {
            disabledMount(true);
            disabledUnmount(false);
            alert(lang.LANG_VM_WEBISO_MOUNT_SUCC);
            GetVMSTatus();
        } else if (result == "NODE_BUSY") {
            disabledMount(false);
            disabledUnmount(true);
            alert(lang.LANG_VM_WEBISO_MOUNT_BUSY);
        } else {
            disabledMount(false);
            disabledUnmount(true);
            alert(lang.LANG_VM_WEBISO_MOUNT_FAIL);
        }
    }
}

function MountSharedImage() {
    "use strict";
    Loading(true);
    var select_dev = getSelectDev();
    var ajax_url = '/cgi/vm_webiso.cgi';
    var ajax_param = '';
    var ajax_data = generateXMLPostWithDev("MOUNT", select_dev);
    var ajax_req = new Ajax.Request(
        ajax_url, {
            method: 'POST',
            contentType: "text/xml",
            xml_data: ajax_data,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            parameters: ajax_param,
            onComplete: OnMountSharedImageRsp
        } //reigister callback function
    );
}

function OnUnmountTaskRsp(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xml_obj = GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }
        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "OK") {
            disabledUnmount(true);
            disabledMount(false);
            alert(lang.LANG_VM_WEBISO_UNMOUNT_SUCC);
            GetVMSTatus();
        } else {
            disabledUnmount(false);
            disabledMount(true);
            alert(lang.LANG_VM_WEBISO_UNMOUNT_FAIL);
        }
    }
}

function UnmountTask() {
    "use strict";
    Loading(true);
    var ajax_url = '/cgi/vm_webiso.cgi';
    var ajax_param = '';
    var ajax_data = generateXMLPost("UNMOUNT");
    var ajax_req = new Ajax.Request(
        ajax_url, {
            method: 'POST',
            contentType: "text/xml",
            xml_data: ajax_data,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            parameters: ajax_param,
            onComplete: OnUnmountTaskRsp
        } //reigister callback function
    );
}

function GetVMSTatus() {
    "use strict";
    Loading(true);
    var ajax_url = '/cgi/vm_webiso.cgi';
    var ajax_param = '';
    var ajax_data = generateXMLPost("QUERY");
    var ajax_req = new Ajax.Request(
        ajax_url, {
            method: 'POST',
            contentType: "text/xml",
            xml_data: ajax_data,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            parameters: ajax_param,
            onComplete: VMStatusResp
        });
}

function VMStatusResp(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xml_obj = GetResponseXML(response);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_CONF_NETWORK_UPDATE_FAIL);
            return;
        }

        var idx = 0;
        var root = xml_obj.documentElement;
        var devNum;

        var node = root.getElementsByTagName("TOTAL_NUMBER")[0];
        if (node != null) {
            devNum = node.getAttribute("NUM");
        }

        var node = root.getElementsByTagName("DEVICE");
        var i = 0;
        var dev_status = 0; // Initial with no available device
        for (i = 0, dev_status = 0; i < devNum; i++) {
            var channel_id = node[i].getAttribute("DEVICE_ID");
            var Inserted = node[i].getAttribute("Inserted");
            var ConnectedVia = node[i].getAttribute("ConnectedVia");
            var MediaType = node[i].getAttribute("MediaType");

            if (Inserted != 1) {  // first availabe device
                dev_status = 1;
                isMountISO(false);
            } else if ((ConnectedVia != 1)) {
                // dev_status = 0;
                isMountISO(false);
            } else if (MediaType == 3) { // Web ISO is using
                dev_status = 2;
                isMountISO(true);
                break;
            }
        }

        switch (dev_status) {
            case 0:
                devstat[0].text(lang.LANG_VM_FLOPPY_OTHERS);
                break;
            case 1:
                devstat[0].text(lang.LANG_VM_FLOPPY_NO_DISK);
                break;
            case 2:
                devstat[0].text(lang.LANG_VM_FLOPPY_HAS_ISO);
                break;
            default:
                devstat[0].text(lang.LANG_VM_FLOPPY_OTHERS);
                break;

        }

    }
}

function GetVMCDROMConfig() {
    "use strict";
    Loading(true);
    // get select device
    var select_dev = getSelectDev();

    var ajax_url = '/cgi/vm_webiso.cgi';
    var ajax_param = '';
    var ajax_data = generateXMLPostWithDev("GETCFG", select_dev);
    var ajax_req = new Ajax.Request(
        ajax_url, {
            method: 'POST',
            contentType: "text/xml",
            xml_data: ajax_data,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            parameters: ajax_param,
            onComplete: GetVMCDROMConfigResp
        } //reigister callback function
    );
}

function GetVMCDROMConfigResp(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xml_obj = GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }
        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_CONF_NETWORK_UPDATE_FAIL);
            return;
        }
        var idx = 0;
        var root = xml_obj.documentElement;

        var node = root.getElementsByTagName("VMISO");
        var i = 0;
        if (node != null) {
            var host = node[0].getAttribute("HOST");
            var path = atob(node[0].getAttribute("PATH"));
            var user = node[0].getAttribute("USER");
            var pwd = node[0].getAttribute("PWD");
            var_share_host.value = host;

            if (path.startsWith('nfs://')) {
                //var_mount_type.value = 'nfs://';
                var_path_arg.value = path.replace('nfs://', '');
            } else if (path.startsWith('cifs://')) {
                //var_mount_type.value = 'cifs://';
                var_path_arg.value = path.replace('cifs://', '');
            } else{
                //var_mount_type.value = 'cifs://';
                var_path_arg.value = path.replace('cifs://', '');
            }

            var_user_arg.value = user;
            var_pwd_arg.value = pwd;
        }
    }
}

function Func_Enable() {
    "use strict";
    var_share_host.disabled = false;
    var_path_arg.disabled = false;
    var_user_arg.disabled = false;
    var_pwd_arg.disabled = false;

    var_share_host.focus();
}

function SetSharedImageConfig() {
    "use strict";
    var path_str;
    if (Trim(var_share_host.value) == "") {
        alert(lang.LANG_VM_FLOPPY_ERR4);
        return;
    }

    var select_dev = getSelectDev();
    var mount_type = document.getElementById("mount_type");
    path_str = mount_type.value + var_path_arg.value;

    if (Trim(path_str) == "") {
        alert(lang.LANG_VM_FLOPPY_ERR5);
        return;
    }
    Loading(true);
    var ajax_url = '/cgi/vm_webiso.cgi';
    var ajax_param = '';
    var ajax_data = generateXMLSave(var_share_host.value,
        btoa(path_str),
        Trim(var_user_arg.value),
        btoa(Trim(var_pwd_arg.value)),
        select_dev
    );
    // console.log("request update ipv4 config :\n" + ajax_data + "\n\n");
    var ajax_req = new Ajax.Request(ajax_url,
        {
            method: 'UPDATE',
            contentType: "text/xml",
            xml_data: ajax_data,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            parameters: ajax_param,
            onComplete: SetSharedImageConfigResp
        }//register callback function
    );
}

function SetSharedImageConfigResp(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xml_obj = GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        var isOK = GetXMLNodeValue(xml_obj, "RESULT");
        if (isOK == "OK") {
            alert(lang.LANG_VM_WEBISO_SUCC);
        } else {
            alert(lang.LANG_VM_WEBISO_FAIL);
        }
    }
}


function generateXMLSave(host, path, user, pwd, select_dev) {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <ISO_CONFIG SELECT_DEV=\"" + select_dev +
        "\" HOST=\"" + host +
        "\" PATH=\"" + path +
        "\" USER=\"" + user +
        "\" PWD=\"" + pwd + "\" />\n";
    result += "</IPMI>\n";
    return result;
}


function generateXMLPostWithDev(action, select_dev) {
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <VM ACTION=\"" + action + "\"/>\n";
    result += "    <ISO_CONFIG SELECT_DEV=\"" + select_dev + "\"/>\n";
    result += "</IPMI>\n";
    return result;
}


function generateXMLPost(action) {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <VM ACTION=\"" + action + "\"/>\n";
    result += "</IPMI>\n";
    return result;
}

function getSelectDev(){
    var mount_type = document.getElementById("mount_type").value;
    var selectDev = -1;
    if( mount_type == 'cifs://' ){
        selectDev = 0;
    }
    else if( mount_type == 'nfs://'){
        selectDev = 1;
    }

    return selectDev;
}

function userSelectChange(){
    $('#mount_type').on('change', function(evt) {
        GetVMCDROMConfig();
    })
}
