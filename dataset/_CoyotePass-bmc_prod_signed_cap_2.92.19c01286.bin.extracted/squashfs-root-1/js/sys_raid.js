"use strict";
/* for sys_raid page */

//disable for console.log on
console.log = function() {}

var http = 'https://';
var ip = location.host;
var itemClicked;
var controller = new Array();
var gStorageCount = 0;
var StorageArray = new Array();
var g_menuItemSelected;
var ajax_data = "";
var raidObj = {};
var idx;
var hotspareAction;
var WS_MSG_CATEGORY_MASK = 10000;
var WS_MSG_CATEGORY_ONESHOT_SILENT_MASK = 7 * WS_MSG_CATEGORY_MASK;
var WS_MSG_CATEGORY_ONESHOT_RAID_INIT_DONE = WS_MSG_CATEGORY_ONESHOT_SILENT_MASK + 1;
var WS_MSG_CATEGORY_ONESHOT_RAID_CACHE_DONE = WS_MSG_CATEGORY_ONESHOT_SILENT_MASK + 2;
var g_RAIDServiceIsDone = false;
var mLangMap = null;
var mTimeoutMax = 90000;
var gControllerIdx = 0;
var mPageReloadsecs = 3000;
var mTimeoutPatrol = 60000;
var mPatrolReadTimer = null;
var mPatrolReadTimerbyDriveId;
//var alert = window.top.dialogAlert;
var errInfo; //= new LoadingProcess(document.querySelectorAll('#raiderrorinfo')[0], {});
var graidAction = {};

//TODO:
function ajaxsetup() {
    jQuery.ajaxSetup({
        timeout: mTimeoutMax,
        processData: false,
        headers: {
            SID: top.topmenu.getSessionID()
        },
        contentType: 'application/json',
        dataType: 'json'
    });
}

function menuItemclick(itemClicked) {
    //console.log(top.topmenu.menuItemMap);
    console.log('itemClicked = ', itemClicked, typeof(itemClicked));
    let raidState = sessionStorage.getItem("RAID_IS_READY");
    if (top.topmenu.menuItemMap == null || raidState == '0') {
        top.topmenu.g_raidErrorInfo = lang.LANG_SM_RAID_ERROR_INFO_TYPE4;
        showNoRaid();
        top.topmenu.RequestRAIDMenu();
        alert(lang.LANG_SM_RAID_CHECK_INFO);
        return;
    }
    var count = top.topmenu.menuItemMap[itemClicked].URI.length;
    var type = top.topmenu.menuItemMap[itemClicked].Type;
    g_menuItemSelected = top.topmenu.menuItemMap[itemClicked].Type;
    if (itemClicked == 1) { //Controllers
        drivesTableInit();
        volumesTableInit();
        prepareControllersSelect(top.topmenu.menuItemMap[itemClicked].URI);
    } else if (itemClicked == 2) { //drive
        prepareDrivesSelect(top.topmenu.menuItemMap[itemClicked].URI);
    } else if (itemClicked == 3) { //volumes
        //prepareVolumesSelect(top.topmenu.menuItemMap[itemClicked].URI);
        fetchVolumeInfo('VolumeCollection');
    } else if (itemClicked == 4) { //Events
        eventsTableInit();
        prepareEventsSelect(top.topmenu.menuItemMap[itemClicked].URI);
    } else {
        if (itemClicked == 0) { //need to know real physical disk
            showLoading(true);
            //refresh Storage page form top.topmenu.raidObj.Storage;
            refreshTable('Storage');
        }
    }
}

function prepareControllersSelect(controllers) {
    //console.log(controllers);
    showLoading(true);
    disableSelect(true);
    $("#_selecter option").remove();
    let token = null;
    for (var i = 0; i < controllers.length; i++) {
        token = controllers[i].split("/");
        //console.log(token);
        $("#_selecter").append($("<option></option>")
            .attr("value", i)
            .text(lang.LANG_SM_ST_TITLE + " " + token[6] + ", " + lang.LANG_SM_CTR_TITLE + " " + token[8]));
    }
    refreshTable('Controller');
    getControllerById(0);
}

function getControllerById(id) {
    showLoading(true);
    //console.log('getControllerById(' + id + ') and url -->' + top.topmenu.menuItemMap[1].URI[id]);
    $.get(top.topmenu.menuItemMap[1].URI[id])
        .done(function(responseJson) {
            raidObj.controller_selected = responseJson;
            console.log(raidObj);
            //+++
            if (responseJson.hasOwnProperty('StorageControllers'))
                refreshController(responseJson, id);
            else {
                top.topmenu.raidErrorHandler(5);
                showNoRaid();
                jQuery('#resources_zone', top.topmenu.MainFrame.document).hide();
                jQuery('#volumes_table_zone', top.topmenu.MainFrame.document).hide();
            }
            //---
        })
        .fail(function(xhr, errorThrown) {
            console.log(xhr.status);
            console.log(errorThrown);
            if (xhr.statusText == 'Not Found') {
                top.topmenu.raidErrorHandler(5);
                showNoRaid();
            }
            $('#resources_zone').hide();
        });
}

function prepareDrivesSelect(drives) {
    //console.log(drives);
    showLoading(true);
    $("#_selecter option").remove();
    if (drives.length == 0 || drives == undefined) {
        alert(lang.LANG_SM_NO_PHYSICAL_DEVICES_INFO);
        showLoading(false);
        return;
    } else {
        var storage = null;
        var controller = null;
        for (var i = 0; i < drives.length; i++) {
            storage = drives[i].split("/");
            controller = top.topmenu.menuItemMap[1].URI[top.topmenu.menuItemMap[1].URI.length - 1].split("/");
            if (controller.length == 0) {
                break;
            } else {
                $("#_selecter").append($("<option></option>")
                    .attr("value", i)
                    .text(lang.LANG_SM_ST_TITLE + " " + storage[6] + /*", " + lang.LANG_SM_CTR_TITLE") + " " + controller[8] +*/ ', Drives ' + storage[8]));
            }
        }
    }
    let driveid = sessionStorage.getItem("raid_goto_drive_from_controller_page");
    console.log(driveid, ',typeof=' + typeof(driveid));
    if (driveid == null || driveid =='null') {
        driveid = 0; //default select stay at 0 position
    } else {
        $("#_selecter").val(driveid);
    }
    sessionStorage.setItem("raid_goto_drive_from_controller_page", "null");
    refreshTable('Drives');
    if (drives.length > 0) {
        getDrivesInfoById(driveid);
    } else {
        alert(lang.LANG_SM_NO_PHYSICAL_DEVICES_INFO);
        showLoading(false);
    }
}

function getDrivesInfoById(id) {
    showLoading(true);
    console.log('getDrivesInfoById(' + id + ') and url -->' + http + ip + top.topmenu.menuItemMap[2].URI[id]);
    $.get(http + ip + top.topmenu.menuItemMap[2].URI[id])
        .done(function(responseJson) {
            //+++
            if( !responseJson.hasOwnProperty('Oem') ) {
                top.topmenu.raidErrorHandler(5);
                showNoRaid();
                return;
            }
            //---
            refreshDrivesInfo(responseJson);
            //raidObj.selected_Drives --> Hot spare & patrol read used
            raidObj.selected_Drives = responseJson;
            //console.log(raidObj.selected_Drives);
            var controllerId = responseJson['Oem']['Drive']['StorageControllerReference'];
            //isControllerSet(controllerId);
            console.log(top.topmenu.raidObj.Controllers[controllerId].Name);
            if (top.topmenu.raidObj.Controllers[controllerId].Name.indexOf('Broadcom') >= 0 ) {
                if (sessionStorage.getItem("raid_drive_patrolread") == '1') {
                    var obj = {};
                    if (responseJson.hasOwnProperty('Id')) {
                        obj.Id = responseJson.Id;
                    }
                    if (responseJson.hasOwnProperty('Name')) {
                        let id = responseJson.Name.split(' ');
                        obj.Name = lang.LANG_SM_RAID_PATROL_READ_PHYSICAL_DEVICE + id[id.length-1] + lang.LANG_SM_RAID_PATROL_READ;
                    }
                    if (responseJson.hasOwnProperty('Oem')) {
                        var Oem = responseJson.Oem.Drive;
                        if (Oem.hasOwnProperty('PatrolReadProgressPercent')) {
                            obj.PatrolReadProgressPercent = Oem.PatrolReadProgressPercent;
                            console.log(obj);
                            //remove and drive progress indicator
                            $(".patrolread").remove();
                            if (Oem.PatrolReadProgressPercent == null) {
                                $('#patrolread_div').hide();
                                return;
                            }
                            generate_show_Progress_by_drive(obj);
                            $('#patrolread_div').show();
                        } else {
                            $('#patrolread_div').hide();
                            $(".patrolread").remove();//remove previous patrol disk.
                        }
                    }
                }
            } else {
                $(".patrolread").remove();
            }
        })
        .fail(function(xhr, errorThrown) {
            console.log(xhr.status);
            console.log(errorThrown);
            if (xhr.statusText == 'Not Found') {
                top.frames.topmenu.raidErrorHandler(5);
                showNoRaid();
            }
        })
        .always(function() {
            showLoading(false);
        });
}

function fetchVolumeInfo(type) {
    $('#patrolread_div').hide();
    $("#progress_indicator_div").hide();
    $('#eventslog_zone').hide();
    $('#volumes_table_zone').hide();
    showLoading(true);
    let rfURL;
    if (type == 'VolumeCollection') {
        rfURL = top.topmenu.menuItemMap[0].URI + '/Volumes';
        console.log('updateMenuItemKeyValue, get VolumeCollection:', rfURL);
        $.ajax({
            url: rfURL,
            type: 'GET',
        }).done(function(responseJson, textStatus, jqXHR){
            console.log(responseJson);
            onupdateMenuItemKeyValueSuccess(responseJson, textStatus, jqXHR);
            prepareVolumesSelect(top.topmenu.menuItemMap[itemClicked].URI);
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log("===== fetchVolumeInfo error =====");
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("======================================");
            showLoading(false);
            alert(rfURL + ', ajax fail!');
        });
    }
}

function prepareVolumesSelect(volumes) {
    console.log(volumes);
    showLoading(true);
    $("#_selecter option").remove();
    if (volumes.length == 0 || volumes == undefined || volumes == 'N') {
        //alert(lang.LANG_SM_NO_LOGICAL_DEVICES_INFO"));
        sessionStorage.setItem("RAID_IS_READY", 0);
        errorInfo(true, lang.LANG_SM_LD_TITLE, lang.LANG_SM_NO_LOGICAL_DEVICES_INFO);
        showLoading(false);
        jQuery('#loading', top.topmenu.MainFrame.document).hide();
        $('#resources_zone').hide();
        $('.main_info_eventslog').hide();
        $('#patrolread_div').hide();
        return;
    } else {
        var storage = null;
        //get all volumes ID and attached to selecter
        for (var i = 0; i < volumes.length; i++) {
            storage = volumes[i].split("/");
            $("#_selecter").append($("<option></option>")
                .attr("value", i)
                .text(storage[8]));
        }
    }
    let volumeid = sessionStorage.getItem("raid_goto_volume_from_controller_page");
    console.log(volumeid, ',typeof=' + typeof(volumeid));
    if (volumeid == null || volumeid =='null') {
        volumeid = $("#_selecter").find("option:selected").text();
    }
    console.log(volumeid);
    $("#_selecter").children().each(function(){
        if ($(this).text() == volumeid){
            $(this).attr("selected", true);
        }
    });

    refreshTable('Volumes');
    getVolumesInfoById(volumeid);
}

function getVolumesInfoById(id) {
    showLoading(true);
    // redfish/v1/Systems/000000000000/Storage/1 + '/Volumes/' + id(Broadcom10)
    var findURL = top.topmenu.menuItemMap[0].URI + '/Volumes/' + id;
    console.log('getVolumesInfoById findURL:', findURL);
    var result = top.topmenu.menuItemMap[3].URI.includes(findURL);
    if (result) {
        $.get(findURL)
        .done(function(responseJson) {
            //console.log(responseJson);
            refreshVolumesInfo(responseJson);
            //raidObj.selected_Drives --> Hot spare & patrol read used
            raidObj.selected_Volumes = responseJson;
            console.log('raidObj.selected_Volumes', raidObj.selected_Volumes);
            var controllerId = responseJson['Oem']['Volume']['StorageControllerReference'];
            console.log('link to controller ' + controllerId);
            console.log(top.topmenu.raidObj.Controllers[controllerId].Name);
            //isControllerSet(controllerId);
        })
        .fail(function(xhr, errorThrown) {
            console.log(xhr.status);
            console.log(errorThrown);
            if (xhr.statusText == 'Not Found') {
                top.topmenu.raidErrorHandler(4);
                showNoRaid();
            }
        })
        .always(function() {
            sessionStorage.setItem("raid_goto_volume_from_controller_page", "null");
            showLoading(false);
        });
    } else {
        console.log('getVolumesInfoById(), error:' + findURL + ' not exist!!');
    }
}

function prepareEventsSelect(events) {
    console.log(events);
    //showLoading(true);
    $("#events_selecter option").remove();
    if (events.length == 0 || events == undefined) {
        alert(lang.LANG_SM_NO_EVENTS_LOG_INFO);
        showLoading(false);
        return;
    } else {
        var token = null;
        for (var i = 0; i < events.length; i++) {
            token = events[i]['@odata.id'].split("/");
            $("#events_selecter").append($("<option></option>")
                .attr("value", i)
                .text(lang.LANG_SM_ST_TITLE + " " + token[6] + ", " + lang.LANG_SM_CTR_TITLE + " " + token[8]));
        }
    }
    //default get first url in events array
    getEventsLogById(0);
}

function getEventsLogById(id) {
    showLoading(true);
    console.log('getEventsLogById(' + id + ') and url -->');
    console.log(top.topmenu.menuItemMap[4].URI[id]);
    getEventsLog(top.topmenu.menuItemMap[4].URI[id]);
    refreshTable('Events');
}

function errorInfo(show, title, info) {
    console.log('info', info);
    $(".errorinfo_div").empty();
    if (show) {
        let $ele = `
            <main id="raiderrorinfo">
                <h1 id="summary_title_div_error"></h1>
            </main>
        `;
        jQuery('.errorinfo_div').append($ele);
        //$('#summary_title_div_error').text(title);
        console.log(top.topmenu.g_raidErrorInfo);
        //errInfo = new LoadingProcess(document.querySelectorAll('#raiderrorinfo')[0], {});
        console.log(errInfo);
        jQuery('#summary_title_div_error').css("text-align", "center");
        if (info === undefined)
            //errInfo.error(top.topmenu.g_raidErrorInfo);
            jQuery('#summary_title_div_error').text(top.topmenu.g_raidErrorInfo);
        else
            //errInfo.error(info);
            jQuery('#summary_title_div_error').text(info);
        jQuery('#volumes_table_zone').hide();
    } else {
        errInfo = null;
    }
}

function showNoRaid() {
    $('.main_info_eventslog').hide();
    $('#patrolread_div').hide();
    console.log('itemClicked', itemClicked);
    let title;
    if (itemClicked == '' || itemClicked == 0) {
        title = lang.LANG_RAID_SUBMENU_STORAGE_SYSTEM;
    }
    if (itemClicked == 1) {
        title = lang.LANG_SM_CTR_TITLE;
    }
    if (itemClicked == 2) {
        title = lang.LANG_SM_PD_TITLE;
    }
    if (itemClicked == 3) {
        title = lang.LANG_SM_LD_TITLE;
    }
    // if (itemClicked == 4) {
    //     title = lang.LANG_SM_EVENTS_LOG_MENU_ITEM;
    // }
    //jQuery('#summary_title_div_error').text(title);
    //jQuery('#summary_title_div_error').show();
    //$('#raiderrorinfo').show();
    console.log(title);
    errorInfo(true, title);
    //errInfo.error(top.topmenu.g_raidErrorInfo);
    jQuery('#sidemenu').addClass('hidden');
    jQuery('#resources_zone').addClass('hidden');
    showLoading(false);
    //clear (previos) error info
    top.topmenu.g_raidErrorInfo = '';
}

function showLoading(busy) {
    if (busy == true) {
        Loading(true);
        jQuery('body', top.topmenu.MainFrame.document).css("cursor", "progress");
    } else {
        Loading(false);
        jQuery('body', top.topmenu.MainFrame.document).css("cursor", "default");
    }
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

function appendKeyValue(table, key, val) {
    var str = "<tr>";
    str += "<td align=\"right\" class=\"bold\"><label class=\"labelhead\">" + key + ": </label></td>";
    str += "<td><span class=\"labelhead\">" + val + "</span></td>";
    str += "</tr>";
    table.append(str);

    return table;
}

function refreshStorage(json) {
    var table;
    var key;

    showLoading(true);
    jQuery("#info_div").empty();
    jQuery('#info_div').append('<table>');
    table = jQuery('#info_div').children();
    console.log(json);
    for (key in json) {
        if (json.hasOwnProperty(key)) {
            //console.log('"' + key + '": ', json[key]);
            if (key == '@odata.id' || key == '@odata.etag' || key == 'Drives' ||
                key == '@odata.type' || key == '@odata.context') {
                continue;
            } else if (key == 'Status') {
                let Status = json.Status;
                for (let k in Status) {
                    console.log(k, Status[k]);
                    if (k == 'Health' || k == 'HealthRollup')
                        continue;
                    table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], Status[k]);
                }
            } else if (key == 'StorageControllers') {
                let id = jQuery("#_selecter").find(":selected").val();
                let controller = json.StorageControllers;
                table = appendKeyValue(table, lang.LANG_SM_PROP_CTRL, controller.length);
                if (controller.length > 0) {
                    let oem_ctrl = controller[controller.length-1].Oem.Controllers;
                    if (oem_ctrl.hasOwnProperty('PDList')) {
                        let driveCount = oem_ctrl.PDList;
                        table = appendKeyValue(table, lang.LANG_SM_PROP_PD, driveCount.length);
                    } else {
                        break;
                    }
                } else {
                    console.log('StorageControllers index out of range.');
                }
            } else if (key == 'Volumes') { //count of logical devices
                //console.log(top.topmenu.raidObj);
                var members = [];
                if (top.topmenu.raidObj.hasOwnProperty("VolumeCollection")) {
                    if (top.topmenu.raidObj.VolumeCollection.hasOwnProperty("Members")) {
                        members = top.topmenu.raidObj.VolumeCollection.Members;
                        var volumecollection = top.topmenu.raidObj.VolumeCollection;
                        table = appendKeyValue(table, lang.LANG_SM_PROP_LD, volumecollection['Members@odata.count']);
                    }
                } else {
                    table = appendKeyValue(table, lang.LANG_SM_PROP_LD, 0);
                }
            } else {
                console.log(lang["LANG_SM_PROP_"+key.toUpperCase()], json[key]);
                table = appendKeyValue(table, lang["LANG_SM_PROP_" + key.toUpperCase()], json[key]);
            }
        } else {
            console.log('not', key, json[key]);
        }
    }
    showLoading(false);
    jQuery('#info_div').append('</table>');
    //table_info_margin();
}

function hideinfo(hide) {
    if (hide) {
        $('.main_info_eventslog').hide();
        $('#page_title').hide();
    } else {
        $('.main_info_eventslog').show();
        $('#page_title').show();
    }
}

function refreshTable(type) {
    console.log('refreshTable(), type =' + type);
    var json = null;
    //var key;
    var table;
    var drives;
    showLoading(true);
    jQuery("#info_div").empty();
    if (type == 'Storage') {
        jQuery("#caption_div").text(lang.LANG_RAID_SUBMENU_STORAGE_SYSTEM);
        console.log(jQuery("#caption_div").text())
        //jQuery("#info_area").show();
        //jQuery('#page_title').text(lang.LANG_SM_STORAGE_SYSTEM_MENU_ITEM"));
        //jQuery('#summary_title_div').text(lang.LANG_SM_ST_INFO"));

        jQuery('#patrolread_div').hide();
        jQuery('#resources_zone').hide();
        jQuery('#volumes_table_zone').hide();
        jQuery('#eventslog_zone').hide();

        checkformWizard();

        jQuery('#info_div').append('<table>');
        json = top.topmenu.raidObj.Storage;
        console.log(json);
        if (json == null || json == undefined) {
            return;
        } else {
            //remove all item of select
            jQuery("#_selecter option").remove();
            console.log(lang.LANG_SM_ST_TITLE + json.Id);
            jQuery("#_selecter").append(jQuery("<option></option>").attr("value", json.Id).text(lang.LANG_SM_ST_TITLE + json.Id));
            refreshStorage(json);
        }
        jQuery('#info_div').append('</table>');
        jQuery('#sidemenu').hide();
    }
    if (type == 'Controller') {
        console.log('refreshTable(), type', type);
        //TODO: no string show
        jQuery("#caption_div").text(lang.LANG_SM_CONTROLLER_MENU_ITEM);
        console.log(jQuery("#caption_div").text())
        //original sub menu item position
        jQuery('dl').css({"left":"140px"});
        jQuery('a').css({"padding-right":"0px"});
        jQuery("#info_area").show();
        //jQuery('#tableBody').remove();
        jQuery('#resources_zone').show();
        jQuery('#eventslog_zone').hide();
        //jQuery('#page_title').text(lang.LANG_SM_CONTROLLER_MENU_ITEM"));

        //jQuery('#summary_title_div').text(lang.LANG_SM_CTR_INFO"));
        //jQuery('#resources_title_div').text(lang.LANG_SM_RESOURCES_TITLE);
        //show Create volume/SaveTTYLog/ForeignConfiguration
        jQuery('#create_volume').show();
        jQuery('#controller_savettylog').hide();
        jQuery('#foreignconfig_menu').hide();
        jQuery('#patrol_read_menu').hide();
        jQuery('#volume_property_set').hide();
        jQuery('#volume_check_consistency_menu').hide();
        jQuery('#hotspare_menu').hide();
        jQuery('#drive_locating_menu').hide();
        jQuery('#patrolread_div').hide();
        jQuery('nav').css('height', '25vh');

        checkformWizard();
        jQuery('#sidemenu').show();
    }
    //console.log(type);
    if (type == 'Drives') {
        //make hotspare's sub menu item closer left
        jQuery('dl').css({"left":"110px"});
        jQuery('a').css({"padding-right":"0px"});
        jQuery("#caption_div").text(lang.LANG_SM_PD_TITLE);
        jQuery("#info_area").show();
        jQuery('#resources_zone').hide();
        jQuery('#volumes_table_zone').hide();
        jQuery('#eventslog_zone').hide();
        //jQuery('#page_title').text(lang.LANG_SM_PHYSICAL_DEVICES_MENU_ITEM);
        //jQuery('#summary_title_div').text(lang.LANG_SM_PD_INFO"));

        checkformWizard();

        jQuery('#hotspare_menu').show();
        jQuery('#create_volume').hide();
        jQuery('#controller_savettylog').hide();
        jQuery('#foreignconfig_menu').hide();
        jQuery('#patrol_read_menu').hide();
        jQuery('#volume_property_set').hide();
        jQuery('#volume_check_consistency_menu').hide();
        jQuery('#patrolread_div').hide();
        jQuery('nav').css('height', '15vh');

        //adjust submenu for physical devices
        jQuery('#hotspare_dl').css('left', '140px');
        jQuery('#drive_locating_dl').css('left', '140px');

        //isControllerSet(0);

        //get volume disk
        getVolumeInfoHotspare();
        jQuery('#sidemenu').hide();
    }

    if (type == 'Volumes') {
        //make 'Properties Set' menu hover effect look good
        jQuery('a', top.topmenu.MainFrame.document).css({"padding-left":"-10px"});
        jQuery("#caption_div").text(lang.LANG_SM_LD_TITLE);
        jQuery("#info_area").show();
        //jQuery('#summary_title_div').show();
        //jQuery('#summary_title_div').text(lang.LANG_SM_LD_INFO"));
        jQuery('#resources_zone').hide();
        jQuery('#volumes_table_zone').hide();
        jQuery('#eventslog_zone').hide();

        checkformWizard();

        //show Property Set/Check consistency
        jQuery('#volume_property_set').hide();
        //jQuery('#volume_check_consistency_menu').show();
        jQuery('#volume_check_consistency_menu').hide();
        jQuery('#create_volume').hide();
        jQuery('#controller_savettylog').hide();
        jQuery('#foreignconfig_menu').hide();
        jQuery('#patrol_read_menu').hide();
        jQuery('#hotspare_menu').hide();
        jQuery('#drive_locating_menu').hide();
        jQuery('#patrolread_div').hide();
        jQuery('nav', top.topmenu.MainFrame.document).css('height', '10vh');

        //check consistency check state
        console.log('cookie raid_checkconsistency = ' + sessionStorage.getItem("raid_checkconsistency"));
        if (sessionStorage.getItem("raid_checkconsistency") == '1') {
            getCheckConsistencyProgress();
        }
        jQuery('#sidemenu').hide();
    }

    if (type == 'Events') {
        jQuery("#caption_div").text(lang.LANG_SM_EVENTS_LOG_MENU_ITEM);
        jQuery("#info_area").hide();
        jQuery('#resources_zone').hide();
        jQuery("#eventslog_zone").removeClass('hidden');

        checkformWizard();

        jQuery('#patrolread_div').hide();
        jQuery('#sidemenu').hide();
    }
}

function checkformWizard() {
    if (gformWizard == 'running') {
        VolumeStepDestory();
    }
}


//位元組轉成相對應合適的單位(kilobytes, megabytes, gigabytes)
function formatBytes(bytes) {
    let i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    return (bytes / Math.pow(1024, i)).toFixed(3) * 1 + ' ' + sizes[i];
};

function getParamValue(paramName) {
    //console.log('paramName', paramName)
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    //console.log(url)
    var qArray = url.split('&'); //get key-value pairs
    //console.log(qArray)
    for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split('='); //split key and value
        //console.log('pArr[0]', pArr[0])
        if (pArr[0] == paramName)
            return pArr[1]; //return value
    }
}

function isControllerSet(n) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    //console.log(top.topmenu.raidObj.Controllers[n].Name);
    if ( top.topmenu.raidObj.Controllers[n].Name.includes('Microsemi') ) {
        jQuery('#sidemenu').hide();
    } else {
        jQuery('#sidemenu').show();
    }
}

function submenuString() {
    $('#submenu_create_volume').text(lang.LANG_SM_RAID_SUBMENU_CREATE_VOLUME);
    $('#submenu_patrol_read').text(lang.LANG_SM_RAID_SUBMENU_PATROL_READ);
    $('#submenu_patrol_read_start').text(lang.LANG_SM_RAID_SUBMENU_START);
    $('#submenu_patrol_read_stop').text(lang.LANG_SM_RAID_SUBMENU_STOP);
    $('#submenu_hotspare').text(lang.LANG_SM_RAID_SUBMENU_HOT_SPARE);
    $('#submenu_hotspare_global').text(lang.LANG_SM_RAID_SUBMENU_HOT_SPARE_GLOBAL);
    $('#submenu_hotspare_dedicated').text(lang.LANG_SM_RAID_SUBMENU_HOT_SPARE_DEDICATED);
    $('#submenu_hotspare_remove').text(lang.LANG_SM_RAID_SUBMENU_HOT_SPARE_REMOVE);
    $('#submenu_pd_locating').text(lang.LANG_SM_RAID_SUBMENU_LOCATING_DRIVE);
    $('#submenu_pd_locating_start').text(lang.LANG_SM_RAID_SUBMENU_START);
    $('#submenu_pd_locating_stop').text(lang.LANG_SM_RAID_SUBMENU_STOP);
    $('#submenu_fc').text(lang.LANG_SM_RAID_SUBMENU_FOREIGN_CONF);
    $('#submenu_fc_scan').text(lang.LANG_SM_RAID_SUBMENU_FOREIGN_CONF_SCAN);
    $('#submenu_fc_import').text(lang.LANG_SM_RAID_SUBMENU_FOREIGN_CONF_IMPORT);
    $('#submenu_fc_clear').text(lang.LANG_SM_RAID_SUBMENU_FOREIGN_CONF_CLEAR) ;
    $('#submenu_ttylog').text(lang.LANG_SM_RAID_SUBMENU_SAVE_TTYLOG);
    $('#submenu_prop_set').text(lang.LANG_SM_RAID_SUBMENU_PROPERTIES_SET);
    $('#submenu_check_consistency').text(lang.LANG_SM_RAID_SUBMENU_CHECK_CONSISTENCY);
    $('#submenu_check_consistency_start').text(lang.LANG_SM_RAID_SUBMENU_START);
    $('#submenu_check_consistency_stop').text(lang.LANG_SM_RAID_SUBMENU_STOP);
}

function table_info_margin() {
    $('table').addClass('margin-t-10');
}

function loadHelp(item) {
    let help;
    if (item == 'sys_raid')
        item = '0';
    switch(parseInt(item)) {
      case 0:
        help = '/sys_raid_storage_hlp.html';
        break;
      case 1:
        help = '/sys_raid_controller_hlp.html';
        break;
      case 2:
        help = '/sys_raid_drives_hlp.html';
        break;
      case 3:
        help = '/sys_raid_volumes_hlp.html';
        break;
      case 4:
        help = '/sys_raid_events_hlp.html';
        break;
    }
    console.log(item, help);
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + help;
}

function disableSelect(enable) {
    if (enable) {
        jQuery("#_selecter", top.topmenu.MainFrame.document).prop('disabled', true);
        jQuery('#_selecter', top.topmenu.MainFrame.document).css('cursor', 'not-allowed');
    } else {
        jQuery("#_selecter", top.topmenu.MainFrame.document).prop('disabled', false);
        jQuery('#_selecter', top.topmenu.MainFrame.document).css('cursor', 'default');
    }
}

(function($) {
    $(document).ready(function() {
        ajaxsetup();
        //if include sys_raid.js in topmenu.www , below will error
        //Loading(true);
        jQuery('#wholepage').removeClass('hidden');
        jQuery('#resources_zone').hide();
        submenuString();
        //topmenu default is hide
        jQuery('#sidemenu').hide();

        itemClicked = getParamValue('page_click');
        console.log("submenu index ==> ", itemClicked, typeof(itemClicked));
        loadHelp(itemClicked);
        if (itemClicked == 'sys_raid') {
            console.log(top.frames.topmenu.g_raidErrorInfo);
            if (top.frames.topmenu.g_raidErrorInfo != '') {
                console.log(top.frames.topmenu.g_raidErrorInfo);
                showNoRaid();
                menuItemclick(0);
            } else {
                console.log('first item --> Storage System');
                //jQuery('#raiderrorinfo').hide();
                menuItemclick(0);
            }
        } else {
            if (top.frames.topmenu.g_raidErrorInfo != '') {
                showNoRaid();
                menuItemclick(itemClicked);
            } else {
                console.log(top.frames.topmenu.g_raidErrorInfo);
                console.log(itemClicked);
                jQuery('#raiderrorinfo').hide();
                menuItemclick(itemClicked);
            }
        }
        //TODO,remove
        /*if (itemClicked == '1' || itemClicked == '2') {
            //drivesTableInit();
            //TODO
            //volumesTableInit();
        }
        if (itemClicked == 4) {
            //eventsTableInit();
        }*/

        //inner step form
        //freeraiddiskTableInit();
        //raiddiskSummaryTableInit();

        //hot dirve: dedicated hotspare
        //vdHotSpareTableInit();
        //driveDedicatedHotSpareSummary();

        jQuery("#_selecter").change(function() {
            console.log(g_menuItemSelected);
            var str = "";
            if (g_menuItemSelected == 'Controller') {
                //disable _selecter for avoid _selecter changed immediately while drive refresh not completely.
                disableSelect(true);
                jQuery("info_div", top.topmenu.MainFrame.document).empty();
                gControllerIdx = $("#_selecter option:selected").val();
                console.log('0111, gControllerIdx=', gControllerIdx);
                showLoading(true);
                getControllerById(gControllerIdx);
                console.log(top.topmenu.raidObj.Controllers[gControllerIdx].Name);
                if ( top.topmenu.raidObj.Controllers[gControllerIdx].Name == 'Broadcom' ) {
                    jQuery('#menubar').show();
                    if (ReadCookie("raid_drive_patrolread") == '1') {
                        requestAllDrivePatrolReadProgress();
                        generate_show_Progress(drivesPatrolReadArray.length);
                    }
                } else {
                    jQuery('#sidemenu').hide();
                    jQuery(".patrolread").remove();
                }
                showLoading(false);
            }
            if (g_menuItemSelected == 'Drives') {
                jQuery("info_div", top.topmenu.MainFrame.document).empty();
                //+++,new flow-->send ajax request by select drive id
                gControllerIdx = jQuery("#_selecter option:selected").val();
                console.log("===>select drives:" + gControllerIdx);
                getDrivesInfoById(gControllerIdx);
                //+++
            }
            if (g_menuItemSelected == 'Volumes') {
                jQuery("info_div", top.topmenu.MainFrame.document).empty();
                let volumeid = jQuery("#_selecter option:selected").text();
                console.log("===>volumes selector text:" + volumeid);
                if (volumeid.length > 0) {
                    getVolumesInfoById(volumeid);
                } else {
                    console.log('volumeid selector text get fail!!');
                }
            }
            /*if (g_menuItemSelected == 'Events') {
                jQuery("info_div", top.topmenu.MainFrame.document).empty();
                jQuery("#_selecter option:selected").each(function() {
                    str = jQuery(this).val();
                });
                //console.log(str);
                //console.log(raidObj.Events[str]);
                getEventsLog(raidObj.Events[str]);
            }*/
        });

        jQuery("#events_selecter").change(function() {
            console.log(g_menuItemSelected);
            if (g_menuItemSelected == 'Events') {
                jQuery("info_div", top.topmenu.MainFrame.document).empty();
                str = jQuery("#events_selecter option:selected").val();
                //console.log(str);
                //console.log(raidObj.Events[str]);
                getEventsLog(raidObj.Events[str]);
            }
        });

        //create volume form title string and init hide
        jQuery('#form_caption').text(lang.LANG_SM_VOLUME_CREATE_TITLE);
        jQuery('#form_createvolume_title').hide();
        jQuery("#step_createvolume_form").hide();

        //dedicated hotspare form init hide
        //jQuery('#form_dedicated_hotspare_caption').text();//TODO
        jQuery('#form_dedicated_hotspare_title').hide();
        jQuery("#step_dedicated_hotspare_form").hide();

        $("#div-menu .menu li").hover(function() {
            jQuery(this).find("dl").show();
            }, function() {
            jQuery(this).find("dl").hide();
         });

        //menubar click event handle
        //console.log(jQuery('div.menu > li > a', top.topmenu.MainFrame.document));
        jQuery('a', top.topmenu.MainFrame.document).click(function(e) {
            e.preventDefault();
            //ie: has srcElement, no target
            //firefox: no srcElemnet, has target
            let obj = {};
            obj.id = e.currentTarget.id;
            console.log(obj.id);
            if (obj.id == 'create_volume') {
                console.log(freeraidresAction)
                if (freeraidresAction != null) {
                    getFreeRaidResource();
                }
            }
            if (obj.id == 'patrol_read_start') {
                if (startPatrolReadAction != null) {
                    console.log(startPatrolReadAction);
                    console.log(">>>>" + lang.LANG_SM_CTRL_PARTROL_READ_START_INFO);
                    console.log(ReadCookie("raid_drive_patrolread"));
                    if (ReadCookie("raid_drive_patrolread") == '0' || ReadCookie("raid_drive_patrolread") == null) {
                        UtilsConfirm(lang.LANG_SM_CTRL_PARTROL_READ_START_INFO, {
                            onOk: function() {
                                requestPatrolRead('start');
                            }
                        });
                    } else {
                        alert('Drive Patrol Read operation is on-goinig!');
                    }
                }
            }
            if (obj.id == 'patrol_read_stop') {
                if (stopPatrolReadAction != null) {
                    if (ReadCookie("raid_drive_patrolread") == '1') {
                        //confirm to cancel or not
                        // UtilsConfirm(lang.LANG_SM_INFO_OPERATIONS_CANCEL, {
                        //     onOk: function() {
                        //         requestPatrolReadStop();
                        //     }
                        // });
                        requestPatrolRead('stop');
                    } else {
                        alert('Please confirm the Patrol Read has started!');
                    }
                }
            }
            if (obj.id == 'global_hotspare') {
                // console.log(Drive);
                // if ('GlobalHotspare' in Drive) {
                //     console.log('!!!!!!!!!!!!!!!!!');
                //     console.log(Drive.GlobalHotspare);
                //     requestHotSpare('global', Drive.GlobalHotspare)
                // }
                idx = jQuery("#_selecter option:selected").val();
                console.log(idx);
                console.log(raidObj.selected_Drives.Actions.Oem);
                //refreshDrivesInfo(raidObj.Drives[str]);
                var oem = raidObj.selected_Drives.Actions.Oem;
                if (oem.hasOwnProperty('#InsydeOEMExtensions.MakeGlobalHotspare')) {
                    console.log('MakeGlobalHotspare workable');
                    hotspareAction = oem['#InsydeOEMExtensions.MakeGlobalHotspare'].target;
                    console.log(hotspareAction);
                    requestHotSpare('global', hotspareAction);
                } else {
                    console.log('has Hotspared, not allow do any Hotspare!!');
                    alert('Do not allow Global Hotspare!!');
                }
            }
            if (obj.id == 'dedicated_hotspare') {
                idx = jQuery("#_selecter option:selected").val();
                console.log(idx);
                console.log(raidObj.selected_Drives.Actions.Oem);
                //refreshDrivesInfo(raidObj.Drives[str]);
                var oem = raidObj.selected_Drives.Actions.Oem;
                if (oem.hasOwnProperty('#InsydeOEMExtensions.MakeDedicatedHotspare')) {
                    console.log('MakeDedicatedHotspare workable');
                    hotspareAction = oem['#InsydeOEMExtensions.MakeDedicatedHotspare'].target;
                    console.log(hotspareAction);
                    requestHotSpare('dedicated', hotspareAction);
                } else {
                    console.log('has Hotspared, not allow do any Hotspare!!');
                    alert('Do not allow Dedicated Hotspare!!');
                }
            }
            if (obj.id == 'remove_hotspare') {
                idx = jQuery("#_selecter option:selected").val();
                console.log(idx);
                console.log(raidObj.selected_Drives.Actions.Oem);
                //refreshDrivesInfo(raidObj.Drives[str]);
                var oem = raidObj.selected_Drives.Actions.Oem;
                if (oem.hasOwnProperty('#InsydeOEMExtensions.RemoveHotspare')) {
                    console.log('RemoveHotspare workable');
                    hotspareAction = oem['#InsydeOEMExtensions.RemoveHotspare'].target;
                    console.log(hotspareAction);
                    requestHotSpare('remove', hotspareAction);
                } else {
                    console.log('No any Hotspared, not allow do RemoveHotspare!!');
                    alert('No any Hotspared, not allow do RemoveHotspare!!');
                }
            }
            if (obj.id == 'controller_scanforeignconf') {
                if (scanforeignconfAction != null) {
                    console.log(scanforeignconfAction);
                    requestScanForeignConf();
                }
            }
            if (obj.id == 'controller_importforeignconf') {
                if (importforeignconfAction != null) {
                    console.log(importforeignconfAction);
                    UtilsConfirm(lang.LANG_SM_CTRL_IMPORT_FOREIGN_CONF_INFO, {
                        onOk: function() {
                            requestImportForeignConf();
                        }
                    });
                }
            }
            if (obj.id == 'controller_clearforeignconf') {
                if (clearforeignconfAction != null) {
                    console.log(clearforeignconfAction);
                    UtilsConfirm(lang.LANG_SM_CTRL_CLEAR_FOREIGN_CONF_INFO, {
                        onOk: function() {
                            requestClearForeignConf();
                        }
                    });
                }
            }
            if (obj.id == 'controller_savettylog') {
                console.log(savettylogAction);
                if (savettylogAction != null) {
                    requestSaveTTYLog();
                } else {
                    alert('#StorageController.SaveTTYLog Actions not found!!');
                }
            }
            //Volume-Logical Devices page
            if (obj.id == 'volume_property_set') {
                console.log('volume_property_set click');
                doUpdateVolumeProperty();
            }
            if (obj.id == 'volume_check_consistency_start') {
                console.log('volume_check_consistency Start click');
                //TBD, if has start check and not yet finished, should gray out this option
                if (ReadCookie("raid_checkconsistency") == '1') {
                    alert('Volume Disk Consistency Check is on-going!!');
                } else {
                    doVolumeConsistencyCheck();
                }
            }
            if (obj.id == 'volume_check_consistency_stop') {
                console.log('volume_check_consistency Stop click');
                if (ReadCookie("raid_checkconsistency") == '1') {
                    //confirm to cancel or not
                    UtilsConfirm(lang.LANG_SM_INFO_OPERATIONS_CANCEL, {
                        onOk: function() {
                            doVolumeConsistencyCheckStop();
                        }
                    });
                } else {
                    alert(lang.LANG_SM_INFO_VM_CONSISTENCY_CHECK_HAS_START);
                }
            }
            if (obj.id == 'drive_locating_start') {
                selectIdx = jQuery("#_selecter option:selected").val();
                console.log(top.topmenu.menuItemMap[2].URI[selectIdx]);
                Drive_Locating(top.topmenu.menuItemMap[2].URI[selectIdx], 'start');
            }
            if (obj.id == 'drive_locating_stop') {
                selectIdx = jQuery("#_selecter option:selected").val();
                console.log(top.topmenu.menuItemMap[2].URI[selectIdx]);
                Drive_Locating(top.topmenu.menuItemMap[2].URI[selectIdx], 'stop');
            }
            return false;
        });
    });
})(jQuery);
