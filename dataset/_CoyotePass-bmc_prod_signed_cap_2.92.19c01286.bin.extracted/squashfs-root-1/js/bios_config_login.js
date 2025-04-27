"use strict";
var bios_config_oob = "../cgi/url_redirect.cgi?url_name=bios_config_oob";
var btnModifyPolicy;
var page_click;
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function setPasswd()
{
    "use strict";
    var pass = document.getElementById("password_pwd");
    var passwd = btoa(pass.value);
    Loading(true);
    var url = '/cgi/bios_config_login.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_param = '';
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <BIOSVARIABLE>\n";
    ajax_data += "        <BIOSPASSWD>" + passwd + "</BIOSPASSWD>\n";
    ajax_data += "    </BIOSVARIABLE>\n";
    ajax_data += "</IPMI>\n";
    var myAjax = new Ajax.Request(
                            url,
                            {method: 'post',
                            contentType: 'text/xml',
                            xml_data: ajax_data,
                            parameters:ajax_param,
                            timeout: 300000,
                            ontimeout: onCGIRequestTimeout,
                            onComplete:passwddone }//reigister callback function
                            );

}



function passwddone(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var page_click = localStorage.getItem("pageClick");
        location.href = bios_config_oob + '&' + 'page_click=' + page_click;
    }
}

function checkEnt(e)
{
    "use strict";
    var key = window.event ? e.keyCode : e.which;
    if(key == 13)
    {
        setPasswd();
    }
}

function PageInit()
{
    "use strict";
    OutputString();
    var btnModifyPolicy = document.getElementById("loginbtn");
    btnModifyPolicy.onclick = function() {
        setPasswd();
    }
    document.getElementById("password_pwd").addEventListener("keydown", checkEnt);
}

function OutputString() {
    "use strict";
    document.getElementById("password_td").textContent = lang.LANG_BIOS_LOGIN_PASSWORD;
}
