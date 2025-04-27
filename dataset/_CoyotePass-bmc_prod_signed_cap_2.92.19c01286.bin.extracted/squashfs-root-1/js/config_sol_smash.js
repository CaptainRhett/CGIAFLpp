"use strict";
/*
   global variables
*/
// Mouse mode: 1 - Absolute, 2 - Relative
var mouseMode = 0;
var channelCounter = 0;
var smash_ssh_port = 2;//ref http://wiki.insyde.com/
var solPortObj;
var portSetType;
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if(Privilege == '04')
    {
        //full access
        document.getElementById("saveSolBtn").disabled = false;
        document.getElementById("saveSSHBtn").disabled = false;
    }
    else if(Privilege == '03' || Privilege == '02')
    {
        //read only
        //alert(lang.LANG_MOUSE_NOPRIV);
        document.getElementById("saveSolBtn").disabled = true;
        document.getElementById("saveSSHBtn").disabled = true;
    }
    else
    {
        //no access
        location.href = SubMainPage;
        return;
    }
}

function OutputString() {
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_CONFIG_SUBMENU_SOL;
    document.getElementById("title_legend").textContent = lang.LANG_CONFIG_SOL_TITLE;
    document.getElementById("desc_legend").textContent = lang.LANG_CONFIG_SOL_DESC;
    document.getElementById("lanch_lbl").textContent = lang.LANG_CONFIG_SOL_LANCH;
    document.getElementById("enableSOL_lbl").textContent = lang.LANG_CONFIG_SOL_ENABLE;
    document.getElementById("port_title_legend").textContent = lang.LANG_CONFIG_SOL_SSH_PORT_TITLE;
    document.getElementById("sol_ssh_span").textContent = lang.LANG_CONFIG_SOL_SSH;
    document.getElementById("sol_port_lbl").textContent = lang.LANG_CONFIG_SOL_PORT;
}

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_solsmash_hlp.html";
    document.title = lang.LANG_MOUSE_TITLE;
    document.getElementById("saveSolBtn").value = lang.LANG_CONFIG_SOL_SAMASH_SAVEBTN;
    document.getElementById("saveSSHBtn").value = lang.LANG_CONFIG_SOL_SAMASH_SAVEBTN;
    solPortObj = document.getElementById("solsshport");

    document.getElementById("_lanChannel").addEventListener("change", onChannelChange);
    document.getElementById("saveSolBtn").addEventListener("click", SetSOLConfig);
    document.getElementById("saveSSHBtn").addEventListener("click", doSaveSSHPort);

    var obj = document.getElementById("solsshport");
    obj.addEventListener("keypress", validateNumeric);
    obj.addEventListener("keydown", validateNumeric);

    OutputString();
    GetSOLConfig(1);
    GetPort();
    CheckUserPrivilege(PrivilegeCallBack);
}

function geneXML(lan_count, enable, nic_interface) {
    "use strict";
    //<?xml version="1.0"?>
    //<IPMI>
    //    <TOTAL_NUMBER LAN="3"/>
    //    <SOL ENABLE="0"/>
    //    <LAN_IF INTERFACE="1" INTERFACE_EN="1"/>
    //</IPMI>
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <TOTAL_NUMBER LAN=\"" + lan_count + "\"/>\n";
    result += "    <SOL ENABLE=\"" + enable + "\"/>\n";
    result += "    <LAN_IF INTERFACE=\"" + nic_interface + "\"/>\n";
    result += "</IPMI>\n";
    return result;
}

function updateSOLInfo(root) {
    "use strict";
    if(root != null) {
        var numChannels = root.getElementsByTagName("TOTAL_NUMBER")[0].getAttribute("LAN");
        var selector = document.getElementById("_lanChannel");
        var nic_interface = root.getElementsByTagName("LAN_IF")[0].getAttribute("INTERFACE");
        var chnlsAvail = parseInt(root.getElementsByTagName("CHANNELS")[0].getAttribute("AVAIL_MASK"));
        if(selector != null) {
            for(idx = (selector.options.length - 1); idx >= 0; idx--) {
                selector.remove(idx);
            }
            for(var idx = 0; idx < numChannels; idx++) {
                var option = document.createElement("option");
                option.text = lang.LANG_CONF_LAN_CHANNEL_OPT_PREFIX + (idx + 1);
                option.value = "channel_" + idx;
                option.disabled = !(isNaN(chnlsAvail) || chnlsAvail & (1 << idx));
                selector.add(option);
            }
            selector.selectedIndex = (nic_interface - 1);
        }

        var enable = root.getElementsByTagName("SOL")[0].getAttribute("ENABLE");
        var objEnable = document.getElementById("_enableSOL");
        if(enable == "1") {
            objEnable.checked = true;
        } else {
            objEnable.checked = false;
        }
        if(nic_interface == 3)
            document.getElementById("enableSOL_lbl").textContent = lang.LANG_CONFIG_SOL_ENABLE_FOR_DEDICATE;
        else
            document.getElementById("enableSOL_lbl").textContent = lang.LANG_CONFIG_SOL_ENABLE;
        //console.log("sol lan_count:" + numChannels);
        //console.log("sol nic_interface:" + nic_interface);
        //console.log("sol enable:" + enable);
        // console.log("sol channels:" + chnlsAvail);
    }
}

function GetPortHandler(originalRequest)
{
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
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
           <GET_SSH_PORT>
           <PORT_INFO SMASH_PORT="55" SOL_PORT="66"/>
           </GET_SSH_PORT>
           </IPMI>
           */
        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            var result = GetXMLNodeValue(xmldoc, "RESULT");
            if (result == "FAIL") {
                alert(lang.LANG_NULLXML_SESSION_TIMEOUT);
            }
            return;
        }

        var IPMIRoot = xmldoc.documentElement;

        var portinfo=IPMIRoot.getElementsByTagName("PORT_INFO");
        var solport=portinfo[0].getAttribute("SOL_PORT");
        //alert(solport);
        solPortObj.value = solport;
    }
}

function GetPort() {
    "use strict";
    var ajax_url = '/cgi/nsportscfg.cgi';
    // <IPMI><PORT_INFO GET_PORT="2"/></IPMI>
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PORT_INFO GET_PORT=\"" + smash_ssh_port +  "\"/>\n";
    ajax_data += "</IPMI>\n";
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {   method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                onComplete: GetPortHandler
            }//register callback function
            );
}

function GetSOLConfigHandler(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var text = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);
        if(xml_obj == null) {
            SessionTimeout();
            return;
        } else {
            var root = xml_obj.documentElement;
            updateSOLInfo(root);
        }
    }
}

function GetSOLConfig(channel) {
    "use strict";
    var selector = document.getElementById("_lanChannel");
    var enable = 0;
    var ajax_url = '../cgi/get_sol_enable.cgi';
    var ajax_data = geneXML(selector.options.length, enable, channel);
    var ajax_req = new Ajax.Request(
            ajax_url, {
                method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                onComplete: GetSOLConfigHandler });
}

function SetSOLConfigHandler(response) {
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);
        if(xml_obj != null) {
            var result = GetXMLNodeValue(xml_obj, "RESULT");
            if(result == "OK") {
                alert(lang.LANG_SOL_CONFIG_SET_SUCCESS)
            }
            else {
                alert(lang.LANG_SOL_CONFIG_SET_FAIL);
            }
        }
    }
}

function SetSOLConfig() {
    "use strict";
    var objTemp = document.getElementById("_enableSOL");
    var selector = document.getElementById("_lanChannel");
    var enable = "0";
    var nic_interface = "1";

    if(objTemp.checked)
        enable = "1";
    else
        enable = "0";

    nic_interface = selector.selectedIndex + 1;

    //console.log("sol set nic_interface:" + nic_interface);
    //console.log("sol set enable:" + enable);

    var ajax_url = '../cgi/set_sol_enable.cgi';
    var ajax_data = geneXML(selector.options.length, enable, nic_interface);
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'PUT',
                contentType: "text/xml",
                xml_data: ajax_data,
                onComplete: SetSOLConfigHandler }//register callback function
            );
}

//function smashPortChange(val) {
    //alert("The input value has changed. The new value is: " + val);
    //alert('smash change');
//}

//function solPortChange(val) {
//alert('sol change');
//    var Str=document.getElementById(val).value;
//    alert(Str);
//}

function SetPortHandler(originalRequest) {
    "use strict";
    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200){
        Loading(false);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj=GetResponseXML(response);
        if(xml_obj == null)
        {
            SessionTimeout();
            return;
        }

        //<?xml version="1.0"?>
        //<IPMI>
        //    <SET_NS_PORT>
        //        <SMASH_PORT COMP_CODE="0"/>
        // or
        //        <SOL_PORT COMP_CODE="0"/>
        //    </SET_NS_PORT>
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
                    alert(lang.LANG_CONIFG_SOL_GOOD);
                } else {
                    alert(lang.LANG_CONIFG_SOL_FAIL);
                }
                document.getElementById("saveSSHBtn").disabled = false;
            }
        }
    }
}

function SetPort() {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/nsportscfg.cgi';
    /*
       <?xml version="1.0"?>
       <IPMI>
       <GET_SSH_PORT>
       <PORT_INFO SMASH_PORT="55" SOL_PORT="66"/>
       </GET_SSH_PORT>
       </IPMI>
       */
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <PORT_INFO ";
    ajax_data += "SOL_PORT=\"" + solPortObj.value +  "\"/>\n";
    ajax_data += "</IPMI>\n";
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {method: 'update', contentType: "text/xml",xml_data: ajax_data, onComplete: SetPortHandler}//register callback function
            );
}

function doSaveSSHPort()
{
    "use strict";
    if(solPortObj.value.length == 0 || !(/^\d+$/.test(solPortObj.value)) || parseInt(solPortObj.value) == 0 || solPortObj.value > 65535) {
        alert(lang.LANG_CONIFG_SOLPORT_INPUT_INVALID);
        return;
    } else {
        document.getElementById("saveSSHBtn").disabled = true;
        portSetType = 'sol';
        UtilsConfirm(lang.CONF_SERVICE_PORT_WARN, {
            onOk: SetPort,
            onClose: function() {
                "use strict";
                document.getElementById("saveSSHBtn").disabled = false;
            }
        });
    }
}

function onChannelChange() {
    "use strict";
    var selector = document.getElementById("_lanChannel");
    var index = 0;
    if(selector != null) {
        index = selector.selectedIndex + 1;//channel index was 1 base.
        //console.log("sol channel:" + index);
    }
    if(index > 0) {
        GetSOLConfig(index);
    }
}
