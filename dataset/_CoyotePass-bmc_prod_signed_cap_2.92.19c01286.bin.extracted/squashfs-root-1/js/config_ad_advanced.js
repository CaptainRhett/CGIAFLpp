"use strict";

var lang;

function getAdConfig()
{
    "use strict";
    Loading(true);
    var ajax_url = "../cgi/netadsvrcfg.cgi";
    var ajax_param = "";
    var ajax_data = GeneGenericRequestXML();
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'POST',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                onComplete: getAdConfigHandler }
            );
}

function geneAdConfigXML(enable, enable_ssl, port, dn, timeout, ip1, ip2, ip3) {
    "use strict";
    let response = "";
    response = "<?xml version=\"1.0\"?>\n";
    response += "<IPMI>\n";
    response += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    response += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    response += "<AD_INFO EN=\"" + enable + "\" EN_SSL=\"" + enable_ssl + "\" PORT=\""+ port +"\" DN=\"" + dn + "\" TimeOut=\"" + timeout + "\"/>\n";
    response += "<AD_SERVER IP1=\"" + ip1 + "\" IP2=\"" + ip2 + "\" IP3=\"" + ip3 + "\"/>\n";
    response += "</IPMI>";
    return response;
}

function getAdConfigHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        let response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        let xmldoc = GetResponseXML(response);

        // check session & privilege
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        let IPMIRoot = xmldoc.documentElement;
        let ad_info = IPMIRoot.getElementsByTagName("AD_INFO");
        let ad_server = IPMIRoot.getElementsByTagName("AD_SERVER");

        if (ad_info.length > 0) {
            if (parseInt(ad_info[0].getAttribute("EN"), 10)) {
                enableAd();
            } else {
                disableAd();
            }

            if (parseInt(ad_info[0].getAttribute("EN_SSL"), 10) == 1) {
                document.getElementById("enableSSL").checked = true;
            } else {
                document.getElementById("enableSSL").checked = false;
            }
            document.getElementById("ad_port").value = ad_info[0].getAttribute("PORT");
            document.getElementById("userDomain").value = ad_info[0].getAttribute("DN");
            document.getElementById("timeout").value = ad_info[0].getAttribute("TimeOut");
            document.getElementById("adServer1").value = ad_server[0].getAttribute("IP1");
            document.getElementById("adServer2").value = ad_server[0].getAttribute("IP2");
            document.getElementById("adServer3").value = ad_server[0].getAttribute("IP3");
        } else {
            alert (lang.LANG_AD_ADV_GET_FAIL);
        }
    }
}

function responseAdConfigHandler(originalRequest)
{
    "use strict";
    Loading(false);
    var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
    var xmldoc = GetResponseXML(response);

    if(xmldoc == null)
    {
        SessionTimeout();
        return;
    }
    // check session & privilege
    if(CheckInvalidResult(xmldoc) < 0) {
        return;
    }
    var result = GetXMLNodeValue(xmldoc, "RESULT");
    if(result == "OK") {
        alert(lang.LANG_AD_ADV_SET_SUCCUSS, {title: lang.LANG_GENERAL_SUCCESS});
    }
}

function enableAd()
{
    "use strict";
    document.getElementById("enableAD").checked = true;
    document.getElementById("enableSSL").disabled = false;
    document.getElementById("ad_port").disabled = false;
    document.getElementById("userDomain").disabled = false;
    document.getElementById("timeout").disabled = false;
    document.getElementById("adServer1").disabled = false;
    document.getElementById("adServer2").disabled = false;
    document.getElementById("adServer3").disabled = false;
}

function disableAd()
{
    "use strict";
    document.getElementById("enableAD").checked = false;
    document.getElementById("enableSSL").disabled = true;
    document.getElementById("ad_port").disabled = true;
    document.getElementById("userDomain").disabled = true;
    document.getElementById("timeout").disabled = true;
    document.getElementById("adServer1").disabled = true;
    document.getElementById("adServer2").disabled = true;
    document.getElementById("adServer3").disabled = true;
}

function checkSSL()
{
    "use strict";
    if(document.getElementById("enableSSL").checked == true)
        document.getElementById("ad_port").value = '636';
    else
        document.getElementById("ad_port").value = '389';
}

function checkAd()
{
    "use strict";
    if (document.getElementById("enableAD").checked == true)
    {
        getLdapConfig();
    }
    else
        disableAd();
}

function fakeLDAPXML(ssl_en, ip, enable, port, base, bind, password) {
    "use strict";
    var result = "";

    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <LDAP LDAP_SSL=\"" + ssl_en + "\"";
    result += " LDAP_IP=\"" + ip + "\"";
    result += " LDAP_EN=\"" + enable + "\"";
    result += " LDAP_PORT=\"" + port + "\"";
    result += " BASE_DN=\"" + base + "\"";
    result += " BINDDN=\"" + bind + "\"";
    result += " BIND_PWD=\"" + password + "\"";
    result += "/>\n"
        result += "</IPMI>\n";
    return result;
}

function getLdapConfig()
{
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/netldapcfg.cgi';
    var ajax_param = "";
    var ajax_data = fakeLDAPXML("0", "0", "0", "0", "0", "0", "0");
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'POST',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                onComplete: getLdapConfigHandler }//register callback function
            );

}

function getLdapConfigHandler(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        var response = originalRequest.responseText;
        //response = fakeLDAPXML("0", "0", "1", "0", "0", "0", "0");
        response = response.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null)
        {
            SessionTimeout();
            return;
        }

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        enableAd();
    }
}

function saveAdConfig()
{
    "use strict";
    var enable_ad = 0;
    var user_domain = Trim(document.getElementById("userDomain").value);
    var str_time_out = Trim(document.getElementById("timeout").value);
    var time_out = 0;
    var enSSL = 0;
    var server_ip1 = Trim(document.getElementById("adServer1").value);
    var server_ip2 = Trim(document.getElementById("adServer2").value);
    var server_ip3 = Trim(document.getElementById("adServer3").value);
    var ADport = parseInt(Trim(document.getElementById("ad_port").value), 10);
    if(document.getElementById("enableSSL").checked == true)
        enSSL = 1;
    else
        enSSL = 0;

    if (document.getElementById("enableAD").checked == true)
    {
        enable_ad = 1;

        if(ADport.length == 0 || (enSSL == 1 && (ADport != 636 && ADport != 3269)) ||
                (enSSL == 0 && (ADport != 389 && ADport != 3268)))
        {
            alert(lang.LANG_AD_ADV_CHK_PORT);
            return;
        }

        // check userDomain field
        if(user_domain.length == 0)
        {
            alert(lang.LANG_AD_ADV_CHK_USERDOMAIN);
            return;
        }
        else if (!CheckSpeficChar(user_domain))
        {
            alert(lang.LANG_AD_ERR_INPUT);
            return;
        }
        // check timeout field
        if (str_time_out.length == 0)
        {
            alert(lang.LANG_AD_ADV_INVALID_TIMEOUT2);
            return;
        }
        else{
            time_out = parseInt(str_time_out, 10);
            if(time_out == 'NaN'){
                alert(lang.LANG_AD_ADV_INVALID_TIMEOUT1);
                return;
            }
            if(time_out > 65535 || time_out <= 0){
                alert(lang.LANG_AD_ADV_INVALID_TIMEOUT2);
                return;
            }
        }
        // check adServer1 field
        if((server_ip1.length == 0 && server_ip2.length == 0 && server_ip3.length == 0) ||
                (server_ip1 == '0.0.0.0' && server_ip2 == '0.0.0.0' && server_ip3 == '0.0.0.0'))
        {
            alert(lang.LANG_AD_ADV_CHK_SRVIP);
            return;
        }
        if (server_ip1.length > 0)
        {
            if(!CheckIP(server_ip1)){
                alert(lang.LANG_AD_ADV_INVALID_IP);
                return;
            }
        }
        // check adServer2 field
        if (server_ip2.length > 0)
        {
            if(!CheckIP(server_ip2)){
                alert(lang.LANG_AD_ADV_INVALID_IP);
                return;
            }
        }
        // check adServer3 field
        if (server_ip3.length > 0)
        {
            if(!CheckIP(server_ip3)){
                alert(lang.LANG_AD_ADV_INVALID_IP);
                return;
            }
        }
    }
    Loading(true);

    var ajax_url = "../cgi/netadsvrcfg.cgi";
    var ajax_param = "";
    var ajax_data = geneAdConfigXML(enable_ad, enSSL, ADport, user_domain, time_out, server_ip1, server_ip2, server_ip3);
    var ajax_req = new Ajax.Request(ajax_url,
            { method: 'UPDATE',
                contentType: "text/xml",
                xml_data: ajax_data,
                parameters: ajax_param,
                onComplete: responseAdConfigHandler }
            );
}
