"use strict";

var lang;
var dataTabObj;
var nic_list;
var nic_list_info;
var RF_SYSTEM_SN = null;

var last_state = null;
var activefwfile = null;
var key_state = null;
var mTimeoutMax = 90000;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

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

const MAX_SYS_RETRY = 3;
rf_get_system_sn.retry = 0;
function rf_get_system_sn()
{
    jQuery.ajax({
        url: "/redfish/v1/Systems",
        type: 'GET',
        headers: {SID: top.topmenu.getSessionID()}
    })
    .fail(function() {
        if (rf_get_system_sn.retry < MAX_SYS_RETRY) {
            setTimeout(rf_get_system_sn, 3000);
        }
        rf_get_system_sn.retry++;
    })
    .done(function(data) {
        let members = data["Members"];
        let url = members[0]["@odata.id"];

        RF_SYSTEM_SN = url.split('/redfish/v1/Systems/')[1];
    })
    .always(function(){
    });
}

(function($) {
"use strict";
//console.log = function() {}
const ncsiToken = 'NCSI';
let ncsiListInfo = [];

$( document ).ready(function() { $.PageInit(); });
if (parent.lang) { lang = parent.lang; }

$.PageInit = function ()
{
    "use strict";
    ajaxsetup();
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/sys_nic_hlp.html";
    nic_list = document.getElementById("nic_list");
    nic_list_info = document.getElementById("nic_list_info");
    document.getElementById("submenu_legend_ncsi").textContent = lang.LANG_CONFIG_SUBMENU_NCSI_INFO;
    document.getElementById("submenu_legend_smbios").textContent = lang.LANG_CONFIG_SUBMENU_NIC_SMBIOS_INFO;
    document.getElementById("nic_caption_div").textContent = lang.LANG_SYS_NIC_CAPTION;
    document.getElementById("ncsi_rev_span").textContent  = lang.LANG_SYS_INFO_NCSI_REV;
    document.getElementById("ncsiSelectLabel").textContent = lang.LANG_CONFIG_NCSI_SELECT_INTERFACE;

    document.getElementById("ncsi_dev_type_span").textContent  = lang.LANG_SYS_NCSI_NIC_DEVTYPE;
    document.getElementById("ncsi_phy_addr_span").textContent = lang.LANG_SYS_NCSI_NIC_PHYADDR;
    document.getElementById("ncsi_name_span").textContent  = lang.LANG_SYS_NCSI_NIC_DEVNAME;
    document.getElementById("ncsi_fw_ver_span").textContent = lang.LANG_SYS_NCSI_NIC_DEVFWVER;
    document.getElementById("ncsi_pci_did_span").textContent  = lang.LANG_SYS_NIC_COLUMN_TITLE3;
    document.getElementById("ncsi_pci_vid_span").textContent = lang.LANG_SYS_NIC_COLUMN_TITLE2;
    document.getElementById("ncsi_pci_ssid_span").textContent  = lang.LANG_SYS_NCSI_NIC_PCISSID;
    document.getElementById("ncsi_pci_svid_span").textContent = lang.LANG_SYS_NCSI_NIC_PCISVID;
    document.getElementById("ncsi_manuf_id_span").textContent = lang.LANG_SYS_NCSI_NIC_ManufID;
    document.getElementById("ncsi_temperature_span").textContent = lang.LANG_SYS_NCSI_NIC_Temperature;
    initUsrTab();

    $("#ncsiSelector").change(function () {
        console.log(this.value);
        let id = this.value;
        let find = ncsiListInfo.filter(function(item,index,array){
                       return item.Id == id;
                   });
        console.log(find);
        refresh_NCSI_info(find[0]);
    });

    rf_get_system_sn();

    CheckUserPrivilege(PrivilegeCallBack);
}

function initUsrTab()
{
    "use strict";
    var myColumns = [["PCI Class Code", "6%", "center"],
                     ["Slot Number", "8%", "center"],
                     ["VID", "10%", "center"],
                     ["DID", "10%", "center"],
                     ["Speed", "10%", "center"],
                     ["PortIdx", "10%", "center"],
                     ["MediaState", "10%", "center"],
                     ["MAC", "18%", "center"],
                     ["FWver", "18%", "left"]];
    myColumns[0][0] = lang.LANG_SYS_NIC_COLUMN_TITLE0;
    myColumns[1][0] = lang.LANG_SYS_NIC_COLUMN_TITLE1;
    myColumns[2][0] = lang.LANG_SYS_NIC_COLUMN_TITLE2;
    myColumns[3][0] = lang.LANG_SYS_NIC_COLUMN_TITLE3;
    myColumns[4][0] = lang.LANG_SYS_NIC_COLUMN_TITLE4;
    myColumns[5][0] = lang.LANG_SYS_NIC_COLUMN_TITLE5;
    myColumns[6][0] = lang.LANG_SYS_NIC_COLUMN_TITLE6;
    myColumns[7][0] = lang.LANG_SYS_NIC_COLUMN_TITLE7;
    myColumns[8][0] = lang.LANG_SYS_NIC_COLUMN_TITLE8;
    dataTabObj = GetTableElement();
    dataTabObj.setColumns(myColumns);
    dataTabObj.init('dataTabObj', nic_list);
}

function PrivilegeCallBack(privilege)
{
    "use strict";
        if (privilege == '04'||
            privilege == '03'||
            privilege == '02')
        {
            getNICInfo();
            getncsi_version();
        } else {
            location.href = SubMainPage;
            return;
        }
}

function getNICInfo()
{
    "use strict";
    Loading(true);
    var url = '/cgi/getnicinfo.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data = GeneGenericRequestXML();
    var myAjax = new Ajax.Request(url,
                     { method: 'post',
                       contentType: 'text/xml',
                       xml_data: ajax_data,
                       parameters:pars,
                       timeout: g_CGIRequestTimeout,
                       ontimeout: onCGIRequestTimeout,
                       onComplete: NIC_info
                     });
}

function NIC_info(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        let response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        let xmldoc = GetResponseXML(response);

        if (xmldoc == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        let NICInfo = xmldoc.getElementsByTagName("NIC_INFO");
        let NIC = NICInfo[0].getElementsByTagName('NIC');
        let NIC_COUNT = NIC.length;
        let nic_info = [];
        var i;

        for(i = 0; i < NIC_COUNT; i++) {
            nic_info.push([i+1,
                NIC[i].getAttribute("PCIClassCode"),
                NIC[i].getAttribute("SlotNumber"),
                NIC[i].getAttribute("VID"),
                NIC[i].getAttribute("DID"),
                NIC[i].getAttribute("CurSpeed"),
                NIC[i].getAttribute("PORTIDX"),
                NIC[i].hasAttribute("MediaState") ? NIC[i].getAttribute("MediaState") : "N/A",
                NIC[i].getAttribute("MAC"),
                NIC[i].getAttribute("FWVer")]);
        }
        dataTabObj.show(nic_info);
        nic_list_info.textContent = lang.LANG_SYS_ASSET_NIC_CNT + NIC_COUNT + lang.LANG_COMMON_SPACE;
    }
}

const MAX_RETRY = 3;
getncsi_version.retry = 0;
function getncsi_version() {
    $.ajax({
        url: '/redfish/v1/UpdateService/SoftwareInventory',
        type: 'GET',
        processData: false
    })
    .fail(function() {
        if (getncsi_version.retry < MAX_RETRY) {
            setTimeout(getncsi_version, 20000);
        }
        getncsi_version.retry++;
    })
    .done(function(data) {
        console.log(data);

        let tmpURITokens;
        let odataid;
        let tmp = [];
        if (data.hasOwnProperty('Members')) {
            let members = data.Members;
            for (let i = 0; i < members.length; i++) {
                odataid = members[i];
                if (odataid.hasOwnProperty('@odata.id')) {
                    tmpURITokens = odataid['@odata.id'].split("/");
                    console.log(tmpURITokens[tmpURITokens.length - 1]);
                    if (tmpURITokens.length > 1 && tmpURITokens[tmpURITokens.length - 1].includes(ncsiToken)) {
                        let tailToken = tmpURITokens[tmpURITokens.length - 1];
                        let obj = {};
                        obj.odataid = odataid['@odata.id'];
                        obj.Id = tailToken;
                        tmp.push(obj);
                        console.log('tmp', tmp);
                    } else {
                        continue;
                    }
                }
            }
        }
        if (tmp.length > 0) {
            getncsi_version2(tmp);
        } else {
            console.log('no ncsi find under /redfish/v1/UpdateService/SoftwareInventory/');
            // alert(lang.LANG_CONFIG_NCSI_NOT_FOUND);
            $('#curNCSIVer').text("N/A");
        }
    }).always(function(jqXHR) {
    });
}

function getncsi_version2(tmp) {
    let promises = [];
    let tmparray = [];
    $.each(tmp, function(i, value) {
        let obj = {};
        let ncsi_id;
        $.ajax({
            url: value.odataid,
            type: 'GET',
            processData: false
        })
        .done(function(json) {
            obj.Id = value.Id;
            obj.odataid = value.odataid;
            obj.Version = json.Version;
            obj.Updateable = json.Updateable;
            ncsi_id = value.Id.replace(ncsiToken, "");

            let promiseNCSI = $.get('/redfish/v1/Systems/' + RF_SYSTEM_SN + '/Oem/Ncsi/' + ncsi_id).done(function(ncsiInfo){
                try {
                    obj.Id = value.Id;
                    obj.NCSIDevType = ncsiInfo.DeviceType;
                    obj.NCSIPhyAddr = ncsiInfo.PhysicalAddress;
                    obj.NCSIName = ncsiInfo.VersionID.FirmwareName;
                    obj.NCSIFwVer = ncsiInfo.VersionID.FirmwareVersion;
                    obj.NCSIPciDid = ncsiInfo.VersionID.PCIDID;
                    obj.NCSIPciVid = ncsiInfo.VersionID.PCIVID;
                    obj.NCSIPciSsid = ncsiInfo.VersionID.PCISSID;
                    obj.NCSIPciSvid = ncsiInfo.VersionID.PCISVID;
                    obj.NCSIManufId = ncsiInfo.VersionID.ManufacturerID;
                    obj.NCSIPhyAddr = ncsiInfo.PhysicalAddress;
                    obj.NCSITemperature = ncsiInfo.Temperature;
                    var id = ncsiListInfo.push(obj);
                    let o;
                    o = new Option(ncsiListInfo[id-1].Id, ncsiListInfo[id-1].Id);
                    $("#ncsiSelector").append(o);
                    if(id == 1) {
                        refresh_NCSI_info(ncsiListInfo[0]);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            ).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            });
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        });
    });
}

function refresh_NCSI_info(ncsiInfo) {
    $('#curNCSIDevType').text(ncsiInfo.NCSIDevType);
    $('#curNCSIPhyAddr').text(ncsiInfo.NCSIPhyAddr);
    $('#curNCSIName').text(ncsiInfo.NCSIName);
    $('#curNCSIFwVer').text(ncsiInfo.NCSIFwVer);
    $('#curNCSIPciDid').text(ncsiInfo.NCSIPciDid);
    $('#curNCSIPciVid').text(ncsiInfo.NCSIPciVid);
    $('#curNCSIPciSsid').text(ncsiInfo.NCSIPciSsid);
    $('#curNCSIPciSvid').text(ncsiInfo.NCSIPciSvid);
    $('#curNCSIManufId').text(ncsiInfo.NCSIManufId);
    $('#curNCSIVer').text(ncsiInfo.Version);
    $('#curNCSITemperature').text(ncsiInfo.NCSITemperature);
}
})(jQuery);