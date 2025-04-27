
var map = new Map([
    ['ReadPolicy', ['Read Ahead', 'No Read Ahead']],
    ['WritePolicy', ['Write Through', 'Write Back', 'Write Cached']],
    ['IoPolicy', ['Direct IO', 'Cached IO']],
    ['AccessPolicy', ['Read Write', 'Read Only', 'Blocked']],
    ['DiskCachePolicy', ['Enable', 'Disable', 'Unchanged']],
]);
var objOem;
var volumesUpdateJson = JSON.parse("{}");

function appendSelecter(ekey, key) {
    var html = "<td align=\"right\" class=\"bold\">" + key + ": </td>";
    var select = '<select id=\"' + ekey + '\"' + ' class=\"mango_selector_left\"></select>';
    html += "<td align=\"left\" class=\"labeltext\">" + select + "</td>";
    return html;
}

function appendKeyValue_Volume_Volume(table, ekey, key, val) {
    var str = "<tr>";
    /*if (ekey == 'Name') {
        str += "<td align=\"right\" class=\"bold\">" + key + ": </td>";
        var input = '<Input type=\"text\" class=\"textfield\" id=\"' + ekey + '\"" maxlength="15" value=\"' + val + '\">';
        str += "<td align=\"left\" class=\"labeltext\">" + input + "</td>";
        //console.log(str);
    } else if (ekey == 'ReadPolicy' || ekey == 'WritePolicy' ||
        ekey == 'IoPolicy' || ekey == 'AccessPolicy' ||
        ekey == 'DiskCachePolicy') {
        str += appendSelecter(ekey, key);
        //console.log(str);
    } else {
        str += "<td align=\"right\" class=\"bold\">" + key + ": </td>";
        str += "<td align=\"left\" class=\"labeltext\">" + val + "</td>";
    }*/
    //simple version, just show read-only style
    str += "<td align=\"right\" class=\"bold\">" + key + ": </td>";
    str += "<td align=\"left\" class=\"labeltext\">" + val + "</td>";
    str += "</tr>";
    //console.log(str);
    table.append(str);

    return table;
}

//below property don't show base on oem suggestion
//===================================
//=                                 =
//= redfish property <--> ui        =
//=                                 =
//===================================
//Status.State <--> State
//SpeedGbps <--> SpeedGbps

var OemProperty = ["Description", "State", "VolumeType", "OptimumIOSizeBytes"];

function refreshVolumesInfo(json) {
    var table;
    var key;
    let vid = json['@odata.id'];
    //console.log(json);
    showLoading(true);
    $("#info_div").empty();
    $('#info_div').append('<table>');
    table = $('#info_div').children();
    for (key in json) {
        if (json.hasOwnProperty(key)) {
            //console.log('"' + key + '": ', json[key]);
            if (json[key] == null)
                continue;
            if (key == '@odata.id' || key == '@odata.etag' || key == '@odata.context' || key == '@odata.type' || key == 'Operations'
                || (OemProperty.indexOf(key)) >= 0) {
                continue;
            } else if (key == 'Status') {
                var Status = json['Status'];
                for (var k in Status) {
                    if ((OemProperty.indexOf(k) >= 0)) {
                        continue;
                    }
                    table = appendKeyValue_Volume_Volume(table, key, lang["LANG_SM_PROP_" + k.toUpperCase()], Status[k]);
                }
            } else if (key == 'CapacityBytes') {
                table = appendKeyValue_Volume_Volume(table, key, lang["LANG_SM_PROP_" + key.toUpperCase()], formatBytes(json[key]));
            } else if (key == 'Encrypted') {
                table = appendKeyValue_Volume_Volume(table, key, lang["LANG_SM_PROP_" + key.toUpperCase()], (json[key] == true ? 'True': 'False'));
            } else if (key == 'Actions') {} else if (key == 'Links') {
                let links = json.Links;
                if (links.hasOwnProperty('Drives')) {
                    let drives = links.Drives;
                    if (drives == null)
                        continue;
                    let driveid = '';
                    for (let i=0; i<drives.length; i++) {
                        console.log(drives[i]['@odata.id']);
                        let temp = drives[i]['@odata.id'];
                        temp = temp.split('/');
                        if (i>0)
                            driveid += (',' + temp[temp.length-1]);
                        else
                            driveid += (temp[temp.length-1]);
                        console.log(driveid);
                    }
                    driveid = driveid.split(',').sort().join();
                    table = appendKeyValue(table, lang.LANG_SM_PROP_VOLUME_LINKS_DRIVES, driveid);
                }
            } else if (key == 'Operations') {
                //continue;
                //TODO: showing way depend on ui present
                var operations = json['Operations'];
                //console.log(operations.length);
                if (operations.length > 0) {
                    for (i = 0; i < operations.length; i++) {
                        for (var op in operations[i]) {
                            //console.log(op);
                            table = appendKeyValue_Volume_Volume(table, key, lang["LANG_SM_PROP_" + op.toUpperCase()], operations[i][op]);
                        }
                    }
                }
            } else if (key == 'Oem') {
                var oem = json['Oem']['Volume'];
                objOem = json['Oem']['Volume'];
                for (var i in oem) {
                    if ( i == 'StorageControllerReference' || i == '@odata.type') {
                        continue;
                    } else if ( i == 'BadBlocks') {
                        table = appendKeyValue_Volume_Volume(table, i, lang["LANG_SM_PROP_" + i.toUpperCase()], (oem[i] == true ? 'True': 'False'));
                    } else if ( i == 'StripSize') {
                        table = appendKeyValue_Volume_Volume(table, i, lang["LANG_SM_PROP_" + i.toUpperCase()], formatStripeSizeUnit(oem[i]));
                    }
                       /*else if ( i == 'State') {//State --> Volume State
                        table = appendKeyValue_Volume_Volume(table, i, lang.LANG_SM_PROP_VOLUME_TYPE_STATE, oem[i]);
                    } */else {
                        table = appendKeyValue_Volume_Volume(table, i, lang["LANG_SM_PROP_" + i.toUpperCase()], oem[i]);
                    }
                }
            } else {
                table = appendKeyValue_Volume_Volume(table, key, lang["LANG_SM_PROP_" + key.toUpperCase()], json[key]);
            }
        } else {
            console.log('not', key, json[key]);
        }
    }

    $('#info_div').append('</table>');
    table_info_margin();

    //add option value into Selecter
    for (var [key, value] of map) {
        //console.log(key + ' = ' + value.length + value);
        selectPolicy = $('#' + key + '');
        for (var i = 0; i < value.length; i++) {
            selectPolicy.append($("<option></option>").text(value[i]));
        }
    }

    let iopolicysupport = checkIoPolicy(vid);
    if (iopolicysupport != 'NA') {
        if (iopolicysupport) {
            $('#IoPolicy').prop('disabled', false);
            $('#IoPolicy').css('border', '2px solid #0077ae');
        } else {
            $('#IoPolicy').prop('disabled', true);
            $('#IoPolicy').css('border', '2px solid gray');
        }
    } else {
        console.log('please check checkIoPolicy()!');
    }

    //listen input change event
    $('#Name').change(function(event) {
        volumesUpdateJson.VolumeName = $(this).val();
    });

    $("#ReadPolicy").change(function() {
        volumesUpdateJson.ReadPolicy = $(this).val();
    });
    $("#ReadPolicy").val(objOem.ReadPolicy);

    $("#WritePolicy").change(function() {
        volumesUpdateJson.WritePolicy = $(this).val();
    });
    $("#WritePolicy").val(objOem.WritePolicy);

    $("#IoPolicy").change(function() {
        volumesUpdateJson.IoPolicy = $(this).val();
    });
    $("#IoPolicy").val(objOem.IoPolicy);

    $("#AccessPolicy").change(function() {
        volumesUpdateJson.AccessPolicy = $(this).val();
    });
    $("#AccessPolicy").val(objOem.AccessPolicy);

    $("#DiskCachePolicy").change(function() {
        volumesUpdateJson.DiskCachePolicy = $(this).val();
    });
    $("#DiskCachePolicy").val(objOem.DiskCachePolicy);
    showLoading(false);
}

function checkIoPolicy(id) {
    let len = id.search('Volumes');
    id = id.substr(0, len-1);
    for (let i=0; i<top.topmenu.raidObj.Controllers.length; i++) {
        console.log(id);
        console.log(top.topmenu.raidObj.Controllers[i]['@odata.id']);
        if (top.topmenu.raidObj.Controllers[i]['@odata.id'].includes(id)) {
            let json = top.topmenu.raidObj.Controllers[i].Oem;
            if (json.hasOwnProperty('InsydeControllers')) {
                json = json.InsydeControllers;
                if (json.hasOwnProperty('IoPolicySupport')) {
                    console.log('IoPolicySupport=', json.IoPolicySupport)
                    return json.IoPolicySupport;
                } else {
                    console.log('cannot find IoPolicySupport');
                    return 'NA';
                }
            } else {
                console.log('cannot find IoPolicySupport');
                return 'NA';
            }
        } else {
            console.log('cannot find Controllers');
            return 'NA';
        }
    }
    console.log('cannot find Controllers');
    return 'NA';
}

function formatStripeSizeUnit(kb) {
    let i = Math.floor(Math.log(kb) / Math.log(1024)),
    sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    return (kb / Math.pow(1024, i)).toFixed(3) * 1 + ' ' + sizes[i];
}
