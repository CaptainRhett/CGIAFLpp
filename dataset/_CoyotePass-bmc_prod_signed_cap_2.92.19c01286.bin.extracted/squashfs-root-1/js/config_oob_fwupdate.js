"use strict";
/* configuration OOB firmware update page */
var lang;
var PFRSupported = 0;
var last_state = null;
var activefwfile = null;
var enforce_password_enabled = null;

(function($) {
"use strict";

$( document ).ready(function() { $.PageInit(); });
if (parent.lang) { lang = parent.lang; }

$.PageInit = function() {
    "use strict";
    document.title = lang.LANG_CONFIG_SUBMENU_OOB_FWUPD;
    GetBoardInfo();
    if (PFRSupported) {
        top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/config_oob_fwupdate_2_hlp.html";
        $("#ImageType").hide();
        $("#bios_nvram_check").hide();
        $("#bios_nvram_option").hide();
        document.getElementById("bios_immediately_check").addEventListener("change", onImmediatelyCheckedChange);
    } else {
        $("#_imagetype").change(UpdateImageType);
        $("#PFRActVer").hide();
        $("#PFRRecoveryVer").hide();
        $("#bios_immediately_option").hide();
        $("#bios_immediately_check").hide();
        $("#bios_nvram_check").hide();
        $("#bios_nvram_option").hide();
        top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/config_oob_fwupdate_hlp.html";
    }
    $("#uploadBtn").attr("value", lang.LANG_COMMON_BTN_UPLOAD).click(FW_UploadBtn);
    $("#FileBrowse")
            .click(function(e) { $(this).attr("value", null); })
            .change(function () { checkfile(); });
    $("#fwerror").hide();
    $("#Enforce_Password").hide();
    UploadEnable(true);
    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function GetBoardInfo()
{
    "use strict";
    var url = '/cgi/board_info.cgi';
    var pars = '';
    var myAjax = new Ajax.Request(
            url,
            {method: 'get',
             parameters:pars,
             asynchronous: false,
             onComplete: AssignBoardInfo
            });
}

function AssignBoardInfo(response)
{
    "use strict";
    var text = response.responseText.replace(/^\s+|\s+$/g,"");
    var xml_obj = GetResponseXML(text);

    if (xml_obj != null) {
        var Value = GetXMLNodeValue(xml_obj, "PFR_SUPPORT");
        if (Value == "Yes")
            PFRSupported = 1;
    }
}

function ParseBios_OOB_Capbilities(xml_obj, txtstatus, jqXHR)
{
    "use strict";
    Loading(false);

    if(CheckInvalidResult(xml_obj) < 0) {
        return;
    }
    var IPMIRoot = xml_obj.documentElement;
    var OOB_INFO = IPMIRoot.getElementsByTagName('OOB_INFO');
    var ENABLE_STATE  = OOB_INFO[0].getElementsByTagName('OOB_ENABLE_STATE');
    var oob_firmware_enable_value = ENABLE_STATE[0].getAttribute("FIRMWARE_UPDATE_ENABLE");
    var enforce_password_enable_value = ENABLE_STATE[0].getAttribute("ENFORCE_PASSWORD_ENABLE");
    var bios_enforce_password_disable_value = ENABLE_STATE[0].getAttribute("BIOS_ENFORCE_PASSWORD_DISABLE");
    if(oob_firmware_enable_value == 'No'){
        alert(lang.LANG_CONFIG_BIOS_OOB_FWUPD_NO_SUPPORT);
        return ;
    }
    if(bios_enforce_password_disable_value == 'No'){
        alert(lang.LANG_CONFIG_BIOS_PASSWORD_SET_ECFORCE_DISABLE);
        return ;
    }
    $("#FileBrowse").prop("disabled", false);
    if(enforce_password_enable_value == 'Yes'){
        $("#Enforce_Password").show();
        enforce_password_enabled = 'Yes';
    }
}

function CheckBios_OOB_Capabilities(){
    "use strict";
    Loading(true);
    var url = '/cgi/get_oob_state.cgi';
    var param = 'time_stamp='+(new Date());
    var data = GeneGenericRequestXML();
    $.ajax(url, {
            type: 'post',
            contentType: 'text/xml',
            data: data,
            dataType: "xml",
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            success: ParseBios_OOB_Capbilities,
        });
}

function updateInfo() {
    "use strict";
    // get the firmware update status
    GetFwInfo();
}

let ImageType_t = {
    BIOS: 2,
    ME: 3,
    FD: 4,
}

var SelectedImageType = ImageType_t.BIOS;

function UpdateImageType()
{
    "use strict";
    var value = $(this).children('option:selected').val();

    if (value != ImageType_t.BIOS) {
        $("#BiosRegion").hide();
    } else {
        $('#BiosRegion').show();
    }

    SelectedImageType = value;
    $("#fwerror").hide();
    UploadEnable(true);
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
    document.getElementById("fwready-value").textContent  = lang.LANG_CONFIG_OOB_FWUPD_PENDING;
    var reader = new FileReader();
    activefwfile = file.name;
    reader.onloadstart = LoadFileStart;
    reader.onload = UploadStart;
    reader.readAsArrayBuffer(file);
}

function OutputString() {
    "use strict";
    document.getElementById("submenu_div").textContent    = lang.LANG_CONFIG_SUBMENU_OOB_FWUPD;
    document.getElementById("desc_p").textContent         = lang.LANG_CONFIG_OOB_FWUPD_DESC;
    document.getElementById("submenu_legend").textContent = lang.LANG_CONFIG_SUBMENU_OOB_FWUPD;
    document.getElementById("bios_rev_span").textContent  = lang.LANG_SYS_INFO_BIOS_REV;
    document.getElementById("me_rev_span").textContent    = lang.LANG_SYS_INFO_ME_FW_REV;
    document.getElementById("bios_me_image_upload").textContent = lang.LANG_CONFIG_OOB_FWUPD_FILE;
    document.getElementById("fwupload-label").textContent = lang.LANG_CONFIG_OOB_FWUPD_UPLOAD;
    document.getElementById("fwready-label").textContent  = lang.LANG_CONFIG_OOB_FWUPD_READY;
    document.getElementById("fwready-value").textContent  = lang.LANG_CONFIG_OOB_FWUPD_PENDING;
    document.getElementById("fwerror-label").textContent  = lang.LANG_CONFIG_OOB_FWUPD_ERROR;
    document.getElementById("fwerror-value").textContent  = lang.LANG_CONFIG_OOB_FWUPD_PENDING;
    document.getElementById("bios_region_lbl").textContent = lang.LANG_BIOS_REGION_LABLE_NAME;
    document.getElementById("bios_nvram_option").textContent  = lang.LANG_BIOS_NVRAM_REGION_VALUE;
    document.getElementById("bios_backup_option").textContent = lang.LANG_BIOS_BACKUP_REGION_VALUE;
    document.getElementById("bios_password_lbl").textContent = lang.LANG_BIOS_LOGIN_PASSWORD;

    if (PFRSupported) {
        document.getElementById("bios_immediately_option").textContent = lang.LANG_BIOS_RESET_IMMEDIATELY;
        document.getElementById("pch_pfm_active_span").textContent    = lang.LANG_SYS_INFO_PCH_PFM_ACTIVE_REV;
        document.getElementById("pch_pfm_recovery_span").textContent    = lang.LANG_SYS_INFO_PCH_PFM_RECOVERY_REV;
        document.getElementById("fw-immediately-msg").textContent = lang.LANG_CONFIG_FWUPD_READY_RESET_IMMEDIATELY;
        if (!($('#bios_immediately_check').prop('checked'))) {
            $("#fw-immediately-msg").hide();
        }
    } else {
        document.getElementById("image_lbl").textContent  = lang.LANG_CONFIG_OOB_FWUPD_IMG;
        var obj = document.getElementById("_imagetype");
        if (obj != null) {
            removeChilds(obj);

            var option = document.createElement("option");
            option.value = ImageType_t.BIOS;
            option.text  = lang.LANG_CONFIG_OOB_FWUPD_BIOS_IMAGE;
            obj.appendChild(option);

            SelectedImageType = ImageType_t.BIOS;
            var option = document.createElement("option");
            option.value = ImageType_t.ME;
            option.text  = lang.LANG_CONFIG_OOB_FWUPD_ME_IMAGE;
            obj.appendChild(option);

            var option = document.createElement("option");
            option.value = ImageType_t.FD;
            option.text  = lang.LANG_CONFIG_OOB_FWUPD_FD_IMAGE;
            obj.appendChild(option);
        }
    }
}

function PrivilegeCallBack(Privilege){
    "use strict";
    //full access
    let KCSMode = ReadSessionStorage("KCSMode");
    var uploadBtn = $("#uploadBtn");
    var FileBrowse = $("#FileBrowse");
    if(Privilege == '04')
    {
        uploadBtn.prop("disabled", true);
        FileBrowse.prop("disabled", true);
        updateInfo();

        if (KCSMode == "deny_all") {
            alert(lang.CONF_KCS_OOB_FW_UPDATE_NO_SUPPORT);
        } else {
            CheckBios_OOB_Capabilities();
        }
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
    var uploadBtn = $("#uploadBtn");
    var FileBrowse = $("#FileBrowse");
    //full access
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

    if(CheckInvalidResult(xml_obj) < 0) {
        return;
    }

    var IPMIRoot = xml_obj.documentElement;
    var SYSTEM_INFO = IPMIRoot.getElementsByTagName('SYSTEM_INFO');//point to SYSTEM_INFO
    var SYSTEM  = SYSTEM_INFO[0].getElementsByTagName('SYSTEM');
    var biosver = SYSTEM[0].getAttribute("BIOS_ID");
    var meVer   = SYSTEM[0].getAttribute("ME_VERSION");
    if (PFRSupported) {
        var PCHPFMActiveVer = SYSTEM[0].getAttribute("PCH_PFM_ACTIVE_VERSION");
        var PCHPFMRecoveryVer = SYSTEM[0].getAttribute("PCH_PFM_RECOVERY_VERSION");
        $('#PCHPFMActiveVer').text(PCHPFMActiveVer);
        $('#PCHPFMRecoveryVer').text(PCHPFMRecoveryVer);
    }

    //update BIOS and ME current version
    $('#curBIOSVer').text(biosver);
    $('#curMEVer').text(meVer);
}

function password_finish(xml_obj, txtstatus, jqXHR)
{
    "use strict";
    Loading(false);
    if(CheckInvalidResult(xml_obj) < 0) {
       return;
    }
    if (xml_obj.status != undefined && xml_obj.status != 200) {
        alert(lang.LANG_CONFIG_OOB_FWUPD_ERROR + xml_obj.statusText);
        reset_page();
        return;
    }
    var IPMIRoot = xml_obj.documentElement;
    var isOK = IPMIRoot.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
    if(isOK != 'OK'){
        alert(lang.LANG_CONFIG_OOB_FWUPD_PASSWORD_ERROR);
        $("#user_password").prop("disabled",false);
    }
    else{
        var FileExist = checkfile();
        if(FileExist == -1){
            return;
        }
        Loading(true);
        sendFile(FileExist);
    }
}

function FW_UploadBtn()
{
    "use strict";
    if(enforce_password_enabled == 'Yes') {
       if($("#user_password").val()=='')
       {
           alert(lang.LANG_LOGIN_INVALID_PASSWORD);
           return;
       }

       var user_passwd = btoa($("#user_password").val());
       Loading(true);
       $("#user_password").prop("disabled",true);
       //console.log("start to upload password");
       var url = '/cgi/oob_password_auth.cgi';
       var param = 'time_stamp='+(new Date());
       var data  = generate_password_xml(SelectedImageType, user_passwd);
       $.ajax(url, {
            type: 'post',
            contentType: 'text/xml',
            data: data,
            dataType: "xml",
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            success: password_finish,
        });
    } else {
       var FileExist = checkfile();
       if(FileExist == -1){
          return;
       }
       Loading(true);
       sendFile(FileExist);
    }
}

function LoadFileStart() {
    "use strict";
    //console.log('file loading... ');
    last_state = null;
    UploadEnable(false);
    $('#bios_nvram_check').prop("disabled", true);
    $('#bios_backup_check').prop("disabled",true);
    $('#bios_immediately_check').prop("disabled",true);
}

function onImmediatelyCheckedChange() {
    "use strict";
    if (PFRSupported) {
        if ($('#bios_immediately_check').prop('checked')) {
            $("#fw-immediately-msg").show();
        } else {
            $("#fw-immediately-msg").hide();
        }
    }
}

function UploadProgress(e) {
    "use strict";
    //console.log('file uploading... ' + e);
    if (e.lengthComputable) {
        var max = e.total;
        var current = e.loaded;
        var percent = (current * 100) / max;
        percent = Math.round(percent);
        if (percent > 100){
            percent = 100;
            //DisplayStatus('ready', percent, '');
        }
        DisplayStatus('upload', percent, '');
    }
}

function generate_password_xml(image_flag, user_password){
    "use strict";
    var result ="";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <PASSWORD>" +  user_password + "</PASSWORD>\n";
    result += "    <IMAGEFLAG>"+  image_flag  +"</IMAGEFLAG>\n"
    result += "</IPMI>\n";
    return result;
}

function UploadStart(event){
    "use strict";
    Loading(false);
    $("#uploadBtn").prop("disabled", true);
    var url = '/cgi/config_oob_fwupdate.cgi';
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
        alert(lang.LANG_CONFIG_OOB_FWUPD_ERROR + xml_obj.statusText);
        reset_page();
        return;
    }
    //check XML response from ajax
    var IPMIRoot = xml_obj.documentElement;
    var isOK = IPMIRoot.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
    if(isOK == 'OK'){
        //console.log('file upload ok'+activefwfile);
        StartFwUpdate(activefwfile);
    }
    else{
       //console.log('file upload failed');
       alert(lang.LANG_NULLXML_SESSION_TIMEOUT);
       reset_page();
       return;
    }
    Loading(false);
}


let ImageFlag_t = {
    BIOS_PRIMARY: 1,
    BIOS_BACKUP: 1 << 1,
    BIOS_NVRAM: 1 << 2,
    BIOS_DELAY: 1 << 3,
}

function StartFwUpdate(file) {
    "use strict";
    var url = '/cgi/config_oob_fwupdate.cgi';
    var ImageFlag;

    if (PFRSupported) {
        ImageFlag = ImageFlag_t.BIOS_PRIMARY;
        if(!($('#bios_immediately_check').prop('checked')))
           ImageFlag = ImageFlag | ImageFlag_t.BIOS_DELAY;
        if($('#bios_nvram_check').prop('checked'))
           ImageFlag = ImageFlag | ImageFlag_t.BIOS_NVRAM;
        if($('#bios_backup_check').prop('checked'))
           ImageFlag = ImageFlag | ImageFlag_t.BIOS_BACKUP;
    } else {
        if (SelectedImageType == ImageType_t.BIOS) {
            ImageFlag = ImageFlag_t.BIOS_PRIMARY;
            if($('#bios_backup_check').prop('checked'))
                ImageFlag = ImageFlag | ImageFlag_t.BIOS_BACKUP;
        } else {
            ImageFlag = 0;
        }
    }

    $.ajax(url, {
                type: 'post',
                headers: {
                    TOKEN: top.frames.topmenu.CSRF_TOKEN,
                },
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                success: GetFwUpdateStatus,
                data: genXML({"file": file,"imgflag":ImageFlag, "imgtype": SelectedImageType})        //image type
            }
        );
}

function FinishFwUpdate(afile) {
    "use strict";
    var url = '/cgi/config_oob_fwupdate.cgi';
    //console.log(">>> config_fw_update.cgi top.frames.topmenu.CSRF_TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    $.ajax(url, {
                type: 'post',
                headers: {
                    TOKEN: top.frames.topmenu.CSRF_TOKEN,
                },
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                success: ShowFwUpdateStatus,
                data: genXML({"file": afile, "finish": 1, "imgtype": SelectedImageType})        //image type
            }
        );
}

function GetFwUpdateStatus() {
    "use strict";
    //console.log(">>> FW update status top.frames.topmenu.CSRF_TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
    var url = '/cgi/config_oob_fwupdate.cgi';
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
last_state = null;
function DisplayStatus(state, percent, msg) {
    "use strict";
    //console.log("DisplayStatus('"+state+"', '"+percent+"', '" + msg + "') last_state = '" + last_state + "'");
    var exp_states = [ 'initializing', 'idle', 'upload', 'error', 'ready' ];
    if (exp_states.indexOf(state) < 0) {
        //console.log("unexpected state: '"+state+"'");
        return;
    }
    if (state == "idle") {
        UploadEnable(true);
        return;
    }
    UploadEnable(false);

    if (state == 'error') {
        $("#fw"+last_state+"-value").removeClass('fwupd-active');
        $("#fw"+last_state+"-label").removeClass('fwupd-active');
        $("#fw"+state+"-value").text(msg).addClass('fwupd-active');
        $("#fw"+state+"-label").addClass('fwupd-active');
        $("#fwerror").show();

    } else if (state != last_state && state != 'ready') { // Uploading the file
        $("#fwerror").hide();

        //console.log("remove active class from #fw"+last_state+"-label");
        $("#fw"+last_state+"-value").text(lang.LANG_CONFIG_OOB_FWUPD_DONE).removeClass('fwupd-active');
        $("#fw"+last_state+"-label").removeClass('fwupd-active');

        // initial state change from idle to upload happens here;
        // the rest of the state changes happen in ShowFwUpdateStatus
        if (state == "upload") {
            last_state = state;
        }

        $("#fw"+state+"-label").addClass('fwupd-active');
        $("#fw"+state+"-value").text(percent + '%').addClass('fwupd-active');
    } else if (state != last_state && state == 'ready') { // End of uploading.
        // For PFR supported platforms, It takes 25 seconds for BMC to verify register PfrMbxWr8 is success.
        // So wait here for about 45 seconds, then page will notify the user to reset.
        var delayedSeconds = 0;
        if(PFRSupported && !($('#bios_immediately_check').prop('checked'))) {
            delayedSeconds = 45;
        }

        DelayForSeconds(delayedSeconds, function(state, seconds) {
            "use strict";
            var wait_str = lang.LANG_CONFIG_OOB_WAIT_FOR_SECONDS.replace("{time}", seconds);

            $("#fw"+state+"-label").addClass('fwupd-active');
            $("#fw"+state+"-value").text(wait_str).addClass('fwupd-active');
        }, state, ShowFwUpdateReady, state);
    } else if (last_state != 'ready') { // Not the end of update, fresh the percent
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
function DelayForSeconds(seconds, prevFunc, preVar, postFunc, postVar) {
    "use strict";
    var timer = setInterval(function() {
        "use strict";
        if (seconds > 0) {
            prevFunc(preVar, seconds);
            seconds--;
        } else {
            clearInterval(timer);
            postFunc(postVar)
            return;
        }
    }, 1000);
}

/**
 * Show the indicator, only when {state} == "Ready".
 * @param {*} state
 */
function ShowFwUpdateReady(state) {
    "use strict";
    var state_str;
    var lang_str;

    if (PFRSupported) {
        if (!($('#bios_immediately_check').prop('checked'))) {
            lang_str = 'LANG_CONFIG_OOB_READY_START';
        }
    } else {
        lang_str = 'LANG_CONFIG_OOB_READY_START';
    }

    if (lang.hasOwnProperty(lang_str)) {
        state_str = lang[lang_str];
    } else {
        state_str = state;
    }
    $("#fw"+state+"-label").addClass('fwupd-active');
    $("#fw"+state+"-value").text(state_str).addClass('fwupd-active');
    //console.log("it is ready: '"+state_str+"'");
    $('#bios_nvram_check').prop("disabled", false);
    $('#bios_backup_check').prop("disabled",false);
    $('#bios_immediately_check').prop("disabled",false);
    if(enforce_password_enabled == 'Yes') {
        $("#user_password").prop("disabled",false);
    }
    $("#uploadBtn").prop("disabled", false);
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
       //console.log('get fwupdate status returned bad status...');
       return;
    }
    //console.log("ShowFwUpdateStatus last_state:"+last_state+",state:"+state);
    if (last_state != state && state == 'ready') {
        FinishFwUpdate(activefwfile);
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

    var validExts = new Array(".cap", ".bin");
    var fileExt = FileBrowse.val();

    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
        reset_file_upload();
        alert(lang.LANG_OOB_FW_UPLOAD_FILE_TYPE_ERROR);
        return -1;
    }

    file = files[0];
    //capsule file would not exceed 64MB. If size is larger than that, wrong file is selected.
    if (file.size > (64*1024*1024)) {
        reset_file_upload();
        alert(lang.LANG_CONFIG_SDRFW_WARNING_SELECT);
        return -1;
    }
    //console.log(file);
    //console.log(file.lastModified);
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
            //console.log("genXML key:" + key + " option:" + options[key] )
        }
    }
    dataXML += '/>\n';
    dataXML += '</IPMI>';
    return dataXML;
}

})(jQuery);
