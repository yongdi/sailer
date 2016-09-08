#callLogin
-----
###解释

发出登陆的指令，注意登陆成功后客户端会fire一个login事件

###调用方法
```
Sailer.callLogin('', successcall, failcall);
```

###返回

返回登陆成功后的UserInfo
````javascript
	{
	returnCode: '0000',
	returnMsg: '调用成功',
	data: {
		uid: '',
		sn: '',
		appver: '',
		chr: '',
		token: ''
	}
}
````
