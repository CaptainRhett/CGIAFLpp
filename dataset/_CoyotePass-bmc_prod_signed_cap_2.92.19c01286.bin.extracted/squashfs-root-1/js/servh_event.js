"use strict";
// declare all global variables
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        "use strict";
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function(e) {
        "use strict";
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) { t = t + String.fromCharCode(r) }
            if (a != 64) { t = t + String.fromCharCode(i) }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function(e) {
        "use strict";
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        "use strict";
        var t = "";
        var n = 0;
        var r = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

var requestStatus = {isInProgress: false, isReachTail: false, freeUnit: 0};

var MAX_REQUEST_SIZE = 200;

var sel_buf = [];
var SelCapacity = 0;
var SelTotalCount = 0;

var SelToDisplay = "ALL";
var SelDisplayCount = 0;

var currentPage = 0;
var SelMaxPage = 0;
var pageSize = 50;
var startIndex = 0;

var GridTable;
var sel_clear_log_btn;
var sel_save_log_btn;
var sel_refresh_btn;
var selPageUp;
var selPageDown;
var selPageTop;
var selPageBottom;
var sel_evt_type;
var selCount;
var pageSelCount;
var selFull;
var selMeter;
var fullNotice;
var selSelect;
var selSelectSize;
var event_log_page_select;
var severity_infor_chkbox;
var severity_warning_chkbox;
var severity_critical_chkbox;

function PageInit() {
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/servh_event_hlp.html";
    document.title = lang.LANG_EVENT_LOG_TITLE;


    sel_clear_log_btn = document.getElementById("sel_clear_log_btn");
    sel_clear_log_btn.setAttribute("value", lang.LANG_EVENT_CLEARBTN);
    sel_clear_log_btn.onclick = SELClearTaskCheck;

    sel_save_log_btn = document.getElementById("sel_save_log_btn");
    sel_save_log_btn.setAttribute("value", lang.LANG_EVENT_SAVEBTN);
    sel_save_log_btn.onclick = SELsaving;

    sel_refresh_btn = document.getElementById("sel_refresh_btn");
    sel_refresh_btn.setAttribute("value", lang.LANG_EVENT_REFRESHBTN);
    sel_refresh_btn.onclick = SELQueryMainTask;

    selPageUp = document.getElementById("selPageUp");
    selPageUp.setAttribute("value", "<");
    selPageUp.onclick = changePageHandler;

    selPageDown = document.getElementById("selPageDown");
    selPageDown.setAttribute("value", ">");
    selPageDown.onclick = changePageHandler;

    selPageTop = document.getElementById("selPageTop");
    selPageTop.setAttribute("value", "<<");
    selPageTop.onclick = changePageHandler;

    selPageBottom = document.getElementById("selPageBottom");
    selPageBottom.setAttribute("value", ">>");
    selPageBottom.onclick = changePageHandler;

    sel_evt_type = document.getElementById("sel_evt_type");
    selCount = document.getElementById("selCount");
    pageSelCount = document.getElementById("pageSelCount");
    selFull = document.getElementById("selFull");
    selMeter = document.getElementById("selMeter");
    fullNotice = document.getElementById("fullNotice");
    selSelect = document.getElementById("selSelect");
    selSelectSize = document.getElementById("selSelectSize");

    event_log_page_select = document.getElementById("event_log_page_select");
    event_log_page_select.textContent = lang.LANG_EVENT_ENTRIES_PER_PAGE;

    severity_infor_chkbox = document.getElementById("severity_infor_chkbox");
    severity_infor_chkbox.onclick = filterSelHandler;
    severity_warning_chkbox = document.getElementById("severity_warning_chkbox");
    severity_warning_chkbox.onclick = filterSelHandler;
    severity_critical_chkbox = document.getElementById("severity_critical_chkbox");
    severity_critical_chkbox.onclick = filterSelHandler;

    OutputString();
    selectSizeInit();
    selectCategoryInit();

    // check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("event_heading_div").textContent = lang.LANG_EVENT_HEADING;
    document.getElementById("event_log_desc_lbl").textContent = lang.LANG_EVENT_LOG_DESC;
    document.getElementById("log_severity_type_lbl").textContent = lang.LANG_EVENT_LOG_SEVERITY_TYPE;
    document.getElementById("alert_info_lbl").textContent = lang.LANG_MODALERT_INFO;
    document.getElementById("alert_warn_lbl").textContent = lang.LANG_MODALERT_WARN;
    document.getElementById("alert_critical_lbl").textContent = lang.LANG_MODALERT_CRITICAL;
    //document.getElementById("per_page_lbl").textContent = lang.LANG_EVENT_ENTRIES_PER_PAGE;
    document.getElementById("log_selcount_lbl").textContent = lang.LANG_EVENT_LOG_SELCOUNT;
}

function selectSizeInit() {
    "use strict";
    var pageSizeOption = [50, 100, 200, 500];

    for (var i = 0; i < pageSizeOption.length; i++) {
        selSelectSize.add(new Option(pageSizeOption[i], pageSizeOption[i]),
            browser_ie ? i : null);
    }

    selSelectSize.selectedIndex = 0;

    selSelectSize.onchange = function() {
        "use strict";
        Loading(true);
        button_all_disable();

        currentPage = 0;
        pageSize = selSelectSize.value;
        SelMaxPage = Math.ceil(SelDisplayCount / pageSize);

        refreshDisplay();
    };
}

function selectCategoryInit() {
    "use strict";
    var eventCategory = {
        "BMC": lang.LANG_EVENT_OPTION_SENSOR_EVENT,
        "BIOS": lang.LANG_EVENT_OPTION_BIOS_EVENT,
        "System Management Software": lang.LANG_EVENT_OPTION_SYS_MAN_SW_EVENT,
        "ALL": lang.LANG_EVENT_OPTION_ALL
    };

    var i = 0;
    for (var prop in eventCategory) {
        sel_evt_type.add(new Option(eventCategory[prop], prop),
            browser_ie ? i : null);
        i++;
    }

    sel_evt_type.selectedIndex = 3;
    sel_evt_type.onchange = filterSelHandler;
}

function SELQueryMainTask() {
    "use strict";
    Loading(true);
    button_all_disable();

    currentPage = 0;
    SelMaxPage = 0;
    sel_buf = [];
    SelDisplayCount = 0;
    SelTotalCount = 0;

    requestStatus.isInProgress = false;
    requestStatus.isReachTail = false;

    selSelect.textContent = (currentPage + 1) + " / " + (SelMaxPage || 1);

    getPartialSEL(0xFFFF, MAX_REQUEST_SIZE);
    refreshDisplay();
}

function changePageHandler() {
    "use strict";
    Loading(true);
    button_all_disable();

    if ('selPageUp' == this.id) {
        currentPage -= 1;
    } else if ('selPageDown' == this.id) {
        currentPage += 1;
    } else if ('selPageTop' == this.id) {
        currentPage = 0;
    } else if ('selPageBottom' == this.id) {
        currentPage = SelMaxPage - 1;
    }

    refreshDisplay();
}

function filterSelHandler() {
    "use strict";
    Loading(true);
    button_all_disable();

    currentPage = 0;
    eventLogFilter();
    refreshDisplay();
}


function eventLogFilter() {
    "use strict";
    var filtered_log = [];
    var EvtCategory = sel_evt_type.value;
    var EvtSeverity = "";

    if (severity_infor_chkbox.checked)
        EvtSeverity += "Informational ";
    if (severity_warning_chkbox.checked)
        EvtSeverity += "Warning ";
    if (severity_critical_chkbox.checked)
        EvtSeverity += "Critical";

    if (EvtCategory != "ALL" || EvtSeverity) {
        sel_buf.forEach(function(x, i) {
            "use strict";
            if (("ALL" == EvtCategory || EvtCategory == x.CONTR) &&
                ("" == EvtSeverity || EvtSeverity.search(x.SEVERITY) != -1)) {
                filtered_log.push(i);
            }
        });

        SelToDisplay = filtered_log;
        SelDisplayCount = filtered_log.length;
    } else {
        SelToDisplay = "ALL";
        SelDisplayCount = sel_buf.length;
    }

    SelMaxPage = Math.ceil(SelDisplayCount / pageSize);
    selSelect.textContent = (currentPage + 1) + " / " + (SelMaxPage || 1);
}

function refreshStatisticsDisplay() {
    "use strict";
    var usedpct = Math.floor(SelTotalCount / SelCapacity * 100);

    if (usedpct == 100) {
        fullNotice.style.display = "inline";
        fullNotice.className = "text_alert_warning";
        fullNotice.textContent = lang.LANG_EVENT_LOG_SELFULL;
    } else {
        fullNotice.style.display = "none";
    }

    selFull.textContent = lang.LANG_EVENT_LOG_SELPERCENT1 + usedpct + lang.LANG_EVENT_LOG_SELPERCENT2;
    selCount.textContent = SelTotalCount + lang.LANG_EVENT_EVENT_COUNT_STR;

    if (usedpct < 75) {
        selFull.className = "text_alert_normal";
    } else {
        selFull.className = "text_alert_critical";
    }

    selMeter.style.width = (2 * usedpct) + "px";
}

function refreshDisplay() {
    "use strict";
    var selToShow = [];

    var severityString = function (severity) {
        "use strict";
        switch (severity) {
            case 'Informational':
                return lang.LANG_MODALERT_INFO;
                break;
            case 'Warning':
                return lang.LANG_MODALERT_WARN;
                break;
            case 'Critical':
                return lang.LANG_MODALERT_CRITICAL;
                break;
            default:
                return lang.LANG_EVENT_UNKNOWN;
        }
    }

    selSelect.textContent = (currentPage + 1) + " / " + (SelMaxPage || 1);

    startIndex = currentPage * pageSize;
    if ("ALL" == SelToDisplay) {
        for (var i = startIndex; i < (pageSize - 0 + startIndex); i++) {
            if (i >= sel_buf.length) {
                break;
            }

            selToShow.push(i);
        }
    } else {
        selToShow = SelToDisplay.slice(startIndex, startIndex + parseInt(pageSize));
    }

    if (requestStatus.isInProgress && selToShow.length < pageSize) {
        setTimeout(refreshDisplay, 1000);

        if (GridTable.data.length == selToShow.length) {
            return;
        }
    }

    selToShow.forEach(function(val, index, arr) {
        "use strict";
        arr[index] = [index + 1,
                      sel_buf[val].RECORD_ID,
                      sel_buf[val].TIME,
                      sel_buf[val].SNSR_NAME,
                      sel_buf[val].CONTR,
                      severityString(sel_buf[val].SEVERITY),
                      sel_buf[val].SNSR_TYPE,
                      sel_buf[val].DESCR];
    });

    pageSelCount.textContent = lang.LANG_EVENT_LOG_PAGE_SELCOUNT +
        selToShow.length +
        lang.LANG_EVENT_EVENT_COUNT_STR;

    GridTable.empty();
    GridTable.show(selToShow);

    Loading(requestStatus.isInProgress);
    button_all_restore();
}

function getPartialSEL(index, count) {
    "use strict";
    requestStatus.isInProgress = true;

    var url = '/cgi/getsel.cgi';
    var pars = 'time_stamp=' + (new Date());
    var ajax_data = "";
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<IPMI>\n";
    ajax_data += "    <LANG>" + lang_setting + "</LANG>\n";
    ajax_data += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
    ajax_data += "    <INDEX>" + index + "</INDEX>\n";
    ajax_data += "    <COUNT>" + count + "</COUNT>\n";
    ajax_data += "</IPMI>\n";

    var myAjax = new Ajax.Request(url, {
        method: 'post',
        contentType: "text/xml",
        xml_data: ajax_data,
        timeout: g_CGIRequestTimeout * 3,
        ontimeout: onCGIRequestTimeout,
        parameters: pars,
        onComplete: SELQueryResponse
    });
}

function SELQueryResponse(originalRequest) {
    "use strict";
    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xml_obj = GetResponseXML(response);

        if (xml_obj == null) {
            SessionTimeout();
            return;
        } else if (CheckInvalidResult(xml_obj) < 0) {
            // check session & privilege
            return;
        }

        var result = GetXMLNodeValue(xml_obj, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_NULLXML_SESSION_TIMEOUT);
            return;
        }

        var IPMIRoot = xml_obj.documentElement;
        var SEL_INFO = IPMIRoot.getElementsByTagName('SEL_INFO');

        requestStatus.freeUnit = parseInt(SEL_INFO[0].getAttribute('FREE_UNITS'));
        SelCapacity = parseInt(SEL_INFO[0].getAttribute('TOTAL_UNITS'));

        var SEL = SEL_INFO[0].getElementsByTagName('SEL');

        var rspSel = [];

        for (var i = 0; i < SEL.length; i++) {
            var sel_entry = {
                    'RECORD_ID': null,
                    'TIME': null,
                    'CONTR': null,
                    'SNSR_TYPE': null,
                    'SNSR_ID': null,
                    'MFR_ID': null,
                    'SNSR_NAME': null,
                    'DESCR': null,
                    'SEVERITY': null
                };

            for (var prop in sel_entry) {
                sel_entry[prop] = Base64.decode(SEL[i].getAttribute(prop));
            }

            switch (sel_entry.SEVERITY) {
                case 'OK':
                    sel_entry.SEVERITY = 'Informational';
                    break;
                case 'Non-Critical':
                    sel_entry.SEVERITY = 'Warning';
                    break;
                case 'Non-Recoverable':
                case 'Critical':
                    sel_entry.SEVERITY = 'Critical';
                    break;
                default:
                    sel_entry.SEVERITY = 'Unknown';
            }

            rspSel.unshift(sel_entry);
        }

        if (rspSel.length > 0) {
            if (sel_buf.length == 0 || !requestStatus.isReachTail) {
                SelTotalCount = Array.prototype.push.apply(sel_buf, rspSel);
            } else {
                SelTotalCount = Array.prototype.unshift.apply(sel_buf, rspSel);
            }

            refreshStatisticsDisplay();
            eventLogFilter();
        } else {
            requestStatus.isReachTail = true;
        }

        if (SEL_INFO[0].getAttribute('REACH_TAIL') != null) {
            requestStatus.isReachTail = true;
        }
    }

    if (!requestStatus.isReachTail) {
        startIndex = sel_buf[SelTotalCount - 1].RECORD_ID - 1;
        if (startIndex == 0) {
            startIndex = 0xFFFE;
        }
        getPartialSEL(startIndex, MAX_REQUEST_SIZE);
    } else if (requestStatus.freeUnit == 0 && SelTotalCount < SelCapacity) {
        SelCount = SelCapacity - SelTotalCount;
        if (SelCount > MAX_REQUEST_SIZE) {
            SelCount = MAX_REQUEST_SIZE;
        }
        getPartialSEL((sel_buf[0].RECORD_ID - 0 + SelCount) % 0xFFFE, SelCount);
    } else {
        requestStatus.isInProgress = false;
        refreshDisplay();
    }
}


function saveEventLog() {
    "use strict";
    Loading(true);
    button_all_disable();

    var url = '/cgi/savesel.cgi';
    var pars = 'time_stamp=' + (new Date());
    var ajax_data = GeneGenericRequestXML();

    var myAjax = new Ajax.Request(url, {
        method: 'post',
        contentType: "text/xml",
        xml_data: ajax_data,
        timeout: g_CGIRequestTimeout * 3,
        ontimeout: onCGIRequestTimeout,
        parameters: pars,
        onComplete: EventLogSaved
    });
}

function EventLogSaved(originalRequest) {
    "use strict";
    Loading(false);
    button_all_restore();

    if (originalRequest != null &&
        originalRequest.readyState == 4 &&
        originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xmldoc = GetResponseXML(response);
        if (xmldoc == null) {
            SessionTimeout();
            return;
        }

        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_NULLXML_SESSION_TIMEOUT);
        }

        savedEvent();
    }
}

function SELsaving() {
    "use strict";
    saveEventLog();
}

function savedEvent() {
    "use strict";
    location.href = "/cgi/savesel.cgi";
}

function SELTableInit() {
    "use strict";
    var TableTitles = [
        // name, width, text-align, min-width
        ["Event ID", "7%", "left"],
        ["Timestamp", "13%", "left", "105px"],
        ["Sensor Name", "10%", "left"],
        ["Controller", "10%", "left"],
        ["Severity", "10%", "left", "100px"],
        ["Sensor Type", "20%", "left"],
        ["Description", "30%", "left"]
    ];
    //replace table header content with string table
    TableTitles[0][0] = lang.LANG_EVENT_TABLE_HEADTITLE0;
    TableTitles[1][0] = lang.LANG_EVENT_TABLE_HEADTITLE1;
    TableTitles[2][0] = lang.LANG_EVENT_TABLE_HEADTITLE2;
    TableTitles[3][0] = lang.LANG_EVENT_TABLE_HEADTITLE3;
    TableTitles[4][0] = lang.LANG_EVENT_TABLE_HEADTITLE4;
    TableTitles[5][0] = lang.LANG_EVENT_TABLE_HEADTITLE5;
    TableTitles[6][0] = lang.LANG_EVENT_TABLE_HEADTITLE6;

    var SELTableHeader = document.getElementById("sel_tbl_header");
    var SELTablePlace = document.getElementById("sel_tbl_place");
    GridTable = GetTableElement();
    GridTable.setColumns(TableTitles);
    GridTable.init_header('GridTable', SELTableHeader);
    GridTable.init_body('GridTable', SELTablePlace);
}

function PrivilegeCallBack(Privilege) {
    "use strict";
    //full access
    if (Privilege == '03' || Privilege == '04') {
        SELTableInit();
        SELQueryMainTask();
        sel_save_log_btn.disabledCfg = false;
        sel_clear_log_btn.disabledCfg = false;
        sel_refresh_btn.disabledCfg = false;
    }
    //only view
    else if (Privilege == '02') {
        SELTableInit();
        SELQueryMainTask();
        sel_save_log_btn.disabled = true;
        sel_clear_log_btn.disabled = true;
        sel_refresh_btn.disabled = true;
        sel_save_log_btn.disabledCfg = true;
        sel_clear_log_btn.disabledCfg = true;
        sel_refresh_btn.disabledCfg = true;
    }
    //no access
    else {
        location.href = SubMainPage;
        sel_save_log_btn.disabled = true;
        sel_clear_log_btn.disabled = true;
        sel_refresh_btn.disabled = true;
        sel_save_log_btn.disabledCfg = true;
        sel_clear_log_btn.disabledCfg = true;
        sel_refresh_btn.disabledCfg = true;
        return;
    }
}

function SELClearTaskCheck() {
    "use strict";
    UtilsConfirm(lang.LANG_EVENT_CLEAN_PROMPT, { onOk: SELClearTask });
}

function SELClearTask() {
    "use strict";
    Loading(true);
    button_all_disable();

    var url = '/cgi/clearsel.cgi';
    var pars = 'time_stamp=' + (new Date());
    var ajax_data = GeneGenericRequestXML();
    var myAjax = new Ajax.Request(url, {
        method: 'delete',
        contentType: "text/xml",
        xml_data: ajax_data,
        timeout: g_CGIRequestTimeout,
        ontimeout: onCGIRequestTimeout,
        parameters: pars,
        onComplete: resSELClearTask
    });
}

function resSELClearTask(originalRequest) {
    "use strict";
    Loading(false);
    button_all_restore();

    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g, "");
        var xml_obj = GetResponseXML(response);
        if (xml_obj == null) {
            SessionTimeout();
            return;
        }
        // check session & privilege
        if (CheckInvalidResult(xml_obj) < 0) {
            return;
        }

        var IPMIRoot = xml_obj.documentElement;
        var CLEAR_SEL = IPMIRoot.getElementsByTagName('CLEAR_SEL');
        var SEL = CLEAR_SEL[0].getElementsByTagName('SEL');
        var comp_code = parseInt(SEL[0].getAttribute('COMP_CODE'));
        if (!comp_code) {
            selSelectSize.selectedIndex = 0;
            sel_evt_type.selectedIndex = 3;
            severity_infor_chkbox.checked = false;
            severity_warning_chkbox.checked = false;
            severity_critical_chkbox.checked = false;

            SELQueryMainTask();
        } else {
            alert(lang.LANG_NULLXML_SESSION_TIMEOUT);
        }
    }
}

function button_all_disable() {
    "use strict";
    sel_save_log_btn.disabled = true;
    sel_refresh_btn.disabled = true;
    sel_clear_log_btn.disabled = true;

    sel_evt_type.disabled = true;
    severity_infor_chkbox.disabled = true;
    severity_warning_chkbox.disabled = true;
    severity_critical_chkbox.disabled = true;
    selSelectSize.disabled = true;

    selPageUp.disabled = true;
    selPageTop.disabled = true;
    selPageDown.disabled = true;
    selPageBottom.disabled = true;
}

function button_all_restore() {
    "use strict";
    sel_save_log_btn.disabled =
        sel_save_log_btn.disabledCfg || requestStatus.isInProgress;

    sel_refresh_btn.disabled =
        sel_refresh_btn.disabledCfg || requestStatus.isInProgress;

    sel_clear_log_btn.disabled =
        sel_clear_log_btn.disabledCfg || requestStatus.isInProgress;

    sel_evt_type.disabled = false;
    severity_infor_chkbox.disabled = false;
    severity_warning_chkbox.disabled = false;
    severity_critical_chkbox.disabled = false;
    selSelectSize.disabled = false;

    selPageUp.disabled =
        selPageTop.disabled = (0 == currentPage);

    selPageDown.disabled =
        selPageBottom.disabled = (currentPage + 1 >= SelMaxPage);
}
