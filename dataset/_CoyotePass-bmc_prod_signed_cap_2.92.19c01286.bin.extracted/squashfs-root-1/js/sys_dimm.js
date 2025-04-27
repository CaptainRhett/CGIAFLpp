"use strict";
/* SYSTEM -- DIMM Information page */

var lang;
var dataTabObj;
var dimm_list;
var dimm_list_info;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/sys_dimm_hlp.html";
    dimm_list = document.getElementById("dimm_list");
    dimm_list_info = document.getElementById("dimm_list_info");
    document.getElementById("dimm_caption_div").textContent = lang.LANG_SYS_DIMM_CAPTION;
    initUsrTab();

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}
function initUsrTab()
{
    "use strict";
    var myColumns = [
                        ["Slot Number", "10%", "center"],
                        ["Size", "10%", "center"],
                        ["Type", "10%", "center"],
                        ["Speed", "10%", "center"],
                        ["Manufacturer", "10%", "center"],
                        ["Asset Tag", "10%", "center"],
                        ["Serial Number", "20%", "center"],
                        ["Part Number", "20%", "left"]
                ];
        //replace table header content with string table
        myColumns[0][0] = lang.LANG_SYS_DIMM_COLUMN_TITLE0;
        myColumns[1][0] = lang.LANG_SYS_DIMM_COLUMN_TITLE1;
        myColumns[2][0] = lang.LANG_SYS_DIMM_COLUMN_TITLE2;
        myColumns[3][0] = lang.LANG_SYS_DIMM_COLUMN_TITLE3;
        myColumns[4][0] = lang.LANG_SYS_DIMM_COLUMN_TITLE4;
        myColumns[5][0] = lang.LANG_SYS_DIMM_COLUMN_TITLE5;
        myColumns[6][0] = lang.LANG_SYS_DIMM_COLUMN_TITLE6;
        myColumns[7][0] = lang.LANG_SYS_DIMM_COLUMN_TITLE7;
        dataTabObj = GetTableElement();
        dataTabObj.setColumns(myColumns);

        dataTabObj.init('dataTabObj',dimm_list);
}
function PrivilegeCallBack(privilege)
{
    "use strict";
        if (privilege == '04'|| privilege == '03'|| privilege == '02'){
            getDIMMInfo();
        }
        else{
            location.href = SubMainPage;
            return;
        }
}

function getDIMMInfo()
{
    "use strict";
    Loading(true);
    var url = '/cgi/getdimminfo.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data= GeneGenericRequestXML();
    var myAjax = new Ajax.Request(url,
                                  { method: 'post',
                                    contentType: 'text/xml',
                                    xml_data: ajax_data,
                                    parameters:pars,
                                    timeout: g_CGIRequestTimeout,
                                    ontimeout: onCGIRequestTimeout,
                                    onComplete: ReplyDIMMStatus}//reigister callback function
                                 );
}

function ReplyDIMMStatus(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null){
            SessionTimeout();
                return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var root=xmldoc.documentElement;
        var DIMMInfo= root.getElementsByTagName("DIMM_INFO");
        var DIMM= DIMMInfo[0].getElementsByTagName('DIMM');
        var DIMM_COUNT= DIMM.length;
        var myData = [];
        var i;
        for (i = 0; i < DIMM_COUNT;i++) {
            myData.push([i+1,
                atob(DIMM[i].getAttribute("SlotNumber")),
                atob(DIMM[i].getAttribute("Size")),
                atob(DIMM[i].getAttribute("Type")),
                atob(DIMM[i].getAttribute("Speed")),
                atob(DIMM[i].getAttribute("Manufacturer")),
                atob(DIMM[i].getAttribute("AssetTag")),
                atob(DIMM[i].getAttribute("SerialNumber")),
                atob(DIMM[i].getAttribute("PartNumber"))]);
        }
        dataTabObj.show(myData);
        dimm_list_info.textContent = lang.LANG_SYS_ASSET_DIMM_CNT + DIMM_COUNT + lang.LANG_COMMON_SPACE;
    }
}
