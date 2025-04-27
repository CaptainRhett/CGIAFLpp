"use strict";
/* Server Health sensor reading page  */
var lang;
var GridTable;

var SelectedSensorType = 0;
var SensorRecordNum = 0;
var ThresholdFlag = 0;
var SortColumn = 0;
var BeforeSort = true;
var SortReverse = true;

var SensorTableArray = new Array();
var MaxSensorTableColumn = 11;
var SensorNumberTableColumn = 11;
var STYPETableColumn = MaxSensorTableColumn -1;
var MaxSensorTableRow  = 255;

//var LogoutPage = "../cgi/url_redirect.cgi?url_name=logout";
var sensorKindObj;
var SensorCategoryObj;
var ButtonRefreshObj;
var ButtonThresholdObj;
var ButtonChassisIntrusionObj;
var SensorTableExtraInfoObj;

var timeoutSetting=0;
var timeoutID = undefined;
var defaultSec = 60;
var autoSec;
var sensorKind = 0;//0:bmc, 1:satelite, 2:me
var autorefreshObj;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    var RefreshReading = document.getElementById("RefreshReading");

    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/servh_sensor_hlp.html";
    OutputString();
    var pickform = document.getElementById('pickform');
    sensorKindObj = document.getElementById('SensorKind');
    // Set up the drop downs.
    var optind = 0;
    sensorKindObj.add(new Option(lang.LANG_SDR_BMC,0),window.ActiveXObject?optind++:null);
    sensorKindObj.add(new Option(lang.LANG_SDR_SATELLITE,1),window.ActiveXObject?optind++:null);
    sensorKindObj.add(new Option(lang.LANG_SDR_ME,2),window.ActiveXObject?optind++:null);
    sensorKindObj.onchange = function()
    {
        "use strict";
        sensorKind = sensorKindObj.options.selectedIndex;
        SelectedSensorType = 0;
        GetSensors();
    }

    SensorCategoryObj = document.getElementById("SensorCategory");
    SensorCategoryObj.onchange = function()
    {
        "use strict";
        SelectedSensorType = SensorCategoryObj.value;
        ReloadSensorTbl();
    }

    ButtonRefreshObj = document.getElementById("btn_Refresh");
    ButtonRefreshObj.value = lang.LANG_SENSOR_REFRESH;
    ButtonRefreshObj.onclick = function()
    {
        "use strict";
        GetSensors();
    }

    ButtonThresholdObj = document.getElementById("btn_ShowThreshold");
    ButtonThresholdObj.value = lang.LANG_SENSOR_SHOWTHRESHOLD;
    ButtonThresholdObj.onclick = function()
    {
        "use strict";
        if (ThresholdFlag == 0)
        {
            ThresholdFlag = 1;
            GridTableInit(1);
            ReloadSensorTbl();
            ButtonThresholdObj.value =lang.LANG_SENSOR_HIDETHRESHOLD;
        }
        else
        {
            ThresholdFlag = 0;
            GridTableInit(0);
            ReloadSensorTbl();
            ButtonThresholdObj.value =lang.LANG_SENSOR_SHOWTHRESHOLD;
        }
    }
    ButtonChassisIntrusionObj = document.getElementById('btn_ChassisIntrusion');
    ButtonChassisIntrusionObj.setAttribute("value", lang.LANG_SENSOR_CHASSISINTR);
    ButtonChassisIntrusionObj.style.visibility='hidden';
    ButtonChassisIntrusionObj.onclick = function()
    {
        "use strict";
        Loading(true);
        disableButtons(true);
        var url = '/cgi/rearm_chassis.cgi';
        var pars = 'time_stamp='+(new Date());
        var myAjax = new Ajax.Request(
            url,
            {method: 'get',parameters:pars, onComplete:function()
                {
                    GetSensors();
                }
            }//reigister callback function
        );
    }
    SensorTableExtraInfoObj = document.getElementById("HtmlSensorTableInfo");

    autorefreshObj = document.getElementById("autorefresh");
    if(browser_ie)
    {
        autorefreshObj.add(new Option('5',5), 0);
        autorefreshObj.add(new Option('10',10), 1);
        autorefreshObj.add(new Option('15',15), 2);
        autorefreshObj.add(new Option('30',30), 3);
        autorefreshObj.add(new Option('60',60), 4);
        autorefreshObj.add(new Option('150',150), 5);
        autorefreshObj.add(new Option('300',300), 6);
        autorefreshObj.add(new Option(lang.LANG_SENSOR_NEVER,255), 7);
    } else {
        autorefreshObj.add(new Option('5',5), null);
        autorefreshObj.add(new Option('10',10), null);
        autorefreshObj.add(new Option('15',15), null);
        autorefreshObj.add(new Option('30',30), null);
        autorefreshObj.add(new Option('60',60), null);
        autorefreshObj.add(new Option('150',150), null);
        autorefreshObj.add(new Option('300',300), null);
        autorefreshObj.add(new Option(lang.LANG_SENSOR_NEVER,255), null);
    }

    autoSec = ReadSessionStorage("AutoRefreshSecSensor");
    if(!autoSec)
    {
        CreateSessionStorage("AutoRefreshSecSensor", defaultSec);
        autoSec = defaultSec;
    }
    autorefreshObj.value = autoSec;
    RefreshReading.textContent = lang.LANG_SENSOR_REFRESH_MESSAGE.replace("{number}", autoSec);
    autorefreshObj.onchange=function()
    {
        "use strict";
        autoSec = autorefreshObj.value;
        CreateSessionStorage("AutoRefreshSecSensor", autoSec);
        resetAutoTimer();
    }

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("sensor_caption_div").textContent = lang.LANG_SENSOR_CAPTION;
    document.getElementById("sensor_kind_td").textContent = lang.LANG_SENSOR_SNRKIND;
    document.getElementById("sensor_type_td").textContent = lang.LANG_SENSOR_SNRTYPE;
    document.getElementById("sensor_refsec_td").textContent = lang.LANG_SENSOR_REFSEC;
}

function SensorTableArrayInit()
{
    "use strict";
    var i, j;
    for(i = 0; i < MaxSensorTableRow; i++)
        SensorTableArray[i] = new Array(MaxSensorTableColumn+1);

    for(i = 0; i < MaxSensorTableRow; i++)
        for(j = 0; j < (MaxSensorTableColumn+1); j++)
            SensorTableArray[i][j] = "N/A";
}

function ReloadSensorTbl()
{
    "use strict";
    var SensorCount = 0;
    var j = 0;
    var SensorData = [];

    GridTable.empty();
    for(j = 0; j < SensorRecordNum; j++)
    {
        if((parseInt(SensorTableArray[j][STYPETableColumn],16) == SensorCategoryObj.value) ||
                     (SensorCategoryObj.value == 0) ||(SensorCategoryObj.value == 0xc0 &&
                     parseInt(SensorTableArray[j][STYPETableColumn],16) >= 0xc0 &&
                     parseInt(SensorTableArray[j][STYPETableColumn],16) <= 0xff))
        {
            if(ThresholdFlag == 1)
            {
                SensorData.push([
                        j+1,
                        SensorTableArray[j][9],
                        SensorTableArray[j][0],
                        SensorTableArray[j][1],
                        SensorTableArray[j][2],
                        SensorTableArray[j][3],
                        SensorTableArray[j][4],
                        SensorTableArray[j][5],
                        SensorTableArray[j][6],
                        SensorTableArray[j][7],
                        SensorTableArray[j][8]
                        ]);
            }
            else
            {
                SensorData.push([
                        j+1,
                        SensorTableArray[j][9],
                        SensorTableArray[j][0],
                        SensorTableArray[j][1],
                        SensorTableArray[j][2]
                        ]);

            }
            SensorCount++;
        }
    }
    GridTable.show(SensorData);
    if (SortColumn > 0 && SortColumn < 11)
    {
        BeforeSort = SortReverse;
        GridTable.sortOnColumn(SortColumn);
        if (SortReverse != BeforeSort) {
            GridTable.sortOnColumn(SortColumn);
        }
    }
    SensorTableExtraInfoObj.textContent = lang.LANG_SENSOR_SNRNUMBER +SensorCount+lang.LANG_SENSOR_SNRUNIT;

}


function GridTableInit(ExtraInfo)
{
    "use strict";
    //Grid table Init
    if(GridTable != null)
        GridTable.empty(1);
    var SensorHeader = document.getElementById("HtmlSensorHeader");
    var SensorTable = document.getElementById("HtmlSensorTable");

    if (ExtraInfo == 1)
    {
        var SensorsTblTitle = [
            //["(img)", "1px", "left"],
            ["Healthy", "1px", "left"],
            ["Name", "10%", "center", "100px"],
            ["Status", "15%", "center", "100px"],
            ["Reading", "15%", "left", "100px"],
            ["Low NR", "10%", "center"],
            ["Low CT", "10%", "center"],
            ["Low NC", "10%", "center"],
            ["High NC", "10%", "center"],
            ["High CT", "10%", "center"],
            ["High NR", "10%", "center"]
        ];
        //replace table header content with string table
        SensorsTblTitle[0][0] = lang.LANG_SENSOR_TABLE_HEADTITLE0;
        SensorsTblTitle[1][0] = lang.LANG_SENSOR_TABLE_HEADTITLE1;
        SensorsTblTitle[2][0] = lang.LANG_SENSOR_TABLE_HEADTITLE2;
        SensorsTblTitle[3][0] = lang.LANG_SENSOR_TABLE_HEADTITLE3;
        SensorsTblTitle[4][0] = lang.LANG_SENSOR_TABLE_HEADTITLE4;
        SensorsTblTitle[5][0] = lang.LANG_SENSOR_TABLE_HEADTITLE5;
        SensorsTblTitle[6][0] = lang.LANG_SENSOR_TABLE_HEADTITLE6;
        SensorsTblTitle[7][0] = lang.LANG_SENSOR_TABLE_HEADTITLE7;
        SensorsTblTitle[8][0] = lang.LANG_SENSOR_TABLE_HEADTITLE8;
        SensorsTblTitle[9][0] = lang.LANG_SENSOR_TABLE_HEADTITLE9;
    }
    else
    {
        var SensorsTblTitle = [
            //["(img)", "1px", "left"],
            ["Healthy", "1px", "left"],
            ["Name", "20%", "center"],
            ["Status", "50%", "center"],
            ["Reading", "30%", "left"]
        ];
        //replace table header content with string table
        SensorsTblTitle[0][0] = lang.LANG_SENSOR_TABLE_HEADTITLE0;
        SensorsTblTitle[1][0] = lang.LANG_SENSOR_TABLE_HEADTITLE1;
        SensorsTblTitle[2][0] = lang.LANG_SENSOR_TABLE_HEADTITLE2;
        SensorsTblTitle[3][0] = lang.LANG_SENSOR_TABLE_HEADTITLE3;
    }

    removeChilds(SensorHeader);//clear list content.
    removeChilds(SensorTable);
    SetRowSelectEnable(0);
    GridTable = GetTableElement();
    GridTable.setColumns(SensorsTblTitle);

    GridTable.init_header('GridTable',SensorHeader);
    GridTable.init_body('GridTable',SensorTable);
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if (Privilege == '02' || Privilege == '03' || Privilege == '04') {
        ThresholdFlag = 0;
        GridTableInit(0);
        GetSensors();
    } else {
        location.href = SubMainPage;
        return;
    }
}

function SensorTableInit()
{
    "use strict";
    var i = 0, j = 0;

    for(i = 0; i < MaxSensorTableRows; i++)
    {
        SensorTableArray[i] = new Array(6);
        for(j = 0; j < MaxSensorTableColumn; j++)
        {
            SensorTableArray[i][j] = "NULL";
        }
    }
}

//For Sensor APIs
function ShowSensorCategory(SensorRecNum, selectSensorType)
{
    "use strict";
    var sensorType;
    var newOption;
    var i, j;
    var index = 0;

    if (0xC0 <= selectSensorType && selectSensorType <= 0xFF) {
        selectSensorType = 0xC0;
    }

    if (SensorCategoryObj.length == 0) {
        SensorCategoryObj.add(new Option(lang.LANG_SENSOR_SNRTYPE0, 0),
                              browser_ie ? index++ : null);
    } else {
        index = 1;
    }

    while (SensorCategoryObj.options[1]) {
        SensorCategoryObj.options.remove(1);
    }

    for (i = 0; i < SensorRecNum; i++) {
        sensorType = parseInt(SensorTableArray[i][STYPETableColumn], 16);
        if (0xC0 <= sensorType && sensorType <= 0xFF) {
            sensorType = 0xC0;
        }

        j = 1;
        while (SensorCategoryObj.options[j] &&
               SensorCategoryObj.options[j].value != sensorType) {
            j += 1;
        }

        if (j < SensorCategoryObj.length) continue;

        var option = new Option(lang["LANG_SENSOR_SNRTYPE" +
                            IntegerToHexString(sensorType)],
                            sensorType);
        SensorCategoryObj.add(option, browser_ie ? index : null);

        if (selectSensorType == sensorType) {
            SensorCategoryObj.selectedIndex = index;
        }

        index += 1;
    }
}

function cleanAutoTimer() {
    "use strict";
    if(timeoutID != undefined) {
        clearTimeout(timeoutID);
        timeoutID = undefined;
    }
}

function resetAutoTimer() {
    "use strict";
    if(autoSec != 255  && timeoutSetting == 0)
    {
        cleanAutoTimer();
        timeoutID = setTimeout(GetSensors, autoSec*1000);
        RefreshReading.textContent = lang.LANG_SENSOR_REFRESH_MESSAGE.replace("{number}", autoSec);
    }
    else{
        cleanAutoTimer();
        RefreshReading.textContent = lang.LANG_SENSOR_REFRESH_ERROR;
    }
}

function disableButtons(disabled) {
    "use strict";
    ButtonChassisIntrusionObj.disabled = disabled;
    SensorCategoryObj.disabled = disabled;
    ButtonRefreshObj.disabled = disabled;
    ButtonThresholdObj.disabled = disabled;
    sensorKindObj.disabled = disabled;
    autorefreshObj.disabled = disabled;
}

function onGetSensorTimeout() {
    "use strict";
    Loading(true, lang.LANG_COMMON_REQUEST_TIMEOUT);
    resetAutoTimer();
}

function GetSensors()
{
    "use strict";
    Loading(true);
    cleanAutoTimer();
    disableButtons(true);
    var url = '/cgi/getsensorinfo.cgi';
    var ajax_data = "";
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <LANG>" + lang_setting + "</LANG>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "</IPMI>\n";

    //alert(ajax_data);
    var myAjax = new Ajax.Request(url,
                                  {method:      "POST",
                                   contentType: "text/xml",
                                   xml_data:    ajax_data,
                                   parameters:  "",
                                   timeout:     30000,
                                   ontimeout:   onGetSensorTimeout,
                                   onComplete:  HandleSensorsResp}//reigister callback function
                                 );
}


function HandleSensorsResp(originalRequest)
{
    "use strict";
    disableButtons(false);
    Loading(false);

    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null) {
            cleanAutoTimer();
            if(timeoutSetting == 0) {
                timeoutSetting = 1;
                SessionTimeout();
            }
        }

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            cleanAutoTimer();
            return;
        }

        var IPMIRoot=xmldoc.documentElement;
        var SensorInfo = null;

        if( sensorKind == 0 ) {
            SensorInfo = IPMIRoot.getElementsByTagName("SENSOR_INFO_BMC");
        }
        else if( sensorKind == 1 ) {
            SensorInfo = IPMIRoot.getElementsByTagName("SENSOR_INFO_SATELLITE");
        }
        else if( sensorKind == 2 ) {
            SensorInfo = IPMIRoot.getElementsByTagName("SENSOR_INFO_ME");
        }

        //alert(SensorInfo[0].getElementsByTagName('SENSOR').length);

        SensorRecordNum = 0;
        SensorTableArrayInit();

        //traverse all nodes ;take the following example
        //<SENSOR ID="1" NAME="test" READING="5" UNR="9" UC="8" UNC="7" LNC="3" LC="2" LNR="1"/>
        $A(SensorInfo[0].getElementsByTagName('SENSOR')).each(function (node) {
            "use strict";
            var i, Idx;
            var SensorType = node.getAttribute("STYPE");
            var SensorName = node.getAttribute("NAME");
            let SensorNumber = node.getAttribute("NUMBER");
            var EventReadingType = parseInt(node.getAttribute("ERTYPE"), 16);

            for(i = 0, Idx = 0; i < MaxSensorTableRow; i++) {
                if(SensorTableArray[i][0] == "N/A") {
                    Idx = i;
                    break;
                }
            }

            SensorTableArray[Idx][0] = SensorName;
            SensorTableArray[Idx][STYPETableColumn] = SensorType;
            SensorTableArray[Idx][SensorNumberTableColumn] = SensorNumber;

            if (EventReadingType == 0x01) {
                //threshold sensors
                ProcThreshlodSensor(node,Idx);
            }
            else {
                //for descrete sensor
                ProcDiscreteSensor(node,Idx,EventReadingType);
            }
                SensorRecordNum ++;
        });

        ShowSensorCategory(SensorRecordNum, SelectedSensorType);
        if(!SensorRecordNum) {
            cleanAutoTimer();
            alert(lang.LANG_SENSOR_NOSNRSTR, {
                  onClose: function() {
                                "use strict";
                               resetAutoTimer();
                           }});
            SensorTableExtraInfoObj.textContent = lang.LANG_SENSOR_SNRNUMBER+(SensorRecordNum)+lang.LANG_SENSOR_SNRUNIT;
            if (ThresholdFlag == 0)
                GridTableInit(0);
            else
                GridTableInit(1);
            return;
        }

        //sync ButtonThresholdObj
        if (ThresholdFlag == 0) {
            ThresholdFlag = 0;
            ButtonThresholdObj.value =lang.LANG_SENSOR_SHOWTHRESHOLD;
        } else {
            ThresholdFlag = 1;
            ButtonThresholdObj.value =lang.LANG_SENSOR_HIDETHRESHOLD;
        }

        ReloadSensorTbl();

        resetAutoTimer();
    }
    //else {
    //    //alert("Request Failed! " +
    //    //      originalRequest.status + " " + originalRequest.statusText);
    //}
}

function ProcThreshlodSensor(node, Idx) {
    "use strict";
    var ColorNode = node.getAttribute("STATE_COLOR");

    SensorFormula(node, Idx, SensorTableArray);

    var NeedCompare = parseFloat(SensorFormula.NeedCompare);

    if (NeedCompare == 1) {
        SensorTableArray[Idx][1] = SensorFormula.Status.replace(/\n/g, '<br>');
        SensorTableArray[Idx][9] = "bgcolor=" + ColorNode;
    } else {
        SensorTableArray[Idx][9] = "bgcolor=white";
    }
}

function ProcDiscreteSensor(node, Idx, ERTYPE) {
    "use strict";
    var SensorType = node.getAttribute("STYPE");
    var Option = parseInt(node.getAttribute("OPTION"), 16);

    var SensorReading = node.getAttribute("RAW_READING");
    var HumanReading = node.getAttribute("HUMAN_READING");
    var StatusNode = node.getAttribute("STATUS");
    var ColorNode = node.getAttribute("STATE_COLOR");

    if (SensorReading != null) {
        SensorReading = SensorReading.substr(0, 2);
    }

    let KCSMode;
    if (HumanReading != null) {
        KCSMode = HumanReading.substr(2, 2);
        HumanReading = "0x" + HumanReading.substr(4, 2) + HumanReading.substr(2, 2);
    }

    // Ignore on reading
    if (!(Option & 0x40)) {
        SensorTableArray[Idx][2] = lang.LANG_SENSOR_READING_NA;
        SensorTableArray[Idx][9] = "bgcolor=white";
        return;
    }

    if ((0x02 <= ERTYPE && ERTYPE <= 0x0C) ||
        ERTYPE == 0x6F ||
        (0x70 <= ERTYPE && ERTYPE <= 0x7F)) {

        if (SensorReading == null) {
            SensorTableArray[Idx][1] = lang.LANG_SENSOR_STATUS_NOT_AVAILABLE;
            SensorTableArray[Idx][2] = lang.LANG_SENSOR_READING_NA;
            SensorTableArray[Idx][9] = "bgcolor=white";
            return;
        }

        SensorTableArray[Idx][1] = StatusNode.replace(/\n/g, '<br>');
        SensorTableArray[Idx][2] = HumanReading;
        SensorTableArray[Idx][9] = "bgcolor=" + ColorNode;

        /* chassis */
        if (SensorType == "05") {
            if (SensorReading == "00") {
                ButtonChassisIntrusionObj.style.visibility = 'hidden';
            } else {
                ButtonChassisIntrusionObj.disabled = false;
            }
        }
    } else {
        SensorTableArray[Idx][1] = lang.LANG_SENSOR_STATUS_NOT_SUPPORTED;
        SensorTableArray[Idx][9] = "bgcolor=white";
    }
}
