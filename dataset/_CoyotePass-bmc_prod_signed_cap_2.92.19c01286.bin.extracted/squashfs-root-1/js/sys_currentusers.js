"use strict";
/* SYSTEM -- CurrentUser Information page */

var lang;
var dataTabObj;
var user_list;

window.addEventListener('load', PageInit);
if (parent.lang) { lang = parent.lang; }

function PageInit()
{
    "use strict";
    top.frames.topmenu.document.getElementById("frame_help").src = "../help/" + lang_setting + "/sys_current_users_hlp.html";
    user_list = document.getElementById("user_list");

    document.getElementById("user_caption_div").textContent = lang.LANG_SYS_CURRENT_USER_CAPTION;

    initUsrTab();

    //check user Privilege
    CheckUserPrivilege(PrivilegeCallBack);
}
function initUsrTab()
{
    "use strict";
    var myColumns = [["User Name", "14%", "center"],
                     ["Type", "14%", "center"],
                     ["KVM Number", "12%", "center"],
                     ["Operations", "12%", "center"],
                     ["vMedia Usable", "13%", "center"],
                     ["IP Address", "35%", "center"]];
        //replace table header content with string table
        myColumns[0][0] = lang.LANG_SYS_CURRENT_USER_COLUMN_TITLE0;
        myColumns[1][0] = lang.LANG_SYS_CURRENT_USER_COLUMN_TITLE1;
        myColumns[2][0] = lang.LANG_SYS_CURRENT_USER_COLUMN_TITLE2;
        myColumns[3][0] = lang.LANG_SYS_CURRENT_USER_COLUMN_TITLE3;
        myColumns[4][0] = lang.LANG_SYS_CURRENT_USER_COLUMN_TITLE4;
        myColumns[5][0] = lang.LANG_SYS_CURRENT_USER_COLUMN_TITLE5;
        dataTabObj = GetTableElement();
        dataTabObj.setColumns(myColumns);
        dataTabObj.init('dataTabObj', user_list, 'auto', {tableId: "user_list_table", noSort: true});
}

function PrivilegeCallBack(privilege)
{
    "use strict";
    if (privilege == '04') {
        getCurUserInfo();
    } else {
        location.href = SubMainPage;
        return;
    }
}

function getCurUserInfo()
{
    "use strict";
    Loading(true);
    var url = '/cgi/getwebuserstatus.cgi';
    var pars = 'time_stamp='+(new Date());
    var ajax_data= GeneGenericRequestXML();
    var myAjax = new Ajax.Request(url,
                                  {method: 'post',
                                   contentType: 'text/xml',
                                   xml_data: ajax_data,
                                   parameters:pars,
                                   timeout: g_CGIRequestTimeout,
                                   ontimeout: onCGIRequestTimeout,
                                   onComplete: getCurUserStatus});//reigister callback function
}

function getCurUserStatus(originalRequest)
{
    "use strict";
    Loading(false);
    if (originalRequest.readyState == 4 && originalRequest.status == 200){
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc=GetResponseXML(response);
        if(xmldoc == null){
            SessionTimeout();
                return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }

        var root = xmldoc.documentElement;
        var meIdentify = " (me)";
        var userData = [];
        var webUserInfo = root.getElementsByTagName("WEB_USER_INFO");
        if(webUserInfo.length) {
            var web = webUserInfo[0].getElementsByTagName('WEB');
            if(web.length) {
                var UserCount = web[0].getAttribute("TOTAL_NUMBER");
                for (var i = 1; i <= UserCount; i++) {
                    var webuser = webUserInfo[0].getElementsByTagName("WEB_USER" + i);
                    if(webuser.length) {
                        var name = webuser[0].getAttribute("USER_NAME");
                        if(webuser[0].getAttribute("ME")) {
                            name += meIdentify;
                        }
                        userData.push({'name': name,
                                       'type': webuser[0].getAttribute("TYPE"),
                                       'kvmCnt': webuser[0].getAttribute("KVM_Number"),
                                       'vmUse': webuser[0].getAttribute("vMedia_Usable"),
                                       'ip': webuser[0].getAttribute("IPADDR"),
                                       'webid' : i});
                    }
                }
            }
        }
        userData.sort(function(a, b) {
            return a.name.replace(meIdentify, "").localeCompare(b.name.replace(meIdentify, "")); // compare without meIdentify
        });

        var kvmData = [];
        var kvmUserInfo = root.getElementsByTagName("KVM_USER_INFO");
        if(kvmUserInfo.length) {
            var kvmuser = kvmUserInfo[0].getElementsByTagName('KVM');
            if(kvmuser.length) {
                var kvmCount = kvmuser[0].getAttribute("KVM_NUMBER");
                for (var i = 0; i < kvmCount; i++) {
                    var kvmsess = kvmUserInfo[0].getElementsByTagName("KVM_USER" + (i + 1));
                    if(kvmuser.length) {
                        kvmData.push({'name': kvmsess[0].getAttribute("USER_NAME"),
                                      'ip': kvmsess[0].getAttribute("USERIP"),
                                      'VMEnable': kvmsess[0].getAttribute("VMEnable") == "0" ? "No" : "Yes",
                                      'VideoOnly': kvmsess[0].getAttribute("VideoOnly"),
                                      'thread': kvmsess[0].getAttribute("SessThread"),
                                      'webid': kvmsess[0].getAttribute("WebID")});
                    }
                }
            }
        }

        var allData = [];
        var kvmThreads = [];
        var kvmTabs = [];
        var dataCnt = 1;
        userData.forEach(function(user) {
            var tmpData = [];
            var webCnt = dataCnt++;
            // handle kvm sessions belong to web session
            for(var i = 0; i < kvmData.length; i++){
                if(kvmData[i].webid == user.webid) {
                    kvmThreads.push(kvmData[i].thread);
                    var obj = {
                        'id': 'kvm_' + kvmData[i].thread,
                        'thread': kvmData[i].thread
                    };
                    kvmThreads.push(obj);
                    var logout = '<input type="image" id="' + obj.id + '" img src="/images/bin.png" class="killicon">'
                    var type = "KVM";
                    if(kvmData[i].VideoOnly == '1') {
                        type += " (Video Only)";
                    }
                    tmpData.push([parseInt(dataCnt++), "-", type, "1", logout, "-", user.ip]);
                }
            }
            var kvmCnt;
            if(user.kvmCnt != tmpData.length) {
                console.log("kvmCnt != kvmSession");
            }
            if(tmpData.length) {
                var tabid = 'tabid' + webCnt;
                var obj = {
                    'id': tabid,
                    'cnt': webCnt
                }
                kvmTabs.push(obj);
                kvmCnt = tmpData.length + ' <a href="#" id="'+ tabid +'">+</a>';
            } else {
                kvmCnt = tmpData.length;
            }
            allData.push([parseInt(webCnt), user.name, user.type, kvmCnt, '-', user.vmUse, user.ip]);
            if(tmpData.length)
                allData = allData.concat(tmpData);
        });
        // handle kvm sessions doesn't belong to web session
        for(var i = 0; i < kvmData.length; i++){
            if(kvmData[i].webid == -1) {
                var obj = {
                    'id': 'kvm_' + kvmData[i].thread,
                    'thread': kvmData[i].thread
                };
                kvmThreads.push(obj);
                var logout = '<input type="image" id="' + obj.id + '" img src="/images/bin.png" class="killicon">'
                var type = "KVM";
                if(kvmData[i].VideoOnly == '1') {
                        type += " (Video Only)";
                    }
                allData.push([parseInt(dataCnt++), kvmData[i].name, type, '1', logout, kvmData[i].VMEnable, kvmData[i].ip]);
            }
        }
        dataTabObj.show(allData);
        for (var i = 0; i < kvmThreads.length; i++){
            var elem = document.getElementById(kvmThreads[i].id);
            if (elem) {
                elem.thread = kvmThreads[i].thread;
                elem.addEventListener('click', function() {
                    kvmlogout(this.thread);
                });
            }
        }
        for (var i = 0; i < kvmTabs.length; i++){
            var elem = document.getElementById(kvmTabs[i].id);
            if (elem) {
                elem.cnt = kvmTabs[i].cnt;
                elem.addEventListener('click', function() {
                    foldKVMTab(this.cnt, this.id);
                });
            }
        }
        initKVMTab(true); // true to hidden KVM
    }
    function isEllipsisActive(e) {
        console.log(e.offsetWidth, e.scrollWidth);
        return (e.offsetWidth < e.scrollWidth);
    }
    jQuery("#user_list_table tbody tr").each(function(i, v) {
        let td = jQuery(v).children("td")[0];
        if (td.textContent.length > 16) {
            td.setAttribute('title',td.textContent);
            td.textContent  = td.innerText.slice(0, 16) + '...';
        }
        if (isEllipsisActive(td))
            td.setAttribute('title',td.textContent);
    });
}

function initKVMTab(hidden)
{
    "use strict";
    var var_testTable = document.getElementById("user_list_table");
    var rows = var_testTable.querySelectorAll('tr');

    for(var i = 1; i < rows.length; i++) {
        var cells = rows[i].querySelectorAll('td');
        if(cells[1].innerText.trim().substr(0, 3) == 'KVM' && cells[0].innerText.trim() == '-') {
            if(hidden) {
                rows[i].style.display = "none";
            } else {
                rows[i].style.display = "";
            }
        }
    }
}

function foldKVMTab(row, id)
{
    "use strict";
    var var_testTable = document.getElementById("user_list_table");
    var rows = var_testTable.querySelectorAll('tr');
    var tabshow = document.getElementById(id);
    var hidden;
    if(/-/g.test(tabshow.innerText)) { // test if word is '-'
        tabshow.innerText = tabshow.innerText.replace('-', '+'); // replace '-' with '+'
        hidden = true;
    } else {
        tabshow.innerText = tabshow.innerText.replace('+', '-'); // replace '+' with '-'
        hidden = false;
    }

    for(var i=row+1; i<rows.length; i++) {
        var cells = rows[i].querySelectorAll('td');
        if(cells[1].innerText.trim().substr(0, 3) != 'KVM' || cells[0].innerText.trim() != '-') {
            break;
        }
        if(hidden) {
            rows[i].style.display = "none";
        } else {
            rows[i].style.display = "";
        }
    }
}

function setInputDisabled(disabled)
{
    "use strict";
    var inputs = document.getElementsByTagName("INPUT");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = disabled;
    }
}

function kvmlogout(thread)
{
    "use strict";
    // console.log(thread);
    setInputDisabled(true);
    Loading(true);
    var ajax_url = '/cgi/setwebuserstatus.cgi';
    var ajax_param = '';
    var ajax_data = function(){
        var result = "";
        result += "<?xml version=\"1.0\"?>\n";
        result += "<IPMI>\n";
        result += "    <TOKEN>" + top.frames.topmenu.CSRF_TOKEN + "</TOKEN>\n";
        result += "    <PRIV>" + top.frames.topmenu.PRIV_ID + "</PRIV>\n";
        result += "    <KVMID>" + thread + "</KVMID>\n";
        result += "</IPMI>\n";
        return result;
    }();
    var ajax_req = new Ajax.Request(ajax_url,
        {
            method: 'POST',
            contentType: "text/xml",
            xml_data: ajax_data,
            parameters: ajax_param,
            timeout: g_CGIRequestTimeout,
            ontimeout: onCGIRequestTimeout,
            onComplete: handleKvmlogout
        });
}

function handleKvmlogout(originalRequest)
{
    "use strict";
    if(originalRequest.readyState == 4 && originalRequest.status == 200) {
        var response = originalRequest.responseText.replace(/^\s+|\s+$/g,"");
        var xmldoc = GetResponseXML(response);
        if (xmldoc == null) {
            SessionTimeout();
            return;
        }
        //check session & privilege.
        if (CheckInvalidResult(xmldoc) < 0) {
            return;
        }
        var result = GetXMLNodeValue(xmldoc, "RESULT");
        if (result == "FAIL") {
            alert(lang.LANG_MODNMPOLICIES_UNFAIL);
            Loading(false);
            setInputDisabled(false);
        } else if (result == "OK") {
            setTimeout(function(){
                alert(lang.LANG_MODNMPOLICIES_SUCCES, {title: lang.LANG_GENERAL_SUCCESS, onClose: function(){
                    location.reload();
                    Loading(false);
                    setInputDisabled(false);
                }});
            }, 3000);
        } else {
            Loading(false);
            setInputDisabled(false);
        }
    }
}
