"use strict";

var lang;
var dataTabObj;
var stor_list;
var stor_list_info;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/sys_stor_hlp.html";
    stor_list = document.getElementById("stor_list");
    stor_list_info = document.getElementById("stor_list_info");
    document.getElementById("stor_caption_div").textContent = lang.LANG_SYS_STOR_CAPTION;
    initUsrTab();
    CheckUserPrivilege(PrivilegeCallBack);
}
function initUsrTab()
{
    "use strict";
    var myColumns = [
            ["Port Destination", "9%", "center"],
            ["Device Index", "5%", "center"],
            ["Type", "15%", "center"],
            ["Protocol", "10%", "center"],
            ["Type", "10%", "center"],
            ["Capacity", "7%", "center"],
            ["RPM", "5%", "center"],
            ["Model", "9%", "center"],
            ["Serial", "9%", "center"],
            ["PCI Class Code", "5%", "center"],
            ["VID", "5%", "center"],
            ["DID", "5%", "center"],
            ["FWVer", "8%", "left"]
        ];
        myColumns[0][0] = lang.LANG_SYS_STOR_COLUMN_TITLE0;
        myColumns[1][0] = lang.LANG_SYS_STOR_COLUMN_TITLE1;
        myColumns[2][0] = lang.LANG_SYS_STOR_COLUMN_TITLE2;
        myColumns[3][0] = lang.LANG_SYS_STOR_COLUMN_TITLE3;
        myColumns[4][0] = lang.LANG_SYS_STOR_COLUMN_TITLE4;
        myColumns[5][0] = lang.LANG_SYS_STOR_COLUMN_TITLE5;
        myColumns[6][0] = lang.LANG_SYS_STOR_COLUMN_TITLE6;
        myColumns[7][0] = lang.LANG_SYS_STOR_COLUMN_TITLE7;
        myColumns[8][0] = lang.LANG_SYS_STOR_COLUMN_TITLE8;
        myColumns[9][0] = lang.LANG_SYS_STOR_COLUMN_TITLE9;
        myColumns[10][0] = lang.LANG_SYS_STOR_COLUMN_TITLE10;
        myColumns[11][0] = lang.LANG_SYS_STOR_COLUMN_TITLE11;
        myColumns[12][0] = lang.LANG_SYS_STOR_COLUMN_TITLE12;

        dataTabObj = GetTableElement();
        dataTabObj.setColumns(myColumns);

        dataTabObj.init('dataTabObj', stor_list, '695px');
}
function PrivilegeCallBack(privilege)
{
    "use strict";
        if (privilege == '04'|| privilege == '03'|| privilege == '02'){
            getstorInfo();
        }
        else{
            location.href = SubMainPage;
            return;
        }
}

function getstorInfo()
{
    "use strict";
    Loading(true);
    var url = '/cgi/getstorageinfo.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data= GeneGenericRequestXML();
    var myAjax = new Ajax.Request(url,
                     { method: 'post',
                       contentType: 'text/xml',
                       xml_data: ajax_data,
                       parameters: pars,
                       timeout: g_CGIRequestTimeout,
                       ontimeout: onCGIRequestTimeout,
                       onComplete: STOR_Info
                     });
}

function STOR_Info(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        let response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        let xmldoc = GetResponseXML(response);

        if (xmldoc == null){
            SessionTimeout();
            return;
        }
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        let StorInfo = xmldoc.getElementsByTagName("STORAGE_INFO");
        let STOR = StorInfo[0].getElementsByTagName('STOR');
        let STOR_COUNT = STOR.length;
        let stor_info = [];
        let i;
        for(i = 0; i < STOR_COUNT; i++) {
            stor_info.push([i+1,
                STOR[i].getAttribute("PortDesign"),
                STOR[i].getAttribute("DevIdx"),
                STOR[i].getAttribute("ConType"),
                STOR[i].getAttribute("DevProtocol"),
                STOR[i].getAttribute("DevType"),
                STOR[i].getAttribute("DevCap"),
                STOR[i].getAttribute("RPM"),
                STOR[i].getAttribute("DevModel"),
                STOR[i].getAttribute("DevSerial"),
                STOR[i].getAttribute("PCIClassCode"),
                STOR[i].getAttribute("VID"),
                STOR[i].getAttribute("DID"),
                STOR[i].getAttribute("FWVer")]);
        }
        dataTabObj.show(stor_info);
        stor_list_info.textContent = lang.LANG_SYS_ASSET_STOR_CNT + STOR_COUNT + lang.LANG_COMMON_SPACE;
    }
}
