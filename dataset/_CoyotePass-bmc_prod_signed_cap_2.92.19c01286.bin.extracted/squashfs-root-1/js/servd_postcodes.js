"use strict";
var currTimestampsAry = new Array();
var prevTimestampsAry = new Array();
var currPOSTAry = new Array();
var prevPOSTAry = new Array();
var RowHilightPersist = new Array();

var TIMECOL = 0;
var CODECOL = 1;
var DESCCOL = 2;
var lang;
var IE;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/servd_postcodes_hlp.html";

    if(navigator.appName.indexOf('Microsoft')>=0)
        IE = true;
    else
        IE = false;

    var optid = 0;
    var timeSelect = document.getElementById("timeSelect");
    timeSelect.add(new Option(lang.LANG_SERVER_DIAG_POST_TIMEFROMSTART,0),IE?optid++:null);
    timeSelect.add(new Option(lang.LANG_SERVER_DIAG_POST_TIMERELATIVE,1),IE?optid++:null);
    timeSelect.options.selectedIndex = 0;
    timeSelect.onchange = setTimeBase;

    RowHilightPersist["currPOSTTable"] = 0;
    RowHilightPersist["prevPOSTTable"] = 0;

    OutputString();
    CheckUserPrivilege(PrivilegeCallBack);
}

function OutputString() {
    "use strict";
    document.getElementById("title_div").textContent = lang.LANG_SERVER_DIAGNOSTICS_POST_TITLE;
    document.getElementById("timeheader_lbl").textContent = lang.LANG_SERVER_DIAG_POST_TIMEHEADER;
    document.getElementById("previous_legend").textContent = lang.LANG_SERVER_DIAG_POST_PREVIOUS;
    document.getElementById("current_legend").textContent = lang.LANG_SERVER_DIAG_POST_CURRENT;
}

function PrivilegeCallBack(Privilege)
{
    "use strict";
    if(Privilege == '03' || Privilege == '04') //full access
    {
        getPreviousPOSTCodes();
        getCurrentPOSTCodes();
    }
    else
    {
        location.href = SubMainPage;
        return;
    }
}

function getCurrentPOSTCodes() {
    "use strict";
    Loading(true);

    /*var ajax_url = '/cgi/dump_post_xml.cgi';
      var pars = 'currentpost.xml'
      var ajax_data = '';
      ajax_data += "<?xml version=\"1.0\"?>\n";
      ajax_data += "<IPMI>\n";
      ajax_data += "    <XMLFILE>" + pars + "</XMLFILE>\n";
      ajax_data += "</IPMI>\n";*/

    var ajax_url = '../cgi/getCurrentPOSTcodes.cgi';
    var ajax_data = GeneGenericRequestXML();
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {   //method: 'get',parameters:pars, onComplete: handleCurrentPOSTHandler
                method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: handleCurrentPOSTHandler
            }//register callback function
            );
}

function handleCurrentPOSTHandler(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        //alert(originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }
        /*<?xml version="1.0"?>
          <IPMI>
          <RESULT>OK/FAIL/SESSION_INVALID</RESULT>
          <GET_CURRENT_POST STARTTIME="1435631231">
          <POST TIMESTAMP="0" POSTCODE="0x02"/>
          <POST TIMESTAMP="0" POSTCODE="0x03"/>
          <POST TIMESTAMP="10" POSTCODE="0x02"/>
          <POST TIMESTAMP="20" POSTCODE="0x06"/>
          <POST TIMESTAMP="70" POSTCODE="0x06"/>
          </GET_CURRENT_POST>
          </IPMI>*/

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var IPMIRoot = xmldoc.documentElement;//point to IPMI

        var timeAttr = IPMIRoot.getElementsByTagName("GET_CURRENT_POST")[0];
        if(timeAttr != null) {
            //var StartTime = new Date(parseInt(timeAttr.getAttribute("STARTTIME")) * 1000) ;
            var StartTime = timeAttr.getAttribute("STARTTIME");
            //alert(StartTime);
            document.getElementById('currPOSTtimeinfo').textContent = lang.LANG_SERVER_DIAG_POST_STARTED +
                StartTime/*.toUTCString()*/;
        } else {
            document.getElementById('currPOSTtimeinfo').textContent = lang.LANG_SERVER_DIAG_POST_NOT_AVAILABLE;
        }

        var postCodesNode = IPMIRoot.getElementsByTagName("POST");
        currTimestampsAry = new Array();
        currPOSTAry = new Array();
        for(var i=0; i<postCodesNode.length; i++) {
            currTimestampsAry[i] = postCodesNode[i].getAttribute("TIMESTAMP");
            currPOSTAry[i] = postCodesNode[i].getAttribute("POSTCODE");
        }
        drawTables('currPOSTTable', currTimestampsAry, currPOSTAry);
        Loading(false);
    }
}

function getPreviousPOSTCodes() {
    "use strict";
    Loading(true);

    /*var ajax_url = '/cgi/dump_post_xml.cgi';
      var pars = 'previouspost.xml'
      var ajax_data = '';
      ajax_data += "<?xml version=\"1.0\"?>\n";
      ajax_data += "<IPMI>\n";
      ajax_data += "    <XMLFILE>" + pars + "</XMLFILE>\n";
      ajax_data += "</IPMI>\n";*/

    var ajax_url = '../cgi/getPreviousPostcodes.cgi';
    var ajax_data = GeneGenericRequestXML();
    //alert(ajax_data);
    var ajax_req = new Ajax.Request(
            ajax_url,
            {   //method: 'get',parameters:pars, onComplete: HandlePreviousPOSTHandler
                method: 'post',
                contentType: "text/xml",
                xml_data: ajax_data,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: HandlePreviousPOSTHandler
            }//register callback function
            );
}

function HandlePreviousPOSTHandler(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        //alert(originalRequest.responseText);
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }
        /*<?xml version="1.0"?>
          <IPMI>
          <GET_PREVIOUS_POST STARTTIME="1435544293">
          <POST TIMESTAMP="0" POSTCODE="0x02"/>
          <POST TIMESTAMP="0" POSTCODE="0x03"/>
          <POST TIMESTAMP="0" POSTCODE="0x02"/>
          <POST TIMESTAMP="0" POSTCODE="0x03"/>
          <POST TIMESTAMP="10" POSTCODE="0x06"/>
          <POST TIMESTAMP="60" POSTCODE="0x06"/>
          </GET_PREVIOUS_POST>
          </IPMI>*/

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var IPMIRoot = xmldoc.documentElement;//point to IPMI

        var timeAttr = IPMIRoot.getElementsByTagName("GET_PREVIOUS_POST")[0];
        if(timeAttr != null) {
            //var StartTime = new Date(parseInt(timeAttr.getAttribute("STARTTIME")) * 1000) ;
            var StartTime = timeAttr.getAttribute("STARTTIME");
            document.getElementById('prevPOSTtimeinfo').textContent = lang.LANG_SERVER_DIAG_POST_STARTED +
                StartTime/*.toUTCString()*/;
        } else {
            document.getElementById('prevPOSTtimeinfo').textContent = lang.LANG_SERVER_DIAG_POST_NOT_AVAILABLE;
        }

        var postCodesNode = IPMIRoot.getElementsByTagName("POST");
        prevTimestampsAry = new Array();
        prevPOSTAry = new Array();
        for(var i=0; i<postCodesNode.length; i++) {
            prevTimestampsAry[i] = postCodesNode[i].getAttribute("TIMESTAMP");
            prevPOSTAry[i] = postCodesNode[i].getAttribute("POSTCODE");
        }
        drawTables('prevPOSTTable', prevTimestampsAry, prevPOSTAry);
        Loading(false);
    }
}

function drawTables(tableName, timeCodes, postCodes) {
    "use strict";
    var table=document.getElementById(tableName);
    var thisRow;

    table.cellPadding = "0";
    table.cellSpacing = "0";
    if (timeCodes.length == 0) {
        return;
    }

    if (table.rows.length == 0) {
        var table1HeadRow = table.insertRow(0);
        table1HeadRow.insertCell(TIMECOL).innerHTML = lang.LANG_SERVER_DIAG_POST_THEAD_TIME.bold();
        table1HeadRow.insertCell(CODECOL).innerHTML = lang.LANG_SERVER_DIAG_POST_THEAD_CODE.bold();
        table1HeadRow.cells[CODECOL].colSpan = "2";
        table1HeadRow.cells[TIMECOL].style.textAlign = "right";
        table1HeadRow.cells[CODECOL].style.textAlign = "center";
    }

    // Clear any existing table values, but save the header.
    for(var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    var numRows = timeCodes.length;
    //alert(numRows);
    for(var i=0; i<numRows; i++) {
        thisRow = table.insertRow(-1);
        thisRow.insertCell(TIMECOL);
        thisRow.insertCell(CODECOL).innerHTML = postCodes[i].bold();
        thisRow.insertCell(DESCCOL).innerHTML = array.getString('postcodes_decode', postCodes[i]);
        thisRow.cells[TIMECOL].style.textAlign = "right";
        thisRow.cells[CODECOL].style.textAlign = "center";
        thisRow.onmouseover = hilightRow;
        thisRow.onmouseout = clearhilightRow;
        thisRow.onclick = function()
        {
            // Persistence hilighting
            RowHilightPersist[tableName] = RowHilightPersist[tableName]?0:1;
            if(!RowHilightPersist[tableName])
                rowClearAllHilight(table);
            else
                setPersistRowHilight(table, this, "postcode_persist");
        };

        // Handle the dropdown selector for timebase.
        switch(timeSelect.options.selectedIndex)
        {
            case 0: // Fall through
            default:
                {
                    // Time from start of POST.
                    thisRow.cells[TIMECOL].textContent = mintosec(timeCodes[i]);
                    break;
                }
            case 1:
                {
                    // Time from last POST event.
                    if(i>0)
                    {
                        thisRow.cells[TIMECOL].textContent = "+" + mintosec(timeCodes[i] - timeCodes[i-1]);
                    }
                    else
                    {
                        thisRow.cells[TIMECOL].textContent = "+" + mintosec(timeCodes[i]);
                    }
                }
                break;
        }
    }
}

function mintosec(inputms) {
    "use strict";
    var outputFull = new String();
    var outputMs  = inputms % 1000;
    var outputSec = Math.floor(inputms / 1000) % 60;
    var outputMin = Math.floor(inputms / (60*1000));

    if (outputMs < 10) {
        outputMs = "00" + outputMs.toString(10);
    } else if (outputMs < 100) {
        outputMs = "0" + outputMs.toString(10);
    } else {
        outputMs = outputMs.toString(10);
    }

    if (outputSec < 10) {
        outputSec = "0" + outputSec.toString(10);
    } else {
        outputSec = outputSec.toString(10);
    }

    if (outputMin < 10) {
        outputMin = "0" + outputMin.toString(10);
    } else {
        outputMin = outputMin.toString(10);
    }

    outputFull = outputMin + ":" + outputSec + "." + outputMs;

    return outputFull;
}
function setTimeBase()
{
    "use strict";
    RowHilightPersist["currPOSTTable"] = 0;
    RowHilightPersist["prevPOSTTable"] = 0;
    drawTables('currPOSTTable', currTimestampsAry, currPOSTAry);
    drawTables('prevPOSTTable', prevTimestampsAry, prevPOSTAry);
    return;
}

// Should only be called as a table row mouseover.
function hilightRow()
{
    "use strict";
    if (RowHilightPersist[this.parentElement.parentElement.id])
    {
        return;
    }

    this.className = "postcode_highlight";
    // Find all rows with the same POST code and hilight them.
    var numRows = this.parentElement.parentElement.rows.length;
    var rowSet = this.parentElement.parentElement.rows;

    for(var i=0; i<numRows; i++)
    {
        if (rowSet[i].cells[CODECOL].innerHTML == this.cells[CODECOL].innerHTML)
        {
            rowSet[i].className = "postcode_highlight";
        }
    }

    return;
}

// Should only be called as a table row mouseout.
function clearhilightRow()
{
    "use strict";
    if (RowHilightPersist[this.parentElement.parentElement.id])
        return;

    this.className = "postcode_unhighlight";
    // Find all rows with the same POST code and clear the hilights.
    var numRows = this.parentElement.parentElement.rows.length;
    var rowSet = this.parentElement.parentElement.rows;

    for(var i=0; i<numRows; i++)
    {
        if (rowSet[i].cells[CODECOL].innerHTML == this.cells[CODECOL].innerHTML)
        {
            rowSet[i].className = "postcode_unhighlight";
        }
    }

    return;
}

// Clears hilighting from all rows in the table.
function rowClearAllHilight(tableName)
{
    "use strict";
    // Find all rows with the same POST code and hilight them.
    var numRows = tableName.rows.length;
    var rowSet = tableName.rows;

    for(var i=0; i<numRows; i++)
    {
        rowSet[i].className = "postcode_unhighlight";
    }

    return;
}

// Sets persistent row hilighting color.
function setPersistRowHilight(tableName, tableRow, className)
{
    "use strict";
    tableRow.className = className ? className : "postcode_highlight";
    // Find all rows with the same POST code and hilight them.
    var numRows = tableName.rows.length;//timeCodes.length;
    var rowSet = tableName.rows;

    for(var i=0; i<numRows; i++)
    {
        if (rowSet[i].cells[CODECOL].innerHTML == tableRow.cells[CODECOL].innerHTML)
        {
            rowSet[i].className = className ? className : "postcode_highlight";
        }
    }

    return;
}

//----------------------------------------------------------------//
array.getString = function(widget, token) {
    "use strict";
    var optBit = arguments[2];
    if ((token=="") && (token!=0))
        return " ";
    else if (widget=="")
        return "DEVERROR: String class not specified";
    // First look for string group
    if (array[widget+"_str"]!=undefined) {
        //Optional bit check
        if(optBit!=undefined && array[widget+"_str"][token][optBit]!=undefined) {
            return array[widget+"_str"][token][optBit];
        }
        else if (optBit!=undefined && array[widget+"_str"][token][optBit]==undefined) {
            return "Unknown";
        }

        if (array[widget+"_str"][token]!=undefined) {
            return array[widget+"_str"][token];
        } else {
            return DXEArray[widget+"_str"][token];
        }
    } else {
        if (top.array[widget+"_str"]!=undefined) {
            //Optional bit check
            if(optBit!=undefined && top.array[widget+"_str"][token][optBit]!=undefined)
                return top.array[widget+"_str"][token][optBit];

            if (top.array[widget+"_str"][token]!=undefined)
                return top.array[widget+"_str"][token];
        } else {
            if (array.global_str!=undefined) {
                //Optional bit check
                if(optBit!=undefined && array.global_str[token][optBit]!=undefined)
                    return array.global_str[token][optBit];

                if (array.global_str[token]!=undefined)
                    return array.global_str[token];
            }
        }
    }

    return "DEVERROR: Cannot locate string array."+widget+"_str["+token+"]"+(optBit!=undefined)?"["+optBit+"]":"";
}
