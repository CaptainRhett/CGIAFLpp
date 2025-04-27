"use strict";
/*global variable*/

var lang;
var usrPage = "../cgi/url_redirect.cgi?url_name=config_usr";
var sysPasswordMode = "SIMPLE_MODE";

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

var add_btn;
var cancel_btn;
var usr_name;
var usr_pwd;
var usr_pwd_check;
var usr_priv;
var snmp_restrict = "0";
var snmpSupport = true;

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/config_usr_add_hlp.html";
    add_btn = document.getElementById("btn_add");
    cancel_btn = document.getElementById("btn_cancel");
    add_btn.value = lang.LANG_CONFUSER_ADD_ADD;
    cancel_btn.value = lang.LANG_CONFUSER_ADD_CANCEL;
    usr_name = document.getElementById("text_name");
    usr_pwd = document.getElementById("password_pwd");
    usr_pwd_check = document.getElementById("password_pwd_check");
    usr_priv = document.getElementById("select_priv");
    if(snmpSupport){
        snmp_restrict = GetVars("restrict");
        onEnableSNMPv3Service(false);
    }
    queryUserList(getUserList);
    OutputString();
    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_CONFUSER_ADD_CAPTION;
    document.getElementById("add_desc_div").textContent = lang.LANG_CONFUSER_ADD_DESC;
    document.getElementById("add_name_lbl").textContent = lang.LANG_CONFUSER_ADD_NAME;
    document.getElementById("add_pwd_lbl").textContent = lang.LANG_CONFUSER_ADD_PWD;
    document.getElementById("add_conf_pwd_lbl").textContent = lang.LANG_CONFUSER_ADD_CONF_PWD;
    document.getElementById("add_priv_lbl").textContent = lang.LANG_CONFUSER_ADD_PRIV;
    if(snmpSupport){
        document.getElementById("add_snmpv3_access_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_ACCESS;
        document.getElementById("add_snmpv3_access_level_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_ACCESS_LEVEL;
        document.getElementById("add_snmpv3_auth_proto_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_AUTH_PROTOCOL;
        document.getElementById("add_snmpv3_auth_passphrase_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_AUTH_PASSPHRASE;
        document.getElementById("add_snmpv3_priv_proto_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_PRIV_PROTOCOL;
        document.getElementById("add_snmpv3_priv_passphrase_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_PRIV_PASSPHRASE;
    }

    var select_priv_obj = document.getElementById("select_priv");
    if(select_priv_obj != null) {
        for(var priv_level = 4; priv_level >= 0; priv_level--) {
            // Ignore callback privilege due to security mechanism
            if (priv_level == 1)
                continue;

            var option = document.createElement("option");
            option.value = priv_level.toString();
            option.text = lang["LANG_USER_PRIVILEG_" + priv_level];
            if(priv_level == 0) {
                option.value = "15";
                option.text = lang.LANG_USER_PRIVILEG_F;
            }
            select_priv_obj.appendChild(option);
        }
    }

    if(snmpSupport){
        if(snmp_restrict == "1"){
            select_priv_obj.addEventListener("change", function(){
                privilegeLimitSet(this.value);
            });
        }

        document.getElementById("checkbox_snmpv3_access").addEventListener("click", function(){
            onEnableSNMPv3Service(this.checked);
        });

        addItemIntoSelection(document.getElementById("select_snmpv3_access_level"), [
            {text: lang.LANG_CONFUSER_SNMPV3_ACCESS_LEVEL_RO, value: "RO"},
            {text: lang.LANG_CONFUSER_SNMPV3_ACCESS_LEVEL_RW, value: "RW"}
        ]);

        addItemIntoSelection(document.getElementById("select_snmpv3_auth_proto"), [
            {text: lang.LANG_CONFUSER_SNMPV3_AUTH_PROTOCOL_MD5, value: "MD5"},
            {text: lang.LANG_CONFUSER_SNMPV3_AUTH_PROTOCOL_SHA96, value: "SHA"}
        ]);

        addItemIntoSelection(document.getElementById("select_snmpv3_priv_proto"), [
            {text: lang.LANG_CONFUSER_SNMPV3_PRIV_PROTOCOL_AES128, value: "AES"}
        ]);

        function addItemIntoSelection(select, itemArr){
            itemArr.forEach(function(item){
                var option = document.createElement("option");
                option.text = item.text;
                option.value = item.value;
                select.appendChild(option);
            });
        }
    }
}

function PasswordStatus(response)
{
    "use strict";

    Loading(false);
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(text);
        if(xml_obj == null)
        {
            SessionTimeout();
            return;
        }else{

            if(CheckInvalidResult(xml_obj) < 0) {
                return;
            }
            var result = GetXMLNodeValue(xml_obj, "RESULT");
            if(result == "FAIL") {
                return;
            }
            var IPMIRoot = xml_obj.documentElement;
            var SYS_PASSWORD_INFO = IPMIRoot.getElementsByTagName('SYS_PASSWORD_INFO');
            var complex_password_mode = SYS_PASSWORD_INFO[0].getAttribute('MODE');
            if(complex_password_mode != "0"){
                sysPasswordMode = "COMPLEX_MODE";
            }else{
                sysPasswordMode = "SIMPLE_MODE";
            }

        }
    } else {
           location.href = usrPage;
    }
}

function queryPasswordMode()
{
    "use strict";

	Loading(true);
        var url = '/cgi/system_passwordcfg.cgi';
        var pars = 'time_stamp='+ (new Date());
        var ajax_data= "<?xml version=\"1.0\"?>\n"+
			"<IPMI>\n"+
            "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
			"<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
			"</IPMI>\n";
        var myAjax = new Ajax.Request(
                                url,
                                {method: 'post',
                                contentType: 'text/xml',
                                xml_data: ajax_data,
                                parameters: pars, onComplete: PasswordStatus});
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if(privilege == '04')
    {
        add_btn.onclick = PreAddUser;
        cancel_btn.onclick = function()
        {
            location.href = usrPage;
        }
        queryPasswordMode();
    }
    else
    {
        add_btn.disabled = true;
        cancel_btn.disabled = true;
    }
}

function PreAddUser()
{
    "use strict";
    queryUserList(getUserList);
    if ( !CheckUserName(usr_name.value) )
    {
        return;
    }
    if (usr_pwd.value != usr_pwd_check.value)
    {
        alert(lang.LANG_CONFUSER_COMMON_ERR2);
        return;
    }

    if (CheckPassword(usr_pwd.value) == false)
    {
        alert(lang.LANG_CONFUSER_ADD_ERR3);
        return;
    }

    if(snmpSupport){
        if (document.getElementById("checkbox_snmpv3_access").checked){
            if (!CheckStringLength(document.getElementById("password_snmpv3_auth_passphrase").value , 8, 12))
            {
                alert(lang.LANG_CONFUSER_ADD_ERR4);
                return;
            }

            if (!CheckStringLength(document.getElementById("password_snmpv3_priv_passphrase").value , 8, 12))
            {
                alert(lang.LANG_CONFUSER_ADD_ERR5);
                return;
            }
        }
    }

    Loading(true);
    addUser();
}

var allUserNameAry = [];
function getUserList(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //alert(originalRequest.responseText);
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

        for(i = 0; i < user.length; i++)
        {
            //alert(user[i].getAttribute("NAME"));
            allUserNameAry.push(user[i].getAttribute("NAME"));
            //alert(allUserNameAry[i]);
        }
    }
}

function CheckDuplicatedUserName(username) {
    "use strict";
    var checkedUserName = username;
    var result = false;
    for(var i = 0; i < 15; i++) {
        //alert(allUserNameAry.pop(i));
        if(checkedUserName.localeCompare(allUserNameAry.pop(i)) == 0) {
            //alert('true');
            result = true;
            break;
        }
    }
    return result;
}

function addUser()
{
    "use strict";
    var u_id = GetVars("usr_id");
    var u_name = Trim(usr_name.value);
    var u_pwd = Trim(usr_pwd.value);
    var usr_priv = document.getElementById("select_priv");
    var snmpv3 = null;

    if(snmpSupport){
        snmpv3 = {
            access: (document.getElementById("checkbox_snmpv3_access").checked),
            accessLevel: document.getElementById("select_snmpv3_access_level").value,
        };

        if(snmpv3.access){
            snmpv3['authProto'] = document.getElementById("select_snmpv3_auth_proto").value;
            snmpv3['authPwd'] = btoa(Trim(document.getElementById("password_snmpv3_auth_passphrase").value));
            snmpv3['privProto'] = document.getElementById("select_snmpv3_priv_proto").value;
            snmpv3['privPwd'] = btoa(Trim(document.getElementById("password_snmpv3_priv_passphrase").value));
        }
    }

    //+++1230-15,check duplicated username
    if( CheckDuplicatedUserName(u_name) ) {
        alert(lang.LANG_CONFUSR_EXIST);
    } else { //---1230-15
        writeUserInfo(null, u_id, u_name, usr_priv.value, "1", u_pwd, snmpv3, addUserIsDone);
    }
}


/* this function is called when add user failure */
function UserdelIsDone(originalRequest)
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
    }
}

function addUserIsDone(originalRequest)
{
    "use strict";
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
            var user_id = GetVars("usr_id");
            var user_name = Trim(usr_name.value);
            var reason = GetXMLNodeValue(xmldoc, "REASON");
            if (reason != null){
                if (reason === '82'){
                    alert(lang.LANG_CONFUSER_PWD_COMPLEX_SIMPLE_FAIL);
                } else if (reason === '83'){
                    alert(lang.LANG_CONFUSER_PWD_COMPLEX_LOW_FAIL);
                }else if (reason === '84'){
                    alert(lang.LANG_CONFUSER_PWD_COMPLEX_MEDIUM_FAIL);
                }else if (reason === '85'){
                    alert(lang.LANG_CONFUSER_PWD_COMPLEX_HIGH_FAIL);
                }
            }else{
                alert(lang.LANG_CONFUSER_ADD_FAIL);
            }
            requestDelUser(user_id, user_name, UserdelIsDone);
            return;
        }

        if (result == "OK") {
            alert(lang.LANG_CONFUSER_ADD_SUCC, {title: lang.LANG_GENERAL_SUCCESS,
                onClose: function() {location.href = usrPage;}});
        }
    }
}

function onEnableSNMPv3Service(enable){
    var enableOnSnmpv3 = !enable;
    document.getElementById("select_snmpv3_access_level").disabled = enableOnSnmpv3;
    document.getElementById("select_snmpv3_auth_proto").disabled = enableOnSnmpv3;
    document.getElementById("password_snmpv3_auth_passphrase").disabled = enableOnSnmpv3;
    document.getElementById("select_snmpv3_priv_proto").disabled = enableOnSnmpv3;
    document.getElementById("password_snmpv3_priv_passphrase").disabled = enableOnSnmpv3;
}

function privilegeLimitSet(priv){
    var enable = true;
    var accessLevelEnable = enable;
    switch(priv){
        case "4":
        case "3":
            enable = accessLevelEnable = document.getElementById("checkbox_snmpv3_access").checked;
            document.getElementById("checkbox_snmpv3_access").disabled = false;
            break;
        case "2":
            enable = document.getElementById("checkbox_snmpv3_access").checked;
            accessLevelEnable = false;
            document.getElementById("select_snmpv3_access_level").value = "RO";
            document.getElementById("checkbox_snmpv3_access").disabled = false;
            break;
        default:
            enable = accessLevelEnable = false;
            document.getElementById("checkbox_snmpv3_access").disabled = true;
            document.getElementById("checkbox_snmpv3_access").checked = false;
            break;
    }
    document.getElementById("select_snmpv3_access_level").disabled = !enable || !accessLevelEnable;
    document.getElementById("select_snmpv3_auth_proto").disabled = !enable;
    document.getElementById("password_snmpv3_auth_passphrase").disabled = !enable;
    document.getElementById("select_snmpv3_priv_proto").disabled = !enable;
    document.getElementById("password_snmpv3_priv_passphrase").disabled = !enable;
}
