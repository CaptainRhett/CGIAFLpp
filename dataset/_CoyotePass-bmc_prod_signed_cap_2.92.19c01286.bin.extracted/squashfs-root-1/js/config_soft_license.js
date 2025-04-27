"use strict";
/* configuration firmware update page */
(function($) {

var lang;
var uploadBtn;
var FileBrowse;
var activefwfile = null;
var last_state = null;
var err_finsh = false;

$( document ).ready(function() { $.PageInit(); });
if (parent.lang) { lang = parent.lang; }

$.PageInit = function() {
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/config_soft_license_hlp.html";

    document.title = lang.LANG_CONFIG_SUBMENU_SOFT_LICENSE;
    $("#uploadBtn").attr("value", lang.LANG_COMMON_BTN_UPLOAD).click(SWL_UploadBtn);
    $("#FileBrowse")
            .click(function(e) { $(this).attr("value", null); })
            .change(function () { checkfile(); });
    $("#swlready").hide();

    var swlchk = document.getElementById("swlChkStatus");
    var swlupd = document.getElementById("swlUpdStatus");
    var swlprg = document.getElementById("swlprogram");

    swlprg.style.marginTop = "-10px"
    swlchk.style.lineHeight = "2";
    swlupd.style.lineHeight = "2";

    UploadEnable(true);
    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function UploadEnable(enable) {
    "use strict";
    var dropzone = document.documentElement;
    var curstatus = $("#swlUpdStatus");
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
        curstatus.hide();
    } else {
        dropzone.ondrop = dropzone.ondragover = dropzone.ondragenter = function(e) {}
        curstatus.show();
    }
}

function sendFile(file) {
    "use strict";
    var reader = new FileReader();
    activefwfile = file.name;
    reader.onloadstart = LoadFileStart;
    reader.onload = UploadStart;
    reader.readAsArrayBuffer(file);
}

function OutputString() {
    "use strict";
    document.getElementById("submenu_div").textContent = lang.LANG_CONFIG_SOFT_LICENSE_CAPTION;
    document.getElementById("desc_p").textContent = lang.LANG_CONFIG_SOFT_LICENSE_DESC;
    document.getElementById("submenu_legend").textContent = lang.LANG_CONFIG_SOFT_LICENSE_UPLOAD_INFO;
    document.getElementById("license_process_legend").textContent = lang.LANG_CONFIG_SOFT_LICENSE_PROC;
    document.getElementById("upload_time_span").textContent = lang.LANG_CONFIG_SOFT_LICENSE_TIME;
    document.getElementById("drop_file").textContent = lang.LANG_CONFIG_SOFT_LICENSE_FILE;
    document.getElementById("swlupload-label").textContent = lang.LANG_CONFIG_SOFT_LICENSE_ACTIVE1;
    document.getElementById("swlauthenticate-label").textContent = lang.LANG_CONFIG_SOFT_LICENSE_ACTIVE2;
    // document.getElementById("swlncsi-label").textContent = lang.LANG_CONFIG_SOFT_LICENSE_ACTIVE3;
    // document.getElementById("swlstorage-label").textContent = lang.LANG_CONFIG_SOFT_LICENSE_ACTIVE4;
    document.getElementById("swlprogram-label").textContent = lang.LANG_CONFIG_SOFT_LICENSE_PROGRAM;
    document.getElementById("swlprogram-value").textContent = lang.LANG_CONFIG_SOFT_LICENSE_PENDING;
    document.getElementById("swlparse-label").textContent = lang.LANG_CONFIG_SOFT_LICENSE_PARSE;
    document.getElementById("swlparse-value").textContent = lang.LANG_CONFIG_SOFT_LICENSE_PENDING;
    document.getElementById("swlready-label").textContent = lang.LANG_CONFIG_SOFT_LICENSE_READY;
}

function PrivilegeCallBack(Privilege){
    "use strict";
    //full access
    uploadBtn = $("#uploadBtn");
    FileBrowse = $("#FileBrowse");
    if(Privilege == '04')
    {
        uploadBtn.prop("disabled", true);
        FileBrowse.prop("disabled", false);
        getSwlInfo();
        getSwlType();
    }
    //only view
    else if(Privilege == '03' || Privilege == '02')
    {
        uploadBtn.prop("disabled", true);
        FileBrowse.prop("disabled", true);
        getSwlInfo();
        getSwlType();
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

function getSwlType()
{
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/soft_license_info.cgi';
    var ajax_data= GeneGenericRequestXML();
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
            method: 'post',
            contentType: 'text/xml',
            xml_data: ajax_data,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            onComplete: getSwlTypeHandler}//register callback function
            );
}

function getSwlInfo()
{
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/soft_license_info.cgi';
    var ajax_data= GeneGenericRequestXML();
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
            method: 'get',
            contentType: 'text/xml',
            xml_data: ajax_data,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            onComplete: getSwlInfoHandler}//register callback function
            );
}

function getSwlInfoHandler(originalRequest)
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
        var SWL_INFO = IPMIRoot.getElementsByTagName('SWL_INFO');
        var swl_updtime = SWL_INFO[0].getAttribute("SWL_UPDTIME");
        if (swl_updtime) {
            $('#lastSwlTS').text(swl_updtime);
        } else {
            $('#lastSwlTS').text("...");
        }
    }
}

function getSwlTypeHandler(originalRequest)
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

        var swl_status = GetXMLNodeValue(xml_obj, "SWL_STATUS");
        if (swl_status == "ACTIVED") {
            $("#swlupload-value").text(lang.LANG_CONFIG_SOFT_LICENSE_ACTIVED);
            $("#swlauthenticate-value").text(lang.LANG_CONFIG_SOFT_LICENSE_ACTIVED);
            // $("#swlncsi-value").text(lang.LANG_CONFIG_SOFT_LICENSE_ACTIVED);
            // $("#swlstorage-value").text(lang.LANG_CONFIG_SOFT_LICENSE_ACTIVED);
        } else {
            $("#swlupload-value").text(lang.LANG_CONFIG_SOFT_LICENSE_UNACTIVE);
            $("#swlauthenticate-value").text(lang.LANG_CONFIG_SOFT_LICENSE_UNACTIVE);
            // $("#swlncsi-value").text(lang.LANG_CONFIG_SOFT_LICENSE_UNACTIVE);
            // $("#swlstorage-value").text(lang.LANG_CONFIG_SOFT_LICENSE_UNACTIVE);
        }
    }
}

function SWL_UploadBtn(){
    "use strict";
    var FileExist = checkfile();
    if(FileExist == -1){
       return;
    }

    uploadBtn.prop("disabled", true);
    FileBrowse.prop("disabled", true);
    $("#swlupload-label").text(lang.LANG_CONFIG_SOFT_LICENSE_UPLOAD).addClass('fwupd-active');
    $("#swlupload-value").text("...").addClass('fwupd-active');
    $("#swlauthenticate-label").text(lang.LANG_CONFIG_SOFT_LICENSE_AUTHENTICATE);
    $("#swlauthenticate-value").text(lang.LANG_CONFIG_SOFT_LICENSE_PENDING);
    // $("#swlncsi-label").hide();
    // $("#swlncsi-value").hide();
    // $("#swlstorage-label").hide();
    // $("#swlstorage-value").hide();

    Loading(true);
    sendFile(FileExist);
}
function LoadFileStart() {
    "use strict";
    UploadEnable(false);
}

function UploadStart(event){
    "use strict";

    Loading(false);
    $("#uploadBtn").prop("disabled", true);
    var url = '/cgi/config_soft_license.cgi';
    $.ajax(url, {
                type: 'post',
                headers: {
                    FWUPLOAD: 1,
                    FWFNAME: activefwfile,
                    TOKEN: top.frames.topmenu.CSRF_TOKEN,
                },
                xhr: function() {
                    var myXhr = $.ajaxSettings.xhr();
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
        return;
    }

    var IPMIRoot = xml_obj.documentElement;
    var isOK = IPMIRoot.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
    if (isOK == 'OK') {
        UploadEnable(false);
        document.getElementById("swlupload-value").textContent = lang.LANG_CONFIG_SOFT_LICENSE_DONE;
        $("#swlupload-value").removeClass('fwupd-active');
        StartSwlUpdate();
    }
    else{
        $("#swlupload-value").text(lang.LANG_CONFIG_SOFT_LICENSE_ERR);
        alert(lang.LANG_CONFIG_SOFT_LICENSE_FAIL);
        return;
    }
    Loading(false);
}

function StartSwlUpdate()
{
    "use strict";
    var url = '/cgi/config_soft_license.cgi';
    $.ajax(url, {
            type: 'post',
            headers: {
                TOKEN: top.frames.topmenu.CSRF_TOKEN,
            },
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            success: GetSwlUpdateStatus,
            data: genXML(1)
        }
    );

}

function GetSwlUpdateStatus() {
    "use strict";
    var url = '/cgi/config_soft_license.cgi';
    $.ajax(url, {
                type: 'get',
                cache: false,
                headers: {
                    TOKEN: top.frames.topmenu.CSRF_TOKEN,
                },
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                success: ShowSwlUpdateStatus,
                data: { FwUpdateStatus: 1 },
            }
        );
}

function DisplayStatus(state, msg) {
    //"use strict";
    var exp_states = [ 'idle', 'authenticate', 'program', 'getinfo', 'parse', 'ready', 'error' ];
    if (exp_states.indexOf(state) < 0) {
        return;
    }

    if (state == 'idle'){
        if(last_state == 'ready') {
            // If immreset is not checked, remains the page to notify users to reset.
            return;
        } else {
            UploadEnable(true);
            return;
        }
    }

    if (last_state == null) {
        $("#swlupload-label").removeClass('fwupd-active');
    }

    UploadEnable(false);
    if (state == 'error') {
        $("#swl"+last_state+"-value").removeClass('fwupd-active');
        $("#swl"+last_state+"-label").removeClass('fwupd-active');
    } else if (state != last_state) {
        if (last_state != 'idle') {
            if (parseInt(msg, 10) != 0) {
                err_finsh = true;
            } else {
                $("#swl"+last_state+"-value").text(lang.LANG_CONFIG_SOFT_LICENSE_DONE).removeClass('fwupd-active');
                $("#swl"+last_state+"-label").removeClass('fwupd-active');
            }
        } else {
            // initial state change from idle to upload happens here;
            // the rest of the state changes happen in ShowFwUpdateStatus
            last_state = state;
        }
        $("#swl"+state+"-label").addClass('fwupd-active');
        if (state == 'ready') {
            $("#swl"+state+"-value").text(lang.LANG_CONFIG_SOFT_LICENSE_DONE).addClass('fwupd-active');
            $("#swl"+state).show();
        }
    } else {
        $("#swl"+state+"-value").text('...').addClass('fwupd-active');
    }
}

function ShowSwlUpdateStatus(xml_obj, txtstatus, jqXHR) {
    "use strict";

    if(CheckInvalidResult(xml_obj) < 0) {
       return;
    }

    var IPMIRoot = xml_obj.documentElement;
    var isOK = IPMIRoot.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
    if(isOK == 'OK'){
        var state = IPMIRoot.getElementsByTagName('STATE')[0].childNodes[0].nodeValue;
        var msg = IPMIRoot.getElementsByTagName('MSG')[0].childNodes[0].nodeValue;
        DisplayStatus(state, msg);
    }
    else{
       return;
    }

    if (state == 'error' || err_finsh == true) {
        if (err_finsh == true) {
            $("#swl"+last_state+"-value").text(lang.LANG_CONFIG_SOFT_LICENSE_ERR).addClass('fwupd-active');
        } else {
            $("#swlready-label").addClass('fwupd-active');
            $("#swlready-value").text(lang.LANG_CONFIG_SOFT_LICENSE_ERR).addClass('fwupd-active');
            $("#swlready").show();
        }
        alert(lang.LANG_CONFIG_SOFT_LICENSE_FAIL);
        FwUpdateAbort();
        return;
    }

    if (last_state != state && state == 'ready') {
        alert(lang.LANG_CONFIG_SOFT_LICENSE_SUCC);
        setTimeout(function(){ location.href = "../cgi/url_redirect.cgi?url_name=config_soft_license"; }, 3000);
    }

    last_state = state;
    if (state == 'ready' || state == 'idle') {
        return;
    } else {
        $("#swl"+state+"-value").text('...').addClass('fwupd-active');
    }
    setTimeout(GetSwlUpdateStatus, 500);
}

function checkfile(){
    "use strict";
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

    var validExts = new Array(".v2c");
    var fileExt = file.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
        reset_file_upload();
        alert(lang.LANG_CONFIG_SOFT_LICENSE_WARNING_SELECT1);
        return -1;
    }

    if (file.size > (1*1024)) {
        reset_file_upload();
        alert(lang.LANG_CONFIG_SOFT_LICENSE_WARNING_SELECT2);
        return -1;
    }
    return file;
}

function genXML(options) {
    "use strict";
    var dataXML = "";
    dataXML += "<?xml version=\"1.0\"?>\n";
    dataXML += "<IPMI>\n";
    dataXML += '<PRIV>' + top.frames.topmenu.PRIV_ID + '</PRIV>\n';
    dataXML += "<SWLUPDATE STATE =\"" + options + "\"/>\n";
    dataXML += '</IPMI>';
    return dataXML;
}

})(jQuery);
