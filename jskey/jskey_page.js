/**
 * 翻页控件类
 * @version 5
 * @datetime 2019-08-29 18:04
 * @author skey_chen
 * @copyright 2011-2019 &copy; skey_chen@163.com
 * @license LGPL
 */
var $jskey = $jskey || {};



$jskey.extend = function(d, s){
	for(var p in s) {
		if(typeof s[p] == 'object'){
			d[p] = d[p] || {};
			$jskey.extend(d[p], s[p]);
		}else{
			d[p] = d[p]||s[p];
		}
	}
	return d;
};



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
		".jskey_page a," +
		".jskey_page span{height:26px;line-height:26px;border-radius:2px;margin:0 3px 6px 3px;}" +
		".jskey_page a{padding:0 10px;width:auto;text-decoration:none;}" +
		".jskey_page a         {cursor:pointer;background-color:#ffffff;color:#333333;border:1px solid #ccc;}" +
		".jskey_page a.selected{cursor:default;background-color:#ffffff;color:#000000;border:none;padding:0 11px;height:28px;line-height:28px;font-weight:700;}" +
		".jskey_page a.disabled{cursor:not-allowed!important;pointer-events:none;opacity:0.5;}" +
		".jskey_page input, .jskey_page button, .jskey_page select{border:1px solid #ccc;background-color:#ffffff;}" +
		".jskey_page input {height:24px;line-height:24px;margin:0 5px;padding:0 5px;width:28px;}" +
		".jskey_page button{height:26px;line-height:26px;margin:0 0px;padding:0 5px;cursor:pointer;}" +
		".jskey_page select{height:26px;line-height:26px;margin:0 5px;padding:0;width:50px;}" +
	"</style>"
);



/*
$jskey.page({
	template:"{pageview}<span>共{size}条&nbsp;第{page}/{totalpage}页&nbsp;</span>{prev}{first}{pagelist}{last}{next}<span>&nbsp;转到第</span>{skip}<span>页</span>{go}<span>&nbsp;每页</span>{pagesize}条",
	target:'p',// 放置翻页控件信息的html的DOM的id
	pagesize:10,// 一页数量，默认为10
	size:20000,// 总数据量，初始化时可以不设置，默认为0
	page:1, // 当前页，初始化时可以不设置，默认为1
    first: '<<', //若不显示，设置false即可
    last: '>>', //<尾页>若不显示，设置false即可
    prev: '<', //若不显示，设置false即可
    next: '>', //若不显示，设置false即可
    go: '确定',// 跳转到指定页面的按钮显示值
    pagelist:3,// 左右留置的翻页按钮数
    hide:true,// 当没有相关页面时，是否隐藏首页、上页、下页、尾页
    dom:{
    	"tag":"div", 
    	"style":{"className":"jskey_page"},
    	"item":{
    		"tag":"a", 
    		"begin":"", 
    		"end":"", 
    		"style":{
    			"className":"", 
    			"selected":"selected", 
    			"disabled":"disabled"
    		}
    	}
    },
    
	fn:function(e){// 回调函数，初始化完成时也会执行一次，故，可以通过重置size属性，并调用redo()函数重绘翻页导航条
		// 回调函数中e可用变量和函数有：e.*【所有可设置的参数】，e.totalpage【总页数】，e.redo()【重置函数】
		e.size = 1000;
		// 过程中可以变化样例
		if(e.page == 10){
			e.template = 0;
		}
		else{
			var s = "{pageview}<span>共{size}条&nbsp;第{page}/{totalpage}页&nbsp;</span>{prev}{first}{pagelist}{last}{next}<span>&nbsp;转到第</span>{skip}<span>页</span>{go}<span>&nbsp;每页</span>{pagesize}条";
			if(e.template != s){
				e.template = s;
			}
		}
		e.redo();
		fn(e);
	}
});
*/
var count = 0;



$jskey.Page=function(p){
	this.config = p || {};
	this.config.i = count++;
	this.arr = p.arr || [];// 多个翻页实体[{每一个的参数设置全部都可独立存在，但不能设置fn}]
	this.pageArray = [];
	var _E = this;
	_E.config_();
	var _C = this.config;
	if(_C.jump){_C.fn = _C.jump;_C.jump = null;}
	if(!_C.redo){_C.redo = function(){_E.redo();};}
	if(_C.noexecute){
		this.redo();
	}
	else{
		this.render();
	}
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
		m.noexecute = true;
		this.pageArray[j] = new $jskey.Page(m);
	}
};
$jskey.Page.prototype.config_ = function(){
	var C = this.config;
	var d = {tag:"div", style:{className:"jskey_page"}, item:{tag:"a", begin:"", end:"", style:{className:"", selected:"selected", disabled:"disabled"}}};
	C.dom = C.dom||{};
	$jskey.extend(C.dom, d);
	C.dom.tag = C.dom.tag.toLowerCase();
	C.dom.item.tag = C.dom.item.tag.toLowerCase();
};
$jskey.Page.prototype.pageview_ = function(C, v, txt, btn){
	var s = "",i = C.dom.item;
	if(C.page === v){
		if(btn){
			s = '<' + i.tag + (i.style.disabled.length > 0 ? ' class="'+i.style.disabled+'"' : '') + '>' + i.begin + txt + i.end + '</' + i.tag + '>';
		}
		else{
			s = '<' + i.tag + (i.style.selected.length > 0 ? ' class="'+i.style.selected+'"' : '') + '>' + i.begin + txt + i.end + '</' + i.tag + '>';
		}
	} else {
		s = '<' + i.tag + (i.style.className.length > 0 ? ' class="'+i.style.className+'"' : '') + (' data-jskeypage="'+v+'"') + '>' + i.begin + txt + i.end + '</' + i.tag + '>';
	}
	return s;
};
$jskey.Page.prototype.sizeArray_ = function(){return [5, 10, 15, 20, 25, 30, 50, 100];};
$jskey.Page.prototype.tempArray_ = ["{prev}{pagelist}{next}"
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
	H = 'template' in C ? C.template : E.tempArray_[0];
	if(H >= 0 && H < E.tempArray_.length){
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
	return '<'+C.dom.tag+' onselectstart="return false;" class="'+C.dom.style.className+'" id="jskey_page_'+ C.i +'">'+ H +'</'+C.dom.tag+'>';
};
//切换
$jskey.Page.prototype.jump = function(elem){
	var EE = this, C = EE.config, childs = elem.children;
	var sel = elem.getElementsByTagName('select')[0];
	var btn = elem.getElementsByTagName('button')[0];
	var input = elem.getElementsByTagName('input')[0];
	for(var i = 0, len = childs.length; i < len; i++){
		if(childs[i].nodeName.toLowerCase() === C.dom.item.tag){
			$jskey.on(childs[i], 'click', function(event){
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
		}) 	;
	}
};

//渲染
$jskey.Page.prototype._redo = function(){
	var E = this, C = E.config;
	var H = E.view_();
	C.o = C.target || C.object || C.cont;
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