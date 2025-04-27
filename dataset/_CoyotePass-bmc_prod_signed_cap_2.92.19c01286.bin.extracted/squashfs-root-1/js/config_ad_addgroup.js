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
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_ad_addgroup_hlp.html";

    // Get multi-language string
    document.title = lang.LANG_ADDAD_CAPTION;
    document.getElementById("addBtn").value = lang.LANG_ADDAD_ADD;
    document.getElementById("cancelBtn").value = lang.LANG_ADDAD_CANCEL;

    document.getElementById("caption").textContent = lang.LANG_ADDAD_CAPTION;
    document.getElementById("adname").textContent = lang.LANG_ADDAD_NAME;
    document.getElementById("domain").textContent = lang.LANG_ADDAD_DOMAIN;
    document.getElementById("priv").textContent = lang.LANG_ADDAD_PRIV;

    document.getElementById("opt4").text = lang.LANG_ADDAD_ADMINISTRATOR;
    document.getElementById("opt3").text = lang.LANG_ADDAD_OPERATOR;
    document.getElementById("opt2").text = lang.LANG_ADDAD_USER;
    document.getElementById("optf").text = lang.LANG_ADDAD_NOACCESS;

    document.getElementById("addBtn").addEventListener("click", addGroupCfg);
    document.getElementById("cancelBtn").addEventListener("click", cancelGroupCfg);
    CheckUserPrivilege(PrivilegeCallBack);

}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if(privilege == '04')
    {
        //full access
    }
    else if(privilege == '03')
    {
        //read only
        //alert(lang.LANG_COMMON_CANNOT_MODIFY);
        document.getElementById("addBtn").disabled = true;
        document.getElementById("cancelBtn").disabled = true;
        document.getElementById("adGroupName").disabled = true;
        document.getElementById("adGroupDomain").disabled = true;
    }
    else
    {
        //no access
        location.href = SubMainPage;
        return;
    }
}

function geneAddAdGroupXML(id, name, domain, privilege) {
    "use strict";
    //<?xml version="1.0"?>
    //<IPMI>
    //  <PRIV>ooo</PRIV>
    //  <AD_GROUP ID="1" NAME="test" DN="test.com" PRIVILEGE="4"/>
    //</IPMI>
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

function addGroupCfg()
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
    var ajax_data = geneAddAdGroupXML(group_index, group_name, group_domain, group_privilege);
    //console.log("geneAddAdGroupXML xml:\n" + ajax_data);
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'PUT',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                onComplete: addGroupCfgHandler }
            );
}

function addGroupCfgHandler(originalRequest)
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

        alert(lang.LANG_ADDAD_ADD_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS,
            onClose: function(){location.href = cfgAdPage;}});
    }
    else{
        alert(lang.LANG_ADDAD_ADD_UNCOMPLETE);
    }
}

function cancelGroupCfg()
{
    "use strict";
    location.href = cfgAdPage;
}
