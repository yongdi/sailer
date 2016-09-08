#open
-----
###解释

打开一个新的view，加载远程、本地页面、或者nativeView,可以在URL后面追加一些参数或者hashtag

###调用方法
```
Sailer.open(url, successcall, failcall);
```

###请求参数

| 参数 | 值 | 必填 |
| -- | -- | -- |
| call ID| string | 是 |
| action | open | 是 |
| param | URL | 是 |

e.g.

```html

native-call:callId12189$action:$open$http://www.baidu.com

native-call:callId184210$action:$open$hybird://shop/index.html

native-call:callId279711$action:$open$hybird://shop/index.html?name=test&key=test#select_address

```

###返回

同总则里面的返回格式
