"use strict";
/* fru information page */

var lang;
var FRUSelector;
var CHS_Info;
var BD_Info;
var PDT_Info;
var textField;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }


function PageInit(){
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/sys_fru_info_hlp.html";
    OutputString();
    FRUSelector = document.getElementById("FRUSelector");
    CHS_Info = document.getElementById("CHS_Info");
    BD_Info = document.getElementById("BD_Info");
    PDT_Info = document.getElementById("PDT_Info");
    textField = document.getElementById("textField");

    FRUSelector.onchange= FRUSelected;

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}
function OutputString() {
    "use strict";
    document.getElementById("fru_title_div").textContent = lang.LANG_FRU_TITLE;
    document.getElementById("chassis_info_legent").textContent = lang.LANG_FRU_CHASSIS_INFO;
    document.getElementById("chassis_type_lbl").textContent = lang.LANG_FRU_CHASSIS_TYPE;
    document.getElementById("chassis_part_number_lbl").textContent = lang.LANG_FRU_CHASSIS_PART_NUMBER;
    document.getElementById("chassis_serial_number_lbl").textContent = lang.LANG_FRU_CHASSIS_SERIAL_NUMBER;
    document.getElementById("board_info_legent").textContent = lang.LANG_FRU_BOARD_INFO;

    document.getElementById("board_lan_lbl").textContent = lang.LANG_FRU_BOARD_LAN;
    document.getElementById("board_mfg_datetime_lbl").textContent = lang.LANG_FRU_BOARD_MFG_DATE_TIME;
    document.getElementById("board_mfg_lbl").textContent = lang.LANG_FRU_BOARD_MFC_NAME;
    document.getElementById("board_product_lbl").textContent = lang.LANG_FRU_BOARD_PRODUCT_NAME;
    document.getElementById("board_serial_lbl").textContent = lang.LANG_FRU_BOARD_SERIAL_NUM;
    document.getElementById("board_part_lbl").textContent = lang.LANG_FRU_BOARD_PART_NUM;
    document.getElementById("board_file_id_lbl").textContent = lang.LANG_FRU_FILE_ID;

    document.getElementById("product_info_legend").textContent = lang.LANG_FRU_PRODUCT_INFO;
    document.getElementById("product_lan_lbl").textContent = lang.LANG_FRU_PRODUCT_LAN;
    document.getElementById("product_mfg_lbl").textContent = lang.LANG_FRU_PRODUCT_MFG_NAME;
    document.getElementById("product_name_lbl").textContent = lang.LANG_FRU_PRODUCT_NAME;
    document.getElementById("product_part_lbl").textContent = lang.LANG_FRU_PRODUCT_PART_NUM;
    document.getElementById("product_version_lbl").textContent = lang.LANG_FRU_PRODUCT_VERSION;
    document.getElementById("product_serial_lbl").textContent = lang.LANG_FRU_PRODUCT_SERIAL_NUM;
    document.getElementById("product_asset_tag_lbl").textContent = lang.LANG_FRU_PRODUCT_ASSET_TAG;
    document.getElementById("product_file_id_lbl").textContent = lang.LANG_FRU_FILE_ID;
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if (privilege == '02' || privilege == '03' || privilege == '04')
    {
        getFruDevice();
    }
    else{
        location.href = SubMainPage;
        return;
    }
}
function getFruDevice() {
    "use strict";
    Loading(true);
    var url = '/cgi/getfrudevice.cgi';
    var pars = 'timestamp= '+(new Date());
    var ajax_data = GeneGenericRequestXML();
    var myAjax = new Ajax.Request(
            url,
            { method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                parameters: pars,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: recFruDev
            });
}
function recFruDev(originalRequest) {
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null) {
            SessionTimeout();
            return;
        }
        var IPMI = xmldoc.documentElement;
        //check session & privilege
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var FRU_INFO = IPMI.getElementsByTagName('FRU_INFO'); //point to FRU_INFO
        var Device = FRU_INFO[0].getElementsByTagName('DEVICE');
        var DevCount = Device.length;
        var i = 0;
        for (i = 0; i< DevCount; i++) {
            var name = Device[i].getAttribute('NAME');
            var id = Device[i].getAttribute('ID');
            var option = null;
            var j = 0;
            for (j = 0; j < FRUSelector.length; j++) {
                if (name == FRUSelector.options[j].text && id == FRUSelector.options[j].value) {
                    option = FRUSelector.options[j];
                    break;
                }
            }

            if (option == null) {
                option = document.createElement('option');
                option.text = name;
                option.value = id;
                FRUSelector.add(option);
            }

            if (i == 0) {
                getFRUInfo(id, ReplyFRUInfo);
            }
        }
        Loading(false);
    }
}

function genXMLdata(DEVICE_ID){
    "use strict";
    var ajax_data= '<?xml version=\"1.0\"?>\n'+
        '<IPMI>\n'+
        '<PRIV>' + top.frames.topmenu.PRIV_ID + '</PRIV>\n'+
        '<TOKEN>' + top.frames.topmenu.CSRF_TOKEN + '</TOKEN>\n'+
        '<FRU_INFO>\n'+
        '<DEVICE ID=\"' + DEVICE_ID + '\" />\n'+
        '</FRU_INFO>\n'+
        '</IPMI>\n';
    return ajax_data;
}
function getFRUInfo(DEVICE_ID, callback){
    "use strict";
    if(typeof(callback) != 'function')
        return;
    Loading(true);
    var url = '/cgi/getfruinfo.cgi';
    var pars = 'timestamp= '+(new Date());
    var ajax_data = genXMLdata(DEVICE_ID);
    var myAjax = new Ajax.Request(
            url,
            {method: 'post',
                contentType: 'text/xml',
                xml_data: ajax_data,
                parameters: pars,
                timeout: g_CGIRequestTimeout,
                ontimeout: onCGIRequestTimeout,
                onComplete: callback
            });
}
function FRUSelected(){
    "use strict";
    getFRUInfo(FRUSelector.value, ReplyFRUInfo);
}

function ReplyFRUInfo(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
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
        var IPMI = xmldoc.documentElement;
        var FRU_INFO=IPMI.getElementsByTagName('FRU_INFO');//point to FRU_INFO
        var res = FRU_INFO[0].getAttribute("RES");

        if(res == '0'){
            CHS_Info.classList.add("nodisplay");
            BD_Info.classList.add("nodisplay");
            PDT_Info.classList.add("nodisplay");
            textField.textContent = lang.LANG_SYS_FRU_INACCESSIBLE;
            return;
        }
        else{
            textField.textContent = '';
        }
        var fru_file_id;
        var idx;

        var CHASSIS = FRU_INFO[0].getElementsByTagName('CHASSIS');
        if(CHASSIS.length != 0){
            var chassis_type = parseInt(CHASSIS[0].getAttribute("TYPE"), 16);
            var chassis_part_num = CHASSIS[0].getAttribute("PART_NUM");
            var chassis_serial_num = CHASSIS[0].getAttribute("SERIAL_NUM");
            idx = "LANG_FRU_CHASSIS_TYPE_" + IntegerToHexString(chassis_type);
            document.getElementById("chassisType").textContent = lang[idx];
            document.getElementById("chassisPartNo").textContent   = atob(chassis_part_num);
            document.getElementById("chassisSerialNo").textContent = atob(chassis_serial_num);
            CHS_Info.classList.remove("nodisplay");
        }else{
            CHS_Info.classList.add("nodisplay");
        }
        var BOARD = FRU_INFO[0].getElementsByTagName('BOARD');
        if(BOARD.length != 0){
            var board_lan = parseInt(BOARD[0].getAttribute("LAN"), 16);
            var board_mfg_date= BOARD[0].getAttribute("MFG_DATE");
            var board_mfc_name= BOARD[0].getAttribute("MFC_NAME");
            var board_prod_name= BOARD[0].getAttribute("PROD_NAME");
            var board_serial_num= BOARD[0].getAttribute("SERIAL_NUM");
            var board_part_num= BOARD[0].getAttribute("PART_NUM");
            fru_file_id = BOARD[0].getAttribute("FRU_File_ID");
            idx = "LANG_FRU_LANG_CODE_" + IntegerToHexString(board_lan);
            document.getElementById("boardLanguage").textContent   = lang[idx];
            document.getElementById("boardMfgDateTime").textContent= atob(board_mfg_date);
            document.getElementById("boardMfcName").textContent    = atob(board_mfc_name);
            document.getElementById("boardProductName").textContent= atob(board_prod_name);
            document.getElementById("boardSerialNo").textContent   = atob(board_serial_num);
            document.getElementById("boardPartNo").textContent     = atob(board_part_num);
            document.getElementById("boardFruFileID").textContent = (fru_file_id ? atob(fru_file_id) : "N/A");
            BD_Info.classList.remove("nodisplay");
        }
        else{
            BD_Info.classList.add("nodisplay");
        }

        var PRODUCT = FRU_INFO[0].getElementsByTagName('PRODUCT');
        if(PRODUCT.length != 0){
            var prod_lan = parseInt(PRODUCT[0].getAttribute("LAN"), 16);
            var prod_mfc_name = PRODUCT[0].getAttribute("MFC_NAME");
            var prod_prod_name = PRODUCT[0].getAttribute("PROD_NAME");
            var prod_part_num = PRODUCT[0].getAttribute("PART_NUM");
            var prod_version = PRODUCT[0].getAttribute("VERSION");
            var prod_serail_num = PRODUCT[0].getAttribute("SERIAL_NUM");
            var prod_asset_tag = PRODUCT[0].getAttribute("ASSET_TAG");
            fru_file_id = PRODUCT[0].getAttribute("FRU_File_ID");
            idx = "LANG_FRU_LANG_CODE_" + IntegerToHexString(prod_lan);
            document.getElementById("proLanguage").textContent     = lang[idx];
            document.getElementById("proMfcName").textContent      = atob(prod_mfc_name);
            document.getElementById("proProductName").textContent  = atob(prod_prod_name);
            document.getElementById("proPartNo").textContent       = atob(prod_part_num);
            document.getElementById("proVersion").textContent      = atob(prod_version);
            document.getElementById("proSerialNo").textContent     = atob(prod_serail_num);
            document.getElementById("proAssetTag").textContent     = atob(prod_asset_tag);
            document.getElementById("productFruFileID").textContent = (fru_file_id ? atob(fru_file_id) : "N/A");
            PDT_Info.classList.remove("nodisplay");
        }
        else{
            PDT_Info.classList.add("nodisplay");
        }
    }
}
