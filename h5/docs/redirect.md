#redirect
-----
###解释
##注意!! 跳转到原生界面只能用Redict方法!
点击在同一个webview内进行页面跳转 

###调用方法
```
Sailer.redirect(URL, successcall, failcall);
```

###请求参数

| 参数 | 值 | 必填 |
| -- | -- | -- |
| call ID| string | 是 |
| action | redirect | 是 |
| param | URL | 是 |

e.g.

```
native-call:callId279711$action:$redirect$http://www.baidu.com

native-call:callId279711$action:$redirect$hybird://shop/index.html

native-call:callId279711$action:$redirect$hybird://shop/index.html?name=test&key=test#select_address

native-call:callId279711$action:$redirect$native://openMall:{"URLString":"index.html#orderDetail"}

native-call:callId279711$action:$redirect$native://community:{"testKey":"test"}

//Zern-code 
// page-mall表示跳转商城详情，“:”后面跟的是参数表示该界面所需要的参数json格式
native-call:callId279711$action:$redirect$native://page-mall:{"subPageParam","shop/index.html?name=test&key=test#select_address"}

// page-forum-home表示跳转社区首页，“:”后面参数表示该界面所需要的参数json格式
native-call:callId279711$action:$redirect$native://page-forum-home:{"testKey":"test"}

// page-forum-topic-myspace表示跳转社区个人空间，":"后面的参数表示该界面所需要的参数json格式
native-call:callId279711$action:$redirect$native://page-forum-topic-myspace:{"buddyId":"56d7a5aed5e8b6497fcfdb10"}

// page-medical-glucose表示跳转控血糖界面，
native-call:callId279711$action:$redirect$native://page-medical-glucose:{}

// page-clinic表示跳转掌上诊所暂不需要参数
native-call:callId279711$action:$redirect$native://page-clinic:{}

// page-mycoin表示跳转我的糖币不需要参数
native-call:callId279711$action:$redirect$native://page-mycoin:{}

// page-customer-service表示跳转客服界面不需要参数
native-call:callId279711$action:$redirect$native://page-customer-service:{}

// page-knowledges表示跳转到糖尿病百科也就是(学知识)不需要参数
native-call:callId279711$action:$redirect$native://page-knowledges:{}

// page-medical表示跳转到医学服务首页不需要参数
native-call:callId279711$action:$redirect$native://page-medical:{}

// page-convert表示跳转到兑换礼品界面不需要参数
native-call:callId279711$action:$redirect$native://page-convert:{}

// page-change-record表示跳转到兑换记录界面不需要参数
native-call:callId279711$action:$redirect$native://page-change-record:{}

// page-my-diabete-info表示跳转到健康档案界面不需要参数
native-call:callId279711$action:$redirect$native://page-my-diabete-info:{}

// page-dietary表示跳转到低糖享美味不需要参数
native-call:callId279711$action:$redirect$native://page-dietary:{}

// page-medical-meal表示跳转到记饮食暂时不需要参数
native-call:callId279711$action:$redirect$native://page-medical-meal:{}

// page-favor-dietary表示跳转到我的收藏不需要参数
native-call:callId279711$action:$redirect$native://page-favor-dietary:{}

// page-medical-sports表示跳转到做运动不需要参数
native-call:callId279711$action:$redirect$native://page-medical-sports:{}

// page-medicine-assistant表示跳转到智慧扫码不需要参数
native-call:callId279711$action:$redirect$native://page-medicine-assistant:{}

// page-sugar-star表示跳转到控糖明星不需要参数
native-call:callId279711$action:$redirect$native://page-sugar-star:{}

// page-invitation-code表示跳转到推荐有奖不需要参数
native-call:callId279711$action:$redirect$native://page-invitation-code:{}

// page-mywarn表示跳转到我的提醒不需要参数
native-call:callId279711$action:$redirect$native://page-mywarn:{}

// page-forum-circle表示跳转到圈子详情
native-call:callId279711$action:$redirect$native://page-forum-circle:{"circleId":"56d41291d5e8b6497fcfd9ea"}

// 如果需要原生跳转到商城首页，不需要传参数的情况
native-call:callId279711$action:$redirect$native://page-mall:{}


```
	
**同open方法**

 origin/master

###返回

同总则里面的返回格式
