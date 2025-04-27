"use strict";
/** Configuration IPv4 Setting **/

var btnSave;
var totalNIC = 0;
var initFailOver = true;
var initHostInterface = true;
var hostinface_en = false;
var bondcheck = 0;
var availablemask = 0;
var global_enable_failover = 0;
var global_primary_nic = 0;
var global_nic_numble = 0;
var slave_max = 3;
var hostintf_channel = 0;
var init_flag;
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_IPv4_network_hlp.html";

    // bonding table init
    var tbbonding = document.getElementById("bonding_tb");
    tbbonding.style.display = "none";

    var item = document.getElementById("_optStatic");
    item.onchange = onStaticIPChanged;
    item = document.getElementById("_optDHCP");
    item.onchange = onStaticIPChanged;
    item = document.getElementById("_optDisable");
    item.onchange = onStaticIPChanged;
    init_flag = true;
    OutputString();

    document.getElementById("_enableLanFailover").addEventListener("change", onFailoverCheckedChange);
    document.getElementById("_b1").addEventListener("change", BondingCheckedChange);
    document.getElementById("_b2").addEventListener("change", BondingCheckedChange);
    document.getElementById("_b3").addEventListener("change", BondingCheckedChange);
    document.getElementById("_enableHostinterface").addEventListener("change", onHostInterfaceCheckedChange);
    document.getElementById("_lanChannel").addEventListener("change", onChannelChange);
    document.getElementById("_pChannel").addEventListener("change", onPrimaryChannelChange);
    document.getElementById("_save").value = lang.LANG_CONF_NETWORK_SAVE;

    //check input format
    initCheckInputListener("_hostname", lang.LANG_CONF_NETWORK_HOSTNAME, INPUT_FIELD.HOSTNAME);
    initCheckInputListener("_ipAddress", lang.LANG_CONF_NETWORK_IP_ADDR, INPUT_FIELD.IPV4);
    initCheckInputListener("_subnetMask", lang.LANG_CONF_NETWORK_MASK, INPUT_FIELD.IPV4);
    initCheckInputListener("_gateway", lang.LANG_CONF_NETWORK_GATEWAY, INPUT_FIELD.IPV4);
    initCheckInputListener("_primaryDNS", lang.LANG_CONF_NETWORK_DNS_PRIMARY, INPUT_FIELD.IPV4);
    initCheckInputListener("_secondDNS", lang.LANG_CONF_NETWORK_DNS_SECONDARY, INPUT_FIELD.IPV4);

    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString()
{
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_CONF_NETWORK_IPV4_SETTING;
    document.getElementById("network_legen").textContent = lang.LANG_CONF_NETWORK_SETTING_CONF;
    document.getElementById("hostname_lbl").textContent = lang.LANG_CONF_NETWORK_HOSTNAME;
    document.getElementById("failover_lbl").textContent = lang.LANG_CONF_NETWORK_IPV4_FAILOVER;
    document.getElementById("host_interface_lbl").textContent = lang.LANG_CONF_NETWORK_HOST_INTERFACE;
    document.getElementById("bonding_channel_lbl").textContent = lang.LANG_CONF_NETWORK_LAN_CHANNEL_BONDING;
    document.getElementById("channel1_lbl").textContent = lang.LANG_CONF_NETWORK_BONDING_CHANNEL_1;
    document.getElementById("channel2_lbl").textContent = lang.LANG_CONF_NETWORK_BONDING_CHANNEL_2;
    document.getElementById("channel3_lbl").textContent = lang.LANG_CONF_NETWORK_BONDING_CHANNEL_3;
    document.getElementById("primary_channel_lbl").textContent = lang.LANG_CONF_NETWORK_PRIMARY_CHANNEL;
    document.getElementById("network_lbl").textContent = lang.LANG_CONF_NETWORK_LAN_CHANNEL;
    document.getElementById("mac_addr_lbl").textContent = lang.LANG_CONF_NETWORK_MAC_ADDRESS;
    document.getElementById("nic_desc_lbl").textContent = lang.LANG_CONF_NETWORK_NIC_DESCRIPTION;
    document.getElementById("link_status_lbl").textContent = lang.LANG_CONF_NETWORK_LINK_STATUS;
    document.getElementById("ip_addr_lbl").textContent = lang.LANG_CONF_NETWORK_IP_ADDR;
    document.getElementById("mask_lbl").textContent = lang.LANG_CONF_NETWORK_MASK;
    document.getElementById("gateway_lbl").textContent = lang.LANG_CONF_NETWORK_GATEWAY;
    document.getElementById("dns_pri_lbl").textContent = lang.LANG_CONF_NETWORK_DNS_PRIMARY;
    document.getElementById("dns_sec_lbl").textContent = lang.LANG_CONF_NETWORK_DNS_SECONDARY;
    document.getElementById("optDHCP_lbl").textContent = lang.LANG_CONF_NETWORK_DHCP_EXP;
    document.getElementById("optStatic_lbl").textContent = lang.LANG_CONF_NETWORK_STATIC_EXP;
    document.getElementById("optDisable_lbl").textContent = lang.LANG_CONF_NETWORK_DISABLE;
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    var Item = document.getElementById("_macAddress");
    Item.disabled = true;//now mac was read only.

    if (privilege == '04') {
        requestReadConfig("0", "0");
    } else if (privilege == '03') {
        var tmp = document.getElementById("_save");
        tmp.disabled = true;
        requestReadConfig("0", "0");
        //alert(lang.LANG_CONF_NETWORK_NOPRIVI_CONF);
    } else {
        location.href = SubMainPage;
    }
}

function onStaticIPChanged()
{
    "use strict";
    var item = document.getElementById("_optStatic");
    if (item.checked == true) {
        enableIPEditor(true);
    } else {
        enableIPEditor(false);
    }

    var item = document.getElementById("_optDHCP");
    if(item.checked == true) {
        enableHostname(true);
    }
    else {
        enableHostname(false);
    }
}

function enableHostname(enable) {
    "use strict";
    var disabled = !enable;
    var hostname = document.getElementById("_hostname");
    hostname.disabled = disabled;
}

function enableIPEditor(enable) {
    "use strict";
    var disabled = !enable;
    var item = document.getElementById("_ipAddress");

    item.disabled = disabled;
    var item = document.getElementById("_subnetMask");
    item.disabled = disabled;
    var item = document.getElementById("_gateway");
    item.disabled = disabled;
    var item = document.getElementById("_primaryDNS");
    item.disabled = disabled;
    var item = document.getElementById("_secondDNS");
    item.disabled = disabled;
}

function enableRadio(enable) {
    "use strict";
    var disabled = !enable;
    var item = document.getElementById("_optDHCP");

    item.disabled = disabled;
    var item = document.getElementById("_optStatic");
    item.disabled = disabled;
    var item = document.getElementById("_optDisable");
    item.disabled = disabled;
}

function enableHostInterfaceIPEditor() {
    "use strict";
    var item = document.getElementById("_ipAddress");

    item.disabled = false;
    var item = document.getElementById("_subnetMask");
    item.disabled = false;
    var item = document.getElementById("_gateway");
    item.disabled = true;
    var item = document.getElementById("_primaryDNS");
    item.disabled = true;
    var item = document.getElementById("_secondDNS");
    item.disabled = true;
}

function enableHostInterfaceRadio() {
    "use strict";
    var item = document.getElementById("_optDHCP");

    item.disabled = true;
    var item = document.getElementById("_optStatic");
    item.disabled = false;
    var item = document.getElementById("_optDisable");
    item.disabled = true;
}

function check_bond_enable()
{
    "use strict";
    var selector = document.getElementById("_lanChannel");
    var index = selector.selectedIndex;
    var value = selector.options[index].value;

    if(global_enable_failover == "1")
    {
        if(global_primary_nic == value)
            return false;
        else
            return true;
    }
    else
    {
       return true;
    }
}

function requestReadConfig(channel, nicnum)
{
    "use strict";
    var ajax_url = '../cgi/netip4cfg.cgi';
    var ajax_param = 'ipv4conf.xml';
    var ajax_data = geneConfigXML(channel, nicnum, "0", "0", "0", "0", "0",
                                  "0.0.0.0", "", "00-00-00-00-00-00",
                                  "0.0.0.0", "0.0.0.0", "0", "0.0.0.0",
                                  "0.0.0.0");
    global_nic_numble = channel;
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'POST',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      parameters: ajax_param,
                                      onComplete: readNICConfig }//register callback function
                                   );
}

function geneConfigXML(nic_index,
                       nic_num,
                       sharemode,
                       failover,
                       host_interface,
                       hostintf_nic,
                       enable,
                       ip, hostname, mac,
                       mask,
                       gateway,
                       dhcp, dns1, dns2)
{
    "use strict";
    var result = "";
        result += "<?xml version=\"1.0\"?>\n";
        result += "<IPMI>\n";
        result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
        result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
        result += "    <TOTAL_NUMBER LAN=\"" + nic_num + "\" USER=\"0\"/>\n";
        result += "    <LAN_IF SHAREMODE_EN=\"" + sharemode +
                           "\" FAILOVER_EN=\"" + failover +
                           "\" NIC_SLAVE=\"" + get_nic_slaves() +
                           "\" PRIMARY_NIC=\"" + get_primary_nic() +
                           "\" HOST_INTERFACE_EN=\"" + host_interface +
                           "\" HOST_INTERFACE_NIC=\"" + hostintf_nic +
                           "\" INTERFACE=\"" + nic_index +
                           "\" INTERFACE_EN=\"" + enable + "\"/>\n";
        result += "    <LAN BMC_IP=\"" + ip +
                        "\" BMC_MAC=\"" + mac +
                        "\" BMC_NETMASK=\"" + mask +
                        "\" GATEWAY_IP=\"" + gateway +
                        "\" DHCP_EN=\"" + dhcp + "\"/>\n";
        result += "    <DNS DNS_SERVER=\"" + dns1 + "\" DNS_SERVER2=\"" + dns2 + "\"/>\n";
        result += "    <HOSTNAME NAME=\"" + hostname + "\" />\n";
        result += "</IPMI>\n";
    return result;
}

function readNICConfig(response) {
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        //alert("response:\n\n" + response.responseText);
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response for nic config:\n" + text);
        var xml_obj = GetResponseXML(text);

        if(xml_obj != null) {
           var result = GetXMLNodeValue(xml_obj, "RESULT");
           if (result == "FAIL") {
                if (init_flag === false && global_nic_numble === global_primary_nic) {
                    //read primary nic info failed
                    alert(lang.LANG_CONF_PRIMARY_NETWORK_READ_FAIL);
                } else {
                    alert(lang.LANG_CONF_NETWORK_READ_FAIL);
                }
                return;
            }

            var idx = 0;
            var root = xml_obj.documentElement;
            updateChannelList(root);
            updateNICConfiguration(root);

            var btnSave = document.getElementById("_save");
            btnSave.onclick = saveConfiguration;

            var node = root.getElementsByTagName("LAN")[0];
            var enanble_dhcp = node.getAttribute("DHCP_EN");
            var objEnable = document.getElementById("_enableHostinterface");
            var selector = document.getElementById("_lanChannel");

            var node = root.getElementsByTagName("LAN_IF")[0];
            if(enanble_dhcp == "1") {
               //when dhcp enable, disable static ip & netmask & gateway & DNS
                enableIPEditor(false);
                //when dhcp enable, hostname can be setted.
                enableHostname(true);
            } else {
                //dhcp disable & INTERFACE_EN == "1"
                var if_enable = node.getAttribute("INTERFACE_EN");

                if(if_enable == "1") {
                    var obj = document.getElementById("_optStatic");
                    obj.checked = true;
                    enableIPEditor(true);
                } else {
                    enableIPEditor(false);
                }
                //when dhcp disable, hostname cannot be setted.
                enableHostname(false);
            }

            if (selector.options[selector.selectedIndex].value == hostintf_channel){
                if (objEnable.checked == true) {
                     enableHostInterfaceRadio(true);
                     enableHostInterfaceIPEditor(true);
                }
            } else {
                enableRadio(true);
                onStaticIPChanged();
            }
       }
    }
}

function updateConfig(response) {
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        //console.log("updateIPV4Config:\n" + response.responseText + "\n\n");
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        if (xml_obj != null) {
            var result = GetXMLNodeValue(xml_obj, "RESULT");

            if(result == "OK") {
                alert(lang.LANG_CONF_NETWORK_UPDATE_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS});
                setTimeout(function(){ location.href = "../cgi/url_redirect.cgi?url_name=config_ipv4"; }, 2000);
            }
            else if(result == "SESSION_INVALID") {
                ClearInvalidSession();
                return;
            }
            else {
                alert(lang.LANG_CONF_NETWORK_UPDATE_FAIL)
            }

            setTimeout(function(){ location.href = "../cgi/url_redirect.cgi?url_name=config_ipv4"; }, 2000);
        }
    }
}

function updateChannelList(root) {
    "use strict";
    var numChannels;
    var numUsers;
    var channel_id;
    var failover_chan_id;
    var failover_slave_num;
    var enable_failover;
    var failover_free_slave;
    var nic_slave;
    var primary_nic;
    var request_channel_id;
    var linkStatusbitmap;
    var enable_hostinterface
    var bind_find = 0;

    var node = root.getElementsByTagName("TOTAL_NUMBER")[0];
    if(node != null) {
        var numChannels = node.getAttribute("LAN");
    }

    var item = document.getElementById("_enableLanFailover");
    var node = root.getElementsByTagName("LAN_IF")[0];
    if(node != null) {
        request_channel_id = node.getAttribute("INTERFACE");
        failover_slave_num = node.getAttribute("FAILOVER_SLAVE_NUM");
        failover_chan_id = node.getAttribute("FAILOVER_CHAN_NUM");
        enable_failover = node.getAttribute("FAILOVER_EN");
        global_enable_failover = enable_failover;
        nic_slave = node.getAttribute("NIC_SLAVE");
        primary_nic = node.getAttribute("PRIMARY_NIC");
        global_primary_nic = primary_nic;
        failover_free_slave = node.getAttribute("FAILOVER_FREE_SLAVE");
        hostintf_channel = node.getAttribute("HOST_INTERFACE_NIC");
        linkStatusbitmap = node.getAttribute("LINKSTATUSBITMAP");
        enable_hostinterface = node.getAttribute("HOST_INTERFACE_EN");
    } else {
        return;
    }

    if (totalNIC < 1) {
        totalNIC = numChannels;
    }

    // When first initialize, the LAN failover value is obtained from the IPMI settings.
    if ((initFailOver == true) && (!bondcheck)) {
        if(enable_failover == "1") {
            item.checked = true;
        } else {
            item.checked = false;
        }
    }

    if (initFailOver == true) {
        if (item.checked == true) {
            var nic_slave_temp = nic_slave.toString(16);
            var node = root.getElementsByTagName("LAN_ID");

            for(var i = 0; i < totalNIC; i++) {
                var channel_id = node[i].getAttribute("AVAILABLE");
                if (channel_id < slave_max)
                    availablemask |= channel_id;
                else
                    availablemask |= (0x01 << 2);
            }

            for(var i = 0; i < slave_max; i++) {
                var channel_id = (i+1);
                var temp_oj = document.getElementById("_b"+ channel_id);
                var str_oj = document.getElementById("channel"+ channel_id + "_lbl");
                if (availablemask & (0x01 << i)) {
                    if (!bondcheck) {
                        if ((nic_slave_temp >> i) & 0x01) {
                            temp_oj.checked = true;
                        } else {
                            temp_oj.checked = false;
                        }
                    } else {
                        if (!(linkStatusbitmap & (0x01 << i))) {
                            temp_oj.disabled = true;
                        } else {
                            temp_oj.disabled = false;
                        }
                    }
                    str_oj.style.display = "inline";
                    temp_oj.style.display = "inline";
                } else {
                    temp_oj.disabled = true;
                    str_oj.style.display = "none";
                    temp_oj.style.display = "none";
                }
            }

            BondingCheckedChange();
            var tbbonding = document.getElementById("bonding_tb");
            tbbonding.style.display = "inline";
        } else {
            var selectorPri = document.getElementById("_pChannel");
            clear_checkbox_checked();
            clear_selectorOptions(selectorPri);
        }
    }

    var objEnable = document.getElementById("_enableHostinterface");
    if(initHostInterface == true) {
        if(enable_hostinterface == "1") {
            objEnable.checked = true;
        } else {
            objEnable.checked = false;
        }
    }
    var selector = document.getElementById("_lanChannel");
    var selectorPri = document.getElementById("_pChannel");
    if(selector != null) {
        // clear selector option list
        for(var idx = (selector.options.length - 1); idx >= 0; idx--) {
            selector.remove(idx);
        }

        var node = root.getElementsByTagName("LAN_ID");
        var primary_nic = get_primary_nic();
        for(var idx = 0; idx < numChannels; idx++) {
            var channel_id = node[idx].getAttribute("AVAILABLE");
            var option = document.createElement("option");
            option.text = lang.LANG_CONF_LAN_CHANNEL_OPT_PREFIX + channel_id;
            option.value = channel_id;

            if (channel_id == hostintf_channel) {
                // If the host interface is not enabled, this channel is ignored.
                if (objEnable.checked == false) {
                    break;
                }
            }

            if (!bondcheck) {
                // Initialization and failover enabled by default
                if((enable_failover == "1") && (parseInt(failover_slave_num) > 1)) {
                    if((global_primary_nic == channel_id) || (failover_free_slave == channel_id)) {
                        selector.add(option);
                    } else if ((channel_id == hostintf_channel) && (objEnable.checked == true)) {
                        selector.add(option);
                    }
                }else {
                    selector.add(option);
                }
            } else {
                if (selectorPri.length > 0) {
                    bind_find = 0;
                    for(var i = 0; i < selectorPri.length; i++) {
                        if (selectorPri.options[i].value == channel_id) {
                            if (channel_id == primary_nic) {
                                selector.add(option);
                                break;
                            }
                            bind_find = 1;
                        }
                    }
                    if (!bind_find) {
                        selector.add(option);
                    }
                } else {
                    selector.add(option);
                }
            }
        }

        for(var idx = 0; idx < selector.length; idx++) {
            if (selector.options[idx].value == request_channel_id) {
                selector.selectedIndex = idx;
                break;
            }
        }

        if(init_flag == true) {
            init_flag = false;
            requestReadConfig(global_primary_nic, 0);
        }
    }
}

function updateNICConfiguration(root) {
    "use strict";
    var node;
    var attr;
    var item;
    var enable_failover;
    var enable_hostinterface;
    var failover_slave_num;
    var selector = document.getElementById("_lanChannel");

    if(selector == null || selector.length < 1) {
        return;
    }
    var node = root.getElementsByTagName("LAN_IF")[0];
    if(node != null) {
        var enable_failover = node.getAttribute("FAILOVER_EN");
        var failover_slave_num = node.getAttribute("FAILOVER_SLAVE_NUM");
        var item = document.getElementById("_enableLanFailover");

        if ((initFailOver == true) && (!bondcheck)) {
            if (global_enable_failover == "1")
            {
                // When enable failover, the checkbox is checked and disable lan channel selector.
                if (failover_slave_num == "2") {
                    selector.disabled = false;
                }
            } else {
                selector.disabled = false;
            }
            initFailOver = false;
        }

        var enable_hostinterface = node.getAttribute("HOST_INTERFACE_EN");
        var item = document.getElementById("_enableHostinterface");

        if(initHostInterface == true) {
            if(enable_hostinterface == "1") {
                item.checked = true;
            } else {
                item.checked = false;
            }
        }

        var attr = node.getAttribute("INTERFACE_EN");
        var item = document.getElementById("_optDisable");
        if(attr == "1") {
            item.checked = false;
        }
        else {
            item.checked = true;
        }

        var attr = node.getAttribute("INTERFACE_DESC");
        var item = document.getElementById("nic_Description");
        if(attr == "0") {
            // Dedicated to BMC
            item.textContent = lang.LANG_CONF_NETWORK_NIC_DESC0;
        } else if(attr == "1") {
            // Shared between Host and BMC
            item.textContent = lang.LANG_CONF_NETWORK_NIC_DESC1;
        } else {
            // Dedicated to Host
            item.textContent = lang.LANG_CONF_NETWORK_NIC_DESC2;
        }

        var attr = node.getAttribute("INTERFACE_STATUS");
        var item = document.getElementById("link_status");
        if(attr == "0") {
            // LAN Channel Link Down
            item.textContent = lang.LANG_CONF_NETWORK_LINK_DOWN;
        } else if(attr == "1") {
            // LAN Channel Link Up
            item.textContent = lang.LANG_CONF_NETWORK_LINK_UP;
        }
    }

    var node = root.getElementsByTagName("LAN")[0];
    if(node != null) {
        var attr = node.getAttribute("BMC_MAC");
        var item = document.getElementById("_macAddress");
        item.value = attr;
        var attr = node.getAttribute("BMC_IP");
        var item = document.getElementById("_ipAddress");
        item.value = attr;
        var attr = node.getAttribute("BMC_NETMASK");
        var item = document.getElementById("_subnetMask");
        item.value = attr;
        var attr = node.getAttribute("GATEWAY_IP");
        var item = document.getElementById("_gateway");
        item.value = attr;
        var attr = node.getAttribute("DHCP_EN");
        var item = document.getElementById("_optDHCP");
        if(attr == "1") {
            item.checked = true;
        }
        else {
            item.checked = false;
        }
    }

    var node = root.getElementsByTagName("HOSTNAME")[0];
    if(node != null) {
        var attr = node.getAttribute("NAME");
        var item = document.getElementById("_hostname");
        item.value = attr;
    }
    var node = root.getElementsByTagName("DNS")[0];
    if(node != null) {
        var attr = node.getAttribute("DNS_SERVER");
        var item = document.getElementById("_primaryDNS");
        item.value = attr;
        var attr = node.getAttribute("DNS_SERVER2");
        var item = document.getElementById("_secondDNS");
        item.value = attr;
    }
}

function saveConfiguration()
{
    "use strict";
    var check_item = document.getElementById("_enableLanFailover");
    if (check_item.checked) {
        if (pre_bond_ch_count() < 2) {
            alert(lang.LANG_CONFIG_NETWORK_ERR_INVALID_CHANNEL_BONDING_AMOUNT);
            return;
        }
    }
    UtilsConfirm(lang.LANG_CONF_NETWORK_WARNING2, {
    onOk: function() {
            "use strict";
            var item;
            var selector = document.getElementById("_lanChannel");
            var channel_index = -1;
            var mac;
            var ip;
            var hostname;
            var mask;
            var gateway;
            var dhcp_enable = "0";
            var manual_ip = "0";
            var nic_enable = "0";
            var dns1;
            var dns2;
            var fail_over_enable = "0";
            var host_interface = "0";

            //alert("click save");
            if(selector != null) {
                var index = selector.selectedIndex;
                channel_index = selector.options[index].value;
            }

            var item = document.getElementById("_enableHostinterface");
            if(item.checked) {
                host_interface = "1";
            }

            var item = document.getElementById("_macAddress");
            mac = item.value;
            //console.log("mac:" + mac);
            var item = document.getElementById("_ipAddress");
            ip = item.value;
            if(!CheckIP(ip)){
                alert(lang.LANG_CONFIG_NETWORK_ERR_INVALID_IP);
                return;
            }
            //console.log("ip:" + ip);
            var item = document.getElementById("_hostname");
            // Send the hostname as submitted by the user, allow the AJAX
            // call to filter invalid hostname data.
            hostname = item.value;
            //console.log("hostname:" + hostname);
            var item = document.getElementById("_subnetMask");
            mask = item.value;
            if(!CheckIP(mask)){
                alert(lang.LANG_CONFIG_NETWORK_ERR_INVALID_SUBNET_MASK);
                return;
            }
            //console.log("mask:" + mask);
            var item = document.getElementById("_gateway");
            gateway = item.value;
            if(!CheckIP(gateway)){
                alert(lang.LANG_CONFIG_NETWORK_ERR_INVALID_GATEWAY);
                return;
            }
            //console.log("gateway:" + gateway);
            var item = document.getElementById("_optDHCP");
            if(item.checked) {
                dhcp_enable = "1";
            }
            //console.log("dhcp enable:" + dhcp_enable);
            var item = document.getElementById("_optStatic");
            if(item.checked) {
                manual_ip = "1";
            }
            //console.log("Static ip enable:" + manual_ip);
            var item = document.getElementById("_optDisable");
            if(item.checked) {
                nic_enable = "0";
            }
            else {
                nic_enable = "1";
            }
            //alert("nic_enable:" + nic_enable);
            //console.log("NIC disable:" + nic_enable);
            var item = document.getElementById("_primaryDNS");
            dns1 = item.value;
            if(!CheckIP6(dns1)){
                alert(lang.LANG_CONFIG_NETWORK_ERR_INVALID_PRIMARY_DNS);
                return;
            }
            //console.log("dns1:" + dns1);
            var item = document.getElementById("_secondDNS");
            dns2 = item.value;
            if(!CheckIP6(dns2)){
                alert(lang.LANG_CONFIG_NETWORK_ERR_INVALID_SEC_DNS);
                return;
            }
            //console.log("dns2:" + dns2);
            var item = document.getElementById("_enableLanFailover");
            if(item.checked) {
                fail_over_enable = "1";
            }
            //console.log("fail_voer:" + fail_over_enable);
            var ajax_url = '../cgi/netip4cfg.cgi';
            var ajax_param = '';
            var ajax_data = geneConfigXML(channel_index,
                                          totalNIC,
                                          "0",
                                          fail_over_enable,
                                          host_interface,
                                          hostintf_channel,
                                          nic_enable,
                                          ip,
                                          hostname,
                                          mac,
                                          mask,
                                          gateway,
                                          dhcp_enable,
                                          dns1,
                                          dns2);
            //console.log("request update ipv4 config :\n" + ajax_data + "\n\n");
            var ajax_req = new Ajax.Request(ajax_url,
                                            { method: 'UPDATE',
                                              contentType: "text/xml",
                                              xml_data: ajax_data,
                                              timeout: g_CGIRequestTimeout,
                                              ontimeout: onCGIRequestTimeout,
                                              parameters: ajax_param,
                                              onComplete: updateConfig }//register callback function
                                            );
        }
    });
}

function onChannelChange() {
    "use strict";
    var selector = document.getElementById("_lanChannel");
    var channel_id = 0;

    if(selector != null) {
        channel_id = selector.options[selector.selectedIndex].value;
    }

    requestReadConfig(channel_id, 0);
}

function clear_selectorOptions(selector)
{
    "use strict";
    if (typeof(selector) != "object")
        return;
    selector.options.length = 0;
}

function get_primary_nic()
{
    "use strict";
    var p_nic = 0;
    var selector = document.getElementById("_pChannel");

    if (selector.length > 0) {
        p_nic = selector.selectedIndex;
        p_nic = selector.options[p_nic].value;
    }

    return p_nic;
}

function pre_bond_ch_count()
{
    "use strict";
    var count = 0;

    for(var i = 0; i < slave_max; i++) {
        var bondingcheck = document.getElementById("_b"+ (i+1));
        if (bondingcheck.checked == true)
            count++;
    }
    return count;
}

function get_nic_slaves()
{
    "use strict";
    var nic_slaves = 0;
    for (var i = 0; i < slave_max; i++) {
        var bondingcheck = document.getElementById("_b"+ (i+1));
        if (bondingcheck.checked == true) {
            nic_slaves |= (0x01 << i);
        }
    }
    return nic_slaves;
}

function clear_checkbox_checked()
{
    "use strict";
    for (var i = 1; i <= slave_max; i++) {
         var bondingcheck = document.getElementById("_b"+ i);
         bondingcheck.checked = false;
    }
}

function enabled_bond_ch()
{
    "use strict";
    var selector = document.getElementById("_pChannel");

    for(var i = 0; i < slave_max; i++) {
        var temp_oj = document.getElementById("_b"+ (i+1));
        temp_oj.disabled = false;
        //temp_oj.checked = false;
    }
    //clear_selectorOptions(selector);
    selector.disabled = false;
}

function disabled_bond_ch()
{
    "use strict";
    var selector = document.getElementById("_pChannel");

    for(var i = 0; i < slave_max; i++) {
        var temp_oj = document.getElementById("_b"+ (i+1));
        temp_oj.disabled = true;
    }
    selector.disabled = true;
}

function BondingCheckedChange()
{
    "use strict";
    var selector = document.getElementById("_pChannel");
    var objEnable = document.getElementById("_enableLanFailover");
    var i = 0;

    clear_selectorOptions(selector);

    for (i = 0; i < slave_max; i++) {
         var channel_id = (i+1);
         var bondingcheck = document.getElementById("_b"+ channel_id);
         if (!(availablemask & (0x01 << i))) {
             continue;
         }
         if(bondingcheck.checked == true) {
            var options = document.createElement("option");
            options.text = lang.LANG_CONF_LAN_CHANNEL_OPT_PREFIX + channel_id;
            options.value = channel_id;
            selector.add(options);
         }
    }

    // If failover is enabled by default, the related settings of binding will gray-out
    if (global_enable_failover == "1") {
        if (selector.length > 0) {
            for(i = 0; i < selector.length; i++) {
                if (selector.options[i].value == global_primary_nic) {
                    selector.selectedIndex = i;
                    break;
                }
            }
        }
        initFailOver == true;
        bondcheck = 0;
        disabled_bond_ch();
    } else {
        if (objEnable.checked == true) {
            initFailOver = false;
            bondcheck = 1;
            channel_id = 0;
            if (selector.length > 0) {
                channel_id = get_primary_nic();
            }

            requestReadConfig(channel_id, 0);
            enabled_bond_ch();
        }
    }
}

function onFailoverCheckedChange() {
    "use strict";
    var objEnable = document.getElementById("_enableLanFailover");
    var selector = document.getElementById("_lanChannel");
    var channel_id = 0;

    if(selector != null) {
        channel_id = selector.options[selector.selectedIndex].value;
    }

    // If the failover checkbox is enabled, the system should be post the first channel information.
    if (objEnable.checked == true) {
        initFailOver = true;
        if (global_enable_failover == false) {
            bondcheck = 1;
        } else {
            bondcheck = 0;
        }
        requestReadConfig(channel_id, 0);
    }
    else {
        //disable failover, enable lan channel selector.
        bondcheck = 0;
        var tbbonding = document.getElementById("bonding_tb");
        tbbonding.style.display = "none";
        selector.disabled = false;
        initFailOver = false;
        requestReadConfig(channel_id, 0);
    }
}

function onPrimaryChannelChange() {
    "use strict";
    var objEnable = document.getElementById("_enableLanFailover");
    var channel_id = 0;

    if ((objEnable.checked == true) && (bondcheck)) {
        channel_id = get_primary_nic();
    }

    requestReadConfig(channel_id, 0);
}

function onHostInterfaceCheckedChange() {
    "use strict";
    var objEnable = document.getElementById("_enableHostinterface");
    var selector = document.getElementById("_lanChannel");
    var channel_id;

    channel_id = selector.options[selector.selectedIndex].value;

    if (objEnable.checked == true) {
        requestReadConfig(channel_id, 0);
    } else {
        if (selector.options[selector.selectedIndex].value == hostintf_channel) {
            requestReadConfig("0", "0");
        } else {
            requestReadConfig(channel_id, 0);
        }
    }

    initHostInterface = false;
}