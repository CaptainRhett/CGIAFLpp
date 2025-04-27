"use strict";
var lang;
var arygroupname = new Array();
var arygroupdomain = new Array();
var aryGroupAccess = new Array();
var GridTable;
var modAdPage = "../cgi/url_redirect.cgi?url_name=config_ad_modgroup";
var addAdPage = "../cgi/url_redirect.cgi?url_name=config_ad_addgroup";
var cfgAdPage = "../cgi/url_redirect.cgi?url_name=config_ad";

var ButtonAddGroupObj;
var ButtonModGroupObj;
var ButtonDelGroupObj;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_ad_hlp.html";
    ButtonAddGroupObj = document.getElementById("addGroupBtn");
    ButtonModGroupObj = document.getElementById("modGroupBtn");
    ButtonDelGroupObj = document.getElementById("delGroupBtn");

    // Get multi-language string
    document.title = lang.LANG_AD_TITLE;
    document.getElementById("div_caption").textContent = lang.LANG_AD_CAPTION;

    document.title = lang.LANG_AD_ADV_TITLE;
    document.getElementById("saveBtn").value = lang.LANG_AD_ADV_SAVE;

    document.getElementById("adadv_enable").textContent = lang.LANG_AD_ADV_ENABLE
    document.getElementById("ad_auth_ssl").textContent = lang.LANG_AD_ADV_SSL;

    document.getElementById("enableAD").addEventListener("click", checkAd);

    var obj = document.getElementById("enableSSL");
    obj.addEventListener("click", checkSSL);

    document.getElementById("lanb_adv_port").textContent = lang.LANB_AD_ADV_PORT;
    document.getElementById("userdomain").textContent = lang.LANG_AD_ADV_USERDOMAIN;
    document.getElementById("sp_timeout").textContent = lang.LANG_AD_ADV_TIMEOUT;
    document.getElementById("advsrv1").textContent = lang.LANG_AD_ADV_SRV1;
    document.getElementById("advsrv2").textContent = lang.LANG_AD_ADV_SRV2;
    document.getElementById("advsrv3").textContent = lang.LANG_AD_ADV_SRV3;

    document.getElementById("saveBtn").addEventListener("click", saveAdConfig);
    document.getElementById("addGroupBtn").addEventListener("click", addAdGroup);
    document.getElementById("modGroupBtn").addEventListener("click", modAdGroup);
    document.getElementById("delGroupBtn").addEventListener("click", delAdGroup);

    ButtonAddGroupObj.value = lang.LANG_AD_ADD;
    ButtonModGroupObj.value = lang.LANG_AD_MOD;
    ButtonDelGroupObj.value = lang.LANG_AD_DEL;
    CheckUserPrivilege(PrivilegeCallBack);
}

function SwlCallBack(swl_type, swl_status)
{
    "use strict";
    if (swl_type == "SWLIC") {
        if (swl_status == "ACTIVED") {
            //full access
            flashGroupList();
        } else {
            ButtonAddGroupObj.disabled = true;
            ButtonModGroupObj.disabled = true;
            ButtonDelGroupObj.disabled = true;
            document.getElementById("saveBtn").disabled = true;
            document.getElementById("enableAD").disabled = true;
            var del_user='undefined';
            document.getElementById("enableSSL").disabled = true;
            document.getElementById("ad_port").disabled = true;
            document.getElementById("userDomain").disabled = true;
            document.getElementById("timeout").disabled = true;
            document.getElementById("adServer1").disabled = true;
            document.getElementById("adServer2").disabled = true;
            document.getElementById("adServer3").disabled = true;
            alert(lang.LANG_SYS_INFO_SOFT_LICENSE_INACTIVATED);
        }
    } else {
        //full access
        flashGroupList();
    }
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if(privilege == '04')
    {
        getSwlStatus(SwlCallBack);
    }
    else if(privilege == '03' || privilege == '02')
    {
        getSwlStatus(SwlCallBack);
        //read only
        ButtonAddGroupObj.disabled = true;
        ButtonModGroupObj.disabled = true;
        ButtonDelGroupObj.disabled = true;
        document.getElementById("saveBtn").disabled = true;
        //alert(lang.LANG_COMMON_CANNOT_MODIFY);
    }
    else
    {
        //no access
        location.href = SubMainPage;
        return;
    }
}

function initAdGroupList()
{
    "use strict";
    var TableTitleColumns = [
        ["Role Group ID", "15%", "center"],
        ["Group Name", "20%", "center"],
        ["Group Domain","35%","center"],
        ["Network Privilege", "30%", "center"]
    ];
        //replace table header content with string table
        TableTitleColumns[0][0] = lang.LANG_AD_COLUMN_TITLE0;
        TableTitleColumns[1][0] = lang.LANG_AD_COLUMN_TITLE1;
        TableTitleColumns[2][0] = lang.LANG_AD_COLUMN_TITLE2;
        TableTitleColumns[3][0] = lang.LANG_AD_COLUMN_TITLE3;
        var AdGroupListTable = document.getElementById("adGroupListTbl");
        removeChilds(AdGroupListTable);//clear list content.
        SetRowSelectEnable(1);
        GridTable = GetTableElement();
        GridTable.setColumns(TableTitleColumns);
        GridTable.init('GridTable', AdGroupListTable, "115px");
}

function InterpretPrivileges(privbyte)
{
    "use strict";
    return lang["LANG_USER_PRIVILEG_" + IntegerToHexString(privbyte)];
}

function geneRequestXML() {
    "use strict";
    let result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "</IPMI>\n";
    return result;
}

function getAdGroupList()
{
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/netadrolecfg.cgi';
    var ajax_param = '';
    var ajax_data = geneRequestXML();
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'POST',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                onComplete: getAdGroupListHandler }
            );
}

function responseDelGroupHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0)
            return;

        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if(result == "OK") {
            flashGroupList();
        }
    }
}

function flashGroupList() {
    "use strict";
    initAdGroupList();
    getAdGroupList();
    getAdConfig();
}

function getAdGroupListHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response:" + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0)
            return;

        var IPMIRoot = xmldoc.documentElement;
        var config_group = IPMIRoot.getElementsByTagName("AD_GROUP_EN_NUM");
        var config_group_num = parseInt(config_group[0].getAttribute("TOTLE_NUM"),10);
        var config_group_en_num = parseInt(config_group[0].getAttribute("EN_NUM"),10);
        var group_info = IPMIRoot.getElementsByTagName("AD_GROUP");

        for(var i = 0; i < config_group_num; i++)
        {
            if(group_info[i].getAttribute("NAME") == "" )
                arygroupname[i] = "<NULL>" ;
            else
                arygroupname[i] = group_info[i].getAttribute("NAME");

            if(group_info[i].getAttribute("DN") == "" )
                arygroupdomain[i] = "<NULL>" ;
            else
                arygroupdomain[i] = group_info[i].getAttribute("DN");
            aryGroupAccess[i] = parseInt(group_info[i].getAttribute("PRIVILEGE"), 10);
        }

        var group_count = 0;
        var myData = [];
        var group_name;
        var group_domain;
        var strPrivilege;

        for (var i = 0; i < config_group_num; i++)
        {
            group_name = (arygroupname[i] == "<NULL>")?"~":arygroupname[i];
            group_domain = (arygroupdomain[i] == "<NULL>")?"~":arygroupdomain[i];
            if(group_name != '~') group_count++;
            strPrivilege = InterpretPrivileges(aryGroupAccess[i]);
            if(strPrivilege == null) {
                strPrivilege = "";
            }
            myData.push([i+1,
                    i+1,
                    group_name,
                    group_domain,
                    strPrivilege]
                    );
            //console.log("idx:" + i + " prev:" + strPrivilege + " access:" + aryGroupAccess[i]);
        }

        GridTable.show(myData);
        document.getElementById("adGroupListInfo").textContent = lang.LANG_AD_GROUP_COUNT + group_count + lang.LANG_COMMON_SPACE;
    }
}

function addAdGroup()
{
    "use strict";
    if(GetSelectedRow() == null){
        alert(lang.LANG_AD_SEL_EMPTY);
    }
    else {
        var idx = parseInt(GetSelectedRowCellInnerHTML(0));
        var name = GetSelectedRowCellInnerHTML(1);
        if(name == '~')
            name = '';
        var domain = GetSelectedRowCellInnerHTML(2);
        if(domain == '~')
            domain = '';
        var nwpriv = GetSubString(aryGroupAccess[idx-1],3,0);
        var serial_priv = GetSubString(aryGroupAccess[idx-1],3,0);
        var parameter;

        if (arygroupname[idx-1] != "<NULL>") {
            UtilsConfirm(lang.LANG_AD_ADD_CONFIRM, {
                onOk: function() {
                    "use strict";
                    nwpriv = GetSubString(aryGroupAccess[idx-1],3,0);
                    serial_priv = GetSubString(aryGroupAccess[idx-1],3,0);
                    parameter = "&groupindex=" + idx +"&name=" + name +
                        "&domain=" + domain + "&nwpriv=" + nwpriv +
                        "&serialpriv=" + serial_priv;
                    location.href = modAdPage + parameter;
                }
            });
        } else {
            parameter = "&groupindex=" + idx;
            location.href = addAdPage + parameter;
        }
    }

}

function modAdGroup()
{
    "use strict";
    if(GetSelectedRow() == null){
        alert(lang.LANG_AD_SEL_GROUP);
        return;
    } else {
        var idx = parseInt(GetSelectedRowCellInnerHTML(0));
        var name = GetSelectedRowCellInnerHTML(1);
        if(name == '~')
            name = '';
        var domain = GetSelectedRowCellInnerHTML(2);
        if(domain == '~')
            domain = '';

        var nwpriv = GetSubString(aryGroupAccess[idx-1],3,0);
        var serial_priv = GetSubString(aryGroupAccess[idx-1],3,0);
        var parameter;

        if (arygroupname[idx-1] == "<NULL>") {
            UtilsConfirm(lang.LANG_COMMON_ADD_GROUP, {
                onOk: function() {
                    "use strict";
                    parameter = "&groupindex=" + idx;
                    location.href = addAdPage + parameter;
                }
            });
        } else {
            parameter = "&groupindex=" + idx +"&name=" + name + "&domain=" +
                domain + "&nwpriv=" + nwpriv +
                "&serialpriv=" + serial_priv;
            location.href = modAdPage + parameter;
        }
    }
}

function geneDelAdGroupXML(id, name) {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <AD_GROUP_EN_NUM TOTLE_NUM=\"1\" />\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    if(id != null) {
        result += "    <AD_GROUP ID=\"" + id + "\" NAME=\"" + name + "\" DN=\"\" PRIVILEGE=\"\"/>\n";
    }
    result += "</IPMI>\n";
    return result;
}

function delAdGroup()
{
    "use strict";
    if(GetSelectedRow() == null){
        alert(lang.LANG_AD_DEL_PROMPT);
    } else {
        var idx = parseInt(GetSelectedRowCellInnerHTML(0));
        var name = GetSelectedRowCellInnerHTML(1);
        //console.log("delAdGroup(): " + idx + " arygroupname siez:" + arygroupname.length + " selected name:" + arygroupname[idx-1]);
        if (arygroupname[idx-1] == "<NULL>") {
            alert(lang.LANG_AD_DEL_EMPTY);
        } else {
            UtilsConfirm(lang.LANG_AD_DEL_CONFIRM, {
                onOk: function() {
                    "use strict";
                    Loading(true);
                    var ajax_url = '../cgi/netadrolecfg.cgi';
                    var ajax_param = '';
                    var ajax_data = geneDelAdGroupXML(parseInt(idx), arygroupname[idx-1]);
                    var ajax_req = new Ajax.Request(ajax_url,
                            { method: 'DELETE',
                                contentType: "text/xml",
                                xml_data: ajax_data,
                                parameters: ajax_param,
                                onComplete: responseDelGroupHandler }
                            );
                }
            });
        }
    }
}
