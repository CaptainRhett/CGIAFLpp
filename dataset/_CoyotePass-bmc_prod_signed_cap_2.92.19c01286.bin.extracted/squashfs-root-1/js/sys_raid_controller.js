var drivesTableArray = new Array();
var volumesTableArray = new Array();
var driveCount = 0;
var IPCtrlTableArray = new Array();
var g_driveTotCount = 0;
var drivesDataTabObj = null;
var volumesDataTabObj = null;
var deleteVolumeAction = null;
var delVolumeDiskid = null; //keep volume disk id that deleted
var freeraidresAction = null; //FreeRaidResource
var volumeCreateObj = {};
var crevolstep1Action = null;
var CreVolBasicDataAction = null;
var crevolstep2Action = null;
var CreVolParametersAction = null;
var savettylogAction = null;
var scanforeignconfAction = null;
var importforeignconfAction = null;
var clearforeignconfAction = null;
var startPatrolReadAction = null;
var stopPatrolReadAction = null;
var userParamsObj = {};
var freediskDataTabObj = null;
var raiddisksummaryDataTabObj = null;
var gformWizard = 'idle';
var drivesPatrolReadArray = new Array(); //for showing drive progress(name/PatrolReadProgressPercent)
var timeoutRefreshVolumeCreate = 75000;
var timeoutRefreshVolumeDelete = 45000;
var mDriveRequestList = [];
var mDrivePatrolReadList = [];
var mDriveInfoList = [];
var mDriveDataShow = [];
var m404ReTryCnt = 3;
var m404Found = false;
var g_raidlevel = [];
var raid_timeoutID;
var mFreeDriveId = [];

function drivesTableInit()
{
    "use strict";
    let tbTitles = [
        ["Id", "5%", "center"],
        ["SlotNumber", "10%", "center"],
        ["DeviceId", "5%", "center"],
        ["Protocol", "12%", "center"],
        ["MediaType", "12%", "center"],
        ["BlockSize", "11%", "center"],
        ["State", "14%", "center"],
        ["Size", "15%", "center"],
        ["Hotspare", "11%", "center"],
        ["Link", "5%", "center"]
    ];
    //replace table header content with string table
    tbTitles[0][0] = lang.LANG_SM_PD_TABLE_HEADER_INDEX;
    tbTitles[1][0] = lang.LANG_SM_PD_TABLE_HEADER_SLOT_NUMBER;
    tbTitles[2][0] = lang.LANG_SM_PD_TABLE_HEADER_DEVICE;
    tbTitles[3][0] = lang.LANG_SM_PD_TABLE_HEADER_PROTOCOL;
    tbTitles[4][0] = lang.LANG_SM_PD_TABLE_HEADER_MEDIATYPE;
    tbTitles[5][0] = lang.LANG_SM_PD_TABLE_HEADER_BLOCKSIZE;
    tbTitles[6][0] = lang.LANG_SM_PD_TABLE_HEADER_STATE;
    tbTitles[7][0] = lang.LANG_SM_PD_TABLE_HEADER_TOTALSIZE;
    tbTitles[8][0] = lang.LANG_SM_PD_TABLE_HEADER_HOTSPARETYPE;
    tbTitles[9][0] = lang.LANG_SM_PD_TABLE_HEADER_LINK;

    let DrivesTableHeader = document.getElementById("drivesTable_header");
    let DrivesTablePlace = document.getElementById("drivesTable");
    drivesDataTabObj = GetTableElement();
    drivesDataTabObj.setColumns(tbTitles);
    drivesDataTabObj.init_header('drivesDataTabObj', DrivesTableHeader);
    drivesDataTabObj.init_body('drivesDataTabObj', DrivesTablePlace);
    console.log(drivesDataTabObj);
    jQuery("#pdtablecap").text(lang.LANG_SM_CTR_PD_TB_TITLE);
}


function volumesTableInit()
{
    "use strict";
    let tbTitles = [
        ["Device", "14%", "center"],
        ["RAIDLevel", "9%", "center"],
        ["BlockSize", "9%", "center"],
        ["State", "14%", "center"],
        ["Total", "13%", "center"],
        ["Drive", "15%", "center"],
        ["Link", "12%", "center"],
        ["Delete", "12%", "center"]
    ];
    //replace table header content with string table
    tbTitles[0][0] = lang.LANG_SM_LD_TABLE_HEADER_DEVICE;
    tbTitles[1][0] = lang.LANG_SM_LD_TABLE_HEADER_RAID_LEVEL;
    tbTitles[2][0] = lang.LANG_SM_LD_TABLE_HEADER_BLOCKSIZE;
    tbTitles[3][0] = lang.LANG_SM_LD_TABLE_HEADER_STATE;
    tbTitles[4][0] = lang.LANG_SM_LD_TABLE_HEADER_TOTALSIZE;
    tbTitles[5][0] = lang.LANG_SM_LD_TABLE_HEADER_Drive;
    tbTitles[6][0] = lang.LANG_SM_LD_TABLE_HEADER_LINK;
    tbTitles[7][0] = lang.LANG_SM_LD_TABLE_HEADER_DELETE;

    let VolumesTableHeader = document.getElementById("volumesTable_header");
    let VolumesTablePlace = document.getElementById("volumesTable");
    volumesDataTabObj = GetTableElement();
    volumesDataTabObj.setColumns(tbTitles);
    volumesDataTabObj.init_header('volumesDataTabObj', VolumesTableHeader);
    volumesDataTabObj.init_body('volumesDataTabObj', VolumesTablePlace);
    console.log(volumesDataTabObj);
    jQuery("#ldtablecap").text(lang.LANG_SM_CTR_LD_TB_TITLE);
}

function freeraiddiskTableInit(available_diskarray) {
    "use strict";
    let columns = [
        ["cbxF", "5%", "center"],
        ["DeviceF", "19%", "center"],
        ["MediaTypeF", "19%", "center"],
        ["BlockSizeF", "19%", "center"],
        ["StateF", "19%", "center"],
        ["TotalSizeF", "19%", "center"]
       ];
    //replace table header content with string table
    columns[0][0] = "";
    columns[1][0] = lang.LANG_SM_LD_TABLE_HEADER_DEVICE;
    columns[2][0] = lang.LANG_SM_PD_TABLE_HEADER_MEDIATYPE;
    columns[3][0] = lang.LANG_SM_PD_TABLE_HEADER_BLOCKSIZE;
    columns[4][0] = lang.LANG_SM_LD_TABLE_HEADER_STATE;
    columns[5][0] = lang.LANG_SM_LD_TABLE_HEADER_TOTALSIZE;

    let freediskTable_Header = document.getElementById("raidfreedisk_table_header");
    let freediskTablePlace = document.getElementById("raidfreedisk_table");
    freediskDataTabObj = GetTableElement();
    freediskDataTabObj.setColumns(columns);
    freediskDataTabObj.init_header('freediskDataTabObj', freediskTable_Header);
    freediskDataTabObj.init_body('freediskDataTabObj', freediskTablePlace);
    console.log(freediskDataTabObj);
    ShowFreeDiskTableUI(available_diskarray);
}

function raiddiskSummaryTableInit() {
    "use strict";
    let columns = [
        ["DeviceS", "5%", "center"],
        ["MediaTypeS", "15%", "center"],
        ["BlockSizeS", "15%", "center"],
        ["StateS", "20%", "center"],
        ["TotalSizeS", "20%", "center"]
    ];
    //replace table header content with string table
    columns[0][0] = lang.LANG_SM_PD_TABLE_HEADER_DEVICE;
    columns[1][0] = lang.LANG_SM_PD_TABLE_HEADER_MEDIATYPE;
    columns[2][0] = lang.LANG_SM_PD_TABLE_HEADER_BLOCKSIZE;
    columns[3][0] = lang.LANG_SM_LD_TABLE_HEADER_STATE;
    columns[4][0] = lang.LANG_SM_LD_TABLE_HEADER_TOTALSIZE;

    let summarydiskTable_Header = document.getElementById("raiddisk_table_summary_header");
    let summarydiskTablePlace = document.getElementById("raiddisk_table_summary");
    raiddisksummaryDataTabObj = GetTableElement();
    raiddisksummaryDataTabObj.setColumns(columns);
    raiddisksummaryDataTabObj.init_header('raiddisksummaryDataTabObj', summarydiskTable_Header);
    raiddisksummaryDataTabObj.init_body('raiddisksummaryDataTabObj', summarydiskTablePlace);
    console.log(raiddisksummaryDataTabObj);
}

//this is the propery that don't show
//===================================
//=                                 =
//= redfish property <--> ui        =
//=                                 =
//===================================
//Status.HealthRollup <--> Overall Health
//SpeedGbps <--> SpeedGbps
//Oem.Controllers.Chip <--> Chip
//Oem.Controllers.MemoryChangeable <--> Cache changeable
//Oem.Controllers.SEEPROM <--> SEEPROM Version
var filterProperty = ["SpeedGbps", "HealthRollup", "Chip", "MemoryChangeable", "SEEPROM"];

function refreshController(json, idx) {
    var table;
    var key;
    var jsonStorage = json;
    var jsonController = json.StorageControllers[idx];
    //console.log(jsonStorage);
    //console.log(jsonController);
    showLoading(true);
    $("#info_div").empty();
    $('#info_div').append('<table>');
    table = $('#info_div').children();
    for (key in jsonController) {
        if (jsonController.hasOwnProperty(key)) {
            //console.log('"' + key + '": ', jsonController[key]);
            if (jsonController[key] == null)
                continue;
            if (key == 'MemberId' || key == '@odata.id' || key == '@odata.context' || key == '@odata.type' ||
                key == '@odata.etag' || key == 'Links' || (filterProperty.indexOf(key) >= 0)) {
                continue;
            } else if (key == 'Status') {
                let Status = jsonController['Status'];
                for (let k in Status) {
                    //console.log('"' + k + '": ', Status[k]);
                    if ((filterProperty.indexOf(k) >= 0)) {
                        continue;
                    }
                    table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], Status[k]);
                }
            } else if (key == 'Oem') {
                var OemMember = jsonController['Oem']['Controllers'];
                for (var k in OemMember) {
                    //console.log('"' + k + '": ', OemMember[k]);
                    if (OemMember[k] == null)
                        continue;
                    if (k == '@odata.type' || k == 'CreateRaidVolume' || k == 'Events' || k == 'ForeignConfiguration' ||
                        k == 'SeqNumLastCleanShutdownEvent' || k == 'SeqNumLastClearEvent' || k == 'SeqNumNewestEvent' ||
                        k == 'SeqNumOldestEvent' || k == 'SeqNumThisSessionBootEvent' || k == 'PDList' || (filterProperty.indexOf(k) >= 0)) {
                        continue;
                    } else if (k == 'JunctionTemperature') {
                        //console.log("===========>" + lang["LANG_SM_PROP_" + k.toUpperCase()]);
                        table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], OemMember[k] + ' &#8451');
                    } else if (k == 'Memory') {
                        //console.log("===========>" + lang["LANG_SM_PROP_" + k.toUpperCase()]);
                        table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], OemMember[k] + ' MB');
                    } else if (k.search('BBU') != -1) { //match with BBU***** property
                        if (k == 'BBUTemperatureCelsius') {
                            table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], OemMember[k] + ' &#8451');
                        } else if (k == 'BBUPresent') {
                            table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], (OemMember[k] == true ? 'True': 'False'));
                        } else {
                            table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], OemMember[k]);
                        }
                    } else if (k == 'TTYLog') {
                        savettylogAction = jsonController['Oem']['Controllers']['TTYLog']['@odata.id'];//k['@odata.id']
                        //console.log('SaveTTYLog url = ', savettylogAction);
                    } else {
                        table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], OemMember[k]);
                    }
                }
            } else if (key == 'Actions') {
                var actions = jsonController['Actions'];
                if (actions.hasOwnProperty('Oem')) {
                    var oem = actions['Oem'];
                    //console.log('Object.keys(oem).length = ' + Object.keys(oem).length);
                    //console.log('Object.constructor = ' + oem.constructor);
                    //check object empty, ex {}
                    if (!(Object.keys(oem).length === 0)) {
                        //console.log(oem);
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.DeleteVolume')) {
                            var target = oem['#InsydeOEMExtensions.DeleteVolume'];
                            deleteVolumeAction = target.target;
                            //console.log(deleteVolumeAction);
                        }
                        //check GetFreeRaidResources
                        if (oem.hasOwnProperty('#Intel.Oem.GetFreeRaidResource')) {
                            var frr_target = oem['#Intel.Oem.GetFreeRaidResource'];
                            if (frr_target.hasOwnProperty('target')) {
                                freeraidresAction = frr_target.target;
                                console.log(freeraidresAction);
                            }
                        }
                        //get & keep CreateVolumeStep1 target.
                        if (oem.hasOwnProperty('#Intel.Oem.CreateVolumeBasicData')) {
                            var createstep1 = oem['#Intel.Oem.CreateVolumeBasicData'];
                            if (createstep1.hasOwnProperty('@Redfish.ActionInfo')) {
                                crevolstep1Action = createstep1['@Redfish.ActionInfo'];
                                console.log(crevolstep1Action);
                                if (crevolstep1Action != null) {
                                    //getFreeRaidResource();
                                } else {
                                    console.log('CreateVolumeBasicData, target error');
                                }
                            }
                            if (createstep1.hasOwnProperty('target')) {
                                CreVolBasicDataAction = createstep1.target;
                            }
                        }
                        //get & keep CreateVolumeStep2 target
                        if (oem.hasOwnProperty('#Intel.Oem.CreateVolumeParameters')) {
                            var createstep2 = oem['#Intel.Oem.CreateVolumeParameters'];
                            if (createstep2.hasOwnProperty('@Redfish.ActionInfo')) {
                                crevolstep2Action = createstep2['@Redfish.ActionInfo'];
                                //console.log(crevolstep2Action);
                                if (crevolstep2Action != null) {
                                    //getFreeRaidResource();
                                } else {
                                    console.log('CreateVolumeParameters, target error');
                                }
                            }
                            if (createstep2.hasOwnProperty('target')) {
                                CreVolParametersAction = createstep2.target;
                            }
                        }
                        //get ScanForeignConfiguration target value
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.ScanForeignConfiguration')) {
                            scanforeignconfAction = oem['#InsydeOEMExtensions.ScanForeignConfiguration'];
                            if (scanforeignconfAction.hasOwnProperty('target')) {
                                scanforeignconfAction = scanforeignconfAction.target;
                                //console.log(scanforeignconfAction);
                            }
                        }
                        //get ImportForeignConfiguration target value
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.ImportForeignConfiguration')) {
                            importforeignconfAction = oem['#InsydeOEMExtensions.ImportForeignConfiguration'];
                            if (importforeignconfAction.hasOwnProperty('target')) {
                                importforeignconfAction = importforeignconfAction.target;
                                //console.log(importforeignconfAction);
                            }
                        }
                        //get ClearForeignConfiguration target value
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.ClearForeignConfiguration')) {
                            clearforeignconfAction = oem['#InsydeOEMExtensions.ClearForeignConfiguration'];
                            if (clearforeignconfAction.hasOwnProperty('target')) {
                                clearforeignconfAction = clearforeignconfAction.target;
                                //console.log(clearforeignconfAction);
                            }
                        }
                        //get StartPatrolRead target value
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.StartPatrolRead')) {
                            startPatrolReadAction = oem['#InsydeOEMExtensions.StartPatrolRead'];
                            if (startPatrolReadAction.hasOwnProperty('target')) {
                                startPatrolReadAction = startPatrolReadAction.target;
                                //console.log(startPatrolReadAction);
                            }
                        }
                        //get StopPatrolRead target value
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.StopPatrolRead')) {
                            stopPatrolReadAction = oem['#InsydeOEMExtensions.StopPatrolRead'];
                            if (stopPatrolReadAction.hasOwnProperty('target')) {
                                stopPatrolReadAction = stopPatrolReadAction.target;
                                //console.log(stopPatrolReadAction);
                            }
                        }
                    }
                }
            } else {
                //console.log("===========>" + lang["LANG_SM_PROP_" + key.toUpperCase()]);
                table = appendKeyValue(table, lang["LANG_SM_PROP_" + key.toUpperCase()], jsonController[key]);
            }
        } else {
            console.log('not', key, jsonController[key]);
        }
    }

    //+++,drives table entry
    drivesTableArray = [];
    if (jsonStorage.hasOwnProperty('Drives')) {
        var drives = jsonStorage['Drives'];
        if (drives.length > 0) {
            //console.log(drives);
            if ( drivesDataTabObj != null && drivesDataTabObj.data.length > 0)
                drivesDataTabObj.empty();
            g_driveTotCount = drives.length;
            getDrivesInfo(drives);
        } else if (drives.length == 0) {
            if (drivesDataTabObj != null) {
                drivesDataTabObj.empty();
            }
        }
    }
    //+++
    //+++,volumes table entry
    volumesTableArray = [];
    if (top.topmenu.raidObj.hasOwnProperty('VolumeCollection')) {
        var volumes = top.topmenu.raidObj.VolumeCollection.Members;
        if (volumes.length > 0) {
            //console.log(volumes);
            getVolumesInfo(volumes, 'page_reload');
        } else if (volumes.length == 0) {
            if (volumesDataTabObj != null) {
                volumesDataTabObj.empty();
            }
        }
    } else {
        console.log('top.topmenu.raidObj.VolumeCollection missed!!!');
    }
    isControllerSet(idx);
    //+++
    $('#info_div').append('</table>');
    table_info_margin();
}

function getDrivesInfo(drives) {
    console.log(drives);
    driveCount = 0;
    mDriveInfoList = [];
    mDriveDataShow = [];
    drivesPatrolReadArray = [];
    mDriveRequestList = [];
    mDrivePatrolReadList = [];
    for (var i = 0; i < drives.length; i++) {
        var drvodta = drives[i];
        if (drvodta.hasOwnProperty('@odata.id')) {
            //console.log(drvodta['@odata.id']);
            mDriveRequestList.push(drvodta['@odata.id']);
            mDrivePatrolReadList.push(drvodta['@odata.id']);
        }
    }
    onRequestDrivesProperty();
}

function onRequestDrivesProperty() {
    console.log(mDriveRequestList);
    if (mDriveRequestList.length > 0) {
        var tmpURL = mDriveRequestList[0];
        mDriveRequestList.splice(0, 1);
        getDrivesPropertyforUI(tmpURL);
    } else {
        console.log('raid_drive_patrolread cookie=' + sessionStorage.getItem("raid_drive_patrolread"));
        //if (sessionStorage.getItem("raid_drive_patrolread") == '1') {
            if (drivesPatrolReadArray.length > 0) {
                console.log('refreshPatrolRead(), rivesPatrolReadArray.length = ', drivesPatrolReadArray.length);
                generate_show_Progress(drivesPatrolReadArray.length);
                $('#patrolread_div').show();
            } else {
                $(".patrolread").remove();
                sessionStorage.setItem("raid_drive_patrolread", "0");
            }
        //}
        disableSelect(false);
    }
}

function getDrivesPropertyforUI(rfURL) {
    showLoading(true);
    $.ajax({
        url: rfURL,
        type: 'GET',
    }).done(function(responseJson, textStatus, jqXHR){
        CollectDriveProperty(responseJson);
        onRequestDrivesProperty();
        drivesErrorOrNot();
    }).fail(function(xhr, errorThrown) {
        //OngetDrivesPropertyforUIError(xhr, errorThrown, rfURL);
    });
}

function drivesErrorOrNot() {
    if (mDriveRequestList.length < 1) {
        if (m404Found) {
            alert('An error has occurred. Please confirm if the drive token exists or if there is a problem with the network connection!');
        }
        showLoading(false);
    }
}

function alert_button(enable) {
    if (enable) {
        $('#alert-ok-btn', top.topmenu.document).prop('disabled', false);
        $('#alert-ok-btn', top.topmenu.document).css('cursor', 'pointer');
    } else {
        $('#alert-ok-btn', top.topmenu.document).prop('disabled', true );
        $('#alert-ok-btn', top.topmenu.document).css('cursor', 'not-allowed');
    }
}

function disableAllButton(enable) {
    //console.log(enable + '>>>>>>>>>>>>>>>>>> disableAllButton()');
    $('button, input[type="button"]').prop("disabled", enable);
}

// 0: Storage System
// 1: Controller page
// 2: Physical Devices
// 3: Logical Devices
// 4: Events Log
//id=drive_0/volume_Broadcom10....
var btnGoto = function(e){
    //console.log("Button clicked from id: "+e.currentTarget.id);
    let token = e.currentTarget.id.split('-');
    //console.log(token);
    let type = token[0];
    let id = token[1];
    if (token.length == 2) {
        if (type == 'drive') {
            sessionStorage.setItem("raid_goto_drive_from_controller_page", id);
            top.topmenu.page_mapping('sys_raid', '2')
        }
        if (type == 'volume') {
            sessionStorage.setItem("raid_goto_volume_from_controller_page", id);
            top.topmenu.page_mapping('sys_raid', '3')
        }
    } else {
        console.log('button id parse error');
    }
}

function OnrequestDeleteVolumeSuccess(from) {
    console.log('from', from, 'raid_timeoutID', raid_timeoutID);
    if (from == 'NOTIFY') {
        window.clearTimeout(raid_timeoutID);
    }
    setTimeout(function() {
        //refresh volume disk table list
        console.log(raidObj.controller_selected.Volumes['@odata.id']);
        refreshVolumeDiskTable(raidObj.controller_selected.Volumes['@odata.id']);
        updateMenuItemKeyValue('VolumeCollection');
        alert_button(true);
        //alert(mLangMap.getStr("LANG_SM_VOLUME_DISK_DEL_SUCCESS"));
    }, timeoutRefreshVolumeDelete);
    //graidAction.type = null;
    //graidAction.param = null;
}

/*
    Action Name: DeleteVolume
    Action Request Parameters:
        Name        Type            Description
        VolumeID    string          delete a volume with specific volume ID

        {"VolumeID", "id"}

    Action Response Parameters:
        Name                Type            Description
        Success             boolean         Success or failure
*/
function requestDeleteVolume(volumeURI, id) {
    console.log('volumeURI', volumeURI, 'id', id);
    showLoading(true);
    disableAllButton(true);
    graidAction.type = 'volumedel';
    graidAction.param = id;
    $.ajax({
        url: volumeURI,
        type: 'DELETE'
    }).done(function(responseJson, textStatus, jqXHR){
        if( jqXHR.status == 200 && responseJson['error']['message'] == 'Request completed successfully') {
            OnrequestDeleteVolumeSuccess(id);
            showLoading(true);
            disableAllButton(true);
            alert(lang.LANG_SM_VOLUME_DISK_DEL_SUCCESS);
            alert_button(false);
        } else {
            showLoading(false);
            disableAllButton(false);
            alert(lang.LANG_SM_VOLUME_DISK_DEL_FAIL);
        }
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log("======================================");
        console.log(xhr);
        console.log(textStatus);
        console.log("======================================");
        showLoading(false);
        disableAllButton(false);
        alert(volumeURI + ', delete ajax request fail!');
    });
}

var btnDel = function(e){
    console.log("volume del Button clicked from id: "+e.currentTarget.id);
    //find out whole url
    let uri = '';
    for(let i=0; i<top.topmenu.menuItemMap[3].URI.length; i++) {
        let id = top.topmenu.menuItemMap[3].URI[i].split('/');
        if (e.currentTarget.id == id[id.length-1]) {
            uri = top.topmenu.menuItemMap[3].URI[i];
            break;
        }
    }
    console.log(uri);
    if (uri.length > 0) {
        UtilsConfirm(lang.LANG_SM_VOLUME_DISK_DEL_INFO, {
            onOk: function() {
                requestDeleteVolume(uri, e.currentTarget.id);
            }
        });
    } else {
        console.log(e.currentTarget.id + ', whole volume odata.id cannot find!!');
    }

}

function ShowDrivesTable(data, i) {
    console.log('ShowDrivesTable() entry');
    //console.log(drivesDataTabObj);
    //console.log(mDriveDataShow);
    //console.log(drivesTableArray.length);
    console.log(drivesTableArray);
    let mDriveDataShow = [];
    drivesTableArray.forEach(function(val, index, arr) {
        //console.log(val, index, arr);
        let linkBtn = '<input type="button" class="btn buttonjump" value="Go" id="drive-'+ drivesTableArray[index].Device + '\"/>';
        mDriveDataShow.push([index,
                            drivesTableArray[index].Device,
                            drivesTableArray[index].SlotNumber,
                            drivesTableArray[index].DeviceId,
                            drivesTableArray[index].Protocol,
                            drivesTableArray[index].MediaType,
                            drivesTableArray[index].BlockSize,
                            drivesTableArray[index].State,
                            drivesTableArray[index].TotalSize,
                            drivesTableArray[index].HotspareType,
                            linkBtn]);
    });
    //console.log(mDriveDataShow);
    drivesDataTabObj.empty();
    drivesDataTabObj.show(mDriveDataShow);

    if (drivesTableArray.length == 0) {
        drivesDataTabObj.empty();
    }
    if (mDriveRequestList.length == 0) {
        disableAllButton(false);
        showLoading(false);
    } else {
        disableAllButton(true);
    }
    $('.buttonjump').off('click');
    $('.buttonjump').on('click', btnGoto);
}

function ShowFreeDiskTableUI(available_diskarray) {
    var newRowData = [];
    console.log(available_diskarray);
    console.log(drivesTableArray);
    //remove duplicated item
    drivesTableArray = [...new Map(drivesTableArray.map(item => [item.Device, item])).values()];
    var findthisdrive = '';

    if (available_diskarray.length > 0) {
        for (i = 0; i < available_diskarray.length; i++) {
            //console.log(i + ', ' + available_diskarray[i] + ', ' + drivesTableArray[i].Device);
            findthisdrive = available_diskarray[i];
            for (var k = 0; k < drivesTableArray.length; k++) {
                if (drivesTableArray[k].Device.localeCompare(findthisdrive) == 0) {
                    console.log(findthisdrive + ' find in ' + k + ' of drivesTableArray');
                    var checkbox = '<input type="checkbox" name="diskcheck" value=\"' + findthisdrive + '\">';
                    //console.log(checkbox);
                    newRowData.push([k,
                                    checkbox,
                                    drivesTableArray[k].Device,
                                    drivesTableArray[k].MediaType,
                                    drivesTableArray[k].BlockSize,
                                    drivesTableArray[k].State,
                                    drivesTableArray[k].TotalSize]);
                }
            }
        }
        console.log(newRowData);
        freediskDataTabObj.show(newRowData);
    }
}

function ShowSelectDiskTableUISummary(diskarray) {
    console.log(diskarray);
    let RowData = [];
    let drivesInfo = freediskDataTabObj.data;
    console.log(drivesInfo, JSON.stringify(drivesInfo));
    //let diskSummary = [];
    if (drivesInfo.length > 0) {
        if (diskarray.length > 0) {
            for(let i in diskarray){
                let find = drivesInfo.find(function(item, index, array) {
                    return item[2] == diskarray[i];
                });
                //console.log(find);
                if(find == undefined)
                    continue;
                RowData.push([i,
                             find[2],
                             find[3],
                             find[4],
                             find[5],
                             find[6]]);
            }
        }
        console.log(RowData);
        //if (diskarray.length == 0) {
            raiddisksummaryDataTabObj.empty();
        //}
        raiddisksummaryDataTabObj.show(RowData);
    } else {
        console.log('freediskDataTabObj.originaldata error : null');
    }
}

function CollectDriveProperty(json) {
    showLoading(true);

    var obj = {};
    console.log(json);
    if (json.hasOwnProperty('Id')) {
        obj.Device = json.Id;
    }
    if (json.hasOwnProperty('Protocol')) {
        if (json.Protocol != null)
            obj.Protocol = json.Protocol.toString();
        else
            obj.Protocol = 'NA';
    } else {
        obj.Protocol = 'NA';
    }
    if (json.hasOwnProperty('BlockSizeBytes')) {
        if (json.BlockSizeBytes != null)
            obj.BlockSize = json.BlockSizeBytes.toString();
        else
            obj.BlockSize = 'NA';
    }
    if (json.hasOwnProperty('Status')) {
        var Status = json.Status;
        if (Status.hasOwnProperty('State')) {
            if (Status.State != null)
                obj.State = Status.State;
            else
                obj.State = 'NA';
        }
    }
    if (json.hasOwnProperty('CapacityBytes')) {
        if (json.CapacityBytes != null)
            if (json.CapacityBytes != 0)
                obj.TotalSize = formatBytes(json.CapacityBytes);
            else
                obj.TotalSize = '0';
        else
            obj.TotalSize = 'NA';
    }
    if (json.hasOwnProperty('HotspareType')) {
        if (json.HotspareType != null)
            obj.HotspareType = json.HotspareType;
        else
            obj.HotspareType = 'NA';
    } else {
        obj.HotspareType = 'NA';
    }
    if (json.hasOwnProperty('MediaType')) {
        if (json.MediaType != null)
            obj.MediaType = json.MediaType;
        else
            obj.MediaType = 'NA';
    } else {
        obj.MediaType = 'NA';
    }
    if (json.hasOwnProperty('Oem')) {
        let oem = json.Oem;
        if (oem.hasOwnProperty('Drive')) {
            oem = oem.Drive;
            if (oem.hasOwnProperty('SlotNumber')) {
                if (oem.SlotNumber != null)
                    obj.SlotNumber = oem.SlotNumber;
                else
                    obj.SlotNumber = 'NA';
            } else {
                console.log('Oem.Drives.SlotNumber node missed!');
                obj.SlotNumber = 'NA';
            }
            if (oem.hasOwnProperty('RawId')) {
               if (oem.RawId != null)
                    obj.DeviceId = oem.RawId;
                else
                    obj.DeviceId = 'NA';
            } else {
                console.log('Oem.Drives.RawId node missed!');
                obj.DeviceId = 'NA';
            }
        } else {
            console.log('Oem.Drive node missed!');
        }
    } else {
        console.log('Oem node missed!');
    }

    //collect for patrol read
    var probj = {};
    if (json.hasOwnProperty('Id')) {
        probj.Id = json.Id;
    }
    if (json.hasOwnProperty('Name')) {
        let id = json.Name.split(' ');
        probj.Name = lang.LANG_SM_RAID_PATROL_READ_PHYSICAL_DEVICE + id[id.length-1] + lang.LANG_SM_RAID_PATROL_READ;
    }
    if (json.hasOwnProperty('Oem')) {
        var Oem = json.Oem.Drive;
        if (Oem.hasOwnProperty('PatrolReadProgressPercent')) {
            if (Oem.PatrolReadProgressPercent != null) {
                probj.PatrolReadProgressPercent = Oem.PatrolReadProgressPercent;
                drivesPatrolReadArray.push(probj);
            }
        }
    }
    //console.log('drivesPatrolReadArray', drivesPatrolReadArray);

    //+++, if drive NOT mount on this controller, break
    //console.log(json.Oem.Drive.StorageControllerReference);
    if (json.Oem.Drive.StorageControllerReference != gControllerIdx) {
        disableAllButton(false);
        showLoading(false);
        return;
    }
    //+++
    console.log(obj);
    //console.log(driveCount);
    mDriveInfoList.push(obj);
    //console.log(mDriveInfoList);
    //TODO: obj --> need convert to array
    drivesTableArray[driveCount++] = obj;
    //console.log(drivesTableArray);
    raidObj.DrivesTableUI = drivesTableArray;
    ShowDrivesTable(obj, driveCount);
}

function ShowVolumesTable() {
    //showLoading(true);
    //console.log(volumesDataTabObj);
    let RowData = [];
    //console.log(volumesTableArray.length);
    console.log(volumesTableArray);
    if (volumesTableArray.length > 0) {
        let mVolumesDataShow = [];
        volumesTableArray.forEach(function(val, index, arr) {
            let linkBtn = '<input type="button" class="btn buttonjump" value="Go" id="volume-'+  volumesTableArray[index].Device + '\"/>';
            let deleteVolumeBtn = '<input type="button" class="btn volumeDelBtn" value="Del" id="' + volumesTableArray[index].Device +  '\"/>';
            mVolumesDataShow.push([index,
                                volumesTableArray[index].Device,
                                volumesTableArray[index].RaidLevel,
                                volumesTableArray[index].BlockSize,
                                volumesTableArray[index].State,
                                volumesTableArray[index].TotalSize,
                                volumesTableArray[index].Drives,
                                linkBtn,
                                deleteVolumeBtn]);
        });
        console.log(volumesDataTabObj);
        console.log(mVolumesDataShow);
        volumesDataTabObj.empty();
        volumesDataTabObj.show(mVolumesDataShow);
        // if (refreshType == 'create') {
        //     alert(lang.LANG_SM_VOLUME_DISK_CREATE_SUCCESS);
        // }
        //$("body").css("cursor", "default");
    }
    if (volumesTableArray.length == 0) {
        volumesDataTabObj.empty();
        //$("body").css("cursor", "default");
    }
    $('.buttonjump').off('click');
    $('.buttonjump').on('click', btnGoto);
    $('.volumeDelBtn').off('click');
    $('.volumeDelBtn').on('click', btnDel);
}

function getVolumesInfo(volumesArray, refreshType) {
    console.log(volumesArray);
    volumesTableArray = [];
    for (var i = 0; i < volumesArray.length; i++) {
        var volumeodata = volumesArray[i];
        if (volumeodata.hasOwnProperty('@odata.id')) {
            //console.log(volumeodata['@odata.id']);
            getVolumesPropertyforUI(volumeodata['@odata.id'], refreshType);
        }
    }
}

/*
   volumesTableArray:
   ["Device ID"] ["RAIDLevel"]   ["VolumeType"]  ["State"]  ["Total Size"] ["Drive"]
       Id       Oem.RaidLevel    VolumeType    Oem.State   CapacityBytes
    Drive --> link deviceid of Physical drive.
*/
function CollectVolumesProperty(json, refreshType) {
    showLoading(true);
    // if (refreshType == 'create') {
    //     $("body").css("cursor", "wait");
    // }
    var obj = {};
    console.log(json);
    if (json.hasOwnProperty('Id')) {
        obj.Device = json.Id;
    }
    if (json.hasOwnProperty('VolumeType')) {
        obj.VolumeType = json.VolumeType;
    }
    if (json.hasOwnProperty('BlockSizeBytes')) {
        obj.BlockSize = json.BlockSizeBytes;
    }
    if (json.hasOwnProperty('CapacityBytes')) {
        obj['TotalSize(Bytes)'] = json.CapacityBytes;
        obj.TotalSize = formatBytes(json.CapacityBytes);
    }
    if (json.hasOwnProperty('Oem')) {
        var Oem = json.Oem.Volume;
        if (Oem.hasOwnProperty('State')) {
            obj.State = Oem.State;
        }
        if (Oem.hasOwnProperty('RaidLevel')) {
            obj.RaidLevel = Oem.RaidLevel;
        }
    }
    //get drive belong to this volume
    if (json.hasOwnProperty('Links')) {
        var drives = json.Links.Drives;
        //console.log(drives);
        var tmp = [];
        for (var i=0; i<drives.length; i++) {
            var token = drives[i]['@odata.id'].split('/');
            //console.log(token);
            tmp.push(token[8]);
        }
        obj.Drives = tmp;
    }
    //+++, if drive NOT mount on this controller, break
    if (json.Oem.Volume.StorageControllerReference != gControllerIdx) {
        return;
    }
    //+++
    //console.log(obj);
    //console.log(driveCount);
    volumesTableArray.push(obj);
    console.log('volumesTableArray', volumesTableArray);
    raidObj.VolumesTableUI = volumesTableArray;
    //console.log(volumesDataTabObj);
    ShowVolumesTable(refreshType);
}

function getVolumesPropertyforUI(rfURL, refreshType) {
    showLoading(true);
    // if (refreshType == 'create') {
    //     $("body").css("cursor", "wait");
    // }
    $.ajax({
        url: rfURL,
        type: 'GET'
    }).done(function(responseJson, textStatus, jqXHR){
        CollectVolumesProperty(responseJson, refreshType);
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log("==========getVolumesPropertyforUI ajax error=============");
        console.log(rfURL + ', ajax fail:');
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
        console.log("======================================");
        console.log('volumesTableArray.length', volumesTableArray.length);
        //for external tool flow
        //refreshVolumeDiskTable(top.topmenu.raidObj.Storage.Volumes['@odata.id']);
        updateMenuItemKeyValue('VolumeCollection');
        showLoading(false);
    });
}

function onupdateMenuItemKeyValueSuccess(responseJson, textStatus, jqXHR) {
    console.log(responseJson);
    //console.log(top.topmenu.menuItemMap);
    //update Count, URI[]
    var rfURI = [];
    var members;
    responseJson = removeProperties(responseJson);
    //raidObj['VolumeCollection'] = responseJson;
    //new flow
    //console.log(responseJson);
    top.topmenu.raidObj['VolumeCollection'] = responseJson;
    //console.log(raidObj);
    console.log(top.topmenu.raidObj);
    if (responseJson.hasOwnProperty("Members")) {
        members = responseJson["Members"];
        for (var i = 0; i < members.length; i++) {
            var odataid = members[i];
            if (odataid.hasOwnProperty('@odata.id')) {
                //console.log(odataid['@odata.id']);
                rfURI.push(odataid['@odata.id']);
            }
        }
    }
    //console.log(rfURI);
    if (top.topmenu.menuItemMap[3].Type == 'Volumes') {
        top.topmenu.menuItemMap[3].Count = rfURI.length;
        if (rfURI.length > 0) {
            top.topmenu.menuItemMap[3].URI = rfURI;
        } else {
            top.topmenu.menuItemMap[3].URI = 'N';
        }
    }
    //refresh drives table
    //console.log(top.topmenu.raidObj.Storage.Drives);
    getDrivesInfo(top.topmenu.raidObj.Storage.Drives);
}

function updateMenuItemKeyValue(type) {
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
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log("===== onupdateMenuItemKeyValueError =====");
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("======================================");
            showLoading(false);
            alert(rfURL + ', ajax fail!');
        });
    }
}

function OnrefreshVolumeDiskTableSuccess(responseJson, textStatus, jqXHR) {
    console.log("===== OnrefreshVolumeDiskTableSuccess =====");
    console.log(responseJson);
    volumesTableArray = [];
    if (responseJson.hasOwnProperty('Members')) {
        var volumes = responseJson.Members;
        if (volumes.length > 0) {
            console.log(volumes);
            getVolumesInfo(volumes, 'page_reload');
        } else if (volumes.length == 0) {
            console.log(volumesDataTabObj);
            if (volumesDataTabObj != null) {
                volumesDataTabObj.empty();
            }
        }
    }
}

function OnrefreshVolumeDiskTableError(xhr, errorThrown, url) {
    showLoading(false);
    console.log("===== OnrefreshVolumeDiskTableError =====");
    console.log(xhr.status);
    console.log(errorThrown);
    if (xhr.status == 404) { //try again
        console.log('try again refreshVolumeDiskTable() with url = ' + url);
        refreshVolumeDiskTable(url);
    }
    console.log("======================================");
}

function refreshVolumeDiskTable(rfurl) {
    //console.log(rfurl);
    showLoading(true);
    $.ajax({
        url: rfurl,
        type: 'GET'
    }).done(function(responseJson, textStatus, jqXHR){
        OnrefreshVolumeDiskTableSuccess(responseJson, textStatus, jqXHR);
    }).fail(function(xhr, errorThrown) {
        OnrefreshVolumeDiskTableError(xhr, errorThrown, rfurl);
    });
}

/*
    Action Response Parameters:
        Name                Type            Description
        Success             boolean         Success or failure
*/
function OnCreateVolumeStep2Success(from) {
    console.log('from', from, 'raid_timeoutID', raid_timeoutID);
    if (from == 'NOTIFY') {
        window.clearTimeout(raid_timeoutID);
    }
    console.log("===== OnCreateVolumeStep2Success return true =====");
    setTimeout(function() {
        //refresh volume disk table list
        console.log(raidObj.controller_selected.Volumes['@odata.id']);
        refreshVolumeDiskTable(raidObj.controller_selected.Volumes['@odata.id']);
        updateMenuItemKeyValue('VolumeCollection');
        //alert(lang.LANG_SM_VOLUME_DISK_CREATE_SUCCESS);
    }, timeoutRefreshVolumeCreate);
    alert_button(true);
    //graidAction.type = null;
    //graidAction.param = null;
}

/*
    Action Request Parameters:
        Name                Type            Description
        Name            string          Volume Name
        Size            string Array    Volume Size
        StripeSize      number          Valid Values: 16, 32, 64, 128, 256, 512, 1024
        AccessPolicy    string          Access Policy valid values:
                                        "Read Write", "Read Only", "Blocked"
        DiskCachePolicy string          Valid values:
                                        "Unchanged","Enable", "Disable"
        InitState       string          Valid Values:
                                        "No Init","Quick Init", "Full Init"
        {"Name":"TestTEST",
         "Size":100,
         "StripeSize":128,
         "AccessPolicy":"Read Write",
         "DiskCachePolicy":"Enable",
         "InitState":"Quick Init"}

    Action Response Parameters:
        Name                Type            Description
        Success             boolean         Success or failure

    userParamsObj: keep parameters user input/select
*/
function CreateVolumeStep2() {
    showLoading(true);
    disableAllButton(true);
    var rfURL;
    var json = JSON.parse("{}");
    var jsonParam = "";

    rfURL = CreVolParametersAction;
    console.log(rfURL);

    if (userParamsObj.hasOwnProperty('Disk Name')) {
        json.Name = userParamsObj['Disk Name'];
    }

    if (userParamsObj.hasOwnProperty('Disk Size')) {
        json.Size = userParamsObj['Disk Size'];
    }

    if (userParamsObj.hasOwnProperty('StripeSize')) {
        json.StripeSize = userParamsObj['StripeSize'];
    }

    if (userParamsObj.hasOwnProperty('AccessPolicy')) {
        json.AccessPolicy = userParamsObj['AccessPolicy'];
    }

    if (userParamsObj.hasOwnProperty('DiskCachePolicy')) {
        json.DiskCachePolicy = userParamsObj['DiskCachePolicy'];
    }

    if (userParamsObj.hasOwnProperty('InitState')) {
        json.InitState = userParamsObj['InitState'];
    }

    jsonParam = JSON.stringify(json);
    console.log(rfURL, jsonParam);
    $.ajax({
        url: rfURL,
        type: 'POST',
        data: jsonParam
    }).done(function(responseJson, textStatus, jqXHR){
        graidAction.type = 'volumeadd';
        graidAction.param = null;
        console.log('CreateVolumeStep2 ', responseJson);
        if( jqXHR.status == 200 && responseJson['error']['message'] == 'Request completed successfully') {
            OnCreateVolumeStep2Success();
            alert(lang.LANG_SM_VOLUME_DISK_CREATE_SUCCESS);
            showLoading(true);
            alert_button(false);
        } else {
            showLoading(false);
            alert(lang.LANG_SM_VOLUME_DISK_CREATE_FAIL);
            VolumeStepDestory();
        }
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log("===== CreateVolumeStep2 ajax error =====");
        console.log(rfURL + ', ajax fail:');
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
        console.log("======================================");
        showLoading(false);
        alert(lang.LANG_SM_VOLUME_DISK_CREATE_FAIL);
    });
}

/*    Action Response Parameters:
        Name                Type            Description
        ....
        see below detail
        {
            "Max Size":100,
            "StripeSize":[16,32,64,128,256,512,1024],
            "AccessPolicy":["Read Write","Read Only","Blocked"],
            "DiskCachePolicy":["Unchanged","Enable","Disable"],
            "InitState":["No Init","Quick Init","Full Init"]
        }
111419:
    1. After POST CreateVolumeParameters action success, CreateRaidVolume object will be cleared.
    2. check values in Oem.InsydeControllers.CreateRaidVolume
    action: ajax request controller for get CreateRaidVolume via top.topmenu.raidObj.Controllers[gControllerIdx].Name

    CreateRaidVolume params at Oem.InsydeControllers.CreateRaidVolume
    MaxSize
    StripeSize
    AccessPolicy
    DiskCachePolicy
    InitState
*/
function OnCreateVolumeStep1Success() {
    console.log('========CreateVolumeStep1 success done!! and ready to get VolumeParameters =========');
    console.log(crevolstep2Action);
    var rfURL;
    rfURL = crevolstep2Action;

    $.ajax({
        url: rfURL,
        type: 'GET'
    }).done(function(responseJson) {
        console.log(responseJson);
        if (responseJson.hasOwnProperty('Parameters')) {
            //console.log(responseJson.Parameters);
            volumeCreateObj.CreateParams = responseJson.Parameters;
            //clear all ui select value
            jQuery('#stripesize_select', top.topmenu.MainFrame.document).empty();
            jQuery('#accesspolicy_select', top.topmenu.MainFrame.document).empty();
            jQuery('#diskcachepolicy_select', top.topmenu.MainFrame.document).empty();
            jQuery('#initstate_select', top.topmenu.MainFrame.document).empty();

            //attache response data into ui
            if (volumeCreateObj.CreateParams[1].hasOwnProperty('MaximumValue')) {
                jQuery('#volume_disk_size', top.topmenu.MainFrame.document).val(volumeCreateObj.CreateParams[1].MaximumValue);
                jQuery('#volume_disk_size', top.topmenu.MainFrame.document).attr('placeholder', lang.LANG_VOLUME_MAX_SIZE + volumeCreateObj.CreateParams[1].MaximumValue);
            }
            //StripeSize: 16, 32, 64, 128, 256, 512, 1024
            if (volumeCreateObj.CreateParams[2].hasOwnProperty('StripeSize@Redfish.AllowableValues')) {
                var StripeSizeAry = volumeCreateObj.CreateParams[2]['StripeSize@Redfish.AllowableValues'];
                for (var i = 0; i < StripeSizeAry.length; i++) {
                    jQuery('#stripesize_select', top.topmenu.MainFrame.document).append($("<option></option>").text(StripeSizeAry[i]));
                }
            }

            //AccessPolicy: "Read Write", "Read Only", "Blocked"
            if (volumeCreateObj.CreateParams[3].hasOwnProperty('AccessPolicy@Redfish.AllowableValues')) {
                var AccessPolicyAry = volumeCreateObj.CreateParams[3]['AccessPolicy@Redfish.AllowableValues'];
                for (var i = 0; i < AccessPolicyAry.length; i++) {
                    jQuery('#accesspolicy_select', top.topmenu.MainFrame.document).append($("<option></option>").text(AccessPolicyAry[i]));
                }
            }

            //DiskCachePolicy: "Unchanged","Enable", "Disable"
            if (volumeCreateObj.CreateParams[4].hasOwnProperty('DiskCachePolicy@Redfish.AllowableValues')) {
                var DiskCachePolicyAry = volumeCreateObj.CreateParams[4]['DiskCachePolicy@Redfish.AllowableValues'];
                for (var i = 0; i < DiskCachePolicyAry.length; i++) {
                    jQuery('#diskcachepolicy_select', top.topmenu.MainFrame.document).append($("<option></option>").text(DiskCachePolicyAry[i]));
                }
            }

            //InitState: "No Init","Quick Init", "Full Init"
            if (volumeCreateObj.CreateParams[5].hasOwnProperty('InitState@Redfish.AllowableValues')) {
                var InitStateAry = volumeCreateObj.CreateParams[5]['InitState@Redfish.AllowableValues'];
                for (var i = 0; i < InitStateAry.length; i++) {
                    jQuery('#initstate_select', top.topmenu.MainFrame.document).append($("<option></option>").text(InitStateAry[i]));
                }
            }
            showLoading(false);
        } else {
            console.log('CreateRaidVolume object missed');
        }
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log("===== get CreateVolumeBasicData error =====");
        console.log(rfURL + ', ajax fail:');
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
        console.log("======================================");
        showLoading(false);
        alert(rfURL + ', ajax fail!');
    });
}

/*
    Action Name: CreateVolumeStep1

    Action Request Parameters:
        Name                Type            Description
        RaidLevel           string          selected raid level
        SelectedDriveIds    string Array    selected drive ids

        {"RaidLevel":"1", "SelectedDriveIds":["Fake0", "Fake1"]}

    Action Response Parameters:
        Name                Type            Description
        ....
        see below detail

        {
            "Max Size":100,
            "StripeSize":[16,32,64,128,256,512,1024],
            "AccessPolicy":["Read Write","Read Only","Blocked"],
            "DiskCachePolicy":["Unchanged","Enable","Disable"],
            "InitState":["No Init","Quick Init","Full Init"]
        }

    userParamsObj: keep parameters user input/select
*/
function CreateVolumeStep1() {
    showLoading(true);
    var rfURL;
    var json = JSON.parse("{}");
    var jsonParam = "";

    rfURL = CreVolBasicDataAction;
    console.log(rfURL);

    //json parameters
    if (userParamsObj.hasOwnProperty('RaidLevel')) {
        json.RaidLevel = userParamsObj['RaidLevel'];
    }

    if (userParamsObj.hasOwnProperty('DriveIds')) {
        var selectedIdAry = userParamsObj['DriveIds']
        json.DriveIds = [];
        for (var i = 0; i < selectedIdAry.length; i++) {
            json.DriveIds.push(selectedIdAry[i]);
        }
    }

    jsonParam = JSON.stringify(json);
    console.log(jsonParam);
    $.ajax({
        url: rfURL,
        type: 'POST',
        data: jsonParam
    }).done(function(responseJson, textStatus, jqXHR){
        console.log('CreateVolumeStep1 ', responseJson);
        if( jqXHR.status == 200 && responseJson['error']['message'] == 'Request completed successfully') {
            OnCreateVolumeStep1Success();
        } else {
            alert('Create Volume fail!! Please remove any volume disk built previously. and try again!!');
            VolumeStepDestory();
            showLoading(false);
        }
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log("===== CreateVolumeStep1 ajax error =====");
        console.log(rfURL + ', ajax fail:');
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
        console.log("======================================");
        showLoading(false);
        alert(rfURL + ', ajax fail!');
    });
}

/*
   If there is raid6 and the number of disks is less than 4, hide raid6 option.
   If there is raid60 and the number of disks is less than8, hide raid60 option.
 */
function ShowRaidRadioUI(raidAry, driveidAry) {
    console.log(raidAry, driveidAry);
    //raidAry = ["0", "1", "5", "6", "10", "50", "60"];
    var radioElemnet;
    if (raidAry.length > 0) {
        for (var i = 0; i < raidAry.length; i++) {
            radioElemnet = $('#raid' + raidAry[i] + '_radio');
            //console.log(radioElemnet);
            radioElemnet.removeClass('hidden');
            radioElemnet = $('#raid' + raidAry[i] + '_lbl');
            radioElemnet.removeClass('hidden');
            radioElemnet = $('#raid' + raidAry[i] + '_desc_lbl');
            radioElemnet.removeClass('hidden');
        }
        let raid6_find = raidAry.findIndex((element)=>{
                return element == "6"
            });
        let raid60_find = raidAry.findIndex((element)=>{
                return element == "60"
            });
        if (raid6_find != -1 && driveidAry.length < 4) {
            $('#RAID6').hide();
        }
        if (raid60_find != -1 && driveidAry.length < 8) {
            $('#RAID60').hide();
        }
    }
}
/*
   Get avaliable resource by GET /redfish/v1/Systems/<SystemId>/Storage/Raid0/StorageControllers/0/
   CreateVolumeBasicDataActionInfo

   "Parameters": [
    {
        "Name": "RaidLevel",
        "Required": true,
        "DataType": "String",
        "RaidLevel@Redfish.AllowableValues": ["0", "1", "5", "6", "10"]
    },
    {
        "Name": "DriveIds",
        "Required": true,
        "DataType": "StringArray",
        "DriveIds@Redfish.AllowableValues": ["3", "4", "7", "6"]
    }],
 */
function OngetCreateRaidVolume() {
    //console.log('OngetCreateRaidVolume()');
    var freedriveid_ary = []
    var raidlevel_ary = [];

    var rfURL;
    if (crevolstep1Action != null)
        rfURL = crevolstep1Action;
    else
        rfURL = null;
    console.log('Get available resource', rfURL);
    $.ajax({
        url: rfURL,
        type: 'GET'
    }).done(function(responseJson) {
        //console.log(responseJson);
        if (responseJson.hasOwnProperty('Parameters')) {
            volumeCreateObj.FreeRaidResource = responseJson.Parameters;
            console.log('volumeCreateObj', volumeCreateObj);
            if (volumeCreateObj.FreeRaidResource[1].hasOwnProperty('DriveIds@Redfish.AllowableValues')) {
                freedriveid_ary = volumeCreateObj.FreeRaidResource[1]['DriveIds@Redfish.AllowableValues'];
                mFreeDriveId = [];
                mFreeDriveId = volumeCreateObj.FreeRaidResource[1]['DriveIds@Redfish.AllowableValues'];
                //console.log(freedriveid_ary.length);
                if (freedriveid_ary.length > 0) {
                    if (volumeCreateObj.FreeRaidResource[0].hasOwnProperty('RaidLevel@Redfish.AllowableValues')) {
                        raidlevel_ary = volumeCreateObj.FreeRaidResource[0]['RaidLevel@Redfish.AllowableValues'];
                        g_raidlevel = raidlevel_ary;
                        //console.log(raidlevel_ary);
                        if (raidlevel_ary.length > 0) {
                            console.log('====Ready to do Create Volume======');
                            //attach raidlevel_ary[] into radio ui
                            ShowRaidRadioUI(raidlevel_ary, freedriveid_ary);
                            //attatch FreeDriveIds[] into checkbox table
                            console.log("========= add freedriveid_ary into table ===========");

                            console.log(freedriveid_ary);
                            hideinfo(true);
                            showLoading(false);
                            VolumeStepInit(freedriveid_ary.sort());
                            //hide menubar
                            //$('#menubar').hide();
                            $('#sidemenu').hide();
                            gformWizard = 'running';
                        } else {
                            showLoading(false);
                            console.log('PossibleRaidLevel is empty !!');
                            alert(lang.LANG_SM_VOLUME_CREATE_ALERT_MESSAGE);
                            disableAllButton(false);
                            return;
                        }
                    }
                } else {
                    showLoading(false);
                    console.log('No any FreeRaidResource!!');
                    alert(lang.LANG_SM_VOLUME_CREATE_ALERT_MESSAGE);
                    disableAllButton(false);
                    return;
                }
            }
        } else {
            console.log('Parameters object missed');
            showLoading(false);
            disableAllButton(false);
            return;
        }
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr);
        console.log("============get CreateVolumeBasicDataActionInfo error===============");
        console.log(rfURL + ', ajax fail:');
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
        console.log("======================================");
        showLoading(false);
        disableAllButton(false);
        alert(rfURL + ', ajax fail!');
    });
}

/*
    Action Name: GetFreeRaidResource
    Action Request Parameters: None
    Action Response Parameters:
        Name                Type            Description
        Success             boolean         Success or failure
        PossibleRaidLevel   string array    Possible Raid Level
        FreeDriveIds        string array    Free Drive Ids
        {
            "PossibleRaidLevel": [
                "0",
                "1"
            ],
            "FreeDriveIds": [
                "Fake0",
                "Fake1"
            ]
        }
    111419: check values in Oem.InsydeControllers.CreateRaidVolume, after GetFreeRaidResource POST action.
*/
function getFreeRaidResource() {
    showLoading(true);
    disableAllButton(true);
    var rfURL;
    rfURL = freeraidresAction;
    //console.log(rfURL);
    $.ajax({
        url: rfURL,
        type: 'POST',
        contentType: 'application/json'
    }).done(function(responseJson, textStatus, xhr){
        console.log(responseJson);
        //console.log('getFreeRaidResource, responseJson', responseJson['error']['message']);
        if( xhr.status == 200 && responseJson['error']['message'] == 'Request completed successfully') {
            OngetCreateRaidVolume();
        }
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log("======================================");
        console.log(rfURL + ', ajax fail:');
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
        console.log("======================================");
        disableAllButton(false);
        showLoading(false);
        alert(rfURL + ', ajax fail!');
    });
}

function destorytableObjInnerStep() {
    if (freediskDataTabObj != null) {
        freediskDataTabObj = null
        console.log('freediskDataTabObj destroy, freediskDataTabObj = ', freediskDataTabObj);
        $('#raidfreedisk_table').empty();
        $('#raidfreedisk_table_header').empty();
    }
    if (raiddisksummaryDataTabObj != null) {
        raiddisksummaryDataTabObj = null
        console.log('raiddisksummaryDataTabObj destroy, raiddisksummaryDataTabObj = ', raiddisksummaryDataTabObj);
        $('#raiddisk_table_summary').empty();
        $('#raiddisk_table_summary_header').empty();
    }
}

//+++++++++++++++++++++++++++++++ new step +++++++++++++++++++++++++++++
function nextButton(enable) {
    console.log(enable);
    jQuery('#nextBtn', top.topmenu.MainFrame.document).prop('disabled', !enable);
}
jQuery("#prevBtn", top.topmenu.MainFrame.document).click(function() {
    console.log('prevBtn click');
    nextPrev(-1);
});

jQuery("#nextBtn", top.topmenu.MainFrame.document).click(function() {
    console.log('nextBtn click');
    nextPrev(1);
});

jQuery("#cancelBtn", top.topmenu.MainFrame.document).click(function() {
    console.log('cancelBtn click');
    VolumeStepDestory();
});

$('#volume_name', top.topmenu.MainFrame.document).on('keyup keypress blur change', function(e) {
    //console.log(e.type, $(this).val());
    if ($(this).val().length == 0) {
        nextButton(false);
    } else {
        nextButton(true);
    }
});


$('#volume_disk_size').on('keyup keypress blur change', function(e) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
    //console.log(e.type, $(this).val());
    if ($(this).val() == 0) {
        $(this).addClass('error');
        nextButton(false);
    } else if ($(this).val() > volumeCreateObj.CreateParams.MaxSize) {
        $(this).val(volumeCreateObj.CreateParams.MaxSize);
        $(this).removeClass('error')
        nextButton(true);
    } else {
        $(this).removeClass('error');
        nextButton(true);
    }
});

function loadVolumeStepString() {
    $('#volumeStep_caption').text(lang.LANG_SM_VOLUME_CREATE_TITLE);
    $('#prevBtn').text(lang.LANG_SM_VOLUME_CREATE_STEP_BTN_PREVIOUS);
    $('#nextBtn').text(lang.LANG_SM_VOLUME_CREATE_STEP_BTN_NEXT);
    $('#cancelBtn').text(lang.LANG_SM_VOLUME_CREATE_STEP_BTN_CANCEL);
    //step1
    $("#raidlevel_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_SUB_TITLE1);
    $("#raid0_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID0);
    $("#raid0_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID0_DESC);
    $("#raid1_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID1);
    $("#raid1_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID1_DESC);
    $("#raid5_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID5);
    $("#raid5_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID5_DESC);
    $("#raid6_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID6);
    $("#raid6_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID6_DESC);
    $("#raid10_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID10);
    $("#raid10_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID10_DESC);
    $("#raid50_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID50);
    $("#raid50_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID50_DESC);
    $("#raid60_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID60);
    $("#raid60_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_RAID60_DESC);
    $("#disk_member_desc_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP1_SUB_TITLE2);

    //step2
    $("#set_raid_config_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP2_SUB_TITLE);
    $("#volume_name_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP2_DISK_NAME);
    $("#volume_size_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP2_DISK_SIZE);
    $("#stripesize_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP2_STRIPESIZE);
    $("#diskcachepolicy_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP2_DISKCACHEPOLICY);
    $("#accesspolicy_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP2_ACCESSPOLICY);
    $("#initstate_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP2_INITSTATE);

    //step3
    $("#config_summary_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_SUB_TITLE);
    $("#config_volume_disk_name_caption_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_DISK_NAME);
    $("#config_volume_disk_size_caption_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_DISK_SIZE);
    $("#config_volume_stripsize_caption_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_STRIPESIZE);
    $("#config_volume_raidlevel_caption_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_RAIDLEVEL);
    $("#config_volume_accesspolicy_caption_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_ACCESSPOLICY);
    $("#config_volume_diskcachepolicy_caption_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_DISKCACHEPOLICY);
    $("#config_volume_initstate_caption_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_INITSTATE);
    $("#config_member_volume_disk_lbl").text(lang.LANG_SM_VOLUME_CREATE_STEP3_MEMBER_DISK);
}

var currentTab = 0; // Current tab is set to be the first tab (0)
var diskSelectary = [];
function onVolumeStepInit(diskSelectary) {
    loadVolumeStepString();
    setTimeout(function(){
        //freediskDataTabObj.reload();
        $('input[name="diskcheck"]', top.topmenu.MainFrame.document).change(function() {
            if (this.checked) {
                //console.log('add:' + $(this).val());
                diskSelectary.push($(this).val());
            } else {
                //console.log('remove:' + $(this).val());
                index = diskSelectary.indexOf($(this).val());
                if (index > -1) {
                    diskSelectary.splice(index, 1);
                }
            }
            //console.log('diskSelectary', diskSelectary);
            //console.log('level', level, typeof(level));
            //console.log('diskSelectary.length', diskSelectary.length);
            leveldiskCheck(levelId, diskSelectary);
        });
    }, 10);

    let level = 0; //default is raid0
    let levelId = null;
    let index = -1;
    $('input[name="raidlevel_options"]', top.topmenu.MainFrame.document).change(function() {
        //console.log($(this).val());
        level = $(this).val();
        levelId = '#RAID' + level;
        //console.log('level', level, 'levelId', levelId);
        leveldiskCheck(levelId, diskSelectary);
    });

    levelId = '#RAID' + level;

    //raid0_radio is selected default
    $('#raid' + level + '_radio', top.topmenu.MainFrame.document).prop('checked', true);

    leveldiskCheck(levelId, diskSelectary);
    raiddiskSummaryTableInit();
    $('#prevBtn', top.topmenu.MainFrame.document).prop('disabled', false);
    $('#nextBtn', top.topmenu.MainFrame.document).prop('disabled', true);
    $('#cancelBtn', top.topmenu.MainFrame.document).prop('disabled', false);
    console.log('onVolumeStepInit: currentTab->', currentTab);
    showTab(currentTab); // Display the current tab
}

function leveldiskCheck(levelId, disk) {
    //check level rule
    //console.log('levelId', levelId);
    //console.log('disk', disk);
    let radioElemnet;
    let radioArray = ['0', '1', '5', '6', '10', '50', '60'];
    //reset all level radio to default state
    for (var i = 0; i < radioArray.length; i++) {
        radioElemnet = $('#RAID' + radioArray[i] + '', top.topmenu.MainFrame.document);
        $(radioElemnet, top.topmenu.MainFrame.document).css('color', 'black');
    }

    //check MediaType that hdd/sdd cannot mix used.
    if (disk.length == 1) {
        let hdd = false;
        for (let i=0; i<freediskDataTabObj.data.length; i++) {
            if ((disk == freediskDataTabObj.data[i][2]) && (freediskDataTabObj.data[i][3] == 'HDD')) {
                console.log('selected disk is HDD type');
                hdd = true;
                break;
            }
            if ((disk == freediskDataTabObj.data[i][2]) && (freediskDataTabObj.data[i][3] == 'SSD')) {
                console.log('selected disk is SSD type');
                hdd = false;
                break;
            }
        }
        console.log('hdd, disk', hdd, disk);
        if (hdd) { //disable all other SSD
            for (let i=0; i<freediskDataTabObj.data.length; i++) {
                if (freediskDataTabObj.data[i][3] == 'SSD') {
                    $('input[name="diskcheck"]')[i].disabled = true;
                }
            }
        } else {//disable all other HDD
            for (let i=0; i<freediskDataTabObj.data.length; i++) {
                if (freediskDataTabObj.data[i][3] == 'HDD') {
                    $('input[name="diskcheck"]')[i].disabled = true;
                }
            }
        }
    } else if (disk.length == 0) {
        //remove all checkbox disable state
        for(let j=0; j<$('input[name="diskcheck"]').length; j++) {
            $('input[name="diskcheck"]')[j].disabled = false;
        }
    }

    if (levelId == '#RAID0') {
        if (disk.length >= 1) {
            nextStep2(levelId, true);
        } else {
            nextStep2(levelId, false);
        }
    } else if(levelId == '#RAID1') {
        if (disk.length >= 2 && disk.length % 2 == 0) {
            nextStep2(levelId, true);
        } else {
            nextStep2(levelId, false);
        }
    } else if(levelId == '#RAID5') {
        if (disk.length >= 3) {
            nextStep2(levelId, true);
        } else {
            nextStep2(levelId, false);
        }
    } else if(levelId == '#RAID6') {
        if (disk.length >= 4) {
            nextStep2(levelId, true);
        } else {
            nextStep2(levelId, false);
        }
    } else if(levelId == '#RAID10') {
        if (disk.length % 2 == 0 && disk.length >= 4) {
            nextStep2(levelId, true);
        } else {
            nextStep2(levelId, false);
        }
    } else if(levelId == '#RAID50') {
        if (disk.length % 2 == 0 && disk.length >= 6) {
            nextStep2(levelId, true);
        } else {
            nextStep2(levelId, false);
        }
    } else if(levelId == '#RAID60') {
        if (disk.length % 2 == 0 && disk.length >= 8) {
            nextStep2(levelId, true);
        } else {
            nextStep2(levelId, false);
        }
    }
}
//according enable, set RAID(input radio)/nextBtn
function nextStep2(levelId, enable) {
    if (enable) {
        $(levelId, top.topmenu.MainFrame.document).css('color', 'black');
    } else {
        $(levelId, top.topmenu.MainFrame.document).css('color', 'red');
    }
    $('#nextBtn', top.topmenu.MainFrame.document).prop('disabled', !enable);
}
function showTab(n) {
    // This function will display the specified tab of the form...
    let x = document.getElementsByClassName("tab");
    console.log('showTab: currentTab->', n);
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = lang.LANG_SM_VOLUME_CREATE_STEP_BTN_FINISH;
    } else {
        document.getElementById("nextBtn").innerHTML = lang.LANG_SM_VOLUME_CREATE_STEP_BTN_NEXT;
    }
    if (n == 0)
        $("#stepTitle").text(lang.LANG_SM_VOLUME_CREATE_STEP1_TAB_TITLE);
    if (n == 1)
        $("#stepTitle").text(lang.LANG_SM_VOLUME_CREATE_STEP2_TAB_TITLE);
    if (n == 2)
        $("#stepTitle").text(lang.LANG_SM_VOLUME_CREATE_STEP3_TAB_TITLE);
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    let x = document.getElementsByClassName("tab");
    document.getElementsByClassName("step")[currentTab].className += " finish";
    // Hide the current tab:
    console.log('nextPrev: n->', n);
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    console.log('nextPrev: currentTab->', currentTab);
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        CreateVolumeStep2();
        VolumeStepDestory();
        return false;
    }
    //console.log('nextPrev: diskSelectary->', diskSelectary);
    if (n == -1 && currentTab == 0) {
        $('#volume_name', top.topmenu.MainFrame.document).val('');
        nextButton(true);
    }
    if (n == 1 && currentTab == 1) {
        //console.log('getFreeRaidResource is done!! and collect user parameters for Step2');
        //console.log($('input[name="raidlevel_options"]:checked').val());
        userParamsObj['RaidLevel'] = $('input[name="raidlevel_options"]:checked').val();
        userParamsObj['DriveIds'] = diskSelectary;
        //console.log(diskSelectary);
        console.log('userParamsObj=', userParamsObj);
        CreateVolumeStep1();
        $('#volume_name', top.topmenu.MainFrame.document).focus();
        nextButton(false);
    }
    if (n == 1 && currentTab == 2) {
        //console.log('at Step2 and clicked Next Button');
        //console.log('Step1 is done!! and collect user parameters');
        userParamsObj['Disk Name'] = $('#volume_name', top.topmenu.MainFrame.document).val();
        userParamsObj['Disk Size'] = parseInt($('#volume_disk_size').val());
        userParamsObj['StripeSize'] = parseInt($('#stripesize_select option:selected').text());
        userParamsObj['DiskCachePolicy'] = $('#diskcachepolicy_select option:selected').text();
        userParamsObj['AccessPolicy'] = $('#accesspolicy_select option:selected').text();
        userParamsObj['InitState'] = $('#initstate_select option:selected').text();
        console.log(userParamsObj);
        ShowSelectDiskTableUISummary(userParamsObj.DriveIds);
        // setTimeout(function(){
        //     if (raiddisksummaryDataTabObj != null)
        //         raiddisksummaryDataTabObj.Reload();}, 10);
        $('#config_volume_disk_name_lbl').text(userParamsObj['Disk Name']);
        $('#config_volume_disk_size_lbl').text(userParamsObj['Disk Size']);
        $('#config_volume_stripesize_lbl').text(userParamsObj['StripeSize']);
        $('#config_volume_raidlevel_lbl').text('RAID ' + userParamsObj['RaidLevel']);
        $('#config_volume_accesspolicy_lbl').text(userParamsObj['AccessPolicy']);
        $('#config_volume_diskcachepolicy_lbl').text(userParamsObj['DiskCachePolicy']);
        $('#config_volume_initstate_lbl').text(userParamsObj['InitState']);
        //showLoading(false);
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    let x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    let i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}

function VolumeStepInit(available_diskarray) {
    console.log('VolumeStepInit: available_diskarray->', available_diskarray);
    //console.log('VolumeStepInit: currentTab->', currentTab);
    $("#volumeStep").removeClass('hidden');
    freeraiddiskTableInit(available_diskarray);
    currentTab = 0;
    diskSelectary = [];
    $('#volume_name', top.topmenu.MainFrame.document).val('');
    onVolumeStepInit(diskSelectary);
}

function VolumeStepDestory() {
    $("#volumeStep").addClass('hidden');
    destorytableObjInnerStep();
    currentTab = 0;
    //reset Step Indicator
    for (let i = 1; i < 4; i++) {
        $('#step' + i + '').addClass('step').removeClass('active').removeClass('finish');
        //console.log($('#step' + i + ''));
    }
    //reset all class tab css style to hide(display: none)
    $('.tab', top.topmenu.MainFrame.document).css('display', 'none');
    $("#wizard").addClass('hidden');
    hideinfo(false);
    gformWizard = 'idle';
    //show menubar
    $('#sidemenu').show();
    disableAllButton(false);
}
