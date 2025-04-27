"use strict";
/*
   global variables
*/
var lang;
var dataTabObj;
var aryusername = new Array();
var aryUserAccess = new Array();
var aryUserEnable = new Array();
var aryUserSNMPv3Access = new Array();
//var mainPage = "../cgi/url_redirect.cgi?url_name=configuration";
var usrPage = "../cgi/url_redirect.cgi?url_name=config_usr";
var usrAddPage = "../cgi/url_redirect.cgi?url_name=config_usr_add";
var usrModPage = "../cgi/url_redirect.cgi?url_name=config_usr_mod";
var g_actions_disabled_by_priv = false;
var add_user;
var modify_user;
var del_user;
var user_list;
var user_list_info;
var restrict_snmp;
var snmpSupport = true;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }
function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/config_usr_hlp.html";
    add_user = document.getElementById("btn_add");
    modify_user = document.getElementById("btn_modify");
    del_user = document.getElementById("btn_del");
    user_list = document.getElementById("div_user_list");
    user_list_info = document.getElementById("text_user_list_info");
    add_user.value = lang.LANG_CONFUSR_ADD;
    modify_user.value = lang.LANG_CONFUSR_MOD;
    del_user.value = lang.LANG_CONFUSR_DEL;
    document.getElementById("caption_div").textContent = lang.LANG_CONFUSER_CAPTION;
    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}

function initUsrTab()
{
    "use strict";
    var myColumns;
    if(snmpSupport){
        myColumns = [
            ["User ID", "15%", "center"],
            ["User Name", "25%", "center"],
            ["User Status", "20%", "center"],
            ["Network Privilege", "25%", "center"],
            ["SNMPv3 Access", "15%", "center"]
        ];
        //replace table header content with string table
        myColumns[0][0] = lang.LANG_CONFUSER_TITLE_USERID;
        myColumns[1][0] = lang.LANG_CONFUSER_TITLE_USERNAME;
        myColumns[2][0] = lang.LANG_CONFUSER_TITLE_USERSTATUS;
        myColumns[3][0] = lang.LANG_CONFUSER_TITLE_USERNETPRIV;
        myColumns[4][0] = lang.LANG_CONFUSER_TITLE_USERSNMPV3ACCESS;
    }else{
        myColumns = [
            ["User ID", "25%", "center"],
            ["User Name", "25%", "center"],
            ["User Status", "25%", "center"],
            ["Network Privilege", "25%", "center"]
        ];
        //replace table header content with string table
        myColumns[0][0] = lang.LANG_CONFUSER_TITLE_USERID;
        myColumns[1][0] = lang.LANG_CONFUSER_TITLE_USERNAME;
        myColumns[2][0] = lang.LANG_CONFUSER_TITLE_USERSTATUS;
        myColumns[3][0] = lang.LANG_CONFUSER_TITLE_USERNETPRIV;
    }
    SetRowSelectEnable(1);
    dataTabObj = GetTableElement();
    dataTabObj.setColumns(myColumns);

    dataTabObj.init('dataTabObj',user_list);
    user_list.onclick = onClickUserList;
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if(privilege == '04')
    {
        add_user.onclick = addUsr;
        modify_user.onclick = modifyUsr;
        del_user.onclick = delUsr;
        queryUserList(updateUserList);
        g_actions_disabled_by_priv = false;
    }
    else if(privilege == '03')
    {
        g_actions_disabled_by_priv = true;
        add_user.disabled = g_actions_disabled_by_priv;
        del_user.disabled = g_actions_disabled_by_priv;
        modify_user.disabled = g_actions_disabled_by_priv;
        queryUserList(updateUserList);
        //alert(lang.LANG_COMMON_CANNOT_MODIFY);
    }
    else
    {
        location.href = SubMainPage;
        return;
    }
}

function onClickUserList() {
    "use strict";
    if(GetSelectedRow() != null) {
        var sel_index = parseInt(GetSelectedRowCellInnerHTML(0));
        var currentUID = ReadSessionStorage("currentUID");
        var user_id = parseInt(sel_index);//currentUID was 1 based.
        if(user_id == currentUID || user_id == 1) {
            del_user.disabled = true;
        }
        else {
            del_user.disabled = g_actions_disabled_by_priv;
        }
        var username = aryusername[sel_index-1];
        if (CheckEmptyUserName(username) == false || sel_index == 1) {
            add_user.disabled = true;
        }
        else {
            add_user.disabled = g_actions_disabled_by_priv;
        }
    }
}

function addUsr()
{
    "use strict";
    if(GetSelectedRow() == null){
        alert(lang.LANG_CONFUSR_ERR1);
    }
    else {
        var sel_index = parseInt(GetSelectedRowCellInnerHTML(0));
        var sel_name = GetSelectedRowCellInnerHTML(1);
        if(sel_name == '~')
            sel_name = '';

        var sel_priv = GetSubString(aryUserAccess[sel_index-1],3,0);
        var username = aryusername[sel_index-1];
        if (CheckEmptyUserName(username) == false || sel_index == 1) {
            add_user.disabled = true;
        }
        else {
            add_user.disabled = g_actions_disabled_by_priv;
            var parameters = "&usr_id=" + sel_index + '&restrict=' + restrict_snmp;
            location.href= usrAddPage+parameters;
        }
    }
}

function checkUnconfiguredUserName(username) {
    "use strict";
    var result = false;
    if(username != null && username.length > 0) {
        if(username == "~") {
            result = true;
        }
    }
    return result;
}

function modifyUsr()
{
    "use strict";
    if(GetSelectedRow() == null){
        alert(lang.LANG_CONFUSR_ERR4);
    } else {
        var sel_index = parseInt(GetSelectedRowCellInnerHTML(0));
        var sel_name = GetSelectedRowCellInnerHTML(1);
        var parameters;
        if(sel_name == '~') {
            sel_name = '';
        }
        var sel_priv = GetSubString(aryUserAccess[sel_index-1],3,0);

        if (checkUnconfiguredUserName(aryusername[sel_index-1]) == false) {
            parameters = "&usr_id=" + sel_index + '&restrict=' + restrict_snmp;
            location.href= usrModPage + parameters;
        }
        else {
            UtilsConfirm(lang.LANG_COMMON_ADD_USER, {
                onOk: function() {
                    parameters = "&usr_id=" + sel_index + '&restrict=' + restrict_snmp;
                    location.href= usrAddPage + parameters;
                }
            });
        }
    }
}

function delUsr()
{
    "use strict";
    var UID = 0;
    if(GetSelectedRow() == null){
        alert(lang.LANG_CONFUSR_ERR5);
    }
    else {
        var delUID = parseInt(GetSelectedRowCellInnerHTML(0));
        var sel_index = parseInt(GetSelectedRowCellInnerHTML(0));
        if ( (sel_index == 1) ) {
            alert(lang.LANG_CONFUSR_ERR7);
        }
        else {
            var username = aryusername[sel_index-1];
            if (username == "~" || CheckEmptyUserName(username) == true) {
                alert(lang.LANG_CONFUSR_ERR7);
            }
            else {
                var currentUID = ReadSessionStorage("currentUID");
                var user_id = parseInt(sel_index);//currentUID was 1 based.
                if(user_id == currentUID) {
                    alert(lang.LANG_CONFUSR_ERR9);
                }
                else {
                    UtilsConfirm(lang.LANG_CONFUSR_ERR8, {
                        onOk: function() {
                            Loading(true);
                            var sel_index = parseInt(GetSelectedRowCellInnerHTML(0));
                            var sel_name = aryusername[sel_index-1];
                            requestDelUser(sel_index, sel_name, delUserIsDone);
                        }
                    });
                }
            }
        }
    }
}

function delUserIsDone(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if (xmldoc == null) {
            SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_CONFUSER_DEL_FAIL);
            return;
        }

        if (result == "OK") {
            alert(lang.LANG_COMMON_DEL_USER, {title: lang.LANG_GENERAL_SUCCESS,
                onClose: function() {location.href = usrPage;}});
        }
    }
}

function updateUserList(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("response showUsrInfoNew:\n" + response);
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var root = xmldoc.documentElement;
        var user = root.getElementsByTagName("USER");
        var total_node = root.getElementsByTagName("TOTAL_NUMBER")[0];
        var configed_users = 0;

        //if(total_node != null) {
        //    configed_users = total_node.getAttribute("CFG_USER");
        //}

        // snmp restrict mode
        if(snmpSupport){
            restrict_snmp = total_node.getAttribute("RESTRIC_MODE");
        }

        for(var i = 0; i < user.length; i++)
        {
            if(i == 0) {
                aryusername[i] = "anonymous";
                configed_users++;
            }
            else if(user[i].getAttribute("NAME") == 0) {
                aryusername[i] = "~";
            }
            else {
                aryusername[i] = user[i].getAttribute("NAME");
                configed_users++;
            }

            aryUserEnable[i] = user[i].getAttribute("STATUS");
            aryUserAccess[i] = user[i].getAttribute("USER_ACCESS");

            if(snmpSupport){
                if(user[i].getAttribute("SNMPV3") == "1"){
                    aryUserSNMPv3Access[i] = user[i].getAttribute("SNMPV3_ACCESS");
                }else{
                    aryUserSNMPv3Access[i] = "0";
                }
            }
        }
        var myData = [];
        var user_name;
        var user_enable;
        var user_access;
        var user_snmpv3_access;
        for (var i = 0; i < user.length; i++) {
            user_name = aryusername[i];
            if( user_name == "~") {
                user_enable = "~";
                user_access = "~";
                user_snmpv3_access = "~";
            }
            else {
                if(aryUserEnable[i] == "0") {
                    user_enable = lang.LANG_CONFUSER_STATUS_DISABLE;
                }
                else {
                    user_enable = lang.LANG_CONFUSER_STATUS_ENABLE;
                }

                user_access = GetPrivilegeStr(aryUserAccess[i]);

                user_snmpv3_access = (aryUserSNMPv3Access[i] == "1") ? lang.LANG_CONFUSER_STATUS_ENABLE : lang.LANG_CONFUSER_STATUS_DISABLE;
            }
            if(snmpSupport){
                myData.push([i + 1,
                    i + 1,
                    user_name,
                    user_enable,
                    user_access,
                    user_snmpv3_access
                ]);
            }else{
                myData.push([i + 1,
                    i + 1,
                    user_name,
                    user_enable,
                    user_access
                ]);
            }
        }

        initUsrTab();

        dataTabObj.show(myData);

        user_list_info.textContent = lang.LANG_CONFUSR_COUNT +
            configed_users +
            lang.LANG_COMMON_SPACE;
    }
}

function GetPrivilegeStr(priv)
{
    "use strict";
    return lang["LANG_USER_PRIVILEG_" + IntegerToHexString(priv)];
}

function geneXML(user_cnt, uid, name, privilege, status, password) {
    "use strict";
    //<?xml version="1.0"?>
    //<IPMI>
    //  <PRIV>xxx</PRIV>
    //  <TOTAL_NUMBER USER="4"/>
    //  <USER UID= "1" NAME="                " USER_ACCESS="04" STATUS="1" PWD=""/>
    //  <USER UID= "2" NAME="ADMIN           " USER_ACCESS="04" STATUS="1" PWD=""/>
    //  <USER UID= "3" NAME="test            " USER_ACCESS="04" STATUS="1" PWD=""/>
    //  <USER UID= "4" NAME="                " USER_ACCESS="00" STATUS="1" PWD=""/>
    //</IPMI>
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <TOTAL_NUMBER USER=\"" + user_cnt + "\"/>\n";
    if(uid != null) {
        result += "    <USER UID=\"" + uid + "\"  NAME=\"" + name + "\" USER_ACCESS=\"" + privilege + "\" STATUS=\"" + status + "\" PWD=\"" + password + "\"/>\n";
    }
    result += "</IPMI>\n";
    return result;
}
