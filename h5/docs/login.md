#login
-----
###解释

login事件，在APP内任何地方登陆客户端都会fire该事件

###调用方法
h5

```javascript
Sailer.on('login', callback);

```
客户端

```javascript
Sailer.fire('login', userInfo);
```

###返回结果

userInfo，登陆成功的用户信息