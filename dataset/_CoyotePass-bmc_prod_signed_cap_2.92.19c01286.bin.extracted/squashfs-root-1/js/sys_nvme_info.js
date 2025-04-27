"use strict";
/******************************************************************************
*
*                   INTEL CORPORATION PROPRIETARY INFORMATION
*       This software is supplied under the terms of a license agreement or
*       nondisclosure agreement with Intel Corporation and may not be copied
*       or disclosed except in accordance with the terms of that agreement.
*         Copyright (c) 2016-2023 Intel Corporation. All Rights Reserved.
*
*     Abstract:  sys_nvme_info.js
*
* Framework based on content by Insyde Software Corporation.
*
******************************************************************************/

var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit(){
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/sys_nvme_hlp.html";

    var nvme_title_div = document.getElementById("nvme_title_div");
    nvme_title_div.textContent = lang.LANG_NVME_TITLE;

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if (privilege == '02' || privilege == '03' || privilege == '04')
    {
        getNVMeStats();
    }
    else{
        location.href = SubMainPage;
        return;
    }
}

function getNVMeStats() {
    "use strict";
    Loading(true);
    var url = '/cgi/getNVMeInfo.cgi';
    var pars = 'timestamp='+(new Date());
    var ajax_data = "";
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <INDEX>0</INDEX>\n";
    ajax_data += "</IPMI>\n";
    var myAjax = new Ajax.Request(
        url,
        { method: 'post',
          contentType: 'text/xml',
          xml_data: ajax_data,
          parameters: pars,
          timeout: g_CGIRequestTimeout,
          ontimeout: onCGIRequestTimeout,
          onComplete: recNVMeStats
        });
}

function recNVMeStats(originalRequest) {
    "use strict";
    var rootNVMeInfo;
    var NVME_INFO;
    var NVME;
    var NVMeCount;

    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);

        if(xmldoc == null){
            document.getElementById("NVMe_InfoBox_0").textContent= lang.LANG_SYS_NVME_CALLFAIL_REASON;
            SessionTimeout();
            return;
        }

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        rootNVMeInfo = xmldoc.documentElement;
        NVME_INFO = rootNVMeInfo.getElementsByTagName('NVME_INFO');
        NVME = NVME_INFO[0].getElementsByTagName('NVMe');
        NVMeCount = NVME.length;

        if (NVMeCount > 0) {
            DisplayNVMeStats(xmldoc);
        } else {
            document.getElementById("NVMe_InfoBox_0").textContent= lang.LANG_SYS_NVME_CALLFAIL_REASON;
        }
    }
}

function DisplayNVMeStats(xmldoc) {
    "use strict";
    var rootNVMeInfo;
    var NVME_INFO;
    var NVME;
    var NVMeCount;
    var lv;
    var pcieGen = "PCIe Gen ";
    var pcieLanes = " SERDES Lanes";

    rootNVMeInfo = xmldoc.documentElement;
    NVME_INFO = rootNVMeInfo.getElementsByTagName('NVME_INFO');
    NVME = NVME_INFO[0].getElementsByTagName('NVMe');
    NVMeCount = NVME.length;

    for (lv = 0; lv < NVMeCount; lv++) {
        document.getElementById("NVMe_InfoBox_" + lv).innerHTML =
            "<div align=\"left\" id=\"NVMe_" + lv + "\">" +
            "<fieldset class=\"nvme_info group\">" +
            "<legend class=\"legendcaption\">" +
            lang.LANG_SYSTEM_NVME_INFO_TITLE + "</legend>" +

        "<table>" +
            "<tr>" +
            // HSBP Designation
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" +
            lang.LANG_SYS_HSBP_DESIGNATION + "</label></td>" +
            "<td><span id=\"hsbpNum_" + lv + "\"" +
            " class=\"labeltext\"></span>" + "</td>" +
            // Slot Designation
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_HSBP_SLOT +
            "</label></td>" +
            "<td><span id=\"slotNum_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        // SSD MFR/Model
        "<tr>" +
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_MODEL +
            "</label></td>" +
            "<td><span id=\"vendorID_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "&nbsp;" +
            "<span id=\"model_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            // SSD Serial Number
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_SERIALNUM +
            "</label></td>" +
            "<td><span id=\"serialNum_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        // PCIe Link 0 Speed
        "<tr>" +
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" +
            lang.LANG_SYS_NVME_PCIE0_SPEED +
            "</label></td>" +
            "<td><span id=\"pcie0Speed_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            // PCIe Link 0 Lane Width
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" +
            lang.LANG_SYS_NVME_PCIE0_WIDTH +
            "</label></td>" +
            "<td><span id=\"pcie0Width_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        // PCIe Link 1 Speed
        "<tr>" +
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" +
            lang.LANG_SYS_NVME_PCIE1_SPEED +
            "</label></td>" +
            "<td><span id=\"pcie1Speed_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            // PCIe Link 1 Lane Width
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" +
            lang.LANG_SYS_NVME_PCIE1_WIDTH +
            "</label></td>" +
            "<td><span id=\"pcie1Width_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        // NVMe Powered
        "<tr>" +
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_POWERED +
            "</label></td>" +
            "<td><span id=\"powered_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +

        // Functional
        "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_FUNCTIONAL +
            "</label></td>" +
            "<td><span id=\"functional_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        // Reset Rqd
        "<tr>" +
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_RESET_RQD +
            "</label></td>" +
            "<td><span id=\"resetRqd_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +

        // PCIe Link Active
        "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" +
            lang.LANG_SYS_NVME_LINK_ACTIVE +
            "</label></td>" +
            "<td><span id=\"linkActv_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        // NVMe Base Class/Sub class
        "<tr><td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_BASECLASS +
            "</label></td>" +
            "<td><span id=\"baseClass_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            // NVMe Sub Class
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_SUBCLASS +
            "</label></td>" +
            "<td><span id=\"subClass_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        // NVMe Programming Intfc
        "<tr><td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_PROGINTFC +
            "</label></td>" +
            "<td><span id=\"progIntfc_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            // Percent Life Consumed
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" +
            lang.LANG_SYS_NVME_PERCENT_LIFE +
            "</label></td>" +
            "<td><span id=\"percentLife_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        // Drive FW and Bootloader FW Version strings
        "<tr>" +
            // Drive FW Version
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_FWVER +
            "</label></td>" +
            "</td>" +
            "<td><span id=\"fwVer_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            // Bootloader version
            "<td align=\"left\" class=\"bold\">" +
            "<label class=\"labeltitle\">" + lang.LANG_SYS_NVME_BLDRVER +
            "</label></td>" +
            "<td><span id=\"bldrVer_" + lv + "\"" +
            " class=\"labeltext\"></span>" +
            "</td>" +
            "</tr>" +

        "</table>" +
        "</fieldset>" +
        "</div>";
    }

    for (lv = 0; lv < NVMeCount; lv++)
    {
        document.getElementById("hsbpNum_" + lv).textContent = Number(NVME[lv].getAttribute("BackplaneNumber")) + 1;
        document.getElementById("slotNum_" + lv).textContent = NVME[lv].getAttribute("DriveSlot");
        document.getElementById("model_" + lv).textContent = NVME[lv].getAttribute("DriveModelNumber");
        document.getElementById("bldrVer_" + lv).textContent = NVME[lv].getAttribute("BootloaderVersion");
        document.getElementById("fwVer_" + lv).textContent = NVME[lv].getAttribute("DriveFWVersion");
        document.getElementById("serialNum_" + lv).textContent = NVME[lv].getAttribute("DriveSerialNumber");
        document.getElementById("vendorID_" + lv).textContent = NVME[lv].getAttribute("VendorIDString");
        document.getElementById("pcie0Speed_" + lv).textContent = pcieGen.concat(NVME[lv].getAttribute("PCIeGen.Link0"));
        document.getElementById("pcie0Width_" + lv).textContent = NVME[lv].getAttribute("PCIeLaneWidth0").concat(pcieLanes);
        document.getElementById("pcie1Speed_" + lv).textContent = pcieGen.concat(NVME[lv].getAttribute("PCIeGen.Link1"));
        document.getElementById("pcie1Width_" + lv).textContent = NVME[lv].getAttribute("PCIeLaneWidth1").concat(pcieLanes);
        document.getElementById("powered_" + lv).textContent =
            NVME[lv].getAttribute("DrivePower") == 1 ? "On" : "Off";
        document.getElementById("functional_" + lv).textContent =
            NVME[lv].getAttribute("DriveFunctional") == 1 ? "Functional" : "Non-functional";
        document.getElementById("resetRqd_" + lv).textContent =
            NVME[lv].getAttribute("DriveReset") == 1 ? "Reset Required" : "No Reset Required";
        document.getElementById("linkActv_" + lv).textContent =
            NVME[lv].getAttribute("DrivePCIeActive") == 1 ? " PCIe Link OK" : "PCIe Link Failure";
        document.getElementById("percentLife_" + lv).textContent = NVME[lv].getAttribute("DrivePercentLifeConsumed") + " %";
        document.getElementById("baseClass_" + lv).textContent =
            NVME[lv].getAttribute("DeviceBaseClass") == 2 ? "Mass Storage Device" : "Unknown Base Class";
        document.getElementById("subClass_" + lv).textContent =
            NVME[lv].getAttribute("DeviceSubclass") == 8 ? "Non-volatile Memory Controller" : "Unknown Sub Class";
        document.getElementById("progIntfc_" + lv).textContent =
            NVME[lv].getAttribute("DeviceProgrammingInterface") == 1 ? "NVMe Programming Interface" : "Unknown Programming Interface";
    }
}
