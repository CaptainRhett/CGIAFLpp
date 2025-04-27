/*
   global variables
*/
"use strict";
var lang;
var gRebootTimeout = 0;
var gRebootDelayTimer = 0;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }
function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/main_factorydefaults_hlp.html";
    // Get multi-language string
    document.title = lang.LANG_FACTORYDEFAULT_TITLE;
    document.getElementById("keep_specific_config_lbl").textContent = lang.LANG_FACTORYDEFAULT_RESTORE_KEEP;
    document.getElementById("restoreBtn").value = lang.LANG_FACTORYDEFAULT_RESTORE;
    document.getElementById("caption_div").textContent = lang.LANG_FACTORYDEFAULT_CAPTION;
    document.getElementById("restoreBtn").addEventListener("click", resetToDefault);
    CheckUserPrivilege(PrivilegeCallBack);
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if(privilege == '04')
    {
        //full access
        document.getElementById("restoreBtn").disabled = false;
    }
    else
    {
        //no access
        location.href = SubMainPage;
        return;
    }
}

function resetToDefault()
{
    "use strict";
    document.getElementById("restoreBtn").disabled = true;
    Loading(true);
    var message;
    var flag = 0;

    if (document.getElementById("_keeptarget").checked == true) {
        flag = 1;
        message = lang.LANG_SERVER_DIAG_DEFAULTS_WARNING3;
    } else {
        flag = 0;
        message = lang.LANG_SERVER_DIAG_DEFAULTS_WARNING2;
    }

    UtilsConfirm(message, {
        onOk: function() {
            "use strict";
            var url = '../cgi/system_restore.cgi';
            //var pars = 'RESTORE_FACTORY_DEFAULT=1';
            /*"<?xml version="1.0"?>
              <POSTDATA>
              <FUNCTION></FUNCTION>
              <PARAMETERS>
              <RESTORE_FLAG>1</RESTORE_FLAG>
              <RESTORE_CFG>1</RESTORE_CFG>
              </PARAMETERS>
              </POSTDATA>
              */
            var ajax_data = '';
            ajax_data += "<?xml version=\"1.0\"?>\n";
            ajax_data += "<POSTDATA>\n";
            ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
            ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
            ajax_data += "    <FUNCTION></FUNCTION>\n";
            ajax_data += "    <PARAMETERS>\n";
            ajax_data += "    <RESTORE_FLAG>" + flag + "</RESTORE_FLAG>\n";
            ajax_data += "        <RESTORE_CFG>1</RESTORE_CFG>\n";
            ajax_data += "    </PARAMETERS>\n";
            ajax_data += "</POSTDATA>\n";
            var myAjax = new Ajax.Request(url,
                    {method: 'post',
                        contentType: "text/xml",
                        xml_data: ajax_data,
                        onComplete: resetToDefaultHandler
                    }
                    );
            // cause restore defaul will reboot system, might cgi no response.
            // just go logout & redirect to login.
            clearSessionInfo();

            //dealy logout, cause bmc will reboot.
            // when delay logout, redirect will show fail page after bmc reboot.
            launchRebootCountdown();
        },
        onClose: function() {
            "use strict";
            Loading(false);
            document.getElementById("restoreBtn").disabled = false;
        }
    });
}

function launchRebootCountdown() {
    "use strict";
    gRebootTimeout = 10;
    Loading(true, lang.LANG_FW_RESET_DESC1 + "  " + gRebootTimeout + "  " + lang.CONF_LOGIN_STR_WEB_TIME_SEC + "...")
        if(gRebootDelayTimer != null) {
            clearInterval(gRebootDelayTimer);
            gRebootDelayTimer = null;
        }
    gRebootDelayTimer = setInterval(delayLogout, 1000);
}

function delayLogout() {
    "use strict";
    //var timerLogout = setTimeout(goLogout, delay);
    Loading(true, lang.LANG_FW_RESET_DESC1 + "  " + gRebootTimeout + "  " + lang.CONF_LOGIN_STR_WEB_TIME_SEC + "...")
        gRebootTimeout--;
    if(gRebootTimeout < 0) {
        if(gRebootDelayTimer != null) {
            clearInterval(gRebootDelayTimer);
            gRebootDelayTimer = null;
        }
        goLogout();
    }
}

function resetToDefaultHandler(originalRequest)
{
    "use strict";
    //Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        //alert(originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }
        /*
           <?xml version="1.0"?>
           <IPMI>
           <COMPLETION_CODE>00</COMPLETION_CODE>
           <RESTORE_INFO>
           <STATUS>DONE</STATUS>
           </RESTORE_INFO>
           </IPMI>
           */

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot=xmldoc.documentElement;//point to IPMI
        var CompletionCode=IPMIRoot.getElementsByTagName("COMPLETION_CODE")[0].childNodes[0].nodeValue;
        var StatusCode=IPMIRoot.getElementsByTagName("STATUS")[0].childNodes[0].nodeValue;

        //erase all cookie
        RemoveSessionStorage("langSetFlag");
        RemoveSessionStorage("language");
        RemoveSessionStorage("mainpage");
        RemoveSessionStorage("subpage");
        RemoveSessionStorage("SESSIONTIMEOUT");
        //alert("after erasecookie, SESSIONTIMEOUT="+ReadSessionStorage("SESSIONTIMEOUT"));
        RemoveSessionStorage("AutoRefreshSecSensor");

        //if(CompletionCode=='00' && StatusCode=='DONE')
        //  alert(lang.LANG_COMMON_DISCONNECT);
        //goLogout();
    }
}
