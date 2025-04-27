"use strict";
/* Server Diagnostics -- System Diagnostics page for download debug log.*/

var lang;
var runBtn;
var lastTime;
var lastLink;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit(){
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/servd_diag_hlp.html";
    CheckUserPrivilege(PrivilegeCallBack);

    runBtn = document.getElementById("runBtn");
    runBtn.setAttribute("value", lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_BTN);
    runBtn.onclick= genDebugLog;//genDebugLog;

    document.getElementById("title_div").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_TITLE;
    document.getElementById("interpretion_td").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_INTERPRETION;
    document.getElementById("caption").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_CAPTION;
    document.getElementById("lastlog").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_LASTLOG;

    lastTime = document.getElementById("lastTime");
    lastTime.textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_NONETEXT;

    lastLink = document.getElementById("lastLink");
    document.getElementById("lastLink").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_NONETEXT;
    alert(lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_ERR);
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if(privilege == '04'|| privilege == '03'){
        //getDiagState();
    }
    else if(privilege == '02') {
        runBtn.disabled= true;
    }
    else{
        runBtn.disabled= true;
        location.href = SubMainPage;
        return;
    }
}

function getDiagState(){
    "use strict";
    Loading(true);
    var url = '/cgi/download.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data= GeneGenericRequestXML();
    var myAjax = new Ajax.Request(
            url, {
                method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                parameters: pars,
                onComplete: replyDiagState
            });
}
function replyDiagState(originalRequest){
    "use strict";
    Loading(false);
    if(originalRequest.readyState== 4&& originalRequest.status== 200){
        var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xmldoc= GetResponseXML(response);
        if(xmldoc== null){
            SessionTimeout();
            return;
        }
        var IPMIRoot= xmldoc.documentElement;
        var debugInfo= IPMIRoot.getElementsByTagName('GET_HTTP_PORT');
        var diagData = debugInfo[0].getElementsByTagName('PORT_INFO');
        var testExist = diagData[0].getAttribute('HTTP_PORT');
        var test_link = diagData[0].getAttribute('HTTP_PORT');
        var test_size = diagData[0].getAttribute('HTTP_PORT');
        if(testExist == 1){
            clearTimeout(diagInitialTimer);
        }else{
            diagInitialTimer = setTimeout(getDiagState,1500);
            return;
        }
        lastTime.textContent = new Date(parseInt(diagData[0].getAttribute('xxxxx')));

        lastLink.href = test_link;
        lastLink.textContent = "System Debug Log (" + test_size + ")";
    }
}

function genDebugLog(){
    "use strict";
    Loading(true);
    var url= '/cgi/download.cgi';
    var pars= 'time_stamp='+ (new Date());
    var ajax_data= generateXML('run_sysdiag');
    var myAjax= new Ajax.Request(
            url, {
                method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                parameters: pars,
                onComplete: runDebugLog
            });
}
function runDebugLog(originalRequest){
    "use strict";
    if(originalRequest.readyState== 4&& originalRequest.status== 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj=GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;
        var checkSession = IPMIRoot.getElementsByTagName('RESULT');
        if (checkSession.length != 0){
            var res = IPMIRoot.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
            if(res == 'OK'){
                setTimeout(function(){ savedDebugLog(); }, 1000);
            }
            else{// RESULT = FAIL
                alert(lang.LANG_NULLXML_SESSION_TIMEOUT);
            }
        }
        Loading(false);
    }
}

function savedDebugLog(){
    "use strict";
    location.href = "/cgi/download.cgi?FILE=DebugLogs.zip";
}
function generateXML(action){
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<POSTDATA>\n";
    result += "    <PARAMETERS>\n";
    result += "        <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "        <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "        <FILE>"+action+"</FILE>\n";
    result += "    </PARAMETERS>\n";
    result += "</POSTDATA>\n";
    return result;
}
