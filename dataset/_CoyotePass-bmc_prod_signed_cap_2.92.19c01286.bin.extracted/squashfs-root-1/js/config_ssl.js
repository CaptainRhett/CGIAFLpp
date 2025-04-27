"use strict";
/* Configuration -- SSL Certification setting */

var lang;
var keyform;
var keyuntil;
var sslcrt;
var privkey;
var btn;
var exists_cert=false;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/upload_ssl_certificate_hlp.html";
    document.getElementById("ButtonUpload").value = lang.LANG_CONFIG_SSL_UPLOAD;

    keyform=document.getElementById("validfrom");
    keyuntil=document.getElementById("validuntil");
    sslcrt=document.getElementById("sslcrt_file");
    privkey=document.getElementById("privkey_file");
    btn=document.getElementById("ButtonUpload");
    sslcrt.setAttribute('NAME', '/tmp/cert.pem');
    privkey.setAttribute('NAME', '/tmp/key.pem');

    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);

    sslcrt.onchange = sslcrt_Typecheck;
    privkey.onchange = privkey_Typecheck;

    btn.onclick = btnupload;
}

function OutputString() {
    "use strict";
    document.getElementById("ssl_caption_div").textContent = lang.LANG_CONFIG_SSL_CAPTION;
    document.getElementById("ssl_form_span").textContent = lang.LANG_CONFIG_SSL_FORM;
    document.getElementById("validfrom").textContent = lang.LANG_CONFIG_SSL_NONE;
    document.getElementById("ssl_until_span").textContent = lang.LANG_CONFIG_SSL_UNTIL;
    document.getElementById("validuntil").textContent = lang.LANG_CONFIG_SSL_NONE;
    document.getElementById("newsslcert_span").textContent = lang.LANG_CONFIG_SSL_NEWSSLCERT;
    document.getElementById("newprikey_span").textContent = lang.LANG_CONFIG_SSL_NEWPRIKEY;
}

function PrivilegeCallBack(Privilege)
{
    if (Privilege == '04') {
        SSLReading();
    }
    else if(Privilege == '03' || Privilege == '02') {
        SSLReading();
        btn.disabled = true;
        // alert(lang.LANG_CONFIG_SSL_NOPRIVI);
    }
    else {
        location.href = SubMainPage;
    }
}

function sslcrt_Typecheck() {
    "use strict";
    sslcrt = document.getElementById("sslcrt_file");
    var sslcrtfile = sslcrt.files;

    if(sslcrtfile.length == 0)
    {
        alert(lang.LANG_CONFIG_SSL_SEL_CRTFILE);
        sslcrt.focus();
        return;
    }

    var validExts = new Array(".pem", ".cer", ".crt");
    var fileExt = sslcrt.value;

    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
        alert(lang.LANG_CONFIG_SSL_CRTPEM);
        sslcrt.focus();
        sslcrt.value = null;
        return;
    }
}

function privkey_Typecheck() {
    "use strict";
    privkey = document.getElementById("privkey_file");
    var privkeyfile = privkey.files;

    if(privkeyfile.length == 0)
    {
        alert(lang.LANG_CONFIG_SSL_SEL_PRIKEYFILE);
        privkey.focus();
        return;
    }

    var privkeyvaild = new String(privkey.value);
    if(!CheckExtName(privkeyvaild, ".pem")) {
        alert(lang.LANG_CONFIG_SSL_PRIKEYPEM);
        privkey.focus();
        privkey.value = null;
        return;
    }
}

function SSLReading()
{
    "use strict";
    var url = '/cgi/getsslstatus.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data= GeneGenericRequestXML();
    var myAjax = new Ajax.Request(
            url,
            {method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters:pars,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: SSLReadingResult}//reigister callback function
            );
}

function SSLReadingResult(originalRequest)
{
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var root=xmldoc.documentElement;
        var sslinfo=root.getElementsByTagName('SSL_INFO');
        var sslstatus= sslinfo[0].getElementsByTagName('STATUS');
        var validform = sslstatus[0].getAttribute("VALID_FROM");
        var validuntil = sslstatus[0].getAttribute("VALID_UNTIL");
        var crtflag = parseInt(sslstatus[0].getAttribute("CERT_EXIST"),10);
        var validformstatus=lang.LANG_CONFIG_SSL_NOAVAILBALE;
        var validuntilstatus=lang.LANG_CONFIG_SSL_NOAVAILBALE;

        if(crtflag != 0) {
            exists_cert = true;
        }

        if(validform != "Not Available") {
            validformstatus = validform;
        }

        if(validuntil != "Not Available") {
            validuntilstatus = validuntil;
        }

        keyform.textContent = validformstatus;
        keyuntil.textContent = validuntilstatus;
    }
}

function btnupload()
{
    "use strict";

    sslcrt = document.getElementById("sslcrt_file");
    var sslcrtfile = sslcrt.files;

    if(sslcrtfile.length == 0)
    {
        alert(lang.LANG_CONFIG_SSL_SEL_CRTFILE);
        sslcrt.focus();
        return;
    }

    privkey = document.getElementById("privkey_file");
    var privkeyfile = privkey.files;

    if(privkeyfile.length == 0)
    {
        alert(lang.LANG_CONFIG_SSL_SEL_PRIKEYFILE);
        privkey.focus();
        return;
    }

    if(exists_cert) {
        UtilsConfirm(lang.LANG_CONFIG_SSL_CRTEXIST, {onOk: uploadkey});
    } else {
        uploadkey();
    }
}

function uploadkey(){
    "use strict";
    btn.disabled = true;
    var form = document.forms[0];
    var token = getCSRFToken();
    var QueryString = "";
    if(token != null && token.length > 0) {
        QueryString = "?HTTP_TOKEN=" + getCSRFToken();
    }
    if(form.tagName=='FORM') {
       form.action = '/cgi/uploadsslkey.cgi' + QueryString;
       form.submit();
    }
}


