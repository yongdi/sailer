#callLogout
-----
###解释

发出登出的指令，注意登出成功后客户端会fire一个logout事件

###调用方法
```
Sailer.callLogout('', successcall, failcall);
```

###返回

返回空的UserInfo
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
