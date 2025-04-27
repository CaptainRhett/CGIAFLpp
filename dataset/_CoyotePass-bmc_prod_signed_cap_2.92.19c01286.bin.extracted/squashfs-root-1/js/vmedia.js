"use strict";

var lang;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
	"use strict";
    document.getElementById("caption").textContent = lang.LANG_VMEDIA_CAPTION;
    document.getElementById("desc").textContent = lang.LANG_VMEDIA_DESC;
    document.getElementById("floppy_img").textContent = lang.LANG_VMEDIA_FLOPPY_IMG;
    document.getElementById("floppy_desc").textContent = lang.LANG_VMEDIA_FLOPPY_IMG_DESC;
    document.getElementById("web_iso").textContent = lang.LANG_VMEDIA_WEB_ISO;
    document.getElementById("web_iso_desc").textContent = lang.LANG_VMEDIA_WEB_ISO_DESC;
}
