jskey_page
==============
[![License](https://img.shields.io/badge/license-Apache%202-4EB1BA.svg)](https://www.apache.org/licenses/LICENSE-2.0.html)

js翻页导航条

==============
$jskey.page() 纯js实现的翻页导航条，可自定义展示模板。

使用template可以设置自己的展示模板，如果template直接设置值:1-4可使用默认的四种模板

template中可使用的变量为：

{pageview} {size} {page} {totalpage} {prev} {first} {pagelist} {last} {next} {skip} {go} {pagesize}

各种参数简介如下：
```javascript
$jskey.page({
	template:"{pageview}<span>共{size}条记录&nbsp;第{page}/{totalpage}页&nbsp;</span>{prev}{first}{pagelist}{last}{next}<span>&nbsp;转到第</span>{skip}<span>页</span>{go}<span>&nbsp;每页</span>{pagesize}",
	object:'p6',// 放置翻页控件信息的html的DOM的id
	pagesize:10,// 一页数量，默认为10
	size:20000,// 总数据量，初始化时可以不设置，默认为0
	page:1, // 当前页，初始化时可以不设置，默认为1
	skin: 'my', //自定义皮肤css名称后缀，或者也可以直接逗号分隔颜色两个(背景颜色,文本颜色):'#00AA91,#ffffff'
    first: '<<', //若不显示，设置false即可
    last: '>>', //<尾页>若不显示，设置false即可
    prev: '<', //若不显示，设置false即可
    next: '>', //若不显示，设置false即可
    go: '确定',// 跳转到指定页面的按钮显示值
    pagelist:3,// 左右留置的翻页按钮数
    hide:true,// 当没有相关页面时，是否隐藏首页、上页、下页、尾页
	fn:function(e){// 回调函数，初始化完成时也会执行一次，故，可以通过重置size属性，并调用redo()函数重绘翻页导航条
		// 这里可以重置page和pagesize等属性，注意修改后，自己获取的数据是否还正确喔
		// 例：假设异步返回的res值是:{"size":100, "page":2, "pagesize":10,"totalpage":10, "rows":[{"id":"1"},{"id":"2"},{"id":"3"}]}
		$.getJSON('./data.json?page='+e.page+'&pagesize='+e.pagesize+'&r='+new Date(), function(res){
			// 1、每次都重置数据，此示例是静态json，估此page和pagesize不设置
			if(e.size != res.size){// ||e.page != res.page
				e.size = res.size;// 如果当前控件数据太旧或错误，此处可更新此数据，也可不更新（当后台数据总数变化时可实时更新）
				//e.page = res.page;// 同上，此值为显示的当前页
				//e.pagesize = res.pagesize;// 同上，此值为整数，且大于0，一般初始化时指定后几乎不会变化
				e.redo();// 如果更新了控件的数据，则需要执行此函数，用于更新页面内容
			}
			// 此处可以循环res.rows渲染数据表
			// ...
			fn(e);
		});
	}
});
```


下面是比较全面的演示及说明，相关使用请点击下面网址，并使用"网页源代码"查看吧，就不另写说明了，麻烦
* [示例](https://rawgit.com/skeychen/jskey_page/master/jskey_page.html)