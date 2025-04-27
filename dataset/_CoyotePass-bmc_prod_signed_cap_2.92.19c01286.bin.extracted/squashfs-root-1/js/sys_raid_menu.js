"use strict";

var http = 'https://';
var ip = location.host;
var SystemId = null;
var menuItemArray = []; //{ ID: value, UIName: uiValue, URI: jsonUri , Type: value, UIInfo: value }
var menuItemMap;
var menuID;
var rfURI = '/redfish/v1/Systems/';
var raidObj = {};
var ajax_data = "";
var g_raidErrorInfo = '';
var mTimeoutMax = 90000;
var g_RAID_Notify = false;
var g_RAID_Notify_Category = null;

//disable for console.log on
//console.log = function() {}


function ajaxsetup() {
    //console.log(top.topmenu.getSessionID());
    jQuery.ajaxSetup({
        timeout: mTimeoutMax,
        processData: false,
        headers: {
            //authorization: "Basic cm9vdDpBZG1pbjEyMyQ=",
            SID: top.topmenu.getSessionID() },
        contentType: 'application/json',
        dataType: 'json'
    });
}

function getRaidMenuItem(item, index) {
    return item;
}

//{ ID: idValue, UIName: uiValue, URI: jsonUri , Type: type, UIInfo: uiInfo}
function genMenuItemKeyValue(idValue, uiValue, jsonUri, type, uiInfo, count) {
    var o = { ID: idValue, UIName: uiValue, URI: jsonUri, Type: type, UIInfo: uiInfo, Count: count };
    menuItemArray.push(o);
    //console.log(menuItemArray);
}

//ex: @odata.context, @odata.id, @odata.type
function removeProperty(json, property) {
    if (json.hasOwnProperty(property)) {
        delete json[property];
    }
    //console.log(json);
    return json;
}

function removeProperties(json) {
    //remove don't need property
    json = removeProperty(json, '@odata.context');
    //json = removeProperty(json, '@odata.id');
    json = removeProperty(json, '@odata.type');
    return json;
}

function OncheckControllerStateSucc(responseJson, textStatus, jqXHR) {
    //console.log(responseJson);
    if (responseJson.hasOwnProperty("Status")) {
        var Status = responseJson["Status"];
        if (Status.hasOwnProperty('State')) {
            //console.log(Status['State']);
            if (Status['State'] == 'Disabled') { //will no event log
                //console.log('no event');
                genMenuItemKeyValue(menuID++, lang.LANG_SM_EVENTS_LOG_MENU_ITEM, 'N', 'Events', 'Summary', menuItemArray[1].URI.length);
            } else {
                genMenuItemKeyValue(menuID++, lang.LANG_SM_EVENTS_LOG_MENU_ITEM, menuItemArray[1].URI, 'Events', 'Summary', menuItemArray[1].URI.length);
            }
        }
    }
    genMenuItemKeyValue(menuID++, 'SATA', 'N', 'SATA', 'SATA', menuItemArray[1].URI.length);
    menuItemMap = menuItemArray.map(getRaidMenuItem);
    //console.log("menuItemMap==>\n");
    //console.log(menuItemMap);
    g_raidErrorInfo = '';
    if (top.topmenu.MainFrame.g_RAIDServiceIsDone) {
        //console.log('Raid refresh is done!!');
        top.topmenu.MainFrame.raidPageRefreshOk();
    }
    // var raid_menu = createStorageMenu();
    // updateTopmenuArray(gLang.getStr("")LANG_TOPMENU_RAID, "sys_raid", "sys_raid", "sys_raid", g_submenu_obj, raid_menu, "3", "4");
    // reloadMenuBar();
    //console.log(g_submenu_obj);
    getControllerName();
}

function OncheckControllerStateError(xhr, errorThrown) {
    //console.log(xhr.status);
    //console.log(errorThrown);
}

function checkControllerState(rfuri) {
    //console.log(rfuri);
    jQuery.ajax({
        url: rfuri,
        type: "GET"
    }).done(function(responseJson, textStatus, jqXHR){
        OncheckControllerStateSucc(responseJson, textStatus, jqXHR);
    }).fail(function(xhr, errorThrown) {
        OncheckControllerStateError(xhr, errorThrown);
    });
}

function getjsonSID() {
    var json = JSON.parse("{}");
    json.SID = top.topmenu.getSessionID();
    return json;
}

/*
    type: Controller --> 1. store StorageControllers scheme data into raidObj.Controllers
                         2. generate menuItemMap[1] -> Controllers
                         3. generate menuItemMap[2] -> Drives

    type: VolumeCollection --> 1. store StorageControllers scheme data into raidObj.Controllers
                               2. generate menuItemMap[3] -> Volumes
                               3.
                               4. generate menuItemMap[4] -> Events
*/
function OngenerateMenuItem2(type, responseJson, textStatus, jqXHR) {
    if (type == 'Controller') {
        var rfURControllers = [];
        var rfURLDrives = [];
        var ControllersData = [];//get Controllers detail data;
        //console.log(responseJson);
        //console.log(type);
        var controllersMember = responseJson.StorageControllers;
        //console.log(controllersMember);

        if (controllersMember.length == 0) {
            //console.log(gLang.getStr("LANG_SM_NO_RAID_ALERT2"));
            raidErrorHandler(2);
            return;
        } else {
            var odataid;
            for (var i = 0; i < controllersMember.length; i++) {
                odataid = controllersMember[i];
                ControllersData.push(controllersMember[i]);
                if (odataid.hasOwnProperty('@odata.id')) {
                    //rfURController = odataid['@odata.id'];
                    rfURControllers.push(odataid['@odata.id']);
                }
            }
            raidObj.Controllers = ControllersData;
            //console.log(raidObj);
        }
        //console.log(rfURControllers);
        genMenuItemKeyValue(menuID++, lang.LANG_SM_CONTROLLER_MENU_ITEM, rfURControllers, type, 'Controller Info', controllersMember.length);
        if (responseJson.hasOwnProperty("Drives")) {
            var driveary = responseJson.Drives;
            //console.log(driveary.length);
            if (driveary.length > 0) {
                for (var k = 0; k < driveary.length; k++) {
                    var drvodta = driveary[k];
                    if (drvodta.hasOwnProperty('@odata.id')) {
                        rfURLDrives.push(drvodta['@odata.id']);
                    }
                }
                genMenuItemKeyValue(menuID++, lang.LANG_SM_PHYSICAL_DEVICES_MENU_ITEM, rfURLDrives, 'Drives', 'Summary', driveary.length);
            } else {
                genMenuItemKeyValue(menuID++, lang.LANG_SM_PHYSICAL_DEVICES_MENU_ITEM, 'N', 'Drives', 'Summary', driveary.length);
            }
        }
        //console.log(rfURLDrives);
        if (responseJson.hasOwnProperty("Volumes")) {
            var vcurl;//VolumeCollection
            var volmes = responseJson.Volumes;
            if (volmes.hasOwnProperty('@odata.id')) {
                vcurl = volmes['@odata.id'];
            }
            //console.log(vcurl);
            generateMenuItem2('VolumeCollection', vcurl);
        }
    }
    if (type == 'VolumeCollection') {
        //console.log(type);
        //console.log(responseJson);
        var rfURLVC = [];
        if (responseJson.hasOwnProperty("Members")) {
            rfURLVC = [];
            var members = responseJson.Members;
            if (members.length > 0) {
                raidObj.VolumeCollection = responseJson;
            }
            for (var j = 0; j < members.length; j++) {
                var vcodataid = members[j];
                if (vcodataid.hasOwnProperty('@odata.id')) {
                    //console.log(vcodataid['@odata.id']);
                    rfURLVC.push(vcodataid['@odata.id']);
                }
            }
        }
        //console.log(raidObj);
        //console.log("VolumeCollection:" + rfURLVC);
        if (rfURLVC.length > 0) {
            genMenuItemKeyValue(menuID++, lang.LANG_SM_LOGICAL_DEVICES_MENU_ITEM, rfURLVC, 'Volumes', 'Summary', members.length);
        } else {
            genMenuItemKeyValue(menuID++, lang.LANG_SM_LOGICAL_DEVICES_MENU_ITEM, 'N', 'Volumes', 'Summary', members.length);
        }
        //generate Events menu item
        var rfURLEvents = [];
        var obj = {};
        for (var m = 0; m < raidObj.Controllers.length; m++) {
            var odataevents = raidObj.Controllers[m];
            if (odataevents.hasOwnProperty('@odata.id')) {
                //console.log(odataevents['@odata.id']);
                //get @odata.id & remove # -->/redfish/v1/Systems/123456789/Storage/1#/StorageControllers/0 --> /redfish/v1/Systems/123456789/Storage/1/StorageControllers/0
                var tmpdata = odataevents['@odata.id'];
                tmpdata = tmpdata.replace(/#/g, '');
                obj['@odata.id'] = tmpdata;
                //get Oem.InsydeControllers['SeqNumNewestEvent']/['SeqNumOldestEvent']
                var OemMember = odataevents.Oem.Controllers;
                obj['Oem'] = OemMember;
                rfURLEvents.push(obj);
                obj = {};
            }
        }
        //console.log(rfURLEvents);
        if (rfURLEvents.length > 0) {
            genMenuItemKeyValue(menuID++, lang.LANG_SM_EVENTS_LOG_MENU_ITEM, rfURLEvents, 'Events', 'Summary', rfURLEvents.length);
        } else {
            genMenuItemKeyValue(menuID++, lang.LANG_SM_EVENTS_LOG_MENU_ITEM, 'N', 'Events', 'Summary', 0);
        }
        genMenuItemKeyValue(menuID++, 'SATA', 'N', 'SATA', 'SATA', menuItemArray[1].URI.length);
        menuItemMap = menuItemArray.map(getRaidMenuItem);
        sessionStorage.setItem("RAID_IS_READY", 1);
        document.getElementById("sys_raid").show();
        console.log("Show the sys_raid TAB");
        //console.log("menuItemMap==>\n", typeof(menuItemMap));
        //console.log(menuItemMap, JSON.stringify(menuItemMap));
        g_raidErrorInfo = '';
        //console.log('g_RAID_Notify', g_RAID_Notify);
        if (top.topmenu.MainFrame.document.title == 'RAID') {
            //console.log('Raid refresh is done!!');
            //top.topmenu.MainFrame.raidPageRefreshOk();
            top.topmenu.page_mapping('sys_raid', '0');
        }
        //getControllerName();
    }
}


function OngenerateMenuItem2Error(xhr, errorThrown) {
    if (xhr.status == 404) { //url not found
        raidErrorHandler(4);
    }
}

//Step 3. get StorageControllers/Drives/Volumes scheme from redfish
//        to generate Controller/Physical Devices/Logical Devices menuitem
function generateMenuItem2(type, rfuri) {
    //console.log('type=' + type  + ', URI:' + http + ip + rfuri);
    //console.log(rfuri);
    jQuery.ajax({
            url: rfuri,
            type: "GET"
        }).done(function(responseJson, textStatus, jqXHR){
                //console.log(responseJson);
                if (type == 'Controller') {
                    //store Storage scheme data into raidObj.Storage;
                    raidObj.Storage = responseJson;
                    //console.log(raidObj);
                }
                OngenerateMenuItem2(type, responseJson, textStatus, jqXHR);
        }).fail(function(xhr, errorThrown) {
               console.log('======= generateMenuItem2 error =========');
               console.log(xhr.status);
               console.log(errorThrown);
               sessionStorage.setItem("RAID_IS_READY", 0);
        });
}

function createStorageMenu() {
    var result = JSON.parse("{}");
    var menu_list = [];
    var temp = null;
    temp = JSON.parse("{}");
    temp["path"] = "./";
    temp["displayname"] = "LANG_SM_STORAGE_SYSTEM_MENU_ITEM";
    menu_list.push(temp);

    temp = JSON.parse("{}");
    temp["path"] = "./1";
    temp["displayname"] = "LANG_SM_CONTROLLER_MENU_ITEM";
    menu_list.push(temp);

    temp = JSON.parse("{}");
    temp["path"] = "./2";
    temp["displayname"] = "LANG_SM_PHYSICAL_DEVICES_MENU_ITEM";
    menu_list.push(temp);

    temp = JSON.parse("{}");
    temp["path"] = "./3";
    temp["displayname"] = "LANG_SM_LOGICAL_DEVICES_MENU_ITEM";
    menu_list.push(temp);

    result["RAID_MENUS"] = menu_list;
    return result;
}

function onlyStorageMenu() {
    var result = JSON.parse("{}");
    var menu_list = [];
    var temp = null;

    temp = JSON.parse("{}");
    temp["path"] = "./";
    temp["displayname"] = "LANG_SM_STORAGE_SYSTEM_MENU_ITEM";
    menu_list.push(temp);

    result["RAID_MENUS"] = menu_list;
    return result;
}

function raidErrorHandler(type) {
    if (type == 1) {
        g_raidErrorInfo = lang.LANG_SM_RAID_ERROR_INFO_TYPE1;
    } else if (type == 2) {
        g_raidErrorInfo = lang.LANG_SM_RAID_ERROR_INFO_TYPE2;
    } else if (type == 3) {
        g_raidErrorInfo = lang.LANG_SM_RAID_ERROR_INFO_TYPE3;
    } else if (type == 4) {
        g_raidErrorInfo = lang.LANG_SM_RAID_ERROR_INFO_TYPE4;
    } else if (type == 5) {
        g_raidErrorInfo = lang.LANG_SM_RAID_ERROR_INFO_TYPE5;
    }
    sessionStorage.setItem("RAID_IS_READY", 0);
    // if (!top.topmenu.MainFrame.g_RAIDServiceIsDone) {
    //     console.log('RAID Serivce reinit fail');
    //     if (top.topmenu.MainFrame.document.title == 'RAID') {
    //         top.topmenu.MainFrame.raidPageRefreshFail();
    //     }
    // }
    //console.log(g_raidErrorInfo);
}

function OngenerateMenuItem(responseJson, textStatus, jqXHR) {
    //console.log(">>>>>>>>>>jqXHR.status " + jqXHR.status);
    var uiValue;
    var jsonUri;
    var regrule = /^(1|[1-9][0-9]*)$/; //first number cannot be 0
    if (responseJson == null) {
        //console.log(gLang.getStr("LANG_SM_NO_RAID_ALERT2"));
        raidErrorHandler(2);
        return;
    }
    if (jqXHR.status == 200) {
        if (responseJson.hasOwnProperty('Storage') == true) {
            //console.log('Storage: ' + responseJson['Storage']['@odata.id']);
            var storage = responseJson.Storage;
            if (storage.hasOwnProperty('@odata.id')) {
                var odataid = storage['@odata.id'];
                //console.log(odataid);
                //generateMenuItem(odataid);
                requestRaidScheme(odataid);
            } else {
                //console.log(gLang.getStr("LANG_SM_NO_RAID_ALERT2"));
                raidErrorHandler(2);
                return;
            }
        }
    } else {
        console.log(">>>>>>>>>>jqXHR.status " + jqXHR.status);
        raidErrorHandler(3);
        return;
    }
}

function OngenerateMenuItemError(jqXHR, errorThrown) {
    //console.log(jqXHR.status);
    //console.log(errorThrown);
    if (jqXHR.status != 200 || errorThrown == 'error') {
        //console.log(errorThrown);
        //console.log(gLang.getStr("LANG_SM_NO_RAID_ALERT"));
        raidErrorHandler(1);
    }
}

//Step 2. get Storage scheme from redfish to generate 'Storage' menuitem
function generateMenuItem(rfuri) {
    //console.log(rfuri);
    jQuery.ajax({
        url: rfuri,
        type: "GET"
    }).done(function(responseJson, textStatus, jqXHR){
            //console.log(responseJson);
            OngenerateMenuItem(responseJson, textStatus, jqXHR);
    }).fail(function(xhr, errorThrown) {
        OngenerateMenuItemError(xhr, errorThrown);
        sessionStorage.setItem("RAID_IS_READY", 0);
    });
}

//+++++
/*
    1. find out --> /redfish/v1/Systems/serialid/Storage/1 --> raid redfish entry
    2. generate menuItemMap[0] -> Storage
*/
function requestRaidScheme(raidEntry) {
    //console.log(raidEntry);
    var regrule = /^(1|[1-9][0-9]*)$/; //first number cannot be 0
    var jsonUri = [];
    let tmpURI = null, tmpURITokens = null;
    let tailToken = null;

    jQuery.ajax({
        url: raidEntry,
        type: "GET"
    }).done(function(responseJson, textStatus, jqXHR){
        if (responseJson.hasOwnProperty("Members")) {
            var members = responseJson.Members;
            for (var i = 0; i < members.length; i++) {
                var odataid = members[i];
                if (odataid.hasOwnProperty('@odata.id')) {
                    tmpURI = odataid['@odata.id'];
                    //console.log(tmpURI)
                    tmpURITokens = tmpURI.split("/");
                    //console.log(tmpURITokens)
                    if (tmpURITokens.length > 1 && tmpURITokens[tmpURITokens.length - 2] == 'Storage') {
                        tailToken = tmpURITokens[tmpURITokens.length - 1];
                        var result = false;
                        result = tailToken.match('Raid');
                        if (result != null) {
                            jsonUri.push(odataid['@odata.id']);
                        } else {
                            continue;
                        }
                    }
                }
            }
        }
        //console.log(jsonUri);
        if (jsonUri.length > 0) { //find out raid entyr , ex --> /redfish/v1/Systems/123456789/Storage/1
            //raidObj['StorageCollection'] = responseJson;
            var typeval = 'Storage';
            var uiinfo = 'System Info';
            menuID = 0;
            //{ ID: value, UIName: uiValue, URI: jsonUri , Type: value, UIInfo: value }
            var o = { ID: menuID, UIName: lang.LANG_SM_STORAGE_SYSTEM_MENU_ITEM, URI: [jsonUri], Type: typeval, UIInfo: uiinfo, Count: jsonUri.length };
            menuItemArray.push(o);
            //query StorageController scheme
            menuID++;
            //console.log('menuItemArray[0].URI = ' + menuItemArray[0].URI);
            generateMenuItem2('Controller', menuItemArray[0].URI);
        } else {
            raidErrorHandler(5);//no storage controller
            //if (top.topmenu.MainFrame.document.title == 'RAID') {
            //    top.topmenu.MainFrame.raidPageRefreshFail();
            //}
        }
    }).fail(function(xhr, errorThrown) {
        OngenerateMenuItemError(xhr, errorThrown);
        sessionStorage.setItem("RAID_IS_READY", 0);
    });
}
//-----

function OngetRFSystems(responseJson, textStatus, jqXHR) {
    //console.log("====sys_raid_menu.js >> OngetRFSystems =======");
    //console.log(responseJson);
    if (responseJson.hasOwnProperty("Members")) {
        var members = responseJson["Members"];
        for (var i = 0; i < members.length; i++) {
            var odataid = members[i];
            if (odataid.hasOwnProperty('@odata.id')) {
                id = odataid['@odata.id'].split("/");
                SystemId = id[id.length - 1];
                //console.log(SystemId);
                rfURI = rfURI + '/' + SystemId;
            }
        }
    }
    //console.log(rfURI);
    //console.log("====sys_raid_menu.js >> OngetRFSystems =======");
    generateMenuItem(rfURI);
}

function OngetRFSystemsError(xhr, errorThrown) {
    //console.log(xhr.status);
    //console.log(errorThrown);

    //console.log('redfish service is un-available!!');
    raidErrorHandler(3);
    return;
}

//for topmenu.js call entry
function RequestRAIDMenu() {
    menuItemArray = [];
    menuItemMap = null;
    //console.log('=====RequestRAIDMenu()========');
    //console.log(rfURI + rf_system_sn());
    ajaxsetup();
    generateMenuItem(rfURI + rf_system_sn());
    g_RAID_Notify = false;
}

function RaidRefresh(notify_category) {
    menuItemArray = [];
    menuItemMap = null;
    //console.log('=====RaidRefresh()========');
    //console.log(rfURI + getRedfishSerial());
    generateMenuItem(rfURI + getRedfishSerial());
    g_RAID_Notify = true;
    g_RAID_Notify_Category = notify_category;
}

//Broadcom: show menu
//Microsemi: hide menu
function getControllerName() {
    var promises = [];
    var tmp = [];
    //console.log(menuItemMap[1].URI);
    jQuery.each(menuItemMap[1].URI, function(i, url) {
        //console.log(i, + ', ' + url);
        var promise = jQuery.get(url).done(function(json) {
            try {
                //console.log(url);
                //console.log(json);
                var obj = {};
                obj["Name"] = json.Name;
                obj['@odata.id'] = json['@odata.id'];
                //console.log(obj);
                tmp.push(obj);
                promises.push(promise);
                raidObj['Controller'] = tmp;
                //console.log(raidObj);
            } catch (err) {
                console.log(err);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        });
        promises.push(promise);
    });

    jQuery.when.apply(jQuery, promises)
    .done(function() {
        //console.log("getControllerName is All done!");
    }).fail(function() {
        // something went wrong here, handle it
    });
}
