#off
-----
###解释

取消注册在sailer的事件，如果仅传入事件名称，则会把该事件对应的callback全部删除

###调用方法
```
Sailer.off(eventName, callback);
```

###参数

| 参数 | 值 | 必填 |
| -- | -- | -- |
| eventName| string | 是 |
| callback | function | 否 |

###返回

无返回