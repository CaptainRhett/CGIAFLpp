"use strict";
/** Node manager setting **/

    var PolicyTableArray = new Array();
    var GridTable;
    //var mSelfTest = false;
    var mWritePolicyID = null;
    var mWritePolicyDomain = null;
    var suspendTimerData;
    var mItem_Count = 0;
    //NM Domain ID
    const Memory_subsystem = "2";
    const HW_Protection    = "3";
    var lang;

function formatTimeStr(value) {
    "use strict";
    var str = "";
    str = value;
    if(value < 10 && value >= 0) {
        str = "0" + value;
    }
    return str;
}

function createScheduleTimeItem(timer_idx) {
    "use strict";
    var temp;
    var id;
    var time_opt_h;
    var time_opt_m;
    var temp_opt;
    var interval = 0;
    var td = document.createElement("td");
    td.setAttribute("class", "labelhead");
    td.setAttribute("align", "center");

    temp = document.createTextNode(lang.LANG_MISC_NM_CONFIG_STARTTIME);
    td.appendChild(temp);
    temp = document.createElement("br");
    td.appendChild(temp);
    time_opt_h = document.createElement("select");
    id = "_nm_timer" + timer_idx + "_start_h";
    time_opt_h.setAttribute("id", id);
    //console.log("id:" + id);
    for(interval = 0; interval < 24; interval++) {
        temp_opt = document.createElement("option");
        temp_opt.setAttribute("value", interval);
        temp = document.createTextNode(formatTimeStr(interval));
        temp_opt.appendChild(temp);
        time_opt_h.appendChild(temp_opt);
    }
    td.appendChild(time_opt_h);
    temp = document.createTextNode(":");
    td.appendChild(temp);
    time_opt_h = document.createElement("select");
    id = "_nm_timer" + timer_idx + "_start_m";
    time_opt_h.setAttribute("id", id);
    //console.log("id:" + id);
    for(interval = 0; interval < 60; interval += 6) {
        temp_opt = document.createElement("option");
        temp_opt.setAttribute("value", interval);
        temp = document.createTextNode(formatTimeStr(interval));
        temp_opt.appendChild(temp);
        time_opt_h.appendChild(temp_opt);
    }
    td.appendChild(time_opt_h);
    temp = document.createElement("br");
    td.appendChild(temp);

    temp = document.createTextNode(lang.LANG_MISC_NM_CONFIG_ENDTIME);
    td.appendChild(temp);
    temp = document.createElement("br");
    td.appendChild(temp);
    time_opt_h = document.createElement("select");
    id = "_nm_timer" + timer_idx + "_end_h";
    time_opt_h.setAttribute("id", id);
    //console.log("id:" + id);
    for(interval = 0; interval <= 24; interval++) {
        temp_opt = document.createElement("option");
        temp_opt.setAttribute("value", interval);
        temp = document.createTextNode(formatTimeStr(interval));
        temp_opt.appendChild(temp);
        time_opt_h.appendChild(temp_opt);
    }
    td.appendChild(time_opt_h);
    temp = document.createTextNode(":");
    td.appendChild(temp);
    time_opt_h = document.createElement("select");
    id = "_nm_timer" + timer_idx + "_end_m";
    time_opt_h.setAttribute("id", id);
    //console.log("id:" + id);
    for(interval = 0; interval < 60; interval += 6) {
        temp_opt = document.createElement("option");
        temp_opt.setAttribute("value", interval);
        temp = document.createTextNode(formatTimeStr(interval));
        temp_opt.appendChild(temp);
        time_opt_h.appendChild(temp_opt);
    }
    td.appendChild(time_opt_h);
    temp = document.createElement("br");
    td.appendChild(temp);
    return td;
}

function createScheduleWeekdayItem(timer_idx, days, text) {
    "use strict";
    var temp;
    var id = "";
    var td = document.createElement("td");
    td.setAttribute("class", "labelhead");
    td.setAttribute("align", "left");
    temp = document.createElement("input");
    id = "_nm_timer" + timer_idx + "_weekday" + days;
    //console.log("id:" + id);
    temp.setAttribute("id", id);
    temp.setAttribute("type", "checkbox");
    td.appendChild(temp);
    temp = document.createTextNode(text);
    td.appendChild(temp);
    return td;
}

function createScheduleColumn(timer_index, text) {
    "use strict";
    var table = null;
    var row = null;
    var td = null;
    var temp = null;

    table = document.createElement("table");
    table.setAttribute("width", "100%");
    row = document.createElement("tr");
    td = document.createElement("td");
    td.setAttribute("class", "labelhead");
    td.setAttribute("align", "center");
    temp = document.createElement("input");
    //console.log("id:" + "_nm_toggle_timer" + timer_index);
    temp.setAttribute("id", "_nm_toggle_timer" + timer_index);
    temp.setAttribute("type", "checkbox");
    td.appendChild(temp);
    temp = document.createTextNode(text);
    td.appendChild(temp);
    row.appendChild(td);
    table.appendChild(row);

    row = document.createElement("tr");
    td = createScheduleWeekdayItem(timer_index, 1, lang.LANG_MISC_NM_CONFIG_TIMERS_WEEKDAY1);
    row.appendChild(td);
    table.appendChild(row);

    row = document.createElement("tr");
    td = createScheduleWeekdayItem(timer_index, 2, lang.LANG_MISC_NM_CONFIG_TIMERS_WEEKDAY2);
    row.appendChild(td);
    table.appendChild(row);

    row = document.createElement("tr");
    td = createScheduleWeekdayItem(timer_index, 3, lang.LANG_MISC_NM_CONFIG_TIMERS_WEEKDAY3);
    row.appendChild(td);
    table.appendChild(row);

    row = document.createElement("tr");
    td = createScheduleWeekdayItem(timer_index, 4, lang.LANG_MISC_NM_CONFIG_TIMERS_WEEKDAY4);
    row.appendChild(td);
    table.appendChild(row);

    row = document.createElement("tr");
    td = createScheduleWeekdayItem(timer_index, 5, lang.LANG_MISC_NM_CONFIG_TIMERS_WEEKDAY5);
    row.appendChild(td);
    table.appendChild(row);

    row = document.createElement("tr");
    td = createScheduleWeekdayItem(timer_index, 6, lang.LANG_MISC_NM_CONFIG_TIMERS_WEEKDAY6);
    row.appendChild(td);
    table.appendChild(row);

    row = document.createElement("tr");
    td = createScheduleWeekdayItem(timer_index, 7, lang.LANG_MISC_NM_CONFIG_TIMERS_WEEKDAY7);
    row.appendChild(td);
    table.appendChild(row);

    row = document.createElement("tr");
    td = createScheduleTimeItem(timer_index);
    row.appendChild(td);
    table.appendChild(row);
    return table;
}

function createScheduleTable() {
    "use strict";
    var root = document.getElementById("ScheduleTable");
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }

    var table = document.createElement("table");
    var row = document.createElement("tr");
    var td = document.createElement("td");
    var sub_table = null;

    table.setAttribute("id", "NmPwrTimerTable");
    table.setAttribute("border", "1");
    table.setAttribute("cellpadding", "0");
    table.setAttribute("cellspacing", "0");

    sub_table = createScheduleColumn(1, lang.LANG_MISC_NM_CONFIG_TIMERS_1);
    td.appendChild(sub_table);
    row.appendChild(td);

    td = document.createElement("td");
    sub_table = createScheduleColumn(2, lang.LANG_MISC_NM_CONFIG_TIMERS_2);
    td.appendChild(sub_table);
    row.appendChild(td);

    td = document.createElement("td");
    sub_table = createScheduleColumn(3, lang.LANG_MISC_NM_CONFIG_TIMERS_3);
    td.appendChild(sub_table);
    row.appendChild(td);

    td = document.createElement("td");
    sub_table = createScheduleColumn(4, lang.LANG_MISC_NM_CONFIG_TIMERS_4);
    td.appendChild(sub_table);
    row.appendChild(td);

    td = document.createElement("td");
    sub_table = createScheduleColumn(5, lang.LANG_MISC_NM_CONFIG_TIMERS_5);
    td.appendChild(sub_table);
    row.appendChild(td);

    table.appendChild(row);
    root.appendChild(table);
}

function showScheduleTable(show) {
    "use strict";
    var table = document.getElementById("ScheduleTable");
    if(show) {
        table.style.display = 'block';
    }
    else {
        table.style.display = 'none';
    }
}

function geneTimerXML(timer_id) {
    "use strict";

}

function geneXML() {
    "use strict";

}

function readPolicyWeekdayMask(timer_id, weekdays) {
    "use strict";
    //[6] – Repeat suspend period every Sunday.
    //[5] – Repeat suspend period every Saturday.
    //[4] – Repeat suspend period every Friday.
    //[3] – Repeat suspend period every Thursday.
    //[2] – Repeat suspend period every Wednesday.
    //[1] – Repeat suspend period every Tuesday.
    //[0] – Repeat suspend period every Monday.
    var obj_id = "_nm_toggle_timer" + timer_id;
    var enable = document.getElementById(obj_id).checked;
    var day_checked;
    var result = 0;

    if(enable == true) {
        obj_id = "_nm_timer" + timer_id + "_weekday" + weekdays;
        day_checked = document.getElementById(obj_id).checked;
        if(day_checked == true) {
            result = (0x01 << (weekdays - 1));
        }
    }
    return result;
}

//Start time from 0~239 (defined by intel spec.)
function getStartTimeOffset(timer_id) {
    "use strict";
    var obj;
    var result = 0;
    var hour = 0;
    var minute = 0;
    var id = "_nm_timer" + timer_id + "_start_h";
    hour = document.getElementById(id).value;
    id = "_nm_timer" + timer_id + "_start_m";
    minute = document.getElementById(id).value;
    result = parseInt(hour * 60) + parseInt(minute);
    result /= 6;
    return result;
}

//End time from 1~240 (defined by intel spec.)
function getEndTimeOffset(timer_id) {
    "use strict";
    var obj;
    var result = 0;
    var hour = 0;
    var minute = 0;
    var id = "_nm_timer" + timer_id + "_end_h";
    hour = document.getElementById(id).value;
    id = "_nm_timer" + timer_id + "_end_m";
    minute = document.getElementById(id).value;
    result = parseInt(hour * 60) + parseInt(minute);
    result /= 6;
    result += 1;
    return result;
}

function readPolicyTimerTAG(timer_id) {
    "use strict";
    var result = "";
    var idx = 1;
    var dayMask = 0;

    for(idx = 1; idx <= 7; idx++) {
        dayMask += readPolicyWeekdayMask(timer_id, idx);
    }
    //console.log("dayMask:" + dayMask);

    if(dayMask > 0) {
        var start = getStartTimeOffset(timer_id);
        var end = getEndTimeOffset(timer_id);
        result = "    <POLICY_SUSPEND NM_SUSPEND_START" + timer_id +"=\"" + start + "\"" +
                                    " NM_SUSPEND_END" + timer_id + "=\"" + end + "\"" +
                                    " NM_SUSPEND_DAYS" + timer_id + "=\"" + dayMask + "\" />";
    }

    return result;
}

function enableAllFunctions(enable) {
    "use strict";
    var temp = null;
    var toggle = false;
    if(enable == true) {
        toggle = false;
    }
    else {
        toggle = true;
    }
    temp = document.getElementById("HtmlPolicyTable");
    temp.disabled = toggle;
    temp = document.getElementById("_nm_policy_number");
    temp.disabled = toggle;
    temp = document.getElementById("_nm_enable");
    temp.disabled = toggle;
    temp = document.getElementById("_nm_shutdown");
    temp.disabled = toggle;
    temp = document.getElementById("_nm_logevent");
    temp.disabled = toggle;
    temp = document.getElementById("_nm_power_limit");
    temp.disabled = toggle;
    temp = document.getElementById("_optTimersEnable");
    temp.disabled = toggle;
    temp = document.getElementById("_optTimersDisable");
    temp.disabled = toggle;
    temp = document.getElementById("btn_modify");
    temp.disabled = toggle;
    temp = document.getElementById("btn_del");
    temp.disabled = toggle;
    temp = document.getElementById("btn_cancel");
    temp.disabled = toggle;
}

function geneScheduleXML(policy_id, domain, item_count) {
    "use strict";
    var result = "";
    var i= 0;
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <NM_SUSPEND_PERIODS>\n";
    result += "        <POLICY NM_POLICY=\"" + policy_id + "\" NM_DOMAIN=\"" + domain;
    if (item_count != 0) {
        result += "\" NUM_PERIODS=\"" + item_count + "\" />\n";
    } else {
        result += "\" />\n";
    }
    for (i= 0; i< item_count; i++) {
           result += "        <SUSPEND_PERIOD CUR_PERIOD=\"" + suspendTimerData[i][0] + "\" " +
                                             "NM_SUSPEND_START=\"" + suspendTimerData[i][1] + "\" " +
                                             "NM_SUSPEND_END=\"" + suspendTimerData[i][2] + "\" " +
                                             "NM_SUSPEND_DAYS=\"" + suspendTimerData[i][3] + "\" />\n";
    }
    result += "    </NM_SUSPEND_PERIODS>\n";
    result += "</IPMI>\n";
    return result;
}

function geneDeleteConfigXML(policy_id, domain) {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    result += "    <NM_POLICY>\n";
    result += "        <POLICY NM_POLICY=\"" + policy_id + "\" NM_DOMAIN=\"" + domain + "\" CONFIG_ACTION=\"0\" />\n";
    result += "    </NM_POLICY>\n";
    result += "</IPMI>\n";
    return result;
}

function genePolicyConfigXML(policy_id, domain, isEnable, isShutdown, isLogEvent, power_limit, config_action) {
    "use strict";
    //<?xml version="1.0"?>
    //<IPMI>
    //    <NM_POLICY>
    //        <POLICY NM_POLICY="1" NM_DOMAIN="0" />
    //    </NM_POLICY>
    //</IPMI>

    var result = "";
    if(policy_id != null && domain != null) {
        result += "<?xml version=\"1.0\"?>\n";
        result += "<IPMI>\n";
        result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
        result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
        result += "    <NM_POLICY>\n";
        result += "        <POLICY NM_POLICY=\"" + policy_id + "\" NM_DOMAIN=\"" + domain;
        if(isEnable != undefined) {
           result+=  "\" NM_ENABLED=\"" + isEnable;
           result+=  "\" NM_SHUTDOWN=\"" + isShutdown;
           result+=  "\" NM_ALERT=\"" + isLogEvent;
           result+=  "\" NM_POWERLIMIT=\"" + power_limit;
           result+=  "\" CONFIG_ACTION=\"" + config_action;
        }
        result += "\" />\n";
        result += "    </NM_POLICY>\n";
        result += "</IPMI>\n";
    }
    return result;
}

function fakePolicyTableXML() {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += '<PRIV>' + top.frames.topmenu.PRIV_ID + '</PRIV>\n';
    result += "    <NM_POLICY>\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"3\" NM_DOMAIN=\"3\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"660\" NUM_PERIODS=\"0\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"4\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"5\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"6\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"7\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"8\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"9\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"100\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"101\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"102\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"104\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "        <POLICY COMP_CODE=\"0\" NM_POLICY=\"105\" NM_DOMAIN=\"0\" NM_ENABLED=\"1\" NM_SHUTDOWN=\"0\" NM_ALERT=\"1\" NM_POWERLIMIT=\"990\" NUM_PERIODS=\"2\" />\n";
    result += "    </NM_POLICY>\n";
    result += "</IPMI>\n";
    return result;
}

function fakePolicyScheduleXML() {
    "use strict";
    var result = "";
    result += "<?xml version=\"1.0\"?>\n";
    result += "<IPMI>\n";
    result += "    <NM_SUSPEND_PERIODS>\n";
    result += "        <POLICY COMP_CODE=\"0\" NUM_PERIODS=\"3\" />\n";
    result += "        <SUSPEND_PERIOD CUR_PERIOD=\"0\" NM_SUSPEND_START=\"26\" NM_SUSPEND_END=\"195\" NM_SUSPEND_DAYS=\"127\" />\n";
    result += "        <SUSPEND_PERIOD CUR_PERIOD=\"2\" NM_SUSPEND_START=\"123\" NM_SUSPEND_END=\"195\" NM_SUSPEND_DAYS=\"127\" />\n";
    result += "        <SUSPEND_PERIOD CUR_PERIOD=\"4\" NM_SUSPEND_START=\"185\" NM_SUSPEND_END=\"195\" NM_SUSPEND_DAYS=\"5\" />\n";
    result += "    </NM_SUSPEND_PERIODS>\n";
    result += "</IPMI>\n";
    return result;
}

function responsePolicyTable(originalRequest) {
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
            Loading(false);
            return;
        }
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_MISC_POWER_TELEMETRY_ERR1);
            enableAllFunctions(false);
            Loading(false);
            return;
        } else if (result == "NODE_BUSY") {
            alert(lang.LANG_MISC_NM_CONFIG_ERR5);
            enableAllFunctions(false);
            Loading(false);
            return;
        }

        var idx;
        var root = xmldoc.documentElement;
        var policies = root.getElementsByTagName("POLICY");
        var nm_code;
        var nm_id;
        var nm_domain;
        var nm_enable;
        var nm_shutdown;
        var nm_alert;
        var nm_powerlimit;
        var nm_periods;
        var node;
        var RowData = [];

        //console.log("num of policies:" + policies.length);
        for(idx = 0; idx < policies.length; idx++) {
            node = policies[idx];
            nm_code       = node.getAttribute("COMP_CODE");
            nm_id         = node.getAttribute("NM_POLICY");
            nm_domain     = node.getAttribute("NM_DOMAIN");
            nm_enable     = node.getAttribute("NM_ENABLED");
            nm_shutdown   = node.getAttribute("NM_SHUTDOWN");
            nm_alert      = node.getAttribute("NM_ALERT");
            nm_powerlimit = node.getAttribute("NM_POWERLIMIT");
            nm_periods    = node.getAttribute("NUM_PERIODS");

            PolicyTableArray[idx] = [];
            PolicyTableArray[idx][0] = nm_id;
            PolicyTableArray[idx][1] = nm_powerlimit;
            PolicyTableArray[idx][2] = nm_periods;
            PolicyTableArray[idx][3] = nm_enable;
            PolicyTableArray[idx][4] = nm_domain;
            PolicyTableArray[idx][5] = nm_shutdown;
            PolicyTableArray[idx][6] = nm_alert;
            PolicyTableArray[idx][7] = nm_code;
        }

        PolicyTableArray.sort(sort_nm_id);
        idx = 0;
        while(idx < policies.length) {
              if ((PolicyTableArray[idx][0] == '0' &&
                   PolicyTableArray[idx][4] == HW_Protection) ||
                  (PolicyTableArray[idx][0] == '1' &&
                   PolicyTableArray[idx][4] == Memory_subsystem))
              {
                  PolicyTableArray[idx][0] += '*';
              }
              RowData.push([idx,
                            PolicyTableArray[idx][0],
                            PolicyTableArray[idx][2],
                            PolicyTableArray[idx][3],
                            PolicyTableArray[idx][5],
                            PolicyTableArray[idx][6],
                            PolicyTableArray[idx][1]]);
              idx++;
        }

        GridTable.empty();
        GridTable.show(RowData);
        //console.log("test:" + lang.LANG_MISC_NM_CONFIG_EXTRATBLINFO+(MaxPolicyTableRows)+lang.LANG_MISC_NM_CONFIG_POLICYUNIT);

        var objTableInfo = document.getElementById("HtmlPolicyTableInfo");
        if (objTableInfo != null) {
            objTableInfo.textContent = lang.LANG_MISC_NM_CONFIG_EXTRATBLINFO +
                                       (policies.length) +
                                       lang.LANG_MISC_NM_CONFIG_POLICYUNIT;
        }
        Loading(false);
    }
}

function sort_nm_id(a, b)
{
    "use strict";
    return a[0] - b[0];
}

function updateScheduleInfo(timer_id, start, end, weekdays) {
    "use strict";
    var id;
    var node;
    var idx;
    var mask;
    var maskCheck;
    var hour;
    var minute;

    id = "_nm_toggle_timer" + timer_id;
    //console.log("timer id:" + timer_id + " id:" + id + " weekdays:" + weekdays);
    node = document.getElementById(id);
    node.checked = true;

    for(idx = 0; idx < 7; idx++) {
        mask = (0x01 << idx);
        maskCheck = (parseInt(weekdays) & mask);
        if(maskCheck > 0) {
            //console.log("checked weekdays " + idx + " mask:" + mask + " result:" + maskCheck);
            id = "_nm_timer" + timer_id + "_weekday" + (idx + 1);
            node = document.getElementById(id);
            node.checked = true;
        }
    }

    hour = parseInt(parseInt(start) / 10);
    id = "_nm_timer" + timer_id + "_start_h";
    node = document.getElementById(id);
    node.value = hour;

    minute = parseInt(parseInt(start) % 10) * 6;
    id = "_nm_timer" + timer_id + "_start_m";
    node = document.getElementById(id);
    node.value = minute;

    hour = parseInt(parseInt(end) / 10);
    id = "_nm_timer" + timer_id + "_end_h";
    node = document.getElementById(id);
    node.value = hour;

    minute = parseInt(parseInt(end) % 10) * 6;
    id = "_nm_timer" + timer_id + "_end_m";
    node = document.getElementById(id);
    node.value = minute;
    enableSuspendTimer(timer_id);
}

function responseWritePolicySchedule(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if (xmldoc == null) {
            //SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if(result == "OK") {
           requestPolicyInfo();
           alert(lang.LANG_MISC_NM_UPDATE_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS});
        }
        else {
           alert(lang.LANG_MISC_NM_UPDATE_FAIL);
        }
    }
}

function responsePolicyScheduleTable(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if (xmldoc == null) {
            //SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var idx;
        var root = xmldoc.documentElement;
        var schedules = root.getElementsByTagName("SUSPEND_PERIOD");
        var node;
        var timer_id;
        var nm_start;
        var nm_end;
        var nm_weekdays;

        //console.log("num of schedules:" + schedules.length);
        //<SUSPEND_PERIOD CUR_PERIOD=\"0\" NM_SUSPEND_START=\"0\" NM_SUSPEND_END=\"195\" NM_SUSPEND_DAYS=\"1\" />\n";
        for(idx = 0; idx < schedules.length; idx++) {
            node = schedules[idx];
            timer_id = node.getAttribute("CUR_PERIOD");
            timer_id = parseInt(timer_id) + 1;
            nm_start = node.getAttribute("NM_SUSPEND_START");
            nm_end = node.getAttribute("NM_SUSPEND_END");
            nm_weekdays = node.getAttribute("NM_SUSPEND_DAYS");
            updateScheduleInfo(timer_id, nm_start, nm_end, nm_weekdays);
        }
    }
}
/*
function responsePolicySelfTest(originalRequest) {
    //Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //<?xml version="1.0"?>
        //<IPMI>
        //    <NM_GET_SELF_TEST>
        //        <SELF_TEST COMP_CODE="0" GST_BYTE1="85" GST_BYTE2="0"/>
        //    </NM_GET_SELF_TEST>
        //</IPMI>
        var xmldoc = GetResponseXML(response);
        if (xmldoc == null) {
            SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var root = xmldoc.documentElement;
        var nodes = xmldoc.getElementsByTagName("SELF_TEST");
        var passed = false;
        if(nodes != null && nodes.length > 0) {
            var comp_code = nodes[0].getAttribute("COMP_CODE");
            var gst_byte1 = nodes[0].getAttribute("GST_BYTE1");
            var gst_byte2 = nodes[0].getAttribute("GST_BYTE2");
            if(comp_code == "0" && gst_byte1 == "85" && gst_byte2 == "0") {
                //self test passed.
                passed = true;
                //console.log("self test passed");
            }
            else {
                passed = true;
                //fail to self test.
                //console.log("self test fail");
            }
        }

        if(passed == false) {
            alert (lang.LANG_MISC_NM_CONFIG_SELF_TEST_FAIL);
            enableAllFunctions(false);
        }
        mSelfTest = passed;
    }
}
*/

function responseCompleteDel(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        //console.log("responseCompleteDel:" + response);
        var xml_obj = GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }
        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if(result == "OK") {
           document.getElementById("btn_del").disabled = true;
           disableTimer();
           requestPolicyInfo();
           alert(lang.LANG_MISC_NM_DELETE_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS});
        }
        else {
           alert(lang.LANG_MISC_NM_DELETE_FAIL);
        }
    }
    //location.reload();
}

function responseCompleteWrite(originalRequest) {
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xml_obj = GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }
        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "OK") {
            if (mWritePolicyID != null && mWritePolicyDomain != null && mItem_Count != 0) {
                //alert("request to save suspend timer.");
                writePolicyScheduleInfo(mWritePolicyID, mWritePolicyDomain, mItem_Count);
            }
            else {
                requestPolicyInfo();
                alert(lang.LANG_MISC_NM_UPDATE_SUCCESS, {title: lang.LANG_GENERAL_SUCCESS});
            }
        }
        else {
            var node = xml_obj.documentElement.getElementsByTagName("RESULT");
            var nm_code = node[0].getAttribute("COMP_CODE");
            if (nm_code == 84) {
                alert(lang.LANG_MISC_NM_CONFIG_ERR4);
            }
            else {
                alert(lang.LANG_MISC_NM_UPDATE_FAIL);
            }
        }
    }
    //location.reload();
}

function loadPolicyRecord(index) {
    "use strict";
    var temp = null;
    disableSuspendTimer();
    if (PolicyTableArray.length > index && index >= 0) {
        temp = document.getElementById("_nm_policy_number");
        temp.value = parseInt(PolicyTableArray[index][0]);

        temp = document.getElementById("_nm_enable");
        if(PolicyTableArray[index][3] == "1") {
            temp.checked = true;
        }
        else {
            temp.checked = false;
        }

        temp = document.getElementById("_nm_shutdown");
        if(PolicyTableArray[index][5] == "1") {
            temp.checked = true;
        }
        else {
            temp.checked = false;
        }

        temp = document.getElementById("_nm_logevent");
        if(PolicyTableArray[index][6] == "1") {
            temp.checked = true;
        }
        else {
            temp.checked = false;
        }

        temp = document.getElementById("_nm_power_limit");
        temp.value = PolicyTableArray[index][1];

        if (parseInt(PolicyTableArray[index][2]) > 0) {
            temp = document.getElementById("_optTimersEnable");
            temp.checked = true;
            var policy_id = parseInt(GetSelectedRowCellInnerHTML(0));
            requestPolicyScheduleInfo(policy_id, "0");
            showScheduleTable(true);
        }
        else {
            temp = document.getElementById("_optTimersDisable");
            temp.checked = true;
            showScheduleTable(false);
        }
    }
}

function requestPolicyInfo() {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/nmpolicy.cgi';
    var ajax_param = '';
    var ajax_data = genePolicyConfigXML("0", "0");
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'POST',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      onComplete: responsePolicyTable }//register callback function
                                   );
}

function requestPolicyScheduleInfo(policy_id, domain) {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/nmsuspendperiods.cgi';
    var ajax_param = '';
    var ajax_data = geneScheduleXML(policy_id, domain, 0);
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'POST',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      onComplete: responsePolicyScheduleTable }//register callback function
                                   );
}

function writePolicyScheduleInfo(policy_id, domain, item_count) {
    "use strict";
    Loading(true);
    var ajax_url = '../cgi/nmsuspendperiods.cgi';
    var ajax_param = '';
    var ajax_data = geneScheduleXML(policy_id, domain, item_count);
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'PUT',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      onComplete: responseWritePolicySchedule }//register callback function
                                   );
}

function requestDeletePolicy(policy_id, domain) {
    "use strict";
    UtilsConfirm(lang.LANG_MISC_NM_CONFIG_DEL, {
        onOk: function() {
            "use strict";
            Loading(true);
            policy_id = parseInt(GetSelectedRowCellInnerHTML(0));
            var ajax_url = '../cgi/nmpolicy.cgi';
            var ajax_param = '';
            //var ajax_data = geneScheduleXML(policy_id, domain);
            var ajax_data = geneDeleteConfigXML(policy_id, domain);
            var ajax_req = new Ajax.Request(ajax_url,
                                            { method: 'UPDATE',
                                              contentType: "text/xml",
                                              xml_data: ajax_data,
                                              parameters: ajax_param,
                                              timeout: g_CGIRequestTimeout,
                                              ontimeout: onCGIRequestTimeout,
                                              onComplete: responseCompleteDel }//register callback function
                                           );
        }
    });
}

function requestWritePolicyInfo(policy_id, domain, isEnable, isShutdown, isLogEvent, power_limit, config_action) {
    "use strict";
    var ajax_url = '../cgi/nmpolicy.cgi';
    var ajax_param = '';
    var ajax_data = genePolicyConfigXML(policy_id, domain, isEnable, isShutdown, isLogEvent, power_limit, config_action);

    var optEnabler = document.getElementById("_optTimersEnable");
    if (optEnabler.checked == true) {
        mWritePolicyID = policy_id;
        mWritePolicyDomain = domain;
        mItem_Count = 0;
        var timer_num = 0, weekday_num = 0;
        suspendTimerData = new Array();
        var timerID = 0

        for (timer_num = 0; timer_num < 5; timer_num++) {
             var timer_days = 0;
             if (document.getElementById("_nm_toggle_timer" + (timer_num +1)).checked) {
                 var timer_start = (parseInt(document.getElementById("_nm_timer" + (timer_num +1) + "_start_h").value) * 60 +
                                    parseInt(document.getElementById("_nm_timer" + (timer_num +1) + "_start_m").value)) / 6;
                 var timer_end   = (parseInt(document.getElementById("_nm_timer" + (timer_num +1) + "_end_h").value) * 60 +
                                    parseInt(document.getElementById("_nm_timer" + (timer_num +1) + "_end_m").value)) / 6;
                 if ((timer_end == 0) || (timer_end < timer_start)) {
                     alert(lang.LANG_MISC_NM_CONFIG_ERR3);
                     return;
                 }
                 for (weekday_num = 7; weekday_num > 0; weekday_num--) {
                      timer_days <<= 1;
                      if (document.getElementById("_nm_timer" + (timer_num +1) + "_weekday" + (weekday_num)).checked) {
                          timer_days += 1;
                      }
                 }
                 suspendTimerData.push(new Array(timerID++, timer_start, timer_end, parseInt(timer_days)));
                 mItem_Count++;
             }
        }
    } else {
        mWritePolicyID = null;
        mWritePolicyDomain = null;
        mItem_Count = 0;
    }
    Loading(true);
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'PUT',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      timeout: g_CGIRequestTimeout,
                                      ontimeout: onCGIRequestTimeout,
                                      onComplete: responseCompleteWrite }//register callback function
                                   );
}
/*
function requestNMSelfTest() {
    //Loading(true);
    var ajax_url = '../cgi/nmselftest.cgi';
    var ajax_param = 'time_stamp='+ (new Date());
    var ajax_data = GeneGenericRequestXML();
    var ajax_req = new Ajax.Request(ajax_url,
                                    { method: 'POST',
                                      contentType: "text/xml",
                                      xml_data: ajax_data,
                                      parameters: ajax_param,
                                      onComplete: responsePolicySelfTest }//register callback function
                                   );
}
*/
function toggleSuspendTimer(timer_id) {
    "use strict";
    var i = 0;
    if (document.getElementById("_nm_toggle_timer" + timer_id).checked) {
        for (i = 1; i<= 7; i++) {
             document.getElementById("_nm_timer" + timer_id +"_weekday" + i).disabled = false;
        }
        document.getElementById("_nm_timer" + timer_id + "_start_h").disabled = false;
        document.getElementById("_nm_timer" + timer_id + "_start_m").disabled = false;
        document.getElementById("_nm_timer" + timer_id + "_end_h").disabled = false;
        document.getElementById("_nm_timer" + timer_id + "_end_m").disabled = false;
    } else {
        for (i = 1; i<= 7; i++) {
             document.getElementById("_nm_timer" + timer_id +"_weekday" + i).disabled = true;
        }
        document.getElementById("_nm_timer" + timer_id + "_start_h").disabled = true;
        document.getElementById("_nm_timer" + timer_id + "_start_m").disabled = true;
        document.getElementById("_nm_timer" + timer_id + "_end_h").disabled = true;
        document.getElementById("_nm_timer" + timer_id + "_end_m").disabled = true;
    }
}

function disableSuspendTimer() {
    "use strict";
    var i, j;
    for (i = 1; i<= 5; i++) {
         document.getElementById("_nm_toggle_timer" + i).checked = false;
         for (j = 1; j<= 7; j++) {
              document.getElementById("_nm_timer" + i +"_weekday" + j).disabled = true;
              document.getElementById("_nm_timer" + i +"_weekday" + j).checked = false;
         }
         document.getElementById("_nm_timer" + i + "_start_h").disabled = true;
         document.getElementById("_nm_timer" + i + "_start_m").disabled = true;
         document.getElementById("_nm_timer" + i + "_end_h").disabled = true;
         document.getElementById("_nm_timer" + i + "_end_m").disabled = true;
         document.getElementById("_nm_timer" + i + "_start_h").checked = false;
         document.getElementById("_nm_timer" + i + "_start_m").checked = false;
         document.getElementById("_nm_timer" + i + "_end_h").checked = false;
         document.getElementById("_nm_timer" + i + "_end_m").checked = false;
         document.getElementById("_nm_timer" + i + "_start_h").value = 0;
         document.getElementById("_nm_timer" + i + "_start_m").value = 0;
         document.getElementById("_nm_timer" + i + "_end_h").value = 0;
         document.getElementById("_nm_timer" + i + "_end_m").value = 0;
    }
}

function enableSuspendTimer(timer_id) {
    "use strict";
    var j;
    for (j = 1; j<= 7; j++) {
         document.getElementById("_nm_timer" + timer_id +"_weekday" + j).disabled = false;
    }
    document.getElementById("_nm_timer" + timer_id + "_start_h").disabled = false;
    document.getElementById("_nm_timer" + timer_id + "_start_m").disabled = false;
    document.getElementById("_nm_timer" + timer_id + "_end_h").disabled = false;
    document.getElementById("_nm_timer" + timer_id + "_end_m").disabled = false;
}
