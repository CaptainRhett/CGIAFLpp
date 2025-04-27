var eventsLogTabObj = null;
var selPageUp = null;
var selPageDown = null;
var EventsLogTableArray = new Array();
var SeqNoCurrent = 0;
var SeqNoStart = 0;
var SeqNoEnd = 0;
var SeqNoStep = 35; //fet 35 records log every request inquery from redfish
var QueryUrl = ''; //keep Events log entry URL

function eventsTableInit() {
    EventsPageButtonInit();
    //$("#eventstablecap").text(mLangMap.getStr("LANG_SM_EVENTS_LOG_MENU_ITEM"));
    "use strict";
    let tbTitles = [
        ["SeqNo", "14%", "center"],
        ["Level", "9%", "center"],
        ["EventId", "9%", "center"],
        ["Time", "14%", "center"],
        ["Description", "13%", "center"]
    ];
    //replace table header content with string table
    tbTitles[0][0] = lang.LANG_SM_EVENTS_TABLE_HEADER_SEQNO;
    tbTitles[1][0] = lang.LANG_SM_EVENTS_TABLE_HEADER_LEVEL;
    tbTitles[2][0] = lang.LANG_SM_EVENTS_TABLE_HEADER_EVENTID;
    tbTitles[3][0] = lang.LANG_SM_EVENTS_TABLE_HEADER_TIME;
    tbTitles[4][0] = lang.LANG_SM_EVENTS_TABLE_HEADER_DESCRIPTION;

    let EventsTableHeader = document.getElementById("EventsTable_header");
    let EventsTablePlace = document.getElementById("EventsTable");
    eventsLogTabObj = GetTableElement();
    eventsLogTabObj.setColumns(tbTitles);
    eventsLogTabObj.init_header('eventsLogTabObj', EventsTableHeader);
    eventsLogTabObj.init_body('eventsLogTabObj', EventsTablePlace);
    console.log(eventsLogTabObj);
}

function EventsPageButtonInit() {
    selPageUp = document.getElementById("selPageUp");
    selPageDown = document.getElementById("selPageDown");

    selPageUp.setAttribute("value", "<");
    selPageUp.onclick = changePageHandler;

    selPageDown.setAttribute("value", ">");
    selPageDown.onclick = changePageHandler;

    //LoadUIStyle();
}

// function LoadUIStyle() {
//     ApplyStyleButton("selPageUp");
//     ApplyStyleButton("selPageDown");
// }

function changePageHandler() {
    eventslog_button_all_disable();

    if ('selPageUp' == this.id) {
        SeqNoCurrent -= SeqNoStep;
    } else if ('selPageDown' == this.id) {
        SeqNoCurrent += SeqNoStep;
    }

    refreshDisplay();
}

function eventslog_button_all_disable() {
    selPageUp.disabled = true;
    selPageDown.disabled = true;
}

function eventslog_button_all_restore() {
    selPageUp.disabled = (SeqNoStart == SeqNoCurrent);

    selPageDown.disabled = (SeqNoCurrent + 1 >= SeqNoEnd);
}

function refreshDisplay() {
    showLoading(true);

    var rfurl = '';
    rfurl = QueryUrl + SeqNoCurrent;
    //console.log(rfurl);
    $.ajax({
        url: rfurl,
        type: "GET"
    }).done(function(responseJson, textStatus, jqXHR){
        OnrefreshDisplay(responseJson, textStatus, jqXHR);
    }).fail(function(xhr, errorThrown) {
        OnrefreshDisplayError(xhr, errorThrown);
    });
}

function OnrefreshDisplay(responseJson, textStatus, jqXHR) {
    EventsLogTableArray = [];
    if (responseJson.hasOwnProperty('Data')) {
        EventsLogTableArray = responseJson['Data'];
        //console.log(EventsLogTableArray);
        ShowEventsTable();
    }
}

function OnrefreshDisplayError(xhr, errorThrown) {
    showLoading(false);
    console.log(xhr.status);
    console.log(errorThrown);
}

function ShowEventsTable() {
    //Loading(true);
    var RowData = [];
    //console.log(EventsLogTableArray.length);
    //console.log(EventsLogTableArray);
    if (EventsLogTableArray.length > 0) {
        /*for (i = 0; i < EventsLogTableArray.length; i++) {
            RowData.push({
                "SeqNo": EventsLogTableArray[i].SeqNo,
                "Level": EventsLogTableArray[i].Level,
                "EventId": EventsLogTableArray[i].EventId,
                "Time": EventsLogTableArray[i].Time,
                "Description": EventsLogTableArray[i].Description
            });
        }*/
        EventsLogTableArray.forEach(function(val, index, arr) {
            RowData.push([index,
                        EventsLogTableArray[index].SeqNo,
                        EventsLogTableArray[index].Level,
                        EventsLogTableArray[index].EventId,
                        EventsLogTableArray[index].Time,
                        EventsLogTableArray[index].Description]);
        });
        console.log(RowData);
        eventsLogTabObj.show(RowData);
    }
    if (EventsLogTableArray.length == 0) {
        eventsLogTabObj.empty();
    }
    eventslog_button_all_restore();
    showLoading(false);
}

/*
old url:
/redfish/v1/Systems/serialid/Storage/<STORAGE_CONTROLLER_ID>/StorageControllers/<STORAGE_CONTROLLER_ID>/Events/<EVENT_ID>
new url:
/redfish/v1/Systems/123456789/Storage/1/StorageControllers/0/Oem/Insyde/Events/<ID>
*/
function getEventsLog(json) {
    //console.log(json);
    //console.log(json['Oem']['Events']['@odata.id']);
    showLoading(true);
    var rfurl, url;
    //old
    // if (json.hasOwnProperty('@odata.id')) {
    //     url = json['@odata.id'];
    //     console.log(url);
    // }
    //new Events entry URL
    if (json.hasOwnProperty('Oem')) {
        var event = json['Oem'];
        url = event['Events']['@odata.id'];
        console.log(url);
    }
    if (json.hasOwnProperty('Oem')) {
        var OemMember = json['Oem'];
        console.log(OemMember);
        if ((Object.keys(OemMember).length === 0)) {
            console.log('StorageController.Oem is null');
            var control_info = $("#_selecter :selected").text();
            control_info = lang.LANG_SM_NO_EVENTS_LOG + ' \"' + control_info + '\" ' + lang.LANG_SM_RAID_CARD;
            alert(control_info);
            if (eventsLogTabObj != null) {
                eventsLogTabObj.empty();
            }
            $("#selPageUp").prop('disabled', true);
            $("#selPageDown").prop('disabled', true);
            showLoading(false);
            return;
        } else {
            if (OemMember.hasOwnProperty('SeqNumLastClearEvent')) {
                SeqNoStart = OemMember['SeqNumLastClearEvent'];
                SeqNoCurrent = SeqNoStart;
            }
            if (OemMember.hasOwnProperty('SeqNumNewestEvent')) {
                SeqNoEnd = OemMember['SeqNumNewestEvent'];
            }
        }
    }
    // Events url  + '/' + <ID>
    rfurl = url + '/' + SeqNoCurrent;
    console.log(rfurl);
    QueryUrl = url + '/';
    //console.log(QueryUrl);
    //TODO: verified with redfish
    /*$.ajax({
            url: rfurl,
            type: "GET"
        }).done(function(responseJson, textStatus, jqXHR){
            OngetEventsLog(responseJson, textStatus, jqXHR);
        }).fail(function(xhr, errorThrown) {
            if (xhr.statusText == 'Not Found') {
                top.topmenu.raidErrorHandler(4);
                showNoRaid();
            }
        });*/
    let responseJson = `{"@odata.context":"/redfish/v1/$metadata#InsydeStorageControllerEvent.InsydeStorageControllerEvent","@odata.id":"/redfish/v1/Systems/123456789abcdef/Storage/1/StorageControllers/0/Oem/Insyde/Events/2","@odata.type":"#InsydeStorageControllerEvent.v1_0_0.InsydeStorageControllerEvent","Id":"2","Name":"2","Count":35,"Data":[{"SeqNo":2,"EventId":30,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:9 (h:m:s)","Description":"Event log cleared"},{"SeqNo":3,"EventId":0,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:26 (h:m:s)","Description":"Firmware initialization started (PCI ID 0014/1000/9460/1000)"},{"SeqNo":4,"EventId":1,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:26 (h:m:s)","Description":"Firmware version 5.130.00-3059"},{"SeqNo":5,"EventId":142,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:27 (h:m:s)","Description":"Energy Pack Not Present"},{"SeqNo":6,"EventId":261,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:27 (h:m:s)","Description":"Package version 51.13.0-3223"},{"SeqNo":7,"EventId":266,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:27 (h:m:s)","Description":"Board Revision 30004"},{"SeqNo":8,"EventId":241,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:44 (h:m:s)","Description":"Previous configuration completely missing at boot"},{"SeqNo":9,"EventId":499,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:44 (h:m:s)","Description":"Boot Device reset, setting target ID as invalid"},{"SeqNo":10,"EventId":195,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:44 (h:m:s)","Description":"CacheVault disabled; changing WB virtual disks to WT, Forced WB VDs are not affected"},{"SeqNo":11,"EventId":44,"Level":"Information","Time":"1/1/2016 ; 4:7:53","Description":"Time established as 01/01/16  4:07:53; (39 seconds since power on)"},{"SeqNo":12,"EventId":44,"Level":"Information","Time":"1/1/2016 ; 4:8:4","Description":"Time established as 01/01/16  4:08:04; (50 seconds since power on)"},{"SeqNo":13,"EventId":43,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:5 (h:m:s)","Description":"Test event: 'Event log adjusted, possibly due Firmware version incompatibility'"},{"SeqNo":14,"EventId":0,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:22 (h:m:s)","Description":"Firmware initialization started (PCI ID 0014/1000/9460/1000)"},{"SeqNo":15,"EventId":1,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:22 (h:m:s)","Description":"Firmware version 5.130.00-3059"},{"SeqNo":16,"EventId":142,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Energy Pack Not Present"},{"SeqNo":17,"EventId":261,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Package version 51.13.0-3223"},{"SeqNo":18,"EventId":266,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Board Revision 30004"},{"SeqNo":19,"EventId":241,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:40 (h:m:s)","Description":"Previous configuration completely missing at boot"},{"SeqNo":20,"EventId":499,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:40 (h:m:s)","Description":"Boot Device reset, setting target ID as invalid"},{"SeqNo":21,"EventId":195,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:40 (h:m:s)","Description":"CacheVault disabled; changing WB virtual disks to WT, Forced WB VDs are not affected"},{"SeqNo":22,"EventId":44,"Level":"Information","Time":"1/1/2016 ; 4:10:56","Description":"Time established as 01/01/16  4:10:56; (36 seconds since power on)"},{"SeqNo":23,"EventId":44,"Level":"Information","Time":"1/1/2016 ; 4:11:7","Description":"Time established as 01/01/16  4:11:07; (47 seconds since power on)"},{"SeqNo":24,"EventId":0,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:22 (h:m:s)","Description":"Firmware initialization started (PCI ID 0014/1000/9460/1000)"},{"SeqNo":25,"EventId":1,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:22 (h:m:s)","Description":"Firmware version 5.130.00-3059"},{"SeqNo":26,"EventId":142,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Energy Pack Not Present"},{"SeqNo":27,"EventId":261,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Package version 51.13.0-3223"},{"SeqNo":28,"EventId":266,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Board Revision 30004"},{"SeqNo":29,"EventId":0,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:22 (h:m:s)","Description":"Firmware initialization started (PCI ID 0014/1000/9460/1000)"},{"SeqNo":30,"EventId":1,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:22 (h:m:s)","Description":"Firmware version 5.130.00-3059"},{"SeqNo":31,"EventId":142,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Energy Pack Not Present"},{"SeqNo":32,"EventId":261,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Package version 51.13.0-3223"},{"SeqNo":33,"EventId":266,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Board Revision 30004"},{"SeqNo":34,"EventId":0,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:22 (h:m:s)","Description":"Firmware initialization started (PCI ID 0014/1000/9460/1000)"},{"SeqNo":35,"EventId":1,"Level":"Information","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:22 (h:m:s)","Description":"Firmware version 5.130.00-3059"},{"SeqNo":36,"EventId":142,"Level":"Warning","Time":" Time elapsed since power on : 0 years, 0 months, 0 days; 0:0:23 (h:m:s)","Description":"Energy Pack Not Present"}],"@odata.etag":"1b4872ec0e84117020903df9b69db061"}`;
    responseJson = JSON.parse(responseJson);
    console.log(responseJson);
    OngetEventsLog(responseJson);
}

function OngetEventsLog(responseJson) {
    console.log(responseJson);
    EventsLogTableArray = [];
    if (responseJson.hasOwnProperty('Count')) {
        var count = responseJson.Count;
        if (count > 0) {
            if (responseJson.hasOwnProperty('Data')) {
                EventsLogTableArray = responseJson.Data;
                //console.log(EventsLogTableArray);
                ShowEventsTable();
            }
        } else {
            eventsLogTabObj.empty();
            eventslog_button_all_disable();
            var control_info = $('#events_selecter :selected').text();
            //console.log('################## ' + control_info);
            control_info = lang.LANG_SM_NO_EVENTS_LOG + ' \"' + control_info + '\" ' + lang.LANG_SM_RAID_CARD;
            alert(control_info);
            showLoading(false);
        }
    } else {
        top.topmenu.raidErrorHandler(4);
        showNoRaid();
    }

}
