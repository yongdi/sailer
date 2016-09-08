#configNavBar
-----
###解释

自定义配置导航标题栏，分享/关闭/编辑等等

###调用方法
```
Sailer.configNavBar(
		{"share": {
			link:"http://www.baidu.com",
			title:"我是分享测试",
			desc:"我是描述",
			imgUrl:"http://www.baidu.com/img/test.jpg"
		}}, successcall, failcall);

```

###返回

e.g. native-call:callId18250$action:$configNavBar${"share":{"link":"http://www.baidu.com","title":"我是分享测试","desc":"我是描述","imgUrl":"http://www.baidu.com/img/test.jpg"}}

````
###返回格式
同总则里面的返回格式