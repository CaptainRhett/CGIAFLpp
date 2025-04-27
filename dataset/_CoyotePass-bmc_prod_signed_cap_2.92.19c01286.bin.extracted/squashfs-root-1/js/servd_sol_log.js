"use strict";
var cbxLogObj;
var btnSetLogObj,btnExportLogObj, logViewConsoleObj;
var logOffset;
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }
function PageInit()
{
    "use strict";
    var key = "offset_sol";
    if(ReadSessionStorage(key) == null) {
        logOffset = 0;
    } else {
        logOffset = parseInt(ReadSessionStorage(key));
    }
    //alert(logOffset);

    document.getElementById("setSOLconfBtn").addEventListener("click", doSaveSOLLogCfg);
    document.getElementById("exportSOLLogBtn").addEventListener("click", genDebugLog);

    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/servd_sol_log_hlp.html";

    cbxLogObj = document.getElementById("sollogcbx");
    logViewConsoleObj = document.getElementById("sollogConsole");

    btnSetLogObj = document.getElementById("setSOLconfBtn");
    btnSetLogObj.value = lang.LANG_CONFIG_SOL_SAMASH_SAVEBTN;

    btnExportLogObj = document.getElementById("exportSOLLogBtn");
    btnExportLogObj.value = lang.LANG_SERVD_SOL_LOG_SAVE_BTN;

    OutputString();
    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
    getSolLogCfg();
}

function OutputString() {
    "use strict";
    document.getElementById("sol_log_div").textContent = lang.LANG_SERVER_DIAGNOSTICS_SUBMENU_SOL_LOG;
    document.getElementById("enable_log_legend").textContent = lang.LANG_SERVER_DIAG_SOL_ENABLE_LOG;
    document.getElementById("enable_log_lbl").textContent = lang.LANG_SERVER_DIAG_SOL_ENABLE_LOG;
    document.getElementById("caption_legend").textContent = lang.LANG_SERVER_DIAG_SOL_LOG_VIEW_DUMP_CAPTION;
    document.getElementById("log_view_legend").textContent = lang.LANG_SERVER_DIAG_SOL_LOG_VIEW;
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if( Privilege == '03' || Privilege == '04' ) {
        cbxLogObj.disabled = false;
        btnExportLogObj.disabled = false;
    } else if( Privilege == '02') {
        alert(lang.LANG_COMMON_NOPRIVI);
        location.href = SubMainPage;
    } else {
        location.href = SubMainPage;
        return;
    }
    return;
}

function GetSolLogHandler(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200){
        //alert(originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj=GetResponseXML(response);
        if(xml_obj == null)
        {
            SessionTimeout();
            return;
        }
        /*
           <?xml version="1.0"?>
           <IPMI>
           <SOLLOG_INFO>
           <SOLLOG_STATUS>
           <SOLLOGENABLE>1</SOLLOGENABLE>
           <COMPLETIONCODE>0</COMPLETIONCODE>
           </SOLLOG_STATUS>
           </SOLLOG_INFO>
           <CGI_STATUS>0</CGI_STATUS>
           </IPMI>
           */

        // check session & privilege
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;
        var cgiStatusNode = IPMIRoot.getElementsByTagName("CGI_STATUS")[0].childNodes[0].nodeValue;
        if(cgiStatusNode=='1') {
            alert('cgi status fail');
            return;
        } else {
            var cmdRtn = IPMIRoot.getElementsByTagName("COMPLETIONCODE")[0].childNodes[0].nodeValue;
            if(cmdRtn == '0') {
                var enable = IPMIRoot.getElementsByTagName("SOLLOGENABLE")[0].childNodes[0].nodeValue;
                if( enable == '1') {
                    cbxLogObj.checked = true;
                } else if( enable == '0') {
                    cbxLogObj.checked = false;
                }
                // We will always allow view and export of SOL log, even if not enabled
                logViewConsoleObj.disabled = false;
                btnExportLogObj.disabled = false;
                getSolLogView();
            } else {
                alert(lang.LANG_SERVD_SOL_LOG_GET_FAIL);
                return;
            }
        }
    }
}

function getSolLogCfg() {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/get_sol_log_enable.cgi';
    var ajax_data = GeneGenericRequestXML();

    /*var ajax_url = '/cgi/dump_post_xml.cgi';
      var pars = 'get_sol_log_enable.xml';
      var ajax_data = '';
      ajax_data += "<?xml version=\"1.0\"?>\n";
      ajax_data += "<IPMI>\n";
      ajax_data += "    <XMLFILE>" + pars + "</XMLFILE>\n";
      ajax_data += "</IPMI>\n";*/
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
                method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: GetSolLogHandler
            });
}

function drawConsole(tableName, dumplog) {
    "use strict";
    var table=document.getElementById(tableName);

    var html = ansi_up.ansi_to_text(dumplog);
    table.textContent = html;
}

function GetSolLogViewHandler(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200){
        //console.log(originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj=GetResponseXML(response);
        if(xml_obj == null)
        {
            SessionTimeout();
            return;
        }
        /*
           <?xml version="1.0"?>
           <IPMI>
           <SOLLOG_INFO>
           <SOLLOG_STATUS>
           <LANCHANNEL>1</LANCHANNEL>
           <SOLLOG>Hello World</SOLLOG>
           <SOLLOG_LAST>10</SOLLOG_LAST>
           <COMPLETIONCODE>0</COMPLETIONCODE>
           </SOLLOG_STATUS>
           </SOLLOG_INFO>
           <CGI_STATUS>0</CGI_STATUS>
           </IPMI>
           */

        // check session & privilege
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;
        //var cgiStatusNode = IPMIRoot.getElementsByTagName("CGI_STATUS")[0].childNodes[0].nodeValue;
        /*if(cgiStatusNode == '1') {
          alert('cgi status fail');
          return;
          } else {*/
        var cmdRtn = IPMIRoot.getElementsByTagName("COMPLETIONCODE")[0].childNodes[0].nodeValue;
        if(cmdRtn == '0') {
            var sollog = IPMIRoot.getElementsByTagName("SOLLOG")[0].childNodes[0].nodeValue;
            //alert("encode-->" + sollog);

            //test base64 decode
            //var encodedString = 'SGVsbG8gV29ybGQh';
            // Decode the String
            var decodedString = atob(sollog);
            //alert("decode-->" + decodedString);
            var sollog_last = IPMIRoot.getElementsByTagName("SOLLOG_LAST")[0].childNodes[0].nodeValue;
            var key = "offset_sol";
            logOffset = sollog_last;
            CreateSessionStorage(key, logOffset);

            var NewArray = new Array();
            NewArray[0] = decodedString;
            // console.log(NewArray);

            for(var i=0; i<NewArray.length; i++) {
                drawConsole('sollogConsole', NewArray[i]);
            }
        } else {
            alert(lang.LANG_SERVD_SOL_LOG_DUMP_GET_FAIL);
            return;
        }
        //}
    }
}
function getSolLogView() {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/get_sol_log_dump.cgi';

    /*
       <?xml version="1.0"?>
       <IPMI>
       <SOLLOG_INFO>
       <SOLLOG_STATUS>
       <OFFSET>0</OFFSET>
       <LENGTH>32</LENGTH>
       </SOLLOG_STATUS>
       </SOLLOG_INFO>
       </IPMI>
       */
    var ajax_data = "";
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <SOLLOG_INFO>\n";
    ajax_data += "        <SOLLOG_STATUS>\n";
    ajax_data += "            <OFFSET>" + 0 +"</OFFSET>";
    ajax_data += "            <LENGTH>" + 32 +"</LENGTH>";
    ajax_data += "        </SOLLOG_STATUS>\n";
    ajax_data += "    </SOLLOG_INFO>\n";
    ajax_data += "</IPMI>\n";
    //alert(ajax_data);
    /*var ajax_url = '/cgi/dump_post_xml.cgi';
      var pars = 'get_sol_log_dump.xml';
      var ajax_data = '';
      ajax_data += "<?xml version=\"1.0\"?>\n";
      ajax_data += "<IPMI>\n";
      ajax_data += "    <XMLFILE>" + pars + "</XMLFILE>\n";
      ajax_data += "</IPMI>\n";*/
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
                method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: GetSolLogViewHandler
            });
}

function SetSolLogHandler(originalRequest) {
    "use strict";
    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj=GetResponseXML(response);
        if(xml_obj == null)
        {
            SessionTimeout();
            return;
        }
        /*
           <?xml version="1.0"?>
           <IPMI>
           <SOLLOG_INFO>
           <SOLLOG_STATUS>
           <COMPLETIONCODE>0</COMPLETIONCODE>
           </SOLLOG_STATUS>
           </SOLLOG_INFO>
           <CGI_STATUS>0</CGI_STATUS>
           </IPMI>
           */

        // check session & privilege
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }
        var IPMIRoot = xml_obj.documentElement;
        var cgiStatusNode = IPMIRoot.getElementsByTagName("CGI_STATUS")[0].childNodes[0].nodeValue;
        if(cgiStatusNode=='1') {
            alert('cgi status fail');
            return;
        } else {
            var cmdRtn = IPMIRoot.getElementsByTagName("COMPLETIONCODE")[0].childNodes[0].nodeValue;
            if(cmdRtn == '1') { //fail
                alert(lang.LANG_SERVD_SOL_LOG_SET_FAIL);
                return;
            } else { //success
                alert(lang.LANG_SERVD_SOL_LOG_SET_GOOD, {title: lang.LANG_GENERAL_SUCCESS});
                getSolLogCfg();
            }
        }
    }
}
function SetSOLConfig() {
    "use strict";
    var ajax_url = '../cgi/set_sol_log_enable.cgi';
    /*
       <?xml version="1.0"?>
       <IPMI>
       <SOLLOG_INFO>
       <SOLLOGENABLE>1</SOLLOGENABLE>
       </SOLLOG_INFO>
       </IPMI>
       */
    var sollogenable;
    if ( cbxLogObj.checked )
        sollogenable = 1;
    else
        sollogenable = 0;

    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <SOLLOG_INFO>\n";
    ajax_data += "        <SOLLOGENABLE>" + sollogenable + "</SOLLOGENABLE>\n";
    ajax_data += "    </SOLLOG_INFO>\n";
    ajax_data += "</IPMI>\n";

    var ajax_req = new Ajax.Request(
            ajax_url,
            {
                method: 'update',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: SetSolLogHandler}//register callback function
            );
}

function doSaveSOLLogCfg() {
    "use strict";
    SetSOLConfig();
}

function doExportSOLLog() {
    "use strict";
    // alert('this is sample test!!');
    btnExportLogObj.disabled = true;
    genDebugLog();
}

function generateXML(action){
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<POSTDATA>\n";
    result += "<PARAMETERS>\n";
    result += "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "<FILE>"+action+"</FILE>\n";
    result += "</PARAMETERS>\n";
    result += "</POSTDATA>\n";
    return result;
}

function genDebugLog(){
    "use strict";
    Loading(true);
    btnExportLogObj.disabled = true;
    var url= '/cgi/save_sol_log.cgi';
    var pars= 'time_stamp='+ (new Date());
    var ajax_data= generateXML('genSOLLOG');
    //console.log(">>>>>> request save_sol_log.cgi with  xml:\n" + ajax_data);
    var myAjax= new Ajax.Request(
            url, {
                method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                parameters: pars,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: genDebugLogHandler
            });
}

function genDebugLogHandler(originalRequest){
    "use strict";
    Loading(true);
    if(originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null){
            SessionTimeout();
            return;
        }

        var IPMIRoot = xmldoc.documentElement;
        var result = IPMIRoot.getElementsByTagName("RESULT")[0].childNodes[0].nodeValue;
        if(result == 'FAIL') {
            //console.log("save_sol_log.cgi --> xml RESULT is FAIL");
            alert(lang.LANG_SERVD_SOL_LOG_DUMP_SAVE_FAIL);
            return;
        } else {
            //console.log("save_sol_log.cgi --> xml RESULT is OK");
            saveSOLLog();
            Loading(false);
        }

    }
}

function saveSOLLog(){
    "use strict";
    var url = "/cgi/save_sol_log.cgi?FILE=sollog";
    //console.log(">>>>>> request save_sol_log.cgi with URL:" + url);
    location.href = url;
    btnExportLogObj.disabled = false;
}
