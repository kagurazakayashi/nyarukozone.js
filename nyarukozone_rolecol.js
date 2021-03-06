//nyarukozone.js
//角色控制器
var nyarukozone_roles = [];
var nyarukozone_rolesid = [];
var nyarukozone_roledivs = [];
var zi = 0;
// var nyarukozone_rolespeed_ani = 10; ->core
// var nyarukozone_selfmovespeedx = 3;
var nyarukozone_rolespeed_anii = 0;
var nyarukozone_automove = [];
// var nyarukozone_selfmovespeed = 1;
// var nyarukozone_selfmovespeedi = 0;

//清除當前場景所有角色
function nyarukozone_resetrole() {

}

//裝入一個角色
function nyarukozone_loadRole(url,uid) {
    var jsonurl = url + "/index.json";
    YSLog("Loading: "+jsonurl);
    try {
        $.getJSON(jsonurl,function(responseTxt,statusTxt,xhr,data){
            if(statusTxt == "error") {
                YSLog("E: Download configuration failed. "+xhr.status+": "+xhr.statusText);
            }
            if(statusTxt == "success") {
                var json = xhr.responseJSON;
                var info = json["info"];
                if (info["filevar"] != 1) {
                    YSLog("E: rolefilevar");
                    return
                }
                var css = url + "/" + info["css"];
                nyarukozone_addRole(json,css,info["id"],uid);
                YSLog("Load Role Config: " + info["name"]);
            }
        });
    } catch (ex) {
        YSLog("E: Data loading failed: "+ex);
    }
}

//添加角色到場景
function nyarukozone_addRole(json,css,id,uid) {
    if (nyarukozone_roles[uid]) {
        YSLog("E: Role uid");
    }
    nyarukozone_roles[uid] = json;
    if (!nyarukozone_contains(nyarukozone_rolesid,id)) {
        nyarukozone_rolesid[nyarukozone_rolesid.length] = id;
        loadjscssfile(css,"css");
    }
    var classname = 'nyarukozone_'+json["info"]["id"]+"_"+json["stand@1x"]["a"][0];
    var z = 300000 + zi;
    zi+=10;
    var idname = "sprite"+z;
    var framestr = "-1000_-1000";
    if (nyarukozone_mapinfo) {
        var door = nyarukozone_mapinfo["door"];
        var doorDefault = door[door["default"]];
        framestr = doorDefault.join("_");
    }
    var rolediv = '<div class="'+classname+' sprite" id="'+idname+'" ani="'+uid+'_'+json["info"]["id"]+'_stand_s_0" frame="'+framestr+'"></div>';
    nyarukozone_div.append(rolediv);
    YSLog("Loading: "+classname);
    var nowclass = $("."+classname);
    nowclass.css({"z-index":z,"top":"0px","left":"0px","position":"absolute"});
    nyarukozone_roledivs[nyarukozone_roledivs.length] = idname;
}

//角色每幀更新。
function nyarukozone_frameupdate_role() {
    nyarukozone_selfroledir();
    var cgoto = null;
    if ($("#nyarukozone_cgoto").length > 0) {
        cgoto = $("#nyarukozone_cgoto");
        cframes = cgoto.attr("cframe").split('_');
        var cx = parseInt(nyarukozone_mapbackgrounds[0].css("left")) - parseInt(cframes[0]);
        var cy = parseInt(nyarukozone_mapbackgrounds[0].css("top")) - parseInt(cframes[1]);
        cgoto.css({"top":cy,"left":cx});
    }
    //cframe
    //根據設定的延遲做動畫
    nyarukozone_rolespeed_anii++;
    if (nyarukozone_rolespeed_anii < nyarukozone_rolespeed_ani) {
        return;
    }
    nyarukozone_rolespeed_anii = 0;
    for (var i in nyarukozone_roledivs) {
        nyarukozone_newroleclass("#"+nyarukozone_roledivs[i],"");
    }
    
    if (cgoto) {
        var cur = nyarukozone_cur["go"]["cur"];
        var curanii = parseInt(cgoto.attr("ani"));
        if (curanii >= cur.length) {
            cgoto.remove();
        } else {
            var cclassname = "nyarukozone_" + nyarukozone_appinfo["id"] + "_" + cur[curanii] + " nyarukozone_" + nyarukozone_appinfo["id"];
            curanii++;
            cgoto.attr({"class":cclassname,"ani":curanii});
        }
    }
}

//顯示角色到場景
function nyarukozone_newroleclass(divid,nowroledir) {
    var nowdiv = $(divid);
    if (!nowdiv.attr("ani")) {
        YSLog("E: No Rolediv: "+divid);
        nyarukozone_pause();
    }
    var nowstat = nowdiv.attr("ani").split('_');
    var nowuid = nowstat[0];
    var nowid = nowstat[1];
    var nowact = nowstat[2];
    var nowdir = nowstat[3];
    if (nowroledir.length > 2) {
        nowact = "stand";
    } else if (nowroledir != "") {
        nowdir = nowroledir;
        nowact = "walk";
    }
    var newani = parseInt(nowstat[4]) + 1;
    if (newani >= nyarukozone_roles[nowuid][nowact+"@1x"][nowdir].length) {
        newani = 0;
    }
    if (nowroledir == "") {
        var newclass = 'nyarukozone_'+nowid+"_"+nyarukozone_roles[nowuid][nowact+"@1x"][nowdir][newani]+' nyarukozone_'+nowid;
    }
    var newani = nowuid+"_"+nowid+"_"+nowact+"_"+nowdir+"_"+newani;
    var frame = nowdiv.attr("frame").split('_'); //[0,0];
    nowdiv.attr({"ani":newani,"class":newclass});
    var newframe = nyarukozone_zerotocenter(frame[0],frame[1],nowdiv.width(),nowdiv.height());
    //move
    var eframe = nyarukozone_mapmove(newframe[0],newframe[1]);
    nowdiv.css({"left":eframe[0],"top":eframe[1]});
}

//移動位置
function nyarukozone_rolemove(nowdiv,key) {
    // nyarukozone_selfmovespeedi++;
    // if (nyarukozone_selfmovespeedi < nyarukozone_selfmovespeed) {
    //     return;
    // }
    // nyarukozone_selfmovespeedi = 0;
    // var x = nowdiv.css("left");
    // var y = nowdiv.css("top");
    // x = parseFloat(x.substring(0,x.length-2))+1.0;
    // y = parseFloat(y.substring(0,y.length-2))+1.0;
    // nowdiv.css({"left":x,"top":y});
    if (nowdiv.attr("frame") == undefined) {
        YSLog("E: No nowdiv.");
    }
    var frame = nowdiv.attr("frame").split('_');
    var x = parseFloat(frame[0]);
    var y = parseFloat(frame[1]);
    switch (key) {
        case "w":
            y-=nyarukozone_selfmovespeedx;
            break;
        case "s":
            y+=nyarukozone_selfmovespeedx;
            break;
        case "a":
            x-=nyarukozone_selfmovespeedx;
            break;
        case "d":
            x+=nyarukozone_selfmovespeedx;
            break;
        case "wa":
            y-=nyarukozone_selfmovespeedx;
            x-=nyarukozone_selfmovespeedx;
            break;
        case "wd":
            y-=nyarukozone_selfmovespeedx;
            x+=nyarukozone_selfmovespeedx;
            break;
        case "sa":
            y+=nyarukozone_selfmovespeedx;
            x-=nyarukozone_selfmovespeedx;
            break;
        case "sd":
            y+=nyarukozone_selfmovespeedx;
            x+=nyarukozone_selfmovespeedx;
            break;
        default:
            break;
    }
    if (nyarukozone_canmoveto(x,y)) {
        nowdiv.attr({"frame":x+"_"+y});
    }
}

//獲取中心點
function nyarukozone_zerotocenter(x,y,w,h) {
    var x = parseFloat(x);
    var y = parseFloat(y);
    var w = parseFloat(w);
    var h = parseFloat(h);
    var nx = x - (w * 0.5);
    var ny = y - (h * 0.5);
    return [nx,ny];
}

//玩家角色響應方向鍵
function nyarukozone_selfroledir() {
    var selfdiv = $("#sprite300000");
    var nowkeys = nyarukozone_keyboard;
    var nowroledir = "";
    if (nowkeys.length < 1 || nowkeys.length > 2) {
        nowroledir = "null";
    }
    for (i in nowkeys) {
        var nowkey = nowkeys[i];
        if (nowkey == 87 || nowkey == 38) {
            nowroledir += "w";
            nyarukozone_automove.splice(0,nyarukozone_automove.length);
        } else if (nowkey == 83 || nowkey == 40) {
            nowroledir += "s";
            nyarukozone_automove.splice(0,nyarukozone_automove.length);
        } else if (nowkey == 65 || nowkey == 37) {
            nowroledir += "a";
            nyarukozone_automove.splice(0,nyarukozone_automove.length);
        } else if (nowkey == 68 || nowkey == 39) {
            nowroledir += "d";
            nyarukozone_automove.splice(0,nyarukozone_automove.length);
        } else {
            nowroledir = "null";
        }
    }
    if (nowroledir == "ws" || nowroledir == "ad" || nowroledir == "sw" || nowroledir == "da") {
        nowroledir = "null";
    }
    if (nyarukozone_automove.length > 0) {
        nowroledir = nyarukozone_automove[0];
        nyarukozone_automove.splice(0,1);
    }
    nowroledir = nyarukozone_keysort(nowroledir);
    nyarukozone_rolemove(selfdiv,nowroledir);
    nyarukozone_newroleclass(selfdiv,nowroledir);
}
//修正方向鍵值
function nyarukozone_keysort(key) {
    if (key == "aw") {
        return "wa";
    } else if (key == "dw") {
        return "wd";
    } else if (key == "as") {
        return "sa";
    } else if (key == "ds") {
        return "sd";
    }
    return key;
}
//鼠標移過地圖
function nyarukozone_rolecol_mousemove() {
    var selfdiv = $("#sprite300000");
    if (nyarukozone_mapbackgrounds.length < 1) return;
    var mx = 0 - parseInt(nyarukozone_mapbackgrounds[0].css("left")) + nyarukozone_mousemlocation_x;
    var my = 0 - parseInt(nyarukozone_mapbackgrounds[0].css("top")) + nyarukozone_mousemlocation_y - parseInt(selfdiv.height()*0.5);
    var curyes = "";
    if (nyarukozone_canmoveto(mx,my)) {
        if (nyarukozone_nowcur == 0) return;
        nyarukozone_nowcur = 0;
        curyes = nyarukozone_cur["yes"];
    } else {
        if (nyarukozone_nowcur == 1) return;
        nyarukozone_nowcur = 1;
        curyes = nyarukozone_cur["no"];
    }
    if (curyes == "") {
        nyarukozone_div.css("cursor","Default,auto");
    } else {
        nyarukozone_div.css("cursor","url('"+nyarukozone_pubdir+curyes+"'),auto");
    }
}
//點擊地圖移動角色
function nyarukozone_rolecol_click() {
    var selfdiv = $("#sprite300000");
    nyarukozone_automove.splice(0,nyarukozone_automove.length);
    var mx = 0 - parseInt(nyarukozone_mapbackgrounds[0].css("left")) + nyarukozone_mouseclocation_x;
    var my = 0 - parseInt(nyarukozone_mapbackgrounds[0].css("top")) + nyarukozone_mouseclocation_y - parseInt(selfdiv.height()*0.5);
    if (!nyarukozone_canmoveto(mx,my)) {
        return;
    }
    var roleframe = selfdiv.attr("frame").split('_');
    var rx = parseInt(roleframe[0]);
    var ry = parseInt(roleframe[1]);
    if ($("#nyarukozone_cgoto")) {
        $("#nyarukozone_cgoto").remove();
    }
    var gotocursize = parseInt(nyarukozone_cur["go"]["size"]);
    var cx = parseInt(nyarukozone_mapbackgrounds[0].css("left")) - nyarukozone_mouseclocation_x+gotocursize/2;
    var cy = parseInt(nyarukozone_mapbackgrounds[0].css("top")) - nyarukozone_mouseclocation_y+gotocursize/2;
    nyarukozone_div.append('<div id="nyarukozone_cgoto" style="top:'+nyarukozone_mouseclocation_y+'px;left:'+nyarukozone_mouseclocation_x+'px;width:'+gotocursize+'px;height:'+gotocursize+'px;z-index:719999;position:absolute;" ani="0" cframe="'+cx+'_'+cy+'"></div>');
    var i = 0;
    //設定移動補償
    var osize = nyarukozone_selfmovespeedx;
    var ospeed = nyarukozone_selfmovespeedx;
    while (i < 1000) {
        var nowmove = 2;
        var mv = "";
        if (ry < my && (my - ry) > osize) {
            ry+=ospeed;
            if (!nyarukozone_canmoveto(rx,ry)) {
                ry-=ospeed;
            } else {
                mv = "s"
            }
        } else if (ry > my && (ry - my) > osize) {
            ry-=ospeed;
            if (!nyarukozone_canmoveto(rx,ry)) {
                ry+=ospeed;
            } else {
                mv = "w"
            }
        } else {
            nowmove--;
        }
        if (rx < mx && (mx - rx) > osize) {
            rx+=ospeed;
            if (!nyarukozone_canmoveto(rx,ry)) {
                rx-=ospeed;
            } else {
                mv += "d"
            }
        } else if (rx > mx && (rx - mx) > osize) {
            rx-=ospeed;
            if (!nyarukozone_canmoveto(rx,ry)) {
                rx+=ospeed;
            } else {
                mv += "a"
            }
        } else {
            nowmove--;
        }
        if (mv != "") {
            nyarukozone_automove[nyarukozone_automove.length] = mv;
        }
        if (nowmove == 0) {
            break;
        }
        i++;
    }
    //console.log(nyarukozone_automove);
}

function nyarukozone_canmoveto(x,y) {
    if (nyarukozone_collider[y] != undefined && nyarukozone_collider[y][x] != undefined && nyarukozone_collider[y][x] == true) {
        return true;
    }
    return false;
}