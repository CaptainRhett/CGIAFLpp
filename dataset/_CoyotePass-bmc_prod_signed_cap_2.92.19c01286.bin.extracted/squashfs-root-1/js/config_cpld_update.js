"use strict";
var lang;
var reader;
var last_state = null;
var activefwfile = null;

/* configuration firmware update page */
(function($) {
"use strict";

$( document ).ready(function() { $.PageInit(); });
if (parent.lang) { lang = parent.lang; }

$.PageInit = function() {
    "use strict";
    document.title = lang.LANG_CONFIG_SUBMENU_CPLD_UPD;
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/config_cpld_help.html";
    document.getElementById("cpld_immediately_check").addEventListener("change", onImmediatelyCheckedChange);
    $("#uploadBtn").attr("value", lang.LANG_COMMON_BTN_UPLOAD).click(FW_UploadBtn);
    $("#resetBtn").attr("value", lang.LANG_CONFIG_FWUPD_RESET).click(ErrorFinishFwUpdate);
    $("#FileBrowse")
            .click(function(e) { $(this).attr("value", null); })
            .change(function () { checkfile(); });
    $("#fwmsg").hide();
    $("#fwerror").hide();
    UploadEnable(true);
    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function updateInfo() {
    "use strict";
    // get the firmware update status
    GetFwInfo();
    //GetFwUpdateStatus();
}

function UploadEnable(enable) {
    "use strict";
    var dropzone = document.documentElement;
    var uploader = $("#fwUpdButtons");
    var curstatus = $("#fwUpdStatus");
    if (enable) {
        $("#FileBrowse").val(null);
        dropzone.ondragover = dropzone.ondragenter = function(e) {
            e.stopPropagation();
            e.preventDefault();
        }

        dropzone.ondrop = function(e) {
            e.stopPropagation();
            e.preventDefault();

            var filesArray = e.dataTransfer.files;
            if (filesArray.length > 1)
                return false;
            sendFile(filesArray[0]);
        }
        uploader.show();
        curstatus.hide();
    } else {
        dropzone.ondrop = dropzone.ondragover = dropzone.ondragenter = function(e) {}
        uploader.hide();
        curstatus.show();
    }
}

function sendFile(file) {
    "use strict";
    reader = new FileReader();
    activefwfile = file.name;
    reader.onloadstart = LoadFileStart;
    reader.onload = UploadStart;
    reader.readAsArrayBuffer(file);
}

function OutputString() {
    "use strict";
    document.getElementById("submenu_div").textContent = lang.LANG_CONFIG_SUBMENU_CPLD_UPD;
    document.getElementById("desc_p").textContent = lang.LANG_CONFIG_CPLD_UPD_DESC;
    document.getElementById("submenu_legend").textContent = lang.LANG_CONFIG_SUBMENU_CPLD_UPD;
    document.getElementById("cpld_rev_span").textContent = lang.LANG_SYS_INFO_CPLD_REV;
    document.getElementById("cpld_update_lbl").textContent = lang.LANG_CONFIG_CPLDUPD_OPTION_LABEL;
    document.getElementById("cpld_backup_option").textContent = lang.LANG_CONFIG_FWUPD_BACKUP_REGION_VALUE;
    document.getElementById("cpld_immediately_option").textContent = lang.LANG_CONFIG_FWUPD_RESET_IMMEDIATELY;
    document.getElementById("drop_file").textContent = lang.LANG_CONFIG_FWUPD_DROP_FILE;
    document.getElementById("fwupload-label").textContent = lang.LANG_CONFIG_FWUPD_UPLOAD;
    document.getElementById("fwauthenticate-label").textContent = lang.LANG_CONFIG_FWUPD_AUTHENTICATE;
    document.getElementById("fwauthenticate-value").textContent = lang.LANG_CONFIG_CPLDUPD_FWUPD_PENDING;
    document.getElementById("fwprogram-label").textContent = lang.LANG_CONFIG_FWUPD_PROGRAM;
    document.getElementById("fwprogram-value").textContent = lang.LANG_CONFIG_CPLDUPD_FWUPD_PENDING;
    document.getElementById("fwready-label").textContent = lang.LANG_CONFIG_CPLDUPD_FWUPD_READY;
    document.getElementById("fwready-value").textContent = lang.LANG_CONFIG_CPLDUPD_FWUPD_PENDING;
    document.getElementById("fwerror-label").textContent = lang.LANG_CONFIG_FWUPD_ERROR;
    document.getElementById("fwerror-value").textContent = lang.LANG_CONFIG_CPLDUPD_FWUPD_PENDING;
    document.getElementById("fwmsg-value").textContent = lang.LANG_CONFIG_CPLDUPD_FWUPD_PENDING;
    document.getElementById("fw-immediately-msg").textContent = lang.LANG_CONFIG_FWUPD_READY_RESET_IMMEDIATELY;
    if (!($('#cpld_immediately_check').prop('checked'))) {
        $("#fw-immediately-msg").hide();
    }
}

function PrivilegeCallBack(Privilege){
    "use strict";
    //full access
    var uploadBtn = $("#uploadBtn");
    var FileBrowse = $("#FileBrowse");
    if(Privilege == '04')
    {
        uploadBtn.prop("disabled", true);
        FileBrowse.prop("disabled", false);
        updateInfo();
    }
    //only view
    else if(Privilege == '03' || Privilege == '02')
    {
        uploadBtn.prop("disabled", true);
        FileBrowse.prop("disabled", true);
        updateInfo();
    }
    //no access
    else
    {
        location.href = SubMainPage;
        uploadBtn.prop("disabled", true);
        FileBrowse.prop("disabled", true);
    }
}
function PrivilegeCallBackFileReady(Privilege) {
    "use strict";
    //full access
    var uploadBtn = $("#uploadBtn");
    var FileBrowse = $("#FileBrowse");
    if(Privilege == '04')
    {
        uploadBtn.prop("disabled", false);
        FileBrowse.prop("disabled", false);
    }
    else
    {
        uploadBtn.prop("disabled", true);
        FileBrowse.prop("disabled", true);
        FileBrowse.attr("value", null);
    }
}

function FwUpdateAbort(jqXHR, txtstatus, errmsg) {
    "use strict";
}

function GetFwInfo()
{
    "use strict";
    Loading(true);
    var url = '/cgi/getsysteminfo.cgi';
    var param = 'time_stamp='+(new Date());
    var data = GeneGenericRequestXML();
    //console.log(">>> getsysteminfo.cgi top.frames.topmenu.CSRF_TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    $.ajax(url, {
            type: 'post',
            contentType: 'text/xml',
            data: data,
            dataType: "xml",
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            success: ParseFWVersion,
            error: FwUpdateAbort
        });
}
function ParseFWVersion(xml_obj, txtstatus, jqXHR)
{
    "use strict";
    Loading(false);

    //check session & privilege result
    //console.log("<<< ParseFWVersion() top.frames.topmenu.CSRF_TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    if(CheckInvalidResult(xml_obj) < 0) {
        return;
    }

    var IPMIRoot = xml_obj.documentElement;
    var SYSTEM_INFO = IPMIRoot.getElementsByTagName('SYSTEM_INFO');//point to SYSTEM_INFO
    var SYSTEM = SYSTEM_INFO[0].getElementsByTagName('SYSTEM');
    var fw_version = SYSTEM[0].getAttribute("CPLDFW_VERSION");

    $('#curCPLDVer').text(fw_version);
    GetFwUpdateStatus();
}

function FW_UploadBtn(){
    "use strict";
    var FileExist = checkfile();
    if(FileExist == -1){
       return;
    }
    Loading(true);
    sendFile(FileExist);
}
function LoadFileStart() {
    "use strict";
    // console.log('file loading... ');
    UploadEnable(false);
    $('#cpld_backup_check').prop("disabled", true);
    $('#cpld_immediately_check').prop("disabled", true);
}

function onImmediatelyCheckedChange() {
    "use strict";
    if ($('#cpld_immediately_check').prop('checked')) {
        $("#fw-immediately-msg").show();
    } else {
        $("#fw-immediately-msg").hide();
    }
}

function UploadProgress(e) {
    "use strict";
    // console.log('file uploading... ' + e);
    if (e.lengthComputable) {
        var max = e.total;
        var current = e.loaded;
        var percent = (current * 100) / max;
        percent = Math.round(percent);
        if (percent > 100)
            percent = 100;
        DisplayStatus('upload', percent, '');
    }
}
function UploadStart(event){
    "use strict";
    // console.log('file load complete');
    Loading(false);
    $("#uploadBtn").prop("disabled", true);
    // console.log('file upload start');
    //console.log(">>> UploadStart top.frames.topmenu.CSRF_TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    var url = '/cgi/config_fw_update.cgi';
    $.ajax(url, {
                type: 'post',
                headers: {
                    FWUPLOAD: 1,
                    FWFNAME: activefwfile,
                    TOKEN: top.frames.topmenu.CSRF_TOKEN,
                },
                xhr: function() {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', UploadProgress, true);
                        myXhr.upload.addEventListener('start', UploadProgress, true);
                    }
                    return myXhr;
                },
                data: event.target.result,
                processData: false,
                contentType: 'application/octet-stream',
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                success: CheckUploadOk,
                error: CheckUploadOk
            }
        );
}

function reset_page() {
    "use strict";
    UploadEnable(true);
    CheckUserPrivilege(PrivilegeCallBack);
}

function reset_file_upload() {
    "use strict";
    $('#FileBrowse').val(null);
    $("#uploadBtn").prop("disabled", true);
}

function CheckUploadOk(xml_obj, txtstatus, jqXHR){
    "use strict";
    // check session & privilege
    if(CheckInvalidResult(xml_obj) < 0) {
       return;
    }

    if (xml_obj.status != undefined && xml_obj.status != 200) {
        alert(lang.LANG_CONFIG_FWUPD_ERROR + xml_obj.statusText);
        reset_page();
        return;
    }

    var IPMIRoot = xml_obj.documentElement;
    var isOK = IPMIRoot.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
    if(isOK == 'OK'){
        StartFwUpdate();
    }
    else{
       // console.log('file upload failed');
       alert(lang.LANG_NULLXML_SESSION_TIMEOUT);
       reset_page();
       return;
    }
    $("#uploadBtn").prop("disabled", false);
    Loading(false);
}

let ImageFlag_t = {
    CPLD_NORMAL: 0,
    CPLD_DEFER: 0x02,
    CPLD_BACKUP: 0x10,
}

function StartFwUpdate()
{
    "use strict";
    var url = '/cgi/config_fw_update.cgi';
    var ImageFlag = ImageFlag_t.CPLD_NORMAL;

    if (!($('#cpld_immediately_check').prop('checked')))
        ImageFlag = ImageFlag | ImageFlag_t.CPLD_DEFER;
    if ($('#cpld_backup_check').prop('checked'))
        ImageFlag = ImageFlag | ImageFlag_t.CPLD_BACKUP;

    $.ajax(url, {
            type: 'post',
            headers: {
                TOKEN: top.frames.topmenu.CSRF_TOKEN,
            },
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            success: GetFwUpdateStatus,
            data: genXML({"imgflag": ImageFlag})
        }
    );

}

function FinishFwUpdate() {
    "use strict";
    // console.log('fw update finish');
    var url = '/cgi/config_fw_update.cgi';
    //console.log(">>> config_fw_update.cgi top.frames.topmenu.CSRF_TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    $.ajax(url, {
                type: 'post',
                headers: {
                    TOKEN: top.frames.topmenu.CSRF_TOKEN,
                },
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                success: ShowFwUpdateStatus,
                data: genXML({finish: 1})
            }
        );
}
function ErrorFinishFwUpdate() {
    "use strict";
    FinishFwUpdate();
    var resetBtn = $("#resetBtn");
    resetBtn.disabled = true;
    $("#fwready-value").text(lang.LANG_CONFIG_FWUPD_DONE);
    // allow the BMC state transitions to complete and get the status again
    setTimeout(GetFwUpdateStatus, 1500);
}
function GetFwUpdateStatus() {
    "use strict";
    //console.log(">>> FW update status top.frames.topmenu.CSRF_TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    var url = '/cgi/config_fw_update.cgi';
    $.ajax(url, {
                type: 'get',
                cache: false,
                headers: {
                    TOKEN: top.frames.topmenu.CSRF_TOKEN,
                },
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                success: ShowFwUpdateStatus,
                data: { FwUpdateStatus: 1 },
            }
        );
}

function DisplayStatus(state, percent, msg) {
    "use strict";
    var resetBtn = $("#resetBtn");
    // console.log("DisplayStatus('"+state+"', '"+percent+"', '" + msg + "') last_state = '" + last_state + "'");
    var exp_states = [ 'initializing', 'idle', 'upload', 'authenticate', 'program', 'ready', 'error', 'ac_cycle_required' ];

    if (exp_states.indexOf(state) < 0) {
        // console.log("unxepected state: '"+state+"'");
        return;
    }

    if (state == "idle"){
        if(last_state == 'ready') {
            // If immreset is not checked, remains the page to notify users to reset.
            return;
        } else {
            UploadEnable(true);
            return;
        }
    }

    UploadEnable(false);

    if (state == 'error') {
        $("#fw"+last_state+"-value").removeClass('fwupd-active');
        $("#fw"+last_state+"-label").removeClass('fwupd-active');
        $("#fw"+state+"-value").text(msg).addClass('fwupd-active');
        $("#fw"+state+"-label").addClass('fwupd-active');
        $("#fwerror").show();
        resetBtn.disabled = false;
    } else if (state != last_state) {
        $("#fwerror").hide();
        if (last_state != 'idle') {
            if (msg.length > 0) {
                $("#fwmsg-value").text(msg).addClass('fwupd-active');
                $("#fwmsg").show();
            }
            $("#fw"+last_state+"-value").text(lang.LANG_CONFIG_FWUPD_DONE).removeClass('fwupd-active');
            $("#fw"+last_state+"-label").removeClass('fwupd-active');
        } else {
            // initial state change from idle to upload happens here;
            // the rest of the state changes happen in ShowFwUpdateStatus
            last_state = state;
        }
        $("#fw"+state+"-label").addClass('fwupd-active');
        $("#fw"+state+"-value").text(percent + '%').addClass('fwupd-active');

        if (state == 'ready' || state == 'ac_cycle_required') {
            // second time around for ready: first time we stopped auto-refresh
            // this is the response to the FinishFwUpdate call
            // notify the user we are waiting while the BMC reboots
            var state_str;
            var lang_str;
            var delayedSeconds = 0;

            if (!($('#cpld_immediately_check').prop('checked'))) {
                delayedSeconds = 45;
                lang_str = 'LANG_CONFIG_CPLDUPD_READY_START';
            }

            if (lang.hasOwnProperty(lang_str)) {
                state_str = lang[lang_str];
            } else {
                state_str = state;
            }

            // For PFR supported platforms, It takes 25 seconds for BMC to verify register PfrMbxWr8 is success.
            // So wait here for about 45 seconds, then page will notify the user to reset.
            DelayForSeconds(delayedSeconds, function(state, seconds) {
                var wait_str = lang.LANG_CONFIG_OOB_WAIT_FOR_SECONDS.replace("{time}", seconds);

                $("#fw"+state+"-label").addClass('fwupd-active');
                $("#fw"+state+"-value").text(wait_str).addClass('fwupd-active');
            }, state, function(state_value, state_text) {
                $("#fw"+state_value+"-value").text(state_text);
            }, state, state_str);
        }
    } else {
        $("#fw"+state+"-value").text(percent + '%');
    }
}

/**
 * Delay the {postFunc} for {seceonds}, and execute {prevFunc} afterwards.
 * @param seconds
 * @param prevFunc
 * @param preVar
 * @param postFunc
 * @param postVar
 */
function DelayForSeconds(seconds, prevFunc, preVar, postFunc, postVar1, postVar2) {
    var timer = setInterval(function() {
        if (seconds > 0) {
            prevFunc(preVar, seconds);
            seconds--;
        } else {
            clearInterval(timer);
            postFunc(postVar1, postVar2)
            return;
        }
    }, 1000);
}

function ShowFwUpdateStatus(xml_obj, txtstatus, jqXHR) {
    "use strict";
    // check session & privilege
    //console.log("<<< response of ShowFwUpdateStatus:" + dumpXMLDocString(xml_obj));
    if(CheckInvalidResult(xml_obj) < 0) {
       return;
    }

    var IPMIRoot = xml_obj.documentElement;
    var isOK = IPMIRoot.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
    var state = IPMIRoot.getElementsByTagName('STATE')[0].childNodes[0].nodeValue;
    if(isOK == 'OK'){
        var percent = IPMIRoot.getElementsByTagName('PERCENT')[0].childNodes[0].nodeValue;
        var msg = '';
        var msgEl = IPMIRoot.getElementsByTagName('MSG');
        if (msgEl.length > 0 && msgEl[0].childNodes.length > 0)
            msg = msgEl[0].childNodes[0].nodeValue;
        DisplayStatus(state, percent, msg);
    }
    else{
       // console.log('get fwupdate status returned bad status...');
       return;
    }
    if (last_state != state && state == 'ready') {
        FinishFwUpdate();
    }
    last_state = state;
    if (state == 'error' || state == 'ready' || state == 'idle')
        return;
    setTimeout(GetFwUpdateStatus, 1500);
}
function checkfile(){
    "use strict";
    var FileBrowse = $("#FileBrowse");
    var input_file = FileBrowse.val();
    var file;
    if(input_file.length == 0)
    {
        return -1;
    }
    if (!window.FileReader)
    {
        // If browser does not support FileReader, just bypass fw size check.
        alert(lang.LANG_CONFIG_FWUPD_WARNING_NO_SUPPORT);
        return -1;
    }
    var files = FileBrowse.prop("files");
    if (!files)
    {
        alert(lang.LANG_CONFIG_FWUPD_WARNING_BROWSER);
        return -1;
    }
    else if (!files[0])
    {
        return -1;
    }

    CheckUserPrivilege(PrivilegeCallBackFileReady);
    if (FileBrowse.val() == null)
        return -1;
    file = files[0];
    if (file.size > (20*1024*1024)) {
        reset_file_upload();
        alert(lang.LANG_CONFIG_SDRFW_WARNING_SELECT);
        return -1;
    }
    // console.log(file);
    // console.log(file.lastModified);
    //alert("File " + file.name + " is " + file.size + " bytes in size");
    return file;
}

function genXML(options) {
    "use strict";
    var dataXML = "";
    dataXML += "<?xml version=\"1.0\"?>\n";
    dataXML += "<IPMI>\n";
    dataXML += '<PRIV>' + top.frames.topmenu.PRIV_ID + '</PRIV>\n';
    dataXML += '<FWUPDATE ';
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            dataXML += key + '="' + options[key] + '" ';
        }
    }
    dataXML += '/>\n';
    dataXML += '</IPMI>';
    return dataXML;
}

})(jQuery);
