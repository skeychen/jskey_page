/**
 * 翻页控件类
 * @version 3
 * @datetime 2017-10-27 23:43
 * @author skey_chen
 * @copyright 2011-2017 &copy; skey_chen@163.com
 * @license LGPL
 */
var $jskey = $jskey || {};



$jskey.on = function($e, et, fn){
	$e.attachEvent ? 
		$e.attachEvent('on' + et, fn)
		:
		$e.addEventListener(et, fn, false);
	return $jskey;
};
$jskey.$ = function(id){
	return document.getElementById(id);
};
$jskey.$replace = function(str, t, u){
	str = str + "";
	var i = str.indexOf(t);
	var r = "";
	while(i != -1){
		r += str.substring(0, i) + u;// 已经匹配完的部分+替换后的字符串
		str = str.substring(i + t.length, str.length);// 未匹配的字符串内容
		i = str.indexOf(t);// 其余部分是否还包含原来的str
	}
	r = r + str;// 累加上剩下的字符串
	return r;
};







;!function(){"use strict";



document.write(
	"<style type='text/css'>" + 
		".jskey_page{font-size:0;clear:both;}" +
		".jskey_page *{display:inline-block;vertical-align:top;font-size:12px;color:#333333;width:auto;}" +
		".jskey_page a,.jskey_page span{height:26px;line-height:26px;border-radius:2px;}" +
		".jskey_page a{margin:0 3px 6px 3px;padding:0 10px;cursor:pointer;text-decoration:none;}" +
		".jskey_page .page{height:28px;line-height:28px;margin:0 3px 6px 3px;padding:0 10px;width:auto;}" +
		".jskey_page input, .jskey_page button, .jskey_page select{border:1px solid #ccc;background-color:#ffffff;}" +
		".jskey_page input {height:24px;line-height:24px;margin:0 5px;padding:0 5px;width:28px;}" +
		".jskey_page button{height:26px;line-height:26px;margin:0 0px;padding:0 5px;cursor:pointer;}" +
		".jskey_page select{height:26px;line-height:26px;margin:0 5px;padding:0;width:50px;}" +
		".jskey_page_skin_default a    {border:1px solid #ccc;background-color:#ffffff;color:#333333;}" +
		".jskey_page_skin_default span {color:#333333;}" +
		".jskey_page_skin_default .page{font-weight:700;color:#000000;background-color:#ffffff;}" + 
	"</style>"
);



var count = 0;



$jskey.Page=function(p){
	this.config = p || {};
	this.config.i = count++;
	this.arr = p.arr || [];// 多个翻页实体[{每一个的参数设置全部都可独立存在，但不能设置fn}]
	this.pageArray = [];
	var _E = this;
	var _C = this.config;
	this.render();
	for(var j=0; j<this.arr.length; j++){
		var m = this.arr[j];
		m.E = _E;
		m.page = _C.page;
		m.pagesize = _C.pagesize;
		m.size = _C.size;
		m.fn = function(e){
			e.E.config.page = e.page;
			e.E.config.pagesize = e.pagesize;
			e.E.config.size = e.size;
			e.E.go(e.page);
			e.E.other();
		};
		this.pageArray[j] = new $jskey.Page(m);
	}
};
$jskey.Page.prototype.pageview_ = function(C, v, txt, btn){
	var s = "",my=/^#/.test(C.skin),x=['#ffffff'];
	if(my){x=C.skin.split(",");}
	if(x.length<2){x[1]='#000000';}
	if(C.page === v && !btn){
		s = '<span class="page" '+ (my ? 'style="background-color:'+ x[0] + ';color:' + x[1] + ';"' : '') +'>'+ txt +'</span>';
	} else {
		s = '<a data-jskeypage="'+ v +'">'+ txt +'</a>';
	}
	return s;
};
$jskey.Page.prototype.sizeArray_ = function(){return [5, 10, 15, 20, 25, 30, 50, 100];};
$jskey.Page.prototype.tempArray_ = [""
	,"{prev}{pageview}{next}"
	,"{prev}{pagelist}{next}<span>&nbsp;\u5171{totalpage}\u9875&nbsp;\u5230\u7B2C</span>{skip}<span>\u9875</span>{go}"
	,"<span>\u5171{size}\u6761&nbsp;\u7B2C{page}/{totalpage}\u9875&nbsp;</span>{first}{prev}{next}{last}<span>&nbsp;\u8F6C\u5230\u7B2C</span>{skip}<span>\u9875</span>{go}<span>&nbsp;\u6BCF\u9875</span>{pagesize}<span>\u6761</span>"
	,"{prev}{next}"
];
$jskey.Page.prototype.view_ = function(){
	var E = this, C = E.config, V = {}, H = "", R = $jskey.$replace;

	C.hide = (C.hide||false) == true;
	C.page = (C.page|0) || 1;
	C.pagesize = C.pagesize|0;// 每页数量
	C.skin = C.skin||'';
	if(C.pagesize <= 0){C.pagesize = 10;}
	C.size = (C.total||C.count||C.size||-1)|0;
	C.total = C.count = null;
	if(C.size == -1){
		C.totalpage = (C.pages||C.totalpage||0)|0;
		C.pages = null;
	}
	else{
		C.totalpage = Math.ceil(C.size/C.pagesize);
	}
	if(C.totalpage <= 0){C.totalpage = 1;}
	if(C.page > C.totalpage){C.page = C.totalpage};
	C.pagelist = 'pagelist' in C ? (C.pagelist|0) : 5;
	
	V.txt = ['GO','\u9996\u9875','\u4e0a\u9875','\u4e0b\u9875','\u5C3E\u9875'];
	V.tmp = ['go','first','prev','next','last'];
	for(var i = 0; i < V.txt.length; i++){
		V.txt[i] = V.tmp[i] in C ? C[V.tmp[i]] : V.txt[i];
	}
	H = 'template' in C ? C.template : E.tempArray_[3];
	if(H > 0 && H < E.tempArray_.length){
		H = E.tempArray_[H];
	}
	V.t = C.size;
	if(V.t == -1){V.t = "";}
	H = R(H, "{size}", V.t);
	H = R(H, "{count}", V.t);
	H = R(H, "{total}", V.t);
	
	H = R(H, "{page}", C.page);
	H = R(H, "{totalpage}", C.totalpage);
	H = R(H, "{pagesize}", function(){
		var s = "",a=E.sizeArray_();
		s += '<select>';
		for(var i=0; i < a.length; i++){
			s += '<option value="' + a[i] + '"' + (a[i]==C.pagesize ? ' selected="selected"' : '') + '>' + a[i] +'</option>'
		}
		s += '</select>';
		return s;
	}());
	
	H = R(H, "{skip}", '<input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="skip">');
	H = R(H, "{go}", '<button type="button">'+ V.txt[0] +'</button>');
	if(C.hide && C.page==1){
		H = R(H, "{first}", "");
		H = R(H, "{prev}", "");
	}
	else{
		H = R(H, "{first}", E.pageview_(C, 1, V.txt[1], true));
		V.t = C.page - 1;
		if(V.t < 1){V.t = 1;}
		H = R(H, "{prev}", E.pageview_(C, V.t, (V.txt[2] == 'page' ? V.t : V.txt[2]), true));
	}
	if(C.hide && C.page==C.totalpage){
		H = R(H, "{last}", "");
		H = R(H, "{next}", "");
	}
	else{
		H = R(H, "{last}", E.pageview_(C, C.totalpage, V.txt[4], true));
		V.t = C.page + 1;
		if(V.t > C.totalpage){V.t = C.totalpage;}
		H = R(H, "{next}", E.pageview_(C, V.t, (V.txt[3] == 'page' ? V.t : V.txt[3]), true));
	}
	
	V.list = {};
	V.t = C.pagelist;
	if(V.t >= 0){
		V.ts = V.list.start = C.page - Math.floor((V.t-1)/2);
		V.te = V.list.end = C.page + Math.floor(V.t/2);
		if(V.list.start < 1){V.list.start = 1}
		if(V.list.end > C.totalpage){V.list.end = C.totalpage}
		
		V.t = "";
		V.t += E.pageview_(C, 1, 1, false);
		if(V.list.start > 2){V.t += E.pageview_(C, V.list.start, '\u2026', false);}
		for(var i=V.list.start; i <= V.list.end; i++){
			if(i <= 1 || i >= C.totalpage){continue;}
			V.t += E.pageview_(C, i, i, false);
		}
		if(V.list.end < C.totalpage-1){V.t += E.pageview_(C, V.list.end, '\u2026', false);}
		if(C.totalpage != 1){
			V.t += E.pageview_(C, C.totalpage, C.totalpage, false);
		}
		
		H = R(H, "{pagelist}", V.t);
		
		V.t = "";
		if(V.list.start > 1){V.t += E.pageview_(C, V.list.start, '\u2026', false);}
		for(var i=V.list.start; i <= V.list.end; i++){
			V.t += E.pageview_(C, i, i, false);
		}
		if(V.list.end < C.totalpage){V.t += E.pageview_(C, V.list.end, '\u2026', false);}
		H = R(H, "{pageview}", V.t);
	}
	else{
		H = R(H, "{pagelist}", "");
		H = R(H, "{pageview}", "");
	}
	return '<div class="jskey_page jskey_page_skin_'+ (C.skin ? (/^#/.test(C.skin) ? 'default' : C.skin) : 'default') +'" id="jskey_page_'+ C.i +'">'+ H +'</div>';
};
//切换
$jskey.Page.prototype.jump = function(elem){
	var EE = this, C = EE.config, childs = elem.children;
	var sel = elem.getElementsByTagName('select')[0];
	var btn = elem.getElementsByTagName('button')[0];
	var input = elem.getElementsByTagName('input')[0];
	for(var i = 0, len = childs.length; i < len; i++){
		if(childs[i].nodeName.toLowerCase() === 'a'){
			$jskey.on(childs[i], 'click', function(){
				var page = this.getAttribute('data-jskeypage')|0;
				C.page = page;
				EE.render();
			});
		}
	}
	if(btn){
		$jskey.on(btn, 'click', function(){
			var page = input.value.replace(/\s|\D/g, '')|0;
			if(page && page <= C.totalpage){
				C.page = page;
				EE.render();
			}
		});
	}
	if(sel){
		$jskey.on(sel, 'change', function(){
			C.pagesize = sel.value;
			EE.render();
		});
	}
};

//渲染
$jskey.Page.prototype._redo = function(){
	var E = this, C = E.config;
	var H = E.view_();
	C.o = C.object || C.cont;
	switch(typeof C.o === 'object' ? (C.o.length === undefined ? 2 : 3) : 1){
		case 2:C.o.innerHTML = H;break;
		case 3:C.o.html(H);break;
		case 1:$jskey.$(C.o).innerHTML = H;break;
	}
	E.jump($jskey.$('jskey_page_' + C.i));
};

//渲染
$jskey.Page.prototype.redo = function(){
	var E = this;
	E._redo();
	E.other();
};

$jskey.Page.prototype.render = function(){
	var E = this, C = E.config;
	E._redo();
	if(C.jump){C.fn = C.jump;C.jump = null;}
	if(!C.redo){C.redo = function(){E.redo();};}
	C.fn && C.fn(C);
	E.other();
};

$jskey.Page.prototype.go = function(page){
	var E = this, C = E.config;
	C.page = page;
	E.render();
};

$jskey.Page.prototype.other = function(){
	var E = this, C = E.config;
	for(var j=0; j<E.pageArray.length; j++){
		var m = E.pageArray[j];
		m.config.page = C.page;
		m.config.pagesize = C.pagesize;
		m.config.size = C.size;
		m._redo();
	}
};


$jskey.page=function(p){
	return new $jskey.Page(p);
};



}();