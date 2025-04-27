"use strict";
var browser_ie = (((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0))?true:false);
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

var timezone_array = [
    ["Midway", "GMT-11:00", lang.LANG_TIMEZONE_MIDWAY],
    ["Honolulu", "GMT-10:00", lang.LANG_TIMEZONE_HONOLULU],
    ["Anchorage", "GMT-09:00", lang.LANG_TIMEZONE_ANCHORAGE],
    ["Los Angeles", "GMT-08:00", lang.LANG_TIMEZONE_LOS_ANGELES],
    ["Tijuana", "GMT-08:00", lang.LANG_TIMEZONE_TIJUANA],
    ["Phoenix", "GMT-07:00", lang.LANG_TIMEZONE_PHOENIX],
    ["Chihuahua", "GMT-07:00", lang.LANG_TIMEZONE_CHIHUAHUA],
    ["Denver", "GMT-07:00", lang.LANG_TIMEZONE_DENVER],
    ["Costa Rica", "GMT-06:00", lang.LANG_TIMEZONE_COSTA_RICA],
    ["Chicago", "GMT-06:00", lang.LANG_TIMEZONE_CHICAGO],
    ["Mexico City", "GMT-06:00", lang.LANG_TIMEZONE_MEXICO_CITY],
    ["Regina", "GMT-06:00", lang.LANG_TIMEZONE_REGINA],
    ["Bogota", "GMT-05:00", lang.LANG_TIMEZONE_BOGOTA],
    ["New York", "GMT-05:00", lang.LANG_TIMEZONE_NEW_YORK],
    ["Caracas", "GMT-04:30", lang.LANG_TIMEZONE_CARACAS],
    ["Barbados", "GMT-04:00", lang.LANG_TIMEZONE_BARBADOS],
    ["Halifax", "GMT-04:00", lang.LANG_TIMEZONE_HALIFAX],
    ["Manaus", "GMT-04:00", lang.LANG_TIMEZONE_MANAUS],
    ["St Johns", "GMT-03:30", lang.LANG_TIMEZONE_ST_JOHNS],
    ["Santiago", "GMT-03:00", lang.LANG_TIMEZONE_SANTIAGO],
    ["Recife", "GMT-03:00", lang.LANG_TIMEZONE_RECIFE],
    ["Buenos Aires", "GMT-03:00", lang.LANG_TIMEZONE_BUENOS_AIRES],
    ["Nuuk", "GMT-03:00", lang.LANG_TIMEZONE_NUUK],
    ["Montevideo", "GMT-03:00", lang.LANG_TIMEZONE_MONTEVIDEO],
    ["Sao Paulo", "GMT-02:00", lang.LANG_TIMEZONE_SAO_PAULO],
    ["South Georgia", "GMT-02:00", lang.LANG_TIMEZONE_SOUTH_GEORGIA],
    ["Azores", "GMT-01:00", lang.LANG_TIMEZONE_AZORES],
    ["Cape Verde", "GMT-01:00", lang.LANG_TIMEZONE_CAPE_VERDE],
    ["Casablanca", "GMT+00:00", lang.LANG_TIMEZONE_CASABLANCA],
    ["London", "GMT+00:00", lang.LANG_TIMEZONE_LONDON],
    ["Amsterdam", "GMT+01:00", lang.LANG_TIMEZONE_AMSTERDAM],
    ["Belgrade", "GMT+01:00", lang.LANG_TIMEZONE_BELGRADE],
    ["Brussels", "GMT+01:00", lang.LANG_TIMEZONE_BRUSSELS],
    ["Madrid", "GMT+01:00", lang.LANG_TIMEZONE_MADRID],
    ["Sarajevo", "GMT+01:00", lang.LANG_TIMEZONE_SARAJEVO],
    ["Brazzaville", "GMT+01:00", lang.LANG_TIMEZONE_BRAZZAVILLE],
    ["Windhoek", "GMT+02:00", lang.LANG_TIMEZONE_WINDHOEK],
    ["Amman", "GMT+02:00", lang.LANG_TIMEZONE_AMMAN],
    ["Athens", "GMT+02:00", lang.LANG_TIMEZONE_ATHENS],
    ["Istanbul", "GMT+02:00", lang.LANG_TIMEZONE_ISTANBUL],
    ["Beirut", "GMT+02:00", lang.LANG_TIMEZONE_BEIRUT],
    ["Cairo", "GMT+02:00", lang.LANG_TIMEZONE_CAIRO],
    ["Helsinki", "GMT+02:00", lang.LANG_TIMEZONE_HELSINKI],
    ["Jerusalem", "GMT+02:00", lang.LANG_TIMEZONE_JERUSALEM],
    ["Harare", "GMT+02:00", lang.LANG_TIMEZONE_HARARE],
    ["Minsk", "GMT+03:00", lang.LANG_TIMEZONE_MINSK],
    ["Baghdad", "GMT+03:00", lang.LANG_TIMEZONE_BAGHDAD],
    ["Moscow", "GMT+03:00", lang.LANG_TIMEZONE_MOSCOW],
    ["Kuwait", "GMT+03:00", lang.LANG_TIMEZONE_KUWAIT],
    ["Nairobi", "GMT+03:00", lang.LANG_TIMEZONE_NAIROBI],
    ["Tehran", "GMT+03:30", lang.LANG_TIMEZONE_TEHRAN],
    ["Baku", "GMT+04:00", lang.LANG_TIMEZONE_BAKU],
    ["Tbilisi", "GMT+04:00", lang.LANG_TIMEZONE_TBILISI],
    ["Yerevan", "GMT+04:00", lang.LANG_TIMEZONE_YEREVAN],
    ["Dubai", "GMT+04:00", lang.LANG_TIMEZONE_DUBAI],
    ["Kabul", "GMT+04:30", lang.LANG_TIMEZONE_KABUL],
    ["Karachi", "GMT+05:00", lang.LANG_TIMEZONE_KARACHI],
    ["Oral", "GMT+05:00", lang.LANG_TIMEZONE_ORAL],
    ["Yekaterinburg", "GMT+05:00", lang.LANG_TIMEZONE_YEKATERINBURG],
    ["Kolkata", "GMT+05:30", lang.LANG_TIMEZONE_KOLKATA],
    ["Colombo", "GMT+05:30", lang.LANG_TIMEZONE_COLOMBO],
    ["Kathmandu", "GMT+05:45", lang.LANG_TIMEZONE_KATHMANDU],
    ["Almaty", "GMT+06:00", lang.LANG_TIMEZONE_ALMATY],
    ["Rangoon", "GMT+06:30", lang.LANG_TIMEZONE_RANGOON],
    ["Krasnoyarsk", "GMT+07:00", lang.LANG_TIMEZONE_KRASNOYARSK],
    ["Bangkok", "GMT+07:00", lang.LANG_TIMEZONE_BANGKOK],
    ["Jakarta", "GMT+07:00", lang.LANG_TIMEZONE_JAKARTA],
    ["Shanghai", "GMT+08:00", lang.LANG_TIMEZONE_SHANGHAI],
    ["Hong Kong", "GMT+08:00", lang.LANG_TIMEZONE_HONG_KONG],
    ["Irkutsk", "GMT+08:00", lang.LANG_TIMEZONE_IRKUTSK],
    ["Kuala Lumpur", "GMT+08:00", lang.LANG_TIMEZONE_KUALA_LUMPUR],
    ["Perth", "GMT+08:00", lang.LANG_TIMEZONE_PERTH],
    ["Taipei", "GMT+08:00", lang.LANG_TIMEZONE_TAIPEI],
    ["Seoul", "GMT+09:00", lang.LANG_TIMEZONE_SEOUL],
    ["Tokyo", "GMT+09:00", lang.LANG_TIMEZONE_TOKYO],
    ["Yakutsk", "GMT+09:00", lang.LANG_TIMEZONE_YAKUTSK],
    ["Darwin", "GMT+09:30", lang.LANG_TIMEZONE_DARWIN],
    ["Brisbane", "GMT+10:00", lang.LANG_TIMEZONE_BRISBANE],
    ["Vladivostok", "GMT+10:00", lang.LANG_TIMEZONE_VLADIVOSTOK],
    ["Guam", "GMT+10:00", lang.LANG_TIMEZONE_GUAM],
    ["Magadan", "GMT+10:00", lang.LANG_TIMEZONE_MAGADAN],
    ["Adelaide", "GMT+10:30", lang.LANG_TIMEZONE_ADELAIDE],
    ["Hobart", "GMT+11:00", lang.LANG_TIMEZONE_HOBART],
    ["Sydney", "GMT+11:00", lang.LANG_TIMEZONE_SYDNEY],
    ["Noumea", "GMT+11:00", lang.LANG_TIMEZONE_NOUMEA],
    ["Majuro", "GMT+12:00", lang.LANG_TIMEZONE_MAJURO],
    ["Auckland", "GMT+13:00", lang.LANG_TIMEZONE_AUCKLAND],
    ["Fiji", "GMT+13:00", lang.LANG_TIMEZONE_FIJI],
    ["Tongatapu", "GMT+13:00", lang.LANG_TIMEZONE_TONGATAPU]
];

var month = [lang.LANG_MONTH_JAN, lang.LANG_MONTH_FEB, lang.LANG_MONTH_MAR, lang.LANG_MONTH_APR,
    lang.LANG_MONTH_MAY, lang.LANG_MONTH_JUN, lang.LANG_MONTH_JUL, lang.LANG_MONTH_AUG,
    lang.LANG_MONTH_SEP, lang.LANG_MONTH_OCT, lang.LANG_MONTH_NOV, lang.LANG_MONTH_DEC
];

var wday = [lang.LANG_DAY_SUN, lang.LANG_DAY_MON, lang.LANG_DAY_TUE, lang.LANG_DAY_WED,
    lang.LANG_DAY_THU, lang.LANG_DAY_FRI, lang.LANG_DAY_SAT
];

var fMonth = 0;
var fDate = 0;
var fWday = 0;
var fYear = 0;
var fHour = 0;
var fMin = 0;
var fSec = 0;
var ntp_server_pri = "";
var ntp_server_2nd = "";
var ntp_enable;
var save_btn;

var g_time = {
    year: 0,
    month: 0,
    date: 0,
    wday: 0,
    hour: 0,
    mins: 0,
    secs:0
}
var g_origTZOffset;

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/configure_date_time_hlp.html";

    OutputString();

    sortTimezoneList(timezone_array);
    ntp_server_pri = document.getElementById("ntp_server_pri");
    ntp_server_2nd = document.getElementById("ntp_server_2nd");
    fWday = document.getElementById("wdd_field");
    fMonth = document.getElementById("mon_field");
    fDate = document.getElementById("dd_field");
    fYear = document.getElementById("yy_field");
    fHour = document.getElementById("hh_field");
    fMin = document.getElementById("min_field");
    fSec = document.getElementById("ss_field");

    fHour.style.color = "#00AAFF";
    fHour.style.fontSize = "46px";
    fHour.style.fontWeight = "bold";
    fMin.style.color = "#00AAFF";
    fMin.style.fontSize = "46px";
    fMin.style.fontWeight = "bold";
    fSec.style.color = "#00AAFF";
    fSec.style.fontSize = "46px";
    fSec.style.fontWeight = "bold";
    fWday.style.color = "#00AAFF";
    fWday.style.fontSize = "18px";
    fWday.style.fontWeight = "bold";
    fMonth.style.color = "#00AAFF";
    fMonth.style.fontSize = "18px";
    fMonth.style.fontWeight = "bold";
    fDate.style.color = "#00AAFF";
    fDate.style.fontSize = "18px";
    fDate.style.fontWeight = "bold";
    fYear.style.color = "#00AAFF";
    fYear.style.fontSize = "18px";
    fYear.style.fontWeight = "bold";

    ntp_enable = document.getElementById("ntp_enable");
    ntp_enable.addEventListener("change", onNTPCheckedChange);
    save_btn = document.getElementById("save_btn");
    save_btn.value = lang.LANG_CONF_DATE_TIME_SAVE;
    save_btn.addEventListener("click", SaveTask);
    document.getElementById("timezone").addEventListener("change", onTimezoneChange);

    //check input format
    initCheckInputListener("ntp_server_pri", lang.LANG_CONF_DATE_TIME_NTP_SERVER_PRI, INPUT_FIELD.DOMAINNAME);
    initCheckInputListener("ntp_server_2nd", lang.LANG_CONF_DATE_TIME_NTP_SERVER_SEC, INPUT_FIELD.DOMAINNAME);

    if (ntp_enable.checked == true) {
        NTPEnableFunc();
    } else{
        NTPDisableFunc();
    }

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
    CreateTimezoneTable();
}

function OutputString()
{
    "use strict";
    document.getElementById("caption_div").textContent = lang.LANG_CONF_DATE_TIME_CAPTION;
    document.getElementById("timezone_td").textContent = lang.LANG_CONF_DATE_TIME_TIMEZONE;
    document.getElementById("ntp_enable_lb").textContent = lang.LANG_CONF_DATE_TIME_NTP;
    document.getElementById("ntp_server_legend").textContent = lang.LANG_CONF_DATE_TIME_NTP_SERVER;
    document.getElementById("server_pri_td").textContent = lang.LANG_CONF_DATE_TIME_NTP_SERVER_PRI;
    document.getElementById("server_sec_td").textContent = lang.LANG_CONF_DATE_TIME_NTP_SERVER_SEC;
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    //full access
    if (Privilege == '04')
    {
        GetDateTimeReq();
    }
    //only view
    else if(Privilege == '03')
    {
        save_btn.disabled = true;
        GetDateTimeReq();
    }
    //no access
    else {
        location.href = SubMainPage;
        return;
    }
}

function DateTimezone(offset) {
    "use strict";
    //console.log('offset=' + offset);
    var d = new Date();
    d.setFullYear(g_time.year);
    d.setMonth(g_time.month - 1);
    d.setDate(g_time.date);
    d.setHours(g_time.hour);
    d.setMinutes(g_time.mins);
    d.setSeconds(g_time.secs);

    //utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // get UTC time base on original timezone select(page entry)
    var utc = d.getTime() - (g_origTZOffset * 60000);

    // get time with timezone offset
    var newd = new Date(utc + ( 60000 * offset));
    //s = newd.getFullYear() + '/' + (newd.getMonth()+1) + '/' + newd.getDate() + ' ' + newd.getHours() + ':' + newd.getMinutes() + ':' + newd.getSeconds();
    //console.log("new==>" + s);
    return newd;
}

function onTimezoneChange() {
    "use strict";
    var selector = document.getElementById("timezone");
    var timezone_offset = timezone_array[selector.selectedIndex][1].substr(3).split(':');
    var timezone_offset = GetTimezoneOffset(timezone_array[selector.selectedIndex][1]);
    //console.log(timezone_offset);

    //calcuate time with timezone offset
    var newtime = DateTimezone(timezone_offset);

    //refresh date & time show
    fHour.innerText = newtime.getHours();
    fMin.innerText = newtime.getMinutes();
    fSec.innerText = newtime.getSeconds();
    fDate.innerText = newtime.getDate();
    fMonth.innerText = newtime.getMonth() + 1;
    fYear.innerText = newtime.getFullYear();

    var gtm = newtime.getFullYear() + "/" + (newtime.getMonth()+1) + "/" + newtime.getDate();
    var gwday = new Date(gtm);
    g_time.wday = gwday.getDay();
    fWday.innerText = wday[g_time.wday];
}


function compareTimezoneItem(a, b)
{
    "use strict";
    var result = parseInt(0);
    if(a != null && b != null) {
        var a_offset_str = a[1].substr(3);
        var b_offset_str = b[1].substr(3);
        var a_offset = 0;
        var b_offset = 0;
        a_offset_str = a_offset_str.replace(":", "");
        b_offset_str = b_offset_str.replace(":", "");
        a_offset = parseInt(a_offset_str);
        b_offset = parseInt(b_offset_str);
        if(a_offset < b_offset) {
            result = parseInt(-1);
        }
        else if(a_offset > b_offset) {
            result = parseInt(1);
        }
    }
    return result;
}

function sortTimezoneList(list)
{
    "use strict";
    if(list != null && list.length > 0) {
        list.sort(compareTimezoneItem);
    }

    for(var idx = 0; idx < (list.length - 1); idx++) {
        if(compareTimezoneItem(list[idx], list[idx + 1]) == 0) {
            list[idx][0] += "/" + list[idx + 1][0];
            list[idx][2] += "/" + list[idx + 1][2];
            list.splice(idx + 1, 1);
            idx--;
        }
    }
}

function NTPDisableFunc()
{
    "use strict";
    ntp_server_pri.disabled = true;
    ntp_server_2nd.disabled = true;
}

function NTPEnableFunc()
{
    "use strict";
    ntp_server_pri.disabled = false;
    ntp_server_2nd.disabled = false;
}

function onNTPCheckedChange()
{
    "use strict";
    if (ntp_enable.checked == true) {
        NTPEnableFunc();
    } else{
        NTPDisableFunc();
    }
}

function GetDateTimeReq()
{
    "use strict";
    Loading(true);
    var ajax_url = '/cgi/config_datetime.cgi';
    var ajax_data= "<?xml version=\"1.0\"?>\n"+
                   "<IPMI>\n"+
                      "<TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
                      "<PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
                   "</IPMI>\n";
    var ajax_param = 'time_stamp='+(new Date()) ;
    var ajax_req = new Ajax.Request(
                     ajax_url,
                     {method: 'post',
                     contentType: 'text/xml',
                     xml_data: ajax_data,
                     parameters:ajax_param,
                     onComplete: GetDateTimeResp
                     });
}

function InsertTimezoneOption(index, timezone, country_name)
{
    "use strict";
    var selector = document.getElementById("timezone");
    var option = document.createElement("option");
    option.text = timezone + " | " + country_name;
    option.value = index;
    selector.add(option);
}


function AppendTimezoneArray(list, index, timezone, country_name) {
    "use strict";
    var item = [];
    if (list != null) {
        item[0] = index;
        item[1] = timezone;
        item[2] = country_name;
        list.push(item);
    }
}

function GetDateTimeResp(originalRequest) {
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
            alert (lang.LANG_CONF_DATE_TIME_GETVAL);
            return;
        }
        var IPMIroot = xmldoc.documentElement;

        var config_elm = IPMIroot.getElementsByTagName("NTP_INFO");
        if (config_elm.length > 0) {
            if (config_elm[0].getAttribute("ENABLED") == "on") {
                ntp_enable.checked = true;
                NTPEnableFunc();
                if (config_elm[0].getAttribute("REACHABLE") == "unavailable") {
                    alert (lang.LANG_CONF_DATE_TIME_ERR9);
                }
            } else {
                ntp_enable.checked = false;
                NTPDisableFunc();
            }

            ntp_server_pri.value = config_elm[0].getAttribute("PRI_SERVER");
            ntp_server_2nd.value = config_elm[0].getAttribute("SEC_SERVER");
        }

        var config_elm = IPMIroot.getElementsByTagName("DATETIME_INFO");
        if (config_elm.length > 0) {
            var tz_name = config_elm[0].getAttribute("TIME_ZONE_NAME");
            var timezone_offset = config_elm[0].getAttribute("TIME_ZONE_OFFSET");
            //console.log("target timezoneoffset:" + timezone_offset);
            g_origTZOffset = timezone_offset;
            var selector = document.getElementById("timezone");
            var index = FindTimezoneIndex(timezone_array, parseInt(timezone_offset));
            if (index >= 0) {
                selector.selectedIndex = index;
            } else {
                //when timezone offset can not found in timezone_array, just create a new timezone and named as "Undefined".
                var timezone_str = GetTimezoneStr(timezone_offset);
                AppendTimezoneArray(timezone_array, "unknow", timezone_str, lang.LANG_CONF_DATETIME_UNDEFINED);
                InsertTimezoneOption("unknow", timezone_str, lang.LANG_CONF_DATETIME_UNDEFINED);
                index = FindTimezoneIndex(timezone_array, parseInt(timezone_offset));
                if (index >= 0) {
                    selector.selectedIndex = index;
                }
            }

            fHour.innerText = config_elm[0].getAttribute("HOUR");
            fMin.innerText = config_elm[0].getAttribute("MIN");
            fSec.innerText = config_elm[0].getAttribute("SEC");
            fWday.innerText = config_elm[0].getAttribute("WDAY");
            fDate.innerText = config_elm[0].getAttribute("DAY");
            fMonth.innerText = config_elm[0].getAttribute("MONTH");
            fYear.innerText = config_elm[0].getAttribute("YEAR");
        }

        g_time.hour = parseInt(fHour.innerText, 10);
        g_time.mins = parseInt(fMin.innerText, 10);
        g_time.secs = parseInt(fSec.innerText, 10);
        g_time.date = parseInt(fDate.innerText, 10);
        g_time.month = parseInt(fMonth.innerText, 10);
        g_time.year = parseInt(fYear.innerText, 10);
        g_time.wday = parseInt(fWday.innerText, 10);
        fWday.innerText = wday[g_time.wday];
    }
}

function SaveTask()
{
    "use strict";
    if (Trim(ntp_server_pri.value) == Trim(ntp_server_2nd.value)) {
        if (Trim(ntp_server_pri.value) == "" &&
            Trim(ntp_server_2nd.value) == "") {
            if (ntp_enable.checked == true) {
                alert(lang.LANG_CONF_DATE_TIME_ERR0);
                return;
            }
        } else {
            alert(lang.LANG_CONF_DATE_TIME_ERR1);
            setTimeout(function(){ location.href = "../cgi/url_redirect.cgi?url_name=config_datetime"; }, 2000);
            return;
        }
    }

    var ntp_stat;
    if (ntp_enable.checked == true)
        ntp_stat = 'on';
    else
        ntp_stat = 'off';

    Loading(true);
    var ajax_url = '/cgi/config_datetime.cgi';
    var ajax_param = 'time_stamp='+ (new Date());
    var selector = document.getElementById("timezone");
    var timezone_offset = timezone_array[selector.selectedIndex][1].substr(3).split(':');
    var timezone_offset = GetTimezoneOffset(timezone_array[selector.selectedIndex][1]);

    var ajax_data = "<?xml version=\"1.0\"?>\n" +
                    "<IPMI>\n" +
                    "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n"+
                    "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n"+
                    "    <SET_DATETIME_INFO TIME_ZONE_NAME=\"" + selector.value + "\"" +
                                          " TIME_ZONE_OFFSET=\"" + timezone_offset + "\"/>\n"+
                    "    <SET_NTP_INFO ENABLED= \"" + ntp_stat + "\""+
                                       " PRI_SERVER=\"" + ntp_server_pri.value + "\""+
                                       " SEC_SERVER=\"" + ntp_server_2nd.value + "\"/>\n"+
                    "</IPMI>";

    var ajax_req = new Ajax.Request(
                       ajax_url,
                       {
                       method: 'update',
                       contentType: "text/xml",
                       xml_data: ajax_data,
                       parameters:ajax_param,
                       onComplete: SetDateTimeResp
                       });
}


function GetTimezoneStr(offset)
{
    "use strict";
    var result = null;
    var offset_val = parseInt(offset);
    var h_offset = 0;
    var m_offset = 0;
    var h_str = "";
    var m_str = "";
    var idx = 0;
    h_offset = parseInt(Math.abs(offset_val) / 60);
    m_offset = Math.abs(offset_val) % 60;

    if (h_offset < 10) {
        h_str = "0" + h_offset
    } else {
        h_str = "" + h_offset;
    }
    if (m_offset < 10) {
        m_str = "0" + m_offset
    } else {
        m_str = "" + m_offset;
    }

    var timezone_str = h_str + ":" + m_str;
    if (offset_val < 0) {
        result = "GMT-" + timezone_str;
    } else {
        result = "GMT+" + timezone_str;
    }

    return result;
}


function FindTimezoneIndex(timezone_array, offset) {
    "use strict";
    var index = -1;
    if (timezone_array != null && timezone_array.length > 0) {
        var timezone_str = "";
        timezone_str = GetTimezoneStr(offset);
        for (var idx = 0; idx < timezone_array.length; idx++) {
            if (timezone_array[idx][1] == timezone_str) {
                index = idx;
                break;
            }
        }
    }
    return index;
}


function GetTimezoneOffset(gmt_str) {
    "use strict";
    var result = 0;
    if (gmt_str != null && gmt_str.length > 4) {
        var str_timezone_offset = gmt_str.replace("GMT", "");
        if (str_timezone_offset != null && str_timezone_offset.length > 0) {
            var timeoffsets = str_timezone_offset.split(":");
            if (timeoffsets != null && timeoffsets.length > 1) {
                var h_offset = parseInt(timeoffsets[0]);
                var m_offset = parseInt(timeoffsets[1]);
                if (h_offset > 0) {
                    result = parseInt((h_offset * 60) + m_offset);
                } else {
                    result = parseInt((h_offset * 60) - m_offset);
                }
            }
        }
    }
    return result;
}

function SetDateTimeResp(originalRequest) {
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

        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_CONFALERT_FAILSAVE);
            return;
        }

        GetDateTimeReq();
        alert (lang.LANG_CONF_DATE_TIME_SUCC);
        setTimeout(function(){ location.href = "../cgi/url_redirect.cgi?url_name=config_datetime"; }, 2000);
    }
}

function CreateTimezoneTable() {
    "use strict";
    for (var i = 0; i < timezone_array.length; i++) {
        InsertTimezoneOption(timezone_array[i][0], timezone_array[i][1], timezone_array[i][2])
    }
}
