// nyarukozone.js

//可设定
var nyarukozone_speed = 30;
var nyarukozone_debug = true;
var nyarukozone_isplay = true;

//不可设定
var nyarukozone_frametotal = 0;
var nyarukozone_secondframe = 0;
var nyarukozone_oldframe = 0;
var nyarukozone_fps = (1000 / nyarukozone_speed).toFixed(2);
var nyarukozone_div = null;
var nyarukozone_debugdiv = null;
var nyarukozone_mousemlocation_x = 0;
var nyarukozone_mousemlocation_y = 0;
var nyarukozone_mouseclocation_x = 0;
var nyarukozone_mouseclocation_y = 0;
var nyarukozone_keyboard = new Array();

function nyarukozone_init() {
    nyarukozone_div = $('#nyarukozone');
    if (nyarukozone_debug) {
        nyarukozone_debugdiv = $("#nyarukozone_debug");
    }
    nyarukozone_div.mousemove(function(e) {  
        nyarukozone_mousemlocation_x = e.offsetX;
        nyarukozone_mousemlocation_y = e.offsetY;
    });
    nyarukozone_div.click(function() {
        nyarukozone_mouseclocation_x = event.offsetX;
        nyarukozone_mouseclocation_y = event.offsetY;
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
function nyarukozone_secondupdate() {
    if (!nyarukozone_isplay) {
        return;
    }
    if (nyarukozone_debug) {
        nyarukozone_secondframe = nyarukozone_frametotal - nyarukozone_oldframe;
        nyarukozone_oldframe = nyarukozone_frametotal;
    }
}
function nyarukozone_frameupdate() {
    if (!nyarukozone_isplay) {
        return;
    }
    if (nyarukozone_debug) {
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
        nyarukozone_debugdiv.html("<code>　Nyarukozone ｜帧数："+s_frametotal+" ｜帧频："+nyarukozone_secondframe+" / "+nyarukozone_fps+" fps ｜对象数量："+s_spirit+" ｜场景尺寸："+s_width+" x "+s_height+" ｜鼠标位置："+s_mouse+" ｜点击位置："+nyarukozone_mouseclocation_x+" x "+nyarukozone_mouseclocation_y+" ｜当前按键："+s_key2+"</code>");
    }
}
function pause() {
    nyarukozone_isplay = false;
    return "已暂停。";
}
function play() {
    nyarukozone_isplay = true;
    return "继续运行。";
}