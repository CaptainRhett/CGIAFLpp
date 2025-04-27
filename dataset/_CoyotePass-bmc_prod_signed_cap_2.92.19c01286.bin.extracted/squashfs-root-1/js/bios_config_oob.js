"use strict";
/*Miscelilaneous power telemetry page*/

var GridTable;
var DevID = [];
var DevTYPE = [];
var REG_Content = new Array();
var REG_count= 16;
var totalItem= 0;
var index_value = 0;
var prev_index = 0;
var btnModifyPolicy;
var btnCancelPolicy;
const Max_limit = 65536;
var TableTitles = [["Key Value", "25%", "center"],
                   ["Bios Variable Descripton", "25%", "center"],
                   ["Value", "25%", "center"],
                   ["SavedValue", "25%", "center"],
                    ["ID", "0", "center"],
                  ];
var Bios_PG = new Array();
var Bios_Variables =  new Array();
var Bios_Variables_current = new Array();
var Bios_Variables_only_val =  new Array();
var Bios_Variables_val = new Array();
var Bios_Variables_set = new Array();
var Bios_Variable_depex = new Array();
var Bios_Variable_Newdepex = new Array();
var Bios_Variable_saved = new Array();
var Bios_Var_val_only = new Array();
var Bios_Var_name = new Array();
var idx = 0;
var Bios_Variable_pending = new Array();
var Bios_Variable_pending_display = 0;
var Bios_Variable_modified = 0;

var page_bios_type_name_mapping_table = {
    //bios_config_nic_config:                     "NIC Configuration",
    bios_config_pci_config:                     "PCI Configuration",
    bios_config_serial_port_config:             "Serial Port Configuration",
    bios_config_upi_config:                     "UPI Configuration",
    bios_config_io_config:                      "Integrated IO Configuration",
    bios_config_memory_config:                  "Memory Configuration",
    bios_config_pwr_n_perform_config:           "Power n Performance",
    bios_config_processor_config:               "Processor Configuration",
    bios_config_mass_storage_ctrl_config:       "Mass Storage Controller Configuration",
    bios_config_sys_acoustic_perform_config:    "System Acoustic and Performance Configuration",
    bios_config_sys_event_log:                  "System Event Log",
    bios_config_hw_val_test:                    "HW Validation Test Only",
    //bios_config_fpga_config:                    "FPGA Configuration",
    //bios_config_icc_spread_spec_config:         "Override ICC Spread Spectrum Configuration",
    bios_config_security:                       "Security",
    bios_config_usb_config:                     "USB Configuration",
    bios_config_server_management:              "Server Management",
    bios_config_advanced_boot_options:          "Advanced Boot Options",
    bios_config_main:                           "Main",
};

var Bios_var_type;
var Bios_var_value;
var Bios_text_value;
var HtmlRegTable;
var query_bios_type;
var bios_config_login = "../cgi/url_redirect.cgi?url_name=bios_config_login";
var lang;
var origin_option;
var exception_option;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit(){
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/bios_config_oob_hlp.html";
    Bios_var_type = document.getElementById("Bios_var_type");
    origin_option = document.getElementById("origin_option");
    exception_option = document.getElementById("exception_option");
    origin_option.show();
    exception_option.hide();
    Bios_var_value = document.getElementById("Bios_var_value");
    Bios_text_value = document.getElementById("Bios_text_value");
    HtmlRegTable = document.getElementById("HtmlRegTable");
    BiosTableInit();
    var name;
    var page=getParamValue('page_click');
    switch(page) {
        //case 'bios_config_nic_config':                  name = lang.LANG_BIOS_CONFIGURATION_NIC_CONFIG_TITLE;
        //                                                break;
        case 'bios_config_pci_config':                  name =  lang.LANG_BIOS_CONFIGURATION_PCI_CONFIG_TITLE;
                                                        break;
        case 'bios_config_serial_port_config':          name = lang.LANG_BIOS_CONFIGURATION_SERIAL_PORT_CONFIG_TITLE;
                                                        break;
        case 'bios_config_upi_config':                  name = lang.LANG_BIOS_CONFIGURATION_UPI_CONFIG_TITLE;
                                                        break;
        case 'bios_config_io_config':                   name = lang.LANG_BIOS_CONFIGURATION_INTEGRATED_IO_CONFIG_TITLE;
                                                        break;
        case 'bios_config_memory_config':               name = lang.LANG_BIOS_CONFIGURATION_MEMORY_CONFIG_TITLE;
                                                        break;
        case 'bios_config_pwr_n_perform_config':        name = lang.LANG_BIOS_CONFIGURATION_PWR_N_PERFORM_TITLE;
                                                        break;
        case 'bios_config_processor_config':            name = lang.LANG_BIOS_CONFIGURATION_PROCESSOR_CONFIG_TITLE;
                                                        break;
        case 'bios_config_mass_storage_ctrl_config':    name = lang.LANG_BIOS_CONFIGURATION_MASS_STORAGE_CTRL_CONFIG_TITLE;
                                                        break;
        case 'bios_config_sys_acoustic_perform_config': name = lang.LANG_BIOS_CONFIGURATION_SYS_ACOUSTIC_PERFORM_CONFIG_TITLE;
                                                        break;
        case 'bios_config_sys_event_log':               name = lang.LANG_BIOS_CONFIGURATION_SYS_EVENT_LOG_TITLE;
                                                        break;
        case 'bios_config_hw_val_test':                 name = lang.LANG_BIOS_CONFIGURATION_HW_VAL_TEST_TITLE;
                                                        break;
        //case 'bios_config_fpga_config':                 name = lang.LANG_BIOS_CONFIGURATION_FPGA_CONFIG_TITLE;
        //                                                break;
        //case 'bios_config_icc_spread_spec_config':      name = lang.LANG_BIOS_CONFIGURATION_ICC_SPREAD_SPEC_CONFIG_TITLE;
        //                                                break;
        case 'bios_config_security':                    name = lang.LANG_BIOS_CONFIGURATION_SECURITY_TITLE;
                                                        break;
        case 'bios_config_usb_config':                  name = lang.LANG_BIOS_CONFIGURATION_USB_CONFIG_TITLE;
                                                        break;
        case 'bios_config_server_management':           name = lang.LANG_BIOS_CONFIGURATION_SERVER_MANAGEMENT_TITLE;
                                                        break;
        case 'bios_config_advanced_boot_options':       name = lang.LANG_BIOS_CONFIGURATION_ADVANCED_BOOT_OPTIONS_TITLE;
                                                        break;
        case 'bios_config_main':                        name = lang.LANG_BIOS_CONFIGURATION_MAIN_TITLE;
                                                        break;
        default                                :        name = lang.LANG_BIOS_CONFIGURATION_PCI_CONFIG_TITLE;
                                                        page = 'bios_config_pci_config';
                                                        break;
    }
    query_bios_type = page_bios_type_name_mapping_table[page];
    document.getElementById("caption_div").textContent = name;
    document.getElementById("bios_var_lbl").textContent = lang.LANG_BIOS_CFG_BIOS_VAR_SELECT;
    document.getElementById("bios_value_lbl").textContent = lang.LANG_BIOS_CFG_BIOS_VAR_VALUE;
    document.getElementById("bios_pg_lbl").textContent = lang.LANG_BIOS_CFG_SETUP_PG;

    if (ReadSessionStorage("KCSMode") == null) {
        KCSModeStatus();
    }

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);

    Bios_var_type.onchange = takeRegContent;
    Bios_var_value.onchange = takeVarContent;

    Bios_text_value.onkeyup = checkInputValue;

    btnModifyPolicy = document.getElementById("btn_modify");
    btnModifyPolicy.setAttribute("value",lang.LANG_BIOS_CONFIGURATION_BTNSAV);
    btnCancelPolicy = document.getElementById("btn_cancel");
    btnCancelPolicy.setAttribute("value",lang.LANG_BIOS_CONFIGURATION_BTNCANCEL);


    btnModifyPolicy.onclick = function() {
        "use strict";
        setBiosvarables();

    }

    btnCancelPolicy.onclick = function() {
        "use strict";
        //cancel
        location.reload();
    }
}

function KCSModeStatus()
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
                                     asynchronous: false,
                                     onComplete: readKCSModeStatus
                                    });
}
function ParseBios_OOB_Capbilities(originalRequest)
{
    "use strict";
    Loading(false);

    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
         var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
         var xmldoc=GetResponseXML(response);
         if(xmldoc == null)
         {
            SessionTimeout();
            alert(lang.LANG_BIOS_CFG_OFF_NOTE);
            return;
         }
         //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
         }
         var IPMIRoot = xmldoc.documentElement;
         var OOB_INFO = IPMIRoot.getElementsByTagName('OOB_INFO');
         var ENABLE_STATE  = OOB_INFO[0].getElementsByTagName('OOB_ENABLE_STATE');
         var bios_config_enable_value = ENABLE_STATE[0].getAttribute("BIOS_CONFIG_ENABLE");
         if(bios_config_enable_value == 'No'){
             alert(lang.LANG_CONFIG_BIOS_OOB_CFG_NO_SUPPORT);
             return ;
         }
         getsavedBiosvariables();
         getBiosvariables();
   }
}

function CheckBios_OOB_Capabilities(){
    "use strict";
    Loading(true);
    var url = '/cgi/get_oob_state.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_param = '';
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "</IPMI>\n";
    var myAjax = new Ajax.Request(url, {
            method: 'post',
            contentType: 'text/xml',
            xml_data: ajax_data,
            parameters:ajax_param,
            timeout: 90000,
            ontimeout: onCGIRequestTimeout,
            onComplete: ParseBios_OOB_Capbilities
        });
}


function getParamValue(paramName)
{
    "use strict";
    var url = window.location.search.substring(1);//get rid of "?" in querystring
    var qArray = url.split('&');//get key-value pairs
    for(var i = 0; i < qArray.length; i++)
    {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName)
            return pArr[1]; //return value
    }
}



function BiosTableInit()
{
    "use strict";
    GridTable = GetTableElement();
    //replace table header content with string table
    TableTitles[0][0] = lang.LANG_BIOS_CFG_KEY_VALUE;
    TableTitles[1][0] = lang.LANG_BIOS_CFG_BIOS_VAR_DESC;
    TableTitles[2][0] = lang.LANG_BIOS_CFG_VALUE;
    TableTitles[3][0] = lang.LANG_BIOS_CFG_SAVED_VALUE;

    GridTable.setColumns(TableTitles);
    GridTable.init('GridTable', HtmlRegTable);
    GridTable.registeSelectedCallback(bind_click_for_GridTable_cell);

}
function PrivilegeCallBack(Privilege)
{
    "use strict";
    //full access
    if (Privilege == '04' || Privilege == '03')
    {
        let KCSMode = ReadSessionStorage("KCSMode");
        if (KCSMode == "allow_all") {
           CheckBios_OOB_Capabilities();
        } else {
           alert(lang.CONF_KCS_BIOS_WARNING_NO_SUPPORT);
        }
    }
    else
    {
        //no access
        location.href = SubMainPage;
        return;
    }
}


function getBiosvariables()
{
    "use strict";
    Loading(true);
    var url = '/cgi/bios_config_oob.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_param = '';
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <BIOSVARIABLE>\n";
    ajax_data += "        <BIOSVARIABLE_TYPE>" + query_bios_type + "</BIOSVARIABLE_TYPE>\n";
    ajax_data += "    </BIOSVARIABLE>\n";
    ajax_data += "</IPMI>\n";
    var myAjax = new Ajax.Request(
                            url,
                            {method: 'post',
                            contentType: 'text/xml',
                            xml_data: ajax_data,
                            parameters:ajax_param,
                            timeout: 90000,
                            ontimeout: onCGIRequestTimeout,
                            onComplete:showBiosvariables }//reigister callback function
                            );
}



function setBiosvarables()
{
    "use strict";
    if (Bios_Variables_set[5] == "BootTimeout" || Bios_Variables_set[5] == "EarlyBootTimeout") {
        var reg = /^([0-9]+)$/;
        var value = Bios_text_value.value;

        if (! reg.test(value)) {
            alert(lang.LANG_BIOS_CFG_BIOS_ERR);
            setTimeout(function(){ location.reload(); }, 2000);
            return;
        } else {
            // The input value range is 0 ~ 65535
            if(value < 0 || value > 65535) {
                alert(lang.LANG_BIOS_CFG_BIOS_ERR);
                setTimeout(function(){ location.reload(); }, 2000);
                return;
            }
        }
    }

    Loading(true);
    var url = '/cgi/bios_config_set.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_param = '';
    var ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <BIOSVARIABLE>\n";
    ajax_data += "        <BIOSVARIABLE_NAME>" + Bios_Variables_set[0] + "</BIOSVARIABLE_NAME>\n";
    ajax_data += "        <BIOSVARIABLE_DESC>" + Bios_Variables_set[1] + "</BIOSVARIABLE_DESC>\n";
    ajax_data += "        <BIOSVARIABLE_VAL>" + Bios_Variables_set[2] + "</BIOSVARIABLE_VAL>\n";
    ajax_data += "        <BIOSVARIABLE_VAL_OPTS>" + Bios_Variables_set[4] + "</BIOSVARIABLE_VAL_OPTS>\n";
    ajax_data += "        <BIOSVARIABLE_VAL_NAME>" + Bios_Variables_set[5] + "</BIOSVARIABLE_VAL_NAME>\n";
    ajax_data += "    </BIOSVARIABLE>\n";
    ajax_data += "</IPMI>\n";
    var myAjax = new Ajax.Request(
                            url,
                            {method: 'post',
                            contentType: 'text/xml',
                            xml_data: ajax_data,
                            parameters:ajax_param,
                            timeout: 90000,
                            ontimeout: onCGIRequestTimeout,
                            onComplete:setvarBiosvarables }//reigister callback function
                            );
}



function setvarBiosvarables(originalRequest)
{
    "use strict";
    document.getElementById("note_div").textContent = lang.LANG_BIOS_CFG_BIOS_NOTE;
    Loading(false);

    // If BIOS variable or BIOS variable pending name/value is undefined
    if ((Bios_Variables_set[0] == "undefined") ||
        (Bios_Variables_set[2] == "undefined") ||
        (Bios_Variables_set[4] == "undefined") ||
        (Bios_Variables_set[5] == "undefined")) {
        alert(lang.LANG_BIOS_CFG_VAR_SET_FAIL);
        return;
    }

    Bios_Variable_saved[idx]= Bios_Variables_set[0];
    idx++;
    Bios_Variable_saved[idx]= Bios_Variables_set[2];
    idx++;
    Bios_Variable_saved[idx]= Bios_Variables_set[3];
    idx++;

    Bios_Variables_current[prev_index] = Bios_Variables_set[4]; // BIOS variable setting value
    showRegContent();
}



function showBiosvariables(originalRequest)
{
    "use strict";
    Loading(false);
    var RowData = [];
    var current_type;
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            alert(lang.LANG_BIOS_CFG_OFF_NOTE);
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_MISC_POWER_TELEMETRY_ERR1);
            return;
        }
        var IPMIRoot= xmldoc.documentElement;//point to IPMI
        var BiosSetup= IPMIRoot.getElementsByTagName('BIOS_SETUP');
        var biosvariable= BiosSetup[0].getElementsByTagName('BIOS_SETUP_VAR');
        totalItem= biosvariable.length;
        var Bios_Variable_tmp = 0;

        var Enforce = biosvariable[0].getAttribute('ENFORCE');
        if(Number(Enforce) == 1)
        {
            location.href = bios_config_login;
        }


        var k = 0;
        for (var j = 0; j < totalItem; j++){
            Bios_Variables[j] =  new Array();
            Bios_Variables_current[j] =  new Array();
            Bios_Variables_only_val[j] = new Array();
            Bios_Variables[j][0]  = biosvariable[j].getAttribute('REG_IDX'+ j); // offset
            Bios_Variables[j][1]  = biosvariable[j].getAttribute('REG_IDX'+ j+'_DESC'); // value
            Bios_Variables[j][2]  = biosvariable[j].getAttribute('REG_IDX'+ j+'_VAL'); // value
            Bios_PG[j]  = biosvariable[j].getAttribute('REG_IDX'+ j+'_PG'); // value
            Bios_Variables_only_val[j][2]  = biosvariable[j].getAttribute('REG_IDX'+ j+'_VAL'); // value
            Bios_Var_val_only[j] = Bios_Variables[j][2].slice(3, 4);
           // Bios_Variable_depex[j] = biosvariable[j].getAttribute('DEPEX'+ j);
             Bios_Variable_depex[j] = "TRUE"; // Work around to fix HSD 1506934430 and 2103623988, untill depex feature is implemented ( which is in progress ).
            Bios_Var_name[j] = biosvariable[j].getAttribute('REG_IDX'+ j+'_NAME');
            Bios_Variable_Newdepex[j] = biosvariable[j].getAttribute('DEPEX_ANS');
            //console.log(Bios_Variable_Newdepex[j]);

            for(var m = 0; m < 2; m++){
                var index  =  Bios_Variables[j][0].search(" ");
                if(index < 2){
                    Bios_Variables[j][0] = Bios_Variables[j][0].replace(" ","");
                }
            }

            if(biosvariable[j].getAttribute('REG_IDX'+ j+'_TYPE') == "oneof"){
                for (var i = 3; i < (3 + Max_limit); i++){
                    Bios_Variables_val[k] = biosvariable[j].getAttribute('REG_IDX'+ k+'_OPTVAL');
                    if(Bios_Variables_val[k]==""){
                        k++;
                        break;
                    }
                    else{
                        if(Number(Bios_Variables[j][2]) == Number(biosvariable[j].getAttribute('REG_IDX'+ k+'_OPTVAL')))
                            Bios_Variables[j][2]  = biosvariable[j].getAttribute('REG_IDX'+ k+'_OPTVAL') + ' (' + biosvariable[j].getAttribute('REG_IDX'+ k+'_OPTTEXT') + ')';
                        Bios_Variables[j][i]  = biosvariable[j].getAttribute('REG_IDX'+ k+'_OPTVAL') + ' (' + biosvariable[j].getAttribute('REG_IDX'+ k+'_OPTTEXT') + ')'; // value

                        Bios_Variables_only_val[j][i]  = biosvariable[j].getAttribute('REG_IDX'+ k+'_OPTVAL'); // value
                        k++;
                    }
                }
            }else if(biosvariable[j].getAttribute('REG_IDX'+ j+'_TYPE') == "numeric"){
                var Maximum = Number(biosvariable[j].getAttribute('REG_IDX'+ j+'_MAXIMUM'));
                var step = Number(biosvariable[j].getAttribute('REG_IDX'+ j+'_STEP'));
                if (Maximum >= Max_limit)
                    Maximum = Max_limit;
                if (step < 1)
                    step = 1;

                Bios_Variables[j][2] = Number(Bios_Variables[j][2]).toString();

                for (var i = 3; i <= (3 + (Number(Maximum) - Number(biosvariable[j].getAttribute('REG_IDX'+ j+'_MINIMUM'))) / step); i++){
                    Bios_Variables[j][i]  = (((i - 3) * step) + Number(biosvariable[j].getAttribute('REG_IDX'+ j+'_MINIMUM'))); // value
                    Bios_Variables_only_val[j][i]  = (((i - 3) * step) + Number(biosvariable[j].getAttribute('REG_IDX'+ j+'_MINIMUM'))); // value

                }
            }else{
                for (var i = 3; i < (3 + 2); i++){
                    Bios_Variables[j][i]  = "0x" + (i - 3).toString(16);
                    Bios_Variables_only_val[j][i]  = "0x" + (i - 3).toString(16);
                }
            }
        }

        var tmp_count = 0;
        for (var i = 0; i < totalItem; i++){
            var optind = 0;
            if((Bios_Variable_Newdepex[i] == "Suppressed") || (Bios_Variable_Newdepex[i] == "Disabled")) {
              continue;
            }
            if(tmp_count == 0)
                tmp_count = i;
            if((Bios_Variable_Newdepex[0] == "Active") || (Bios_Variable_Newdepex[0] == "Grayed Out")) {
              tmp_count = 0;
            }
            Bios_var_type.add(new Option(Bios_Variables[i][0],i),
                              window.ActiveXObject ? optind++ : null);
        }

        if (!((Bios_Variable_Newdepex[tmp_count] == "Suppressed") ||
              (Bios_Variable_Newdepex[tmp_count] == "Disabled")
             ))
        {
            Bios_Variable_tmp = Bios_Variables[tmp_count][2];

            for(var q = 0; q <= Max_limit; q++) {
                if(Bios_Variable_pending[q*2] != undefined){
                    if(Bios_Variables[tmp_count][0] == Bios_Variable_pending[q*2]){
                        Bios_Variables[tmp_count][2] = Bios_Variable_pending[(q*2)+1];
                    }
                }
            }

            var j = 0;
            current_type = Bios_Var_name[tmp_count];
            for(var i = 2; i <= 2+ Max_limit; i++) {
                var optind = 0;

                if (current_type == "BootTimeout" || current_type == "EarlyBootTimeout") {
                    origin_option.hide();
                    exception_option.show();
                    Bios_text_value.value = Number(Bios_Variables[tmp_count][2]);
                    break;
                } else {
                    origin_option.show();
                    exception_option.hide();
                }

                if(Bios_Variables[0][i] === undefined){
                    break;
                }

                if(Bios_Variable_Newdepex[tmp_count] == "Grayed Out") {
                    Bios_var_value.disabled = true;
                } else {
                    Bios_var_value.disabled = false;
                }

                Bios_var_value.add(new Option(Bios_Variables[tmp_count][i], j),
                                   window.ActiveXObject ? optind++ : null);

                if ((Number(Bios_Variables[tmp_count][2]) == Number(Bios_Variables[tmp_count][i+1])) ||
                    (Bios_Variables[tmp_count][2] == Bios_Variables[tmp_count][i+1]))
                {
                    i++;
                }
                j++;
            }
        }

        Bios_Variables[tmp_count][2] = Bios_Variable_tmp;

        var count = 1;
        for(var j = 0; j < totalItem; j++) {
            Bios_Variable_modified = 0;
            for(var i = 0; i <= Max_limit; i++) {
                if(Bios_Variable_pending[i*2] != undefined){
                    if(Bios_Variables[j][0] == Bios_Variable_pending[i*2]){
                        Bios_Variable_pending_display = Bios_Variable_pending[(i*2)+1];
                        Bios_Variable_modified = 1;
                    }
                }
                else {
                    if(Bios_Variable_modified === 0)
                        Bios_Variable_pending_display = Bios_Variables[j][2];
                    break;
                }
            }

            Bios_Variables_current[j]= Bios_Variable_pending_display; // BIOS variables pending value

            if((Bios_Variable_Newdepex[j] == "Suppressed") || (Bios_Variable_Newdepex[j] == "Disabled")) {
              continue;
            }
            RowData.push([count,
                       Bios_Variables[j][0],
                       Bios_Variables[j][1],
                       Bios_Variables[j][2],
                       Bios_Variable_pending_display,
                        j,
                       ]);
        }
        GridTable.empty();
        GridTable.show(RowData);


        // If the BIOS variable value is the same as the pending setting value,
        // the setting is prohibited
        if (current_type != "BootTimeout" && current_type != "EarlyBootTimeout") {
            if (Bios_var_value.options[Bios_var_value.selectedIndex].text == Bios_Variables_current[prev_index]) {
                btnModifyPolicy.disabled = true;
            } else {
                btnModifyPolicy.disabled = false;
            }
        } else {
            if (Bios_text_value.value == Bios_Variables_current[prev_index]) {
                btnModifyPolicy.disabled = true;
            } else {
                btnModifyPolicy.disabled = false;
            }
        }

        // Initialize BIOS variable settings
        if (Bios_Variables_set == "") {
            let re = new RegExp("^(?:0[xX][0-9a-fA-F]{1,4})");
            Bios_Variables_set[5] = Bios_Var_name[prev_index];
            Bios_Variables_set[0] = Bios_var_type.options[prev_index].text;

            if (current_type != "BootTimeout" && current_type != "EarlyBootTimeout") {
                Bios_Variables_set[2] = "0x" + Number(Bios_Variables_current[prev_index].match(re)).toString(16);
                Bios_Variables_set[4] = Bios_var_value.options[prev_index].text;
            } else {
                Bios_Variables_set[2] = Number(Bios_Variables_current[prev_index].match(re));
                Bios_Variables_set[4] = "0x" + Bios_Variables_set[2].toString(16);
            }
        }
        change_setup_page_value(Bios_var_type.value);
    }
}


function checkInputValue(e) {
    "use strict";
    var key;
    var keycode;

    if(window.event) { // IE
        key = e.keyCode
    } else if(e.which) {// Netscape/Firefox/Opera
        key = e.which
    }

    keycode = parseInt(key);

    //32:Space; 37:Left arrow; 39:Right arrow
    if(keycode == 32 || keycode == 37 || keycode == 39) {
        //console.log("keyCode:" + keyCode);
        return;
    }

    takeVarContent();
}

function takeRegContent(){
    "use strict";
    Loading(true);
    setTimeout(showRegContent, 500);
}


function takeVarContent(){
    "use strict";
    Loading(true);
    updateVarContent();
}

function updateVarContent(){
    "use strict";
    Loading(false);
    var RowData = [];

    var n = 0;
    var Bios_pending_setting = 0;
    var count = 1;
    for (var i = 0; i < totalItem; i++){
        if(i == prev_index) {
            if((Bios_Variable_Newdepex[i] == "Suppressed") || (Bios_Variable_Newdepex[i] == "Disabled")) {
                prev_index++;
                continue;
            }
            if (Bios_Var_name[i] != "BootTimeout" && Bios_Var_name[i] != "EarlyBootTimeout") {
                origin_option.show();
                exception_option.hide();
                Bios_pending_setting = Bios_var_value.options[Bios_var_value.selectedIndex].text;
            } else {
                origin_option.hide();
                exception_option.show();
                Bios_pending_setting = Bios_text_value.value;
            }

            RowData.push([count,
                        Bios_Variables[i][0],
                        Bios_Variables[i][1],
                        Bios_Variables[i][2],
                        Bios_pending_setting,
                        i,
                        ]);
            for (var n = 0; n < 2; n++)
            {
                Bios_Variables_set[n] = Bios_Variables[i][n];
            }
            let re = new RegExp("^(?:0[xX][0-9a-fA-F]{1,4})");
            Bios_Variables_set[4] = Bios_pending_setting;
            if (!Bios_Variables_set[4].search("0x")) {
                Bios_Variables_set[2] = "0x" + Number(Bios_Variables_set[4].match(re)).toString(16);
                Bios_Variables_set[3] = Bios_Variables_set[2].slice(2, 3);
            } else {
                Bios_Variables_set[2] = "0x" + Number(Bios_Variables_set[4]).toString(16);
                Bios_Variables_set[3] = Bios_Variables_set[4];
            }
            Bios_Variables_set[5] = Bios_Var_name[i];
        }
        else{
            if((Bios_Variable_Newdepex[i] == "Suppressed") || (Bios_Variable_Newdepex[i] == "Disabled")) {
                continue;
            }
            RowData.push([count,
                        Bios_Variables[i][0],
                        Bios_Variables[i][1],
                        Bios_Variables[i][2],
                        Bios_Variables_current[i], // BIOS variables pending value
                        i
                        ]);
        }
    }

    // If the BIOS variable value is the same as the pending setting value,
    // the setting is prohibited
    if (Bios_Variables_set[5] != "BootTimeout" && Bios_Variables_set[5] != "EarlyBootTimeout") {
        if (Bios_var_value.options[Bios_var_value.selectedIndex].text == Bios_Variables_current[prev_index]) {
            btnModifyPolicy.disabled = true;
        } else {
            btnModifyPolicy.disabled = false;
        }
    } else {
        if (Bios_text_value.value == Bios_Variables_current[prev_index]) {
            btnModifyPolicy.disabled = true;
        } else {
            btnModifyPolicy.disabled = false;
        }
    }

    GridTable.empty();
    GridTable.show(RowData);
}


function showRegContent(){
    "use strict";
    Loading(false);

    var countType = 0;
    var i = 0, j = 0;
    var dependancy = 0;
    var Bios_Variable_tmp = 0;

    var current_type = Bios_Var_name[Bios_var_type.selectedIndex];

    if (current_type != "BootTimeout" && current_type != "EarlyBootTimeout") {
        origin_option.show();
        exception_option.hide();

        for (i = 0; i <= Max_limit; i++){
            var optind = 0;

            if(Bios_Variables[prev_index][i+2] === undefined){
                break;
            }
            Bios_var_value.remove(new Option(Bios_Variables[prev_index][i+2], i),window.ActiveXObject?optind++:null);
        }
    } else {
        origin_option.hide();
        exception_option.show();
    }

    for (i = 0; i < totalItem; i++){
        if((Bios_Variable_Newdepex[i] == "Suppressed") || (Bios_Variable_Newdepex[i] == "Disabled")) {
            countType++;
            continue;
        }
        if((Bios_var_type.selectedIndex+countType) == i){
            if(Bios_Variable_depex[i] != "TRUE"){
                var n = 0;
                for(n = 0; n < (totalItem * 3); n = n + 3){
                    if((Bios_Variable_depex[i].search(Bios_Variable_saved[n]) != -1) && (Bios_Variable_saved[n] != undefined  )){
                        if(Bios_Variable_depex[i].search(Bios_Variable_saved[n+2]) == -1){
                            dependancy = 2;
                            break;
                        }else {
                            dependancy = 1;
                            break;
                        }
                    }
                }
                for(n = 0; n < totalItem; n++){
                    if(dependancy == 0){
                        if(Bios_Variable_depex[i].search(Bios_Variables[n][0]) != -1){
                            if(Bios_Variable_depex[i].search(Bios_Var_val_only[n]) == -1){
                                dependancy = 2;
                                break;
                            }
                        }
                    }
                }
            }
            if((Bios_Variable_depex[i] == "TRUE") || (dependancy == 2)){
                prev_index = i;
                Bios_Variable_tmp = Bios_Variables[i][2];
                // Initialize BIOS variable settings
                let re = new RegExp("^(?:0[xX][0-9a-fA-F]{1,4})");
                Bios_Variables_set[4] = Bios_Variables_current[i];
                if (!Bios_Variables_set[4].search("0x")) {
                    Bios_Variables_set[2] = "0x" + Number(Bios_Variables_set[4].match(re)).toString(16);
                } else {
                    Bios_Variables_set[2] = "0x" + Number(Bios_Variables_set[4]).toString(16);
                }

                Bios_Variables_set[5] = Bios_Var_name[i];
                Bios_Variables_set[0] = Bios_Variables[i][0];
                Bios_Variables[i][2] = Bios_Variables_current[i];

                if (Bios_Variables_set[5] == "BootTimeout" || Bios_Variables_set[5] == "EarlyBootTimeout") {
                    Bios_text_value.value = Number(Bios_Variables_set[4]);
                    Bios_Variables[i][2] = Bios_Variable_tmp;
                    break;
                }
                var k = 0;
                for (k = 2; k <= (2 + Max_limit); k++){
                    var optind = 0;
                    if(Bios_Variables[i][k]===undefined){
                        break;
                    }
                    else {
                        if(Bios_Variable_Newdepex[i] == "Grayed Out") {
                            Bios_var_value.disabled = true;
                        } else {
                            Bios_var_value.disabled = false;
                        }
                        Bios_var_value.add(new Option(Bios_Variables[i][k],j),window.ActiveXObject?optind++:null);
                        if((Number(Bios_Variables[i][2]) == Number(Bios_Variables[i][k+1])) || (Bios_Variables[i][2] == Bios_Variables[i][k+1])){
                            k++;
                        }
                        j++;
                   }
                }
                Bios_Variables[i][2] = Bios_Variable_tmp;
                break;
            } else {
                alert("Please Check Dependancy :" + Bios_Variable_depex[i]);
            }
        }
    }
    change_setup_page_value(Bios_var_type.value);
    takeVarContent();
}

function change_setup_page_value(index){
    //console.log("pg = "+Bios_PG[index]);
    document.getElementById("bios_pg_value").textContent = Bios_PG[index];
}

function bind_click_for_GridTable_cell(tr){
    var tds = tr.getElementsByTagName("td");
    //console.log(tds[0].textContent);
    //console.log(tds[4].textContent);
    Bios_var_type.value=tds[4].textContent;
    Bios_var_type.onchange();
}

function getsavedBiosvariables()
{
    "use strict";
    Loading(true);
    var url = '/cgi/bios_config_oob_saved_var.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data = GeneGenericRequestXML();
    var myAjax = new Ajax.Request(
                                url,
                                {method: 'post',
                                contentType: 'text/xml',
                                xml_data: ajax_data,
                                parameters:pars,
                                timeout: g_CGIRequestTimeout,
                                ontimeout: onCGIRequestTimeout,
                                onComplete:showsavedBiosvariables }//reigister callback function
                                );

}

function showsavedBiosvariables(originalRequest)
{
    "use strict";
    Loading(false);
    var RowData = [];
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            alert(lang.LANG_BIOS_CFG_OFF_NOTE);
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_MISC_POWER_TELEMETRY_ERR1);
            return;
        }
        var IPMIRoot= xmldoc.documentElement;//point to IPMI
        var BiosSetup= IPMIRoot.getElementsByTagName('BIOS_SETUP_SAVE');
        var biosvariable= BiosSetup[0].getElementsByTagName('BIOS_SETUP_VAR_SAVE');
        totalItem= biosvariable.length;

        for (var j = 0; j < totalItem; j++){
            Bios_Variable_pending[j]  = biosvariable[j].getAttribute('REG_IDX'+ j); // offset

        }

    }
}
