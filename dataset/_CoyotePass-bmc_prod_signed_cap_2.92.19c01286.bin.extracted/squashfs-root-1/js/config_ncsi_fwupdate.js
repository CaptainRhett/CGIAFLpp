"use strict";
/* configuration ncsi firmware update page */
var lang;
var last_state = null;
var activefwfile = null;
var key_state = null;
var mTimeoutMax = 90000;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function ajaxsetup() {
    jQuery.ajaxSetup({
        timeout: mTimeoutMax,
        processData: false,
        headers: {
            SID: top.topmenu.getSessionID()
        },
        contentType: 'application/json',
        dataType: 'json'
    });
}

(function($) {
"use strict";
//console.log = function() {}
let ncsi_commonheader = {'OData-Version': '4.0' , "Content-Type":"application/json"};
let ncsi_taskuuid;
const ncsiToken = 'NCSI';
let ncsiListInfo = [];

$( document ).ready(function() { $.PageInit(); });
if (parent.lang) { lang = parent.lang; }


$.PageInit = function() {
    "use strict";
    ajaxsetup();
    document.title = lang.LANG_CONFIG_SUBMENU_NCSI_FWUPD;
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/config_ncsi_fwupdate_hlp.html";
    $("#uploadBtn").attr("value", lang.LANG_COMMON_BTN_UPLOAD).click(FW_UploadBtn);
    $("#resetBtn").attr("value", lang.LANG_CONFIG_FWUPD_RESET).click(ErrorFinishFwUpdate);
    $("#FileBrowse")
            .click(function(e) { $(this).attr("value", null); })
            .change(function () { checkfile(); });
    $("#fwerror").hide();

    $("#ncsiSelector").change(function () {
        console.log(this.value);
        let id = this.value;
        let find = ncsiListInfo.filter(function(item,index,array){
                       return item.Id == id;
                   });
        console.log(find);
        $('#curNCSIVer').text(find[0].Version);
    });

    UploadEnable(true);
    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function updateInfo() {
    "use strict";
    // get the firmware update status
    getncsi_version();
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
    document.getElementById("fwprogram-label").textContent = lang.LANG_CONFIG_FWUPD_PROGRAM;
    var reader = new FileReader();
    activefwfile = file.name;
    reader.onloadstart = LoadFileStart;
    reader.onload = UploadStart;
    reader.readAsArrayBuffer(file);
}

function OutputString() {
    "use strict";
    document.getElementById("submenu_div").textContent    = lang.LANG_CONFIG_SUBMENU_NCSI_FWUPD;
    document.getElementById("desc_p").textContent         = lang.LANG_CONFIG_NCSI_FWUPD_DESC;
    document.getElementById("submenu_legend").textContent = lang.LANG_CONFIG_SUBMENU_NCSI_FWUPD;
    document.getElementById("ncsi_rev_span").textContent  = lang.LANG_SYS_INFO_NCSI_REV;
    document.getElementById("fwupload-label").textContent = lang.LANG_CONFIG_NCSI_FWUPD_UPLOAD;
    document.getElementById("NCSI_image_upload").textContent = lang.LANG_CONFIG_NCSI_FWUPD_FILE;
    document.getElementById("fwerror-label").textContent  = lang.LANG_CONFIG_NCSI_FWUPD_ERROR;
    document.getElementById("fwerror-value").textContent  = lang.LANG_CONFIG_NCSI_FWUPD_PENDING;
    document.getElementById("fwprogram-label").textContent = lang.LANG_CONFIG_FWUPD_PROGRAM;
    document.getElementById("fwprogram-value").textContent = lang.LANG_CONFIG_FWUPD_PENDING;
    document.getElementById("ncsiSelectLabel").textContent = lang.LANG_CONFIG_NCSI_SELECT_INTERFACE;
}

function SwlCallBack(swl_type, swl_status)
{
    var uploadBtn = $("#uploadBtn");
    var FileBrowse = $("#FileBrowse");

    if (swl_type == "SWLIC") {
        if (swl_status == "ACTIVED") {
            uploadBtn.prop("disabled", true);
            FileBrowse.prop("disabled", true);
            updateInfo();
            key_state = "ok";
        } else {
            alert(lang.LANG_SYS_INFO_SOFT_LICENSE_INACTIVATED);
            uploadBtn.prop("disabled", true);
            FileBrowse.prop("disabled", true);
            key_state = "error";
        }
    } else {
        uploadBtn.prop("disabled", true);
        FileBrowse.prop("disabled", true);
        updateInfo();
        key_state = "none";
    }
}

function PrivilegeCallBack(Privilege){
    "use strict";
    //full access
    var uploadBtn = $("#uploadBtn");
    var FileBrowse = $("#FileBrowse");
    if(Privilege == '04')
    {
       getSwlStatus(SwlCallBack);
    }
    //only view
    else if(Privilege == '03' || Privilege == '02')
    {
        getSwlStatus(SwlCallBack);
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

const MAX_RETRY = 3;
getncsi_version.retry = 0;
function getncsi_version() {
    $.ajax({
        url: '/redfish/v1/UpdateService/SoftwareInventory',
        type: 'GET',
        processData: false
    })
    .fail(function() {
        if (getncsi_version.retry < MAX_RETRY) {
            setTimeout(getncsi_version, 20000);
        }
        getncsi_version.retry++;
    })
    .done(function(data) {
        console.log(data);

        let tmpURITokens;
        let odataid;
        let tmp = [];
        if (data.hasOwnProperty('Members')) {
            let members = data.Members;
            for (let i = 0; i < members.length; i++) {
                odataid = members[i];
                if (odataid.hasOwnProperty('@odata.id')) {
                    tmpURITokens = odataid['@odata.id'].split("/");
                    console.log(tmpURITokens[tmpURITokens.length - 1]);
                    if (tmpURITokens.length > 1 && tmpURITokens[tmpURITokens.length - 1].includes(ncsiToken)) {
                        let tailToken = tmpURITokens[tmpURITokens.length - 1];
                        let obj = {};
                        obj.odataid = odataid['@odata.id'];
                        obj.Id = tailToken;
                        tmp.push(obj);
                        console.log('tmp', tmp);
                    } else {
                        continue;
                    }
                }
            }
        }
        if (tmp.length > 0) {
            getncsi_version2(tmp);
        } else {
            console.log('no ncsi find under /redfish/v1/UpdateService/SoftwareInventory/');
            alert(lang.LANG_CONFIG_NCSI_NOT_FOUND);
            $('#curNCSIVer').text("N/A");
        }
    }).always(function(jqXHR) {
    });
}

function getncsi_version2(tmp) {
    let promises = [];
    let tmparray = [];
    $.each(tmp, function(i, value) {
        let promise = $.get(value.odataid).done(function(json) {
            try {
                let obj = {};
                obj.Id = value.Id;
                obj.odataid = value.odataid;
                obj.Version = json.Version;
                obj.Updateable = json.Updateable;
                ncsiListInfo.push(obj);
                promises.push(promise);
            } catch (err) {
                console.log(err);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        });
        promises.push(promise);
    });

    $.when.apply($, promises)
        .done(function() {
            console.log(ncsiListInfo);
            let o;
            for(let i=0; i<ncsiListInfo.length; i++) {
                o = new Option(ncsiListInfo[i].Id, ncsiListInfo[i].Id);
                $("#ncsiSelector").append(o);
            }
            $('#curNCSIVer').text(ncsiListInfo[0].Version);
            var uploadBtn = $("#uploadBtn");
            var FileBrowse = $("#FileBrowse");
            uploadBtn.prop("disabled", false);
            FileBrowse.prop("disabled", false);
        })
        .fail(function() {
           console.log('no ncsi version find under /redfish/v1/UpdateService/SoftwareInventory/');
        });
}

function FW_UploadBtn()
{
    "use strict";
       var FileExist = checkfile();
       if(FileExist == -1){
          return;
       }
       Loading(true);
       sendFile(FileExist);
}

function LoadFileStart()
{
    "use strict";
        //console.log('file loading... ');
        last_state = null;
        UploadEnable(false);
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

function UploadStart(event){
    "use strict";
    Loading(false);
    $("#uploadBtn").prop("disabled", true);
    var url = '/cgi/config_ncsi_fwupdate.cgi';
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
        alert(lang.LANG_CONFIG_NCSI_FWUPD_ERROR + xml_obj.statusText);
        reset_page();
        return;
    }
    //check XML response from ajax
    var IPMIRoot = xml_obj.documentElement;
    var isOK = IPMIRoot.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
    if(isOK == 'OK'){
        //console.log('file upload ok'+activefwfile);
        StartFwUpdate();
    }
    else{
       //console.log('file upload failed');
       alert(lang.LANG_NULLXML_SESSION_TIMEOUT);
       reset_page();
       return;
    }
    Loading(false);
}

function StartFwUpdate() {
    "use strict";
    let rfURL = "/redfish/v1/UpdateService/Actions/UpdateService.SimpleUpdate";
        console.log(rfURL);
        let ErrorInfo;
        let temp1 = "https://192.168.59.122/BCM_218.pldm?SHA256=587a9611a629e3efaab62234e661f65d1747db57bf52c206b8f04ad0b6ce5860";
        console.log(temp1);
        let target = [];
        let temp = '/redfish/v1/UpdateService/SoftwareInventory/' + $("#ncsiSelector").find(":selected").val();
        console.log(temp);
        target.push(temp);
        console.log(JSON.stringify({"ImageURI" : temp1, "Targets": target}));
        $.ajax({
            url: rfURL,
            type: 'POST',
            processData: false,
            headers: ncsi_commonheader,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            success: GetFwUpdateStatus,
            data: JSON.stringify({"ImageURI" : temp1, "Targets": target})
        })
        .fail(function (jqXHR, textStatus) {
            console.log(jqXHR.status, jqXHR.statusText);
            console.log(jqXHR);
            console.log(textStatus);
            if(jqXHR.status == 409 || jqXHR.status == 400) {
                DisplayStatus('error', 0, textStatus);
            }
            if(jqXHR.status == 400){
                DisplayStatus('error', 0, 'status exception');
            }
        }).done(function(data) {
            console.log(data);
            let task_uuid;
            if (data.hasOwnProperty("TaskMonitor")) {
                task_uuid = data.TaskMonitor;
                task_uuid = task_uuid.split('/');
                ncsi_taskuuid = task_uuid[task_uuid.length -1];
                monitncsiFwUpdate();
            } else {
                console.log('TaskMonitor node missed!!');
                ErrorInfo = 'TaskMonitor node missed';
                DisplayStatus('error', 0, 'TaskMonitor node missed');
            }
        })
        .always(function(jqXHR) {
            console.log(jqXHR);
            if (jqXHR.readyState == 4 && jqXHR.status == 409) {
                DisplayStatus('error', 0, 'readyState exception');
            }
            if (ErrorInfo !== undefined) {
                DisplayStatus('error', 0, 'ErrorInfo undefined');
            }
        });
}

function FinishFwUpdate() {
    "use strict";
    var url = '/cgi/config_ncsi_fwupdate.cgi';
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
    //$("#fwready-value").text(lang.LANG_CONFIG_FWUPD_DONE);
    // allow the BMC state transitions to complete and get the status again
    setTimeout(GetFwUpdateStatus, 1500);
}

function GetFwUpdateStatus() {
    "use strict";
    var url = '/cgi/config_ncsi_fwupdate.cgi';
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
    var resetBtn = $("#resetBtn");
    console.log("DisplayStatus('"+state+"', '"+percent+"', '" + msg + "') last_state = '" + last_state + "'");
    var exp_states = [ 'initializing', 'idle', 'upload', 'program', 'ready', 'error' ];
    if (exp_states.indexOf(state) < 0) {
        //console.log("unexpected state: '"+state+"'");
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
    } else if (state != last_state && state != 'ready') { // Uploading the file
        $("#fwerror").hide();
        $("#fw"+last_state+"-value").text(lang.LANG_CONFIG_NCSI_FWUPD_DONE).removeClass('fwupd-active');
        $("#fw"+last_state+"-label").removeClass('fwupd-active');
        if (state == "upload") {
            last_state = state;
        }
        $("#fw"+state+"-label").addClass('fwupd-active');
        $("#fw"+state+"-value").text(percent + '%').addClass('fwupd-active');
    } else if (last_state != 'ready') { // Not the end of update, fresh the percent
        $("#fw"+state+"-value").text(percent + '%');
    }
}

/**
 * Show the indicator, only when {state} == "Ready".
 * @param {*} state
 */
function ShowFwUpdateReady(state) {
    "use strict";
    var state_str;

    state_str = state;
    $("#fw"+state+"-label").addClass('fwupd-active');
    $("#fw"+state+"-value").text(state_str).addClass('fwupd-active');
    //console.log("it is ready: '"+state_str+"'");
    $("#uploadBtn").prop("disabled", false);
}

function ShowFwUpdateStatus(xml_obj, txtstatus, jqXHR) {
    "use strict";
    // check session & privilege
    console.log("<<< response of ShowFwUpdateStatus:" + dumpXMLDocString(xml_obj));
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
       console.log('get fwupdate status returned bad status...');
       return;
    }
    console.log("ShowFwUpdateStatus last_state:"+last_state+",state:"+state);
    if (last_state != state && state == 'ready') {
        FinishFwUpdate();
    }
    last_state = state;
    if (state == 'error' || state == 'ready' || state == 'idle')
        return;
    setTimeout(GetFwUpdateStatus, 2000);
}

function monitncsiFwUpdate() {
    console.log('update:', '/redfish/v1/TaskMonit/' + ncsi_taskuuid);
    $.ajax({
        url: '/redfish/v1/TaskMonit/' + ncsi_taskuuid,
        type: 'GET',
        processData: false,
        headers: ncsi_commonheader
    })
    .fail(function(jqXHR, textStatus) {
        console.log(jqXHR);
    })
    .done(function(data) {
        console.log(data);
        $('#psuStatusFailReason').text('');
        console.log('TaskState:', data.TaskState);
        switch(data.TaskState) {
            case 'IDLE':
                DisplayStatus('idle', 0, "IDLE");
                break;
            case 'New':
            case 'Starting':
            case 'Running':
                if(data.Messages[0].MessageArgs[1] == undefined){
                    $('#psuStatus').text(data.Messages[0].Message);
                    DisplayStatus('error', 0, data.Messages[0].Message);
                }else{
                    DisplayStatus('program', data.Messages[0].MessageArgs[1], 'Running');
                }
                setTimeout(monitncsiFwUpdate, 1000);
                break;
            case 'RETRY':
                setTimeout(monitncsiFwUpdate, 1000);
                break;
            case 'Completed':
                alert(lang.LANG_CONFIG_FWUPD_NCSI_SUCCESS);
                DisplayStatus('idle', 0, 'Completed');
                break;
            //TODO: check image invalide or update fail ...misc
            case 'FAIL':
            case 'Exception':
                DisplayStatus('error', 0, 'Exception');
                break;
            default:
                DisplayStatus('error', 0, 'N/A');
        }
    });
}

function checkfile(){
    "use strict";
    var FileBrowse = $("#FileBrowse");
    var input_file = FileBrowse.val();
    var file;
    if(key_state == 'error'){
        return -1;
    }
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
