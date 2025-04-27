"use strict";
var custom = null;
var submenu_obj;
var lang;
var $jq = jQuery.noConflict();

var PRIV_ID = top.PRIV_ID; // initial it at UserPrivilegeHandler() @ utils.js
var PAM_AUTH = top.PAM_AUTH;
var CSRF_TOKEN = "";
var MENUITEM_ACTIVE = 0;
var MENUITEM_GRAY = 1;
var MENUITEM_INVISIBLE = 2;
var swl_retry = 0;
var product_id = 0;
let PRODUCT_ID_WALKER_PASS = "95";
var SID = null;
var RF_SYSTEM_SN = null;

window.addEventListener('load', PreloadPageInit);

/* remove unused LoginFast Cookie, used for login only*/
RemoveSessionStorage("LoginFast");

if(CSRF_TOKEN == null || CSRF_TOKEN.length < 1) {
    requestNewCSRFToken();
    CreateSessionStorage("Authenticated", "1");
}

function rf_get_system_sn()
{
    jQuery.ajax({
        url: "/redfish/v1/Systems",
        type: 'GET',
        headers: {SID: top.topmenu.getSessionID()}
    })
    .then(function(data, textStatus, XHR) {
        let members = data["Members"];
        let url = members[0]["@odata.id"];

        RF_SYSTEM_SN = url.split('/redfish/v1/Systems/')[1];

        RequestRAIDMenu();
    })
    .catch(err=> {
        console.log(err);
    })
    .always(function(){
    });
}

function GetBoardInfo() {
    "use strict";
    var url = '/cgi/board_info.cgi';
    var pars = '';
    var myAjax = new Ajax.Request(
        url,
        {method: 'get',
         parameters:pars,
         onComplete: PageInit2
        });

    url = '/cgi/powerconsumption.cgi';
    pars = '';
    var ajax_data = "<?xml version=\"1.0\"?>\n"+
        "<IPMI>\n"+
        "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
        "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
        "</IPMI>\n";
    myAjax = new Ajax.Request(
        url,
        {method: 'GET',
            contentType: 'text/xml',
            xml_data: ajax_data,
            parameters:pars,
            onComplete:PageInit3,
        }
    );
}

function GetSoftLicenseInfo()
{
    "use strict";
    var ajax_url = '/cgi/soft_license_info.cgi';
    var ajax_data= GeneGenericRequestXML();
    var ajax_req = new Ajax.Request(
            ajax_url,
            {
            method: 'post',
            contentType: 'text/xml',
            xml_data: ajax_data,
            onComplete: GetSoftLicenseType
        });
}

/*
     Initialize and render the MenuBar when its elements are ready
     to be scripted.
*/
function RefreshMenuData(custom_obj){
    custom = custom_obj;
    submenu_obj = [
        {
            id: "sys",
            index: "system",
            label: lang.LANG_TOPMENU_SYSTEM,
            itemdata: [
               { text: lang.LANG_SYSTEM_SUBMENU_SYSTEM_INFO, onclick: {fn: function() {"use strict"; page_mapping('system', 'sys_info')}}, index: "sys_info"/*,
                 grayout: 0*/},
               { text: lang.LANG_SYSTEM_SUBMENU_FRU_INFO, onclick: {fn: function() {"use strict"; page_mapping('system', 'sys_fru')}}, index: "sys_fru"/*,
                 grayout: 0*/},
               { text: lang.LANG_SYSTEM_SUBMENU_CPU_INFO, onclick: {fn: function() {"use strict"; page_mapping('system', 'sys_cpu')}}, index: "sys_cpu"/*,
                 grayout: 0*/},
               { text: lang.LANG_SYSTEM_SUBMENU_DIMM_INFO, onclick: {fn: function() {"use strict"; page_mapping('system', 'sys_dimm')}}, index: "sys_dimm"/*,
                 grayout: 0*/},
               { text: lang.LANG_SYSTEM_SUBMENU_NVME_INFO, onclick: {fn: function() {"use strict"; page_mapping('system', 'sys_nvme_info')}}, index: "sys_nvme_info"/*, grayout: 0*/},
               { text: lang.LANG_SYSTEM_SUBMENU_NIC_INFO, onclick: {fn: function() {"use strict"; page_mapping('system', 'sys_nic')}}, index: "sys_nic"/*,
                 grayout: 0*/},
               { text: lang.LANG_SYSTEM_SUBMENU_STOR_INFO, onclick: {fn: function() {"use strict"; page_mapping('system', 'sys_stor')}}, index: "sys_stor"/*,
                 grayout: 0*/},
               { text: lang.LANG_SYSTEM_SUBMENU_CURRENTUSERS_INFO, onclick: {fn: function() {"use strict"; page_mapping('system', 'sys_currentusers')}}, index: "sys_currentusers"/*, grayout: 0*/}
            ]
        },

        {
            id: "server_health",
            index: "health",
            label: lang.LANG_TOPMENU_SERVER_HEALTH,
            itemdata: [
                { text: lang.LANG_SERVER_HEALTH_SUBMENU_SENSOR_READINGS, onclick: {fn: function() {"use strict"; page_mapping('health', 'servh_sensor')}}, index: "servh_sensor"},
                { text: lang.LANG_SERVER_HEALTH_SUBMENU_EVENT_LOG, onclick: {fn: function() {"use strict"; page_mapping('health', 'servh_event')}}, index: "servh_event" }
            ]
        },

        {
            id: "config",
            index: "configuration",
            label: lang.LANG_TOPMENU_CONFIGURATION,
            itemdata: [
                { text: lang.LANG_CONFIG_SUBMENU_ALERT, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_alert')}}, index: "config_alert" },
                { text: lang.LANG_CONFIG_SUBMENU_ALERT_EMAIL, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_alert_email')}}, index: "config_alert_email" },
                { text: lang.LANG_CONF_DATE_TIME_CAPTION, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_datetime')}}, index: "config_datetime" },
                { text: lang.LANG_CONFIG_SUBMENU_IPV4_NETWORK, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_ipv4')}}, index: "config_ipv4" },
                { text: lang.LANG_CONFIG_SUBMENU_IPV6_NETWORK, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_ipv6')}}, index: "config_ipv6" },
                { text: lang.LANG_CONFIG_SUBMENU_VLAN, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_vlan')}}, index: "config_vlan" },
                { text: lang.LANG_CONFIG_SUBMENU_LDAP, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_ldap')}}, index: "config_ldap" },
                { text: lang.LANG_CONFIG_SUBMENU_ACTIVE_DIRECTORY, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_ad')}}, index: "config_ad" },
                { text: lang.LANG_CONFIG_SUBMENU_KVM_MOUSE_MODE, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_kvm_mouse')}}, index: "config_kvm_mouse" },
                { text: lang.LANG_CONFIG_SUBMENU_SSL, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_ssl')}}, index: "config_ssl" },
                { text: lang.LANG_CONFIG_SUBMENU_SOFT_LICENSE, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_soft_license')}}, index: "config_soft_license" },
                { text: lang.LANG_CONFIG_SUBMENU_USER, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_usr')}}, index: "config_usr" },
                { text: lang.LANG_CONFIG_SUBMENU_SECURITY_SETTINGS, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_security_settings')}}, index: "config_security_settings"},
                { text: lang.LANG_CONFIG_SUBMENU_SOL, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_sol_smash')}}, index: "config_sol_smash"},
                { text: lang.LANG_CONFIG_SUBMENU_SDR_FW, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_sdr_fw')}}, index: "config_sdr_fw"},
                { text: lang.LANG_CONFIG_SUBMENU_FWUPD, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_fw_update')}}, index: "config_fw_update"},
                { text: lang.LANG_CONFIG_SUBMENU_OOB_FWUPD, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_oob_fwupdate')}}, index: "config_oob_fwupdate"},
                { text: lang.LANG_CONFIG_SUBMENU_CPLD_UPD, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_cpld_update')}}, index: "config_cpld_update"},
                // { text: lang.LANG_CONFIG_SUBMENU_NCSI_FWUPD, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_ncsi_fwupdate')}}, index: "config_ncsi_fwupdate"},
                { text: lang.LANG_CONFIG_SUBMENU_RSYS_LOG_IP, onclick: {fn: function() {"use strict"; page_mapping('configuration', 'config_rsys_ip')}}, index: "config_rsys_ip"}
            ]
        },

        {
            id: "remote_control",
            index: "remote",
            label: lang.LANG_TOPMENU_REMOTE_CONTROL,
            itemdata: [
                { text: lang.LANG_REMOTE_CNTRL_SUBMENU_CONSOLE_REDIRECTION, onclick: {fn: function() {"use strict"; page_mapping('remote', 'man_ikvm')}}, index: "man_ikvm" },
                { text: lang.LANG_REMOTE_CNTRL_SUBMENU_POWER_CONTROL, onclick: {fn: function() {"use strict"; page_mapping('remote', 'server_power_control')}}, index: "server_power_control" },
                { text: lang.LANG_REMOTE_CNTRL_SUBMENU_LAUNCH_SOL, onclick: {fn: function() {"use strict"; page_mapping('remote', 'man_sol')}}, index: "man_sol" },
                { text: lang.LANG_REMOTE_CNTRL_SUBMENU_VIRTUAL_FRONT_PANEL, onclick: {fn: function() {"use strict"; page_mapping('remote', 'v_front_panel')}}, index: "v_front_panel" },
                { text: lang.LANG_REMOTE_CNTRL_SUBMENU_IKVM_HTML5, onclick: {fn: function() {"use strict"; page_mapping('remote', 'man_ikvm_html5')}}, index: "man_ikvm_html5" }
            ]
        },
        {
            id: "virtual_media",
            index: "vmedia",
            label: lang.LANG_TOPMENU_VIRTUAL_MEDIA,
            itemdata: [
                { text: lang.LANG_VM_SUBMENU_VM_HTML5, onclick: {fn: function() {"use strict"; page_mapping('vmedia', 'vm_html5')}}, index: "vm_html5"},
                { text: lang.LANG_VM_SUBMENU_WEB_ISO, onclick: {fn: function() {"use strict"; page_mapping('vmedia', 'vm_webiso')}}, index: "vm_webiso"},
            ]
        },
        {
            id: "server_diag",
            index: "serverdiag",
            label: lang.LANG_TOPMENU_SERVER_DIAGNOSTICS,
            itemdata: [
                { text: lang.LANG_SERVER_DIAGNOSTICS_SUBMENU_SYS_DIAGNOSTICS, onclick: {fn: function() {"use strict"; page_mapping('serverdiag', 'servd_diag')}}, index: "servd_diag"},
                { text: lang.LANG_SERVER_DIAGNOSTICS_SUBMENU_POST_CODES, onclick: {fn: function() {"use strict"; page_mapping('serverdiag', 'servd_postcodes')}}, index: "servd_postcodes"},
                { text: lang.LANG_SERVER_DIAGNOSTICS_SUBMENU_DEFAULTS, onclick: {fn: function() {"use strict"; page_mapping('serverdiag', 'main_factorydefault')}}, index: "main_factorydefault"},
                { text: lang.LANG_SERVER_DIAGNOSTICS_SUBMENU_SOL_LOG, onclick: {fn: function() {"use strict"; page_mapping('serverdiag', 'servd_sol_log')}}, index: "servd_sol_log"}
            ]
        },
        {
            id: "misc",
            index: "miscellaneous",
            label: lang.LANG_TOPMENU_MISCELLANEOUS,
            itemdata: [
                { text: lang.LANG_MISC_SUBMENU_NM_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('miscellaneous', 'misc_nm_config')}}, index: "misc_nm_config" },
                { text: lang.LANG_MISC_SUBMENU_POWER_STATISTICS, onclick: {fn: function() {"use strict"; page_mapping('miscellaneous', 'misc_power_statistics')}}, index: "misc_power_statistics" },
                { text: lang.LANG_MISC_SUBMENU_POWER_TELEMETRY, onclick: {fn: function() {"use strict"; page_mapping('miscellaneous', 'misc_power_telemetry')}}, index: "misc_power_telemetry" }
            ]
        },
        {
            id: "bios_config",
            index: "bios_configuration",
            label: lang.LANG_TOPMENU_BIOS_CONFIGURATION,
            itemdata: [
                /*{ text: lang.LANG_BIOS_CONFIG_SUBMENU_NIC_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_nic_config')}}, index: "bios_config_nic_config" },*/
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_PCI_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_pci_config')}}, index: "bios_config_pci_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_SERIAL_PORT_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_serial_port_config')}}, index: "bios_config_serial_port_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_UPI_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_upi_config')}}, index: "bios_config_upi_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_INTEGRATED_IO_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_io_config')}}, index: "bios_config_io_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_MEMORY_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_memory_config')}}, index: "bios_config_memory_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_PWR_N_PERFORM, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_pwr_n_perform_config')}}, index: "bios_config_pwr_n_perform_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_PROCESSOR_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_processor_config')}}, index: "bios_config_processor_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_MASS_STORAGE_CTRL_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_mass_storage_ctrl_config')}}, index: "bios_config_mass_storage_ctrl_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_SYS_ACOUSTIC_PERFORM_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_sys_acoustic_perform_config')}}, index: "bios_config_sys_acoustic_perform_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_SYS_EVENT_LOG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_sys_event_log')}}, index: "bios_config_sys_event_log" },
                /*{ text: lang.LANG_BIOS_CONFIG_SUBMENU_HW_VAL_TEST, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_hw_val_test')}}, index: "bios_config_hw_val_test" },*/
                /*{ text: lang.LANG_BIOS_CONFIG_SUBMENU_FPGA_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_fpga_config')}}, index: "bios_config_fpga_config" },*/
                /*{ text: lang.LANG_BIOS_CONFIG_SUBMENU_ICC_SPREAD_SPEC_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_icc_spread_spec_config')}}, index: "bios_config_icc_spread_spec_config" },*/
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_SECURITY, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_security')}}, index: "bios_config_security" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_USB_CONFIG, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_usb_config')}}, index: "bios_config_usb_config" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_SERVER_MANAGEMENT, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_server_management')}}, index: "bios_config_server_management" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_ADVANCED_BOOT_OPTIONS, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_advanced_boot_options')}}, index: "bios_config_advanced_boot_options" },
                { text: lang.LANG_BIOS_CONFIG_SUBMENU_MAIN, onclick: {fn: function() {"use strict"; page_mapping('bios_configuration', 'bios_config_main')}}, index: "bios_config_main" }
            ]
        },
        {
            id: "raid",
            index: "sys_raid",
            label: lang.LANG_TOPMENU_RAID,
            itemdata: [
                { text: lang.LANG_RAID_SUBMENU_STORAGE_SYSTEM, onclick: {fn: function() {"use strict"; page_mapping('sys_raid', '0')}}, index: "0" },
                { text: lang.LANG_RAID_SUBMENU_CONTROLLER, onclick: {fn: function() {"use strict"; page_mapping('sys_raid', '1')}}, index: "1" },
                { text: lang.LANG_RAID_SUBMENU_PHYSICAL_DEVICES, onclick: {fn: function() {"use strict"; page_mapping('sys_raid', '2')}}, index: "2" },
                { text: lang.LANG_RAID_SUBMENU_LOGICAL_DEVICES, onclick: {fn: function() {"use strict"; page_mapping('sys_raid', '3')}}, index: "3" }
            ]
        }
    ];
    document.getElementById("cr").textContent =  lang.LANG_COMMON_COPYRIGHT;
    document.getElementById("_headerlogouttxt").textContent = lang.LANG_HEADER_LOGOUT;
    document.getElementById("_headerrefreshtxt").textContent = lang.LANG_HEADER_REFRESH;
    document.getElementById("_headerabouttxt").textContent = lang.LANG_HEADER_ABOUT;
    document.getElementById("_headerhelptxt").textContent = lang.LANG_HEADER_HELP;
    document.getElementById("system").textContent = lang.LANG_TOPMENU_SYSTEM;
    document.getElementById("health").textContent = lang.LANG_TOPMENU_SERVER_HEALTH;
    document.getElementById("configuration").textContent = lang.LANG_TOPMENU_CONFIGURATION;
    document.getElementById("remote").textContent = lang.LANG_TOPMENU_REMOTE_CONTROL;
    document.getElementById("vmedia").textContent = lang.LANG_TOPMENU_VIRTUAL_MEDIA;
    document.getElementById("serverdiag").textContent = lang.LANG_TOPMENU_SERVER_DIAGNOSTICS;
    document.getElementById("miscellaneous").textContent = lang.LANG_TOPMENU_MISCELLANEOUS;
    document.getElementById("bios_configuration").textContent = lang.LANG_TOPMENU_BIOS_CONFIGURATION;
    document.getElementById("sys_raid").textContent = lang.LANG_TOPMENU_RAID;
    document.getElementById("sys_raid").style.display = "none";
}

loadCustomStrings(RefreshMenuData);

function RemoveSubmenuKVM()
{
    "use strict";
    var itemdata_len;
    var submenu_count = submenu_obj.length;

    for (var i = 0; i < submenu_count; i++) {
        if (submenu_obj[i].index != "remote")
            continue;
        itemdata_len = submenu_obj[i].itemdata.length;
        for (var j = 0; j < itemdata_len; j++) {
            if (submenu_obj[i].itemdata[j].index == "man_sol"
                || submenu_obj[i].itemdata[j].index=="man_ikvm") {
                submenu_obj[i].itemdata.splice(j, 1);
            }
        }
    }
}

function RemoveSubmenuSWLicense()
{
    "use strict";
    var itemdata_len;
    var submenu_count = submenu_obj.length;

    for (var i = 0; i < submenu_count; i++) {
        if (submenu_obj[i].index != "configuration")
            continue;
        itemdata_len = submenu_obj[i].itemdata.length;
        for (var j = 0; j < itemdata_len; j++) {
            if (submenu_obj[i].itemdata[j].index == "config_soft_license") {
                submenu_obj[i].itemdata.splice(j, 1);
                break;
            }
        }
        break;
    }
}

function RemoveSubmenuCpld()
{
    "use strict";
    var itemdata_len;
    var submenu_count = submenu_obj.length;

    for (var i = 0; i < submenu_count; i++) {
        if (submenu_obj[i].index != "configuration")
            continue;
        itemdata_len = submenu_obj[i].itemdata.length;
        for (var j = 0; j < itemdata_len; j++) {
            if (submenu_obj[i].itemdata[j].index == "config_cpld_update") {
                submenu_obj[i].itemdata.splice(j, 1);
                break;
            }
        }
        break;
    }

}

function RemoveSubmenuSysEventLog()
{
    "use strict";
    var itemdata_len;
    var submenu_count = submenu_obj.length;

    for (var i = 0; i < submenu_count; i++) {
        if (submenu_obj[i].index != "bios_configuration")
            continue;
        itemdata_len = submenu_obj[i].itemdata.length;
        for (var j = 0; j < itemdata_len; j++) {
            if (submenu_obj[i].itemdata[j].index == "bios_config_sys_event_log") {
                submenu_obj[i].itemdata.splice(j, 1);
                break;
            }
        }
        break;
    }
}
function isMenuCustomDisabled(mainidx, subidx) {
    "use strict";
    if (custom && 'menus' in custom) {
    if (mainidx in custom.menus &&
              subidx in custom.menus[mainidx] &&
              'visible' in custom.menus[mainidx][subidx]) {
            var visible = custom.menus[mainidx][subidx].visible;
            //console.log('custom menubar: ' + mainidx + ', ' + subidx + ' visible: ' + visible);
            if ('0' == visible) {
                return true;
            }
        }
    }
    return false;
}

function DrawMenuBar(){
    "use strict";
    YAHOO.util.Event.onContentReady("productsandservices", function () {

    /*
                    Instantiate a MenuBar:  The first argument passed to the constructor
                    is the id for the Menu element to be created, the second is an
                    object literal of configuration properties.
    */

    var oMenuBar = new YAHOO.widget.MenuBar("productsandservices", {
                                                autosubmenudisplay: true,
                                                hidedelay: 750,
                                                lazyload: true });

    /*
         Define an array of object literals, each containing
         the data necessary to create a submenu.
    */

    var aSubmenuData = submenu_obj;


    /*
         Subscribe to the "beforerender" event, adding a submenu
         to each of the items in the MenuBar instance.
    */

    oMenuBar.subscribe("beforeRender", function ()
    {
        "use strict";
        var nSubmenus = aSubmenuData.length;

        if (this.getRoot() == this) {
            for (var i = 0; i < nSubmenus; i++)
            {
                for (var j = 0; j < aSubmenuData[i].itemdata.length; j++) {
                    // removed;
                    if (isMenuCustomDisabled(aSubmenuData[i].index, aSubmenuData[i].itemdata[j].index)) {
                        aSubmenuData[i].itemdata[j].disabled = true;
                    }
                }
                this.getItem(i).cfg.setProperty("submenu", aSubmenuData[i]);
            }
        }
    });

    /*
         Call the "render" method with no arguments since the
         markup for this MenuBar instance is already exists in
         the page.
    */

    oMenuBar.render();

});
}
/*global variable*/
var isHermon = 0;
var isAspeed = 0;
var isPilot3 = 0;
var isUID = 1;
var NMEnable = 0;
var c_mainpage, c_subpage;
var gHelpOpen = false;//INTEL-online

function do_logout()
{
    "use strict";
    UtilsConfirm(lang.LANG_GENERAL_LOGOUT, {onOk: goLogout});
}
function do_refresh()
{
    "use strict";
    MainFrame.location.reload();
}
function closeHelp()
{
    "use strict";
    gHelpOpen=false;
    document.getElementById("td_help").style.display = "none";
}

function openHelp()
{
    "use strict";
    document.getElementById("td_help").style.display = "block";
}

function toggleHelp()
{
    "use strict";
    gHelpOpen = !gHelpOpen;
    if(gHelpOpen)
    {
        openHelp();
    }else
    {
        closeHelp();
    }
}

function do_change_lan()
{
    "use strict";
    if(document.getElementById("lang_select").value == "en")
    {
        CreateSessionStorage("langSetFlag","1");
        CreateSessionStorage("language","English");
        top.lang_setting = "English";
    }else{
        CreateSessionStorage("langSetFlag","1");
        CreateSessionStorage("language","Japanese");
        top.lang_setting = "Japanese";
    }
    parent.frames.topmenu.location.reload();
}

function iframe_onload()
{
    "use strict";
    adjustIFramesHeightOnLoad(document.getElementById("frame_main"));
}

function adjustIFramesHeightOnLoad(iframe) {
    "use strict";
    var iframeHeight = Math.max(iframe.contentWindow.window.document.documentElement.scrollHeight,
                                iframe.contentWindow.window.document.body.scrollHeight);
    iframeHeight += 20;
    iframe.style.height = iframeHeight;
}

function clearChilds(node)
{
    "use strict";
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function page_mapping(mainpage, subpage)
{
    "use strict";
    /*main page [doris] test switch page cgi*/
    var page;
    CreateSessionStorage("mainpage", mainpage);
    CreateSessionStorage("subpage", subpage);
    c_mainpage = mainpage;
    c_subpage = subpage;
    if(subpage == 'top'){
        if ( mainpage == 'miscellaneous' && isHermon     == 1)
        {
            page = 'miscellaneous0';
        }
        else if ( mainpage == 'miscellaneous' && isHermon == 0 && NMEnable == 0)
        {
            page = 'miscellaneous1';
        }
        else if (mainpage == 'miscellaneous' && isAspeed == 0 && NMEnable == 1)
        {
                page = 'miscellaneous2';
        }
        else if (mainpage == 'miscellaneous' && isAspeed == 1 && NMEnable == 1 && isUID == 1)
        {
                page = 'miscellaneous4';
        }
        else if (mainpage == 'miscellaneous' && isAspeed == 1 && NMEnable == 1)
        {
                page = 'miscellaneous3';
        }
        else if ( mainpage == 'miscellaneous' && isAspeed == 1)
        {
            page = 'miscellaneous0';
        }
        else
        {
            page = mainpage.toString();
        }
        var str= '../cgi/url_redirect.cgi?url_name=' + page;
        document.getElementById("frame_main").src = str;
    }
    else
    {
         if( mainpage == 'bios_configuration')
         {
             var getInput = subpage;
             localStorage.setItem("pageClick", getInput);
             var str= '../cgi/url_redirect.cgi?url_name=' + 'bios_config_oob' + '&' + 'page_click=' + subpage;
         }
         else if( mainpage == 'sys_raid') {
             localStorage.setItem("pageClick", subpage);
             var str= '../cgi/url_redirect.cgi?url_name=' + 'sys_raid' + '&' + 'page_click=' + subpage;
         }
         else
             var str= '../cgi/url_redirect.cgi?url_name=' + subpage;
        document.getElementById("frame_main").src = str;
    }

    /*sidebar page*/
    var sidbar_pool = document.getElementById("sidebar");
    /*clear sidebar*/
    while(sidbar_pool.rows.length > 0)
        sidbar_pool.deleteRow(sidbar_pool.rows.length - 1);

    var submenu_count = submenu_obj.length;

    /*tile*/
    var i, j, idx, selected_obj;
    for (idx = 0; idx < submenu_count; idx++)
    {
        selected_obj = document.getElementById(submenu_obj[idx].index);
        if( mainpage == submenu_obj[idx].index ) {
            i = idx;
            selected_obj.style.fontWeight = "bold";
        }
        else {
            selected_obj.style.fontWeight = "";
        }
    }
    var tr = document.getElementById('sidebar').insertRow(-1);
    var td = tr.insertCell(0);
    tr.className = 'submenu_position';
    var submenu_len = submenu_obj[i].itemdata.length;
    var aElement;

    for(var j = 0; j < submenu_len; j++)
    {
        aElement = document.createElement('a');
        if (submenu_obj[i].itemdata[j].onclick) {
            aElement.onclick = submenu_obj[i].itemdata[j].onclick.fn;
            aElement.href = "#";
        } else {
            aElement.href = submenu_obj[i].itemdata[j].url;
        }
        aElement.textContent = submenu_obj[i].itemdata[j].text;
        var div = document.createElement('div');
        div.className = 'submenu_line';
        if (isMenuCustomDisabled(submenu_obj[i].index, submenu_obj[i].itemdata[j].index)) {
            submenu_obj[i].itemdata[j].grayout = MENUITEM_INVISIBLE;
            aElement.className = "submenu_removed"
            div.className += " submenu_removed"
        }
        if(submenu_obj[i].itemdata[j].grayout == MENUITEM_GRAY) {
        } else if(submenu_obj[i].itemdata[j].grayout == MENUITEM_INVISIBLE) {
            aElement.style.color = "gray";
            aElement.href="#";
            aElement.className = "submenu_removed"
            div.className += " submenu_removed"
        }

        if(subpage == submenu_obj[i].itemdata[j].index)
            aElement.className += ' submenu_item_select';
        else
            aElement.className += ' submenu_item';
        if(subpage == 'sys_raid' && submenu_obj[i].itemdata[j].index == 0)
            aElement.className += ' submenu_item_select';
        td.appendChild(aElement);
        td.appendChild(div);
    }
}

function gray_out_by_priviledge()
{
    "use strict";
    PRIVILEGE_LIMIT = PRIV_ID;
    var i, idx;
    var numSubmenuItems;
    var submenu_count = submenu_obj.length;
    for (idx = 0; idx < submenu_count; idx++)
    {
        //selected_obj = document.getElementById(submenu_obj[idx].index);
        if( submenu_obj[idx].index == "system") {
            numSubmenuItems = submenu_obj[idx].itemdata.length;
            for(i=0; i<numSubmenuItems; i++) {
                if(PRIVILEGE_LIMIT == '03' || PRIVILEGE_LIMIT == '02')
                {
                    if(submenu_obj[idx].itemdata[i].index=="sys_currentusers")
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                }
            }
        } else if(submenu_obj[idx].index == "configuration") {
            numSubmenuItems = submenu_obj[idx].itemdata.length;
            for(i=0; i<numSubmenuItems; i++) {
                if(submenu_obj[idx].itemdata[i].index=="config_ipv4"
                    || submenu_obj[idx].itemdata[i].index=="config_ipv6"
                    || submenu_obj[idx].itemdata[i].index=="config_usr"
                    || submenu_obj[idx].itemdata[i].index=="config_vlan"
                    || submenu_obj[idx].itemdata[i].index=="config_alert"
                    || submenu_obj[idx].itemdata[i].index=="config_datetime"
                    || submenu_obj[idx].itemdata[i].index=="config_security_settings"
                    || submenu_obj[idx].itemdata[i].index=="config_sdr_fw") {
                    if(PRIVILEGE_LIMIT == '02') { //user
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                    }
                    if(PRIVILEGE_LIMIT == '03') { //oper
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_GRAY;
                    }
                } else if(submenu_obj[idx].itemdata[i].index=="config_kvm_mouse" ||
                          submenu_obj[idx].itemdata[i].index=="config_sol_smash" ||
                          submenu_obj[idx].itemdata[i].index=="config_fw_update" ||
                          submenu_obj[idx].itemdata[i].index=="config_soft_license" ||
                          submenu_obj[idx].itemdata[i].index=="config_ad" ||
                          submenu_obj[idx].itemdata[i].index=="config_ldap") {
                    if(PRIVILEGE_LIMIT == '02' || PRIVILEGE_LIMIT == '03') {
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_GRAY;
                    }
                }
            }
        } else if(submenu_obj[idx].index == "remote") {
            numSubmenuItems = submenu_obj[idx].itemdata.length;
            for(i=0; i<numSubmenuItems; i++) {
                if(submenu_obj[idx].itemdata[i].index=="man_ikvm"
                    || submenu_obj[idx].itemdata[i].index=="man_sol"
                    || submenu_obj[idx].itemdata[i].index=="man_ikvm_html5") {
                    if(PRIVILEGE_LIMIT == '02' || PRIVILEGE_LIMIT == '03') {
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                        submenu_obj[idx].itemdata[i].url = "#";
                    }
                }
            }
        } else if(submenu_obj[idx].index == "vmedia") {
            numSubmenuItems = submenu_obj[idx].itemdata.length;
            for(i=0; i<numSubmenuItems; i++) {
                if(submenu_obj[idx].itemdata[i].index=="vm_webiso"
                    || submenu_obj[idx].itemdata[i].index=="vm_html5") {
                    if(PRIVILEGE_LIMIT == '02' || PRIVILEGE_LIMIT == '03') {
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                        submenu_obj[idx].itemdata[i].url = "#";
                    }
                }
            }
        } else if(submenu_obj[idx].index == "serverdiag") {
            numSubmenuItems = submenu_obj[idx].itemdata.length;
            for(i=0; i<numSubmenuItems; i++) {
                if(submenu_obj[idx].itemdata[i].index=="main_factorydefault") {
                    if(PRIVILEGE_LIMIT == '02' || PRIVILEGE_LIMIT == '03') { //only Administor can view
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                    }
                } else if(submenu_obj[idx].itemdata[i].index=="servd_sol_log") {
                    if(PRIVILEGE_LIMIT == '02') {  //only Operator and above can view
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                    }
                } else if(submenu_obj[idx].itemdata[i].index=="servd_postcodes") {
                           if(PRIVILEGE_LIMIT == '02') {
                               submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                           }
                }
            }
        } else if(submenu_obj[idx].index == "maintenance") {
            numSubmenuItems = submenu_obj[idx].itemdata.length;
            for(i=0; i<numSubmenuItems; i++) {
                if(PRIVILEGE_LIMIT == '02') {
                    submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                } else if(PRIVILEGE_LIMIT == '03') {
                    submenu_obj[idx].itemdata[i].grayout = MENUITEM_GRAY;
                }
            }
        } else if(submenu_obj[idx].index == "miscellaneous") {
            numSubmenuItems = submenu_obj[idx].itemdata.length;
            for(i=0; i<numSubmenuItems; i++) {
                if (submenu_obj[idx].itemdata[i].index == "misc_nm_config" ||
                    submenu_obj[idx].itemdata[i].index == "misc_power_statistics")
                {
                    if ((PRIVILEGE_LIMIT == '02') || (PRIVILEGE_LIMIT == '03')) {
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                    }
                }
                else if (submenu_obj[idx].itemdata[i].index == "misc_power_telemetry")
                {
                    if (PRIVILEGE_LIMIT == '02') {
                        submenu_obj[idx].itemdata[i].grayout = MENUITEM_INVISIBLE;
                    }
                }
            }
        } else if(submenu_obj[idx].index == "bios_configuration") {
            numSubmenuItems = submenu_obj[idx].itemdata.length;
            for(i=0; i<numSubmenuItems; i++) {
                if(submenu_obj[idx].itemdata[i].index=="bios_config_nic_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_pci_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_serial_port_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_upi_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_io_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_memory_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_pwr_n_perform_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_processor_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_mass_storage_ctrl_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_sys_acoustic_perform_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_sys_event_log"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_hw_val_test"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_fpga_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_icc_spread_spec_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_security"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_usb_config"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_server_management"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_advanced_boot_options"
                    || submenu_obj[idx].itemdata[i].index=="bios_config_main") {
                }
            }
        }
    }
}

var gIgnoreResetTimer = null;
var gSessionExpiredTimer = null;
var gHeartbeatTimestamp = 0;

function resetIdleTimer() {
    "use strict";
    //reset timer
    if(gIgnoreResetTimer == null) {
        gIgnoreResetTimer = setTimeout(clearIdleTimer, 5000);
        resetSessionExpired();
    }
}

function clearIdleTimer() {
    "use strict";
    gIgnoreResetTimer = null;
}


function eventlog(x, y) {
    "use strict";
    //$("#result").html("x:" + x + ", y:" + y);
}

jQuery(document).ready(function() {
    "use strict";
    jQuery(document).bind("mousemove", function(e) {
        "use strict";
        resetIdleTimer();
});

jQuery(document).bind("keypress", function(e){
        "use strict";
        resetIdleTimer();
    });
});

function onSessionExpired() {
    "use strict";
    checkSessionExpired();
}

function launchSessionExpiredTimer() {
    if(gSessionExpiredTimer != null) {
    "use strict";
        clearInterval(gSessionExpiredTimer);
        gSessionExpiredTimer = null;
    }
    var expiredTimeout = ReadSessionStorage("gSESSIONTIMEOUT");
    if(expiredTimeout && parseInt(expiredTimeout) < 0) {
        return; // disable timeout check, leave without enable timer to check session
    }
    if(expiredTimeout == null || parseInt(expiredTimeout) < 10000) {
        //default interval of session check timer.
        expiredTimeout = 10000;//10sec
    }
    gSessionExpiredTimer = setInterval(onSessionExpired, expiredTimeout);
}

function lanuchSessionHeartbeatTimer() {
    "use strict";
    /********************************************************
    This event listener only for safari,
    There is timer latency issue on Safari when screen blanks,
    so we do not prefereed heartbeat process in Safari.
    we use window/tab close event listener to fix this issue.
    ********************************************************/
    var browser_info = GetBrowserInfo();
    if(browser_info == "safari") {
        initSafariChecker();
    }
    else {
        mHeartbeatTimer.start();  // the first run.
    }
}

function PreloadPageInit() {
    "use strict";
    if(CSRF_TOKEN == null || CSRF_TOKEN.length < 1) {
        // no CSRF_Token, request a new CSRF Token then PageInit().
        requestReloadCSRFToken(PageInit);
    }
    else {
        PageInit();
    }
    GetBoardInfo();
}

function PageInit()
{
    "use strict";
    checkSessionExpired();
    launchSessionExpiredTimer();
    lanuchSessionHeartbeatTimer();

    document.getElementById("td_help").style.display = "none";//default is hidden

    document.getElementById("_headerlogoutlink").addEventListener("click", do_logout);
    document.getElementById("_headerlogoutlink").addEventListener("mouseover",
            function() {
                "use strict";
                icon_over('_headerlogoutimg', '../images/logout_over.png');
            });
    document.getElementById("_headerlogoutlink").addEventListener("mouseout",
            function() {
                "use strict";
                icon_over('_headerlogoutimg', '../images/logout.png');
            });

    document.getElementById("_headerrefreshlink").addEventListener("click", do_refresh);
    document.getElementById("_headerrefreshlink").addEventListener("mouseover",
            function() {
                "use strict";
                icon_over('_headerrefreshimg', '../images/refresh_over.png');
            });
    document.getElementById("_headerrefreshlink").addEventListener("mouseout",
            function() {
                "use strict";
                icon_over('_headerrefreshimg', '../images/refresh.png');
            });

    document.getElementById("_headerhelplink").addEventListener("click", toggleHelp);
    document.getElementById("_headerhelplink").addEventListener("mouseover",
            function() {
                "use strict";
                icon_over('_headerhelpimg', '../images/help_over.png');
            });
    document.getElementById("_headerhelplink").addEventListener("mouseout",
            function() {
                "use strict";
                icon_over('_headerhelpimg', '../images/help.png');
            });

    document.getElementById("_headeraboutlink").addEventListener("click", do_about);
    document.getElementById("_headeraboutlink").addEventListener("mouseover",
            function() {
                "use strict";
                icon_over('_headeraboutimg', '../images/about_over.png');
            });
    document.getElementById("_headeraboutlink").addEventListener("mouseout",
            function() {
                "use strict";
                icon_over('_headeraboutimg', '../images/about.png');
            });

    document.getElementById("system").addEventListener("click",
            function() {
                "use strict";
                page_mapping('system', 'sys_info');
            });

    document.getElementById("health").addEventListener("click",
            function() {
                "use strict";
                page_mapping('health', 'servh_sensor');
            });

    document.getElementById("configuration").addEventListener("click",
            function() {
                "use strict";
                page_mapping('configuration', 'config_alert');
            });

    document.getElementById("remote").addEventListener("click",
            function() {
                "use strict";
                if (PAM_AUTH == 'IPMI_AUTH') {
                    page_mapping('remote', 'man_ikvm');
                } else {
                    page_mapping('remote', 'server_power_control');
                }
            });

    document.getElementById("vmedia").addEventListener("click",
            function() {
                "use strict";
                page_mapping('vmedia', 'vm_webiso');
            });

    document.getElementById("vmedia").addEventListener("click",
            function() {
                "use strict";
                page_mapping('vmedia', 'vm_html5');
            });

    document.getElementById("serverdiag").addEventListener("click",
            function() {
                "use strict";
                page_mapping('serverdiag', 'servd_diag');
            });

    document.getElementById("miscellaneous").addEventListener("click",
            function() {
                "use strict";
                page_mapping('miscellaneous', 'misc_nm_config');
            });

    document.getElementById("bios_configuration").addEventListener("click",
            function() {
                "use strict";
                page_mapping('bios_configuration', 'bios_config_pci_config');
            });

    document.getElementById("sys_raid").addEventListener("click",
            function() {
                "use strict";
                page_mapping('sys_raid', 'sys_raid');
            });

    GetSoftLicenseInfo();

    var nodeObj;
    var nodeImg;
    // LOGOUT
    document.getElementById('_headerlogoutlink').onmouseover = function()
    {
        "use strict";
        nodeObj = document.getElementById('_headerlogouttxt');
        nodeObj.className = 'topmenu_text_hover';
        nodeImg = document.getElementById('_headerlogoutimg');
        nodeImg.src = '../images/logout_over.png';
    }
    document.getElementById('_headerlogoutlink').onmouseout = function()
    {
        "use strict";
        nodeObj = document.getElementById('_headerlogouttxt');
        nodeObj.className = 'topmenu_text';
        nodeImg = document.getElementById('_headerlogoutimg');
        nodeImg.src = '../images/logout.png';
    }
    // REFRESH
    document.getElementById('_headerrefreshlink').onmouseover = function()
    {
        "use strict";
        nodeObj = document.getElementById('_headerrefreshtxt');
        nodeObj.className = 'topmenu_text_hover';
        nodeImg = document.getElementById('_headerrefreshimg');
        nodeImg.src = '../images/refresh_over.png';
    }
    document.getElementById('_headerrefreshlink').onmouseout = function()
    {
        "use strict";
        nodeObj = document.getElementById('_headerrefreshtxt');
        nodeObj.className = 'topmenu_text';
        nodeImg = document.getElementById('_headerrefreshimg');
        nodeImg.src = '../images/refresh.png';
    }
    // HELP
    document.getElementById('_headerhelplink').onmouseover = function()
    {
        "use strict";
        nodeObj = document.getElementById('_headerhelptxt');
        nodeObj.className = 'topmenu_text_hover';
        nodeImg = document.getElementById('_headerhelpimg');
        nodeImg.src = '../images/help_over.png';
    }
    document.getElementById('_headerhelplink').onmouseout = function()
    {
        "use strict";
        nodeObj = document.getElementById('_headerhelptxt');
        nodeObj.className = 'topmenu_text';
        nodeImg = document.getElementById('_headerhelpimg');
        nodeImg.src = '../images/help.png';
    }
    // ABOUT
    document.getElementById('_headeraboutlink').onmouseover = function()
    {
        "use strict";
        nodeObj = document.getElementById('_headerabouttxt');
        nodeObj.className = 'topmenu_text_hover';
        nodeImg = document.getElementById('_headeraboutimg');
        nodeImg.src = '../images/about_over.png';
    }
    document.getElementById('_headeraboutlink').onmouseout = function()
    {
        "use strict";
        nodeObj = document.getElementById('_headerabouttxt');
        nodeObj.className = 'topmenu_text';
        nodeImg = document.getElementById('_headeraboutimg');
        nodeImg.src = '../images/about.png';
    }
    //gray_out_by_priviledge();
}

function ReloadSubMenu()
{
    "use strict";

    DrawMenuBar();
    if(navigator.userAgent.indexOf("MSIE 9") != -1) {
            document.getElementById("frame_main").onload = iframe_onload;
    }

    if(ReadSessionStorage("langSetFlag") == "1") {
        CreateSessionStorage("langSetFlag","0");
        if(ReadSessionStorage("mainpage") == null || ReadSessionStorage("subpage") == null) {
            CreateSessionStorage("mainpage", "system");
            CreateSessionStorage("subpage", "sys_info");
            page_mapping('system', 'sys_info');
        } else {
            page_mapping(ReadSessionStorage("mainpage"), ReadSessionStorage("subpage"));
        }
    } else {
        page_mapping('system', 'sys_info');
    }
    resetIdleTimer();
}

function rf_system_sn() {
    return RF_SYSTEM_SN;
}

function getSessionID() {
    return SID;
}

function PageInit2(response) {
    "use strict";
    if(response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);
        if(xml_obj != null) {
            var mMCUType = GetXMLNodeValue(xml_obj, "MCU_TYPE");
            var PFRSupported = GetXMLNodeValue(xml_obj, "PFR_SUPPORT");
            SID = GetXMLNodeValue(xml_obj, "SESSIONID");
            if(mMCUType == "ASPEED") {
                isAspeed = 1;
            }
        }

        NMEnable = 1;
        gray_out_by_priviledge();

        if (PFRSupported == "No")
            RemoveSubmenuCpld();

        // If the authentication source of the login account is not IPMI
        // the following items will be hidden.
        if (PAM_AUTH != 'IPMI_AUTH') {
            RemoveSubmenuKVM();
        }
        rf_get_system_sn();
    }
}

function PageInit3(response) {
    "use strict";
    if(response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);
        if(xml_obj != null) {
            product_id = GetXMLNodeValue(xml_obj, "PRODUCT_ID");
            if (product_id === PRODUCT_ID_WALKER_PASS) {
                RemoveSubmenuSysEventLog();
            }
        }
        rf_get_system_sn();
    }
}

function GetSoftLicenseType(response) {
    "use strict";
    if(response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);

        // if get Soft License Type is null, retry 5 times
        if (xml_obj == null) {
            if (swl_retry > 4) {
                SessionTimeout();
                return;
            }
            swl_retry++;

            if (CSRF_TOKEN == null || CSRF_TOKEN.length < 1) {
                setTimeout(requestReloadCSRFToken(), 100);
            }

            GetSoftLicenseInfo();
            return;
        }

        var swl_type = GetXMLNodeValue(xml_obj, "SWL_TYPE");
        if (swl_type != "SWLIC") {
            NMEnable = 1;
            gray_out_by_priviledge();
            RemoveSubmenuSWLicense();
        }
        ReloadSubMenu();
    }
}

function icon_over(img_name, img_src) {
    "use strict";
    var nodeImg = document.getElementById(img_name);
    nodeImg.src = img_src;
}

var mHeartbeatTimer = {
    id: Date.now(),
    timer_delay: g_heartbeat_interval,
    handler:null,
    start: function() {
        "use strict";
        mHeartbeatTimer.handler = setTimeout(mHeartbeatTimer.ontimer, mHeartbeatTimer.timer_delay);
        //console.log("timer-" + mHeartbeatTimer.id + ": start);
    },
    restart: function() {
        "use strict";
        //console.log("timer-" + mHeartbeatTimer.id + ": restart");
        mHeartbeatTimer.stop();
        mHeartbeatTimer.start();
    },
    stop: function() {
        "use strict";
        if(mHeartbeatTimer.handler != null) {
            //console.log("timer-" + mHeartbeatTimer.id + ": remove");
            clearTimeout(mHeartbeatTimer.handler);
            mHeartbeatTimer.handler = null;
        }
    },
    ontimer: function() {
        "use strict";
        //console.log("timer-" + mHeartbeatTimer.id + ": ontimer");
        var url = '/cgi/heartbeat.cgi';
        var ajax_data = GeneGenericRequestXML();
        var ajax_request = new Ajax.Request(
            url,
            {
                method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: 10000,
                onComplete: mHeartbeatTimer.onHeartbeatComplete
            }
        );
    },
    onHeartbeatComplete: function(originalRequest) {
        "use strict";
        var launchNextTimer = true;
        //console.log("timer-" + mHeartbeatTimer.id + ": onHeartbeatComplete");
        if (originalRequest.readyState == 4 && originalRequest.status == 200){
            var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
            var xmldoc = GetResponseXML(response);
            if(xmldoc != null) {
                if (CheckInvalidResult(xmldoc) < 0) {
                    launchNextTimer = false;
                }
            }
        } else if (originalRequest.readyState == 4 && originalRequest.status == 404) {
            //console.log("Session no longer valid, logout");
            goLogout();
        }
        //set next timer to check heartbeat after this time heartbeat check complete.
        if(launchNextTimer == true) {
            mHeartbeatTimer.restart();
        }
    }
}
