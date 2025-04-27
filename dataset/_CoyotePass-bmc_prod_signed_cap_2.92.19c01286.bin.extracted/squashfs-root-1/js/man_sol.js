"use strict";
var lang;
var solBtnObj;
//var CONFPAGE="../cgi/url_redirect.cgi?url_name=remote";
window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src =  "../help/" + lang_setting + "/launch_sol_hlp.html";
    solBtnObj = document.getElementById("solbtn");
    solBtnObj.value = lang.LANG_SOL_LAUNCH;
    solBtnObj.disabled=true;
    document.getElementById("caption_div").textContent =  lang.LANG_SOL_CAPTION;
    CheckUserPrivilege(PrivilegeCallBack);

}
function PrivilegeCallBack(Privilege)
{
    "use strict";
    if (Privilege == '04')
    {
        solBtnObj.disabled=false;
        GetJNLPRequest(solBtnObj, 1);
    }
    else
    {
        location.href = SubMainPage;
        solBtnObj.disabled=true;
    }
}
