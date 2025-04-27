"use strict";
/* JavaScript Virtual Keyboard, version 2.7
 *
 * (C) 2006-2008 Dmitriy Khudorozhkov (mailto:dmitrykhudorozhkov@yahoo.com)
 *
 * This software is provided "as-is", without any express or implied warranty.
 * In no event will the author be held liable for any damages arising from the
 * use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source distribution.
 */

function VKeyboard(container_id, callback_ref, create_arrows, create_updown,
    create_nav_keys, create_numpad, font_name, font_size,
    font_color, dead_color, bg_color, key_color,
    sel_item_color, border_color, inactive_border_color,
    inactive_key_color, lang_sel_brd_color, show_click,
    click_font_color, click_bg_color, click_border_color,
    do_embed, do_gap, start_layout_index, layout_callback_ref) {
    "use strict";
    return this._construct(container_id, callback_ref, create_arrows, create_updown,
        create_nav_keys, create_numpad, font_name, font_size,
        font_color, dead_color, bg_color, key_color,
        sel_item_color, border_color, inactive_border_color,
        inactive_key_color, lang_sel_brd_color, show_click,
        click_font_color, click_bg_color, click_border_color,
        do_embed, do_gap, start_layout_index, layout_callback_ref);
}

VKeyboard.kbArray = [];

VKeyboard.LangNum = {
    DEFAULT: 0,
    ENGLISH: 1,
    CHINESE_S: 2,
    CHINESE_C: 3,
    JAPANESE: 4,
    GERMANY: 5,
    FRANCH: 6,
    SPANISH: 7,
    KOREAN: 8,
    ITALIAN: 9,
    UK: 10
};

VKeyboard.prototype = {

    _get_event_source: function(event) {
        "use strict";
        var e = event || window.event;
        var src_e = e.srcElement || e.target;

        // when mouseup on "IMG", the parent will react the event
        if (src_e.tagName == "IMG") {
            return src_e.parentElement || src_e.parentElement;
        }
        return src_e;
    },

    _setup_event: function(elem, eventType, handler) {
        "use strict";
        // when mouseup on "IMG", the parent will react the event
        if (elem.lastChild) {
            var elem_img = elem.lastChild;
            if (elem_img.tagName == "IMG")
                elem_img.attachEvent ? elem_img.attachEvent("on" + eventType, handler) : ((elem_img.addEventListener) ? elem_img.addEventListener(eventType, handler, false) : null);
        }
        return (elem.attachEvent ? elem.attachEvent("on" + eventType, handler) : ((elem.addEventListener) ? elem.addEventListener(eventType, handler, false) : null));
    },

    _detach_event: function(elem, eventType, handler) {
        "use strict";
        // when mouseup on "IMG", the parent will react the event
        if (elem.lastChild) {
            var elem_img = elem.lastChild;
            if (elem_img.tagName == "IMG")
                elem_img.detachEvent ? elem_img.detachEvent("on" + eventType, handler) : ((elem_img.removeEventListener) ? elem_img.removeEventListener(eventType, handler, false) : null);
        }
        return (elem.detachEvent ? elem.detachEvent("on" + eventType, handler) : ((elem.removeEventListener) ? elem.removeEventListener(eventType, handler, false) : null));
    },

    _start_flash: function(in_el) {
        "use strict";
        function getColor(str, posOne, posTwo) {
            "use strict";
            if (/rgb\((\d+),\s(\d+),\s(\d+)\)/.exec(str)) // try to detect Mozilla-style rgb value.
            {
                switch (posOne) {
                    case 1:
                        return parseInt(RegExp.$1, 10);
                    case 2:
                        return parseInt(RegExp.$2, 10);
                    case 3:
                        return parseInt(RegExp.$3, 10);
                    default:
                        return 0;
                }
            } else // standard (#xxxxxx or #xxx) way
                return str.length == 4 ? parseInt(str.substr(posOne, 1) + str.substr(posOne, 1), 16) : parseInt(str.substr(posTwo, 2), 16);
        }

        function getR(color_string) { return getColor(color_string, 1, 1); }

        function getG(color_string) { return getColor(color_string, 2, 3); }

        function getB(color_string) { return getColor(color_string, 3, 5); }

        var el = in_el.time ? in_el : (in_el.company && in_el.company.time ? in_el.company : null);

        if (el) {
            el.time = 0;
            clearInterval(el.timer);
        }

        var vkb = this;
        var ftc = vkb.fontcolor,
            bgc = vkb.keycolor,
            brc = vkb.bordercolor;

        // Special fixes for simple/dead/modifier keys:


        var shortId = vkb._findShortId(in_el);
        // if(((in_el.innerHTML == "Shift") && vkb.Shift) || ((in_el.innerHTML == "Caps") && vkb.Caps) || ((in_el.innerHTML == "AltGr") && vkb.AltGr))
        if (((shortId == "shift") && vkb.Shift) ||
            ((shortId == "shift_r") && vkb.Shift) ||
            ((shortId == "caps") && vkb.CapsLk) ||
            ((shortId == "pad_numlock") && vkb.NumLk) ||
            ((shortId == "scrolllock") && vkb.ScrollLk) ||
            ((shortId == "alt_l") && vkb.Alt) ||
            ((shortId == "alt_gr") && vkb.AltGr) ||
            ((shortId == "ctrl_l") && vkb.Ctrl) ||
            ((shortId == "ctrl_r") && vkb.Ctrl)
        )
            bgc = vkb.lic;

        // Extract base color values:
        var fr = getR(ftc),
            fg = getG(ftc),
            fb = getB(ftc);
        var kr = getR(bgc),
            kg = getG(bgc),
            kb = getB(bgc);
        var br = getR(brc),
            bg = getG(brc),
            bb = getB(brc);

        // Extract flash color values:
        var f_r = getR(vkb.cfc),
            f_g = getG(vkb.cfc),
            f_b = getB(vkb.cfc);
        var k_r = getR(vkb.cbg),
            k_g = getG(vkb.cbg),
            k_b = getB(vkb.cbg);
        var b_r = getR(vkb.cbr),
            b_g = getG(vkb.cbr),
            b_b = getB(vkb.cbr);

        var _shift_colors = function() {
            "use strict";
            function dec2hex(dec) {
                "use strict";
                var hexChars = "0123456789ABCDEF";
                var a = dec % 16;
                var b = (dec - a) / 16;

                return hexChars.charAt(b) + hexChars.charAt(a) + "";
            }

            in_el.time = !in_el.time ? 10 : (in_el.time - 1);

            function calc_color(start, end) { return (end - (in_el.time / 10) * (end - start)); }

            var t_f_r = calc_color(f_r, fr),
                t_f_g = calc_color(f_g, fg),
                t_f_b = calc_color(f_b, fb);
            var t_k_r = calc_color(k_r, kr),
                t_k_g = calc_color(k_g, kg),
                t_k_b = calc_color(k_b, kb);
            var t_b_r = calc_color(b_r, br),
                t_b_g = calc_color(b_g, bg),
                t_b_b = calc_color(b_b, bb);

            function setStyles(style) {
                "use strict";
                style.color = "#" + dec2hex(t_f_r) + dec2hex(t_f_g) + dec2hex(t_f_b);
                style.borderColor = "#" + dec2hex(t_b_r) + dec2hex(t_b_g) + dec2hex(t_b_b);
                style.backgroundColor = "#" + dec2hex(t_k_r) + dec2hex(t_k_g) + dec2hex(t_k_b);
            }

            var first = (in_el == vkb.mod[4]) ? false : true,
                is = in_el.style,
                cs = in_el.company ? in_el.company.style : null;

            if (cs && first)
                setStyles(cs);

            setStyles(is);

            if (cs) {
                if (!first) {
                    setStyles(cs);
                    is.borderBottomColor = "#" + dec2hex(t_k_r) + dec2hex(t_k_g) + dec2hex(t_k_b);
                } else
                    cs.borderBottomColor = "#" + dec2hex(t_k_r) + dec2hex(t_k_g) + dec2hex(t_k_b);
            }

            if (!in_el.time) {
                clearInterval(in_el.timer);
                return;
            }
        };

        _shift_colors();

        in_el.timer = window.setInterval(_shift_colors, 50);
    },

    _setup_style: function(obj, top, left, width, height, position, text_align, line_height, font_size, font_weight, padding_left, padding_right) {
        "use strict";
        var os = obj.style;

        if (top) os.top = top;
        if (left) os.left = left;
        if (width) os.width = width;
        if (height) os.height = height;

        if (position) os.position = position;

        if (text_align) os.textAlign = text_align;
        if (line_height) os.lineHeight = line_height;
        if (font_size) os.fontSize = font_size;

        os.fontWeight = font_weight || "bold";

        if (padding_left) os.paddingLeft = padding_left;
        if (padding_right) os.paddingRight = padding_right;
    },

    _setup_key: function(parent, id, top, left, width, height, text_align, line_height, font_size, font_weight, padding_left, padding_right) {
        "use strict";
        var _id = this.Cntr.id + id;
        var exists = document.getElementById(_id);

        var key = exists ? exists.parentNode : document.createElement("DIV");
        this._setup_style(key, top, left, width, height, "absolute");

        var key_sub = exists || document.createElement("DIV");
        key.appendChild(key_sub);
        parent.appendChild(key);

        this._setup_style(key_sub, "", "", "", line_height, "relative", text_align, line_height, font_size, font_weight, padding_left, padding_right);
        key_sub.id = _id;

        return key_sub;
    },

    _findX: function(obj) {
        "use strict";
        return (obj && obj.parentNode) ? parseFloat(obj.parentNode.offsetLeft) : 0;
    },

    _findY: function(obj) {
        "use strict";
        return (obj && obj.parentNode) ? parseFloat(obj.parentNode.offsetTop) : 0;
    },

    _findW: function(obj) {
        "use strict";
        return (obj && obj.parentNode) ? parseFloat(obj.parentNode.offsetWidth) : 0;
    },

    _findH: function(obj) {
        "use strict";
        return (obj && obj.parentNode) ? parseFloat(obj.parentNode.offsetHeight) : 0;
    },

    _findShortId: function(key) {
        "use strict";
        var shortId = "";
        if (key.id) {
            shortId = key.id.substring(key.id.indexOf("___") + 3);
        }

        return shortId;

    },


    _setup_key_img: function(key, img_path, font_size) {
        "use strict";
        // var img_icon = document.createElement("IMG");
        // img_icon.setAttribute("src", img_path);
        // img_icon.setAttribute("height", font_size);
        // key.appendChild(img_icon);
        // key.setAttribute("text_align", "bottom");
        var img_url = "url(" + img_path + ") no-repeat center center ";
        key.style_img = img_url;
        key.style_size = font_size;
        key.style.background = img_url;
        return key;
    },
    _construct: function(container_id, callback_ref, create_arrows, create_updown, create_nav_keys, create_numpad,
        font_name, font_size, font_color, dead_color, bg_color, key_color, sel_item_color,
        border_color, inactive_border_color, inactive_key_color, lang_sel_brd_color,
        show_click, click_font_color, click_bg_color, click_border_color, do_embed,
        do_gap, start_layout_index, layout_callback_ref) {
        "use strict";
        var exists = (this.Cntr != undefined);
        var ct = exists ? this.Cntr : document.getElementById(container_id);
        var changed = (font_size && (font_size != this.fontsize));

        this._Callback = ((typeof(callback_ref) == "function") && ((callback_ref.length == 1) || (callback_ref.length == 2))) ? callback_ref : (this._Callback || null);

        var ff = font_name || this.fontname || "";
        var fs = font_size || this.fontsize || "14px";

        var fc = font_color || this.fontcolor || "#000";
        var dc = dead_color || this.deadcolor || "#F00";
        var bg = bg_color || this.bgcolor || "#FFF";
        var kc = key_color || this.keycolor || "#FFF";
        var bc = border_color || this.bordercolor || "#777";

        this.fontname = ff, this.fontsize = fs, this.fontcolor = fc;
        this.bgcolor = bg, this.keycolor = kc, this.deadcolor = dc, this.bordercolor = bc;

        this.lic = sel_item_color || this.lic || "#DDD";
        this.ibc = inactive_border_color || this.ibc || "#CCC";
        this.ikc = inactive_key_color || this.ikc || "#FFF";
        this.lsc = lang_sel_brd_color || this.lsc || "#F77";

        this.cfc = click_font_color || this.cfc || "#CC3300";
        this.cbg = click_bg_color || this.cbg || "#FF9966";
        this.cbr = click_border_color || this.cbr || "#CC3300";

        this.sc = (show_click == undefined) ? ((this.sc == undefined) ? false : this.sc) : show_click;
        this.gap = (do_gap != undefined) ? (do_gap ? 1 : -1) : (this.gap || 1);

        if (!exists) {
            this.Cntr = ct;
            // this.Caps = this.Shift = this.AltGr = false;
            this.Shift = this.Alt = this.AltGr = this.Ctrl = false;
            this.CapsLk = this.NumLk = this.ScrollLk = false;
            this.LastCombined = "";

            this.keys = [], this.mod = [], this.pad = [], this.fn = [], this.sys = [], this.lang = [], this.logo = [];

            VKeyboard.kbArray[container_id] = this;
        }

        var kb = exists ? ct.childNodes[0] : document.createElement("DIV");

        if (!exists) {
            ct.appendChild(kb);
            ct.style.display = "block";
            ct.style.zIndex = 999;

            if (do_embed)
                ct.style.position = "relative";
            else {
                ct.style.position = "absolute";

                var initX = 0;
                var initY = 0;
                var ct_ = ct;
                if (ct_.offsetParent) {
                    while (ct_.offsetParent) {
                        initX += ct_.offsetLeft;
                        initY += ct_.offsetTop;

                        ct_ = ct_.offsetParent;
                    }
                } else if (ct_.x) {
                    initX += ct_.x;
                    initY += ct_.y;
                }

                ct.style.top = initY + "px", ct.style.left = initX + "px";
            }

            kb.style.position = "relative";
            kb.style.top = "0px", kb.style.left = "0px";
        }

        kb.style.border = "1px solid " + bc;

        var kb_main = exists ? kb.childNodes[0] : document.createElement("DIV");
        var ks = kb_main.style;
        if (!exists) {
            kb.appendChild(kb_main);

            ks.position = "relative";
            ks.width = "1px";
            ks.cursor = "default";
        }

        // Disable content selection:
        this._setup_event(kb_main, "selectstart", function(event) { return false; });
        this._setup_event(kb_main, "mousedown", function(event) { if (event.preventDefault) event.preventDefault(); return false; });

        ks.fontFamily = ff, ks.backgroundColor = bg;

        if (!exists || changed) {
            // Convenience strings:
            var initPara = {
                c: "center",
                n: "normal",
                r: "right",
                l: "left",
                e: "&nbsp;",
                fs: this.fontsize,
                bc: this.bordercolor,
                gap: this.gap
            };

            initPara.mag = parseFloat(initPara.fs) / 14.0;
            initPara.cell = Math.floor(35.0 * initPara.mag);
            initPara.dcell = 2 * initPara.cell;
            initPara.dp = (initPara.dcell + 1) + "px";
            initPara.dp2 = (initPara.dcell - 1 - ((initPara.gap < 0) ? 2 : 0)) + "px";
            initPara.cp = String(initPara.cell) + "px";
            initPara.cx = String(initPara.cell - (do_gap ? 0 : 2.0)) + "px";
            initPara.lh = String(Math.floor(initPara.cell - 2.0)) + "px";
            initPara.pad = String(4 * initPara.mag) + "px";


            var prevX = 0,
                prevY = initPara.gap,
                prevW = 0,
                prevH = 0;

            // Function row:
            var key;

            // // prevY = this._findY(key);
            // // prevH = this._findH(key); // universal key height

            // // var kb_kfn = this._setup_key(kb_main, "___kfn", prevY + "px", (prevX + prevW + gap) + "px", (2.96 * cell) + "px", cp, r, lh, fs, n, "", pad);
            // // kb_kbp.innerHTML = "F12";
            // // this.mod[0] = kb_kfn;

            var key_fn_f12 = this._create_fn_row(kb_main, prevX, prevY, prevW, prevH, initPara);
            key = key_fn_f12;
            prevH = this._findH(key) + initPara.gap;
            prevY = this._findY(key) + prevH;
            prevX = 0;
            prevW = 0;

            // Number row:
            var kb_kbp = this._create_num_row(kb_main, key, prevX, prevY, prevW, prevH, initPara);

            prevH = this._findH(kb_kbp);
            prevY = this._findY(kb_kbp);

            // Top row:

            var kb_tab = this._create_top_row(kb_main, kb_kbp, prevX, prevY, prevW, prevH, initPara);

            prevH = this._findH(kb_tab);
            prevY = this._findY(kb_tab);

            // Home row:

            key = this._create_home_row(kb_main, kb_tab, prevX, prevY, prevW, prevH, initPara);

            prevY = this._findY(key);

            // Bottom row:

            var kb_shift_r = this._create_bottom_row(kb_main, kb_kbp, prevX, prevY, prevW, prevH, initPara);

            prevY = this._findY(kb_shift_r);

            // Language selector:
            var kb_ctrl_r = this._create_space_row(kb_main, kb_kbp, prevX, prevY, prevW, prevH, initPara);

            var w = this.kbpH + initPara.gap;
            prevY = this._findY(kb_ctrl_r);

            // Arrow keys:
            w = this._create_arrow_keys(kb_main, kb_shift_r, exists, create_arrows, create_updown, w, prevX, prevY, prevW, prevH, initPara);


            // System keys:
            prevH = 0;
            prevY = 0;
            prevX = this._findX(kb_kbp);
            prevW = this._findW(kb_kbp);

            this._create_system_keys(kb_main, prevX, prevY, prevW, prevH, initPara);

            this._create_logo(container_id, kb_main, initPara);
            this._create_lang(container_id, kb_main, initPara);

            // Numpad:
            if ((create_numpad == undefined) ? true : create_numpad) {
                var w2 = this._create_numpad(container_id, kb_main, initPara);
                if (w2 > w) w = w2;
            }

            kb.style.width = ks.width = w + "px";
        }

        this._refresh_layout(this.avail_langs[start_layout_index || 0][0]);
        this._Layout_Callback = ((typeof(layout_callback_ref) == "function") && ((layout_callback_ref.length == 1) || (layout_callback_ref.length == 2))) ? layout_callback_ref : (this._Layout_Callback || null);

        return this;
    },

    _create_fn_row: function(kb_main, prevX, prevY, prevW, prevH, initPara) {
        "use strict";

        // init parameters
        var c = initPara.c,
            n = initPara.n,
            r = initPara.r,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            cx = initPara.cx,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;
        var key;

        for (var i = 0; i < 13; i++) {
            var fn_fs = (parseFloat(fs) - 4) + "px";
            var fn_gap = 0;
            switch (this.FnLayout[i]) {
                case "F1":
                    fn_gap = prevW + gap;
                    break;
                case "F5":
                case "F9":
                    fn_gap = prevW / 2 + gap + prevW / 5;
                    break;
                default:
                    fn_gap = 0;
                    break;
            }
            this.fn[i] = key = this._setup_key(kb_main, "___" + this.FnLayout[i].toLowerCase(), prevY + "px", (prevX + prevW + gap + fn_gap) + "px", cp, cp, c, lh, fn_fs, fn_fs);
            key.innerHTML = this.FnLayout[i];
            prevX = this._findX(key), prevW = this._findW(key);
        }

        var key_fn_f12 = key;
        return key_fn_f12;
    },

    _create_num_row: function(kb_main, key, prevX, prevY, prevW, prevH, initPara) {
        "use strict";

        // init parameters
        var c = initPara.c,
            n = initPara.n,
            r = initPara.r,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            cx = initPara.cx,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;

        for (var i = 0; i < 13; i++) {
            // this.keys[i] = key = this._setup_key(kb_main, "___key" + String(i), prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);
            this.keys[i] = key = this._setup_key(kb_main, "___" + this.KeyLayout[i], prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);

            prevX = this._findX(key), prevW = this._findW(key);
        }

        prevY = this._findY(key);
        prevH = this._findH(key); // universal key height

        var kb_kbp = this._setup_key(kb_main, "___backspace", prevY + "px", (prevX + prevW + gap) + "px", (2.5 * cell) + "px", cp, r, lh, fs, n, "", pad);
        // var kb_kbp = this._setup_key(kb_main, "___kbp", prevY + "px", (prevX + prevW + gap) + "px", (2.96 * cell) + "px", cp, r, lh, fs, n, "", pad);
        kb_kbp.innerHTML = "&xlarr;"; //BackSpace
        this.mod[0] = kb_kbp;

        return kb_kbp;
    },

    _create_top_row: function(kb_main, kb_kbp, prevX, prevY, prevW, prevH, initPara) {
        "use strict";

        // init parameters
        var c = initPara.c,
            n = initPara.n,
            r = initPara.r,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            cx = initPara.cx,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;
        var key;

        var kb_tab = this._setup_key(kb_main, "___tab", (prevY + prevH + gap) + "px", gap + "px", (1.48 * cell + gap) + "px", cp, l, lh, fs, n, pad);
        kb_tab.innerHTML = "&#x21B9;"; //Tab
        this.mod[1] = kb_tab;

        prevX = this._findX(kb_tab), prevW = this._findW(kb_tab), prevY = this._findY(kb_tab);

        for (var i = 13; i < 26; i++) {
            // this.keys[i] = key = this._setup_key(kb_main, "___key" + String(i), prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);
            this.keys[i] = key = this._setup_key(kb_main, "___" + this.KeyLayout[i], prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);

            prevX = this._findX(key), prevW = this._findW(key);
        }

        this.kbpH = this._findX(kb_kbp) + this._findW(kb_kbp);

        return kb_tab;
    },

    _create_home_row: function(kb_main, kb_tab, prevX, prevY, prevW, prevH, initPara) {
        "use strict";

        // init parameters
        var c = initPara.c,
            n = initPara.n,
            r = initPara.r,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            cx = initPara.cx,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;
        var key;

        var kb_caps = this._setup_key(kb_main, "___caps", (prevY + prevH + gap) + "px", gap + "px", dcell + "px", cp, l, lh, fs, n, pad);
        kb_caps.innerHTML = "&#x21E9;Caps"; // Caps
        this.mod[2] = kb_caps;

        prevX = this._findX(kb_caps), prevW = this._findW(kb_caps), prevY = this._findY(kb_caps);

        for (var i = 26; i < 38; i++) {
            // this.keys[i] = key = this._setup_key(kb_main, "___key" + String(i), prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);
            this.keys[i] = key = this._setup_key(kb_main, "___" + this.KeyLayout[i], prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);

            prevX = this._findX(key), prevW = this._findW(key);
        }

        prevY = this._findY(key);
        var s = prevX + prevW + gap;

        var kb_enter = this._setup_key(kb_main, "___enter", prevY + "px", s + "px", (this.kbpH - s) + "px", cp, r, lh, fs, n, "", pad);
        kb_enter.innerHTML = "&crarr;"; //"&#x21A9;"; //Enter
        this.mod[3] = kb_enter;

        s = this._findX(this.keys[25]) + this._findW(this.keys[25]) + gap;

        var kb_enter_top = this._setup_key(kb_main, "___Enter", this._findY(kb_tab) + "px", s + "px", (this.kbpH - s) + "px", cx, c, cx);
        kb_enter_top.innerHTML = e;
        kb_enter_top.subst = "Enter";
        this.mod[4] = kb_enter_top;

        kb_enter_top.company = kb_enter;
        kb_enter.company = kb_enter_top;
        return key;
    },

    _create_bottom_row: function(kb_main, kb_kbp, prevX, prevY, prevW, prevH, initPara) {
        "use strict";

        // init parameters
        var c = initPara.c,
            n = initPara.n,
            r = initPara.r,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            cx = initPara.cx,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;
        var key;

        //    var kb_shift = this._setup_key(kb_main, "___shift", (prevY + prevH + gap) + "px", gap + "px", (2.52 * cell) + "px", cp, l, lh, fs, n, pad);
        var kb_shift = this._setup_key(kb_main, "___shift", (prevY + prevH + gap) + "px", gap + "px", (1.52 * cell) + "px", cp, l, lh, fs, n, pad);
        //    kb_shift.innerHTML = "&#x21E7;Shift"; //Shift
        kb_shift.innerHTML = "&#x21E7;"; //Shift
        this.mod[5] = kb_shift;

        prevX = this._findX(kb_shift), prevW = this._findW(kb_shift), prevY = this._findY(kb_shift);

        for (var i = 38; i < 49; i++) {
            // this.keys[i] = key = this._setup_key(kb_main, "___key" + String(i), prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);
            if (this.KeyLayout[i])
                this.keys[i] = key = this._setup_key(kb_main, "___" + this.KeyLayout[i], prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);
            else {
                this.keys[i] = key = this._setup_key(kb_main, "___" + "nodefined", prevY + "px", (prevX + prevW + gap) + "px", cp, cp, c, lh, fs);
                console.log("_create_bottom_row has 'nodefined' keys");
            }

            prevX = this._findX(key), prevW = this._findW(key);
        }

        prevY = this._findY(key);

        var kb_shift_r = this._setup_key(kb_main, "___shift_r", prevY + "px", (prevX + prevW + gap) + "px", (this._findX(kb_kbp) + this._findW(kb_kbp) - prevX - prevW - gap) + "px", cp, r, lh, fs, n, "", pad);
        kb_shift_r.innerHTML = "&#x21E7;Shift"; //shift
        this.mod[6] = kb_shift_r;
        return key;
    },

    _create_space_row: function(kb_main, kb_kbp, prevX, prevY, prevW, prevH, initPara) {
        "use strict";

        // init parameters
        var c = initPara.c,
            n = initPara.n,
            r = initPara.r,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            cx = initPara.cx,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;

        var vcell = String(1.32 * initPara.cell) + "px";

        // var kb_lang = this._setup_key(kb_main, "___lang", (prevY + prevH + gap) + "px", gap + "px", vcell, cp, l, lh, fs, n, pad);

        // var ks = kb_main.style;

        // this.mod[7] = kb_lang;

        // prevY = this._findY(kb_lang);
        var kb_ctrl_l = this._setup_key(kb_main, "___ctrl_l", (prevY + prevH + gap) + "px", gap + "px", vcell, cp, l, lh, fs, n, pad);
        kb_ctrl_l.innerHTML = "Ctrl";
        this.mod[7] = kb_ctrl_l;

        var ks = kb_main.style;


        prevY = this._findY(kb_ctrl_l);

        ks.height = (prevY + prevH + gap) + "px";

        prevY += "px";

        var kb_win_l = this._setup_key(kb_main, "___win_l", prevY, (this._findX(kb_ctrl_l) + this._findW(kb_ctrl_l) + gap) + "px", vcell, cp, l, lh, fs, n, pad);
        kb_win_l.innerHTML = e;
        this._setup_key_img(kb_win_l, "../novnc/images/win-icon.png", fs);
        this.mod[8] = kb_win_l;

        var kb_alt_l = this._setup_key(kb_main, "___alt_l", prevY, (this._findX(kb_win_l) + this._findW(kb_win_l) + gap) + "px", vcell, cp, l, lh, fs, n, pad);
        kb_alt_l.innerHTML = "Alt";
        this.mod[9] = kb_alt_l;

        // var kb_space = this._setup_key(kb_main, "___space", prevY, (this._findX(kb_alt_l) + this._findW(kb_alt_l) + gap) + "px", (6.28 * cell) + "px", cp, c, lh, fs);
        var kb_space = this._setup_key(kb_main, "___space", prevY, (this._findX(kb_alt_l) + this._findW(kb_alt_l) + gap) + "px", (6.5 * cell) + "px", cp, c, lh, fs);
        kb_space.innerHTML = "&nbsp";
        this.mod[10] = kb_space;

        var kb_alt_gr = this._setup_key(kb_main, "___alt_gr", prevY, (this._findX(kb_space) + this._findW(kb_space) + gap) + "px", vcell, cp, c, lh, parseFloat(fs) * 0.786, n);
        kb_alt_gr.innerHTML = "AltGr";
        this.mod[11] = kb_alt_gr;

        var kb_win_r = this._setup_key(kb_main, "___win_r", prevY, (this._findX(kb_alt_gr) + this._findW(kb_alt_gr) + gap) + "px", vcell, cp, l, lh, fs, n, pad);
        kb_win_r.innerHTML = e;
        this._setup_key_img(kb_win_r, "../novnc/images/win-icon.png", fs);
        this.mod[12] = kb_win_r;

        var kb_menu = this._setup_key(kb_main, "___menu", prevY, (this._findX(kb_win_r) + this._findW(kb_win_r) + gap) + "px", vcell, cp, l, lh, fs, n, pad);
        kb_menu.innerHTML = e;
        this._setup_key_img(kb_menu, "../novnc/images/menu-icon.png", fs);
        this.mod[13] = kb_menu;

        var kb_ctrl_r = this._setup_key(kb_main, "___ctrl_r", prevY, (this._findX(kb_menu) + this._findW(kb_menu) + gap) + "px", vcell, cp, l, lh, fs, n, pad);
        kb_ctrl_r.innerHTML = "Ctrl";
        this.mod[14] = kb_ctrl_r;

        return kb_ctrl_r;
    },


    _create_arrow_keys: function(kb_main, kb_shift_r, exists, create_arrows, create_updown, w, prevX, prevY, prevW, prevH, initPara) {
        "use strict";
        // init parameters
        var c = initPara.c,
            n = initPara.n,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;
        var key;

        if (!exists && ((create_arrows == undefined) ? true : create_arrows)) {
            var kb_left = this._setup_key(kb_main, "___left", prevY + "px", (this.kbpH + gap + cell / 2) + "px", cp, cp, c, lh, fs);
            kb_left.innerHTML = "&leftarrow;";
            this.mod[15] = kb_left;

            if ((create_updown == undefined) ? true : create_updown) {
                var kb_down = this._setup_key(kb_main, "___down", prevY + "px", (this._findX(kb_left) + this._findW(kb_left) + gap) + "px", cp, cp, c, lh, fs);
                kb_down.innerHTML = "&downarrow;";
                this.mod[16] = key = kb_down;

                var kb_up = this._setup_key(kb_main, "___up", this._findY(kb_shift_r) + "px", (this._findX(kb_left) + this._findW(kb_left) + gap) + "px", cp, cp, c, lh, fs);
                kb_up.innerHTML = "&uparrow;";
                this.mod[17] = kb_up;
            } else key = kb_left;

            var kb_right = this._setup_key(kb_main, "___right", prevY + "px", (this._findX(key) + this._findW(key) + gap) + "px", cp, cp, c, lh, fs);
            kb_right.innerHTML = "&rightarrow;";
            this.mod[this.mod.length] = kb_right;

            this.kbpH = this._findX(kb_right) + this._findW(kb_right);
            w = this.kbpH + gap;
        }
        return w;
    },

    _create_system_keys: function(kb_main, prevX, prevY, prevW, prevH, initPara) {
        "use strict";
        // init parameters
        var c = initPara.c,
            n = initPara.n,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;

        var fn_fs = (parseFloat(fs) - 4) + "px";
        var startX, startY;
        var currX, currY;

        startX = prevX + prevW + cell / 2;
        currX = startX;
        startY = 0;
        currY = startY;
        for (var i = 0; i < 9; i++) {
            var key = this._setup_key(kb_main, this.SysLayout[i][1], currY + gap + "px", currX + gap + "px", cp, cp, c, lh, fn_fs);
            key.innerHTML = this.SysLayout[i][0];
            this.sys[i] = key;
            if ((i % 3) == 2) {
                currX = startX;
                currY = this._findY(key) + this._findW(key);
            } else {
                currX = this._findX(key) + this._findW(key);
                currY = currY;
            }

        }

        return;
    },

    _create_numpad: function(container_id, parent, initPara) {
        "use strict";
        //    var c = "center", n = "normal", l = "left";
        //    var fs = this.fontsize, bc = this.bordercolor, gap = this.gap;
        //
        //    var mag = parseFloat(fs) / 14.0, cell = Math.floor(30.0 * mag);
        //    var dcell = 2 * cell, dp = (dcell + 1) + "px", dp2 = (dcell - 1 - ((gap < 0) ? 2 : 0)) + "px";
        //    var cp = String(cell) + "px", lh = String(Math.floor(cell - 2.0)) + "px";

        // init parameters
        var c = initPara.c,
            n = initPara.n,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;

        var fn_fs = (parseFloat(fs) - 4) + "px";
        // if function keys exists
        var edge_top = (cell + gap + gap) + "px";
        var edge = (this.kbpH + cell / 2 + gap) + "px";

        var kb_pad_eur = this._setup_key(parent, "___" + this.PadLayout[0], edge_top, edge, cp, cp, c, lh, fn_fs);
        kb_pad_eur.innerHTML = this.Pad_normal[0]; //"&#x20AC;";
        this.pad[0] = kb_pad_eur;

        var edge_1 = (this._findX(kb_pad_eur) + this._findW(kb_pad_eur) + gap) + "px";

        // var kb_pad_slash = this._setup_key(parent, "___pad_/", edge_top, edge_1, cp, cp, c, lh, fs);
        var kb_pad_slash = this._setup_key(parent, "___" + this.PadLayout[1], edge_top, edge_1, cp, cp, c, lh, fn_fs);
        kb_pad_slash.innerHTML = this.Pad_normal[1];
        this.pad[1] = kb_pad_slash;

        var edge_2 = (this._findX(kb_pad_slash) + this._findW(kb_pad_slash) + gap) + "px";

        // var kb_pad_star = this._setup_key(parent, "___pad_*", edge_top, edge_2, cp, cp, c, lh, fs);
        var kb_pad_star = this._setup_key(parent, "___" + this.PadLayout[2], edge_top, edge_2, cp, cp, c, lh, fn_fs);
        kb_pad_star.innerHTML = this.Pad_normal[2];
        this.pad[2] = kb_pad_star;

        var edge_3 = (this._findX(kb_pad_star) + this._findW(kb_pad_star) + gap) + "px";

        // var kb_pad_minus = this._setup_key(parent, "___pad_-", edge_top, edge_3, cp, cp, c, lh, fs);
        var kb_pad_minus = this._setup_key(parent, "___" + this.PadLayout[3], edge_top, edge_3, cp, cp, c, lh, fn_fs);
        kb_pad_minus.innerHTML = this.Pad_normal[3];
        this.pad[3] = kb_pad_minus;

        this.kbpM = this._findX(kb_pad_minus) + this._findW(kb_pad_minus) + gap;

        var prevH = this._findH(kb_pad_eur),
            edge_Y = (this._findY(kb_pad_eur) + prevH + gap) + "px";

        var kb_pad_7 = this._setup_key(parent, "___" + this.PadLayout[4], edge_Y, edge, cp, cp, c, lh, fn_fs);
        kb_pad_7.innerHTML = this.Pad_normal[4];
        this.pad[4] = kb_pad_7;

        var kb_pad_8 = this._setup_key(parent, "___" + this.PadLayout[5], edge_Y, edge_1, cp, cp, c, lh, fn_fs);
        kb_pad_8.innerHTML = this.Pad_normal[5];
        this.pad[5] = kb_pad_8;

        var kb_pad_9 = this._setup_key(parent, "___" + this.PadLayout[6], edge_Y, edge_2, cp, cp, c, lh, fn_fs);
        kb_pad_9.innerHTML = this.Pad_normal[6];
        this.pad[6] = kb_pad_9;

        // var kb_pad_plus = this._setup_key(parent, "___pad_+", edge_Y, edge_3, cp, dp, c, dp2, fs);
        var kb_pad_plus = this._setup_key(parent, "___" + this.PadLayout[7], edge_Y, edge_3, cp, dp, c, dp2, fn_fs);
        kb_pad_plus.innerHTML = this.Pad_normal[7];
        this.pad[7] = kb_pad_plus;

        edge_Y = (this._findY(kb_pad_7) + prevH + gap) + "px";

        var kb_pad_4 = this._setup_key(parent, "___" + this.PadLayout[8], edge_Y, edge, cp, cp, c, lh, fn_fs);
        kb_pad_4.innerHTML = this.Pad_normal[8];
        this.pad[8] = kb_pad_4;

        var kb_pad_5 = this._setup_key(parent, "___" + this.PadLayout[9], edge_Y, edge_1, cp, cp, c, lh, fn_fs);
        kb_pad_5.innerHTML = this.Pad_normal[9];
        this.pad[9] = kb_pad_5;

        var kb_pad_6 = this._setup_key(parent, "___" + this.PadLayout[10], edge_Y, edge_2, cp, cp, c, lh, fn_fs);
        kb_pad_6.innerHTML = this.Pad_normal[10];
        this.pad[10] = kb_pad_6;

        edge_Y = (this._findY(kb_pad_4) + prevH + gap) + "px";

        var kb_pad_1 = this._setup_key(parent, "___" + this.PadLayout[11], edge_Y, edge, cp, cp, c, lh, fn_fs);
        kb_pad_1.innerHTML = this.Pad_normal[11];
        this.pad[11] = kb_pad_1;

        var kb_pad_2 = this._setup_key(parent, "___" + this.PadLayout[12], edge_Y, edge_1, cp, cp, c, lh, fn_fs);
        kb_pad_2.innerHTML = this.Pad_normal[12];
        this.pad[12] = kb_pad_2;

        var kb_pad_3 = this._setup_key(parent, "___" + this.PadLayout[13], edge_Y, edge_2, cp, cp, c, lh, fn_fs);
        kb_pad_3.innerHTML = this.Pad_normal[13];
        this.pad[13] = kb_pad_3;

        var kb_pad_enter = this._setup_key(parent, "___" + this.PadLayout[14], edge_Y, edge_3, cp, dp, c, dp2, parseFloat(fs) * 0.643, n);
        kb_pad_enter.innerHTML = this.Pad_normal[14]; //Enter
        this.pad[14] = kb_pad_enter;

        edge_Y = (this._findY(kb_pad_1) + prevH + gap) + "px";

        var kb_pad_0 = this._setup_key(parent, "___" + this.PadLayout[15], edge_Y, edge, dp, cp, l, lh, fn_fs, "", 7 * mag + "px");
        kb_pad_0.innerHTML = this.Pad_normal[15];
        this.pad[15] = kb_pad_0;

        // var kb_pad_period = this._setup_key(parent, "___pad_.", edge_Y, edge_2, cp, cp, c, lh, fs);
        var kb_pad_period = this._setup_key(parent, "___" + this.PadLayout[16], edge_Y, edge_2, cp, cp, c, lh, fn_fs);
        kb_pad_period.innerHTML = this.Pad_normal[16];
        this.pad[16] = kb_pad_period;

        return this.kbpM;
    },

    _create_logo: function(container_id, parent, initPara) {
        "use strict";
        // init parameters
        var c = initPara.c,
            n = initPara.n,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;

        // if function keys exists
        //var edge_top = (gap) + "px";
        //var edge = (this.kbpH + cell) + "px";
        //var width = (cell*3 + gap*2) + "px";
        var edge_top = (gap * 4) + "px";
        var edge = (this.kbpH + cell / 2 + gap * 4) + "px";
        var width = (cell * 3 - cell / 2) + "px";

        var kb_logo = this._setup_key(parent, "___logo", edge_top, edge, width, cp, c, lh, fs);
        kb_logo.innerHTML = "";
        //kb_logo.style.background = "url(" + "../novnc/images/supervyse.png" + ") no-repeat center center ";
        kb_logo.style.backgroundSize = width;
        //kb_logo.innerHTML = "<img src="+ "'../novnc/images/supervyse.png'"+" alt='Supervyse' width=" + width + " href='http://www.insyde.com'>";
        // disalbe lang
        // kb_lang.style.display = "none";
        this.logo[0] = kb_logo;

        return kb_logo;
    },

    _create_lang: function(container_id, parent, initPara) {
        "use strict";
        //    var c = "center", n = "normal", l = "left";
        //    var fs = this.fontsize, bc = this.bordercolor, gap = this.gap;
        //
        //    var mag = parseFloat(fs) / 14.0, cell = Math.floor(30.0 * mag);
        //    var dcell = 2 * cell, dp = (dcell + 1) + "px", dp2 = (dcell - 1 - ((gap < 0) ? 2 : 0)) + "px";
        //    var cp = String(cell) + "px", lh = String(Math.floor(cell - 2.0)) + "px";
        // init parameters
        var c = initPara.c,
            n = initPara.n,
            l = initPara.l;
        var fs = initPara.fs,
            bc = initPara.bc,
            gap = initPara.gap;
        var mag = initPara.mag,
            cell = initPara.cell;
        var dcell = initPara.dcell,
            dp = initPara.dp,
            dp2 = initPara.dp2;
        var cp = initPara.cp,
            lh = initPara.lh;
        var pad = initPara.pad;
        var e = initPara.e;

        // if function keys exists
        var edge_top = (gap) + "px";
        var edge = (this.kbpH + cell / 2 + gap + cell * 3 + gap * 3) + "px";

        var kb_lang = this._setup_key(parent, "___lang", edge_top, edge, cp, cp, c, lh, fs);
        kb_lang.innerHTML = "Lang;";
        // disalbe lang
        // kb_lang.style.display = "none";
        this.lang[0] = kb_lang;

        return kb_lang;
    },

    _set_key_state: function(key, on, textcolor, bordercolor, bgcolor) {
        "use strict";
        if (key) {
            var ks = key.style;
            if (ks) {
                if (textcolor) ks.color = textcolor;
                if (bordercolor) ks.border = "1px solid " + bordercolor;
                if (bgcolor) ks.backgroundColor = bgcolor;
                if (key.style_img)
                    ks.background = key.style_img;
                if (key.style_size)
                    ks.backgroundSize = key.style_size;
            }

            this._detach_event(key, 'mouseup', this._generic_callback_proc);

            if (on)
                this._setup_event(key, 'mouseup', this._generic_callback_proc);
        }
    },

    _refresh_layout: function(layout) {
        "use strict";
        if (!layout) layout = this.lang[0].innerHTML;

        var fc = this.fontcolor,
            kc = this.keycolor,
            ikc = this.ikc;
        var ibc = this.ibc,
            bc = this.bordercolor,
            lic = this.lic;

        var arr_type = this.AltGr ? (this.Shift ? "alt_gr_shift" : "alt_gr") : (this.Shift ? "shift" : (this.CapsLk ? "caps" : "normal"));
        // var arr_type = this.Shift ? "shift" : (this.CapsLk ? "caps" : "normal");

        var nkeys = this.keys.length;

        var norm_arr = this[layout + "_normal"];
        var caps_arr = this[layout + "_caps"];
        var shift_arr = this[layout + "_shift"];
        var alt_arr = this[layout + "_alt_gr"];
        var shift_caps_arr = this[layout + "_shift_caps"];

        var alt_shift_arr = this[layout + "_alt_gr_shift"];

        var bcaps = (caps_arr && (caps_arr.length == nkeys));
        var bshift = (shift_arr && (shift_arr.length == nkeys));
        var balt = (alt_arr && (alt_arr.length == nkeys));
        var baltsh = (balt && alt_shift_arr && (alt_shift_arr.length == nkeys));
        var bshiftcaps = (shift_caps_arr && (shift_caps_arr.length == nkeys));

        var caps = this.mod[2],
            shift = this.mod[5],
            shift_r = this.mod[6],
            ctrl_l = this.mod[7],
            alt_l = this.mod[9],
            alt_gr = this.mod[11],
            ctrl_r = this.mod[14];

        if (bshift) {
            this._set_key_state(shift, true, fc, bc, this.Shift ? lic : kc);
            this._set_key_state(shift_r, true, fc, bc, this.Shift ? lic : kc);
        } else {
            this._set_key_state(shift, false, ibc, ibc, ikc);
            this._set_key_state(shift_r, false, ibc, ibc, ikc);

            if (arr_type == "shift") {
                arr_type = "normal";
                this.Shift = false;
            }
        }

        this._set_key_state(alt_l, true, fc, bc, this.Alt ? lic : kc);
        if (balt) {
            this._set_key_state(alt_gr, true, fc, bc, this.AltGr ? lic : kc);

            if (this.AltGr) {
                if (baltsh) {
                    this._set_key_state(shift, true, fc, bc);
                    this._set_key_state(shift_r, true, fc, bc);
                } else {
                    this._set_key_state(shift, false, ibc, ibc, ikc);
                    this._set_key_state(shift_r, false, ibc, ibc, ikc);

                    arr_type = "alt_gr";
                    this.Shift = false;
                }
            }
        } else {
            this._set_key_state(alt_gr, false, ibc, ibc, ikc);

            if (arr_type == "alt_gr") {
                arr_type = "normal";
                this.AltGr = false;
            } else if (arr_type == "alt_gr_shift") {
                arr_type = "normal";
                this.AltGr = false, this.Shift = false;

                shift.style.backgroundColor = kc, shift_r.style.backgroundColor = kc;
            }
        }


        {
            this._set_key_state(ctrl_l, true, fc, bc, this.Ctrl ? lic : kc);
            this._set_key_state(ctrl_r, true, fc, bc, this.Ctrl ? lic : kc);
        }
        if (this.Shift && !baltsh)
            this._set_key_state(alt_gr, false, ibc, ibc, ikc);

        //if(bcaps)
        if (bcaps && !this.AltGr) {
            this._set_key_state(caps, true, fc, bc, this.CapsLk ? lic : kc);
        } else {
            if (this.lang[0].innerHTML == "Jp") {
                this._set_key_state(caps, true, fc, bc, this.CapsLk ? lic : kc);
            } else if (this.lang[0].innerHTML == "ChT") {
                this._set_key_state(caps, true, fc, bc, this.CapsLk ? lic : kc);
            } else {
                this._set_key_state(caps, false, ibc, ibc, ikc);
                // it must be removed because CapsLk won't sync when switch lang
                // this.CapsLk = false;
                if (arr_type == "caps") arr_type = "normal";
            }

        }

        if (bshiftcaps) {
            if (this.lang[0].innerHTML == "ChT") {
                this._set_key_state(caps, true, fc, bc, this.CapsLk ? lic : kc);
                if (this.Shift && this.CapsLk) { arr_type = "shift_caps"; };
            }
        }

        var arr_cur = this[layout + "_" + arr_type];

        var i = nkeys;
        while (--i >= 0) {
            var key = this.keys[i],
                key_val = arr_cur[i];
            if (!key_val) key_val = "";

            if (this.Shift && this.CapsLk) {
                var key_nrm = norm_arr[i],
                    key_cps = caps_arr[i],
                    key_shf = shift_arr[i];

                if ((key_cps == key_shf) && (key_nrm != key_cps)) key_val = key_nrm;
            }

            if (typeof(key_val) == "object") {
                key.innerHTML = key_val[0];

                // this._set_key_state(key, true, this.deadcolor, bc, (this.DeadAction[0] == key_val[0] ? lic : kc));
                // this._set_key_state(key, true, fc, bc, (this.DeadAction[0] == key_val[0] ? lic : kc));
                this._set_key_state(key, true, fc, bc, kc);
            } else {

                var block = false;

                if (key_val != "") {

                    key.innerHTML = key_val;

                    if (block)
                        this._set_key_state(key, false, ibc, ibc, ikc);
                    else
                        this._set_key_state(key, true, fc, bc, kc);
                } else {
                    key.innerHTML = "&nbsp;";
                    this._set_key_state(key, false, ibc, ibc, ikc);
                }
            }
        }

        i = this.mod.length;
        while (--i >= 0) {
            var key = this.mod[i];

            switch (i) {
                case 2:
                case 5:
                case 6:
                case 11:
                case 7:
                case 9:
                case 14:
                    break;


                default:
                    this._set_key_state(key, true, fc, bc, kc);

                    var ks = key.style;
                    switch (i) {
                        case 4:
                            ks.borderBottomColor = kc;
                            break;

                            // case 8: case 9: case 12: case 13: ks.borderColor = ibc; break;
                    }
            }
        }

        i = this.pad.length;
        while (--i >= 0) {
            var key = this.pad[i];
            var key_nrm = this.Pad_normal[i],
                key_numlk = this.Pad_numlk[i];
            var key_val = (this.NumLk) ? key_numlk : key_nrm;
            key.innerHTML = key_val;


            if (i == 0) {
                this._set_key_state(key, true, fc, bc, this.NumLk ? lic : kc);
            } else {
                this._set_key_state(key, true, fc, bc, kc);

            }
        }

        i = this.fn.length;
        while (--i >= 0) {
            var key = this.fn[i];

            this._set_key_state(key, true, fc, bc, kc);
        }
        i = this.sys.length;
        while (--i >= 0) {
            var key = this.sys[i];
            if (i == 1) {
                this._set_key_state(key, true, fc, bc, this.ScrollLk ? lic : kc);
            } else {
                this._set_key_state(key, true, fc, bc, kc);
            }


        }
        i = this.lang.length;

        while (--i >= 0) {
            var key = this.lang[i];
            switch (i) {
                case 0:
                    key.innerHTML = layout;

                    this._detach_event(key, 'mousedown', this._handle_lang_menu);

                    {
                        var many = (this.avail_langs.length > 1);

                        this._set_key_state(key, false, fc, many ? this.lsc : ibc, many ? kc : ikc);
                        if (many)
                            this._setup_event(key, 'mousedown', this._handle_lang_menu);
                    }

            }

        }

        // after lang setup
        {
            var alt_gr_switch = this[this.lang[0].innerHTML + "_alt_gr_switch"];

            if (alt_gr_switch) {
                alt_gr.innerHTML = ((this.AltGr) ? alt_gr_switch[1] : alt_gr_switch[0]);
            } else {
                alt_gr.innerHTML = "AltGr";
            }

        }
    },

    _handle_lang_menu: function(event) {
        "use strict";
        var in_el = VKeyboard.prototype._get_event_source(event);
        var container_id = in_el.id.substring(0, in_el.id.indexOf("___"));
        var vkb = VKeyboard.kbArray[container_id];

        var ct = vkb.Cntr,
            menu = vkb.menu;

        if (menu) { ct.removeChild(menu);
            vkb.menu = null; } else {
            var fs = vkb.fontsize,
                kc = vkb.keycolor,
                bc = "1px solid " + vkb.bordercolor;
            var mag = parseFloat(fs) / 14.0,
                cell = Math.floor(35.0 * mag),
                cp = cell + "px",
                lh = (cell - 2) + "px",
                w = String(142 * mag) + "px";
            var h1 = Math.floor(cell + mag),
                h2 = String(140 * mag) + "px",
                pad = String(4 * mag) + "px";

            var langs = vkb.avail_langs.length;

            menu = document.createElement("DIV");
            var ms = menu.style;
            ms.display = "block";
            // ms.position = "relative"; // down of keyboard
            ms.position = "absolute"; // right of keyboard

            // ms.top = "1px", ms.left = "0px"; // down of keyboard
            ms.top = "1px", ms.left = (vkb.kbpM + 6) + "px"; // right of keyboard
            ms.width = w;
            ms.border = bc;
            ms.backgroundColor = vkb.bgcolor;

            vkb.menu = ct.appendChild(menu);

            var menu_main = document.createElement("DIV");
            ms = menu_main.style;
            ms.fontFamily = vkb.fontname;
            ms.position = "relative";

            ms.color = vkb.fontcolor;
            ms.width = w;
            ms.height = String(langs * h1 + 1) + "px";
            ms.cursor = "default";

            menu.appendChild(menu_main);

            function setcolor(obj, c) { return function() { obj.style.backgroundColor = c; }; };

            for (var j = 0; j < langs; j++) {
                var item = vkb._setup_key(menu_main, "___lang_" + String(j), String(h1 * j + 1) + "px", "1px", h2, cp, "left", lh, fs, "normal", pad);
                item.style.backgroundColor = kc;
                item.style.border = bc;
                item.innerHTML = vkb.avail_langs[j][1];

                vkb._setup_event(item, 'mousedown', vkb._handle_lang_item);
                vkb._setup_event(item, 'mouseover', setcolor(item, vkb.lic));
                vkb._setup_event(item, 'mouseout', setcolor(item, kc));
            }
        }
    },

    _handle_lang_item: function(event) {
        "use strict";
        var in_el = VKeyboard.prototype._get_event_source(event);
        var container_id = in_el.id.substring(0, in_el.id.indexOf("___"));
        var vkb = VKeyboard.kbArray[container_id];

        var ndx = in_el.id.indexOf("___lang_");
        var lng = in_el.id.substring(ndx + 8, in_el.id.length);
        var newl = vkb.avail_langs[lng][0];
        var newn = vkb.avail_langs[lng][2];

        if (vkb.lang[0].innerHTML != newl) {
            vkb._refresh_layout(newl);
            if (vkb._Layout_Callback) vkb._Layout_Callback(newn);

        }

        vkb.Cntr.removeChild(vkb.menu);
        vkb.menu = null;
    },

    // fix start_flash problem (start_flash will restore the style, must stop it)
    _clear_timer: function(in_el) {
        "use strict";
        var el = in_el.time ? in_el : (in_el.company && in_el.company.time ? in_el.company : null);

        if (el) {
            el.time = 0;
            clearInterval(el.timer);
        }
        return;
    },
    _generic_callback_proc: function(event) {
        "use strict";
        var in_el = VKeyboard.prototype._get_event_source(event);
        var container_id = in_el.id.substring(0, in_el.id.indexOf("___"));
        var vkb = VKeyboard.kbArray[container_id];
        var return_id = vkb._findShortId(in_el); // in_el.id.substring(in_el.id.indexOf("___")+3);
        var return_arr = new Array();

        var no_return = 0;
        var lk_return = 0;
        var val = in_el.subst || in_el.innerHTML;
        if (!val) return;

        switch (return_id) {
            case "caps":
                val = "CapsLk";
                break;
            case "pad_numlock":
                val = "NumLk";
                break;
            case "scrolllock":
                val = "ScrollLk";
                break;
            case "shift":
            case "shift_r":
                val = "Shift";
                break;
            case "alt_l":
                val = "Alt";
                break;
            case "alt_gr":
                val = "AltGr";
                break;
            case "ctrl_l":
            case "ctrl_r":
                val = "Ctrl";
                break;
        }

        switch (val) {
            case "CapsLk":
            case "NumLk":
            case "ScrollLk":
                vkb[val] = !vkb[val];
                lk_return = 1;
                break;
            case "AltGr":
                vkb[val] = !vkb[val];
                no_return = 1;
                break;
            case "Shift":
            case "Alt":
            case "Ctrl":
                // Check Last Key. If the same, use this modifer keys
                if (vkb.LastCombined == val) {
                    vkb.LastCombined = "";
                    no_return = 0;
                } else {
                    vkb.LastCombined = val;
                    no_return = 1;
                }
                vkb[val] = !vkb[val];
                //        no_return = 1;
                break;
            default:
                vkb.LastCombined = "";
                break;
        }

        if (no_return) {
            vkb._refresh_layout();
            if (vkb.sc) vkb._start_flash(in_el);
            return;
        } else {
            if (lk_return) {
                // do nothing
            } else {
                // Modifer key will be use one time only
                if (vkb['Shift']) {
                    return_arr.push('shift');
                    vkb['Shift'] = 0;
                    vkb._clear_timer(vkb.mod[5]);
                    vkb._clear_timer(vkb.mod[6]);
                }

                if (vkb['Alt']) {
                    return_arr.push('alt');
                    vkb['Alt'] = 0;
                    vkb._clear_timer(vkb.mod[9]);
                }

                if (vkb['AltGr']) {
                    if ((vkb.lang[0].innerHTML == "Jp") ||
                        (vkb.lang[0].innerHTML == "ChT")) {
                        // nothing

                    } else
                        return_arr.push('alt_gr');
                    //              vkb['AltGr'] = 0;
                }

                if (vkb['Ctrl']) {
                    return_arr.push('ctrl');
                    vkb['Ctrl'] = 0;
                    vkb._clear_timer(vkb.mod[7]);
                    vkb._clear_timer(vkb.mod[14]);
                }
            }

            vkb._refresh_layout();
            if (vkb.sc) vkb._start_flash(in_el);
            return_arr.push(return_id);

            // if(vkb._Callback) vkb._Callback(val, vkb.Cntr.id);
            if (vkb._Callback) vkb._Callback(return_arr, vkb.Cntr.id);
        }


    },

    SetParameters: function() {
        "use strict";
        var l = arguments.length;
        if (!l || (l % 2 != 0)) return false;

        var p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17;

        while (--l > 0) {
            var value = arguments[l];

            switch (arguments[--l]) {
                case "callback":
                    p0 = ((typeof(value) == "function") && ((value.length == 1) || (value.length == 2))) ? value : this._Callback;
                    break;

                case "font-name":
                    p1 = value;
                    break;
                case "font-size":
                    p2 = value;
                    break;
                case "font-color":
                    p3 = value;
                    break;
                case "dead-color":
                    p4 = value;
                    break;
                case "base-color":
                    p5 = value;
                    break;
                case "key-color":
                    p6 = value;
                    break;

                case "selection-color":
                    p7 = value;
                    break;
                case "border-color":
                    p8 = value;
                    break;

                case "inactive-border-color":
                    p9 = value;
                    break;
                case "inactive-key-color":
                    p10 = value;
                    break;
                case "lang-cell-color":
                    p11 = value;
                    break;

                case "show-click":
                    p12 = value;
                    break;

                case "click-font-color":
                    p13 = value;
                    break;
                case "click-key-color":
                    p14 = value;
                    break;
                case "click-border-color":
                    p15 = value;
                    break;

                case "layout":
                    p16 = value;
                    break;
                case "layout-callback":
                    p17 = ((typeof(value) == "function") && ((value.length == 1) || (value.length == 2))) ? value : this._Layout_Callback;
                    break;


                default:
                    break;
            }
        }

        this._construct(this.Cntr.id, p0, 0, 0, 0, (this.pad.length != 0), p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, this.gap, p16, p17);

        return true;
    },

    Show: function(value) {
        "use strict";
        var ct = this.Cntr.style;

        ct.display = ((value == undefined) || (value == true)) ? "block" : ((value == false) ? "none" : ct.display);
    },

    ShowNumpad: function(value) {
        "use strict";
        var sh = ((value == undefined) || (value == true)) ? "block" : ((value == false) ? "none" : null);
        if (!sh) return;

        var kb = this.Cntr.childNodes[0];

        var i = this.pad.length;
        if (i) {
            while (--i >= 0)
                this.pad[i].parentNode.style.display = sh;

            kb.style.width = kb.childNodes[0].style.width = (sh == "none") ? (this.kbpH + 1) + "px" : this.kbpM + "px";
        } else {
            if (sh == "block") {
                kb.style.width = kb.childNodes[0].style.width = this._create_numpad(this.Cntr.id, kb.childNodes[0]);
                this._refresh_layout();
            }
        }
    },

    getLang: function() {
        "use strict";
        return this.lang[0].innerHTML;
    },

    getLangNum: function() {
        "use strict";
        var i = 0;
        for (i = 0; i < this.avail_langs.length; i++) {

            if (this.lang[0].innerHTML == this.avail_langs[i][0])
                return this.avail_langs[i][2];
        }

        console.log("vkboard getLangNum failed");
        return -1;
    },

    setLangNum: function(langNum) {
        "use strict";
        for (var i = 0; i < this.avail_langs.length; i++) {
            if (langNum == this.avail_langs[i][2]) {
                var newl = this.avail_langs[i][0];

                if (this.lang[0].innerHTML != newl)
                    this._refresh_layout(newl);
                return 0;
            }
        }

        console.log("vkboard setLangNum failed");
        return -1;
    },

    // Layout info:

    avail_langs: [
        ["Us", "English (US)", VKeyboard.LangNum.ENGLISH],
        ["ChS", "&#x4E2D;&#x6587;(&#x7B80;)", VKeyboard.LangNum.CHINESE_S],
        ["ChT", "&#x4E2D;&#x6587;(&#x7E41;)", VKeyboard.LangNum.CHINESE_C],
        ["Jp", "Japanese", VKeyboard.LangNum.JAPANESE]
        //                , ["Ca", "Canadian"]
        //                , ["Ru", "&#x0420;&#x0443;&#x0441;&#x0441;&#x043A;&#x0438;&#x0439;"]
        ,
        ["De", "Deutsch", VKeyboard.LangNum.GERMANY],
        ["Fr", "Fran&#x00E7;ais", VKeyboard.LangNum.FRANCH],
        ["Es", "Espa&#x00F1;ol", VKeyboard.LangNum.SPANISH],
        ["Kr", "&#xD55C;&#XAD6D;", VKeyboard.LangNum.KOREAN],
        ["It", "Italiano", VKeyboard.LangNum.ITALIAN],
        ["Uk", "English (UK)", VKeyboard.LangNum.UK]
        //                , ["Cz", "&#x010C;esky"]
        //                , ["El", "&#x0388;&#x03BB;&#x03BB;&#x03B7;&#x03BD;&#x03B1;&#x03C2;"]
        //                , ["He", "&#x05E2;&#x05D1;&#x05E8;&#x05D9;&#x05EA;"]
        //  , ["Jp", "Japanese(Hiragana)"]
        //                , ["Jpk", "Japanese(Katakana)"]
        //, ["Kr", "Korea"]

    ],

    // Us International:

    Us_normal: [
        ["&#x0060;", "Grave"], "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", "&#x005B;", "&#x005D;", ,
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x003B;", "&#x0027;", "&#x005C;",
        "", "&#x007A;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    Us_caps: [
        ["&#x0060;", "Grave"], "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x005B;", "&#x005D;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003B;", "&#x0027;", "&#x005C;",
        "", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    Us_shift: [
        ["&#x007E;", "Tilde"], "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", ["&#x005E;", "Circumflex"], "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x007B;", "&#x007D;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003A;", "&#x0022;", "&#x007C;",
        "", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],

    //  Us_alt_gr: [, "&#x00A1;", "&#x00B2;", "&#x00B3;", "&#x00A4;", "&#x20AC;", "&#x00BC;", "&#x00BD;", "&#x00BE;", "&#x0091;", "&#x0092;", "&#x00A5;", "&#x00D7;",
    //              "&#x00E4;", "&#x00E5;", "&#x00E9;", "&#x00AE;", "&#x00FE;", "&#x00FC;", "&#x00FA;", "&#x00ED;", "&#x00F3;", "&#x00F6;", "&#x00AB;", "&#x00BB;",
    //              "&#x00AC;", "&#x00E1;", "&#x00DF;", "&#x0111;",,,,,, "&#x00F8;", "&#x00B6;", ["&#x00B4;", "Acute"],, "&#x00E6;",, "&#x00A9;",,,
    //              "&#x00F1;", "&#x00B5;", "&#x00E7;",, "&#x00BF;"],
    //
    //  Us_alt_gr_shift: [, "&#x00B9;",,, "&#x00A3;",,,,,,,, "&#x00F7;", "&#x00C4;", "&#x00C5;", "&#x00C9;",, "&#x00DE;", "&#x00DC;",
    //                    "&#x00DA;", "&#x00CD;", "&#x00D3;", "&#x00D6;",,, "&#x00A6;", "&#x00C1;", "&#x00A7;", "&#x0110;",,,,,, "&#x00D8;",
    //                    "&#x00B0;", ["&#x00A8;", "Umlaut"],, "&#x00C6;",, "&#x00A2;",,, "&#x00D1;",, "&#x00C7;",,""],
    // Uk International:

    Uk_normal: ["&#x0060;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", "&#x005B;", "&#x005D;", ,
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x003B;", "&#x0027;", "&#x0023;",
        "", "&#x007A;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    Uk_caps: ["&#x0060;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x005B;", "&#x005D;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003B;", "&#x0027;", "&#x0023;",
        "", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    Uk_shift: ["&#x00AC;", "&#x0021;", "&#x0022;", "&#x00A3;", "&#x0024;", "&#x0025;", ["&#x005E;", "Circumflex"], "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x007B;", "&#x007D;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003A;", "&#x0040;", "&#x007E;",
        "", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],

    // Canadian (multilingual standard):

    Ca_normal: ["&#x002F;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", ["&#x005E;", "Circumflex"], "&#x00E7;", "&#x00F9;",
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x003B;", "&#x00E8;", "&#x00E0;", , "&#x007A;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x002C;", "&#x002E;", "&#x00E9;"
    ],

    Ca_caps: ["&#x002F;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", ["&#x005E;", "Circumflex"], "&#x00C7;", "&#x00D9;",
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003B;", "&#x00C8;", "&#x00C0;", , "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x002C;", "&#x002E;", "&#x00C9;"
    ],

    Ca_shift: ["&#x005C;", "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", "&#x003F;", "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", ["&#x00A8;", "Umlaut"], "&#x00C7;", "&#x00D9;",
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003A;", "&#x00C8;", "&#x00C0;", , "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x0027;", "&#x0022;", "&#x00C9;"
    ],

    Ca_alt_gr: ["&#x007C;", , , , , , , "&#x007B;", "&#x007D;", "&#x005B;", "&#x005D;", , "&#x00AC;", , , , , , , , , , , ["&#x0060;", "Grave"],
        ["&#x007E;", "Tilde"], , , , , , , , , , , "&#x00B0;", , , "&#x00AB;", "&#x00BB;", , , , , , , "&#x003C;", "&#x003E;", ""
    ],

    // Russian:

    Ru_normal: ["&#x0451;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0439;", "&#x0446;", "&#x0443;", "&#x043A;", "&#x0435;", "&#x043D;", "&#x0433;", "&#x0448;", "&#x0449;", "&#x0437;", "&#x0445;", "&#x044A;", "&#x005C;",
        "&#x0444;", "&#x044B;", "&#x0432;", "&#x0430;", "&#x043F;", "&#x0440;", "&#x043E;", "&#x043B;", "&#x0434;", "&#x0436;", "&#x044D;", , , "&#x044F;", "&#x0447;", "&#x0441;", "&#x043C;", "&#x0438;", "&#x0442;", "&#x044C;", "&#x0431;", "&#x044E;", "&#x002E;"
    ],

    Ru_caps: ["&#x0401;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0419;", "&#x0426;", "&#x0423;", "&#x041A;", "&#x0415;", "&#x041D;", "&#x0413;", "&#x0428;", "&#x0429;", "&#x0417;", "&#x0425;", "&#x042A;", "&#x005C;",
        "&#x0424;", "&#x042B;", "&#x0412;", "&#x0410;", "&#x041F;", "&#x0420;", "&#x041E;", "&#x041B;", "&#x0414;", "&#x0416;", "&#x042D;", , , "&#x042F;", "&#x0427;", "&#x0421;", "&#x041C;", "&#x0418;", "&#x0422;", "&#x042C;", "&#x0411;", "&#x042E;", "&#x002E;"
    ],

    Ru_shift: ["&#x0401;", "&#x0021;", "&#x0022;", "&#x2116;", "&#x003B;", "&#x0025;", "&#x003A;", "&#x003F;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0419;", "&#x0426;", "&#x0423;", "&#x041A;", "&#x0415;", "&#x041D;", "&#x0413;", "&#x0428;", "&#x0429;", "&#x0417;", "&#x0425;", "&#x042A;", "&#x002F;",
        "&#x0424;", "&#x042B;", "&#x0412;", "&#x0410;", "&#x041F;", "&#x0420;", "&#x041E;", "&#x041B;", "&#x0414;", "&#x0416;", "&#x042D;", , , "&#x042F;", "&#x0427;", "&#x0421;", "&#x041C;", "&#x0418;", "&#x0422;", "&#x042C;", "&#x0411;", "&#x042E;", "&#x002C;"
    ],

    // German:

    De_normal: [
        ["&#x005E;", "Circumflex"], "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x00DF;", ["&#x00B4;", "Acute"],
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x007A;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", "&#x00FC;", "&#x002B;", ,
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x00F6;", "&#x00E4;", "&#x0023;",
        "&#x003C;", "&#x0079;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x002C;", "&#x002E;", "&#x002D;"
    ],

    De_caps: ["&#x005E;", "&#x0021;", "&#x0022;", "&#x00A7;", "&#x0024;", "&#x0025;", "&#x0026;", "&#x002F;", "&#x0028;", "&#x0029;", "&#x003D;", "&#x003F;", ["&#x0060;", "Grave"],
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x005A;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x00DC;", "&#x002A;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x00D6;", "&#x00C4;", "&#x0027;",
        "&#x003C;", "&#x0059;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003B;", "&#x003A;", "&#x002D;"
    ],

    De_shift: ["&#x00B0;", "&#x0021;", "&#x0022;", "&#x00A7;", "&#x0024;", "&#x0025;", "&#x0026;", "&#x002F;", "&#x0028;", "&#x0029;", "&#x003D;", "&#x003F;", ["&#x0060;", "Grave"],
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x005A;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x00DC;", "&#x002A;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x00D6;", "&#x00C4;", "&#x0027;",
        "&#x003E;", "&#x0059;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003B;", "&#x003A;", "&#x005F;"
    ],

    De_shift_caps: [
        ["&#x00B0;", "Circumflex"], "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x00DF;", ["&#x00B4;", "Acute"],
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x005A;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x00DC;", "&#x002B;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x00D6;", "&#x00C4;", "&#x0023;",
        "&#x003E;", "&#x0059;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x002C;", "&#x002E;", "&#x005F;"
    ],

    De_alt_gr: [, , "&#x00B2;", "&#x00B3;", , , , "&#x007B;", "&#x005B;", "&#x005D;", "&#x007D;", "&#x005C;", , "&#x0040;", , "&#x20AC;", , , , , , , , , ["&#x007E;", "Tilde"], , , , , , , , , , , , , ,
        "&#x007C;", , , , , , , "&#x00B5;", , , ""
    ],

    // French:

    Fr_normal: ["&#x00B2;", "&#x0026;", "&#x00E9;", "&#x0022;", "&#x0027;", "&#x0028;", "&#x002D;", "&#x00E8;", "&#x005F;", "&#x00E7;", "&#x00E0;", "&#x0029;", "&#x003D;",
        "&#x0061;", "&#x007A;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", ["&#x005E;", "Circumflex"], "&#x0024;", ,
        "&#x0071;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x006D;", "&#x00F9;", "&#x002A;",
        "&#x003C;", "&#x0077;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x002C;", "&#x003B;", "&#x003A;", "&#x0021;"
    ],

    Fr_caps: ["&#x00B2;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x00B0;", "&#x002B;",
        "&#x0041;", "&#x005A;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", ["&#x00A8;", "Umlaut"], "&#x00A3;", ,
        "&#x0051;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x004D;", "&#x0025;", "&#x00B5;",
        "&#x003C;", "&#x0057;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x003F;", "&#x002E;", "&#x002F;", "&#x00A7;"
    ],

    Fr_shift: [, "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x00BA;", "&#x002B;",
        "&#x0041;", "&#x005A;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", ["&#x00A8;", "Umlaut"], "&#x00A3;", ,
        "&#x0051;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x004D;", "&#x0025;", "&#x00B5;",
        "&#x003E;", "&#x0057;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x003F;", "&#x002E;", "&#x002F;", "&#x00A7;"
    ],

    Fr_shift_caps: [, "&#x0026;", "&#x00E9;", "&#x0022;", "&#x0027;", "&#x0028;", "&#x002D;", "&#x00E8;", "&#x005F;", "&#x00E7;", "&#x00E0;", "&#x0029;", "&#x003D;",
        "&#x0061;", "&#x007A;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", ["&#x005E;", "Circumflex"], "&#x0024;", ,
        "&#x0071;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x006D;", "&#x00F9;", "&#x002A;",
        "&#x003E;", "&#x0077;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x002C;", "&#x003B;", "&#x003A;", "&#x0021;"
    ],

    Fr_alt_gr: [, , , "&#x0023;", "&#x007B;", "&#x005B;", "&#x007C;", , "&#x005C;", "&#x005E;", "&#x0040;", "&#x005D;", "&#x007D;", , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ""],

    // Spanish:

    Es_normal: ["&#x00BA;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x0092;", "&#x00A1;",
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", ["&#x0060;", "Grave"], "&#x002B;", ,
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x00F1;", ["&#x00B4;", "Acute"], "&#x00E7;",
        "&#x003C;", "&#x007A;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x002C;", "&#x002E;", "&#x002D;"
    ],

    Es_caps: ["&#x00BA;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x0092;", "&#x00A1;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", ["&#x0060;", "Grave"], "&#x002B;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x00D1;", ["&#x00B4;", "Acute"], "&#x00C7;",
        "&#x003C;", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x002C;", "&#x002E;", "&#x002D;"
    ],

    Es_shift: ["&#x00AA;", "&#x0021;", "&#x0022;", "&#x00B7;", "&#x0024;", "&#x0025;", "&#x0026;", "&#x002F;", "&#x0028;", "&#x0029;", "&#x003D;", "&#x003F;", "&#x00BF;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", ["&#x005E;", "Circumflex"], "&#x002A;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x00D1;", ["&#x00A8;", "Umlaut"], "&#x00C7;",
        "&#x003E;", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003B;", "&#x003A;", "&#x005F;"
    ],

    Es_alt_gr: ["&#x005C;", "&#x007C;", "&#x0040;", "&#x0023;", "&#x007E;", "&#x20AC;", "&#x00AC;", , , , , , , , , "&#x20AC;", , , , , , , , "&#x005B;", "&#x005D;", , , , , , , , , , , , "&#x007B;", "&#x007D;", , , , , , , , , , , ""],

    // Italian:

    It_normal: ["&#x005C;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x0092;", "&#x00EC;",
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", "&#x00E8;", "&#x002B;", ,
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x00F2;", "&#x00E0;", "&#x00F9;",
        "&#x003C;", "&#x007A;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x002C;", "&#x002E;", "&#x002D;"
    ],

    It_caps: ["&#x005C;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x0092;", "&#x00EC;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x00E8;", "&#x002B;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x00F2;", "&#x00E0;", "&#x00F9;",
        "&#x003C;", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x002C;", "&#x002E;", "&#x002D;"
    ],

    It_shift: ["&#x007C;", "&#x0021;", "&#x0022;", "&#x00A3;", "&#x0024;", "&#x0025;", "&#x0026;", "&#x002F;", "&#x0028;", "&#x0029;", "&#x003D;", "&#x003F;", "&#x005E;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x00E9;", "&#x002A;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x00E7;", "&#x00B0;", "&#x00A7;",
        "&#x003E;", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003B;", "&#x003A;", "&#x005F;"
    ],

    It_alt_gr: [, , , "&#x0023;", , "&#x20AC;", , "&#x007B;", "&#x005B;", "&#x005D;", "&#x007D;", , ,
        "&#x0040;", , "&#x20AC;", , , , , , , , , "&#x007E;", , , , , , , , , , , , , "&#x0060;", , , , , , , , , , , ""
    ],

    // It_alt_gr_shift: [,,,,,,,,,,,,,,,,,,,,,,"&#x007B;","&#x007D;",,,,,,,,,,,,,,,,,,,,,,,,,""],

    // Czech:

    Cz_normal: ["&#x003B;", "&#x002B;", "&#x011B;", "&#x0161;", "&#x010D;", "&#x0159;", "&#x017E;", "&#x00FD;", "&#x00E1;", "&#x00ED;", "&#x00E9;", "&#x003D;", ["&#x00B4;", "Acute"],
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x007A;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", "&#x00FA;", "&#x0029;", "&#x0026;",
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x016F;", "&#x00A7;", ["&#x00A8;", "Umlaut"], , "&#x0079;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x002C;", "&#x002E;", "&#x002D;"
    ],

    Cz_caps: ["&#x003B;", "&#x002B;", "&#x011A;", "&#x0160;", "&#x010C;", "&#x0158;", "&#x017D;", "&#x00DD;", "&#x00C1;", "&#x00CD;", "&#x00C9;", "&#x003D;", "&#x02CA;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x005A;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x00DA;", "&#x0029;", "&#x0026;",
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x016E;", "&#x00A7;", ["&#x00A8;", "Umlaut"], , "&#x0059;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x002C;", "&#x002E;", "&#x002D;"
    ],

    Cz_shift: [
        ["&#x00BA;", "RingAbove"], "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x0025;", ["&#x02C7;", "Caron"],
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x005A;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x002F;", "&#x0028;", "&#x002A;",
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x0022;", "&#x0021;", "&#x0027;", , "&#x0059;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003F;", "&#x003A;", "&#x005F;"
    ],

    Cz_alt_gr: [, ["&#x007E;", "Tilde"],
        ["&#x02C7;", "Caron"],
        ["&#x005E;", "Circumflex"],
        ["&#x02D8;", "Breve"],
        ["&#x00B0;", "RingAbove"],
        ["&#x02DB;", "Ogonek"],
        ["&#x0060;", "Grave"],
        ["&#x02D9;", "DotAbove"],
        ["&#x00B4;", "Acute"],
        ["&#x02DD;", "DoubleAcute"],
        ["&#x00A8;", "Umlaut"],
        ["&#x00B8;", "Cedilla"],
        "&#x005C;", "&#x007C;", "&#x20AC;", , , , , , , , "&#x00F7;", "&#x00D7;", "&#x003C;", , "&#x0111;", "&#x00D0;", "&#x005B;", "&#x005D;", , , "&#x0142;", "&#x0141;", "&#x0024;", "&#x00DF;", "&#x00A4;", "&#x003E;", , "&#x0023;", , "&#x0040;", "&#x007B;", "&#x007D;", , , , ""
    ],

    // Greek:

    El_normal: ["&#x00BD;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x003B;", "&#x03C2;", "&#x03B5;", "&#x03C1;", "&#x03C4;", "&#x03C5;", "&#x03B8;", "&#x03B9;", "&#x03BF;", "&#x03C0;", "&#x005B;", "&#x005D;", "&#x00A7;",
        "&#x03B1;", "&#x03C3;", "&#x03B4;", "&#x03C6;", "&#x03B3;", "&#x03B7;", "&#x03BE;", "&#x03BA;", "&#x03BB;", ["&#x00B4;", "Acute"], "&#x0092;", "&#x005C;", , "&#x03B6;", "&#x03C7;", "&#x03C8;", "&#x03C9;", "&#x03B2;", "&#x03BD;", "&#x03BC;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    El_caps: ["&#x00BD;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x003B;", "&#x03C2;", "&#x0395;", "&#x03A1;", "&#x03A4;", "&#x03A5;", "&#x0398;", "&#x0399;", "&#x039F;", "&#x03A0;", "&#x005B;", "&#x005D;", "&#x00A7;",
        "&#x0391;", "&#x03A3;", "&#x0394;", "&#x03A6;", "&#x0393;", "&#x0397;", "&#x039E;", "&#x039A;", "&#x039B;", ["&#x00B4;", "Acute"], "&#x0092;", "&#x005C;", , "&#x0396;", "&#x03A7;", "&#x03A8;", "&#x03A9;", "&#x0392;", "&#x039D;", "&#x039C;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    El_shift: ["&#x00B1;", "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", "&#x005E;", "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x003A;", "&#x00A6;", "&#x0395;", "&#x03A1;", "&#x03A4;", "&#x03A5;", "&#x0398;", "&#x0399;", "&#x039F;", "&#x03A0;", "&#x007B;", "&#x007D;", "&#x00A9;",
        "&#x0391;", "&#x03A3;", "&#x0394;", "&#x03A6;", "&#x0393;", "&#x0397;", "&#x039E;", "&#x039A;", "&#x039B;", ["&#x00A8;", "Umlaut"], "&#x0091;", "&#x007C;", , "&#x0396;", "&#x03A7;", "&#x03A8;", "&#x03A9;", "&#x0392;", "&#x039D;", "&#x039C;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],

    El_alt_gr: [, , "&#x00B2;", "&#x00B3;", "&#x00A3;", "&#x00A7;", "&#x00B6;", , "&#x00A4;", "&#x00A6;", "&#x00B0;", "&#x00B1;", "&#x00BD;", , , , , , , , , , , "&#x00AB;", "&#x00BB;", , , , , , , , , , , ["&#x0385;", "DialytikaTonos"], , "&#x00AC;", , , , , , , , , , , ""],

    // Hebrew:

    He_normal: ["&#x003B;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x002F;", "&#x0027;", "&#x05E7;", "&#x05E8;", "&#x05D0;", "&#x05D8;", "&#x05D5;", "&#x05DF;", "&#x05DD;", "&#x05E4;", "&#x005B;", "&#x005D;", "&#x005C;",
        "&#x05E9;", "&#x05D3;", "&#x05D2;", "&#x05DB;", "&#x05E2;", "&#x05D9;", "&#x05D7;", "&#x05DC;", "&#x05DA;", "&#x05E3;", "&#x002C;", , , "&#x05D6;", "&#x05E1;", "&#x05D1;", "&#x05D4;", "&#x05E0;", "&#x05DE;", "&#x05E6;", "&#x05EA;", "&#x05E5;", "&#x002E;"
    ],

    He_shift: ["&#x007E;", "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", "&#x005E;", "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x002F;", "&#x0027;", "&#x05E7;", "&#x05E8;", "&#x05D0;", "&#x05D8;", "&#x05D5;", "&#x05DF;", "&#x05DD;", "&#x05E4;", "&#x007B;", "&#x007D;", "&#x007C;", , "&#x05E9;", "&#x05D3;", "&#x05D2;", "&#x05DB;", "&#x05E2;", "&#x05D9;", "&#x05D7;", "&#x05DC;", "&#x05DA;", "&#x003A;", "&#x0022;", ,
        "&#x05D6;", "&#x05E1;", "&#x05D1;", "&#x05D4;", "&#x05E0;", "&#x05DE;", "&#x05E6;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],

    He_alt_gr: [, , , , "&#x20AA;", , , , , , , "&#x05BE;", , , , , , , , "&#x05F0;", , , , , , , , , , , , "&#x05F2;", "&#x05F1;", , , , , , , , , , , , , , , , ""],


    // Japanese:

    Jp_alt_gr_switch: ["Hi/Ka", "Hi/Ka"],

    // Hiragana
    Jp_normal: ["&#x308D;", "&#x306C;", "&#x3075;", "&#x3042;", "&#x3046;", "&#x3048;", "&#x304A;", "&#x3084;", "&#x3086;", "&#x3088;", "&#x308F;", "&#x307B;", "&#x3078;",
        "&#x305F;", "&#x3066;", "&#x3044;", "&#x3059;", "&#x304B;", "&#x3093;", "&#x306A;", "&#x306B;", "&#x3089;", "&#x305B;", "&#x309B;", "&#x309C;", ,
        "&#x3061;", "&#x3068;", "&#x3057;", "&#x306F;", "&#x304D;", "&#x304F;", "&#x307E;", "&#x306E;", "&#x308a;", "&#x308C;", "&#x3051;", "&#x3080;",
        "", "&#x3064;", "&#x3055;", "&#x305D;", "&#x3072;", "&#x3053;", "&#x307F;", "&#x3082;", "&#x306D;", "&#x308B;", "&#x3081;"
    ],

    Jp_caps: ["&#x308D;", "&#x306C;", "&#x3075;", "&#x3042;", "&#x3046;", "&#x3048;", "&#x304A;", "&#x3084;", "&#x3086;", "&#x3088;", "&#x308F;", "&#x307B;", "&#x3078;",
        "&#x305F;", "&#x3066;", "&#x3044;", "&#x3059;", "&#x304B;", "&#x3093;", "&#x306A;", "&#x306B;", "&#x3089;", "&#x305B;", "&#x309B;", "&#x309C;", ,
        "&#x3061;", "&#x3068;", "&#x3057;", "&#x306F;", "&#x304D;", "&#x304F;", "&#x307E;", "&#x306E;", "&#x308a;", "&#x308C;", "&#x3051;", "&#x3080;",
        "", "&#x3064;", "&#x3055;", "&#x305D;", "&#x3072;", "&#x3053;", "&#x307F;", "&#x3082;", "&#x306D;", "&#x308B;", "&#x3081;"
    ],

    Jp_shift: ["&#x308D;", "&#x306C;", "&#x3075;", "&#x3041;", "&#x3045;", "&#x3047;", "&#x3049;", "&#x3083;", "&#x3085;", "&#x3087;", "&#x3092;", "&#x30FC;", "&#x3078;",
        "&#x305F;", "&#x3066;", "&#x3043;", "&#x3059;", "&#x304B;", "&#x3093;", "&#x306A;", "&#x306B;", "&#x3089;", "&#x305B;", "&#x300E;", "&#x300F;", ,
        "&#x3061;", "&#x3068;", "&#x3057;", "&#x306F;", "&#x304D;", "&#x304F;", "&#x307E;", "&#x306E;", "&#x308a;", "&#x308C;", "&#x3051;", "&#x3080;",
        "", "&#x3063;", "&#x3055;", "&#x305D;", "&#x3072;", "&#x3053;", "&#x307F;", "&#x3082;", "&#x3001;", "&#x3002;", "&#x30FB;"
    ],

    // Katagana
    Jp_alt_gr: ["&#x30ED;", "&#x30CC;", "&#x30D5;", "&#x30A2;", "&#x30A6;", "&#x30A8;", "&#x30AA;", "&#x30E4;", "&#x30E6;", "&#x30E8;", "&#x30EF;", "&#x30DB;", "&#x30D8;",
        "&#x30BF;", "&#x30C6;", "&#x30A4;", "&#x30B9;", "&#x30AB;", "&#x30F3;", "&#x30CA;", "&#x30CB;", "&#x30E9;", "&#x30BB;", "&#x309B;", "&#x309C;", ,
        "&#x30C1;", "&#x30C8;", "&#x30B7;", "&#x30CF;", "&#x30AD;", "&#x30AF;", "&#x30DE;", "&#x30CE;", "&#x30EA;", "&#x30EC;", "&#x30B1;", "&#x30E0;",
        "", "&#x30C4;", "&#x30B5;", "&#x30BD;", "&#x30D2;", "&#x30B3;", "&#x30DF;", "&#x30E2;", "&#x30CD;", "&#x30EB;", "&#x30E1;"
    ],

    Jp_alt_gr_caps: ["&#x30ED;", "&#x30CC;", "&#x30D5;", "&#x30A2;", "&#x30A6;", "&#x30A8;", "&#x30AA;", "&#x30E4;", "&#x30E6;", "&#x30E8;", "&#x30EF;", "&#x30DB;", "&#x30D8;",
        "&#x30BF;", "&#x30C6;", "&#x30A4;", "&#x30B9;", "&#x30AB;", "&#x30F3;", "&#x30CA;", "&#x30CB;", "&#x30E9;", "&#x30BB;", "&#x309B;", "&#x309C;", ,
        "&#x30C1;", "&#x30C8;", "&#x30B7;", "&#x30CF;", "&#x30AD;", "&#x30AF;", "&#x30DE;", "&#x30CE;", "&#x30EA;", "&#x30EC;", "&#x30B1;", "&#x30E0;",
        "", "&#x30C4;", "&#x30B5;", "&#x30BD;", "&#x30D2;", "&#x30B3;", "&#x30DF;", "&#x30E2;", "&#x30CD;", "&#x30EB;", "&#x30E1;"
    ],

    Jp_alt_gr_shift: ["&#x30ED;", "&#x30CC;", "&#x30D5;", "&#x30A1;", "&#x30A5;", "&#x30A7;", "&#x30A9;", "&#x30E3;", "&#x30E5;", "&#x30E7;", "&#x30F2;", "&#x30FC;", "&#x30D8;",
        "&#x30BF;", "&#x30C6;", "&#x30A3;", "&#x30B9;", "&#x30AB;", "&#x30F3;", "&#x30CA;", "&#x30CB;", "&#x30E9;", "&#x30BB;", "&#x300C;", "&#x300D;", ,
        "&#x30C1;", "&#x30C8;", "&#x30B7;", "&#x30CF;", "&#x30AD;", "&#x30AF;", "&#x30DE;", "&#x30CE;", "&#x30EA;", "&#x30EC;", "&#x30B1;", "&#x30E0;",
        "", "&#x30C3;", "&#x30B5;", "&#x30BD;", "&#x30D2;", "&#x30B3;", "&#x30DF;", "&#x30E2;", "&#x3001;", "&#x3002;", "&#x30FB;"
    ],


    // Korea:

    Kr_normal: ["&#x0060;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x1107;", "&#x110C;", "&#x1103;", "&#x1100;", "&#x1109;", "&#x116D;", "&#x1167;", "&#x1163;", "&#x1162;", "&#x1166;", "&#x005B;", "&#x005D;", ,
        "&#x1106;", "&#x1102;", "&#x110B;", "&#x1105;", "&#x1112;", "&#x1169;", "&#x1165;", "&#x1161;", "&#x1175;", "&#x003B;", "&#x0027;", "&#x005C;", , "&#x110F;", "&#x1110;", "&#x110E;", "&#x1111;", "&#x1172;", "&#x116E;", "&#x1173;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    Kr_caps: ["&#x0060;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x1107;", "&#x110C;", "&#x1103;", "&#x1100;", "&#x1109;", "&#x116D;", "&#x1167;", "&#x1163;", "&#x1162;", "&#x1166;", "&#x005B;", "&#x005D;", ,
        "&#x1106;", "&#x1102;", "&#x110B;", "&#x1105;", "&#x1112;", "&#x1169;", "&#x1165;", "&#x1161;", "&#x1175;", "&#x003B;", "&#x0027;", "&#x005C;", , "&#x110F;", "&#x1110;", "&#x110E;", "&#x1111;", "&#x1172;", "&#x116E;", "&#x1173;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    Kr_shift: ["&#x007E;", "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", "&#x005E;", "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x1108;", "&#x110D;", "&#x1104;", "&#x1101;", "&#x110A;", "&#x116D;", "&#x1167;", "&#x1163;", "&#x1164;", "&#x1168;", "&#x007B;", "&#x007D;", ,
        "&#x1106;", "&#x1102;", "&#x110B;", "&#x1105;", "&#x1112;", "&#x1169;", "&#x1165;", "&#x1161;", "&#x1175;", "&#x003A;", "&#x0022;", "&#x007C;", , "&#x110F;", "&#x1110;", "&#x110E;", "&#x1111;", "&#x1172;", "&#x116E;", "&#x1173;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],

    // Chinese Simplier:

    ChS_normal: [
        ["&#x0060;", "Grave"], "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", "&#x005B;", "&#x005D;", ,
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x003B;", "&#x0027;", "&#x3001;",
        "", "&#x007A;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    ChS_caps: [
        ["&#x0060;", "Grave"], "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x005B;", "&#x005D;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003B;", "&#x0027;", "&#x3001;",
        "", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    ChS_shift: [
        ["&#x007E;", "Tilde"], "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", ["&#x005E;", "Circumflex"], "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x007B;", "&#x007D;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003A;", "&#x0022;", "&#x007C;",
        "", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],


    // Chinese Tradition
    ChT_alt_gr_switch: ["&#x6CE8;/&#x5009;", "&#x6CE8;/&#x5009;"],

    // Bopomofo
    ChT_normal: ["&#x0060;", "&#x3105;", "&#x3109;", "&#x02C7;", "&#x02CB;", "&#x3113;", "&#x02CA;", "&#x02D9;", "&#x311A;", "&#x311E;", "&#x3122;", "&#x3126;", "&#x003D;",
        "&#x3106;", "&#x310A;", "&#x310D;", "&#x3110;", "&#x3114;", "&#x3117;", "&#x3127;", "&#x311B;", "&#x311F;", "&#x3123;", "&#x005B;", "&#x005D;", ,
        "&#x3107;", "&#x310B;", "&#x310E;", "&#x3111;", "&#x3115;", "&#x3118;", "&#x3128;", "&#x311C;", "&#x3120;", "&#x3124;", "&#x0027;", "&#x005C;",
        "", "&#x3108;", "&#x310C;", "&#x310F;", "&#x3112;", "&#x3116;", "&#x3119;", "&#x3129;", "&#x311D;", "&#x3121;", "&#x3125;"
    ],

    ChT_caps: ["&#x0060;", "&#x3105;", "&#x3109;", "&#x02C7;", "&#x02CB;", "&#x3113;", "&#x02CA;", "&#x02D9;", "&#x311A;", "&#x311E;", "&#x3122;", "&#x3126;", "&#x003D;",
        "&#x3106;", "&#x310A;", "&#x310D;", "&#x3110;", "&#x3114;", "&#x3117;", "&#x3127;", "&#x311B;", "&#x311F;", "&#x3123;", "&#x005B;", "&#x005D;", ,
        "&#x3107;", "&#x310B;", "&#x310E;", "&#x3111;", "&#x3115;", "&#x3118;", "&#x3128;", "&#x311C;", "&#x3120;", "&#x3124;", "&#x0027;", "&#x005C;",
        "", "&#x3108;", "&#x310C;", "&#x310F;", "&#x3112;", "&#x3116;", "&#x3119;", "&#x3129;", "&#x311D;", "&#x3121;", "&#x3125;"
    ],

    ChT_shift_caps: [
        ["&#x007E;", "Tilde"], "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", ["&#x005E;", "Circumflex"], "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", "&#x007B;", "&#x007D;", ,
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x003A;", "&#x0022;", "&#x007C;",
        "", "&#x007A;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],
    ChT_shift: [
        ["&#x007E;", "Tilde"], "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", ["&#x005E;", "Circumflex"], "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x007B;", "&#x007D;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003A;", "&#x0022;", "&#x007C;",
        "", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],
    // ChaJei
    ChT_alt_gr: ["&#x0060;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x624B;", "&#x7530;", "&#x6C34;", "&#x53E3;", "&#x5EFF;", "&#x535C;", "&#x5C71;", "&#x6208;", "&#x4EBA;", "&#x5FC3;", "&#x005B;", "&#x005D;", ,
        "&#x65E5;", "&#x5C38;", "&#x6728;", "&#x706B;", "&#x571F;", "&#x7AF9;", "&#x5341;", "&#x5927;", "&#x4E2D;", "&#x003B;", "&#x0027;", "&#x005C;",
        "", "&#xFF3A;", "&#x96E3;", "&#x91D1;", "&#x5973;", "&#x6708;", "&#x5F13;", "&#x4E00;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    ChT_alt_gr_caps: ["&#x0060;", "&#x0031;", "&#x0032;", "&#x0033;", "&#x0034;", "&#x0035;", "&#x0036;", "&#x0037;", "&#x0038;", "&#x0039;", "&#x0030;", "&#x002D;", "&#x003D;",
        "&#x624B;", "&#x7530;", "&#x6C34;", "&#x53E3;", "&#x5EFF;", "&#x535C;", "&#x5C71;", "&#x6208;", "&#x4EBA;", "&#x5FC3;", "&#x005B;", "&#x005D;", ,
        "&#x65E5;", "&#x5C38;", "&#x6728;", "&#x706B;", "&#x571F;", "&#x7AF9;", "&#x5341;", "&#x5927;", "&#x4E2D;", "&#x003B;", "&#x0027;", "&#x005C;",
        "", "&#xFF3A;", "&#x96E3;", "&#x91D1;", "&#x5973;", "&#x6708;", "&#x5F13;", "&#x4E00;", "&#x002C;", "&#x002E;", "&#x002F;"
    ],

    ChT_alt_gr_shift: [
        ["&#x007E;", "Tilde"], "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", ["&#x005E;", "Circumflex"], "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0051;", "&#x0057;", "&#x0045;", "&#x0052;", "&#x0054;", "&#x0059;", "&#x0055;", "&#x0049;", "&#x004F;", "&#x0050;", "&#x007B;", "&#x007D;", ,
        "&#x0041;", "&#x0053;", "&#x0044;", "&#x0046;", "&#x0047;", "&#x0048;", "&#x004A;", "&#x004B;", "&#x004C;", "&#x003A;", "&#x0022;", "&#x007C;",
        "", "&#x005A;", "&#x0058;", "&#x0043;", "&#x0056;", "&#x0042;", "&#x004E;", "&#x004D;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],
    ChT_alt_gr_shift_caps: [
        ["&#x007E;", "Tilde"], "&#x0021;", "&#x0040;", "&#x0023;", "&#x0024;", "&#x0025;", ["&#x005E;", "Circumflex"], "&#x0026;", "&#x002A;", "&#x0028;", "&#x0029;", "&#x005F;", "&#x002B;",
        "&#x0071;", "&#x0077;", "&#x0065;", "&#x0072;", "&#x0074;", "&#x0079;", "&#x0075;", "&#x0069;", "&#x006F;", "&#x0070;", "&#x007B;", "&#x007D;", ,
        "&#x0061;", "&#x0073;", "&#x0064;", "&#x0066;", "&#x0067;", "&#x0068;", "&#x006A;", "&#x006B;", "&#x006C;", "&#x003A;", "&#x0022;", "&#x007C;",
        "", "&#x007A;", "&#x0078;", "&#x0063;", "&#x0076;", "&#x0062;", "&#x006E;", "&#x006D;", "&#x003C;", "&#x003E;", "&#x003F;"
    ],
    // // Bopomofo
    // ChT_normal: ["&#x20AC;", "&#x3105;", "&#x3109;", "&#x02C7;", "&#x02CB;", "&#x3113;", "&#x02CA;", "&#x02D9;", "&#x311A;", "&#x311E;", "&#x3122;", "&#x3126;", "&#x003D;",
    //                   "&#x3106;", "&#x310A;", "&#x310D;", "&#x3110;", "&#x3114;", "&#x3117;", "&#x3127;", "&#x311B;", "&#x311F;", "&#x3123;", "&#x005B;", "&#x005D;", ,
    //                   "&#x3107;", "&#x310B;", "&#x310E;", "&#x3111;", "&#x3115;", "&#x3118;", "&#x3128;", "&#x311C;", "&#x3120;", "&#x3124;", "&#x0027;", "&#x005C;",
    //              "",      "&#x3108;", "&#x310C;", "&#x310F;", "&#x3112;", "&#x3116;", "&#x3119;", "&#x3129;", "&#x311D;", "&#x3121;", "&#x3125;"],

    // Diacritic arrays:

    Acute: [
        ["&#x0061;", "&#x00E1;"],
        ["&#x0065;", "&#x00E9;"],
        ["&#x0069;", "&#x00ED;"],
        ["&#x006F;", "&#x00F3;"],
        ["&#x0075;", "&#x00FA;"],
        ["&#x0079;", "&#x00FD;"],
        ["&#x0041;", "&#x00C1;"],
        ["&#x0045;", "&#x00C9;"],
        ["&#x0049;", "&#x00CD;"],
        ["&#x004F;", "&#x00D3;"],
        ["&#x0055;", "&#x00DA;"],
        ["&#x0059;", "&#x00DD;"],
        ["&#x0063;", "&#x0107;"],
        ["&#x0043;", "&#x0106;"],
        ["&#x006C;", "&#x013A;"],
        ["&#x004C;", "&#x0139;"],
        ["&#x006D;", "&#x1E3F;"],
        ["&#x004D;", "&#x1E3E;"],
        ["&#x006E;", "&#x0144;"],
        ["&#x004E;", "&#x0143;"],
        ["&#x0072;", "&#x0155;"],
        ["&#x0052;", "&#x0154;"],
        ["&#x0073;", "&#x015B;"],
        ["&#x0053;", "&#x015A;"],
        ["&#x007A;", "&#x017A;"],
        ["&#x005A;", "&#x0179;"],
        ["&#x0391;", "&#x0386;"],
        ["&#x0395;", "&#x0388;"],
        ["&#x0397;", "&#x0389;"],
        ["&#x0399;", "&#x038A;"],
        ["&#x039F;", "&#x038C;"],
        ["&#x03A5;", "&#x038E;"],
        ["&#x03A9;", "&#x038F;"],
        ["&#x03B1;", "&#x03AC;"],
        ["&#x03B5;", "&#x03AD;"],
        ["&#x03B7;", "&#x03AE;"],
        ["&#x03B9;", "&#x03AF;"],
        ["&#x03BF;", "&#x03CC;"],
        ["&#x03C5;", "&#x03CD;"],
        ["&#x03C9;", "&#x03CE;"],
        ["&#x0057;", "&#x1E82;"],
        ["&#x0077;", "&#x1E83;"]
    ],

    Breve: [
        ["&#x0061;", "&#x0103;"],
        ["&#x0065;", "&#x0115;"],
        ["&#x0069;", "&#x012D;"],
        ["&#x006F;", "&#x014F;"],
        ["&#x0075;", "&#x016D;"],
        ["&#x0041;", "&#x0102;"],
        ["&#x0045;", "&#x0114;"],
        ["&#x0049;", "&#x012C;"],
        ["&#x004F;", "&#x014E;"],
        ["&#x0055;", "&#x016C;"],
        ["&#x0079;", "y&#x306;"],
        ["&#x0059;", "Y&#x306;"],
        ["&#x0067;", "&#x011F;"],
        ["&#x0047;", "&#x011E;"]
    ],

    Caron: [
        ["&#x0063;", "&#x010D;"],
        ["&#x0043;", "&#x010C;"],
        ["&#x0064;", "&#x010F;"],
        ["&#x0044;", "&#x010E;"],
        ["&#x0065;", "&#x011B;"],
        ["&#x0045;", "&#x011A;"],
        ["&#x006E;", "&#x0148;"],
        ["&#x004E;", "&#x0147;"],
        ["&#x0072;", "&#x0159;"],
        ["&#x0052;", "&#x0158;"],
        ["&#x0073;", "&#x0161;"],
        ["&#x0053;", "&#x0160;"],
        ["&#x0074;", "&#x0165;"],
        ["&#x0054;", "&#x0164;"],
        ["&#x007A;", "&#x017E;"],
        ["&#x005A;", "&#x017D;"],
        ["&#x006C;", "&#x013E;"],
        ["&#x004C;", "&#x013D;"]
    ],

    Cedilla: [
        ["&#x0063;", "&#x00E7;"],
        ["&#x0043;", "&#x00C7;"],
        ["&#x0067;", "&#x0123;"],
        ["&#x0047;", "&#x0122;"],
        ["&#x006B;", "&#x0137;"],
        ["&#x004B;", "&#x0136;"],
        ["&#x006C;", "&#x013C;"],
        ["&#x004C;", "&#x013B;"],
        ["&#x006E;", "&#x0146;"],
        ["&#x004E;", "&#x0145;"],
        ["&#x0072;", "&#x0157;"],
        ["&#x0052;", "&#x0156;"],
        ["&#x0073;", "&#x015F;"],
        ["&#x0053;", "&#x015E;"],
        ["&#x0074;", "&#x0163;"],
        ["&#x0054;", "&#x0162;"]
    ],

    Circumflex: [
        ["&#x0061;", "&#x00E2;"],
        ["&#x0041;", "&#x00C2;"],
        ["&#x0065;", "&#x00EA;"],
        ["&#x0045;", "&#x00CA;"],
        ["&#x0069;", "&#x00EE;"],
        ["&#x0049;", "&#x00CE;"],
        ["&#x006F;", "&#x00F4;"],
        ["&#x004F;", "&#x00D4;"],
        ["&#x0063;", "&#x0109;"],
        ["&#x0043;", "&#x0108;"],
        ["&#x0067;", "&#x011D;"],
        ["&#x0047;", "&#x011C;"],
        ["&#x0068;", "&#x0125;"],
        ["&#x0048;", "&#x0124;"],
        ["&#x006A;", "&#x0135;"],
        ["&#x004A;", "&#x0134;"],
        ["&#x0073;", "&#x015D;"],
        ["&#x0053;", "&#x015C;"],
        ["&#x0075;", "&#x00FB;"],
        ["&#x0055;", "&#x00DB;"],
        ["&#x0077;", "&#x0175;"],
        ["&#x0057;", "&#x0174;"],
        ["&#x0079;", "&#x0177;"],
        ["&#x0059;", "&#x0176;"]
    ],

    DialytikaTonos: [
        ["&#x03B9;", "&#x0390;"],
        ["&#x03C6;", "&#x03B0;"]
    ], // combined acute + ulmaut

    DotAbove: [
        ["&#x0063;", "&#x010B;"],
        ["&#x0043;", "&#x010A;"],
        ["&#x0067;", "&#x0121;"],
        ["&#x0047;", "&#x0120;"],
        ["&#x007A;", "&#x017C;"],
        ["&#x005A;", "&#x017B;"],
        ["&#x0065;", "&#x0117;"],
        ["&#x0045;", "&#x0116;"],
        ["&#x006E;", "&#x1E45;"],
        ["&#x004E;", "&#x1E44;"],
        ["&#x006D;", "m&#x307;"],
        ["&#x004D;", "M&#x307;"],
        ["&#x0062;", "b&#x307;"],
        ["&#x0042;", "B&#x307;"]
    ],

    DoubleAcute: [
        ["&#x006F;", "&#x0151;"],
        ["&#x004F;", "&#x0150;"],
        ["&#x0075;", "&#x0171;"],
        ["&#x0055;", "&#x0170;"]
    ],

    Grave: [
        ["&#x0061;", "&#x00E0;"],
        ["&#x0065;", "&#x00E8;"],
        ["&#x0069;", "&#x00EC;"],
        ["&#x006F;", "&#x00F2;"],
        ["&#x0075;", "&#x00F9;"],
        ["&#x0041;", "&#x00C0;"],
        ["&#x0045;", "&#x00C8;"],
        ["&#x0049;", "&#x00CC;"],
        ["&#x004F;", "&#x00D2;"],
        ["&#x0055;", "&#x00D9;"],
        ["&#x0057;", "&#x1E80;"],
        ["&#x0077;", "&#x1E81;"],
        ["&#x0059;", "&#x1EF2;"],
        ["&#x0079;", "&#x1EF3;"],
        ["&#x006D;", "m&#x300;"],
        ["&#x004D;", "M&#x300;"],
        ["&#x006E;", "n&#x300;"],
        ["&#x004E;", "N&#x300;"]
    ],

    Ogonek: [
        ["&#x0069;", "&#x012F;"],
        ["&#x006F;", "&#x01EB;"],
        ["&#x0075;", "&#x0173;"],
        ["&#x0049;", "&#x012E;"],
        ["&#x004F;", "&#x01EA;"],
        ["&#x0055;", "&#x0172;"]
    ],

    RingAbove: [
        ["&#x0061;", "&#x00E5;"],
        ["&#x0041;", "&#x00C5;"],
        ["&#x0075;", "&#x016F;"],
        ["&#x0055;", "&#x016E;"]
    ],

    Tilde: [
        ["&#x0061;", "&#x00E3;"],
        ["&#x006F;", "&#x00F5;"],
        ["&#x006E;", "&#x00F1;"],
        ["&#x0041;", "&#x00C3;"],
        ["&#x004F;", "&#x00D5;"],
        ["&#x0069;", "&#x0129;"],
        ["&#x0049;", "&#x0128;"],
        ["&#x0075;", "&#x0169;"],
        ["&#x0055;", "&#x0168;"],
        ["&#x004E;", "&#x00D1;"],
        ["&#x0065;", "&#x1EBD;"],
        ["&#x0045;", "&#x1EBC;"],
        ["&#x0079;", "&#x1EF9;"],
        ["&#x0059;", "&#x1EF8;"],
        ["&#x0067;", "g&#x303;"],
        ["&#x0047;", "G&#x303;"]
    ],

    Umlaut: [
        ["&#x0061;", "&#x00E4;"],
        ["&#x0065;", "&#x00EB;"],
        ["&#x0069;", "&#x00EF;"],
        ["&#x006F;", "&#x00F6;"],
        ["&#x0075;", "&#x00FC;"],
        ["&#x0079;", "&#x00FF;"],
        ["&#x0041;", "&#x00C4;"],
        ["&#x0045;", "&#x00CB;"],
        ["&#x0049;", "&#x00CF;"],
        ["&#x004F;", "&#x00D6;"],
        ["&#x0055;", "&#x00DC;"],
        ["&#x0059;", "&#x0178;"],
        ["&#x0399;", "&#x03AA;"],
        ["&#x03A5;", "&#x03AB;"],
        ["&#x03B9;", "&#x03CA;"],
        ["&#x03C5;", "&#x03CB;"]
    ],

    Pad_numlk: ["nlk", "/", "*", "-",
        "7", "8", "9", "+",
        "4", "5", "6",
        "1", "2", "3", "&crarr;", // Enter
        "0", "."
    ],
    Pad_normal: ["nlk", "/", "*", "-",
        "Home", "&uparrow;", "PgUp", "+",
        "&leftarrow;", "&nbsp", "&rightarrow;",
        "End", "&downarrow;", "PgDn", "&crarr;", // Enter
        "Ins", "Del"
    ],
    PadLayout: ["pad_numlock", "pad_divide", "pad_multiply", "pad_substract",
        "pad_7", "pad_8", "pad_9", "pad_add",
        "pad_4", "pad_5", "pad_6",
        "pad_1", "pad_2", "pad_3", "pad_enter",
        "pad_0", "pad_decimal"
    ],
    KeyLayout: [
        // "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", // 0-12
        // "0", "-", "=",
        // "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", // 13-25
        // "[", "]", "\\",
        // "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", // 26-37
        // "'", "none",
        // "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"  // 38-47
        "grave", "1", "2", "3", "4", "5", "6", "7", "8", "9", // 0-12
        "0", "minus", "equal",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", // 13-25
        "braceleft", "braceright", "none",
        "a", "s", "d", "f", "g", "h", "j", "k", "l", "semicolon", // 26-37
        "quoteright", "backslash",
        "F21", "z", "x", "c", "v", "b", "n", "m", "comma", "period", "slash" // 38-48
    ],
    FnLayout: ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "PrtSc", "Insert", "Del", "Home", "End", "PgUp", "PgDn"],
    SysLayout: [
        ["Psc", "___printscreen"],
        ["Slk", "___scrolllock"],
        ["Pau", "___pause"],
        ["Ins", "___insert"],
        ["Home", "___home"],
        ["PgUp", "___pageup"], // &#x21A5;
        ["Del", "___delete"],
        ["End", "___end"],
        ["PgDn", "___pagedown"]
    ] // &#x21A7;
};