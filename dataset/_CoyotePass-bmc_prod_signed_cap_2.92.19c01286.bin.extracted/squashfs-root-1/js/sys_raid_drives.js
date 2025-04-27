var Drive = {};
var volumeSelectHotspareArray = new Array();
var vdHotSpareTabObj = null;
var phDedicatedHotSpareTableSummaryObj = null;

/*
    for Highlight ui effort for HotspareType property

*/
function appendKeyValueHighLight(table, key, val) {
    var str = "<tr>";
    str += "<td align=\"left\" class=\"labeltitle\">" + key + ": </td>";
    //style="animation: blinker 1s linear infinite;"
    str += "<td align=\"left\" class=\"labeltextblink\">" + val + "</td>";
    str += "</tr>";
    table.append(str);

    return table;
}

function refreshDrivesInfo(json) {
    var table;
    var key;
    //console.log(json);
    showLoading(true);
    $("#info_div").empty();
    $('#info_div').append('<table></table>');
    table = $('#info_div').children();
    for (key in json) {
        if (json.hasOwnProperty(key)) {
            console.log('"' + key + '": ', json[key]);
            if (json[key] == null)
                continue;
            if (key == '@odata.id' || key == '@odata.etag' || key == '@odata.context' || key == '@odata.type' || key == 'Links') {
                continue;
            } else if (key == 'Status') {
                var Status = json['Status'];
                for (var k in Status) {
                    table = appendKeyValue(table, lang["LANG_SM_PROP_" + k.toUpperCase()], Status[k]);
                }
            } else if (key == 'CapacityBytes') {
                if (json[key] != 0)
                    table = appendKeyValue(table, lang["LANG_SM_PROP_" + key.toUpperCase()], formatBytes(json[key]));
                else
                    table = appendKeyValue(table, lang["LANG_SM_PROP_" + key.toUpperCase()], json[key]);
            } else if (key == 'Oem') {
                var oem = json.Oem.Drive;
                for (var key in oem) {
                    //console.log('"' + key + '": ', oem[key]);
                    if (oem[key] == null)
                        continue;
                    if (key == '@odata.type' || key == 'StorageControllerReference' || key == 'DriveState' ||
                        key == 'PatrolReadProgressPercent') {
                        continue;
                    } else if (key == 'SMART') {
                        let smart = oem.SMART;
                        console.log(smart);
                        if (smart.hasOwnProperty('HealthGood')) {
                            let healthgood = smart.HealthGood;
                            if (healthgood != null) {
                                if (healthgood == 'Yes') {
                                    table = appendKeyValue(table, lang["LANG_SM_PROP_" + 'HealthGood'.toUpperCase()], lang.LANG_SM_PROP_HEALTHYES);
                                } else {
                                    table = appendKeyValue(table, lang["LANG_SM_PROP_" + 'HealthGood'.toUpperCase()], lang.LANG_SM_PROP_HEALTHNO);
                                    $("td:contains(SMART.HealthGood)").siblings().css( "color", "red" );
                                }
                            }
                        }
                        if (smart.hasOwnProperty('Temperature')) {
                            let temp = smart.Temperature;
                            //table = appendKeyValue(table, lang["LANG_SM_PROP_" + 'Temperature'.toUpperCase()]), temp + ' &#8451');
                            //temp = '43.0 C' --> '43.0'
                            if (temp != null)
                                table = appendKeyValue(table, lang["LANG_SM_PROP_" + 'Temperature'.toUpperCase()], temp.slice(0,temp.length-2) + ' &#8451');
                        }
                        if (smart.hasOwnProperty('RPM')) {
                            let rpm = smart.RPM;
                            console.log(rpm);
                            if (rpm != null)
                                table = appendKeyValue(table, lang["LANG_SM_PROP_" + 'RPM'.toUpperCase()], rpm);
                        }
                    } else {
                        table = appendKeyValue(table, lang["LANG_SM_PROP_" + key.toUpperCase()], oem[key]);
                    }
                }
            } else if (key == 'Actions') {
                var actions = json['Actions'];
                if (actions.hasOwnProperty('Oem')) {
                    var oem = actions['Oem'];
                    //console.log('Object.keys(oem).length = ' + Object.keys(oem).length);
                    //check object empty, ex {}
                    if (!(Object.keys(oem).length === 0)) {
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.MakeDedicatedHotspare')) {
                            let target = oem['#InsydeOEMExtensions.MakeDedicatedHotspare'];
                            Drive.DedicatedHotspare = target.target;
                            //console.log(Drive);
                        }
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.MakeGlobalHotspare')) {
                            let target = oem['#InsydeOEMExtensions.MakeGlobalHotspare'];
                            Drive.GlobalHotspare = target.target;
                            //console.log(Drive);
                        }
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.RemoveHotspare')) {
                            var target = oem['#InsydeOEMExtensions.RemoveHotspare'];
                            Drive.RemoveHotspare = target.target;
                            //console.log(Drive);
                        }
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.StartLocatePD')) {
                            let target = oem['#InsydeOEMExtensions.StartLocatePD'];
                            Drive.StartLocatePD = target.target;
                            //console.log(Drive);
                        }
                        if (oem.hasOwnProperty('#InsydeOEMExtensions.StopLocatePD')) {
                            let target = oem['#InsydeOEMExtensions.StopLocatePD'];
                            Drive.StopLocatePD = target.target;
                            //console.log(Drive);
                        }
                    }
                }
            } else if (key == 'HotspareType') {
                table = appendKeyValue(table, lang["LANG_SM_PROP_" + key.toUpperCase()], json[key]);
            } else {
                //console.log(lang["LANG_SM_PROP_" + key.toUpperCase()] + ' ' + json[key]);
                table = appendKeyValue(table, lang["LANG_SM_PROP_" + key.toUpperCase()], json[key]);
            }
        } else {
            console.log('not', key, json[key]);
        }
    }
    table_info_margin();
    showLoading(false);
}

//get all volume disk has created for do Dedicate Hotspare
function getVolumeInfoHotspare() {
    console.log(top.topmenu.raidObj);
    var rfurl;
    volumeSelectHotspareArray = [];
    var members = [];
    if (top.topmenu.raidObj.hasOwnProperty("VolumeCollection")) {
        if (top.topmenu.raidObj.VolumeCollection.hasOwnProperty("Members")) {
            members = top.topmenu.raidObj.VolumeCollection.Members;
        }
    }
    if (members == null) {
        console.log("Fail to read VolumeCollection.Members");
    }
    console.log(members.length);
    console.log(volumeSelectHotspareArray);
    for (var i = 0; i < members.length; i++) {
        console.log(members[i]['@odata.id']);
        rfurl = members[i]['@odata.id'];
        $.ajax({
            url: rfurl,
            type: 'GET'
        }).done(function(responseJson, textStatus, jqXHR) {
            console.log(responseJson);
            var obj = {};
            if (responseJson.hasOwnProperty('Id')) {
                obj.Id = responseJson.Id;
            }
            if (responseJson.hasOwnProperty('Description')) {
                obj.Description = responseJson.Description;
            }
            if (responseJson.hasOwnProperty('Name')) {
                obj.Name = responseJson.Name;
            }
            if (responseJson.hasOwnProperty('Oem')) {
                var oem = responseJson.Oem.Volume;
                if (oem.hasOwnProperty('RaidLevel')) {
                    obj.RaidLevel = oem.RaidLevel;
                }
            }
            if (responseJson.hasOwnProperty('Status')) {
                var Status = responseJson['Status'];
                if (Status.hasOwnProperty('State')) {
                    obj.State = Status['State'];
                }
            }
            if (responseJson.hasOwnProperty('CapacityBytes')) {
                obj.TotalSize = formatBytes(responseJson['CapacityBytes']);
            }
            console.log(obj);
            console.log(i);
            volumeSelectHotspareArray.push(obj);
            console.log(volumeSelectHotspareArray);
        }).fail(function(xhr, errorThrown) {
            console.log(xhr.status);
            console.log(errorThrown);
        });
    }
}

function requestHotSpare(type, rfURL) {
    showLoading(true);

    var json = JSON.parse("{}");
    var jsonParam;

    if (type == 'global') {
        //Action Name: MakeGlobalHotspare
        //Action Request Parameters : None
        jsonParam = null;

    } else if (type == 'dedicated') {
        // Request Parameters
        //{"VolumeID": "Broadcom0"}
        // get which storage/controller/drive

        console.log(volumeSelectHotspareArray);
        if (volumeSelectHotspareArray.length > 0) {
            //hide menubar
            //$('#menubar').hide();
            //$('#sidemenu').hide();
            //gformWizard = 'running';
            //$("#info_area").hide();
            DHS_Step_Init(rfURL)
            showLoading(false);
        } else {
            showLoading(false);
            alert('No any Volume Disk for designate as a Dedicated hotspare, Please Create any Volume Disk first!!');
        }
    } else {
        //Action Name: RemoveHotspare
        //Action Request Parameters : None
        jsonParam = null;
    }

    //console.log(rfURL);
    if (type == 'global' || type == 'remove') {
        if (type == 'golbal')
            graidAction.type = 'globalhotspare';
        if (type == 'remove')
            graidAction.type = 'removehotspare';
        graidAction.param = raidObj.selected_Drives['@odata.id'];
        $.ajax({
            url: rfURL,
            type: 'POST',
            data: jsonParam,
            contentType: 'application/json'
        }).done(function(responseJson, textStatus, jqXHR) {
            console.log(responseJson);
            console.log(type);
            if( jqXHR.status == 200 && responseJson['error']['message'] == 'Successfully Completed Request') {
                // if (type == 'global') {
                //     alert('Make Global Hotspare Success!!');
                // }
                // if (type == 'remove') {
                //     alert('Hot Spare remove Success!!');
                // }
            } else {
                if (type == 'global') {
                    alert('Make Global Hotspare Fail!!');
                }
                if (type == 'remove') {
                    alert('Hot Spare remove Fail!!');
                }
                showLoading(true);
            }
            idx = $("#_selecter option:selected").val();
            console.log(raidObj.selected_Drives.Actions.Oem);
            //DrivePropertyRefresh(idx, raidObj.selected_Drives['@odata.id']);
        }).fail(function(xhr, errorThrown) {
            console.log(xhr.status);
            console.log(errorThrown);
        });
    }
}

//+++++++++++++++++++++++++++++++ new step for Dedicated Hot Spare +++++++++++++++++++++++++++++
var jsonString;
var DedicatedHotspareURL;
var id = "";

function loadDHSString() {
    //title of step 1 2
    $("#DHS_Step_caption").text('Hot Spare');
    $("#vd_dedicated_hotspare_select_desc").text('Select one Volume Disk for Dedicated HotSpare');
    $("#vd_dedicated_hotspare_summary_desc1").text('Description: Designates a ready or Unconfigured Good drive as a dedicated hotspare to the specified volume drive(s).');
    $("#vd_dedicated_hotspare_summary_desc2").text('A dedicated hot spare will only replace problematic drives on selected volume drive(s).');
    $("#vd_dedicated_hotspare_summary_desc3").text('Select volume drive:');
    $("#dhs_prevBtn").text(lang.LANG_SM_VOLUME_CREATE_STEP_BTN_PREVIOUS);
    $("#dhs_nextBtn").text(lang.LANG_SM_VOLUME_CREATE_STEP_BTN_NEXT);
    $("#dhs_cancelBtn").text(lang.LANG_SM_VOLUME_CREATE_STEP_BTN_CANCEL);
    //finish: lang.LANG_SM_VOLUME_CREATE_STEP_BTN_FINISH"),
}


function vdHotSpareTableInit() {
    "use strict";
    let columns = [
        ["HotSpare_radio", "5%", "center"],
        ["HotSpare_Device", "5%", "center"],
        ["HotSpare_RaidLevel", "15%", "center"],
        ["HotSpare_State", "15%", "center"],
        ["HotSpare_TotalSize", "20%", "center"]
    ];
    //replace table header content with string table
    columns[0][0] = "";//lang.LANG_SM_LD_DEDICATED_HOTSPARE_ID;
    columns[1][0] = "ID";//lang.LANG_SM_LD_DEDICATED_HOTSPARE_ID;
    columns[2][0] = lang.LANG_SM_LD_TABLE_HEADER_RAID_LEVEL;
    columns[3][0] = lang.LANG_SM_PD_TABLE_HEADER_STATE;
    columns[4][0] = lang.LANG_SM_PD_TABLE_HEADER_TOTALSIZE;

    let volumedisk_select_dedicated_Header = document.getElementById("vd_dedicated_hotspare_select_table_header");
    let volumedisk_select_dedicatedPlace = document.getElementById("vd_dedicated_hotspare_select_table");
    vdHotSpareTabObj = GetTableElement();
    console.log(vdHotSpareTabObj);
    console.log(columns);
    vdHotSpareTabObj.setColumns(columns);
    vdHotSpareTabObj.init_header('vdHotSpareTabObj', volumedisk_select_dedicated_Header);
    vdHotSpareTabObj.init_body('vdHotSpareTabObj', volumedisk_select_dedicatedPlace);
    console.log(vdHotSpareTabObj);
    ShowVDHotSpareTable();
}

function ShowVDHotSpareTable() {
    let RowData = [];
    if (volumeSelectHotspareArray.length > 0) {
        for (i = 0; i < volumeSelectHotspareArray.length; i++) {
            var radio = '<input type="radio" name="vdhotspare" value=\"' + volumeSelectHotspareArray[i].Id + '\">';
            RowData.push([i,
                         radio,
                         volumeSelectHotspareArray[i].Id,
                         volumeSelectHotspareArray[i].RaidLevel,
                         volumeSelectHotspareArray[i].State,
                         volumeSelectHotspareArray[i].TotalSize
            ]);
        }
        vdHotSpareTabObj.show(RowData);
    }
}

function driveDedicatedHotSpareSummaryTableInit() {
    "use strict";
    let columns = [
        ["Device", "25%", "center"],
        ["RaidLevel", "25%", "center"],
        ["State", "15%", "center"],
        ["Total Size", "20%", "center"]
    ];
    //replace table header content with string table
    columns[0][0] = "ID";//lang.LANG_SM_LD_DEDICATED_HOTSPARE_ID;
    columns[1][0] = lang.LANG_SM_LD_TABLE_HEADER_RAID_LEVEL;
    columns[2][0] = lang.LANG_SM_PD_TABLE_HEADER_STATE;
    columns[3][0] = lang.LANG_SM_PD_TABLE_HEADER_TOTALSIZE;

    let pd_summary_Header = document.getElementById("ph_for_dedicated_hotspare_summary_table_header");
    let pd_summary_Place = document.getElementById("ph_for_dedicated_hotspare_summary_table");
    phDedicatedHotSpareTableSummaryObj = GetTableElement();
    console.log(columns);
    phDedicatedHotSpareTableSummaryObj.setColumns(columns);
    phDedicatedHotSpareTableSummaryObj.init_header('phDedicatedHotSpareTableSummaryObj', pd_summary_Header);
    phDedicatedHotSpareTableSummaryObj.init_body('phDedicatedHotSpareTableSummaryObj', pd_summary_Place);
    console.log(phDedicatedHotSpareTableSummaryObj);
}

function ShowPdDedicatedHotSparesTable(volumeid) {
    var RowData = [];
    console.log(volumeSelectHotspareArray);
    if (volumeSelectHotspareArray.length > 0) {
        for (i = 0; i < volumeSelectHotspareArray.length; i++) {
            if (volumeSelectHotspareArray[i].Id.localeCompare(volumeid) == 0) {
                RowData.push([i,
                              volumeSelectHotspareArray[i].Id,
                              volumeSelectHotspareArray[i].RaidLevel,
                              volumeSelectHotspareArray[i].State,
                              volumeSelectHotspareArray[i].TotalSize
                ]);
            }
        }
        phDedicatedHotSpareTableSummaryObj.show(RowData);
    }
}

//DHS : Dedicated Hot Spare
function DHS_Step_Init(DedicatedHotspareAction) {
    vdHotSpareTableInit();
    driveDedicatedHotSpareSummaryTableInit();
    hideinfo(true);
    $('#sidemenu').hide();
    $("#DedHotSpareStep").removeClass('hidden');
    loadDHSString();
    currentTab = 0;
    onDHSInit(DedicatedHotspareAction);
    DedicatedHotspareURL = DedicatedHotspareAction;
}

function bindDHSbuttonEvent() {
    console.log('dhs_prevBtn', $("#dhs_prevBtn", top.topmenu.MainFrame.document));
    $("#dhs_prevBtn", top.topmenu.MainFrame.document).click(function() {
        //console.log('dhs_prevBtn click');
        nextDHSPrev(-1);
    });
    console.log('dhs_nextBtn', $("#dhs_nextBtn", top.topmenu.MainFrame.document));
    $("#dhs_nextBtn", top.topmenu.MainFrame.document).click(function() {
        //console.log('dhs_nextBtn click');
        nextDHSPrev(1);
    });
    console.log('dhs_cancelBtn', $("#dhs_cancelBtn", top.topmenu.MainFrame.document));
    $("#dhs_cancelBtn", top.topmenu.MainFrame.document).click(function() {
        DHS_Step_Destory();
    });
}

function onDHSInit(DedicatedHotspareAction) {
    bindDHSbuttonEvent();
    //setTimeout(function(){
        //vdHotSpareTabObj.Reload();
        $('input[type=radio][name=vdhotspare]', top.topmenu.MainFrame.document).change(function() {
            console.log($(this).val());
            $('#dhs_nextBtn', top.topmenu.MainFrame.document).prop('disabled', false);
        });
    //}, 10);

    $('#dhs_prevBtn', top.topmenu.MainFrame.document).prop('disabled', false);
    $('#dhs_nextBtn', top.topmenu.MainFrame.document).prop('disabled', true);
    $('#dhs_cancelBtn', top.topmenu.MainFrame.document).prop('disabled', false);
    console.log('onDHSInit: currentTab->', currentTab);
    showDHSTab(currentTab); // Display the current tab
}

function showDHSTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("dhstab");
    console.log('showDHSTab: currentTab->', n);
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("dhs_prevBtn").style.display = "none";
    } else {
        document.getElementById("dhs_prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("dhs_nextBtn").innerHTML = lang.LANG_SM_VOLUME_CREATE_STEP_BTN_FINISH;
    } else {
        document.getElementById("dhs_nextBtn").innerHTML = "Next";
    }
    if (n == 0)
        $("#dhs_stepTitle").text('Assign the Volume Drive');
    if (n == 1)
        $("#dhs_stepTitle").text('Summary');
    //... and run a function that will display the correct step indicator:
    fixDHSStepIndicator(n)
}

function fixDHSStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("dhs_step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}

function nextDHSPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("dhstab");
    document.getElementsByClassName("dhs_step")[currentTab].className += " finish";
    // Hide the current tab:
    console.log('nextDHSPrev: n->', n);
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    console.log('nextDHSPrev: currentTab->', currentTab);
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        // ... the form gets submitted:
        console.log( DedicatedHotspareURL + ' ' + jsonString);
        requestDedicatedHotspare(id, DedicatedHotspareURL, jsonString);
        DHS_Step_Destory();
        return false;
    }
    if (n == 1 && currentTab == 1) {
        //get VolumeId for json params
        console.log($('input[name="vdhotspare"]:checked').val());
        let selected_volumeid = $('input[name="vdhotspare"]:checked').val();
        console.log(selected_volumeid);
        ShowPdDedicatedHotSparesTable(selected_volumeid);
        let json = JSON.parse("{}");
        //json parameters
        json.VolumeID = selected_volumeid;
        jsonString = JSON.stringify(json);
        console.log(jsonString);
        setTimeout(function() { phDedicatedHotSpareTableSummaryObj.Reload(); }, 10);
        document.getElementsByClassName("dhs_step")[currentTab].className += " finish";
    }

    // Otherwise, display the correct tab:
    showDHSTab(currentTab);
}

function destoryHotSparetableObjInnerStep() {
    if (vdHotSpareTabObj != null) {
        vdHotSpareTabObj = null
        //console.log('vdHotSpareTabObj destroy, vdHotSpareTabObj = ', vdHotSpareTabObj);
        $('#vd_dedicated_hotspare_select_table_header').empty();
        $('#vd_dedicated_hotspare_select_table').empty();
    }
    if (phDedicatedHotSpareTableSummaryObj != null) {
        phDedicatedHotSpareTableSummaryObj = null
        //console.log('phDedicatedHotSpareTableSummaryObj destroy, phDedicatedHotSpareTableSummaryObj = ', phDedicatedHotSpareTableSummaryObj);
        $('#ph_for_dedicated_hotspare_summary_table_header').empty();
        $('#ph_for_dedicated_hotspare_summary_table').empty();
    }
}

function DHS_Step_Destory() {
    destoryHotSparetableObjInnerStep();
    //reset all class dhstab css style to hide(display: none)
    $('.dhstab', top.topmenu.MainFrame.document).css('display', 'none');
    $("#DedHotSpareStep").addClass('hidden');
    //$("#info_area").show();
    hideinfo(false);
    $('#sidemenu').show();
    for (let i = 1; i < 3; i++) {
        $('#dhs_step' + i + '').addClass('dhs_step').removeClass('active').removeClass('finish');
        //console.log($('#step' + i + ''));
    }
}
//------------------------------ new step for Dedicated Hot Spare -------------------------
