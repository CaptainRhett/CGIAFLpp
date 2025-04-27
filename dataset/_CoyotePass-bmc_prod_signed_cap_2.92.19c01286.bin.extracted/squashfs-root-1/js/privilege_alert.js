"use strict";

var lang;
window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
	"use strict";
    document.getElementById("alert_info_p").textContent = lang.LANG_STR_USER_PRIVILEGE;
}
