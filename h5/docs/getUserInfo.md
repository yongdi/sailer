#getUserInfo
-----
###解释

同步取得客户端最新的UserInfo信息
###调用方法
```
Sailer.getUserInfo();
```

###返回

返回UserInfo
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

| 参数 | 值 | 必填 |
| -- | -- | -- |
| uid | 用户id  | 是 |
| appver | app版本号  | 是 |
| chr | 平台类型(例如是H5还是app平台) | 是 |
| token | 增强用户的唯一标示  | 是 |
| sn | 手机型号 | 是 |