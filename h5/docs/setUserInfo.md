#setUserInfo
-----
###解释

客户端向h5塞UserInfo

客户端使用fire方法触发事件

H5使用on方法监听事件

注意，客户端fire该方法的时机至少应该在浏览器的'DOMContentLoaded'事件之后**并且每次新建webview，webview内重定向等情况都需要fire该事件**

参考下面的调用方法


###调用方法
h5

```javascript
Sailer.on('setUserInfo', callback);

```
客户端

```javascript
Sailer.fire('setUserInfo', userInfo);
```



###返回结果

UserInfo同asyncGetUserInfo
