#ready
-----
###解释

**在fire ready事件之前应先fire setUserInfo事件**

注意，客户端fire该方法的时机至少应该在浏览器的'DOMContentLoaded'事件之后**并且每次新建webview，webview内重定向等情况都需要fire该事件**

参考下面的调用方法


###调用方法
h5

```javascript
Sailer.on('ready', callback);
或者
Sailer.ready(callback);

```
客户端

```javascript
Sailer.fire('ready');
```

###返回结果

无