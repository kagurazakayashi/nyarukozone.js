//nyarukozone.js
//基礎核心

//可設定
var nyarukozone_speed = 30;
var nyarukozone_debug = true;
var nyarukozone_isplay = true;
var nyarukozone_cur = {};

//不可設定
var nyarukozone_frametotal = 0;
var nyarukozone_secondframe = 0;
var nyarukozone_oldframe = 0;
var nyarukozone_fps = (1000 / nyarukozone_speed).toFixed(2);
var nyarukozone_div = null;
var nyarukozone_logdiv = null;
var nyarukozone_debugdiv = null;
var nyarukozone_mousemlocation_x = 0;
var nyarukozone_mousemlocation_y = 0;
var nyarukozone_mouseclocation_x = 0;
var nyarukozone_mouseclocation_y = 0;
var nyarukozone_keyboard = new Array();
var nyarukozone_click_delegate = [];
var nyarukozone_rolespeed_ani = 10;
var nyarukozone_selfmovespeedx = 3;
var nyarukozone_pubdir = "";
var nyarukozone_nowcur = 0; //0yes 1no 2busy
var nyarukozone_appinfo = [];

//初期化核心程式
function nyarukozone_init() {
    nyarukozone_div = $('#nyarukozone');
    nyarukozone_logdiv = $("#nyarukozone_log");
    if (nyarukozone_debug) {
        nyarukozone_debugdiv = $("#nyarukozone_debug");
    }
    nyarukozone_div.mousemove(function(e) {
        nyarukozone_mousemlocation_x = e.clientX - parseInt(nyarukozone_div.css("left"));
        nyarukozone_mousemlocation_y = e.clientY - parseInt(nyarukozone_div.css("top"));
        //模組
        nyarukozone_rolecol_mousemove();
    });
    nyarukozone_div.click(function() {
        nyarukozone_mouseclocation_x = event.clientX - parseInt(nyarukozone_div.css("left"));
        nyarukozone_mouseclocation_y = event.clientY - parseInt(nyarukozone_div.css("top"));
        //模組
        nyarukozone_rolecol_click();
    });
    $(document).keydown(function(event){
        var ecode = event.keyCode;
        var dcode = true;
        for (i in nyarukozone_keyboard) {
            if (nyarukozone_keyboard[i] == ecode) {
                dcode = false;
                break;
            }
        }
        if (dcode) {
            nyarukozone_keyboard[nyarukozone_keyboard.length] = ecode;
        }
    });
    $(document).keyup(function(event){
        for(var i = nyarukozone_keyboard.length - 1;i >= 0;i--){
            if (nyarukozone_keyboard[i] == event.keyCode) {
                nyarukozone_keyboard.splice(i,1);
                break;
            }
        }
    });
    window.setInterval(nyarukozone_frameupdate,nyarukozone_speed);
    window.setInterval(nyarukozone_secondupdate,1000);
}
//每秒更新發生器
function nyarukozone_secondupdate() {
    if (!nyarukozone_isplay) {
        return;
    }
    if (nyarukozone_debug) {
        nyarukozone_secondframe = nyarukozone_frametotal - nyarukozone_oldframe;
        nyarukozone_oldframe = nyarukozone_frametotal;
    }
}
//每幀更新發生器
function nyarukozone_frameupdate() {
    if (!nyarukozone_isplay) {
        return;
    }
    if (nyarukozone_debug) {
        nyarukozone_framedebug();
    }
    nyarukozone_frameupdate_role();
}
//顯示調試訊息
function nyarukozone_framedebug() {
    var s_frametotal = nyarukozone_frametotal++;
    var s_spirit = nyarukozone_div.children().length;
    var s_width = nyarukozone_div.width();
    var s_height = nyarukozone_div.height();
    var s_key = new Array(); //nyarukozone_keyboard.join("+");
    for (i in nyarukozone_keyboard) {
        var nowkey = nyarukozone_keyboard[i];
        var nowkeyid = "("+nowkey+")";
        if (nowkey >= 49 && nowkey <= 90) {
            s_key[i] = String.fromCharCode(nowkey)+nowkeyid;
        } else {
            s_key[i] = nowkeyid;
        }
    }
    var s_key2 = s_key.join(" + ");
    var s_mouse = nyarukozone_mousemlocation_x+" x "+nyarukozone_mousemlocation_y;
    if (nyarukozone_mousemlocation_x < 0 || nyarukozone_mousemlocation_x > s_width || nyarukozone_mouseclocation_y < 0 || nyarukozone_mouseclocation_y > s_height) {
        s_mouse = "(界外)";
    }
    nyarukozone_debugdiv.html("　Nyarukozone ｜帧数："+s_frametotal+" ｜帧频："+nyarukozone_secondframe+" / "+nyarukozone_fps+" fps ｜对象数量："+s_spirit+" ｜场景尺寸："+s_width+" x "+s_height+" ｜鼠标位置："+s_mouse+" ｜点击位置："+nyarukozone_mouseclocation_x+" x "+nyarukozone_mouseclocation_y+" ｜当前按键："+s_key2);
}
//暫停程式
function nyarukozone_pause() {
    nyarukozone_isplay = false;
    return "已暂停。";
}
//繼續程式
function nyarukozone_play() {
    nyarukozone_isplay = true;
    return "继续运行。";
}
//获取舞台尺寸
function nyarukozone_size() {
    return [nyarukozone_div.width(),nyarukozone_div.height()];
}
//调试输出
function YSLog(log) {
    if (nyarukozone_consolelog && nyarukozone_logdiv) {
        var nowDate = new Date();
        var datestr = nowDate.toLocaleString();
        nyarukozone_logdiv.append("["+datestr+"] "+log+"<br>");
    }
}
//添加元素
function addSpirit() {
    
}
//檢查數組是否包含某元素
function nyarukozone_contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}
//装入公共信息
function nyarukozone_loadGame(url) {
    nyarukozone_pubdir = url+"/";
    var jsonurl = nyarukozone_pubdir + "index.json";
    YSLog("Loading: "+jsonurl);
    try {
        $.getJSON(jsonurl,function(responseTxt,statusTxt,xhr,data){
            if(statusTxt == "error") {
                YSLog("E: Download configuration failed. "+xhr.status+": "+xhr.statusText);
            }
            if(statusTxt == "success") {
                var json = xhr.responseJSON;
                var info = json["info"];
                var option = json["option"];
                if (info["filevar"] != 1) {
                    YSLog("E: rolefilevar");
                    return
                }
                nyarukozone_appinfo = info;
                nyarukozone_speed = option["fps"];
                nyarukozone_rolespeed_ani = option["roleanispeed"];
                nyarukozone_selfmovespeedx = option["selfspeedx"];
                nyarukozone_cur = json["cur"];
                var curyes = nyarukozone_cur["yes"];
                if (curyes == "") {
                    nyarukozone_div.css("cursor","Default,auto");
                } else {
                    nyarukozone_div.css("cursor","url('"+nyarukozone_pubdir+curyes+"'),auto");
                }
                loadjscssfile(nyarukozone_pubdir+nyarukozone_cur["go"]["css"],"css");
            }
        });
    } catch (ex) {
        YSLog("E: Data loading failed: "+ex);
    }
}