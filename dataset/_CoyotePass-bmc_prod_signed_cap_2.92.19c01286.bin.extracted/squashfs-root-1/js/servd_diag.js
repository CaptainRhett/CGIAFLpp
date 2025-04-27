"use strict";
/* Server Diagnostics -- System Diagnostics page for download debug log.*/
var lang;
var lastTime;
var lastLink;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit(){
    "use strict";
	top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/servd_diag_hlp.html";
    getDiagState();
    OutputString();
	CheckUserPrivilege(PrivilegeCallBack);

    var runBtn = document.getElementById("runBtn");
	runBtn.setAttribute("value", lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_BTN);
	runBtn.onclick= genDebugLog;//genDebugLog;

    lastTime = document.getElementById("lastTime");
    lastLink = document.getElementById("lastLink");
}

function OutputString() {
    "use strict";
    document.getElementById("title_div").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_TITLE;
    document.getElementById("interpretion_td").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_INTERPRETION;
    document.getElementById("caption_legend").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_CAPTION;
    document.getElementById("lastlog_td").textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_LASTLOG;
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    var runBtn = document.getElementById("runBtn");
    if(privilege == '04'|| privilege == '03') {
	    runBtn.disabled = false;
    }
    else if(privilege == '02') {
	    runBtn.disabled= true;
    }
    else{
        location.href = SubMainPage;
		runBtn.disabled= true;
        return;
    }
}

function getDiagState(){
    "use strict";
    Loading(true);
    var url = '/cgi/download.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data= generateXML('check_sysdiag');
    var myAjax = new Ajax.Request(url,
                                  { method: 'post',
                                    contentType: 'text/xml',
                                    xml_data: ajax_data,
                                    parameters: pars,
                                    timeout: g_CGIRequestTimeout,
                                    ontimeout: onCGIRequestTimeout,
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
                var runBtn = document.getElementById("runBtn");
                var IPMIRoot= xmldoc.documentElement;
                var dstate = IPMIRoot.getElementsByTagName('SYSDIAG_STATE');
                dstate = dstate.length ? dstate[0].childNodes[0] : null;

                var time = IPMIRoot.getElementsByTagName('TIME');
                time = time.length ? time[0].childNodes[0] : null;

                var fname = IPMIRoot.getElementsByTagName('NAME');
                fname = fname.length ? fname[0].childNodes[0] : null;

                if (time) {
                    lastTime.textContent = time.nodeValue;
                } else {
                    lastTime.textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_NONETEXT;
                }

                if (!fname) {
                    lastLink.visible = false;
                    lastLink.textContent = '';
                } else {
                    lastLink.visible = true;
                    lastLink.href = "/cgi/download.cgi?FILE=DebugLogs.zip";
                    lastLink.textContent = fname.nodeValue;
                }

                if (!dstate || dstate.nodeValue == 'idle') {
                    CheckUserPrivilege(PrivilegeCallBack);
                    return;
                } else if (dstate.nodeValue == 'enter' ||
                           dstate.nodeValue == 'run') {
                    lastTime.textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_RUNNING;
                    runBtn.disabled = true;
                    setTimeout(getDiagState, 1500);
                } else if (dstate.nodeValue == 'done' ||
                           dstate.nodeValue == 'read') {
                    CheckUserPrivilege(PrivilegeCallBack);
                    // setTimeout(getDiagState, 1500);
                }
    }
}

function getGenDiagState(){
    "use strict";
    Loading(true);
    var url = '/cgi/download.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data= generateXML('runck_sysdiag');
    var myAjax = new Ajax.Request(url,
                                  { method: 'post',
                                    contentType: 'text/xml',
                                    xml_data: ajax_data,
                                    parameters: pars,
                                    timeout: g_CGIRequestTimeout,
                                    ontimeout: onCGIRequestTimeout,
                                    onComplete: replyGenDiagState
                                  });
}

function replyGenDiagState(originalRequest){
    "use strict";
    Loading(false);
    if(originalRequest.readyState== 4&& originalRequest.status== 200){
        var response= originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xmldoc= GetResponseXML(response);
        if(xmldoc== null){
                        SessionTimeout();
                        return;
                }
                var runBtn = document.getElementById("runBtn");
                var IPMIRoot= xmldoc.documentElement;
                var dstate = IPMIRoot.getElementsByTagName('SYSDIAG_STATE');
                dstate = dstate.length ? dstate[0].childNodes[0] : null;

                var time = IPMIRoot.getElementsByTagName('TIME');
                time = time.length ? time[0].childNodes[0] : null;

                var fname = IPMIRoot.getElementsByTagName('NAME');
                fname = fname.length ? fname[0].childNodes[0] : null;

                if (time) {
                    lastTime.textContent = time.nodeValue;
                } else {
                    lastTime.textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_NONETEXT;
                }

                if (!fname) {
                    lastLink.visible = false;
                    lastLink.textContent = '';
                } else {
                    lastLink.visible = true;
                    lastLink.href = "/cgi/download.cgi?FILE=DebugLogs.zip";
                    lastLink.textContent = fname.nodeValue;
                }

                if (!dstate || dstate.nodeValue == 'idle') {
                    CheckUserPrivilege(PrivilegeCallBack);
                    return;
                } else if (dstate.nodeValue == 'enter' ||
                           dstate.nodeValue == 'run') {
                    lastTime.textContent = lang.LANG_SERVER_DIAGNOSTICS_SYS_DIAGNOSTICS_RUNNING;
                    runBtn.disabled = true;
                    setTimeout(getGenDiagState, 1500);
                } else if (dstate.nodeValue == 'done' ||
                           dstate.nodeValue == 'read') {
                    CheckUserPrivilege(PrivilegeCallBack);
                    setTimeout(getGenDiagState, 1500);
                }
    }
}

function genDebugLog(){
    "use strict";
	Loading(true);
    var runBtn = document.getElementById("runBtn");
	lastTime.textContent = "";
	lastLink.visible = false;
        runBtn.disabled = true;
	var url= '/cgi/download.cgi';
	var pars= 'time_stamp='+ (new Date());
	var ajax_data= generateXML('run_sysdiag');
	var myAjax= new Ajax.Request(
				url, {
				method: 'post',
				contentType: 'text/xml',
				xml_data: ajax_data,
				parameters: pars,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
				onComplete: replyGenDiagState,
				});
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
