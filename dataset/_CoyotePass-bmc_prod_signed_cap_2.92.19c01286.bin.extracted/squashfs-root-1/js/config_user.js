"use strict";
/* Configuration -- SSL Certification setting */
var snmpSupport = true;
var lang;

function geneUserXML(total, uid, name, privilege, status, password, snmpv3) {
    "use strict";
    //<?xml version="1.0"?>
    //<IPMI>
    //  <PRIV>xxx</PRIV>
    //  <USER UID= "2" NAME="ADMIN" USER_ACCESS="04" STATUS="1" PWD=""/>
    //</IPMI>
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    if(total != null) {
        result += "    <TOTAL_NUMBER USER=\"" + total + "\"/>\n";
    }
    if(uid != null) {
        result += "    <USER UID=\"" + uid + "\"  NAME=\"" + name + "\" USER_ACCESS=\"" + privilege + "\" STATUS=\"" + status;
        if(password != null) {
            //password == null, means don't change password.
            result += "\" PWD=\"" + password;
        }
        // snmpv3
        if(snmpSupport){
            if(Object.keys(snmpv3).length > 0){
                result += "\" SNMPV3_ACCESS=\"" + (snmpv3['access'] ? "1" : "0");
                if(snmpv3['access']){
                    result += "\" SNMPV3_ACCESS_LEVEL=\"" + snmpv3['accessLevel'];
                    if(snmpv3['authProto'] !== undefined) result += "\" SNMPV3_AUTH_PROTO=\"" + snmpv3['authProto'];
                    if(snmpv3['authPwd'] !== undefined) result += "\" SNMPV3_AUTH_PWD=\"" + snmpv3['authPwd'];
                    if(snmpv3['privProto'] !== undefined) result += "\" SNMPV3_PRIV_PROTO=\"" + snmpv3['privProto'];
                    if(snmpv3['privPwd'] !== undefined) result += "\" SNMPV3_PRIV_PWD=\"" + snmpv3['privPwd'];
                }
            }
        }

        result += "\"/>\n";
    }
    result += "</IPMI>\n";
    return result;
}

function writeUserInfo(total, id, name, priv, enable, password, snmpv3, callback)
{
    "use strict";
    var ajax_url = '../cgi/userinfocfg.cgi';
    var ajax_param = '';
    var ajax_data = "";
    if(snmpv3 == null) snmpv3 = {};
    if(password != null) {
        ajax_data = geneUserXML(total, id, name, priv, enable, btoa(password), snmpv3);
    }
    else {
        //password == null, means don't change password.
        ajax_data = geneUserXML(total, id, name, priv, enable, password, snmpv3);
    }
    //console.log("plain ==> " + password);
    //console.log("Base64.encode ==> " + btoa(password));
    //console.log("request writeUserInfo:\n" + ajax_data);
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'PUT',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      onComplete: callback }//register callback function
                                   );
}

function requestDelUser(id, username, callback) {
    "use strict";
    var ajax_url = '../cgi/userinfocfg.cgi';
    var ajax_param = '';
    var ajax_data = geneUserXML("0", id, username, "0", "0", "0", {});
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'DELETE',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      onComplete: callback }//register callback function
                                   );
}

function queryUserList(callback) {
    "use strict";
    var ajax_url = '../cgi/userinfocfg.cgi';
    var ajax_param = '';
    var ajax_data = geneUserXML("0", "0", "0", "0", "0", "0", {});
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'POST',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      onComplete: callback }//register callback function
                                   );

}

function CheckEmptyUserName(username) {
  "use strict";
	var result = false;
	if(username != null && username.length > 0) {
		if(username == "~") {
			result = true;
		}
	}
	return result;
}

