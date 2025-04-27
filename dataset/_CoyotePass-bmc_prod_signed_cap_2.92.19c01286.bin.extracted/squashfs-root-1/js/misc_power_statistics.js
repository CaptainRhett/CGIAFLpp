"use strict";
/*Miscellaneous power statistics page*/

var lang;
var GridTable;
var GridTable2;
var GridTable3;
//WKP use AP CPU, if the platform is WKP, there are shared fans and PDB.
var isAPCPU = 0;
var product_id = 0;
let PRODUCT_ID_WALKER_PASS = "95";
let PRODUCT_ID_AMERICAN_PASS = "AA";
var max_psu_num = 0;
var RowData = [];
var RowData2 = [];
var RowData3 = [];
var TableTitles = [
        ["Subsystem", "20%", "center"],
        ["Current", "10%", "center"],
        ["Average", "10%", "center"],
        ["Maximum", "10%", "center"],
        ["Minimum", "10%", "center"],
        ["Timestamp", "20%", "center"],
        ["Period", "20%", "center"]
        ];
//replace table header content with string table
TableTitles[0][0] = lang.LANG_MISC_POWER_COLUMN_TITLE0;
TableTitles[1][0] = lang.LANG_MISC_POWER_COLUMN_TITLE1;
TableTitles[2][0] = lang.LANG_MISC_POWER_COLUMN_TITLE2;
TableTitles[3][0] = lang.LANG_MISC_POWER_COLUMN_TITLE3;
TableTitles[4][0] = lang.LANG_MISC_POWER_COLUMN_TITLE4;
TableTitles[5][0] = lang.LANG_MISC_POWER_COLUMN_TITLE5;
TableTitles[6][0] = lang.LANG_MISC_POWER_COLUMN_TITLE6;

//This table is used to display component power.
var Table2Titles = [
        ["ComponentPower", "50%", "center"],
        ["Current", "50%", "center"]
        ];
//replace table header content with string table
Table2Titles[0][0] = lang.LANG_MISC_COMPONENT_POWER;
Table2Titles[1][0] = lang.LANG_MISC_POWER_COLUMN_TITLE1;

//This table is used to display PIN.
var Table3Titles = [
        ["PowerSupplyInput", "50%", "center"],
        ["Current", "50%", "center"]
        ];
//replace table header content with string table
Table3Titles[0][0] = lang.LANG_MISC_POWER_SUPPLY_INPUT;
Table3Titles[1][0] = lang.LANG_MISC_POWER_COLUMN_TITLE1;

var PowerCurReading = new Array(9);

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit(){
    "use strict";
    //check if the platfrom is WKP.
    getProductID();
}

function pageInit2(originalRequest)
{
    "use strict";
    if(originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if (xmldoc != null) {
            product_id = GetXMLNodeValue(xmldoc, "PRODUCT_ID");
            if (product_id === PRODUCT_ID_WALKER_PASS) {
                isAPCPU = 1;
                max_psu_num = 3;
            } else if (product_id === PRODUCT_ID_AMERICAN_PASS) {
                isAPCPU = 1;
                max_psu_num = 4;
            }
        }
        PowerTableInit();
        document.getElementById("caption_div").textContent = lang.LANG_MISC_POWER_STATISTICS;
        //check user Privilege
        CheckUserPrivilege(PrivilegeCallBack);
    }

}

function PowerTableInit(){
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/misc_power_statistics_hlp.html";
    var PowerTable = document.getElementById("HtmlPowerTable");
    GridTable = GetTableElement();
    GridTable.setColumns(TableTitles);
    GridTable.init('GridTable', PowerTable, "120px");

    if (isAPCPU) {
        var PowerTable2 = document.getElementById("HtmlPowerTable2");
        GridTable2 = GetTableElement();
        GridTable2.setColumns(Table2Titles);
        GridTable2.init('GridTable2', PowerTable2, "150px");
        PowerTable2.style.width = "50%";

        var PowerTable3 = document.getElementById("HtmlPowerTable3");
        GridTable3 = GetTableElement();
        GridTable3.setColumns(Table3Titles);
        GridTable3.init('GridTable3', PowerTable3, "120px");
        PowerTable3.style.width = "50%";
    }
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    //full access
    if (Privilege == '04') {
        for (var i = 0; i < 3; i++) {
            GetPowerConsumption(i);
        }
        //0x05  PSU1
        //0x06  PSU2
        //0x07  PSU3
        //0x08  PSU4
        //0x0f  PSU_TOTAL
        for (var i = 0; i < (5 + max_psu_num); i++) {
            getComponentPwr(i);
        }
        getComponentPwr(0x0f);
    } else {
        //no access
        location.href = SubMainPage;
        return;
    }
}

function GetPowerConsumption(NM_DOMAIN)
{
    "use strict";
    Loading(true);
    var url = '/cgi/nmpowerstat.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data= genXMLData(NM_DOMAIN);
    var myAjax = new Ajax.Request(
                url,
                {method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                parameters:pars,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete:ShowPowerConsumption }//reigister callback function
            );
}
function ShowPowerConsumption(originalRequest)
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
                return;
        }
        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
           return;
        }
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_MISC_POWER_TELEMETRY_ERR1);
            return;
        }

        var subsystem= '';
        var IPMIRoot= xmldoc.documentElement;//point to IPMI
        var PowerElement= IPMIRoot.getElementsByTagName('NM_POWER_STATISTICS');
        var statistic= PowerElement[0].getElementsByTagName('STATISTICS');
        var id= statistic[0].getAttribute('DOMAIN');
        switch(parseInt(id)){
            case 0:
                if (isAPCPU) {
                    subsystem= 'Entire Node';
                } else {
                    subsystem= 'Entire Platform';
                }
                break;
            case 1:
                subsystem= 'CPU';
                break;
            case 2:
                subsystem= 'Memory';
                break;
            default:
                subsystem= 'Unknow';
                break;
        }
        if(statistic[0].getAttribute('COMP_CODE') != '0'){
            RowData.push([id, subsystem, 'N/A', 'N/A', 'N/A', 'N/A', '', '']);
            alert(lang.LANG_MISC_NM_CONFIG_SELF_TEST_FAIL);
        }
        else
            RowData.push([id, subsystem,
                    statistic[0].getAttribute('CURR'),
                    statistic[0].getAttribute('AVG'),
                    statistic[0].getAttribute('MAX'),
                    statistic[0].getAttribute('MIN'),
                    statistic[0].getAttribute('TIME'),
                    secondsToString(parseInt(statistic[0].getAttribute('PERIOD')))
                    ]);
        GridTable.empty();
        GridTable.show(RowData);
    }
}

function genXMLData(NM_DOMAIN){
    "use strict";
    var xml_data= "<?xml version=\"1.0\"?>\n"+
        "<IPMI>\n"+
        "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
        "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
        "    <NM_POWER_STATISTICS>\n"+
        "    <STATISTICS NM_DOMAIN=\""+NM_DOMAIN+"\"/>\n"+
        "    </NM_POWER_STATISTICS>\n"+
        "</IPMI>\n";
    return xml_data;
}

function secondsToString(seconds){
    "use strict";
    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;
    if(numdays != 0)
        return numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
    else if(numhours != 0)
        return numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
    else if(numminutes != 0)
        return numminutes + " minutes " + numseconds + " seconds";
    else
        return numseconds + " seconds";
}

function genNULLXMLData(){
    "use strict";
    var xml_data= "<?xml version=\"1.0\"?>\n"+
        "<IPMI>\n"+
        "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
        "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
        "</IPMI>\n";
    return xml_data;
}

function getProductID()
{
    "use strict";
    var url = '/cgi/powerconsumption.cgi';
    var pars = '';
    var ajax_data= genNULLXMLData();
    var myAjax = new Ajax.Request(
                url,
                {method: 'GET',
                contentType: 'text/xml',
                xml_data: ajax_data,
                parameters:pars,
                onComplete:pageInit2 }//reigister callback function
            );
}
function getComponentPwr(NM_DOMAIN)
{
    "use strict";
    Loading(true);
    var url = '/cgi/powerconsumption.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data= genXMLData(NM_DOMAIN);
    var myAjax = new Ajax.Request(
                url,
                {method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                asynchronous: false,
                parameters:pars,
                onComplete:showComponentPwr}//reigister callback function
            );
}
function showComponentPwr(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if (xmldoc == null) {
            SessionTimeout();
            return;
        }
        // check session & privilege
        if (CheckInvalidResult(xmldoc) < 0) {
           return;
        }
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            //alert(lang.LANG_MISC_POWER_TELEMETRY_ERR1);
            return;
        }

        var subsystem = '';
        var IPMIRoot = xmldoc.documentElement;//point to IPMI
        var PowerElement = IPMIRoot.getElementsByTagName('NM_POWER_STATISTICS');
        var statistic = PowerElement[0].getElementsByTagName('STATISTICS');
        var id = statistic[0].getAttribute('DOMAIN');
        if (parseInt(id) < 5) {
            //These data are displayed in table2.
            var nodeId = statistic[0].getAttribute('NODEID');
            switch (parseInt(id)) {
                case 0:
                    subsystem= 'Node 1 Power';
                    break;
                case 1:
                    subsystem= 'Node 2 Power';
                    break;
                case 2:
                    subsystem= 'Node 3 Power';
                    break;
                case 3:
                    subsystem= 'Node 4 Power';
                    break;
                case 4:
                    subsystem= 'Fan/PDB Estimate';
                    break;
                default:
                    subsystem= 'Unknow';
                    break;
            }
            if (parseInt(id) == parseInt(nodeId)) {
                subsystem += '(current)';
            }
            if (statistic[0].getAttribute('COMP_CODE') != '0') {
                RowData2.push([id, subsystem, 'NA']);
                //alert(lang.LANG_MISC_NM_CONFIG_SELF_TEST_FAIL);
            } else {
                RowData2.push([id, subsystem,
                        statistic[0].getAttribute('CURR')
                        ]);
            }
            GridTable2.empty();
            GridTable2.show(RowData2);
        } else if ((parseInt(id) >= 5 && parseInt(id) < (5 + max_psu_num)) ||
                    parseInt(id) === 0x0f) {
            //These data are displayed in table3.
            switch (parseInt(id)) {
                case 5:
                    subsystem= 'PSU 1 Input';
                    break;
                case 6:
                    subsystem= 'PSU 2 Input';
                    break;
                case 7:
                    subsystem= 'PSU 3 Input';
                    break;
                case 8:
                    subsystem= 'PSU 4 Input';
                    break;
                case 0x0f:
                    subsystem= 'Total Input Power';
                    break;
                default:
                    subsystem= 'Unknow';
                    break;
            }
            if (statistic[0].getAttribute('COMP_CODE') != '0') {
                RowData3.push([id, subsystem, 'NA']);
                //alert(lang.LANG_MISC_NM_CONFIG_SELF_TEST_FAIL);
            } else {
                RowData3.push([id, subsystem,
                        statistic[0].getAttribute('CURR')
                        ]);
            }
            GridTable3.empty();
            GridTable3.show(RowData3);
        }
    }
}
