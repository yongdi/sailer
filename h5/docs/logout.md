#logout
-----
###解释

logout事件，在APP内任何地方登出客户端都会fire该事件

###调用方法
h5

```javascript
Sailer.on('logout', callback);

```
客户端

```javascript
Sailer.fire('logout', userInfo);
```

###返回结果

空的userInfo