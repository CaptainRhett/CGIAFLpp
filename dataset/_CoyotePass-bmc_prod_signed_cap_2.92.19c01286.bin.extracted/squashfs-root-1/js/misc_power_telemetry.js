"use strict";
/*Miscellaneous power telemetry page*/

var lang;
var GridTable;
var DevID = [];
var DevTYPE = [];
var REG_Content = new Array();
var REG_count= 16;
var totalItem= 0;
var TableTitles = [["Register Index", "25%", "center"],
                   ["Register Address", "25%", "left"],
                   ["Energy Counter (MJ)", "25%", "left"],
                   ["Timestamp (ms)", "25%", "left"],
                  ];

var telemetry_Dev_type;
var HtmlRegTable;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit(){
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/misc_power_telemetry_hlp.html";
    telemetry_Dev_type = document.getElementById("telemetry_Dev_type");
    HtmlRegTable = document.getElementById("HtmlRegTable");

	PowerTableInit();
	document.getElementById("caption_div").textContent = lang.LANG_MISC_POWER_TELEMETRY;
	document.getElementById("type_lbl").textContent = lang.LANG_MISC_POWER_TELEMETRY_DEV_TYPE;
	//check user Privilege
	CheckUserPrivilege(PrivilegeCallBack);
	telemetry_Dev_type.onchange= takeRegContent;
}

function PowerTableInit(){
    "use strict";
	GridTable = GetTableElement();
	//replace table header content with string table
    TableTitles[0][0] = lang.LANG_MISC_POWER_TELEMETRY_REGISTER_INDEX;
    TableTitles[1][0] = lang.LANG_MISC_POWER_TELEMETRY_REGISTER_ADDRESS;
    TableTitles[2][0] = lang.LANG_MISC_POWER_TELEMETRY_ENERGY_COUNTER;
    TableTitles[3][0] = lang.LANG_MISC_POWER_TELEMETRY_TIME_STAMP;
	GridTable.setColumns(TableTitles);
	GridTable.init('GridTable', HtmlRegTable);
}
function PrivilegeCallBack(Privilege)
{
    "use strict";
	//full access
    if (Privilege == '04' || Privilege == '03')
    {
        getPowertelemetry();
    }
    else
    {
        //no access
        location.href = SubMainPage;
        return;
    }
}

function getPowertelemetry()
{
    "use strict";
	Loading(true);
        var url = '/cgi/nmpowertelemetry.cgi';
        var pars = 'time_stamp='+(new Date());
        var ajax_data = GeneGenericRequestXML();
        var myAjax = new Ajax.Request(
        			url,
                 		{method: 'post',
				contentType: 'text/xml',
				xml_data: ajax_data,
				parameters:pars, 
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
				onComplete:showPowertelemetry }//reigister callback function
                 		);
}
function showPowertelemetry(originalRequest)
{
    "use strict";
	Loading(false);
	var RowData = [];
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
	{
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
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
            alert(lang.LANG_MISC_POWER_TELEMETRY_ERR1);
            return;
        }
        var IPMIRoot= xmldoc.documentElement;//point to IPMI
        var PowerElement= IPMIRoot.getElementsByTagName('NM_POWER_TELEMETRY');
		var telemetry= PowerElement[0].getElementsByTagName('POWER_TELEMETRY');
		totalItem= telemetry.length;
		for (var i=0; i< totalItem; i++){
			DevID.push(telemetry[i].getAttribute('DEV_IDX'));
			DevTYPE.push(array.getString('nmpwrtelemetry', '0x0'+ telemetry[i].getAttribute('DEV_TYPE')));

			if(browser_ie)
                		telemetry_Dev_type.add(new Option('Device ID:'+ DevID[i] +' - '+DevTYPE[i], (i+1)), i);
        		else
                		telemetry_Dev_type.add(new Option('Device ID:'+ DevID[i] +' - '+DevTYPE[i], (i+1)), null);

			// get REG content
			REG_Content[i]= new Array(REG_count);
			for (var j=0; j< REG_count; j++){
				if(telemetry[i].getAttribute('REG_IDX'+ j) != null){
					// REG content [count][REG_ID]= offset, value, timestamp
					REG_Content[i][j]= new Array(3);
					REG_Content[i][j][0]= telemetry[i].getAttribute('REG_IDX'+ j); // offset
					REG_Content[i][j][1]= telemetry[i].getAttribute('REG_IDX'+ j+'_VAL'); // value
					REG_Content[i][j][2]= telemetry[i].getAttribute('TIME'); // timestamp
				}
			}
		}

        telemetry_Dev_type.selectedIndex= 0;
		var count= 1;
		for (var j=0; j< REG_count; j++){
			if(REG_Content[0][j] != undefined){
				var num = new Number (REG_Content[0][j][1]);
				num /= 1000000000; //transform milli to mega
				RowData.push([count, j, //REG ID
					REG_Content[0][j][0], //offset
					num.toFixed(9), // value
					REG_Content[0][j][2] //timestamp
					]);
				count+= 1;
			}
		}
		GridTable.empty();
        GridTable.show(RowData);
	}
}
function takeRegContent(){
    "use strict";
	Loading(true);
	setTimeout(showRegContent, 500);
}
function showRegContent(){
    "use strict";
	Loading(false);
	var count= 1;
	var RowData = [];
	for(var i=0; i< totalItem; i++){
		if(telemetry_Dev_type.selectedIndex == i){
			for (var j=0; j< REG_count; j++){
				if(REG_Content[i][j] != undefined){
					var num = new Number (REG_Content[i][j][1]);
					num /= 1000000000; //transform milli to mega
					RowData.push([count,
						j,
						REG_Content[i][j][0],
						num.toFixed(9),
						REG_Content[i][j][2],
					]);
					count+= 1;
				}
			}
			break;
		}
	}
	GridTable.empty();
	GridTable.show(RowData);
}
array.getString = function(widget, token)
{
    "use strict";
	var optBit = arguments[2];
	if (token== "")
        	return " ";
        else if (widget== "")
        	return "DEVERROR: String class not specified";
        // First look for string group
        if (array[widget+"_type"]!= undefined) {
        	//Optional bit check
                if(optBit!= undefined && array[widget+"_type"][token][optBit]!= undefined) {
                    return array[widget+"_type"][token][optBit];
                }
                else if (optBit!= undefined && array[widget+"_type"][token][optBit]== undefined) {
                    return "Unknown";
                }

                if (array[widget+"_type"][token]!= undefined) {
                    return array[widget+"_type"][token];
                }
        }
	else {
		if (top.array[widget+"_type"]!= undefined) {
                	//Optional bit check
                    	if(optBit!= undefined && top.array[widget+"_type"][token][optBit]!= undefined)
                        	return top.array[widget+"_type"][token][optBit];

                    	if (top.array[widget+"_type"][token]!= undefined)
                        	return top.array[widget+"_type"][token];
                }
		else {
                    	if (array.global_str!= undefined) {
                        	//Optional bit check
                        	if(optBit!= undefined && array.global_str[token][optBit]!= undefined)
                            		return array.global_str[token][optBit];

                        	if (array.global_str[token]!= undefined)
                            		return array.global_str[token];
                    	}
                }
	}
	return "DEVERROR: Cannot locate string array."+widget+"_type["+token+"]"+(optBit!= undefined)?"["+optBit+"]":"";
}
