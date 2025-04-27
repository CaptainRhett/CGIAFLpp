"use strict";
var totalNIC = 0;
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_vlan_hlp.html";

    var objTemp = document.getElementById("_vlanID");
    objTemp.disabled = true;
    objTemp = document.getElementById("_vlanPriority");
    objTemp.disabled = true;

    document.getElementById("_lanChannel").addEventListener("change", onChannelChange);
    document.getElementById("_enableVLAN").addEventListener("change", onVLANEnableChange);
    document.getElementById("_save").addEventListener("click", saveVLANCfg);

    OutputString();

    //check input format
    initCheckInputListener("_vlanID", lang.LANG_CONF_NETWORK_VLAN_ID, INPUT_FIELD.VLANID);
    initCheckInputListener("_vlanPriority", lang.LANG_CONF_NETWORK_VLAN_PRIORITY, INPUT_FIELD.VLANPRIORITY);

    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString()
{
    "use strict";
    document.getElementById("vlan_setting_div").textContent = lang.LANG_CONF_NETWORK_VLAN_SETTING;
    document.getElementById("lan_channel_lbl").textContent = lang.LANG_CONF_NETWORK_VLAN_LAN_CHANNEL;
    document.getElementById("vlan_enable_lbl").textContent = lang.LANG_CONF_NETWORK_VLAN_ENABLE;
    document.getElementById("vlan_id_lbl").textContent = lang.LANG_CONF_NETWORK_VLAN_ID;
    document.getElementById("vlan_priority_lbl").textContent = lang.LANG_CONF_NETWORK_VLAN_PRIORITY;
    document.getElementById("_save").value = lang.LANG_CONF_NETWORK_SAVE;
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if (privilege == '04') {
        requestVLANInfo(0);
        onChannelChange();
    } else if (privilege == '03') {
        var tmp = document.getElementById("_save");
        tmp.disabled = true;
        requestVLANInfo(0);
        onChannelChange();
        //alert(lang.LANG_CONF_NETWORK_NOPRIVI_CONF);
    } else {
        location.href = SubMainPage;
    }
}

function geneXML(lan_count, enable, vid, priority, sharemode, failover, nic_interface) {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <TOTAL_NUMBER VLAN=\"" + lan_count + "\"/>\n";
    result += "    <LAN_IF SHAREMODE_EN=\"" + sharemode +
                       "\" FAILOVER_EN=\""  + failover +
                       "\" INTERFACE=\""    + nic_interface +
                       "\" INTERFACE_EN=\"" + enable + "\"/>\n";
    result += "    <VLAN ENABLE=\"" + enable + "\" VID=\"" + vid + "\" VPRIORITY=\"" + priority + "\"/>\n";
    result += "</IPMI>\n";
    return result;
}

function updateVLANInfo(root) {
    "use strict";
    if (root != null) {
        var selector = document.getElementById("_lanChannel");
        if (selector == null || selector.length < 1) {
            return;
        }

        var enable = root.getElementsByTagName("VLAN")[0].getAttribute("ENABLE");
        var objEnable = document.getElementById("_enableVLAN");

        if (enable == "1") {
            objEnable.checked = true;
        } else {
            objEnable.checked = false;
        }

        var vlanID = root.getElementsByTagName("VLAN")[0].getAttribute("VID");
        var objVLANID = document.getElementById("_vlanID");

        objVLANID.value = vlanID;

        var vlanPriority = root.getElementsByTagName("VLAN")[0].getAttribute("VPRIORITY");
        var objVLANPriority = document.getElementById("_vlanPriority");
        objVLANPriority.value = vlanPriority;
    }
}

function responseVLANInfo(response) {
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("vlan response:" + text);
        var xml_obj = GetResponseXML(text);

        if (xml_obj != null) {
            var result = GetXMLNodeValue(xml_obj, "RESULT");
            if (result == "FAIL") {
                alert(lang.LANG_CONF_NETWORK_UPDATE_FAIL);
                return;
            }

            var root = xml_obj.documentElement;
            updateChannelList(root);
            updateVLANInfo(root);
            onVLANEnableChange();
        }
    }
}

function responseSaveVLANCfg(response) {
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("vlan response:" + text);
        var xml_obj = GetResponseXML(text);
        if (xml_obj != null) {
            var result = GetXMLNodeValue(xml_obj, "RESULT");
            if (result == "OK") {
                alert(lang.LANG_CONF_NETWORK_UPDATE_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS})
            } else {
                alert(lang.LANG_CONF_NETWORK_UPDATE_FAIL);
                var selector = document.getElementById("_lanChannel");
                var index = 0;
                var channel_id = 0;

                if (selector != null) {
                    index = selector.selectedIndex;
                    channel_id = selector.options[index].value;
                }
                if (channel_id > 0) {
                    requestVLANInfo(channel_id);
                }
            }
        }
    }
}

function requestVLANInfo(channel) {
    "use strict";
    var ajax_url = '../cgi/netvlancfg.cgi';
    var ajax_param = '';
    var ajax_data = geneXML("0", "0", "0", "0", "0", "0", channel);
    //console.log("request vlan index:" + channel);
    //console.log("request vlan xml:" + ajax_data);
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'POST',
                                      contentType: "text/xml",
                                      asynchronous: false,
                                      xml_data: ajax_data,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      parameters: ajax_param,
                                      onComplete: responseVLANInfo }
                                   );
}

function saveVLANCfg() {
    "use strict";
    var objTemp = document.getElementById("_enableVLAN");
    var selector = document.getElementById("_lanChannel");
    var enable = "0";
    var vid = "0";
    var nic_interface = "1";
    var priority = "0";

    if (selector != null) {
        var index = selector.selectedIndex;
        nic_interface = selector.options[index].value;
    }

    if (objTemp.checked == true) {
        enable = "1";
    }
    objTemp = document.getElementById("_vlanID");
    vid = objTemp.value;

    if (parseInt(vid) <= 0 || parseInt(vid) >= 4095) {
        alert(lang.LANG_CONF_NETWORK_ERR3);
        return;
    }

    objTemp = document.getElementById("_vlanPriority");
    priority = objTemp.value;

    if (parseInt(priority) < 0 || parseInt(priority) > 7) {
        alert(lang.LANG_CONF_NETWORK_ERR6);
        return;
    }

    var ajax_url = '../cgi/netvlancfg.cgi';
    var ajax_param = '';
    var ajax_data = geneXML(totalNIC, enable, vid, priority, "0", "0", nic_interface);
    //console.log("request:" + ajax_data);
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'PUT',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      parameters: ajax_param,
                                      onComplete: responseSaveVLANCfg }//register callback function
                                    );
}

function onVLANEnableChange() {
    "use strict";
    var objEnable = document.getElementById("_enableVLAN");
    var vlanID = document.getElementById("_vlanID");
    var vlanPriority = document.getElementById("_vlanPriority");

    if (objEnable.checked == true) {
        vlanID.disabled = false;
        vlanPriority.disabled = false;
    } else {
        vlanID.disabled = true;
        vlanPriority.disabled = true;
    }
}

function updateChannelList(root) {
    "use strict";
    var numChannels;
    var numUsers;
    var channel_id;
    var idx;

    var node = root.getElementsByTagName("TOTAL_NUMBER")[0];
    if (node != null) {
        numChannels = node.getAttribute("VLAN");
    }

    if (totalNIC < 1) {
        totalNIC = numChannels;
    } else {
        return;
    }

    var selector = document.getElementById("_lanChannel");
    if (selector != null) {
        for(idx = (selector.options.length - 1); idx >= 0; idx--) {
            selector.remove(idx);
        }

        var node_if = root.getElementsByTagName("LAN_IF")[0];
        var node_id = root.getElementsByTagName("LAN_ID");

        if (parseInt(node_if.getAttribute("FAILOVER_SLAVE_NUM")) != 0) {

            channel_id = node_if.getAttribute("FAILOVER_CHAN_NUM");
            var option = document.createElement("option");
            option.text = lang.LANG_CONF_LAN_CHANNEL_OPT_PREFIX + channel_id;
            option.value = channel_id;
            selector.add(option);

            if (parseInt(node_if.getAttribute("FAILOVER_FREE_SLAVE")) != 0) {
                channel_id = node_if.getAttribute("FAILOVER_FREE_SLAVE");

                var check_channel_id;

                for(idx = 0; idx < numChannels; idx++) {
                    check_channel_id = node_id[idx].getAttribute("AVAILABLE");
                    if(check_channel_id == channel_id) {
                        var option = document.createElement("option");
                        option.text = lang.LANG_CONF_LAN_CHANNEL_OPT_PREFIX + channel_id;
                        option.value = channel_id;
                        selector.add(option);
                    }
                }
            }
        } else {
            for(idx = 0; idx < numChannels; idx++) {
                channel_id = node_id[idx].getAttribute("AVAILABLE");
                var option = document.createElement("option");
                option.text = lang.LANG_CONF_LAN_CHANNEL_OPT_PREFIX + channel_id;
                option.value = channel_id;
                selector.add(option);
            }
        }
    }
}

function onChannelChange() {
    "use strict";
    var selector = document.getElementById("_lanChannel");
    var index = 0;
    var channel_id = 0;

    if (selector != null) {
        index = selector.selectedIndex;
        channel_id = selector.options[index].value;
    }

    if (channel_id > 0) {
        requestVLANInfo(channel_id);
    }
}
