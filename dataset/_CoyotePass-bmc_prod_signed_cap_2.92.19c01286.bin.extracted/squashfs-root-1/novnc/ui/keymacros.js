"use strict";

import KeyTable from "../core/input/keysym.js";

export default class KeyMacros {

	constructor (clickFunc){
		var keymacros = {};
		var KEYMACROS_CGI = "../../cgi/keymacros.cgi";
		var KEYMACROS_XML = "keymacro.xml";
		var KEYMACRO_ID_INDEX = "keymacro_btn_";
		var KEYMACROMENU_UL = "macroMenuUl";
	    var name = "";
	    var value = "";
		keymacros.sendMacro = clickFunc;
		keymacros.menuBtn = {
			submenu: null,
			itemdata: null,
			defItemFun: null,
			drawBtnFunc: null
		};


		var KeyMacro = function(){
                        "use strict";
				var keymacro = {};
				keymacro.name = "";
				keymacro.keys = "";
				keymacro.button = "";
				keymacro.id = "";
				keymacro.keysParsing = "";
				keymacro.keysParsingCodes = "";
				return keymacro;

		};

		//handler for read keyboard macros
		var KeyMacrosArray = new Array();
		var KeyMappingTable = {

			createNew: function() {
                        "use strict";

				var keymappingtable = {};
				var KeyMapping = function(name, code) {
                              "use strict";
					var keymapping = {};
					keymapping.name = name;
					keymapping.code = code;
					return keymapping;
				};
				var KeyMappingArray = new Array();

				var addKeyMapping = function(name, code) {
                              "use strict";
					var keymapping = KeyMapping(name, code);
					KeyMappingArray.push(keymapping);
				};
				var initKeyMapping = function() {
                              "use strict";
					KeyMappingArray = new Array();
				};

				var printKeyMappingTable = function() {
                              "use strict";
					var i;
					for (i=0; i<KeyMappingArray.length; i++){
						console.log(i + ":"
									+ "name: " + KeyMappingArray[i].name
									+ ", code: " + KeyMappingArray[i].code.toString(16));
					}
				};

				var toLowerCase = function() {
                              "use strict";
					var i;
					for (i=0; i<KeyMappingArray.length; i++) {
						KeyMappingArray[i].name = KeyMappingArray[i].name.toLocaleLowerCase();
					}
				};

				var searchCodeByName = function(name) {
                              "use strict";
					var i;
					var nameLower = name.toLocaleLowerCase();
					for (i=0; i<KeyMappingArray.length; i++) {
						if (nameLower.localeCompare(KeyMappingArray[i].name) == 0 ) {
							return KeyMappingArray[i].code;
						}
					}


					return 0;
				};

				initKeyMapping();
				keymappingtable.KeyMappingArray = KeyMappingArray;
				keymappingtable.put = addKeyMapping;
				keymappingtable.printTable = printKeyMappingTable;
				keymappingtable.toLowerCase = toLowerCase;
				keymappingtable.searchCodeByName = searchCodeByName;

				return keymappingtable;
			}
		};
		var keycodeTable;

        var initKeycodeTable = function() {
            "use strict";
            keycodeTable = KeyMappingTable.createNew();

            keycodeTable.put("SHIFT", KeyTable.XK_Shift_L);
            keycodeTable.put("CTRL", KeyTable.XK_Control_L);
            keycodeTable.put("ALT", KeyTable.XK_Alt_L);
            keycodeTable.put("ALTGR", KeyTable.XK_Alt_L);
            keycodeTable.put("META", KeyTable.XK_Meta_L);

            keycodeTable.put("0", KeyTable.XK_0);
            keycodeTable.put("1", KeyTable.XK_1);
            keycodeTable.put("2", KeyTable.XK_2);
            keycodeTable.put("3", KeyTable.XK_3);
            keycodeTable.put("4", KeyTable.XK_4);
            keycodeTable.put("5", KeyTable.XK_5);
            keycodeTable.put("6", KeyTable.XK_6);
            keycodeTable.put("7", KeyTable.XK_7);
            keycodeTable.put("8", KeyTable.XK_8);
            keycodeTable.put("9", KeyTable.XK_9);
            keycodeTable.put("F1", KeyTable.XK_F1);
            keycodeTable.put("F2", KeyTable.XK_F2);
            keycodeTable.put("F3", KeyTable.XK_F3);
            keycodeTable.put("F4", KeyTable.XK_F4);
            keycodeTable.put("F5", KeyTable.XK_F5);
            keycodeTable.put("F6", KeyTable.XK_F6);
            keycodeTable.put("F7", KeyTable.XK_F7);
            keycodeTable.put("F8", KeyTable.XK_F8);
            keycodeTable.put("F9", KeyTable.XK_F9);
            keycodeTable.put("F10", KeyTable.XK_F10);
            keycodeTable.put("F11", KeyTable.XK_F11);
            keycodeTable.put("F12", KeyTable.XK_F12);
            keycodeTable.put("A", KeyTable.XK_A);
            keycodeTable.put("B", KeyTable.XK_B);
            keycodeTable.put("C", KeyTable.XK_C);
            keycodeTable.put("D", KeyTable.XK_D);
            keycodeTable.put("E", KeyTable.XK_E);
            keycodeTable.put("F", KeyTable.XK_F);
            keycodeTable.put("G", KeyTable.XK_G);
            keycodeTable.put("H", KeyTable.XK_H);
            keycodeTable.put("I", KeyTable.XK_I);
            keycodeTable.put("J", KeyTable.XK_J);
            keycodeTable.put("K", KeyTable.XK_K);
            keycodeTable.put("L", KeyTable.XK_L);
            keycodeTable.put("M", KeyTable.XK_M);
            keycodeTable.put("N", KeyTable.XK_N);
            keycodeTable.put("O", KeyTable.XK_O);
            keycodeTable.put("P", KeyTable.XK_P);
            keycodeTable.put("Q", KeyTable.XK_Q);
            keycodeTable.put("R", KeyTable.XK_R);
            keycodeTable.put("S", KeyTable.XK_S);
            keycodeTable.put("T", KeyTable.XK_T);
            keycodeTable.put("U", KeyTable.XK_U);
            keycodeTable.put("V", KeyTable.XK_V);
            keycodeTable.put("W", KeyTable.XK_W);
            keycodeTable.put("X", KeyTable.XK_X);
            keycodeTable.put("Y", KeyTable.XK_Y);
            keycodeTable.put("Z", KeyTable.XK_Z);
            keycodeTable.put("PageUP", KeyTable.XK_Page_Up);
            keycodeTable.put("PageDown", KeyTable.XK_Page_Down);
            keycodeTable.put("INSERT", KeyTable.XK_Insert);
            keycodeTable.put("INS", KeyTable.XK_Insert);
            keycodeTable.put("HOME", KeyTable.XK_Home);
            keycodeTable.put("END", KeyTable.XK_End);
            keycodeTable.put("DEL", KeyTable.XK_Delete);
            keycodeTable.put("DELETE", KeyTable.XK_Delete);
            keycodeTable.put("PRTSC", KeyTable.XK_Print);
            keycodeTable.put("PrntScrn", KeyTable.XK_Print);
            keycodeTable.put("PRINTSCREEN", KeyTable.XK_Print);

            // Javascript add
            keycodeTable.put("Esc", KeyTable.XK_Escape);
            keycodeTable.put("Tab", KeyTable.XK_Tab);
            keycodeTable.put("Win", KeyTable.XK_Super_L);
            keycodeTable.put("Win_L", KeyTable.XK_Super_L);
            keycodeTable.put("Super_L", KeyTable.XK_Super_L);
            keycodeTable.put("Win_R", KeyTable.XK_Super_R);
            keycodeTable.put("Super_R", KeyTable.XK_Super_R);
            keycodeTable.put("ALT_L", KeyTable.XK_Alt_L);
            keycodeTable.put("ALT_GR", KeyTable.XK_Alt_R);
            keycodeTable.put("ALT_R", KeyTable.XK_Alt_R);
            keycodeTable.put("CTRL_L", KeyTable.XK_Control_L);
            keycodeTable.put("CTRL_R", KeyTable.XK_Control_R);
            keycodeTable.put("SHIFT_R", KeyTable.XK_Shift_R);
            keycodeTable.put("Space", KeyTable.XK_space);
            keycodeTable.put("Enter", KeyTable.XK_Return);
            keycodeTable.put("Backspace", KeyTable.XK_BackSpace);
            keycodeTable.put("Hyphen", KeyTable.XK_Hyper_L);
            keycodeTable.put("Menu", KeyTable.XK_Menu);
            keycodeTable.put("F21", KeyTable.XK_F21);

            // System
            keycodeTable.put("ScrollLock", KeyTable.XK_Scroll_Lock);
            keycodeTable.put("Pause", KeyTable.XK_Pause);
            keycodeTable.put("Caps", KeyTable.XK_Caps_Lock);

            // keypad, numpad
            keycodeTable.put("NumLock", KeyTable.XK_Num_Lock);
            keycodeTable.put("pad_NumLock", KeyTable.XK_Num_Lock);
            keycodeTable.put("pad_0", KeyTable.XK_KP_0);
            keycodeTable.put("pad_1", KeyTable.XK_KP_1);
            keycodeTable.put("pad_2", KeyTable.XK_KP_2);
            keycodeTable.put("pad_3", KeyTable.XK_KP_3);
            keycodeTable.put("pad_4", KeyTable.XK_KP_4);
            keycodeTable.put("pad_5", KeyTable.XK_KP_5);
            keycodeTable.put("pad_6", KeyTable.XK_KP_6);
            keycodeTable.put("pad_7", KeyTable.XK_KP_7);
            keycodeTable.put("pad_8", KeyTable.XK_KP_8);
            keycodeTable.put("pad_9", KeyTable.XK_KP_9);
            keycodeTable.put("pad_divide", KeyTable.XK_KP_Divide);
            keycodeTable.put("pad_multiply", KeyTable.XK_KP_Multiply);
            keycodeTable.put("pad_substract", KeyTable.XK_KP_Subtract);
            keycodeTable.put("pad_add", KeyTable.XK_KP_Add);
            keycodeTable.put("pad_decimal", KeyTable.XK_KP_Decimal);
            keycodeTable.put("pad_/", KeyTable.XK_KP_Divide);
            keycodeTable.put("pad_*", KeyTable.XK_KP_Multiply);
            keycodeTable.put("pad_-", KeyTable.XK_KP_Subtract);
            keycodeTable.put("pad_+", KeyTable.XK_KP_Add);
            keycodeTable.put("pad_.", KeyTable.XK_KP_Decimal);
            keycodeTable.put("pad_enter", KeyTable.XK_KP_Enter);

            // Arrow
            keycodeTable.put("left", KeyTable.XK_Left);
            keycodeTable.put("down", KeyTable.XK_Down);
            keycodeTable.put("up", KeyTable.XK_Up);
            keycodeTable.put("right", KeyTable.XK_Right);

            // Symbol
            keycodeTable.put("grave", KeyTable.XK_grave);
            keycodeTable.put("minus", KeyTable.XK_minus);
            keycodeTable.put("plus", KeyTable.XK_plus);
            keycodeTable.put("equal", KeyTable.XK_equal);
            keycodeTable.put("braceleft", KeyTable.XK_braceleft);
            keycodeTable.put("braceright", KeyTable.XK_braceright);
            keycodeTable.put("slash", KeyTable.XK_slash);
            keycodeTable.put("colon", KeyTable.XK_colon);
            keycodeTable.put("semicolon", KeyTable.XK_semicolon);
            keycodeTable.put("quoteright", KeyTable.XK_quoteright);
            keycodeTable.put("less", KeyTable.XK_less);
            keycodeTable.put("greater", KeyTable.XK_greater);
            keycodeTable.put("comma", KeyTable.XK_comma);
            keycodeTable.put("period", KeyTable.XK_period);
            keycodeTable.put("question", KeyTable.XK_question);
            keycodeTable.put("backslash", KeyTable.XK_backslash);
            keycodeTable.put("parenleft", KeyTable.XK_parenleft);
            keycodeTable.put("parenright", KeyTable.XK_parenright);

            // java kvm
            keycodeTable.put("RSHIFT", KeyTable.XK_Shift_R);
            keycodeTable.put("SHIFT", KeyTable.XK_Shift_L);
            keycodeTable.put("CTRL", KeyTable.XK_Control_L);
            keycodeTable.put("RCTRL", KeyTable.XK_Control_R);
            keycodeTable.put("ALT", KeyTable.XK_Alt_L);
            keycodeTable.put("RALT", KeyTable.XK_Alt_R);
            keycodeTable.put("ALTGR", KeyTable.XK_Alt_R);
            keycodeTable.put("META", KeyTable.XK_Meta_L);

            keycodeTable.put("0", KeyTable.XK_0);
            keycodeTable.put("1", KeyTable.XK_1);
            keycodeTable.put("2", KeyTable.XK_2);
            keycodeTable.put("3", KeyTable.XK_3);
            keycodeTable.put("4", KeyTable.XK_4);
            keycodeTable.put("5", KeyTable.XK_5);
            keycodeTable.put("6", KeyTable.XK_6);
            keycodeTable.put("7", KeyTable.XK_7);
            keycodeTable.put("8", KeyTable.XK_8);
            keycodeTable.put("9", KeyTable.XK_9);
            keycodeTable.put("A", KeyTable.XK_A);
            keycodeTable.put("B", KeyTable.XK_B);
            keycodeTable.put("C", KeyTable.XK_C);
            keycodeTable.put("D", KeyTable.XK_D);
            keycodeTable.put("E", KeyTable.XK_E);
            keycodeTable.put("F", KeyTable.XK_F);
            keycodeTable.put("G", KeyTable.XK_G);
            keycodeTable.put("H", KeyTable.XK_H);
            keycodeTable.put("I", KeyTable.XK_I);
            keycodeTable.put("J", KeyTable.XK_J);
            keycodeTable.put("K", KeyTable.XK_K);
            keycodeTable.put("L", KeyTable.XK_L);
            keycodeTable.put("M", KeyTable.XK_M);
            keycodeTable.put("N", KeyTable.XK_N);
            keycodeTable.put("O", KeyTable.XK_O);
            keycodeTable.put("P", KeyTable.XK_P);
            keycodeTable.put("Q", KeyTable.XK_Q);
            keycodeTable.put("R", KeyTable.XK_R);
            keycodeTable.put("S", KeyTable.XK_S);
            keycodeTable.put("T", KeyTable.XK_T);
            keycodeTable.put("U", KeyTable.XK_U);
            keycodeTable.put("V", KeyTable.XK_V);
            keycodeTable.put("W", KeyTable.XK_W);
            keycodeTable.put("X", KeyTable.XK_X);
            keycodeTable.put("Y", KeyTable.XK_Y);
            keycodeTable.put("Z", KeyTable.XK_Z);
            keycodeTable.put("F1", KeyTable.XK_F1);
            keycodeTable.put("F2", KeyTable.XK_F2);
            keycodeTable.put("F3", KeyTable.XK_F3);
            keycodeTable.put("F4", KeyTable.XK_F4);
            keycodeTable.put("F5", KeyTable.XK_F5);
            keycodeTable.put("F6", KeyTable.XK_F6);
            keycodeTable.put("F7", KeyTable.XK_F7);
            keycodeTable.put("F8", KeyTable.XK_F8);
            keycodeTable.put("F9", KeyTable.XK_F9);
            keycodeTable.put("F10", KeyTable.XK_F10);
            keycodeTable.put("F11", KeyTable.XK_F11);
            keycodeTable.put("F12", KeyTable.XK_F12);
            keycodeTable.put("PAGEUP", KeyTable.XK_Page_Up);
            keycodeTable.put("PGUP", KeyTable.XK_Page_Up);
            keycodeTable.put("PAGEDOWN", KeyTable.XK_Page_Down);
            keycodeTable.put("PGDOWN", KeyTable.XK_Page_Down);
            keycodeTable.put("INSERT", KeyTable.XK_Insert);
            keycodeTable.put("INS", KeyTable.XK_Insert);
            keycodeTable.put("HOME", KeyTable.XK_Home);
            keycodeTable.put("END", KeyTable.XK_End);
            keycodeTable.put("DEL", KeyTable.XK_Delete);
            keycodeTable.put("DELETE", KeyTable.XK_Delete);
            keycodeTable.put("PRTSC", KeyTable.XK_Print);
            keycodeTable.put("PRTSCR", KeyTable.XK_Print);
            keycodeTable.put("PRINTSCREEN", KeyTable.XK_Print);
            keycodeTable.put("WIN", KeyTable.XK_Super_L);
            keycodeTable.put("RWIN", KeyTable.XK_Super_R);
            keycodeTable.put("ENTER", KeyTable.XK_Return);
            keycodeTable.put("TAB", KeyTable.XK_Tab);
            keycodeTable.put("CAPSLK", KeyTable.XK_Caps_Lock);
            keycodeTable.put("LEFT", KeyTable.XK_Left);
            keycodeTable.put("RIGHT", KeyTable.XK_Right);
            keycodeTable.put("UP", KeyTable.XK_Up);
            keycodeTable.put("DOWN", KeyTable.XK_Down);
            keycodeTable.put("BKSP", KeyTable.XK_BackSpace);
            keycodeTable.put("NUMLK", KeyTable.XK_Num_Lock);
            keycodeTable.put("NP_PLUS", KeyTable.XK_KP_Add);
            keycodeTable.put("ESC", KeyTable.XK_Escape);
            keycodeTable.put("SPACE", KeyTable.XK_space);
            keycodeTable.put("CONTEXT", KeyTable.XK_Menu);
            keycodeTable.put("NP_DIV", KeyTable.XK_KP_Divide);
            keycodeTable.put("NP_MULT", KeyTable.XK_KP_Multiply);
            keycodeTable.put("NP_MINUS", KeyTable.XK_KP_Subtract);
            keycodeTable.put("NP_0", KeyTable.XK_KP_0);
            keycodeTable.put("NP_1", KeyTable.XK_KP_1);
            keycodeTable.put("NP_2", KeyTable.XK_KP_2);
            keycodeTable.put("NP_3", KeyTable.XK_KP_3);
            keycodeTable.put("NP_4", KeyTable.XK_KP_4);
            keycodeTable.put("NP_5", KeyTable.XK_KP_5);
            keycodeTable.put("NP_6", KeyTable.XK_KP_6);
            keycodeTable.put("NP_7", KeyTable.XK_KP_7);
            keycodeTable.put("NP_8", KeyTable.XK_KP_8);
            keycodeTable.put("NP_9", KeyTable.XK_KP_9);
            keycodeTable.put("NP_ENTER", KeyTable.XK_KP_Enter);
            keycodeTable.put("NP_DEC", KeyTable.XK_KP_Decimal);
            keycodeTable.put("SCRLK", KeyTable.XK_Scroll_Lock);
            keycodeTable.put("PAUSE", KeyTable.XK_Pause);

            keycodeTable.toLowerCase();
            // Debug
            // keycodeTable.printTable();
        };

		var NameParsing = function(name) {
                  "use strict";
			var parsing = name.split("+");
			var i;
			for(i=0; i<parsing.length; i++){
				parsing[i] = parsing[i].trim().toLocaleLowerCase();
			}
			// var parsingtrim = parsing.trim();
			return parsing;
		};

		var AddKeysParsing = function(keymacro) {
                  "use strict";

			keymacro.keysParsing = NameParsing(keymacro.keys);

		};

		var KeyMacroToBtn = function(defItemFun, keymacro) {
                  "use strict";

			var btn = new Object();

			if (keymacro.name == "") {
				keymacro.name = keymacro.keys;
			}
			// var func = "javascript:page_mapping('macro_defined', '"
		 //  		+ keymacro.keys
		 //  		+ "')" ;
			// var btn_index = "macro_defined";
			// btn = {
			// 	text: keymacro.name,
			// 	url: func,
			// 	index: btn_index
			// };
			btn = defItemFun(keymacro.name, keymacro.keys);
			return btn;
		};

        // Use XML for CGI requests.
		var ReadKeyMacrosHTML5 = function(originalRequest)
		{
                  "use strict";
			var KeyMacrosArray = keymacros.KeyMacrosArray;
		    if (originalRequest != null && originalRequest.readyState == 4 && originalRequest.status == 200)
		    {
                var response = originalRequest.responseText;
                var xml_obj = GetResponseXML(response);
		        if(xml_obj != null)
		        {
                    var idx = 0;
                    var KEYMACROSRoot = xml_obj.documentElement;
		            var KeyMacros = KEYMACROSRoot.getElementsByTagName('KEYMACRO');//point to KEYMACRO
		            var KeyMacroName;
		            var KeyMacroKeys;
		            var KeyNameObj;
		            var KeyValueObj;
		            var FieldStr;
		            var keyMacroBtns = new Array();
		            var keyMacroBtn;
		            var keyMacroBtnDefItemFun = keymacros.menuBtn.defItemFun;
		            if(KeyMacros != null) {
                        for (idx = 0; idx < KeyMacros.length; idx++) {
                            var temp = new KeyMacro();
                            temp.name = KeyMacros[idx].getAttribute("NAME");
                            temp.keys = KeyMacros[idx].getAttribute("KEYS");
                            temp.id = KEYMACRO_ID_INDEX + idx;
                            KeyMacrosArray.push(temp);
                            // keyMacroBtn = KeyMacroToBtn(KeyMacrosArray[idx]);
                            if (keyMacroBtnDefItemFun)
                                keyMacroBtn = KeyMacroToBtn(keyMacroBtnDefItemFun, KeyMacrosArray[idx]);
                            keyMacroBtns.push(keyMacroBtn);
                            // AddKeysParsing(KeyMacrosArray[idx]);
                            // transMacroToXK(KeyMacrosArray[idx]);
		                }
		                if (keymacros.menuBtn.submenu) {
                            keymacros.menuBtn.submenu.itemdata = keyMacroBtns;
                            if (keymacros.menuBtn.submenu.itemdata.length > 0)
                                keymacros.menuBtn.itemdata.disabled = false;
		                }
		            }
		        }
		        if (keymacros.menuBtn.drawBtnFunc)
				keymacros.menuBtn.drawBtnFunc();
		        // keymacros.transMacrosToXK();
		        // keymacros.appendMacrosBtnOnclick();

		    }
		}.bind(keymacros);

        /*
        var ReadKeyMacrosHTML5 = function(originalRequest)
        {
            if (originalRequest != null && originalRequest.readyState == 4
                && originalRequest.status == 200) {
                var response = originalRequest.responseText;
                var json = JSON.parse(response);
                if (json.hasOwnProperty("RESULT") == true) {
                    var result = json.RESULT;
                    if (result.toUpperCase() == "OK") {
                        if (json.hasOwnProperty("KEYMACROS") == true) {
                            var KeyMacros = json.KEYMACROS;
                            var KeyMacroName;
                            var KeyMacroKeys;
                            var KeyNameObj;
                            var KeyValueObj;
                            var FieldStr;
                            var keyMacroBtns = new Array();
                            var keyMacroBtn;
                            var keyMacroBtnDefItemFun = keymacros.menuBtn.defItemFun;
                            if (KeyMacros != null) {
                                for (idx = 0; idx < KeyMacros.length; idx++) {
                                    var temp = new KeyMacro();
                                    temp.name = KeyMacros[idx].NAME;
                                    temp.keys = KeyMacros[idx].VALUE;
                                    temp.id = KEYMACRO_ID_INDEX + idx;
                                    KeyMacrosArray.push(temp);
                                    //keyMacroBtn = KeyMacroToBtn(KeyMacrosArray[idx]);
                                    if (keyMacroBtnDefItemFun) {
                                        keyMacroBtn = KeyMacroToBtn(keyMacroBtnDefItemFun, KeyMacrosArray[idx]);
                                    }
                                    keyMacroBtns.push(keyMacroBtn);
                                    //AddKeysParsing(KeyMacrosArray[idx]);
                                    //transMacroToXK(KeyMacrosArray[idx]);

                                    // Debug
                                    Util.Debug(idx + ": " +KeyMacrosArray[idx].name + ", " +KeyMacrosArray[idx].id + ", "
                                    // KeyMacrosArray[idx].keysParsingCodes
                                    );
                                }

                                if (keymacros.menuBtn.submenu) {
                                    keymacros.menuBtn.submenu.itemdata = keyMacroBtns;
                                    if (keymacros.menuBtn.submenu.itemdata.length > 0) {
                                        keymacros.menuBtn.itemdata.disabled = false;
                                    }
                                }
                            }
                        }
                    }
                }
                if (keymacros.menuBtn.drawBtnFunc) {
                    keymacros.menuBtn.drawBtnFunc();
                }
                //keymacros.transMacrosToXK();
                //keymacros.appendMacrosBtnOnclick();
            }
        }.bind(keymacros);*/

        var ReadKeyMacros = function()
        {
            "use strict";
            ReadKeyMacrosHTML5(window.opener.KeyMacrosResult);
        };

		var transMacroToArray = function(name)
		{
                  "use strict";
			var keysParsing = NameParsing(name);

			return transNameArrayToKeyCodeArray(keysParsing);
		};
		var transNameArrayToKeyCodeArray = function(name_arr)
		{
                  "use strict";
			var index;
			var res;

			var keysParsing = name_arr;
			var keycodes = new Array();

			for (index = 0; index < keysParsing.length; index++){
				var name = keysParsing[index];
				var code = keycodeTable.searchCodeByName(name);
				if (code == 0) {
					console.log("Find Macros: " + keysParsing[index] + " failed !");
					res = false;
					break;
				} else {
					keycodes.push(code);
					res = true;
				}
			}
			if (res)
				res = keycodes;
			else
				res = new Array();
			return res;
		};

		var transMacroToXK = function(keymacro)
		{
                  "use strict";
			var index;
			var res;

			var keycodes = new Array();

			for (index = 0; index < keymacro.keysParsing.length; index++){
				var name = keymacro.keysParsing[index];
				var code = keycodeTable.searchCodeByName(name);
				if (code == 0) {
					console.log("Find Macros: " + keymacro.keysParsing[index] + " failed !");
					res = false;
					break;
				} else {
					keycodes.push(code);
					res = true;
				}
			}
			if (res)
				keymacro.keysParsingCodes = keycodes;
			else
				keymacro.keysParsingCodes = new Array();
			return res;
		};
		var transMacrosToXK = function()
		{
                  "use strict";
			var index;
			var res;
			// initKeycodeTable();

			for (index = 0; index<KeyMacrosArray.length; index++) {
				res = transMacroToXK(KeyMacrosArray[index]);
				if (res == false) {
					console.log("transmacrosToXK failed");
					console.log(KeyMacrosArray[index].name + ", "
								+ KeyMacrosArray[index].keys);
					// return false;
				}
			}
			return true;
		};

		var appendMacroBtnOnclick = function(keymacro) {
                  "use strict";
			if (keymacro.keysParsingCodes == 0) {
				$D(keymacro.id).value = "Unknown";
				return false;
			}
			else {
				$D(keymacro.id).onclick = function() {
                              "use strict";
					return sendMacro(keymacro.keysParsingCodes);
				};
				return true;
			}

		};
		var appendMacrosBtnOnclick = function()
		{
                  "use strict";
			var index;
			var res;

			for (index = 0; index <KeyMacrosArray.length; index++) {
				res = appendMacroBtnOnclick(KeyMacrosArray[index]);
				if (res = false) {
					console.log(KeyMacrosArray[index].name + KeyMacrosArray[index].keys);
					// return false;
				}
			}
			return true;
		};

		keymacros.InitMacroBtns = function(itemdata, defItem, drawBtnFunc)
		{
                  "use strict";
			var res;
			KeyMacrosArray.clear();
			keymacros.menuBtn.itemdata = itemdata;
			keymacros.menuBtn.submenu = itemdata.submenu;
			keymacros.menuBtn.defItemFun = defItem;
			keymacros.menuBtn.drawBtnFunc = drawBtnFunc;
			ReadKeyMacros();
		};
		keymacros.transNameToKeymacroArray = function(name)
		{
                  "use strict";
			var keycode = transMacroToArray(name);
			if (keycode.length == 0)
			{
				console.log("transNameToKeymacroArray failed: " + name);
				return keycode;
			}
			return keycode;
		};
		keymacros.transNameArrayToKeymacroArray = function(name_arr)
		{
                  "use strict";
			var keycode = transNameArrayToKeyCodeArray(name_arr);
			if (keycode.length == 0)
			{
				console.log("transNameArrayToKeymacroArray failed: " + name_arr);
				return keycode;
			}
			return keycode;
		};
		keymacros.KeyMacrosArray = KeyMacrosArray;
		keymacros.transMacroToXK = transMacroToXK;
		keymacros.transMacrosToXK = transMacrosToXK;
		keymacros.appendMacrosBtnOnclick = appendMacrosBtnOnclick;

		initKeycodeTable();
		return keymacros;
	}
};
