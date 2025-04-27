"use strict";
/* SYSTEM -- CPU Information page */
var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit(){
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting +"/sys_cpu_hlp.html";

    var CPU_InfoBox_0 = document.getElementById("CPU_InfoBox_0");
    var CPU_InfoBox_1 = document.getElementById("CPU_InfoBox_1");
    var CPU_InfoBox_2 = document.getElementById("CPU_InfoBox_2");
    var CPU_InfoBox_3 = document.getElementById("CPU_InfoBox_3");

    document.getElementById("cpu_info_title_div").textContent = lang.LANG_SYSTEM_CPU_INFO_TITLE;

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}
function PrivilegeCallBack(privilege)
{
    "use strict";
    if (privilege == '02' || privilege == '03' || privilege == '04') {
        getCPUInfo();
    }
    else{
        location.href = SubMainPage;
        return;
    }
}
function getCPUInfo(){
    "use strict";
    Loading(true);
    var url= '/cgi/getcpuinfo.cgi';
    var pars= 'timestamp='+(new Date());
    var ajax_data= GeneGenericRequestXML();
    var myAjax= new Ajax.Request(
                url,
                {method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                parameters: pars,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: ReplyCPUInfo
                });
}
function ReplyCPUInfo(originalRequest){
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null){
            document.getElementById("CPU_InfoBox_0").textContent= lang.LANG_SYS_CPU_CALLFAIL_REASON;
            SessionTimeout();
            return;
        }

        // check session & privilege
        if(CheckInvalidResult(xmldoc) < 0) {
           return;
        }

        var rootCPUInfo = xmldoc.documentElement;
        var CPU_INFO = rootCPUInfo.getElementsByTagName('CPU_INFO');
        var CPU = CPU_INFO[0].getElementsByTagName('CPU');
        var CPU_COUNT = CPU.length;
        var i;

        for (i = 0; i < CPU_COUNT; i++)
        {
            document.getElementById("CPU_InfoBox_" + i).innerHTML =
            "<div align=\"left\" id=\"CPU_" + i + "\">" +
            "<fieldset class=\"wide group\">" +
                    "<legend class=\"legendcaption\">" + lang.LANG_SYSTEM_CPU_INFO_TITLE + "</legend>" +
                    "<table>" +
                    // Socket Designation
                    "<tr><td align=\"right\" class=\"bold\">" +
                "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_SOCKET_DESIGNATION +
                        "</label></td>" +
                            "<td><span id=\"socketNo_" + i + "\"" + " class=\"labeltext\"></span>" +
            "</td></tr>" +
                    // Manufacturer
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_MANUFACTURER +
                            "</label></td>" +
                            "<td><span id=\"manuf_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Version
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_VERSION +
                            "</label></td>" +
                            "<td><span id=\"version_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Processor Signature
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_PROC_SIGNATURE +
                            "</label></td>" +
                            "<td><span id=\"procSig_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Processor Type
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_PROC_TYPE +
                            "</label></td>" +
                            "<td><span id=\"procType_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Processor Family
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_FAMILY +
                            "</label></td>" +
                            "<td><span id=\"procFamily_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Speed
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_SPEED +
                            "</label></td>" +
                            "<td><span id=\"speed_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Cores
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_CORES +
                            "</label></td>" +
                            "<td><span id=\"cores_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Voltage
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_VOLTAGE +
                            "</label></td>" +
                            "<td><span id=\"voltage_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Socket Type
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_SOCKET_TYPE +
                            "</label></td>" +
                            "<td><span id=\"socketType_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Status
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_STATUS +
                            "</label></td>" +
                            "<td><span id=\"status_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Serial Number
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_SERIAL_NO +
                            "</label></td>" +
                            "<td><span id=\"serialNo_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Asset Tag
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_ASSET_TAG +
                            "</label></td>" +
                            "<td><span id=\"assetTag_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    // Part Number
            "<tr><td align=\"right\" class=\"bold\">" +
                            "<label class=\"labeltitle\">" + lang.LANG_SYS_CPU_PART_NO +
                            "</label></td>" +
                            "<td><span id=\"partNo_" + i + "\"" + " class=\"labeltext\"></span>" +
                    "</td></tr>" +
                    "</table>" +
                    "</fieldset>" +
                    "</div>";
        }

        for (i = 0; i < CPU_COUNT; i++)
        {
            document.getElementById("socketNo_" + i).textContent = CPU[i].getAttribute("SocketDesignation");
            document.getElementById("manuf_" + i).textContent = CPU[i].getAttribute("Manufacturer");
            document.getElementById("version_" + i).textContent = CPU[i].getAttribute("Version");
            document.getElementById("serialNo_" + i).textContent = CPU[i].getAttribute("Serial");
            document.getElementById("assetTag_" + i).textContent = CPU[i].getAttribute("Asset");
            document.getElementById("partNo_" + i).textContent = CPU[i].getAttribute("Part");
            document.getElementById("procType_" + i).textContent = CPU[i].getAttribute("Type");
            document.getElementById("procFamily_" + i).textContent = CPU[i].getAttribute("Family");
            document.getElementById("voltage_" + i).textContent = CPU[i].getAttribute("Voltage");
            document.getElementById("status_" + i).textContent = CPU[i].getAttribute("Status");
            document.getElementById("socketType_" + i).textContent = CPU[i].getAttribute("SocketType");
            document.getElementById("speed_" + i).textContent = CPU[i].getAttribute("Speed");
            document.getElementById("cores_" + i).textContent = CPU[i].getAttribute("Cores");
            document.getElementById("procSig_" + i).textContent = CPU[i].getAttribute("Signature");
        }

    }
}

