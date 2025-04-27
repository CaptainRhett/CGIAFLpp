"use strict";
/*global variable*/
var lang;
var usr_id;
var mCurrentUser = "";
var usrPage = "../cgi/url_redirect.cgi?url_name=config_usr";
var usr_priv, usr_enable;
var sysPasswordMode = "SIMPLE_MODE";
var modify_btn;
var cancel_btn;
var isChangePWD;
var usr_name;
var usr_pwd;
var usr_pwd_check;
var snmp_restrict = "0";
var snmpSupport = true;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }
var cacheData = {
    snmp: {
        access: undefined,
        exist: undefined,
        authProto: undefined,
        privProto: undefined,
    }
};

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/config_usr_mod_hlp.html";

    modify_btn = document.getElementById("btn_modify");
    cancel_btn = document.getElementById("btn_cancel");
    modify_btn.value = lang.LANG_CONFUSER_MOD_MODIFY;
    cancel_btn.value = lang.LANG_CONFUSER_MOD_CANCEL;

    isChangePWD = document.getElementById("checkbox_changepwd");
    usr_name = document.getElementById("text_name");
    usr_pwd = document.getElementById("password_pwd");
    usr_pwd_check = document.getElementById("password_pwd_check");
    usr_priv = document.getElementById("select_priv");
    usr_enable = document.getElementById("select_enable");
    usr_pwd.disabled = true;
    usr_pwd_check.disabled = true;

    usr_id = GetVars("usr_id");
    usr_name.disabled = false;
    if(usr_id == 1)
    {
        usr_name.disabled = true;
    }
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
    document.getElementById("mod_caption_div").textContent = lang.LANG_CONFUSER_MOD_CAPTION;
    document.getElementById("mod_name_lbl").textContent = lang.LANG_CONFUSER_MOD_NAME;
    document.getElementById("change_pwd_lbl").textContent = lang.LANG_CONFUSER_MOD_CHANGE_PWD;
    document.getElementById("mod_pwd_lbl").textContent = lang.LANG_CONFUSER_MOD_PWD;
    document.getElementById("conf_pwd_lbl").textContent = lang.LANG_CONFUSER_MOD_CONF_PWD;
    document.getElementById("mod_priv_lbl").textContent = lang.LANG_CONFUSER_MOD_PRIV;
    document.getElementById("user_enable_lbl").textContent = lang.LANG_CONFUSER_MOD_USER_ENABLE;
    if(snmpSupport){
        document.getElementById("mod_snmpv3_access_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_ACCESS;
        document.getElementById("mod_snmpv3_access_level_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_ACCESS_LEVEL;
        document.getElementById("mod_snmpv3_auth_proto_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_AUTH_PROTOCOL;
        document.getElementById("mod_snmpv3_auth_passphrase_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_AUTH_PASSPHRASE;
        document.getElementById("mod_snmpv3_priv_proto_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_PRIV_PROTOCOL;
        document.getElementById("mod_snmpv3_priv_passphrase_lbl").textContent = lang.LANG_CONFUSER_SNMPV3_PRIV_PASSPHRASE;
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

    var select_enable_obj = document.getElementById("select_enable");
    if(select_enable_obj != null) {
        for(var enable_idx = 0; enable_idx <= 2; enable_idx++) {
            var option_en = document.createElement("option");
            if(enable_idx == 0) {
                option_en.value = enable_idx.toString();
                option_en.text = lang.LANG_CONFISER_COMMON_DISABLE;
            } else if(enable_idx == 1) {
                option_en.value = enable_idx.toString();
                option_en.text = lang.LANG_CONFISER_COMMON_ENABLE;
            } else if(enable_idx == 2) {
                option_en.value = enable_idx.toString();
                option_en.text = lang.LANG_CONFISER_COMMON_UNCHANGED;
            }
            select_enable_obj.appendChild(option_en);
        }
    }
    select_enable_obj.selectedIndex = 2;//set default to unchanged

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
        modify_btn.onclick = PreModifyUser;
        cancel_btn.onclick = function() {
            location.href = usrPage;
        }
        queryPasswordMode();
    } else {
        add_btn.disabled = true;
        modify_btn.disabled = true;
    }
}

function fillUI()
{
    "use strict";
    var name;

    name = usr_name.value;
    mCurrentUser = name;
    if(name != null) {
        var temp = name.replace(/ /g, "");
        if(temp.length < 1) {
            usr_name.value = "";
        }
    }

    isChangePWD.onclick = function() {
        "use strict";
        usr_pwd.disabled = !(this.checked);
        usr_pwd_check.disabled = !(this.checked);
    }
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
        var i;

        for(i = 0; i < user.length; i++)
        {
            if (i+1 == usr_id) {
                usr_name.value = (usr_id == 1) ? "anonymous" : user[i].getAttribute("NAME");
                usr_priv.value = user[i].getAttribute("USER_ACCESS");

                //alert(usr_name.value);
                if(snmpSupport){
                    var snmpv3_exist = Boolean(user[i].getAttribute("SNMPV3") == "1");
                    cacheData.snmp.exist = snmpv3_exist;
                    if(snmpv3_exist){
                        var snmpv3_access = Boolean(user[i].getAttribute("SNMPV3_ACCESS") == "1");
                        onEnableSNMPv3Service(snmpv3_access);
                        document.getElementById("checkbox_snmpv3_access").checked = cacheData.snmp.access = snmpv3_access;
                        if(snmpv3_access){
                            document.getElementById("select_snmpv3_access_level").value = user[i].getAttribute("SNMPV3_ACCESS_LEVEL");
                            var snmpv3_auth_proto = user[i].getAttribute("SNMPV3_AUTH_PROTO");
                            document.getElementById("select_snmpv3_auth_proto").value = cacheData.snmp.authProto = snmpv3_auth_proto;
                            var snmpv3_priv_proto = user[i].getAttribute("SNMPV3_PRIV_PROTO");
                            document.getElementById("select_snmpv3_priv_proto").value = cacheData.snmp.privProto = snmpv3_priv_proto;
                        }
                    }

                    if(snmp_restrict == "1") privilegeLimitSet(user[i].getAttribute("USER_ACCESS"));
                }
            }
            //alert(user[i].getAttribute("NAME"));
            allUserNameAry.push(user[i].getAttribute("NAME"));
            //alert(allUserNameAry[i]);
        }
        fillUI();
    }
}

function CheckDuplicatedUserName(username) {
    "use strict";
    var checkedUserName = username;
    var result = false;
    for(var i = 0; i < 15; i++) {
        if(checkedUserName.localeCompare(allUserNameAry.pop(i)) == 0) {
            result = true;
            break;
        }
    }
    return result;
}

function PreModifyUser()
{
    "use strict";
    //queryUserList(getUserList);
    if (isChangePWD.checked)
    {
        if ( usr_pwd.value!= usr_pwd_check.value)
        {
            alert(lang.LANG_CONFUSER_COMMON_ERR2);
            return;
        }

        if (CheckPassword(usr_pwd.value) == false)
        {
            alert(lang.LANG_CONFUSER_MOD_ERR1);
            return;
        }
    } else {
        usr_pwd.value = "";
        usr_pwd_check.value = "";
    }

    if ( !CheckUserName(usr_name.value) )
    {
        return;
    }

    if(snmpSupport){
        var snmpv3_access = document.getElementById("checkbox_snmpv3_access").checked;
        var auth_proto = document.getElementById("select_snmpv3_auth_proto").value;
        var priv_proto = document.getElementById("select_snmpv3_priv_proto").value;
        var passphraseChange = false;
        if(snmpv3_access){ // need to check snmp access is enabled
            if(!cacheData.snmp.exist ||                         // the snmpv3 user didn't exist yet
                                                                // different condition------------------
                    (cacheData.snmp.exist &&                    // the snmpv3 user had exist
                    (cacheData.snmp.authProto !== auth_proto || // the snmpv3 auth protocol had changed
                    cacheData.snmp.privProto !== priv_proto))   // the snmpv3 privacy protocol had changed
            ){
                if(!checkPassphraseOnSNMPv3()){
                    return;
                }
                passphraseChange = true;
            }
        }

        function checkPassphraseOnSNMPv3(){
            var authPassphrase = document.getElementById("password_snmpv3_auth_passphrase").value;
            var privPassphrase = document.getElementById("password_snmpv3_priv_passphrase").value;
            if (!(CheckStringLength(authPassphrase , 8, 12)
                && CheckPrintableChar(authPassphrase)))
            {
                alert(lang.LANG_CONFUSER_ADD_ERR4);
                return false;
            }

            if (!(CheckStringLength(privPassphrase , 8, 12)
                && CheckPrintableChar(privPassphrase)))
            {
                alert(lang.LANG_CONFUSER_ADD_ERR5);
                return false;
            }

            return true;
        }
    }

    Loading(true);

    if(mCurrentUser != usr_name.value && CheckDuplicatedUserName(usr_name.value)) {
        Loading(false);
        alert(lang.LANG_CONFUSR_EXIST);
    }
    else {
        var snmpv3 = null;
        if(snmpSupport){
            snmpv3 = {
                access: snmpv3_access,
                accessLevel: document.getElementById("select_snmpv3_access_level").value,
            };

            if(passphraseChange){
                snmpv3['authProto'] = document.getElementById("select_snmpv3_auth_proto").value;
                snmpv3['authPwd'] = btoa(Trim(document.getElementById("password_snmpv3_auth_passphrase").value));
                snmpv3['privProto'] = document.getElementById("select_snmpv3_priv_proto").value;
                snmpv3['privPwd'] = btoa(Trim(document.getElementById("password_snmpv3_priv_passphrase").value));
            }
        }

        if (isChangePWD.checked) {
            writeUserInfo(null, usr_id, Trim(usr_name.value), usr_priv.value, usr_enable.value, usr_pwd.value, snmpv3, responseWriteUserInfo);
        }
        else {
            writeUserInfo(null, usr_id, Trim(usr_name.value), usr_priv.value, usr_enable.value, null, snmpv3, responseWriteUserInfo);
        }
    }
}

function responseWriteUserInfo(response) {
    "use strict";
    if (response.readyState == 4 && response.status == 200) {
        var text = response.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("responseWriteUserInfo:\n" + text + "\n\n");
        var xml_obj = GetResponseXML(text);
        Loading(false);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }

        // check session & privilege.
        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }
        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if(result == "FAIL") {

            var reason = GetXMLNodeValue(xml_obj, "REASON");
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
                if((isChangePWD.checked) && (sysPasswordMode == "COMPLEX_MODE")) {
                    alert(lang.LANG_CONFUSER_ERR_IN_COMPLEX_MODE);
                } else {
                    alert(lang.LANG_CONFUSER_MOD_FAIL);
                }
            }
            return;
        }

        if(result == "OK") {
            alert(lang.LANG_CONFUSER_MOD_SUCC, {title: lang.LANG_GENERAL_SUCCESS, onClose: function() {location.href = usrPage;}});
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
