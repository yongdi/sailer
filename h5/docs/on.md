#on
-----
###解释

使用Sailer注册一个持久化的事件,当该事件被触发(fire)时，Sailer会将注册函数一一执行

###调用方法
```
Sailer.on(eventName, callback);
```

###参数

| 参数 | 值 | 必填 |
| -- | -- | -- |
| eventName| string | 是 |
| callback | function | 是 |

###返回

无返回