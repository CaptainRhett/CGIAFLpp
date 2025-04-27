"use strict";
/*
  global variables
*/
var cfgAdPage = "../cgi/url_redirect.cgi?url_name=config_ad";
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_ad_modgroup_hlp.html";

    // Get multi-language string
    document.title = lang.LANG_MODAD_CAPTION;
    document.getElementById("modBtn").value = lang.LANG_MODAD_MODIFY;
    document.getElementById("modBtn").addEventListener("click", modGroupCfg);
    document.getElementById("cancelBtn").value = lang.LANG_MODAD_CANCEL;
    document.getElementById("cancelBtn").addEventListener("click", cancelGroupCfg);

    document.getElementById("opt4").text = lang.LANG_ADDAD_ADMINISTRATOR;
    document.getElementById("opt3").text = lang.LANG_ADDAD_OPERATOR;
    document.getElementById("opt2").text = lang.LANG_ADDAD_USER;
    document.getElementById("optf").text = lang.LANG_ADDAD_NOACCESS;

    document.getElementById("caption").textContent = lang.LANG_MODAD_CAPTION;
    document.getElementById("adname").textContent = lang.LANG_MODAD_NAME;
    document.getElementById("domain").textContent = lang.LANG_MODAD_DOMAIN;
    document.getElementById("priv").textContent = lang.LANG_MODAD_PRIV;

    CheckUserPrivilege(PrivilegeCallBack);

}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if(privilege == '04')
    {
        //full access
        document.getElementById("adGroupPriv").value = "0x"+ parseInt(GetVars("nwpriv")).toString(16);
        document.getElementById("adGroupName").value = GetVars('name');
        document.getElementById("adGroupDomain").value = GetVars('domain');
    }
    else if(privilege == '03')
    {
        //read only
        document.getElementById("adGroupPriv").value = "0x"+ parseInt(GetVars("nwpriv")).toString(16);
        document.getElementById("adGroupName").value = GetVars('name');
        document.getElementById("adGroupDomain").value = GetVars('domain');
        document.getElementById("modBtn").disabled = true;
        document.getElementById("cancelBtn").disabled = true;
        document.getElementById("adGroupName").disabled = true;
        document.getElementById("adGroupDomain").disabled = true;
    }
    else
    {
        //no access
        alert(lang.LANG_COMMON_NOPRIVI, {onClose: function() {location.href = cfgAdPage;}});
    }
}

function geneModifyAdGroupXML(id, name, domain, privilege) {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <AD_GROUP_EN_NUM TOTLE_NUM=\"1\" />\n";
    if(id != null) {
        result += "    <AD_GROUP ID=\"" + id + "\" NAME=\"" + name + "\" DN=\"" + domain + "\" PRIVILEGE=\"" + privilege + "\"/>\n";
    }
    result += "</IPMI>\n";
    return result;
}

function modGroupCfg()
{
    "use strict";
    // check adGroupName field
    if(Trim(document.getElementById("adGroupName").value).length == 0){
        alert(lang.LANG_AD_CHK_DOMAIN);
        return;
    }
    else if (!CheckSpeficChar(document.getElementById("adGroupName").value))
    {
        alert(lang.LANG_AD_ERR_INPUT);
        return;
    }
    // check adGroupDomain field
    if(Trim(document.getElementById("adGroupDomain").value).length == 0){
        alert(lang.LANG_AD_CHK_DOMAIN);
        return;
    }
    else if (!CheckSpeficChar(document.getElementById("adGroupDomain").value))
    {
        alert(lang.LANG_AD_ERR_INPUT);
        return;
    }

    var group_index = GetVars("groupindex");
    var group_name = Trim(document.getElementById("adGroupName").value);
    var group_domain = Trim(document.getElementById("adGroupDomain").value);
    var group_privilege = document.getElementById("adGroupPriv").value;
    Loading(true);

    var ajax_url = '../cgi/netadrolecfg.cgi';
    var ajax_param = '';
    var ajax_data = geneModifyAdGroupXML(group_index, group_name, group_domain, group_privilege);
    //console.log("geneModifyAdGroupXML xml:\n" + ajax_data);
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'UPDATE',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                onComplete: modGroupCfgHandler }
            );
}

function modGroupCfgHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var text = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(text);

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0)
            return;

        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "DATA_INVALID") {
            alert(lang.LANG_ADDAD_MOD_DUPLICATE);
            return;
        }

        alert(lang.LANG_MODAD_MOD_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS,
            onClose: function() {location.href = cfgAdPage;}});
    }
    else{
        alert(lang.LANG_ADDAD_MOD_UNCOMPLETE);
    }
}

function cancelGroupCfg()
{
    "use strict";
    location.href = cfgAdPage;
}
