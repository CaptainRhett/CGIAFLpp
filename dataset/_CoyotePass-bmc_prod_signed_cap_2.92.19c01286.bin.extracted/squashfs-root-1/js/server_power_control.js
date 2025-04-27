"use strict";
var pwr_Action;
var currentPwrStatus;
var expectStatus = 0xf;
var retryCount = 10;
var externalBMC = 0;
var cableChkBMC = lang.LANG_S_POWER_CONTROL_CHECK1;
var cableChkFeature = lang.LANG_S_POWER_CONTROL_CHECK2;

var currentStatusObj;
var	pwrResetObj;
var	cbxforceBIOSObj;
var	pwrImmOffObj;
var	pwrGracefulShutdownObj;
var	pwrOnObj;
var	cbxforceBIOSpwronObj;
var	pwrCycleObj;

var prfmActionBtn;
var isAdmin;
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/server_power_control_hlp.html";
    // Get multi-language string
    document.title = lang.LANG_S_POWER_CONTROL_TITLE;

    currentStatusObj 		= document.getElementById("currentStatus");
    pwrResetObj 	 		= document.getElementById("pwrReset");
    cbxforceBIOSObj  		= document.getElementById("forceBIOS");
    pwrImmOffObj 			= document.getElementById("pwrImmOff");
    pwrGracefulShutdownObj 	= document.getElementById("pwrGracefulShutdown");
    pwrOnObj 				= document.getElementById("pwrOn");
    cbxforceBIOSpwronObj 	= document.getElementById("forceBIOSpwron");
    pwrCycleObj 			= document.getElementById("pwrCycle");

    prfmActionBtn = document.getElementById("actionBtn");
    prfmActionBtn.value = lang.LANG_S_POWER_CONTROL_ACTION;

    CheckUserPrivilege(PrivilegeCallBack);
    OutputString();
    prfmActionBtn.onclick = doPwrAction;
}

function PrivilegeBtnCheck(privilege)
{
    "use strict";
    if (privilege == '04' || privilege == '03') {
        prfmActionBtn.disabled = false;
    } else if (privilege == '02') {
        prfmActionBtn.disabled = true;
    } else {
        prfmActionBtn.disabled = true;
    }
}

function OutputString() {
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_S_POWER_CONTROL_CAPTION;
    document.getElementById("pwrReset_lbl").textContent = lang.LANG_S_POWER_CONTROL_RESET;
    document.getElementById("forceBIOS_lbl").textContent = lang.LANG_S_POWER_CONTROL_FORCE_ENTER_BIOS;
    document.getElementById("pwrImmOff_lbl").textContent = lang.LANG_S_POWER_CONTROL_IMMOFF;
    document.getElementById("pwrGracefulShutdown_lbl").textContent = lang.LANG_S_POWER_CONTROL_GRACEFUL_SHUTDOWN;
    document.getElementById("pwrOn_lbl").textContent = lang.LANG_S_POWER_CONTROL_ON;
    document.getElementById("forceBIOSpwron_lbl").textContent = lang.LANG_S_POWER_CONTROL_FORCE_ENTER_BIOS;
    document.getElementById("pwrCycle_lbl").textContent = lang.LANG_S_POWER_CONTROL_CYCLE;
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if(privilege == '04' || privilege == '03') //oper or higher
    {
        //full access
        getPwrStatus();
        prfmActionBtn.disabled = false;
        isAdmin = 0;
    }
    else if(privilege == '02')//user only view
    {
        //read only
        //alert(lang.LANG_COMMON_CANNOT_MODIFY);
        getPwrStatus();
        prfmActionBtn.disabled = true;
        pwrResetObj.disabled = true;
        cbxforceBIOSObj.disabled = true;
        pwrImmOffObj.disabled = true;
        pwrGracefulShutdownObj.disabled = true;
        pwrOnObj.disabled = true;
        pwrCycleObj.disabled = true;
        isAdmin = 1;
    }
    else
    {
        //no access
        location.href = SubMainPage;
    }

    let KCSMode = ReadSessionStorage("KCSMode");
    if (KCSMode == "restricted" || KCSMode == "deny_all") {
        cbxforceBIOSObj.disabled = true;
        cbxforceBIOSpwronObj.disabled = true;
    }
}

function getPwrStatus()
{
    "use strict";
    Loading(true);
    var url = '../cgi/server_power_control.cgi';
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<POSTDATA>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>\n";
    ajax_data += "    <PARAMETERS>\n";
    ajax_data += "        <GET_CHASSIS_STATUS>1</GET_CHASSIS_STATUS>\n";
    ajax_data += "    </PARAMETERS>\n";
    ajax_data += "</POSTDATA>\n";
    //alert(ajax_data);
    var myAjax = new Ajax.Request(
            url,
            {   //method: 'get',parameters:pars, onComplete: getPwrStatusHandler
                method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: getPwrStatusHandler
            });
}

function getPwrStatusHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        //alert(originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        /*
           <IPMI>
           <COMPLETION_CODE>00</COMPLETION_CODE>
           <POWER_INFO>
           <POWER STATUS="OFF or ON"/>
           </POWER_INFO>
           </IPMI>
           */

        //<RESULT>OK/FAIL/SESSION_INVALID</RESULT>
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;//point to IPMI
        var POWER_INFO = IPMIRoot.getElementsByTagName('POWER_INFO');//point to POWER_INFO
        var POWER = POWER_INFO[0].getElementsByTagName('POWER');
        var pwrStatus = POWER[0].getAttribute("STATUS");
        currentPwrStatus = (pwrStatus == "OFF") ? 0 : 1;

        if(expectStatus != 0xf)
        {
            if(currentPwrStatus != expectStatus)
            {
                retryCount--;
                Loading(true);
                if(retryCount == 0)
                {
                    Loading(false);
                    var cableStr = externalBMC ? cableChkBMC:cableChkFeature;
                    if(pwr_Action == 5)
                    {
                        alert(lang.LANG_S_POWER_CONTROL_SOFTOFF_FAIL + cableStr);
                    }
                    else
                    {
                        alert(lang.LANG_S_POWER_CONTROL_ACTION_FAIL + cableStr);
                    }
                    //reset button state & status info
                    CheckUserPrivilege(PrivilegeBtnCheck);
                    //prfmActionBtn.disabled = false;
                    currentStatusObj.textContent = lang.LANG_S_POWER_CONTROL_POWER_OFF_START;
                    currentStatusObj.className = 'text_power_state_off';
                    return;
                }

                setTimeout(getPwrStatus,10000);

                return;
            }else
            {
                if(pwr_Action == 2 && expectStatus == 0)
                {
                    document.getElementById("currentStatus").textContent = lang.LANG_S_POWER_CONTROL_STATUS_OFF;
                    document.getElementById("currentStatus").className = 'text_power_state_on';

                    document.getElementById("pwrReset").checked = false;
                    document.getElementById("pwrReset").disabled = true;

                    document.getElementById("pwrImmOff").checked = false;
                    document.getElementById("pwrImmOff").disabled = true;

                    document.getElementById("pwrGracefulShutdown").checked = false;
                    document.getElementById("pwrGracefulShutdown").disabled = true;

                    document.getElementById("pwrCycle").checked = true;
                    document.getElementById("pwrCycle").disabled = true;

                    document.getElementById("pwrOn").checked = false;
                    document.getElementById("pwrOn").disabled = true;
                    expectStatus = 1;
                    setTimeout(getPwrStatus,10000);
                    return;
                }
            }


        }

        if(currentPwrStatus == 0) //power status if off
        {
            document.getElementById("currentStatus").textContent = lang.LANG_S_POWER_CONTROL_STATUS_OFF;
            document.getElementById("currentStatus").className = 'text_power_state_off';

            document.getElementById("pwrReset").checked = false;
            document.getElementById("pwrReset").disabled = true;

            document.getElementById("forceBIOS").checked = false;
            document.getElementById("forceBIOS").disabled = true;

            document.getElementById("pwrImmOff").checked = false;
            document.getElementById("pwrImmOff").disabled = true;

            document.getElementById("pwrGracefulShutdown").checked = false;
            document.getElementById("pwrGracefulShutdown").disabled = true;

            document.getElementById("pwrCycle").checked = false;
            document.getElementById("pwrCycle").disabled = true;

            document.getElementById("pwrOn").checked = true;
            document.getElementById("pwrOn").disabled = false;

            cbxforceBIOSpwronObj.checked = false;
            cbxforceBIOSpwronObj.disabled = false;

            pwr_Action = 1;
            retryCount = 10;
        }
        else //power status is on
        {
            document.getElementById("currentStatus").textContent = lang.LANG_S_POWER_CONTROL_STATUS_ON;
            document.getElementById("currentStatus").className = 'text_power_state_on';

            document.getElementById("pwrReset").checked = true;
            document.getElementById("pwrReset").disabled = false;

            document.getElementById("pwrImmOff").checked = false;
            document.getElementById("pwrImmOff").disabled = false;

            document.getElementById("pwrGracefulShutdown").checked = false;
            document.getElementById("pwrGracefulShutdown").disabled = false;

            document.getElementById("pwrCycle").checked = false;
            document.getElementById("pwrCycle").disabled = false;

            document.getElementById("pwrOn").checked = false;
            document.getElementById("pwrOn").disabled = true;

            document.getElementById("forceBIOSpwron").checked = false;
            document.getElementById("forceBIOSpwron").disabled = false;

            //console.log("==now is on ===== pwr_Action is " + pwr_Action);
            if(pwr_Action == undefined || pwr_Action == 3) {
                cbxforceBIOSpwronObj.checked = false;
                cbxforceBIOSpwronObj.disabled = true;
            } else {
                cbxforceBIOSObj.checked = false;
                cbxforceBIOSObj.disabled = false;
                cbxforceBIOSpwronObj.checked = false;
                cbxforceBIOSpwronObj.disabled = true;
            }

            pwr_Action = 3;
            retryCount = 10;
        }

        let KCSMode = ReadSessionStorage("KCSMode");
        if (KCSMode == "restricted" || KCSMode == "deny_all") {
            cbxforceBIOSObj.disabled = true;
            cbxforceBIOSpwronObj.disabled = true;
        }
        CheckUserPrivilege(PrivilegeBtnCheck);
        //prfmActionBtn.disabled = false;
    }
}

/*
   TBD: server_power_control.cgi should return STATUS for page what to do
   */
function doPwrActionHandler(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //alert(originalRequest.responseText);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }
        /*
           <IPMI>
           <COMPLETION_CODE>00</COMPLETION_CODE>
           <RETURN_MSG>'Power ON & Force into BIOS' Sent.</RETURN_MSG>
           </IPMI>
           */
        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;//point to IPMI

        var CompletionCode=IPMIRoot.getElementsByTagName("COMPLETION_CODE")[0].childNodes[0].nodeValue;

        if(CompletionCode!='00') {
            alert('somethings error, since COMPLETION_CODE return not equal 00');
        } else {
            //showWait(true, lang.LANG_S_POWER_CONTROL_RESPONSE1);
            var inittmout = 0;
            if(pwr_Action == 2) {// power cycle
                inittmout = 20000; //for power cycle we check if host is powered on again after 10 secs
            }
            else if(pwr_Action == 5) // soft OFF (OS-mediated)
            {
                inittmout = 30000;
            }
            else
            {
                inittmout = 10000;
            }
            retryCount = 10;
            setTimeout(getPwrStatus,inittmout);
        }

    }
}

function doPwrAction()
{
    "use strict";
    var url = '../cgi/server_power_control.cgi';
    var myAjax;

    /*
       <?xml version="1.0"?>
       <POSTDATA>
       <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>
       <PARAMETERS>
       <GET_CHASSIS_STATUS>1</GET_CHASSIS_STATUS>
       <RESET_SERVER>0</RESET_SERVER>
       <FORCE_INTO_BIOS>0</FORCE_INTO_BIOS>
       <POWER_ON_SERVER>0</POWER_ON_SERVER>
       <POWER_OFF_SERVER>0</POWER_OFF_SERVER>
       <POWER_CYCLE_SERVER>0</POWER_CYCLE_SERVER>
       <GRACEFUL_SHUTDOWN>0</GRACEFUL_SHUTDOWN>
       </PARAMETERS>
       </POSTDATA>
       */
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<POSTDATA>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>\n";
    ajax_data += "    <PARAMETERS>\n";
    if ( isAdmin == 0 ) {
        if( pwrResetObj.checked ) { // hard reset
            pwr_Action = 3;
            expectStatus = 1;
            currentStatusObj.textContent = lang.LANG_S_POWER_CONTROL_RESET_START;
            currentStatusObj.className = 'text_power_resetting';
            ajax_data += "        <RESET_SERVER>1</RESET_SERVER>\n";
            prfmActionBtn.disabled = true;
        } else {
            ajax_data += "        <RESET_SERVER>0</RESET_SERVER>\n";
        }

        if( pwrImmOffObj.checked ) { // power OFF
            pwr_Action = 0;
            expectStatus = 0;
            currentStatusObj.textContent = lang.LANG_S_POWER_CONTROL_POWER_OFF_START;
            currentStatusObj.className = 'text_power_state_off';
            ajax_data += "        <POWER_OFF_SERVER>1</POWER_OFF_SERVER>\n";
            prfmActionBtn.disabled = true;
        } else {
            ajax_data += "        <POWER_OFF_SERVER>0</POWER_OFF_SERVER>\n";
        }

        if( pwrGracefulShutdownObj.checked ) { //Soft power off host
            pwr_Action = 5;
            expectStatus = 0;
            currentStatusObj.textContent = lang.LANG_S_POWER_CONTROL_GRACEFUL_SHUTDOWN2;
            currentStatusObj.className = 'text_power_graceful';
            ajax_data += "        <GRACEFUL_SHUTDOWN>1</GRACEFUL_SHUTDOWN>\n";
            prfmActionBtn.disabled = true;
            pwrResetObj.disabled = true;
            cbxforceBIOSObj.disabled = true;
            pwrImmOffObj.disabled = true;
            pwrGracefulShutdownObj.disabled = true;
            pwrOnObj.disabled = true;
            pwrCycleObj.disabled = true;
        } else {
            ajax_data += "        <GRACEFUL_SHUTDOWN>0</GRACEFUL_SHUTDOWN>\n";
        }

        if( pwrOnObj.checked ) { // power ON
            pwr_Action = 1;
            expectStatus = 1;
            currentStatusObj.textContent = lang.LANG_S_POWER_CONTROL_POWER_ON_START;
            currentStatusObj.className = 'text_power_state_on';
            ajax_data += "        <POWER_ON_SERVER>1</POWER_ON_SERVER>\n";
            prfmActionBtn.disabled = true;
        } else {
            ajax_data += "        <POWER_ON_SERVER>0</POWER_ON_SERVER>\n";
        }

        if( pwrCycleObj.checked ) { // power cycle
            pwr_Action = 2;
            expectStatus = 1;
            currentStatusObj.textContent = lang.LANG_S_POWER_CONTROL_CYCLE_START;
            currentStatusObj.className = 'text_power_cycle_start';
            ajax_data += "        <POWER_CYCLE_SERVER>1</POWER_CYCLE_SERVER>\n";
            prfmActionBtn.disabled = true;
        } else {
            ajax_data += "        <POWER_CYCLE_SERVER>0</POWER_CYCLE_SERVER>\n";
        }

        if(cbxforceBIOSObj.checked || cbxforceBIOSpwronObj.checked) {
            ajax_data += "        <FORCE_INTO_BIOS>1</FORCE_INTO_BIOS>\n";
        } else {
            ajax_data += "        <FORCE_INTO_BIOS>0</FORCE_INTO_BIOS>\n";
        }

        ajax_data += "    </PARAMETERS>\n";
        ajax_data += "</POSTDATA>\n";
        //alert(ajax_data);
        Loading(true);
        myAjax = new Ajax.Request(
                url,
                {
                    method: 'update',
                    contentType: "text/xml",
                    xml_data: ajax_data,
                    timeout: g_CGIRequestTimeout,
                    ontimeout: onCGIRequestTimeout,
                    onComplete: doPwrActionHandler
                });
    } else {
        alert(lang.LANG_COMMON_CANNOT_MODIFY);
    }
}
