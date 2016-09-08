# 总则
-----

###职责与分工

Native, 提供h5赖以生存的容器，在app之外，就是各种浏览器，chrome,safari,IE之流，在app内部，就是各种webview，webview可能与浏览器共用同一个内核。由于IOS不能修改webview，因此通常采用URL拦截的机制进行通信，但重要的是，**Native不需要关心任何上层h5的业务逻辑，需要从原来的角色变为“能力提供者”的角色。**

###Sailer调用native的拦截字符串

native-call:**调用ID**$action:$**动作名称**$**参数**

e.g.:


```html
native-call:callId77$action:$openMall$hybird://shop/index.html?name=test&key=test#select_address

native-call:callId77$action:$openMall$"{'name':'张三'}"
```
* **请注意新增了一个call id，native回调Sailer的时候，需要把这个call ID再传回来**
* **当参数为一个url的时候，这个URL可能也会带上#号**


###native回调Sailer

* **返回参数**

| 参数 | 值 | 必填 |
| -- | -- | -- |
| call ID| string | 是 |
| data | string | 是 |

data的返回格式如下:
```javascript
{
	returnCode: '0000',
	returnMsg: '调用成功',
	data: {
		//put actual callback data in here;
	}
}
```
* **回调方法**

为了实现上层用户能自定义callback甚至匿名callback，需要Sailer充当一个代理的角色。

native目前只需要关心Sailer的两个回调方法，一个是onSuccess,一个是onFail，并传入对应的call ID,**由sailer去回调上层用户的callback**

成功回调
```js
Sailer.onSuccess(callId, data);
```

失败回调
```js
Sailer.onFail(callId, data);
```


**需要注意的是，任何一次call应该都有回调，只有回调了Sailer，Sailer才能进行垃圾回收（GC collection），否则可能导致内存泄露**