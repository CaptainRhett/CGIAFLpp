"use strict";
// Mouse mode: 1 - Absolute, 2 - Relative
var mouseMode = 0;
var lang;

var kvmEncrpytionObj;
//var key_mouseObj;
//var usbEncrpytionObj;
var portType = 3;//ref http://wiki.insyde.com/index.php?title=Insyde_BMC_Intel_Purley_VM_KCS_Design_Document
var cdPortObj,kvmsPortObj,cdsPortObj,usbsPortObj;
var kvmsPortInit, usbsPortInit
var kvmEncryVal, mouseEncryVal;
var kvmEncryValInit, mouseEncryValInit;
var saveKvmBtnObj,saveMouseBtnObj;
var kvmEncryflag, kvmPortflag;
var kvmPortErrflag = false;
var g_set_encry_port = false;
var g_save_disabled_by_priv = false;
var mouseModeInit;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_kvm_hlp.html";
    // Get multi-language string
    document.title = lang.LANG_MOUSE_TITLE;

    saveKvmBtnObj = document.getElementById("saveKvmBtn");
    saveKvmBtnObj.value = lang.LANG_MOUSE_SAVE;
    saveKvmBtnObj.addEventListener("click", doSaveKvm);

    saveMouseBtnObj = document.getElementById("saveMouseBtn");
    saveMouseBtnObj.value = lang.LANG_MOUSE_SAVE;
    saveMouseBtnObj.addEventListener("click", doSaveMouseMode);

    kvmEncrpytionObj = document.getElementById("kvmEncrpytion");
    //key_mouseObj = document.getElementById("key_mouse");
    //usbEncrpytionObj = document.getElementById("usbEncrpytion");

    //cdPortObj = document.getElementById("cd_port");

    kvmsPortObj = document.getElementById("kvm_sport");
    //cdsPortObj = document.getElementById("cd_sport");
    usbsPortObj = document.getElementById("usb_sport");

    // Set up the drop downs.
    var optind = 0;
    kvmEncrpytionObj.add(new Option('AES-128',1),window.ActiveXObject?optind++:null);
    kvmEncrpytionObj.add(new Option('AES-256',2),window.ActiveXObject?optind++:null);

    //optind = 0;
    //usbEncrpytionObj.add(new Option('Hard disk',0),window.ActiveXObject?optind++:null);
    //usbEncrpytionObj.add(new Option('Floppy',1),window.ActiveXObject?optind++:null);

    document.getElementById("absMouse").addEventListener("click", selAbsMouse);

    kvmEncrpytionObj.onclick = checkEncryCfg;
    //key_mouseObj.onclick = checkEncryCfg;

    kvmsPortObj.onchange = checkKvmPort;
    kvmsPortObj.addEventListener("keypress", validateNumeric);
    kvmsPortObj.addEventListener("keydown", validateNumeric);

    usbsPortObj.onchange = checkKvmPort;
    usbsPortObj.addEventListener("keypress", validateNumeric);
    usbsPortObj.addEventListener("keydown", validateNumeric);

    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("kvm_mouse_caption_div").textContent = lang.LANG_CONFIG_KVM_MOUSE_CAPTION;
    document.getElementById("kvm_mouse_sub_caption1_legend").textContent = lang.LANG_CONFIG_KVM_MOUSE_SUB_CAPTION1;
    document.getElementById("kvm_desc_p").textContent = lang.LANG_CONFIG_KVM_DESC;
    document.getElementById("kvm_ency_lbl").textContent = lang.LANG_CONFIG_KVM_ENCY;
    document.getElementById("kvm_usb_key_type_td").textContent = lang.LANG_CONFIG_KVM_USB_KEY_TYPE;
    document.getElementById("kvm_default_ports_span").textContent = lang.LANG_CONFIG_KVM_DEFAULT_PORTS;
    document.getElementById("kvm_cd_port_span").textContent = lang.LANG_CONFIG_KVM_CD_PORT;
    document.getElementById("kvm_sport_span").textContent = lang.LANG_CONFIG_KVM_SPORT;
    document.getElementById("kvm_cd_sport_span").textContent = lang.LANG_CONFIG_KVM_CD_SPORT;
    document.getElementById("kvm_usb_sport_span").textContent = lang.LANG_CONFIG_KVM_USB_SPORT;
    document.getElementById("sub_caption2_legend").textContent = lang.LANG_CONFIG_KVM_MOUSE_SUB_CAPTION2;
    document.getElementById("absolute_span").textContent = lang.LANG_MOUSE_SET_ABSOLUTE;
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if(Privilege == '04')
    {
        //full access
        getEncryptcfg();
        GetKvmPort();
        getMouseMode();
        g_save_disabled_by_priv = false;
        saveKvmBtnObj.disabled = g_save_disabled_by_priv;
        saveMouseBtnObj.disabled = g_save_disabled_by_priv;
        document.getElementById("absMouse").disabled = false;
    }
    else if(Privilege == '03' || Privilege == '02')
    {
        //read only
        //alert(lang.LANG_MOUSE_NOPRIV);
        getEncryptcfg();
        GetKvmPort();
        getMouseMode();
        g_save_disabled_by_priv = true;
        saveKvmBtnObj.disabled = g_save_disabled_by_priv;
        saveMouseBtnObj.disabled = g_save_disabled_by_priv;
    }
    else
    {
        //no access
        location.href = SubMainPage;
        return;
    }
}

function checkKvmPort() {
    "use strict";
    //check port nubmer range 0 < x < 65536 and space not allowed
    if((kvmsPortObj.value.length == 0 || !(/^\d+$/.test(kvmsPortObj.value)) || parseInt(kvmsPortObj.value) == 0 || kvmsPortObj.value > 65535) ||
            (usbsPortObj.value.length == 0 || !(/^\d+$/.test(usbsPortObj.value)) || parseInt(usbsPortObj.value) == 0 || usbsPortObj.value > 65535))
    {
        alert(lang.LANG_CONFIG_KVM_PORT_FAILURE);
        saveKvmBtnObj.disabled = true;
        kvmPortErrflag = true;
        return;
    }

    kvmPortErrflag = false;
    if((kvmsPortObj.value != kvmsPortInit) || (usbsPortObj.value != usbsPortInit) ) {
        kvmPortflag = true;
    } else {
        kvmPortflag = false;
    }

    if(kvmEncryflag || kvmPortflag)
        saveKvmBtnObj.disabled = g_save_disabled_by_priv;
    else
        saveKvmBtnObj.disabled = true;
}

function GetKvmPortHandler(originalRequest)
{
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        //alert("GetKvmPortHandler  \n" + originalRequest.responseText);
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
           <GET_KVM_PORT>
           <PORT_INFO KVM_PORT="7578" KVM_SEC_PORT="7582" CDROM_PORT="5120" CDROM_SEC_PORT="5124" USB_PORT="5123" USB_SEC_PORT="5127"/>
           </GET_KVM_PORT>
           </IPMI>
           */
        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;

        var getport=IPMIRoot.getElementsByTagName("GET_KVM_PORT");
        var portinfo;
        if(getport != null) {
            portinfo = getport[0].getElementsByTagName("PORT_INFO");
            var kvms=portinfo[0].getAttribute("KVM_SEC_PORT");
            var usbs=portinfo[0].getAttribute("USB_SEC_PORT");
            var cd=portinfo[0].getAttribute("CDROM_PORT");
            var cds=portinfo[0].getAttribute("CDROM_SEC_PORT");

            kvmsPortObj.value = kvms;
            //cdPortObj.value = cd;
            //cdsPortObj.value = cds;
            usbsPortObj.value = usbs;

            //keep value for init
            kvmsPortInit = kvms;
            usbsPortInit = usbs;

            //init button is gray out.
            saveKvmBtnObj.disabled = true;
        }
    }
}

function GetKvmPort() {
    "use strict";
    var ajax_url = '../cgi/nsportscfg.cgi';
    // <IPMI><PORT_INFO GET_PORT="3"/></IPMI>
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <PORT_INFO GET_PORT=\"" + portType +  "\"/>\n";
    ajax_data += "</IPMI>\n";
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {   method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: GetKvmPortHandler
            }//register callback function
            );
}

function GetEncryptcfgHandler(originalRequest)
{
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        //alert("GetEncryptcfgHandler: \n" + originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }

        //<?xml version="1.0"?>
        //<IPMI>
        //<GET_SEC_ENCRYPT>
        //    <ENCRYPTION_TYPE KVM_ENC="0" KEY_MOUSE_EN="OFF" VM_ENC_EN="OFF"/>
        //</GET_SEC_ENCRYPT>
        //</IPMI>

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;

        var getencrypt=IPMIRoot.getElementsByTagName("GET_SEC_ENCRYPT");
        var encrytype;
        if(getencrypt != null) {
            encrytype = getencrypt[0].getElementsByTagName("ENCRYPTION_TYPE");
            var kvmenc= parseInt(encrytype[0].getAttribute("KVM_ENC"));
            var keymouse= encrytype[0].getAttribute("KEY_MOUSE_EN");

            kvmEncrpytionObj.options.selectedIndex = kvmenc - 1;
            kvmEncryVal = kvmenc;
            mouseEncryVal = keymouse;

            //keep value for init
            kvmEncryValInit = kvmEncryVal;
            mouseEncryValInit = mouseEncryVal;

            //if(keymouse == "ON") {
            //    key_mouseObj.checked = true;
            //} else {
            //    key_mouseObj.checked = false;
            //}

            //kvmEncrpytionObj and key_mouseObj are mutual exclusive
            //if (kvmenc == 0) {
            //    key_mouseObj.disabled = false;
            //} else {
            //    key_mouseObj.checked = false;
            //    key_mouseObj.disabled = true;
            //}

            //init button is gray out.
            saveKvmBtnObj.disabled = true;
        }
    }
}

function getEncryptcfg() {
    "use strict";
    var ajax_url = '../cgi/secencryptcfg.cgi';
    var ajax_data = GeneGenericRequestXML();
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {   method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: GetEncryptcfgHandler}//register callback function
            );
}

function getMouseMode()
{
    "use strict";
    Loading(true);
    var url = '../cgi/get_mouse_mode.cgi';
    var ajax_data = GeneGenericRequestXML();
    //alert(ajax_data);
    var myAjax = new Ajax.Request(
            url,
            {  method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: getMouseModeHandler} );
}

function getMouseModeHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        //alert("getMouseModeHandler:  \n" + originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }

        //<?xml version="1.0"?>
        //<IPMI>
        //    <MOUSE>
        //        <STATE>2</STATE>
        //        <COMLETIONCODE>0</COMLETIONCODE>
        //    </MOUSE>
        //    <CGI_STATUS>0</CGI_STATUS>
        //</IPMI>

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var IPMIRoot = xmldoc.documentElement;

        var STATE = IPMIRoot.getElementsByTagName('STATE')[0].childNodes[0].nodeValue;
        var RTNCODE = IPMIRoot.getElementsByTagName('COMLETIONCODE')[0].childNodes[0].nodeValue;
        if(RTNCODE != '0') {
            alert(lang.LANG_MOUSE_STATUS_GET_ERROR);
            return;
        }

        mouseModeInit = STATE;
        // Mouse mode: 1 - Absolute
        if ( STATE == '1' ){
            document.getElementById("currentMode").innerText = lang.LANG_MOUSE_STATUS_ABS;
            selAbsMouse(); //interchanged selection on purpose
        }else{
            alert(lang.LANG_MOUSE_STATUS_UNKNOWN);
        }
    }

}

function selAbsMouse()
{
    "use strict";
    mouseMode = 1;
    document.getElementById("absMouse").checked = 1;
    if(mouseModeInit == mouseMode) {
        saveMouseBtnObj.disabled = true;
    } else {
        saveMouseBtnObj.disabled = g_save_disabled_by_priv;
    }
}

function SetKvmPortHandler(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        //alert("SetKvmPortHandler:  \n" + originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj=GetResponseXML(response);
        if(xml_obj == null)
        {
            SessionTimeout();
            return;
        }

        //<?xml version="1.0"?>
        //<IPMI>
        //<SET_NS_PORT>
        //    <PORT COMP_CODE="0"/>
        //</SET_NS_PORT>
        //</IPMI>

        // check session & privilege
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;

        var setPort = IPMIRoot.getElementsByTagName("SET_NS_PORT");
        var cmdRtn, port;
        if(setPort != null) {
            port = setPort[0].getElementsByTagName("PORT");
            if(port != null) {
                cmdRtn = port[0].getAttribute("COMP_CODE");
                if(cmdRtn == '0') {
                    if(g_set_encry_port==true) {
                        setEncryptcfg();
                    } else {
                        alert(lang.LANG_CONFIG_KVM_PORT_GOOD, {title: lang.LANG_GENERAL_SUCCESS});
                        GetKvmPort();
                    }
                } else {
                    alert(lang.LANG_CONFIG_KVM_PORT_FAIL);
                    return;
                }
            }
        }
    }
    //document.getElementById("saveKvmBtn").disabled = false;
}

function setKvmPort() {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/nsportscfg.cgi';
    /*
       <?xml version="1.0"?>
       <IPMI>
       <GET_KVM_PORT>
       <PORT_INFO KVM_PORT="7578" KVM_SEC_PORT="7582" CDROM_PORT="5120" CDROM_SEC_PORT="5124" USB_PORT="5123" USB_SEC_PORT="5127" FLAG="1"/>
       </GET_KVM_PORT>
       </IPMI>
       */
    var port_chk = 0;
    var flag;
    if(g_set_encry_port==true)
        flag = 1;
    else
        flag = 0;
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <PORT_INFO ";
    ajax_data += "KVM_SEC_PORT=\"" + kvmsPortObj.value + "\" ";
    //ajax_data += "CDROM_PORT=\"" + cdPortObj.value + "\" ";
    //ajax_data += "CDROM_SEC_PORT=\"" + cdsPortObj.value + "\" ";
    ajax_data += "USB_SEC_PORT=\"" + usbsPortObj.value +  "\" ";
    ajax_data += "FLAG=\"" + flag +  "\"/>\n";
    ajax_data += "</IPMI>\n";
    //alert(ajax_data);

    if (kvmsPortObj.value != usbsPortObj.value) {
        port_chk = 1;
        var ajax_req = new Ajax.Request(
                ajax_url,
                {   method: 'update',
                    contentType: "text/xml",
                    xml_data: ajax_data,
                    timeout: g_CGIRequestTimeout,
                    ontimeout: onCGIRequestTimeout,
                    onComplete: SetKvmPortHandler
                }//register callback function
                );
    }

    if (port_chk == 0) {
        alert(lang.LANG_CONFIG_KVM_SET_PORT_ERR);
        Loading(false);
    }

}

function SetEncryptHandler(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest!=null && originalRequest.readyState == 4 && originalRequest.status == 200) {
        //alert("SetEncryptHandler: \n" + originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj=GetResponseXML(response);
        if(xml_obj == null)
        {
            SessionTimeout();
            return;
        }
        //<?xml version="1.0"?>
        //<IPMI>
        //<SET_SEC_ENCRYPT>
        //    <ENCRYPTION_TYPE COMP_CODE="0"/>
        //</SET_SEC_ENCRYPT>
        //</IPMI>

        // check session & privilege
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;

        var setEncry = IPMIRoot.getElementsByTagName("SET_SEC_ENCRYPT");
        var cmdRtn,encryType;
        if(setEncry != null) {
            encryType = setEncry[0].getElementsByTagName("ENCRYPTION_TYPE");
            if(encryType != null) {
                cmdRtn = encryType[0].getAttribute("COMP_CODE");
                if(cmdRtn == '0') {
                    alert(lang.LANG_CONFIG_KVM_PORT_GOOD, {title: lang.LANG_GENERAL_SUCCESS});
                    getEncryptcfg();
                } else {
                    alert(lang.LANG_CONFIG_KVM_PORT_FAIL);
                    return;
                }
            }
        }
    }
    //alert(lang.LANG_CONFIG_KVM_PORT_GOOD, {title: lang.LANG_GENERAL_SUCCESS});
    //getEncryptcfg();
    //GetKvmPort();
}

// kvmEncrpytionObj and key_mouseObj is 'mutually exclusive'
function checkEncryCfg() {
    "use strict";
    if(kvmPortErrflag)
        return;
    // var kvmEncryVal, mouseEncryVal;
    if(kvmEncrpytionObj.options.selectedIndex == 0) {
        kvmEncryVal = '1';
        //key_mouseObj.checked = false;
        //key_mouseObj.disabled = true;
    }
    else if(kvmEncrpytionObj.options.selectedIndex == 1) {
        kvmEncryVal = '2';
        //key_mouseObj.checked = false;
        //key_mouseObj.disabled = true;
    }

    //key,mouse encryp
    //if(key_mouseObj.checked)
    //    mouseEncryVal = 'ON';
    //else
    //    mouseEncryVal = 'OFF';

    mouseEncryVal = 'OFF';

    //check kvmencry whether to changed
    if( (kvmEncrpytionObj.value != kvmEncryValInit) || (mouseEncryVal != mouseEncryValInit)) {
        kvmEncryflag = true;
    } else {
        kvmEncryflag = false;
    }

    if(kvmEncryflag || kvmPortflag)
        saveKvmBtnObj.disabled = g_save_disabled_by_priv;
    else
        saveKvmBtnObj.disabled = true;

}

function checkKVMFirst() {
    "use strict";
    Loading(true);
    var url = '/cgi/getwebuserstatus.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data= GeneGenericRequestXML();
    var myAjax = new Ajax.Request(url,
            {method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                parameters:pars,
                onComplete: checkKVMFirstHandler});//reigister callback function

}

function checkKVMFirstHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null){
            SessionTimeout();
            return;
        }
        var root = xmldoc.documentElement;
        var checkSession = root.getElementsByTagName('RESULT');
        if(checkSession.length != 0){
            var res = root.getElementsByTagName('RESULT')[0].childNodes[0].nodeValue;
            if(res == 'SESSION_INVALID'){
                ClearInvalidSession();
                return;
            }
        }
        var kvmUserInfo = root.getElementsByTagName("KVM_USER_INFO");
        if(kvmUserInfo.length) {
            var kvmuser = kvmUserInfo[0].getElementsByTagName('KVM');
            if(kvmuser.length) {
                var kvmCount = kvmuser[0].getAttribute("KVM_NUMBER");
                if (kvmCount>0) {
                    // failed
                    alert(lang.LANG_CONFIG_KVM_CLOSE_KVM_FIRST);
                    return;
                }
            }
        }
        // success
        if((kvmEncryflag==true) && (kvmPortflag==true)) {
            g_set_encry_port = true;
            setKvmPort();
            //alert('setKvmPort() first');
        } else if(kvmEncryflag==true) {
            g_set_encry_port = false;
            setEncryptcfg();
            //alert('setEncryptcfg()');
        } else if(kvmPortflag==true) {
            g_set_encry_port = false;
            setKvmPort();
            //alert('setKvmPort()');
        }
    }
}

function setEncryptcfg() {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/secencryptcfg.cgi';
    /*
       <?xml version="1.0"?>
       <IPMI>
       <GET_SEC_ENCRYPT>
       <ENCRYPTION_TYPE KVM_ENC="0" KEY_MOUSE_EN="OFF" VM_ENC_EN="OFF"/>
       </GET_SEC_ENCRYPT>
       </IPMI>
       */
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "<GET_SEC_ENCRYPT>\n";
    ajax_data += "    <ENCRYPTION_TYPE ";
    ajax_data += "KVM_ENC=\"" + kvmEncryVal + "\" ";
    ajax_data += "KEY_MOUSE_EN=\"" + mouseEncryVal + "\"/>\n";
    ajax_data += "</GET_SEC_ENCRYPT>\n";
    ajax_data += "</IPMI>\n";
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {   method: 'update',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: SetEncryptHandler
            }//register callback function
            );
}

function doSaveKvm() {
    "use strict";
    if(kvmPortErrflag) {
        alert(lang.LANG_CONFIG_KVM_PORT_FAILURE);
        return;
    } else {
        checkKVMFirst();
    }
}

function doSaveMouseMode()
{
    "use strict";
    UtilsConfirm(lang.LANG_MOUSE_CONFIRM, {
        onOk: function() {
            "use strict";
            Loading(true);
            /*<?xml version="1.0"?>
              <IPMI>
              <MOUSE>
              <STATE>1/2/3</STATE>
              </MOUSE>
              </IPMI>*/
            var url = '/cgi/set_mouse_mode.cgi';
            var ajax_data = '';
            ajax_data += "<?xml version=\"1.0\"?>\n";
            ajax_data += "<IPMI>\n";
            ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
            ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
            ajax_data += "    <MOUSE>\n";
            ajax_data += "        <STATE>" + mouseMode + "</STATE>\n";
            ajax_data += "    </MOUSE>\n";
            ajax_data += "</IPMI>\n";
            //alert(ajax_data);
            var myAjax = new Ajax.Request(
                    url,
                    {   method: 'update',
                        contentType: "text/xml",
                        xml_data: ajax_data,
                        timeout: g_CGIRequestTimeout,
                        ontimeout: onCGIRequestTimeout,
                        onComplete: doSaveMouseModeHandler } //reigister callback function
                    );
        }
    });
}

function doSaveMouseModeHandler(originalRequest)
{
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
           <MOUSE>
           <STATE>1</STATE>
           <COMPLETIONCODE>0</COMPLETIONCODE>
           </MOUSE>
           <CGI_STATUS>0</CGI_STATUS>
           </IPMI>
           */

        // check session & privilege
        if(CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;

        var cmdRtn = IPMIRoot.getElementsByTagName("COMPLETIONCODE")[0].childNodes[0].nodeValue;
        //alert(cmdRtn);
        if(cmdRtn == '0') {
            alert(lang.LANG_MOUSE_STATUS_SET_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS});
            getMouseMode();
        } else {
            alert(lang.LANG_MOUSE_STATUS_SET_ERROR);
            return;
        }
    }
}
