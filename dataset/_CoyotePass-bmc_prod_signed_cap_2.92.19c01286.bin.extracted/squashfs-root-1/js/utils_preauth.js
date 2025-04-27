"use strict";
document.writeln('<script src="/preauth/js/prototype.js"></script>');
document.writeln('<script src="/preauth/js/flot/jquery.min.js"></script>');
document.writeln('<link rel="stylesheet" href="/preauth/css/jquery-ui/jquery-ui.min.css">');
document.writeln('<script src="/preauth/js/flot/jquery-ui.min.js"></script>');

var lang_setting;
var session_timeout_reason;

function Trim(str)
{
    "use strict";
    return str.replace(/^\s+|\s+$/g,"");
}

lang_setting = ReadSessionStorage("language");
if (lang_setting == null)
{
    CreateSessionStorage("langSetFlag","0");
    CreateSessionStorage("language","English");
    lang_setting = "English";
} else {
    if(lang_setting == "English") {
        lang_setting = "English";
    } else {
        lang_setting = "S_Chinese";
    }
}
document.write("<script type=\"text/javascript\", src = \"/preauth/js/lang/" + lang_setting + "/lang_str.js\"><\/script>");


// save original alert
window.nativeAlert = window.alert;

// used for open many dialog boxes at the same time
var global_dynamic_id = 0;

// replace alert with function{}
window.alert = function(msg, params) {
    "use strict";
    var myid = global_dynamic_id++;
    var mydialog = document.createElement("div");
    var myclass = (params && params.dialogClass ? params.dialogClass : 'ui-dialog');
    mydialog.setAttribute("id", "dynamic_dialog" + myid);
    if (params && params.type == "pre") {
        mydialog.style.whiteSpace = "pre";
    }
    mydialog.title = params && params.title ? params.title : lang_preauth.LANGPA_COMMON_CAUTION;
    mydialog.textContent = msg;
    document.body.appendChild(mydialog);

    jQuery("#dynamic_dialog" + myid).dialog({
        autoOpen: false,
        modal: true, // other items on the page will be disabled
        show: { effect: "fold", duration: 600 },
        hide: { effect: "fold", duration: 600 },
        dialogClass: myclass,
        close: function( event, ui ) {
            "use strict";
            if(params && params.onClose) params.onClose(params.onCloseParams);
            jQuery("#dynamic_dialog" + myid).dialog("destroy");
            mydialog.parentNode.removeChild(mydialog);
        },
        buttons: {} // init it, don't remove
    });
    jQuery("#dynamic_dialog" + myid).dialog("open");
};

/* Handle  cookies API */
function CreateCookie(name, value)
{
    "use strict";
    top.document.cookie = "__Host-"+name+"="+value+"; path=/; secure; SameSite=strict";
}

/* Clear Session Cookie */
function getcookieval(offset)
{
    "use strict";
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function ReadCookie(name) // getcookie(name)
{
    "use strict";
    var arg = "__Host-" + name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen)
    {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return getcookieval(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

function CreateSessionStorage(name, value)
{
    "use strict";
    sessionStorage.setItem("__Host-"+name, value);
}

function ReadSessionStorage(name) // getcookie(name)
{
    "use strict";
    var value = sessionStorage.getItem("__Host-"+name);
    return value;
}

function RemoveSessionStorage(name) // getcookie(name)
{
    "use strict";
    sessionStorage.removeItem("__Host-"+name);
}

function EraseCookie(name) // deletecookie(name)
{
    "use strict";
    var exp = new Date();
    exp.setTime(exp.getTime() - 1); // expire immediately
    var cval = ReadCookie(name);
    if(cval != null) document.cookie = "__Host-" + name + "=" + cval + "; expires=" + exp.toGMTString() + "; path=/;secure; SameSite=strict";
    return;
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

function goLogout(onCompleteCallback) {
    "use strict";
    var csrftoken = "";
    var url = "/cgi/logout.cgi";
    var ajax_data = "";

    if(top.frames.topmenu && top.frames.topmenu.CSRF_TOKEN)
        csrftoken = top.frames.topmenu.CSRF_TOKEN;
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + csrftoken + "</TOKEN>\n";
    ajax_data += "</IPMI>\n";

    //clearSafariSessionCounter();
    var callback = onCompleteCallback ? onCompleteCallback : onLogout;
    //console.log("goLogout request request:" + url);
    //console.log("goLogout request data:\n" + ajax_data);
    //for logout.cgi, it should apply method "GET"
    var myAjax = new Ajax.Request(url,
                                  {method: 'GET',
                                   contentType: "text/xml",
                                   xml_data: ajax_data,
                                   onComplete: callback
                                  });
}

function onLoginFailedClose()
{
    "use strict";
    session_timeout_reason = 0;
    location.href = "/";
}

/*handle seesion timoue API */
function SessionTimeout()
{
    "use strict";
    RemoveSessionStorage("currentUID");
    RemoveSessionStorage("Authenticated");
    if(typeof SessionTimeout.record == 'undefined')
    {
        SessionTimeout.record = 0;
    }

    if(SessionTimeout.record == 0)
    {
        ++SessionTimeout.record;

        /* Add your session timeout reason into switch case */
        switch (session_timeout_reason)
        {
            case 0: /* reason 0: BMC returns a null XML file */
                //alert(lang_preauth.LANGPA_NULLXML_SESSION_TIMEOUT, {onClose: onLoginFailedClose});
                break;
            case 1: /* reason 1: Generic session timeout reason */
                // alert(lang_preauth.LANGPA_COMMON_SESSION_TIMEOUT, {onClose: onLoginFailedClose});
                break;
            case 2: /* reason 2: BMC block-out */
                alert(lang_preauth.LANGPA_COMMON_SESSION_BLOCKOUT, {onClose: onLoginFailedClose});
                break;
            case 3: /* reason 2: BMC block-out */
                alert(lang_preauth.LANGPA_COMMON_SESSION_OVERNUM, {onClose: onLoginFailedClose});
                break;
            case 4: /* reason 4: BMC authentication fail */
                alert(lang_preauth.LANGPA_LOGIN_SESSION_INVALID, {onClose: onLoginFailedClose});
                break;
            case 5: /* reason 5: no privileges to login the web server */
                // logout first to kill the session.
                goLogout(onLoginNoPriv);
                break;
            default:
                //alert(lang_preauth.LANGPA_COMMON_SESSION_TIMEOUT, {onClose: onLoginFailedClose});
                break;
        }
    }
}

function onLoginNoPriv()
{
    "use strict";
    alert(lang_preauth.LANGPA_LOGIN_SESSION_NO_PRIV, {onClose: function() {
        onLoginFailedClose();
    }});
}
