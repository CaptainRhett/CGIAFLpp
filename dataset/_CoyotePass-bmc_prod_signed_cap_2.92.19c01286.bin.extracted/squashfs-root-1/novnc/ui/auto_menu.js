"use strict";

var menu_rfb;
var keymacros;
var PRIV_ID = "";
var CSRF_TOKEN = "";
var PowerMenuBar;
/*
     Initialize and render the MenuBar when its elements are ready
     to be scripted.
*/
var submenu_obj = [
    {
        id: "keyboard",
        index: "keyboard",
        label: "Keyboard",
        itemdata: [
            // { text: "VirtualStorage",   url: "javascript:page_mapping('virtual', 'virtual_vs')" ,   index: "virtual_vs", disabled: true},
            { text: lang.LANG_IKVM_HTML5_KEYBOARD_VIRTUAL_KEYBOARD,  onclick: {fn: OnClickVKEnable},    index: "virtual_vk", disabled: false},
            { text: lang.LANG_IKVM_HTML5_KEYBOARD_KEYBOARD_MACRO, submenu: { id: "keyboard_macro", itemdata: [
                { text: lang.LANG_IKVM_HTML5_KEYBOARD_SYSTEM_MACRO, submenu: { id: "macro_system", itemdata: [
                    { text: "Ctrl+Alt+Del",     onclick: {fn: OnClickMacroPress, obj: "Ctrl+Alt+Del"}, index: "macro_system"},
                    { text: "Alt+Tab",          onclick: {fn: OnClickMacroPress, obj: "Alt+Tab"},      index: "macro_system"},
                    { text: "Alt+Esc",          onclick: {fn: OnClickMacroPress, obj: "Alt+Esc"},      index: "macro_system"},
                    { text: "Ctrl+Esc",         onclick: {fn: OnClickMacroPress, obj: "Ctrl+Esc"},     index: "macro_system"},
                    { text: "Alt+Space",        onclick: {fn: OnClickMacroPress, obj: "Alt+Space"},    index: "macro_system"},
                    { text: "Alt+Enter",        onclick: {fn: OnClickMacroPress, obj: "Alt+Enter"},    index: "macro_system"},
                    { text: "Alt+Hyphen",        onclick: {fn: OnClickMacroPress, obj: "Alt+Hyphen"},    index: "macro_system"},
                    { text: "Alt+F4",           onclick: {fn: OnClickMacroPress, obj: "Alt+F4"},       index: "macro_system"},
                    { text: "Alt+PrntScrn",      onclick: {fn: OnClickMacroPress, obj: "Alt+PrntScrn"},  index: "macro_system"},
                    { text: "PrntScrn",          onclick: {fn: OnClickMacroPress, obj: "PrntScrn"},      index: "macro_system"},
                    { text: "F1",               onclick: {fn: OnClickMacroPress, obj: "F1"},           index: "macro_system"},
                    { text: "Alt+F1",           onclick: {fn: OnClickMacroPress, obj: "Alt+F1"},       index: "macro_system"},
                    { text: "Pause",            onclick: {fn: OnClickMacroPress, obj: "Pause"},        index: "macro_system"}
                ]}}
                //{ text: lang.LANG_IKVM_HTML5_KEYBOARD_DEFINED_MACRO, submenu: { id: "macro_defined", itemdata: [
                //    ]}, index: "macro_defined", disabled: true}
                ]}
            }
        ]
    },
    {
        id: "power",
        index: "power",
        label: "PowerControl",
        itemdata: [
            { text: lang.LANG_IKVM_HTML5_POWERCONTROL_ON,             onclick: {fn: OnClickPower, obj: "power_on"},            index: "power_on",          disabled: false },
            { text: lang.LANG_IKVM_HTML5_POWERCONTROL_OFF,            onclick: {fn: OnClickPower, obj: "power_off"},           index: "power_off",         disabled: false },
            { text: lang.LANG_IKVM_HTML5_POWERCONTROL_SHUTDOWN,       onclick: {fn: OnClickPower, obj: "power_swshutdown"},    index: "power_swshutdown",  disabled: false },
            { text: lang.LANG_IKVM_HTML5_POWERCONTROL_RESET,          onclick: {fn: OnClickPower, obj: "power_reset"},         index: "power_reset",       disabled: false }
        ]
    }

];

// todo: temp solution to release all of keys
function MacroHoldRleaseAll() {
    "use strict";
    menu_rfb.sendKeyHold(keymacros.transNameToKeymacroArray("Alt_R"), 0);
    menu_rfb.sendKeyHold(keymacros.transNameToKeymacroArray("Alt_L"), 0);
    menu_rfb.sendKeyHold(keymacros.transNameToKeymacroArray("Win_R"), 0);
    menu_rfb.sendKeyHold(keymacros.transNameToKeymacroArray("Win_L"), 0);
}

var vkb_enable_cfg = null;

function OnClickVKEnable(p_sType, p_aArgs, p_oValue) {
    "use strict";
    if (!vkb_enable_cfg)
        vkb_enable_cfg = this.cfg;
    var check = this.cfg.getProperty("checked");
    var keyName = p_oValue;

    if (check) {
        this.cfg.setProperty("checked", false);
        vkb.Show(false);
    } else {
        this.cfg.setProperty("checked", true);
        vkb.Show(true);
    }

    return;
}

function OnClickVKClose() {
    "use strict";
    if (!vkb_enable_cfg) {
        console.log("vkb_enable_cfg don't defined");
        return;
    }
    var check = vkb_enable_cfg.getProperty("checked");

    if (check) {
        vkb_enable_cfg.setProperty("checked", false);
        vkb.Show(false);
    } else {
        vkb_enable_cfg.setProperty("checked", true);
        vkb.Show(true);
    }

    return;
}

function OnClickMacroHold(p_sType, p_aArgs, p_oValue){
    "use strict";
    var check = this.cfg.getProperty("checked");
    var keyName = p_oValue;

    if (check) {
        menu_rfb.sendKeyHold(keymacros.transNameToKeymacroArray(keyName), 0);
        this.cfg.setProperty("checked", false);
    } else {
        menu_rfb.sendKeyHold(keymacros.transNameToKeymacroArray(keyName), 1);
        this.cfg.setProperty("checked", true);
    }
}

function OnClickMacroPress(p_sType, p_aArgs, p_oValue){
    "use strict";
    var check = this.cfg.getProperty("checked");
    var keyName = p_oValue;

    menu_rfb.sendMacro(keymacros.transNameToKeymacroArray(keyName));
}

function OnClickPower(p_sType, p_aArgs, p_oValue){
    "use strict";
    var keyName = p_oValue;
    var powerSel = "";

    if (keyName.localeCompare("power_off") == 0) {
        powerSel = "PowerOff";
    } else if (keyName.localeCompare("power_on") == 0){
        powerSel = "PowerOn";
    } else if (keyName.localeCompare("power_reset") == 0){
        powerSel = "PowerReset";
    } else if (keyName.localeCompare("power_swshutdown") == 0){
        powerSel = "SoftPowerOff";
    } else {
        Util.Error("OnClickPower:" + keyName + " is not existed");
        return false;
    }
    menu_rfb.sendPowerOnOff(powerSel)
    return true;
}

function findItemByIndex(index, subitem) {
    "use strict";
    var len = subitem.itemdata.length;
    var res;
    for (var index_j=0; index_j<len; index_j++) {
        var item = subitem.itemdata[index_j];
        if (item.index == index) {
            return item;
        }
        if (item.submenu) {
            res = findItemByIndex(index, item.submenu);
            if (res) return res;
        }
    }
    return undefined;
}

function findItemdataByIndex(index) {
    "use strict";
    var index_i, index_j;
    var len_submenu = submenu_obj.length;
    for (var index_i=0; index_i< len_submenu; index_i++) {
        if (submenu_obj[index_i].index == index) {

            return submenu_obj[index_i];
        }
        if (submenu_obj[index_i].itemdata) {
            var res = findItemByIndex(index, submenu_obj[index_i]);
            if (res) {
                return res;
            }

        }
    }
    return null;
}

function findItemdataMacroDefined() {
    "use strict";
    return findItemdataByIndex("macro_defined");
}

function DefItemobjByName(name, subpage){
    "use strict";
    var itemobj = {
        text: name,
        onclick: {fn: OnClickMacroPress, obj: subpage},
        index: "macro_defined"
    };
    return itemobj;
}

function DrawMenuBar(){
    "use strict";
    YAHOO.util.Event.onContentReady("iKVM_topmenubar", function () {

        /*
                        Instantiate a MenuBar:  The first argument passed to the constructor
                        is the id for the Menu element to be created, the second is an
                        object literal of configuration properties.
        */

        var oMenuBar = new YAHOO.widget.MenuBar("iKVM_topmenubar", {
                                                    autosubmenudisplay: false
                                                    ,hidedelay: 750
                                                    ,lazyload: true
                                                    ,keydownevent: false
                                                    });

        /*
             Define an array of object literals, each containing
             the data necessary to create a submenu.
        */

        var aSubmenuData = submenu_obj;


        /*
             Subscribe to the "beforerender" event, adding a submenu
             to each of the items in the MenuBar instance.
        */

        oMenuBar.subscribe("beforeRender", function ()
        {
            "use strict";
            var nSubmenus = aSubmenuData.length;
            var i;

            if (this.getRoot() == this) {
                for (i = 0; i < nSubmenus; i++)
                {

                    this.getItem(i).cfg.setProperty("submenu", aSubmenuData[i]);
                }
            }
        });

        oMenuBar.subscribe("beforeShow", function ()
        {
            "use strict";
            //Read power status if open power menu
            if(this.id == "power") {
                PowerMenuBar = this;
                getPwrStatus();
            }
        });
        /*
             Call the "render" method with no arguments since the
             markup for this MenuBar instance is already exists in
             the page.
        */

        oMenuBar.render();
    });
}

function page_mapping(mainpage, subpage)
{
    "use strict";
    /*main page [doris] test switch page cgi*/
    var page;
    CreateCookie("mainpage", mainpage);
    CreateCookie("subpage", subpage);

    if ((mainpage == 'macro_system') || (mainpage == 'macro_defined') || (mainpage == 'macro_press')) {
        if (subpage != 'top') {
            sendMacro(keymacros.transNameToKeymacroArray(subpage));
        }
    } else if (mainpage == 'macro_hold') {
        if (subpage != 'top') {
            console.log('macro_hold');
        }
    }
}

var _startX = 0;      // mouse starting positions
var _startY = 0;
var _offsetX = 0;     // current element offset
var _offsetY = 0;
var _dragElement;     // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;     // we temporarily increase the z-index during drag
var vkb = null;
var source = null;

// This function retrieves the source element
// for the given event object:
function get_event_source(e)
{
    "use strict";
    var event = e || window.event;
    return event.srcElement || event.target;
}

// This function binds 'handler' function to the
// 'eventType' event of the 'elem' element:
function setup_event(elem, eventType, handler)
{
    "use strict";
    return (elem.attachEvent) ? elem.attachEvent("on" + eventType, handler) : ((elem.addEventListener) ? elem.addEventListener(eventType, handler, false) : false);
}

// By focusing the INPUT field we set the 'source'
// to the newly focused field:
function focus_keyboard(e)
{
    "use strict";
    source = get_event_source(e);
}

// By "registering" the field we bind 'focus_keyboard'
// function to 'focus' event of the given INPUT field:
function register_field(id)
{
    "use strict";
    setup_event(document.getElementById(id), "focus", focus_keyboard);
}

function InitDragDrop()
{
    "use strict";
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
    vkb = new VKeyboard("iKVM_VirtualKeyboard",    // container's id
        keyb_callback, // reference to the callback function
        true,          // create the arrow keys or not? (this and the following params are optional)
        true,          // create up and down arrow keys?
        false,         // reserved
        true,          // create the numpad or not?
        "",            // font name ("" == system default)
        "14px",        // font size in px
        "#000",        // font color
        "#F00",        // font color for the dead keys
        "#FFF",        // keyboard base background color
        "#FFF",        // keys' background color
        "#DDD",        // background color of switched/selected item
        "#777",        // border color
        "#CCC",        // border/font color of "inactive" key (key with no value/disabled)
        "#FFF",        // background color of "inactive" key (key with no value/disabled)
        "#F77",        // border color of the language selector's cell
        true,          // show key flash on click? (false by default)
        "#CC3300",     // font color during flash
        "#FF9966",     // key background color during flash
        "#CC3300",     // key border color during flash
        false,         // embed VKeyboard into the page?
        true,          // use 1-pixel gap between the keys?
        0,
        keyb_layout_callback);            // index(0-based) of the initial layout
    vkb.Show(false);

    source = document.getElementById("iKVM_screen");
    register_field('iKVM_screen');
    source.focus();
}

function OnMouseDown(e)
{
    "use strict";
    // IE is retarded and doesn't pass the event object
    if (e == null)
        e = window.event;

    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;


    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null ||
        e.button == 0) &&
        target.className == 'drag')
    {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;

        // grab the clicked element's position
        _offsetX = ExtractNumber(target.style.left);
        _offsetY = ExtractNumber(target.style.top);

        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;

        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { "use strict"; return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { "use strict"; return false; };

        // prevent text selection (except IE)
        return false;
    }
}

function ExtractNumber(value)
{
    "use strict";
    var n = parseInt(value);

    return n == null || isNaN(n) ? 0 : n;
}

function OnMouseMove(e)
{
    "use strict";
    if (e == null)
        var e = window.event;

    // this is the actual "drag code"
    _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';

}

function OnMouseUp(e)
{
    "use strict";
    if (_dragElement != null)
    {
        _dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging
        _dragElement = null;
    }
}


// Advanced callback function:
//
function keyb_callback(ch)
{
    "use strict";
    var keymap = keymacros.transNameArrayToKeymacroArray(ch);
    menu_rfb.sendMacro(keymap);
    return;
}
function keyb_layout_callback(sel)
{
    "use strict";
    menu_rfb.sendKBLangSelect(sel);
    keyb_sync_lang();
}

function keyb_sync_locks() {
    "use strict";
    if (!vkb) {
        console.log("Virtual Keyboard is not existed");
        return false;
    }
    if ((!menu_rfb) || (!menu_rfb._AST_KBLed)) {
        console.log("RFB is not existed");
        return false;
    }

    var change = 0;
    if (vkb["CapsLk"] != menu_rfb._AST_KBLed.getCapsLk()) {
        vkb["CapsLk"] = !vkb["CapsLk"];
        change = 1;
    }
    if (vkb["NumLk"] != menu_rfb._AST_KBLed.getNumLk()) {
        vkb["NumLk"] = !vkb["NumLk"];
        change = 1;
    }
    if (vkb["ScrollLk"] != menu_rfb._AST_KBLed.getScrollLk()) {
        vkb["ScrollLk"] = !vkb["ScrollLk"];
        change = 1;
    }
    if (change) {
        vkb._refresh_layout();
    }
    return true;
}

function initializeMenu(rfb, macros) {
    "use strict";
    menu_rfb = rfb;
    keymacros = macros;
}

function keyb_sync_lang() {
    "use strict";
    if (menu_rfb._AST_ViewerLang.KBlangSelect == 0) {
        menu_rfb.dispatchEvent(new CustomEvent("kblang", { detail: vkb.getLang() }));
    } else if (vkb.getLangNum() == menu_rfb._AST_ViewerLang.KBlangSelect) {
        menu_rfb.dispatchEvent(new CustomEvent("kblang", { detail: vkb.getLang() }));
    } else {
        if (vkb.setLangNum(menu_rfb._AST_ViewerLang.KBlangSelect) >=0) {
            menu_rfb.dispatchEvent(new CustomEvent("kblang", { detail: vkb.getLang() }));
        } else {
            console.log("keyb_sync_lang failed. KBlangSelect: " + menu_rfb._AST_ViewerLang.KBlangSelect);
        }
    }
}

function PageInit()
{
    "use strict";
    DrawMenuBar();
    InitDragDrop();
}

function getPwrStatus()
{
    "use strict";
    let url = '../cgi/server_power_control.cgi';
    if(CSRF_TOKEN == "") {
        CSRF_TOKEN = window.opener.top.frames.topmenu.CSRF_TOKEN;
    }
    if(PRIV_ID == "") {
        PRIV_ID = window.opener.top.frames.topmenu.PRIV_ID;
    }
    let ajax_data = '';
    ajax_data += "<?xml version=\"1.0\"?>\n";
    ajax_data += "<POSTDATA>\n";
    ajax_data += "    <PRIV>" + PRIV_ID + "</PRIV>\n";
    ajax_data += "    <TOKEN>" + CSRF_TOKEN + "</TOKEN>\n";
    ajax_data += "    <FUNCTION>SERVER_POWER_CONTROL</FUNCTION>\n";
    ajax_data += "    <PARAMETERS>\n";
    ajax_data += "        <GET_CHASSIS_STATUS>1</GET_CHASSIS_STATUS>\n";
    ajax_data += "    </PARAMETERS>\n";
    ajax_data += "</POSTDATA>\n";
    let myAjax = new Ajax.Request(
        url,
        {
            method: 'post',
            contentType: "text/xml",
            xml_data: ajax_data,
            onComplete: getPwrStatusHandler
        });
}


function getPwrStatusHandler(originalRequest)
{
    "use strict";
    if (originalRequest.readyState == 4 && originalRequest.status == 200)
    {
        let response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        let xmldoc = GetResponseXML(response);

        if(xmldoc == null) {
            SessionTimeout();
            return;
        }

        //check session & privilege result
        if(CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        let IPMIRoot = xmldoc.documentElement;//point to IPMI
        let POWER_INFO = IPMIRoot.getElementsByTagName('POWER_INFO');//point to POWER_INFO
        let POWER = POWER_INFO[0].getElementsByTagName('POWER');
        let pwrStatus = POWER[0].getAttribute("STATUS");
        if(pwrStatus == "OFF") {
            PowerMenuBar.getItem(0).cfg.setProperty("disabled", false); //on
            PowerMenuBar.getItem(1).cfg.setProperty("disabled", true);  //off
            PowerMenuBar.getItem(2).cfg.setProperty("disabled", true);  //sw shutdown
            PowerMenuBar.getItem(3).cfg.setProperty("disabled", true);  //reset
        } else {
            PowerMenuBar.getItem(0).cfg.setProperty("disabled", true);
            PowerMenuBar.getItem(1).cfg.setProperty("disabled", false);
            PowerMenuBar.getItem(2).cfg.setProperty("disabled", false);
            PowerMenuBar.getItem(3).cfg.setProperty("disabled", false);
        }
    }
}

