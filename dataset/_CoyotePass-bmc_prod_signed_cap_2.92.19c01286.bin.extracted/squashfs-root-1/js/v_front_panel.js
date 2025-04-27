"use strict";
//var CONFPAGE="../cgi/url_redirect.cgi?url_name=remote";


var lang;
var access;
var action;
var power_state, status_state, chassis_state;
var t = 0, rt = 0;
var buttonState = 0;
var PowerledObj, powerBtnObj, statusLedObj, resetBtnObj, chassisLedObj, chassisIdBtnObj, messageObj;
var PwrBtn_status =false;
var ResetBtn_status =false;
var button_State = 0;
var hostTimer;
var chassis_setinterval = 0;
var power_setinterval =0;
var ID_setinterval =0;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit() {
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/v_front_panel_hlp.html";

    PowerledObj = document.getElementById("powerled");
    powerBtnObj = document.getElementById("powerBtn");
    resetBtnObj = document.getElementById("ResetBtn");
    statusLedObj = document.getElementById("StatusledDiv");
    chassisLedObj = document.getElementById("chassIdLedDiv");
    chassisIdBtnObj = document.getElementById("chassisIDBtn");
    messageObj = document.getElementById("Message");
    //hidden messageObj
    messageObj.style.display = "none";

    //test messagae
    //messageObj.textContent = 'Voltage has crossed critical value';
    //messageObj.style.color = '#FF6600';
    //messageObj.style.width = '180px';

    PwrBtn_status =false;
    ResetBtn_status =false;

    powerBtnObj.onclick = DoPowerAction;
    resetBtnObj.onclick = DoResetAction;
    chassisIdBtnObj.onclick = DoChassisAction;

    getHostStatus();
    //getLedStatus();
    getChassisStatus();

    document.getElementById("caption_div").textContent = lang.LANG_REMOTE_CNTRL_SUBMENU_VIRTUAL_FRONT_PANEL;
    CheckUserPrivilege(PrivilegeCallBack);
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if(Privilege == '04' || Privilege == '03' || Privilege == '02') //User or higher
    {
        access = 1;
    } else {
        //no access
        access = 0;
    }
}

function getLedHandler(originalRequest) {
    "use strict";
    /*if (originalRequest.readyState == 4 && originalRequest.status == 200) {
    //alert(originalRequest.responseText);
    var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
    var xmldoc=GetResponseXML(response);
    if(xmldoc == null) {
    SessionTimeout();
    return;
    }
    }*/
}

function getLedStatus() {
    "use strict";
    /*var ajax_url = '/cgi/virtual_front_panel.cgi';
    //<?xml version="1.0"?>
    //<POSTDATA>
    //   <FUNCTION></FUNCTION>
    //   <PARAMETERS>
    //       <GET_LEDID>0</GET_LEDID>
    //    </PARAMETERS>
    //</POSTDATA>
    //input 0 = Power LED. 1 = Status LED. 2 = Chassis LED. -1 = get all LED
    var gettype = -1;
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<POSTDATA>\n";
    ajax_data += "<FUNCTION></FUNCTION>\n";
    ajax_data += "<PARAMETERS>\n";
    ajax_data += "    <GET_LEDID>" + gettype + "</GET_LEDID>\n";
    ajax_data += "</PARAMETERS>\n";
    ajax_data += "</POSTDATA>\n";
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
    ajax_url,
    {   method: 'post',
    contentType: "text/xml",
    xml_data: ajax_data,
    onComplete: getLedHandler
    }//register callback function
    );*/
}

function getHostHandler(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        //alert(originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }
        //<IPMI>
        //  <COMPLETION_CODE>00</COMPLETION_CODE>
        //  <LED_INFO>
        //      <LED ID="0" NAME="POWER">BLINKING</LED>
        //  </LED_INFO>
        //  <LED_INFO>
        //      <LED ID="1" NAME="STATUS">OFF</LED>
        //  </LED_INFO>
        //  <LED_INFO>
        //      <LED ID="2" NAME="CHASSIS">ON</LED>
        //  </LED_INFO>
        //  <LED_INFO>
        //      <LED ID="3" NAME="UNKNOW">OFF</LED>
        //  </LED_INFO>
        //  <LED_INFO>
        //      <LED ID="4" NAME="UNKNOW">OFF</LED>
        //  </LED_INFO>
        //  <FRONT_PANEL_TEXT>some info text</FRONT_PANEL_TEXT>
        //</IPMI>
        //Return: ON | OFF | BLINKING | UNKNOW

        /*
           1119-2015 update:
           About STATUS LED :
           GREEN_ON : green light
           GREEN_BLINKING : green blinking
           AMBER_ON : amber light
           AMBER_BLINKING : amber blinking
           */

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;//point to IPMI

        var ledinfo = IPMIRoot.getElementsByTagName("LED");
        //for(var i=0; i<3; i++) {
        //  ledName = ledinfo[i].getAttribute("NAME");
        //  ledStatus = ledinfo.item(i).firstChild.nodeValue;
        //  alert('NAME=' + ledName + '\n' + 'STATUS=' + ledStatus);
        //}

        power_state = ledinfo.item(0).firstChild.nodeValue;
        status_state = ledinfo.item(1).firstChild.nodeValue;
        chassis_state = ledinfo.item(2).firstChild.nodeValue;
        var front_panel_text = IPMIRoot.getElementsByTagName("FRONT_PANEL_TEXT")[0].childNodes[0].nodeValue;

        messageObj.textContent = "";// clear text info

        // Removing all children from an element
        while (PowerledObj.firstChild) {
            PowerledObj.removeChild(PowerledObj.firstChild);
        }
        var power_img = document.createElement('IMG');
        if(power_state == 'OFF') { // host power is OFF
            power_img.setAttribute('class', "comp-alert-i statusled");
            power_img.setAttribute('id', "_Power");
            power_img.setAttribute('src', "../images/grey.png");
            PowerledObj.appendChild(power_img);
        } else if(power_state == 'ON') { // host power is ON
            power_img.setAttribute('class', "comp-alert-i statusled");
            power_img.setAttribute('id', "_Power");
            power_img.setAttribute('src', "../images/green.png");
            PowerledObj.appendChild(power_img);
        } else if(power_state == 'BLINKING') {
            power_setinterval = setInterval(BlinkPowerLED,500/*3000*/);
        }

        //status led part
        clearInterval(ID_setinterval);

        // Removing all children from an element
        while (statusLedObj.firstChild) {
            statusLedObj.removeChild(statusLedObj.firstChild);
        }
        var status_img = document.createElement('IMG');
        if(status_state == 'GREEN_ON') {
            status_img.setAttribute('class', "comp-alert-i statusled");
            status_img.setAttribute('id', "_IDLed");
            status_img.setAttribute('src', "../images/green.png");
            statusLedObj.appendChild(status_img);
        } else if(status_state == 'AMBER_ON') {
            status_img.setAttribute('class', "comp-alert-i statusled");
            status_img.setAttribute('id', "_IDLed");
            status_img.setAttribute('src', "../images/red.png");
            statusLedObj.appendChild(status_img);
        } else if(status_state == 'GREEN_BLINKING') {
            ID_setinterval = setInterval(BlinkGreen,500);
        } else if(status_state == 'AMBER_BLINKING') {
            ID_setinterval = setInterval(BlinkAmber,500);
        }

        //chassis part
        clearInterval(chassis_setinterval);
        //alert(chassis_state)
        // Removing all children from an element
        while (chassisLedObj.firstChild) {
            chassisLedObj.removeChild(chassisLedObj.firstChild);
        }
        var chassis_img = document.createElement('IMG');
        if(chassis_state == 'ON') {
            chassis_img.setAttribute('class', "comp-alert-i statusled");
            chassis_img.setAttribute('id', "_IDLed");
            chassis_img.setAttribute('src', "../images/blue.png");
            chassisLedObj.appendChild(chassis_img);
        } else if(chassis_state == 'OFF') {
            chassis_img.setAttribute('class', "comp-alert-i statusled");
            chassis_img.setAttribute('id', "_IDLed");
            chassis_img.setAttribute('src', "../images/grey.png");
            chassisLedObj.appendChild(chassis_img);
        } else if(chassis_state == 'BLINKING') {
            chassis_setinterval = setInterval(BlinkChassisID,500);
        }

        //message info
        messageObj.textContent = front_panel_text;
        messageObj.style.color = '#00FF00';
        messageObj.style.width = '180px';

        clearTimeout(hostTimer);
        hostTimer = setTimeout(getHostStatus, 2000);
    }
}

function BlinkAmber() {
    "use strict";
    // Removing all children from an element
    while (statusLedObj.firstChild) {
        statusLedObj.removeChild(statusLedObj.firstChild);
    }
    var status_img = document.createElement('IMG');
    status_img.setAttribute('class', "comp-alert-i statusled");
    status_img.setAttribute('id', "_Statusled");
    if(button_State == 0) {
        status_img.setAttribute('src', "../images/red.png");
        button_State = 1;
    } else {
        status_img.setAttribute('src', "../images/grey.png");
        button_State = 0;
    }
    statusLedObj.appendChild(status_img);
}

function BlinkGreen() {
    "use strict";
    // Removing all children from an element
    while (statusLedObj.firstChild) {
        statusLedObj.removeChild(statusLedObj.firstChild);
    }

    var status_img = document.createElement('IMG');
    status_img.setAttribute('class', "comp-alert-i statusled");
    status_img.setAttribute('id', "_Statusled");
    if(button_State == 0) {
        status_img.setAttribute('src', "../images/green.png");
        button_State = 1;
    } else {
        status_img.setAttribute('src', "../images/grey.png");
        button_State = 0;
    }
    statusLedObj.appendChild(status_img);
}

function BlinkPowerLED() {
    "use strict";
    // Removing all children from an element
    while (PowerledObj.firstChild) {
        PowerledObj.removeChild(PowerledObj.firstChild);
    }

    var power_img = document.createElement('IMG');
    power_img.setAttribute('class', "comp-alert-i statusled");
    power_img.setAttribute('id', "_Power");
    if(buttonState == 0)
    {
        power_img.setAttribute('src', "../images/grey.png");
        buttonState = 1;
    } else {
        power_img.setAttribute('src', "../images/green.png");
        buttonState = 0;
    }
    PowerledObj.appendChild(power_img);
}

function BlinkChassisID() {
    "use strict";
    // Removing all children from an element
    while (chassisLedObj.firstChild) {
        chassisLedObj.removeChild(chassisLedObj.firstChild);
    }

    var chassis_img = document.createElement('IMG');
    chassis_img.setAttribute('class', "comp-alert-i statusled");
    chassis_img.setAttribute('id', "_IDLed");
    if(buttonState == 0)
    {
        chassis_img.setAttribute('src', "../images/blue.png");
        buttonState = 1;
    } else {
        chassis_img.setAttribute('src', "../images/grey.png");
        buttonState = 0;
    }
    chassisLedObj.appendChild(chassis_img);
}

function getHostStatus() {
    "use strict";
    var ajax_url = '../cgi/virtual_front_panel.cgi';
    /*<?xml version="1.0"?>
      <POSTDATA>
      <FUNCTION></FUNCTION>
      <PARAMETERS>
      <GET_LEDID>-1</GET_LEDID>
      <GET_FNT_PNL_TXT>1</GET_FNT_PNL_TXT>
      </PARAMETERS>
      </POSTDATA>*/
    //input 0 = Power LED. 1 = Status LED. 2 = Chassis LED. -1 = get all LED
    //chassisIdBtnObj.disabled = true;
    var gettype = -1; //get all LED
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<POSTDATA>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <FUNCTION></FUNCTION>\n";
    ajax_data += "    <PARAMETERS>\n";
    ajax_data += "        <GET_LEDID>" + gettype + "</GET_LEDID>\n";
    ajax_data += "        <GET_FNT_PNL_TXT>1</GET_FNT_PNL_TXT>\n";
    ajax_data += "    </PARAMETERS>\n";
    ajax_data += "</POSTDATA>\n";
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {   method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: getHostHandler
            }//register callback function
            );
}

function getChassisHandler(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //alert(response);
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;//point to IPMI

        var ledinfo = IPMIRoot.getElementsByTagName("LED");

        chassis_state = ledinfo.item(0).firstChild.nodeValue;

        // Removing all children from an element
        while (chassisLedObj.firstChild) {
            chassisLedObj.removeChild(chassisLedObj.firstChild);
        }
        var chassis_img = document.createElement('IMG');
        chassis_img.setAttribute('class', "comp-alert-i statusled");
        chassis_img.setAttribute('id', "_IDLed");
        //alert(chassis_state);
        if(chassis_state == 'ON') {
            chassis_img.setAttribute('src', "../images/blue.png");
        } else if(chassis_state == 'OFF') {
            chassis_img.setAttribute('src', "../images/grey.png");
        }
        chassisLedObj.appendChild(chassis_img);
    }
}

function getChassisStatus() {
    "use strict";
    var ajax_url = '../cgi/virtual_front_panel.cgi';
    /*<?xml version="1.0"?>
      <POSTDATA>
      <FUNCTION></FUNCTION>
      <PARAMETERS>
      <GET_LEDID>-1</GET_LEDID>
      <GET_FNT_PNL_TXT>0</GET_FNT_PNL_TXT>
      </PARAMETERS>
      </POSTDATA>*/
    //input 0 = Power LED. 1 = Status LED. 2 = Chassis LED. -1 = get all LED
    //chassisIdBtnObj.disabled = true;
    var gettype = 2; //get Chassis LED
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<POSTDATA>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <FUNCTION></FUNCTION>\n";
    ajax_data += "    <PARAMETERS>\n";
    ajax_data += "        <GET_LEDID>" + gettype + "</GET_LEDID>\n";
    ajax_data += "        <GET_FNT_PNL_TXT>0</GET_FNT_PNL_TXT>\n";
    ajax_data += "    </PARAMETERS>\n";
    ajax_data += "</POSTDATA>\n";
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {   method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: getChassisHandler
            }//register callback function
            );
}

function DoPowerAction() {
    "use strict";
    Loading(false);
    if(access) {
        if(false == PwrBtn_status && false == ResetBtn_status) {
            PwrBtn_status = true;
            switch(power_state)
            {
                case 'OFF': // power OFF
                    showWait(true, lang.LANG_VIRTUAL_FRONT_PANEL_POWER_ON);
                    action = 1;
                    break;
                default: // power ON
                    showWait(true, lang.LANG_VIRTUAL_FRONT_PANEL_POWER_OFF);
                    action = 5;
                    break;
            }
            doPwrOnOff(power_state);
        }
    } else {
        alert(lang.LANG_COMMON_CANNOT_MODIFY);
        Loading(false);
    }
}

/*
   state: OFF-->do power on, others --> do power off
   */
function doPwrOnOff(state)
{
    "use strict";
    Loading(true);
    var url = '../cgi/server_power_control.cgi';;

    var myAjax;

    /*
       <?xml version="1.0"?>
       <POSTDATA>
       <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>
       <PARAMETERS>
       <POWER_ON_SERVER>1</POWER_ON_SERVER>
       <POWER_OFF_SERVER>0</POWER_OFF_SERVER>
       </PARAMETERS>
       </POSTDATA>
       */
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<POSTDATA>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>\n";
    ajax_data += "    <PARAMETERS>\n";

    if( state == 'OFF' ) {
        ajax_data += "        <POWER_ON_SERVER>1</POWER_ON_SERVER>\n";
    } else {
        ajax_data += "        <POWER_OFF_SERVER>1</POWER_OFF_SERVER>\n";
    }
    ajax_data += "    </PARAMETERS>\n";
    ajax_data += "</POSTDATA>\n";
    //alert(ajax_data);

    myAjax = new Ajax.Request(
            url,
            {
                method: 'update',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: getHostPowerActionRes
            });
}

function checkHostPwrStatus() {
    "use strict";
    showWait(false);
    PwrBtn_status = false;
    getHostStatus();
    clearTimeout(t);
}

function getHostPowerActionRes()  {
    "use strict";
    Loading(false);
    var t = setTimeout(checkHostPwrStatus,9000);
}


function resetHostRes() {
    "use strict";
    Loading(false);
    showWait(true, lang.LANG_VIRTUAL_FRONT_RESET_START);
    rt = setTimeout(setResetOK,9000);
}

function setResetOK() {
    "use strict";
    showWait(false);
    ResetBtn_status = false;
    clearTimeout(rt);
}

function DoResetAction() {
    "use strict";
    if(access) {
        if(/*current_state!=0 &&*/ false == ResetBtn_status && false == PwrBtn_status) {
            ResetBtn_status = true;
            showWait(true);

            action = 3;
            resetHost();
        }
    } else {
        alert(lang.LANG_COMMON_CANNOT_MODIFY);
        showWait(false);
    }
}

function resetHost()
{
    "use strict";
    Loading(true);
    var url = '../cgi/server_power_control.cgi';;

    var myAjax;

    /*
       <?xml version="1.0"?>
       <POSTDATA>
       <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>
       <PARAMETERS>
       <POWER_ON_SERVER>1</POWER_ON_SERVER>
       <POWER_OFF_SERVER>0</POWER_OFF_SERVER>
       </PARAMETERS>
       </POSTDATA>
       */
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<POSTDATA>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>\n";
    ajax_data += "    <PARAMETERS>\n";
    ajax_data += "        <RESET_SERVER>1</RESET_SERVER>\n";
    ajax_data += "    </PARAMETERS>\n";
    ajax_data += "</POSTDATA>\n";
    //alert(ajax_data);
    myAjax = new Ajax.Request(
            url,
            {
                method: 'update',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: resetHostRes
            });
}

function doChassisOnOffRes(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(response);

        // check session & privilege
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var result = GetXMLNodeValue(xml_obj, "RESULT");
        //alert(result);
        if(result == "OK") {
            getChassisStatus();
            return;
        }
    }
}

function doChassisOnOff(state) {
    "use strict";
    var url = '../cgi/set_chassis_id.cgi';;
    var myAjax;
    /*
       <?xml version="1.0"?>
       <IPMI>
       <SET_CHASSIS_ID>
       <SWITCH>1</SWITCH>
       </SET_CHASSIS_ID>
       </IPMI>
       */
    var ajax_data = "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <SET_CHASSIS_ID>\n";
    ajax_data += "        <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "        <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    //alert(state);
    if( state == 'OFF' ) {
        //alert('set on');
        ajax_data += "        <SWITCH>1</SWITCH>\n";
    } else {
        //alert('set off');
        ajax_data += "        <SWITCH>0</SWITCH>\n";
    }

    ajax_data += "    </SET_CHASSIS_ID>\n</IPMI>\n";
    myAjax = new Ajax.Request(
            url,
            {
                method: 'update',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: doChassisOnOffRes
            });
}

function DoChassisAction() {
    "use strict";
    if(access) {
        doChassisOnOff(chassis_state);
    } else {
        alert(lang.LANG_COMMON_CANNOT_MODIFY);
    }
}
