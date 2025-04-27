"use strict";
var PRIVILEGE_LIMIT;
var gSessionTimeout = null;
var SubMainPage = "../cgi/url_redirect.cgi?url_name=privilege_alert";
var gCSRFCallbackFunc = null;
var gSessionCheckPendingCount = 0;
var gSessionResetPendingCount = 0;
var g_heartbeat_interval = 1000 * 10; // 10 sec
var g_callback = null;
var g_CGIRequestTimeout = 30000;// set cgi request timeout in 30 sec default.

var browser_ie = (((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0))?true:false);
var session_timeout_reason = 0;
var lang;

document.writeln('<script src="../js/prototype.js"></script>');
document.writeln('<script src="../js/utils_preauth.js"></script>');

// use this function to substitute native confirm
function UtilsConfirm(msg, params) {
    "use strict";
    UtilsConfirmInternal(msg, lang.LANG_COMMON_OK, lang.LANG_COMMON_CANCEL, params);
};

// use this function to substitute native confirm
function UtilsConfirmInternal(msg, textOK, textCancel, params) {
    "use strict";
    var myid = global_dynamic_id++;
    var mydialog = document.createElement("div");
    mydialog.setAttribute("id", "dynamic_dialog" + myid);
    mydialog.title = params && params.title ? params.title : lang.LANG_COMMON_CONFIRM;
    mydialog.textContent = msg;
    document.body.appendChild(mydialog);

    jQuery("#dynamic_dialog" + myid).dialog({
        autoOpen: false,
        modal: true, // other items on the page will be disabled
        show: { effect: "fold", duration: 600 },
        hide: { effect: "fold", duration: 600 },
        close: function( event, ui ) {
            "use strict";
            if(params && params.onClose) params.onClose(params.onCloseParams);
            jQuery("#dynamic_dialog" + myid).dialog("destroy");
            mydialog.parentNode.removeChild(mydialog);
        },
        buttons:[
            {
                text: textCancel,
                click: function() {
                    "use strict";
                    if(params && params.onCancel) params.onCancel(params.onCancelParams);
                    jQuery("#dynamic_dialog" + myid).dialog("close");
                }
            },
            {
                text: textOK,
                click: function() {
                    if(params && params.onOk) params.onOk(params.onOkParams);
                    jQuery("#dynamic_dialog" + myid).dialog("close");
                }
            }
        ],
    });
    jQuery("#dynamic_dialog" + myid).dialog("open");
};


/*handle all XML document API due to  browser compatibility */
function GetResponseXML(response)
{
    "use strict";
    if(response.length == 0 ||
      (response.charAt(0) == '<' &&
      (response.charAt(1) == 'H' || response.charAt(1) =='h') &&
      (response.charAt(2) == 'T' || response.charAt(2) == 't') &&
      (response.charAt(3) == 'M' || response.charAt(3) == 'm') &&
      (response.charAt(4) == 'L' || response.charAt(4) == 'l') &&
      response.charAt(5) == '>'))
    {
        //session_timeout_reason = 1;
        //SessionTimeout();
        return;
    }
    var xmlDoc;
    if (window.ActiveXObject){ //ie
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(response);
    }
    else if (window.XMLHttpRequest) {//Firefox or Safari
        var parser=new DOMParser();
        xmlDoc=parser.parseFromString(response,"text/xml");
    }

    if(xmlDoc.childNodes[0].nodeName == 'HTML' ||
       xmlDoc.childNodes[0].nodeName == 'html')
    {
        session_timeout_reason = 1;
        xmlDoc = null;
    }
    return xmlDoc;
}

function onPrivilegeFailedClose()
{
    "use strict";
    location.href = location;
}

function validateNumeric(evt) {
    "use strict";
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    var keyCode = parseInt(key);
    //Keycode -> 8:backspace; 9:tab; 37:Left arrow; 39:Right arrow; 46:Delete
    //keycode (96~105) numeric-key-pad.
    if(keyCode == 8 || keyCode == 9 || keyCode == 37 || keyCode == 39 || keyCode == 46 ||
       (keyCode >= 96 && keyCode <= 105)) {
        //console.log("keyCode:" + keyCode);
        return;
    }

    key = String.fromCharCode( key );
    var regex = /[0-9]|\.\s/;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

function ValidateSessResp(originalRequest)
{
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }
        var IPMI=xmldoc.documentElement;//point to IPMI
        var SESSION=IPMI.getElementsByTagName('SESSION');//point to SENSOR_INFO
        var STATE = SESSION[0].getElementsByTagName('STATE');
        var state = parseInt(STATE[0].getAttribute("CODE"), 10);
        if(state == 0) {
            SessionTimeout();
        }
    }
}

/*Lauch Java application*/
function GetJNLPRequest (ButtonObj, Flag)
{
    "use strict";
    // check if current JRE version is greater than 1.6.0
    // 0910-2015: heck method nerver verifyed, ignore it.
    /*if (deployJava.versionCheck('1.6.0_10+') == false) {
        userInput = confirm("You need the latest Java(TM) Runtime Environment. Would you like to update now?");
        if (userInput == true) {
            // Set deployJava.returnPage to make sure user comes back to
            // your web site after installing the JRE
            deployJava.returnPage = location.href;
            // install latest JRE or redirect user to another page to get JRE from.
            deployJava.installLatestJRE();
        }
    }*/

    var host_url = location.host;
    var host_addr = location.hostname;


    if (Flag == 0)
    {
        var JnlpURL = window.location.protocol+"//" + host_url + "/cgi/url_redirect.cgi?url_name=jnlp"
                        + "&url_type=jwsk" + "&lang_setting=" + lang_setting
                        + "&host_addr=" + host_addr;
    }
    else
    {
        var JnlpURL = window.location.protocol+"//" + host_url + "/cgi/url_redirect.cgi?url_name=jnlp"
                        + "&url_type=jwss"+ "&lang_setting=" + lang_setting
                        + "&host_addr=" + host_addr;
    }

    ButtonObj.disabled=false;
    ButtonObj.onclick=function()
    {
        "use strict";
        deployJava.launch(JnlpURL);
    }
}

/*show loading string on web*/
function Loading(enable, text) {
    "use strict";
    var showText = "";

    document.getElementById("loading").setAttribute("class", "LoadingStyle");
    if(enable) {
        if(text == null || text.length < 1) {
            document.getElementById("loading").textContent = 'L O A D I N G ...';
        } else {
            document.getElementById("loading").textContent = text;
        }
    }
    else {
        document.getElementById("loading").textContent = "";
    }
}
/*show wait.gif */
function showWait(enable, text)
{
    "use strict";
    var img = document.createElement('IMG');

    if ( (text==undefined)||(text=="") ) {
        text= "";
    }
    if(enable) {
        img.setAttribute('height', 10);
        img.setAttribute('src', '../images/wait.gif');
        img.setAttribute('id', 'waitimg');
        img.style.position = 'relative';
        img.style.top = '1px';
        document.getElementById("wait").textContent = text + "&nbsp";
        document.getElementById("wait").appendChild(img);
    } else {
        var d_img = document.getElementById("waitimg");
        document.getElementById("wait").removeChild(d_img);

        // Removing all children from an element
        /*var element = document.getElementById("wait");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }*/
    }
}

function onCGIRequestTimeout() {
    "use strict";
    Loading(true, lang.LANG_COMMON_REQUEST_TIMEOUT);
}

function CheckWord(txt) //the txt only exists letter and number.
{
    "use strict";
    var re = /\W/;
    if (re.test(txt))
        return false;
    else
        return true;
}
/*Check the path for virtual media webpage */
function CheckPath(txt)
{
    "use strict";
    var path = txt;
    var filter = /^\\[a-zA-Z0-9_\$\.\- ]+\\([a-zA-Z0-9_\$\.\- ]+\\*)+(\.[iI][sS][oO]){1}$/;

    if(filter.test(path))
        return true;
    else

        return false;
}
/*check domain name*/
function CheckDomainName(e)
{
    "use strict";
    var filter =  /^(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/;
    var v = new String(e);

    if ( v.match( (filter) ) )
    {
        return true;
    }
    v = null;

    return false;
}
/*check E-mail address*/
function CheckEMAIL(e)
{
    "use strict";
    var filter =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/;
    var v = new String(e);

    if ( v.match( (filter) ) )
    {
        return true;
    }
    v = null;

    return false;
}
/*check the user password*/
function CheckPassword(pw)
{
    "use strict";

    //if( (pw.length > 20) || (pw.length < 8) )
    if( (pw.length > 20) || (pw.length < 6))
    {
        return false;
    }
    /*else
    {
        var re=/^[^ ]+$/;
        if (re.test(pw)==false)
        {
            //alert(eLang.getSysString("STR_PASSWORD_SPC"));
            return false;
        }
    }*/
    return true;
}

function CheckStringLength(value, min, max){
    var result = true;
    if(min) result = result && (min <= value.length);
    if(max) result = result && (max >= value.length);
    return result;
}

function CheckPrintableChar(value){
    var filter = /^[\x20-\x7E]*$/;
    return value.match(filter);
}

function islower(ch) {
    "use strict";
    if( (ch >= "a") && (ch <= "z") )
        return true;
    else
        return false;
}
function isupper(ch) {
    "use strict";
    if( (ch >= "A") && (ch <= "Z") )
        return true;
    else
        return false;
}
function isalphachk(ch) {
    "use strict";
    if( islower(ch) || isupper(ch) )
        return true;
    else
        return false;
}
function isnumchk(ch) {
    "use strict";
    if( (ch >= "0") && (ch <= "9") )
        return true;
    else
        return false;
}
function isspecialchk(ch) {
    "use strict";
    if( ch == "_" )
        return true;
    else
        return false;
}
function firstcharvalid(ch) {
    "use strict";
    if( isalphachk(ch) || isnumchk(ch) || isspecialchk(ch) )
        return true;
    else
        return false;
}
/*check the user name*/
function CheckUserName(name)
{
    "use strict";
    if( name.length < 1 )
    {
        alert(lang.LANG_CONFUSER_ADD_ERR1);
        return false;
    }
    if( name.length > 64 )
    {
        alert(lang.LANG_CONFUSER_ADD_USR_TOO_LONG);
        return false;
    }
    if( !firstcharvalid(name.charAt(0)) )
    {
        alert(lang.LANG_CONFUSER_NAME_RULE_INFO);
        return false;
    }
    var name1 = new String(name);
    var SpeficCharFilter = /([^a-zA-Z0-9_\-\.])/;
    if( name1.match(SpeficCharFilter) )
    {
        alert(lang.LANG_CONFUSER_NAME_RULE_INFO);
        return false;
    }
    else
    {
        return true;
    }
}
/*check illegal char*/
function CheckSpeficChar(str)
{
    "use strict";
    var str1 = new String(str);
    var SpeficCharFilter = /([,; &"<>\\=$#*!@~`%^])/;
    if( str1.match(SpeficCharFilter) )
    {
        return false;
    }
    else
    {
        return true;
    }
}
/*check number*/
function CheckNumber(n)
{
    "use strict";
    return typeof n == 'number' && isFinite(n);
}
/*check if IP address is legal*/
function CheckIP(ipAddr)
{
    "use strict";
    var addr = (new String(ipAddr)).split(".");
    if(addr.length != 4)
    {
        return false;
    }
    for( var i=0; i<4 ;i++)
    {
        if( isNaN(addr[i]) || addr[i]=="" || addr[i] < 0 || addr[i] > 255 ||addr[i].length>3)
        {
            return false;
        }
    }

    addr = null;
    return true;
}
/* Check if number is valid port number */
function CheckPortNumber(port)
{
    "use strict";
    var n = +port;
    return port === n.toString() && n >= 1 && n <= 65535
}

/*check if e-mail address is legal*/
function CheckEmail(email) {
    "use strict";
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function substr_count(string, substring)
{
    "use strict";
    var cnt = 0, offset = -1;

    string += '';
    substring += '';

    while ((offset = string.indexOf(substring, offset+1)) != -1)
        cnt++;

    return cnt;
}
function CheckIP6(ipAddr)
{
    "use strict";
    if (ipAddr.length < 3)
        return (ipAddr == '::' || ipAddr == "" || ipAddr == 0);

    // Check if part is in IPv4 format
    if (ipAddr.indexOf('.') > 0)
    {
        // accept straight IPv4
        if (CheckIP(ipAddr))
            return true;

        var lastcolon = ipAddr.lastIndexOf(':');
        if (!(lastcolon && CheckIP(ipAddr.substr(lastcolon + 1))))
            return false;

        // replace IPv4 part with dummy
        ipAddr = ipAddr.substr(0, lastcolon) + ':0:0';
    }

    // check uncompressed
    if (ipAddr.indexOf('::') < 0)
    {
        var match = ipAddr.match(/^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/i);
        return (match != null);
    }

    // check colon-count for compressed format
    if (substr_count(ipAddr, ':') < 8)
    {
        var match = ipAddr.match(/^(?::|(?:[a-fA-F0-9]{1,4}:)+):(?:(?:[a-fA-F0-9]{1,4}:)*[a-fA-F0-9]{1,4})?$/i);
        return (match != null);
    }

    return false;
}
/*check the file ext name*/
function CheckExtName(str, lookfor)
{
    "use strict";
    var strlen = str.length;
    var lookforlen = lookfor.length;

    var lookforptr = lookforlen;
    while( lookforptr > 0 )
    {
            if( str.charAt(strlen-lookforptr) != lookfor.charAt(lookforlen-lookforptr) )
                    return false;
            lookforptr--;
    }
    return true;
}

/*for event log */
function GetSubString(str,start,end)
{
    "use strict";
    var ori = str;
    var res =0x00;
    for(var i=start;i>=end;i--)
        res = res | (1 << i);
    return (ori & res);
}
/* for user page*/
function GetVars(str)
{
    "use strict";
    var url=location.search.substring(1);
    var parameterList=url.split("&");
    for (var i=0;i<parameterList.length;i++)
    {
         var parameter=parameterList[i].split("=");
         if (parameter[0] == str)
            return (decodeURIComponent(parameter[1]));
    }
}

function ToLocale(str)
{
    "use strict";
    var newstr = str.substring(0,7)+str.substring(15)+str.substring(6,16);
    var CardDate = new Date(newstr + " GMT");
    return ( CardDate.toLocaleString() );

}

//for every page used
function CheckUserPrivilege(Callbackfunc)
{
    "use strict";
    PRIVILEGE_LIMIT = top.frames.topmenu.PRIV_ID;
    //alert('CheckUserPrivilege==>privilege= ' + PRIVILEGE_LIMIT);
    if(PRIVILEGE_LIMIT != null) {
        //if (typeof (Callbackfunc) == 'function' ) {
        Callbackfunc(PRIVILEGE_LIMIT);
        //}
    } else {
        Callbackfunc(null);
    }
}

//check User Privilege only for mainmenu page.
function CheckUserPrivilegeX(Callbackfunc)
{
    "use strict";
    var url = '/cgi/check_user_privilege.cgi';
    //<?xml version="1.0"?>
    //<IPMI>
    //    <SESSIONINFO>
    //      <NAME>xxxxxxxxxxxxxxxx</NAME>
    //    </SESSIONINFO>
    //</IPMI>
    var ajax_data = '';
        ajax_data += "<?xml version=\"1.0\"?>\n";
        ajax_data += "<IPMI>\n";
        ajax_data += "    <SESSIONINFO>";
        ajax_data += "    </SESSIONINFO>";
        ajax_data += "</IPMI>\n";
    var myAjax = new Ajax.Request(
                   url,
                   {
                     method: 'post',
                     contentType: "text/xml",
                     xml_data: ajax_data,
                     onComplete: UserPrivilegeHandler
                   });

    function UserPrivilegeHandler(originalRequest)
    {
        "use strict";
        if (originalRequest.readyState == 4 && originalRequest.status == 200)
        {
            var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
            var xmldoc = GetResponseXML(response);
            if(xmldoc == null)
            {
                SessionTimeout();
                return;
            }

            //<?xml version="1.0"?>
            //<IPMI>
            //    <SESSIONINFO>
            //        <PRIVILEGE>4</PRIVILEGE>
            //        <UID>07</UID>
            //    </SESSIONINFO>
            //</IPMI>

            var Privilege = GetXMLNodeValue(xmldoc, "PRIVILEGE");
            var CurrentUID = GetXMLNodeValue(xmldoc, "UID");
            var PAMAuth = GetXMLNodeValue(xmldoc, "PAMAUTH");
            //var IPMIRoot=xmldoc.documentElement;//point to IPMI
            //var Privilege=IPMIRoot.getElementsByTagName("PRIVILEGE")[0].childNodes[0].nodeValue;
            //add Prefix char 0
            if(Privilege == '4') {
                Privilege = '04';
            } else if(Privilege == '3') {
                Privilege = '03';
            } else if(Privilege == '2') {
                Privilege = '02';
            } else if(Privilege == '1' || Privilege == '15') {
                /* privilege 1/15 : Callback/No Access group don't have privilege to login web pages */
                location.href = "../cgi/url_redirect.cgi?url_name=url_redirect_login3";
                // alert(lang.LANG_LOGIN_SESSION_NO_PRIV);
                return;
            }
            CreateSessionStorage("currentUID", CurrentUID);
            //PRIVILEGE_LIMIT-->topmenu
            PRIVILEGE_LIMIT = Privilege;
            top.PRIV_ID = Privilege;
            top.PAM_AUTH = PAMAuth;
            if(typeof top.frames.topmenu != 'undefined')
                top.frames.topmenu.PRIV_ID = Privilege;

            if (typeof (Callbackfunc) == 'function' )
            {
                Callbackfunc(Privilege);
            }

        }
    }
}

/* Request to generate a new CSRF Token for init */
function requestRemoveCSRFToken(token)
{
    "use strict";
    var url = '/cgi/csrf_tokens.cgi';
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <REQUEST>DELETE</REQUEST>";
    ajax_data += "    <SESSION TOKEN=\"" + token + "\"></SESSION>";
    ajax_data += "</IPMI>\n";
    var myAjax = new Ajax.Request(
                   url,
                   {
                     method: 'DELETE',
                     contentType: "text/xml",
                     xml_data: ajax_data,
                     onComplete: onRemoveCSRFTokenComplete
                   });

}

function onRemoveCSRFTokenComplete(originalRequest)
{
    "use strict";
    if (originalRequest.readyState != 4 || originalRequest.status != 200) {
        alert(lang.LANG_LOGOUT_SESSION_INVALID, {onClose: function() {
            location.href = "/";
        }});
    } else {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("onRemoveCSRFTokenComplete():" + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }

        var result = GetXMLNodeValue(xmldoc, "RESULT");
        //console.log("onRemoveCSRFTokenComplete() result:" + result)
        if(result == "OK") {
            //console.log("onNewCSRFTokenComplete() removed")
            top.frames.topmenu.CSRF_TOKEN = "";
        }
    }
}

/* Request to generate a new CSRF Token for init */
function requestReloadCSRFToken(callback_func)
{
    "use strict";
    var url = '/cgi/csrf_tokens.cgi';
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <REQUEST>RELOAD</REQUEST>";
    ajax_data += "</IPMI>\n";
    if(callback_func != null && typeof(callback_func) != "undefined") {
        gCSRFCallbackFunc = callback_func;
    }
    else {
        gCSRFCallbackFunc = null;
    }
    var myAjax = new Ajax.Request(
                   url,
                   {
                     method: 'POST',
                     contentType: "text/xml",
                     xml_data: ajax_data,
                     onComplete: onNewCSRFTokenComplete
                   });

}

function Check_bmc_security_control_mode_warning(warningString)
{
    "use strict";
    let showString = typeof warningString == 'string' ? warningString: ' ';
    let KCSMode = ReadSessionStorage("KCSMode");
    let kcs_sec_warning = document.getElementById("kcs_segment_state");

    if (kcs_sec_warning != null) {
        kcs_sec_warning.textContent = showString;
        if (KCSMode == "allow_all") {
            kcs_sec_warning.style.visibility = "visible";
        } else {
            kcs_sec_warning.style.visibility = "hidden";
        }
    }
}

function requestKCSMode()
{
    "use strict";
    var url = '../cgi/kcsmodecfg.cgi';
    var pars = 'time_stamp='+ (new Date());
    var ajax_data = "<?xml version=\"1.0\"?>\n"+
                    "<IPMI>\n"+
                    "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
                    "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
                    "</IPMI>\n";
    var ajax_req = new Ajax.Request(
                                    url,
                                    {
                                     method: 'POST',
                                     contentType: 'text/xml',
                                     xml_data: ajax_data,
                                     parameters: pars,
                                     onComplete: readKCSModeStatus
                                    });
}

function readKCSModeStatus(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var result = GetXMLNodeValue(xml_obj, "RESULT");

        if (result == "FAIL") {
            //console.log("request KCS mode fail.");
            return;
        }

        var root = xml_obj.documentElement;
        updateKCSStateList(root);
    }
}

function updateKCSStateList(root)
{
    "use strict";
    var KCSMode = '';
    var node = root.getElementsByTagName("KCS_MODE")[0];
    if (node != null) {
        KCSMode = node.getAttribute("STATE");
        switch (KCSMode) {
          case "ALLOW_ALL":
            CreateSessionStorage("KCSMode", "allow_all");
            break;
          case "RESTRICTED":
            CreateSessionStorage("KCSMode", "restricted");
            break;
          case "DENY_ALL":
            CreateSessionStorage("KCSMode", "deny_all");
            break;
          default:
            CreateSessionStorage("KCSMode", "deny_all");
        }
    }
    Check_bmc_security_control_mode_warning(lang.CONF_KCS_BANNER);
}

/* Request to generate a new CSRF Token for init */
function requestNewCSRFToken(callback_func)
{
    "use strict";
    var url = '/cgi/csrf_tokens.cgi';
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <REQUEST>GENERATE</REQUEST>";
    ajax_data += "</IPMI>\n";
    if(callback_func != null && typeof(callback_func) != "undefined") {
        gCSRFCallbackFunc = callback_func;
    }
    else {
        gCSRFCallbackFunc = null;
    }
    var myAjax = new Ajax.Request(
                   url,
                   {
                     method: 'PUT',
                     contentType: "text/xml",
                     xml_data: ajax_data,
                     onComplete: onNewCSRFTokenComplete
                   });

}

function onNewCSRFTokenComplete(originalRequest)
{
    "use strict";
    if (originalRequest.readyState != 4 || originalRequest.status != 200) {
        SessionTimeout();
        alert(lang.LANG_LOGIN_SESSION_NO_PRIV, {onClose: function() {
            location.href = "/";
        }});
    } else {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log(">>>> onNewCSRFTokenComplete():" + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }

        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if(result == "OK") {
            //console.log("onNewCSRFTokenComplete() result 001 :" + result)
            var token = GetXMLNodeValue(xmldoc, "TOKEN");
            //console.log("onNewCSRFTokenComplete() result 002 :" + token)
            //console.log("set token to replace top.frames.mainmenu.CSRF_TOKEN:" + top.frames.topmenu.CSRF_TOKEN);
            top.frames.topmenu.CSRF_TOKEN = token;
        }
        if(gCSRFCallbackFunc != null) {
            //console.log(">> go callback");
            gCSRFCallbackFunc();
        }
        gCSRFCallbackFunc = null;
    }
}

/* Request to check CSRF Token valid/invalid/update */
function checkCSRFTokenValid(response)
{
    "use strict";
    var ret = false;
    var xmldoc = GetResponseXML(response);
    if(xmldoc == null) {
        SessionTimeout();
        return;
    }

    var result = GetXMLNodeValue(xmldoc, "RESULT");
    if(result == "OK") {
        var token = GetXMLNodeValue(xmldoc, "TOKEN");
        if(token != NULL && token.lenght > 0) {
            top.frames.topmenu.CSRF_TOKEN = token;
        }
        ret = true;
    }
    return ret;
}

function responseClearInvalidSession(response)
{
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        //console.log("responseClearInvalidSession:\n" + response.responseText + "\n\n");
        alert(lang.LANG_LOGOUT_SESSION_INVALID, {onClose: function() {
            location.href = "/";
        }});
    }
}

function dumpXMLDocString(xmldoc)
{
    "use strict";
    var result = "";
    if(xmldoc != null) {
        result = (new XMLSerializer()).serializeToString(xmldoc);
    }
    return result;
}

//Sensor API
function ToSigned(Num, signedbitB)
{
    "use strict";

    if(signedbitB > 0)
    {

        /* positive */
        if( ( Num%(0x01<<signedbitB)/(0x01<<(signedbitB-1)) ) < 1 )
        {
            return Num%(0x01<<signedbitB-1);
        }
        /* negative */
        else
        {
            var temp = (Num%(0x01<<signedbitB-1)) ^ ((0x01<<signedbitB-1)-1);
            return (-1-temp);
        }

    }

    else
    {
        return Num;
    }

}


function SensorFunc(raw_data, m, b, rb)
{
    "use strict";
    var sensor_data;

    var M_raw, M_data;
    var B_raw, B_data;
    var Km_raw, Km_data;
    var Kb_raw, Kb_data;


    /* change sequense of lsb and msb into 10b char */
    M_raw = ((parseInt(m,16)&0xC0) << 2) + ( parseInt(m,16) >> 8);
    B_raw = ((parseInt(b,16)&0xC0) << 2) + ( parseInt(b,16) >> 8);


    Km_raw = parseInt(rb,16) >> 4;
    Kb_raw = (parseInt(rb,16) & 0x0F);

    M_data = ToSigned(M_raw, 10);
    B_data = ToSigned(B_raw, 10);
    Km_data = ToSigned(Km_raw, 4);
    Kb_data = ToSigned(Kb_raw, 4);

    sensor_data = (M_data*parseInt(raw_data, 16) + B_data*Math.pow(10, Kb_data)) * Math.pow(10,Km_data);

    return sensor_data;

}
function ShowDiscStateAPI( Sensor_Type, sensor_d )
{
    "use strict";
    var State_String = "";
    /*
    sensor_d is the sensor reading value
    We convert sensor_d to sensor specific offset and show its corresponding event string.
    */
    ShowDiscStateAPI.SensorHealth = "bgcolor=red";
    if( Sensor_Type == "05" )
    {
        if(sensor_d == 0){
            State_String += 'OK';
            ShowDiscStateAPI.SensorHealth = "bgcolor=green";
        }
        if(parseInt((sensor_d/1), 10) % 2)
            State_String += 'General Chassis Intrusion. ';
        if(parseInt((sensor_d/2), 10) % 2)
            State_String += 'Drive Bay intrusion. ';
        if(parseInt((sensor_d/4), 10) % 2)
            State_String += 'I/O Card area intrusion. ';
        if(parseInt((sensor_d/8), 10) % 2)
            State_String += 'Prosessor area intrusion. ';
        if(parseInt((sensor_d/16), 10) % 2)
            State_String += 'LAN Leash Lost. ';
        if(parseInt((sensor_d/32), 10) % 2)
            State_String += 'Unauthorized dock. ';
        if(parseInt((sensor_d/64), 10) % 2)
            State_String += 'Fan area intrusion. ';

        return State_String;
    }
    else if( Sensor_Type == "07" )
    {

        if(parseInt(sensor_d, 10)==0)
        {
            State_String += 'Normal Status';
            ShowDiscStateAPI.SensorHealth = "bgcolor=green";
        }
        else
        {
            State_String += 'Abnormal Status';
        }

        return State_String;
    }
    else if( Sensor_Type == "08" )
    {
        if(parseInt((sensor_d/1), 10) % 2){
            State_String += 'Presence detected. ';
            ShowDiscStateAPI.SensorHealth = "bgcolor=green";
        }
        if(parseInt((sensor_d/2), 10) % 2)
            State_String += 'Power Supply Failure detected. ';
        if(parseInt((sensor_d/4), 10) % 2)
            State_String += 'Predictive Failure. ';
        if(parseInt((sensor_d/8), 10) % 2)
            State_String += 'Power Supply input lost (AC/DC). ';
        if(parseInt((sensor_d/16), 10) % 2)
            State_String += 'Power Supply input lost or out-of-range. ';
        if(parseInt((sensor_d/32), 10) % 2)
            State_String += 'Power Supply input out-of-range, but present. ';
        if(parseInt((sensor_d/64), 10) % 2)
            State_String += 'Configuration error. ';

        return State_String;
    }
    else if( Sensor_Type == "10" )
    {
        if(sensor_d == 0)
        {
            State_String += 'Normal';
            //State_String += lang.LANG_SENSOR_STATUS_NORMAL;
            ShowDiscStateAPI.SensorHealth = "bgcolor=green";
        }

        if(parseInt((sensor_d/1), 10) % 2)
        {
            State_String += 'Correctable Memory Error Logging Disable';
            ShowDiscStateAPI.SensorHealth = "bgcolor=white";
        }

        if(parseInt((sensor_d/2), 10) % 2)
        {
            State_String += 'Event \'type\' Logging Disable';
            ShowDiscStateAPI.SensorHealth = "bgcolor=white";
        }

        if(parseInt((sensor_d/4), 10) % 2)
        {
            State_String += 'Log Area Reset/Cleared';
            ShowDiscStateAPI.SensorHealth = "bgcolor=green";
        }

        if(parseInt((sensor_d/8), 10) % 2)
        {
            State_String += 'All Event Logging Disabled';
            ShowDiscStateAPI.SensorHealth = "bgcolor=white";
        }

        if(parseInt((sensor_d/16), 10) % 2)
        {
            State_String += 'SEL Full';
        }

        if(parseInt((sensor_d/32), 10) % 2)
        {
            State_String += 'SEL Almost Full';
            ShowDiscStateAPI.SensorHealth = "bgcolor=yellow";
        }

        return State_String;
    }
    else if( Sensor_Type == "c0" )
    {
        if(parseInt((sensor_d/1), 10) % 2){
            State_String += 'Low';
            ShowDiscStateAPI.SensorHealth = "bgcolor=green";
        }
        else if(parseInt((sensor_d/2), 10) % 2){
            State_String += 'Medium';
            ShowDiscStateAPI.SensorHealth = "bgcolor=yellow";
        }
        else if(parseInt((sensor_d/4), 10) % 2)
            State_String += 'High';
        else if(parseInt((sensor_d/16), 10) % 2)
            State_String += 'Over Heat';
        else if(parseInt((sensor_d/128), 10) % 2){
            State_String += 'Uninstall';
            ShowDiscStateAPI.SensorHealth = "bgcolor=white";
        }
        else
            State_String += 'Not Present!';

        return State_String;
    }
    else if( Sensor_Type == "c2" )
    {
        if(sensor_d == 0){
            State_String += 'OK';
            ShowDiscStateAPI.SensorHealth = "bgcolor=green";
        }
        if(parseInt((sensor_d/1), 10) % 2)
            State_String += 'None of The Above Fault';
        if(parseInt((sensor_d/2), 10) % 2)
            State_String += 'CML Fault';
        if(parseInt((sensor_d/4), 10) % 2)
            State_String += 'Over Temperature Fault';
        if(parseInt((sensor_d/8), 10) % 2)
            State_String += 'Under Voltage Fault';
        if(parseInt((sensor_d/16), 10) % 2)
            State_String += 'Over Current Fault';
        if(parseInt((sensor_d/32), 10) % 2)
            State_String += 'Over Ovltage Fault';
        if(parseInt((sensor_d/64), 10) % 2)
            State_String += 'PS On/Off';
        if(parseInt((sensor_d/128), 10) % 2)
            State_String += 'Device Busy';
        return State_String;
    }
}
//Convert integer to hex string
function IntegerToHexString(Num)
{
    "use strict";
    var Value = String.fromCharCode(Num);
    var Value1 = Value.charCodeAt(0);
    return  Value1.toString(16).toUpperCase();
}//process sensor function
function SensorFormula(node,Idx,SensorTableArray)
{
        "use strict";
        var SensorType = node.getAttribute("STYPE");
        //var SensorReadingObj = node.getAttribute("READING");
        //var RawReading = SensorReadingObj.substr(0, 2);
        var RawReading = node.getAttribute("RAW_READING");
        var Option = parseInt(node.getAttribute("OPTION"), 16);
        //var SFormula = node.getAttribute("L");
        //var UnitType1 = parseInt(node.getAttribute("UNIT1"), 16);
        var UnitType = parseInt(node.getAttribute("UNIT"), 16);
        var Unit;
        //var AnalogDataFormat = UnitType1 >> 6;
        var UNR, UC, UNC, LNC, LC, LNR;
        //var ReadingDataFormat;

        //attribute 'STATUS' identical webui 'Status' field
        var Status = node.getAttribute("STATUS");
        SensorFormula.Status = Status;

        SensorFormula.NeedCompare = 0;



        switch(UnitType)
        {
            case 0x00://add new type 00
                Unit = lang.LANG_SENSOR_UNIT00;
                break;
            case 0x01:
                Unit = lang.LANG_SENSOR_UNIT01;
                break;
            case 0x02:
                Unit = lang.LANG_SENSOR_UNIT02;
                break;
            case 0x03:
                Unit = lang.LANG_SENSOR_UNIT03;
                break;
            case 0x04:
                Unit = lang.LANG_SENSOR_UNIT04;
                break;
            case 0x05:
                Unit = lang.LANG_SENSOR_UNIT05;
                break;
            case 0x06:
                Unit = lang.LANG_SENSOR_UNIT06;
                break;
            case 0x07:
                Unit = lang.LANG_SENSOR_UNIT07;
                break;
            case 0x11:
                Unit = lang.LANG_SENSOR_UNIT11;
                break;
            case 0x12:
                Unit = lang.LANG_SENSOR_UNIT12;
                break;
            case 0x13:
                Unit = lang.LANG_SENSOR_UNIT13;
                break;
            default:
                break;
        }
        SensorFormula.Unit = Unit;
        // 2's complement
        /*if(AnalogDataFormat == 0x02 )
        {
            ReadingDataFormat = ToSigned(parseInt(RawReading, 16), 8).toString(16);
            UNR =  ToSigned(parseInt(node.getAttribute("UNR"), 16), 8).toString(16);
            UC =   ToSigned(parseInt(node.getAttribute("UC"), 16), 8).toString(16);
            UNC =  ToSigned(parseInt(node.getAttribute("UNC"), 16), 8).toString(16);
            LNC =  ToSigned(parseInt(node.getAttribute("LNC"), 16), 8).toString(16);
            LC =   ToSigned(parseInt(node.getAttribute("LC"), 16), 8).toString(16);
            LNR =  ToSigned(parseInt(node.getAttribute("LNR"), 16), 8).toString(16);
        }
        else
        {
            ReadingDataFormat = RawReading;*/
            UNR = node.getAttribute("UNR");
            UC = node.getAttribute("UC");
            UNC = node.getAttribute("UNC");
            LNC = node.getAttribute("LNC");
            LC = node.getAttribute("LC");
            LNR = node.getAttribute("LNR");
        //}
        //var AfterFuncSensorReading = parseFloat( SensorFunc(ReadingDataFormat, node.getAttribute("M"), node.getAttribute("B"), node.getAttribute("RB")), 10)
        //var AfterFuncSensorUNR = parseFloat( SensorFunc(UNR, node.getAttribute("M"), node.getAttribute("B"), node.getAttribute("RB")), 10);
        //var AfterFuncSensorUC  = parseFloat( SensorFunc(UC, node.getAttribute("M"), node.getAttribute("B"), node.getAttribute("RB")), 10) ;
        //var AfterFuncSensorUNC = parseFloat( SensorFunc(UNC, node.getAttribute("M"), node.getAttribute("B"), node.getAttribute("RB")), 10);
        //var AfterFuncSensorLNC = parseFloat( SensorFunc(LNC, node.getAttribute("M"), node.getAttribute("B"), node.getAttribute("RB")), 10);
        //var AfterFuncSensorLC  = parseFloat( SensorFunc(LC, node.getAttribute("M"), node.getAttribute("B"), node.getAttribute("RB")), 10) ;
        //var AfterFuncSensorLNR = parseFloat( SensorFunc(LNR, node.getAttribute("M"), node.getAttribute("B"), node.getAttribute("RB")), 10);

        // Ignore on reading
        if(!(Option & 0x40))
        {
            if ( typeof(SensorTableArray) == 'object' )
            {
                //SensorTableArray[Idx][1] = "Not Readable";
                SensorTableArray[Idx][1] = lang.LANG_SENSOR_STATUS_NOT_AVAILABLE;
                SensorTableArray[Idx][2] = lang.LANG_SENSOR_READING_NA;
                SensorTableArray[Idx][9] = "bgcolor=white";
            }
        }
        else
        {
            //if(SFormula == "00")
            //{
                var SFunction = function(val)
                {
                    "use strict";
                    return parseInt( val*100, 10)/100;
                }
                if(RawReading == /*'0'*/ '00' && Option != 0x00 && SensorType == '04')
                {
                    var SensorReading = 0;
                    if ( typeof(SensorTableArray) == 'object' )
                        SensorTableArray[Idx][2] = "0 " + Unit;
                    SensorFormula.NeedCompare = 1;
                    SensorFormula.SensorReading = SensorReading;
                }
                //else if((node.getAttribute("READING") == '      ') || (RawReading == /*'0'*/ '00'))
                else if(RawReading == null)
                {
                    if ( typeof(SensorTableArray) == 'object' ){

                        //SensorTableArray[Idx][1] = "Not Readable";
                        SensorTableArray[Idx][1] = lang.LANG_SENSOR_STATUS_NOT_AVAILABLE;
                        SensorTableArray[Idx][2] = lang.LANG_SENSOR_READING_NA;
                    }
                }
                /*  linear_reading  */
                else
                {
                    //var SensorReading = parseInt( AfterFuncSensorReading*100, 10)/100;
                    var SensorReading = node.getAttribute("HUMAN_READING");
                    if ( typeof(SensorTableArray) == 'object' )
                        SensorTableArray[Idx][2] = SensorReading + " " + Unit;
                    SensorFormula.NeedCompare = 1;
                    SensorFormula.SensorReading = SensorReading;
                }
            //}
            // linear function = 1/x
            /*else if(SFormula == "07")
            {
                var SFunction = function(val)
                {
                     return parseInt(100/val, 10)/100;
                }

                if(RawReading == '00' && Option != 0x00 && SensorType == '04')
                {
                    SensorFormula.SensorReading = 0;
                    if ( typeof(SensorTableArray) == 'object' )
                        SensorTableArray[Idx][2] = "0 " + Unit;
                    SensorFormula.NeedCompare = 1;
                }
                else if((node.getAttribute("READING") == '      ') || (RawReading == 'ff') || (RawReading == '00'))
                {
                    if ( typeof(SensorTableArray) == 'object' )
                        SensorTableArray[Idx][2] = "Not Present!";
                }
                //  linear_reading
                else
                {
                    var SensorReading = parseInt( 100/AfterFuncSensorReading, 10)/100;
                    if ( typeof(SensorTableArray) == 'object' )
                        SensorTableArray[Idx][2] = SensorReading + " " + Unit;
                    SensorFormula.NeedCompare = 1;
                    SensorFormula.SensorReading = SensorReading;
                }
            }
            // linear function = sqr(x)
            else if(SFormula == "08")
            {
                var SFunction = function(val)
                {
                     return parseInt(parseFloat( Math.pow(val,2), 10) * 100, 10) / 100;
                }

                if(RawReading == '00' && Option != 0x00 && SensorType == '04')
                {
                    SensorFormula.SensorReading = 0;
                    if ( typeof(SensorTableArray) == 'object' )
                        SensorTableArray[Idx][2] = "0 " + Unit;
                    SensorFormula.NeedCompare = 1;
                }
                else if((node.getAttribute("READING") == '      ') || (RawReading == 'ff') || (RawReading == '00'))
                {
                    if ( typeof(SensorTableArray) == 'object' )
                        SensorTableArray[Idx][2] = "Not Present!";
                }
                //  linear_reading
                else
                {
                    var SensorReading = parseInt(parseFloat( Math.pow(AfterFuncSensorReading,2), 10) * 100, 10) / 100;
                    if ( typeof(SensorTableArray) == 'object' )
                        SensorTableArray[Idx][2] = SensorReading + " " + Unit;
                    SensorFormula.SensorReading = SensorReading;
                    SensorFormula.NeedCompare = 1;
                }
            }*/
            SensorFormula.SensorUNR = UNR; //SFunction( AfterFuncSensorUNR);
            SensorFormula.SensorUC  = UC; //SFunction( AfterFuncSensorUC);
            SensorFormula.SensorUNC = UNC; //SFunction( AfterFuncSensorUNC);
            SensorFormula.SensorLNC = LNC; //SFunction( AfterFuncSensorLNC);
            SensorFormula.SensorLC  = LC; //SFunction( AfterFuncSensorLC);
            SensorFormula.SensorLNR = LNR; //SFunction( AfterFuncSensorLNR);
            if ( typeof(SensorTableArray) == 'object' )
            {
                SensorTableArray[Idx][8] = SensorFormula.SensorUNR;
                SensorTableArray[Idx][7] = SensorFormula.SensorUC;
                SensorTableArray[Idx][6] = SensorFormula.SensorUNC;
                SensorTableArray[Idx][5] = SensorFormula.SensorLNC;
                SensorTableArray[Idx][4] = SensorFormula.SensorLC;
                SensorTableArray[Idx][3] = SensorFormula.SensorLNR;
            }
        }
}
function isIpv6Addr(ip)
{
    "use strict";
    /*
        For an IPv6 address "2001:240:629::6".
        On IE and Firefox, when open the URI, window.location.hostname will return "2001:240:629::6".
        But Safari and Chrome returns "[2001:240:629::6]".
    */

    if ( ip.match(/^\[.*\]$/) != null )
        return true;

    return ( ip.indexOf(':') >= 2 )
}

function resetSessionExpired() {
    "use strict";
    var auth = ReadSessionStorage("Authenticated");
    if(auth != null && parseInt(auth) == 1) {
        g_callback = "onSessionExpiredReset";
        requestSessionExpired(true, onSessionExpiredReset);
    }
}

function checkSessionExpired() {
    "use strict";
    g_callback = "onSessionExpiredCheck";
    requestSessionExpired(false, onSessionExpiredCheck);
}

//Get session timeout expired,
//    if exipired > 0, go reset timeout.
function requestSessionExpired(reset_expired, callback)
{
    "use strict";
    var url = '/cgi/check_session_timeout.cgi';
    //check_session_timeout.cgi will reset timer of session-timeout when not expired.
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <SESSIONINFO>\n";
    if(reset_expired) {
        ajax_data += "        <RESET>1</RESET>\n";
    }
    ajax_data += "    </SESSIONINFO>\n";
    ajax_data += "</IPMI>\n";

    var allowRequest;
    var browser_is = GetBrowserInfo();
    if(browser_is == "IE") {
        if(g_callback == "onSessionExpiredCheck") {
            if(gSessionCheckPendingCount < 1) {
                gSessionCheckPendingCount = 1;
                allowRequest = true;
            }
        }
        else if(g_callback == "onSessionExpiredReset") {
            if(gSessionResetPendingCount < 1) {
                gSessionResetPendingCount = 1;
                allowRequest = true;
            }
        }
    }
    else {
        if(callback.name == "onSessionExpiredCheck") {
            if(gSessionCheckPendingCount < 1) {
                gSessionCheckPendingCount = 1;
                allowRequest = true;
            }
        }
        else if(callback.name == "onSessionExpiredReset") {
            if(gSessionResetPendingCount < 1) {
                gSessionResetPendingCount = 1;
                allowRequest = true;
            }
        }
    }
    if(allowRequest == true) {
        var myAjax = new Ajax.Request(url,
                                      {method: 'post',
                                       contentType: "text/xml",
                                       xml_data: ajax_data,
                                       timeout: 2000,
                                       onComplete: callback}
                                     );
    }
}

function onSessionExpiredReset(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
           return;
        }

        var IPMI = xmldoc.documentElement;//point to IPMI
        CreateSessionStorage("SESSIONTIMEOUT", GetXMLNodeValue(xmldoc, "TOUTTIME"));

        var expire = parseInt(GetXMLNodeValue(xmldoc, "EXPIRE"), 10);
        if(expire < 0) {
            gSessionTimeout = -1; // disable session timeout
        } else {
            gSessionTimeout = expire * 1000 + 4000;
        }
        CreateSessionStorage("gSESSIONTIMEOUT", gSessionTimeout);
        launchSessionExpiredTimer();
        gSessionResetPendingCount = 0;
    }
}


function onSessionExpiredCheck(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
           //SessionTimeout();
           return;
        }
        var IPMI = xmldoc.documentElement;//point to IPMI
        CreateSessionStorage("SESSIONTIMEOUT", GetXMLNodeValue(xmldoc, "TOUTTIME"));

        RemoveSessionStorage("gSESSIONTIMEOUT");
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if(result == "SESSION_INVALID") {
            //When session timeout, server will go logout procedure,
            // then session id will be invalid on client side, so do not call logout.cgi
            // just call login directly.
            clearSessionInfo();
            alert(lang.LANG_CONFIG_WEBSESSION_EXPIRED, {onClose: function(){
                location.href = "/";
            }});
        }
        else {
            //session alive, keep continue.
            var expire = parseInt(GetXMLNodeValue(xmldoc, "EXPIRE"), 10);
            if(expire < 0) {
                gSessionTimeout = -1; // disable session timeout
            } else {
                gSessionTimeout = expire * 1000 + 4000;
            }
            CreateSessionStorage("gSESSIONTIMEOUT", gSessionTimeout);
        }
        gSessionCheckPendingCount = 0;
    }
}

function resetHeartbeat()
{
    "use strict";
    //console.log("resetHeartbeat in " + g_UtilsTimestamp);
    top.frames.topmenu.mHeartbeatTimer.restart();
}

/********************************************************
This event listener only for safari,
There is timer latency issue on Safari when screen blanks,
so we do not prefereed heartbeat process in Safari.
we use window/tab close event listener to fix this issue.
********************************************************/
function initSafariChecker() {
    "use strict";
    var CountKey = "SESSION_COUNT";
    var count = ReadSessionStorage(CountKey);
    if(count == null) {
        CreateSessionStorage(CountKey, "0");
        count = 0;
    }
    else {
        count = parseInt(count);
        count += 1;
        CreateSessionStorage(CountKey, count);
    }

    window.onbeforeunload = function (event) {
        "use strict";
        var count = null;
        var CountKey = "SESSION_COUNT";
        count = ReadSessionStorage(CountKey);
        if(count != null) {
            count = parseInt(count);
            count = count - 1;
            if(count >= 0) {
                CreateSessionStorage(CountKey, "" + count);
            }
            else {
                RemoveSessionStorage(CountKey);
                count = null;
            }
        }
        if(count == null) {
            goLogout();
        }
    };
}

function clearSafariSessionCounter() {
    "use strict";
    RemoveSessionStorage("SESSION_COUNT");
}

//--- for auto logout
function removeChilds(node) {
    "use strict";
    while (node != null && node.firstChild != null) {
        node.removeChild(node.firstChild);
    }
}

function GeneGenericRequestXML() {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "</IPMI>\n";
    return result;
}

function GetXMLNodeValue(xml, tag) {
    "use strict";
    var result = null;
    if(xml != null && tag != null) {
        var root = xml.documentElement;
        if(root != null) {
            var nodes = root.getElementsByTagName(tag);
            if(nodes != null && nodes.length > 0) {
                var node = nodes[0].firstChild;
                if(node != null) {
                    result = node.nodeValue;
                }
            }
        }
    }
    return result;
}

function ClearInvalidSession()
{
    "use strict";
    var url = '/cgi/clear_session.cgi';
    var myAjax = new Ajax.Request(
           url,
           {
             method: 'post',
             contentType: "text/xml",
             xml_data: "",
             onComplete: responseClearInvalidSession
           });
}

function PageLogoutNoPriv()
{
    "use strict";
    goLogout();
}

function getCSRFToken()
{
    "use strict";
    var token = "";
    if(top.frames.topmenu && top.frames.topmenu.CSRF_TOKEN)
        token = top.frames.topmenu.CSRF_TOKEN;
    return token;
}

function updateToken(xml_root_node)
{
    "use strict";
    if(xml_root_node != null) {
        var token = xml_root_node.getElementsByTagName("TOKEN");
        if(token != null && token.length > 0) {
            var node = token[0].firstChild;
            if(node != null) {
                var result = node.nodeValue;
                if(node.nodeValue != null && node.nodeValue.length > 0) {
                    top.frames.topmenu.CSRF_TOKEN = node.nodeValue;
                }
            }
        }
    }
}

function onLogout(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        clearSessionInfo();
        location.href = "/";
    }
}

function displayTime() {
    "use strict";
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}

//erase cookie about session info
function clearSessionInfo() {
    "use strict";
    clearSafariSessionCounter();
    RemoveSessionStorage("Authenticated");
    RemoveSessionStorage("SESSIONTIMEOUT");
    RemoveSessionStorage("gSESSIONTIMEOUT");
    RemoveSessionStorage("KCSMode");
    RemoveSessionStorage("mainpage");
    RemoveSessionStorage("subpage");

    // clean timer
    if(typeof top.frames.topmenu != 'undefined') {
        top.frames.topmenu.mHeartbeatTimer.stop();
    }
    if(typeof top.frames.topmenu != 'undefined' &&
       top.frames.topmenu.gSessionExpiredTimer) {
        clearInterval(top.frames.topmenu.gSessionExpiredTimer);
        top.frames.topmenu.gSessionExpiredTimer = null;
    }
}

function readCSRFToken(xmldoc)
{
    "use strict";
    var ret = null;
    if(xmldoc != null) {
        var token = GetXMLNodeValue(xmldoc, "TOKEN");
        if(token != null && token.length > 0) {
            ret = token;
        }
    }
    return ret;
}

function CheckInvalidResult(xmldoc) {
    "use strict";
    var result = GetXMLNodeValue(xmldoc, "RESULT");
    var token = "";
    if (result == "CGI_BUSY") {
        alert("Server is busy");
        return -1;
    }

    if (result == "SESSION_INVALID") {
        ClearInvalidSession();
        clearSessionInfo();
        return -1;
    }
    if (result == "PRIVILEGE_INVALID") {
        alert(lang.LANG_COMMON_CANNOT_MODIFY, {onClose: onPrivilegeFailedClose});
        return -1;
    }
    if (result == "TOKEN_INVALID") {
        //alert(lang.LANG_COMMON_AUTH_FAIL_MSG);
        goLogout();
        return -1;
    }

    token = readCSRFToken(xmldoc);
    if(token != null && token.length > 0) {
        top.frames.topmenu.CSRF_TOKEN = token;
    }
    return 0;
}

// Load custom strings
function loadCustomStrings(callback) {
    "use strict";
    var custom_obj;
    try {
        var url = '/res/customize.json';
        var myAjax = new Ajax.Request(
            url, {asynchronous: true, method: 'get', onSuccess: function(transport) {
                custom_obj;
                try {
                    custom_obj = transport.responseText.evalJSON(true);
                    if ('strings' in custom_obj) {
                        for (var key in custom_obj.strings) {
                            if (key in lang) {
                                lang[key] = custom_obj.strings[key][lang_setting];
                                //console.log(key + ": " + lang[key]);
                            } else {
                                console.log('Invalid key in customization ' + url + ': ' + key);
                            }
                        }
                    }

                } catch (e2) {
                    console.log("Cannot read/parse customizied strings " + url + ": " + e2);
                }
                callback(custom_obj);
            }
        });
    } catch (e) {
        console.log("Cannot read/parse customizied strings");
        console.log(e);
    }
}

function GetRMMKeyStatus(Callbackfunc) {
    "use strict";
    var ajax_url = '../cgi/getrmmstatus.cgi';
    var ajax_data = "";
          ajax_data += "<?xml version=\"1.0\"?>\n";
          ajax_data += "<IPMI>\n";
          ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
          ajax_data += "</IPMI>\n";

    var ajax_req = new Ajax.Request(
           ajax_url,
           { method: 'POST',
              contentType: "text/xml",
              xml_data: ajax_data,
              onComplete: GetRMMKeyStatusHandler }
        );

    function GetRMMKeyStatusHandler(originalRequest) {
        "use strict";
        if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200){
            //alert(originalRequest.responseText);
            var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
            var xml_obj=GetResponseXML(response);
            if(xml_obj == null) {
                SessionTimeout();
                return;
            }

            //check session & privilege.
            if (CheckInvalidResult(xml_obj) < 0) {
                return;
            }
            var IPMIRoot = xml_obj.documentElement;
            var RMM_INFO=IPMIRoot.getElementsByTagName('RMM_INFO');
            var RMM=RMM_INFO[0].getElementsByTagName('RMM');
            var rmm_status= RMM[0].getAttribute('STATUS');
            if (typeof (Callbackfunc) == 'function' ) {
                Callbackfunc(rmm_status);
            }
        }
    }
}


function getSwlStatus(Callbackfunc)
{
    "use strict";
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
            onComplete: getSwlStatusHandler}//register callback function
            );

    function getSwlStatusHandler(originalRequest)
    {
        "use strict";
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

            var swl_type = GetXMLNodeValue(xml_obj, "SWL_TYPE");
            var swl_status = GetXMLNodeValue(xml_obj, "SWL_STATUS");
            if (typeof (Callbackfunc) == 'function' ) {
                Callbackfunc(swl_type, swl_status);
            }
        }
    }
}

function GetBrowserInfo() {
    "use strict";
    var result = "";
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if(isIE) {
        result = "IE";
    }
    else {
        result = "NonIE";
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') != -1) {
            if (ua.indexOf('chrome') > -1) {
                result = "chrome";
            } else {
                result = "safari";
            }
        }
    }
    return result;
}
