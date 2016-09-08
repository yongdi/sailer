;(function (win) {
  var doc = win.document;
  var ua = win.navigator.userAgent;
  var isIOS = (/iPhone|iPad|iPod/i).test(ua);
  var isAndroid = (/Android/i).test(ua);
  var callId = 0;
  
  var _userInfo = {
    'uid': -1000,
    'uuid': '',
    //0 线上，1是qa, 3是预发
    'envType': 1,
    'sn': '',
    'appver': '',
    'token': '',
    'activity': '',
    'inApp': false
  };
  var _version = "";
  var actionList = [
    'open', //打开一个新的webview
    'redirect',//重定向
    'callNativeBack',
    'closeBrowser', //关闭当前的webView
    'wxpay', //微信支付
    'yinLianPay', //银联支付
    'aliPay',//支付宝支付,
    'callLogin', //唤起native登陆
//    'callLogout', //唤起native登出
    'openShare',
    'copyWord',
    'asyncGetUserInfo',
    'openopenCamera',
    'showNavBar',
    'hideNavBar',
    'showTabBar',
    'hideTabBar'
  ];
  var nope = function () {};
  var callbackMap = {}; 
  
  var sailer_private = {
    getCallId: function () {
      return 'callId' +  Math.floor(Math.random() * 10000) + '' + callId++;
    },
    callIos: function (methodUrl) {
      var iframe = document.createElement("IFRAME");
      iframe.setAttribute("src", methodUrl);
      document.documentElement.appendChild(iframe);
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    },
    callAndroid: function (methodUrl) {
      try {
        window.NativeInterface.jsCallAndroidMethod(methodUrl);
      } catch (e) {
        console.error('【Sailer】' + e.name + ':' + e.message);
      }
    },
    stringifyData: function (obj) {
      if (obj && typeof obj === 'object') {
        return JSON.stringify(obj);
      } else {
        return obj || '';
      }
    },
    logMethodUrl: function (methodUrl) {
      var param = '';
      methodUrlArray = methodUrl.split('$');
      param = methodUrlArray.splice(3).join('$');
      methodUrlArray[0] = '<span style="color:lightblue">' + methodUrlArray[0] + '</span>';
      methodUrlArray[2] = '<span style="color:yellow">' + methodUrlArray[2] + '</span>';
      methodUrlArray[3] = '<span style="color:lightgreen">' + param + '</span>';

      sailer_public.$console.innerHTML = methodUrlArray.join('$');
      console.log(methodUrl);

    },
    callAppMethod: function (action, param, callId) {
      var param = this.stringifyData(param);
      var methodUrl="native-call:" + callId + "$action:$"+action+"$" + param;

      sailer_public.testMode && this.logMethodUrl(methodUrl);

      if (isIOS) {
        this.callIos(methodUrl);
      }
      if (isAndroid) {
        this.callAndroid(methodUrl);
      }
    },
    clearCallMap: function (callId) {
      delete callbackMap[callId]; 
    }, 
    log: function (str) {
      sailer_public.$console.innerHTML = str;
    },
    handleCallBack: function () {
      
    },
    safeExec: function (callback, context) {
      try {
        return callback.call(context);
      } catch (e) {
        var error = '【Sailer】' + e.name + ':' + e.message;
        this.log(error);
        console.info(error);
      }
    },
    parseData: function (data) {
      var jsonData = '';
      try {
        if (data) {
          jsonData = JSON.parse(data);
        }
        return jsonData;
      } catch (e) {
        var error = '【Sailer】' + e.name + ':' + e.message;
        this.log(error);
        console.info(error);

        return data; 
      }
    },
    simpleExtend: function (target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    },
    checkUpgrade: function(cv, tv) {
      cv = cv ? cv : '';
      tv = tv ? tv : '';
      var cvArr = cv.split('.');
      var tvArr = tv.split('.');
      var cvLen = cvArr.length;
      var tvLen = tvArr.length;

      var loopLen = Math.min(cvLen, tvLen);
      for(var i=0; i<loopLen; i++) {
        if(cvArr[i]>tvArr[i]) {
          return true;
        }else if(cvArr[i]<tvArr[i]){
          return false;
        }
      }
      if(cvLen>=tvLen) {
        return true;
      }else{
        return false;
      }
    },
    handleUrl: function (url) {
      var reg = /(http[s]?:\/\/)|(native:\/\/)|(hybird:\/\/)/;
      var pathName = location.pathname;
      var pathArr = pathName.split('/');
      pathArr.pop();
      pathName = pathArr.join('/');
      var absUrl = location.protocol + '//' + location.host + pathName + '/' + url;
      return reg.test(url) ? url: absUrl;
    }
  }
  var sailer_public = {
    isIOS: isIOS,
    isAndroid: isAndroid,
    testMode: false,
    testCallBack: false,
    callbackMap: callbackMap,
    $console: document.createElement('div'),
    setTestMode: function (mode) {
      if (mode === true) {
        var $console = document.createElement('div');
        $console.id = 'Sailer_console';
        var style = {
          background: 'rgba(0, 0, 0, 0.4)',
          color: '#FFF',
          position: 'fixed',
          bottom: '0px',
          left: '0px',
          right: '0px',
          fontSize: '16px',
          lineHeight: '1.5',
          minHeight: '40px',
          margin: '0px',
          wordBreak: 'break-all',
          padding: '0px 10px',
          zIndex: '99999999999'
        }
        for (var key in style) {
          $console.style[key] = style[key];
        }
        setTimeout(function () {
          document.body.appendChild($console);
        }, 1000);
        this.$console = $console;
        this.testMode = true;
      } else {
        this.$console.remove();
        this.$console = null;
        this.testMode = false;
      }
      return this;
    },
    nativeCall: function (action, param, successCall, failCall) {
      successCall = successCall || nope;
      failCall = failCall || nope; 
      param = param === undefined ? '' : param;

      if(arguments.length === 2) {
        //仅有action和successCall的情况
        if (param.constructor === Function) {
         successCall = param; 
         param = '';
        }
      }
      
      var callId = sailer_private.getCallId();
      var callBack = {
        success: successCall,
        fail: failCall
      };
      callbackMap[callId] = callBack;
      sailer_private.callAppMethod(action, param, callId);
      if (this.testCallBack) {
        var self = this;
        setTimeout(function () {
          var testData = {
            returnCode: '0000',
            returnMsg: '成功执行',
            data: {
              testData: 'success'
            }
          };
          self.onSuccess(callId, JSON.stringify(testData));
        }, 1000);
      }
    },
    onSuccess: function (callId, data) {
      data = sailer_private.parseData(data);
      sailer_private.safeExec(function () {
        callbackMap[callId].success(data, callId);
        sailer_private.clearCallMap(callId);
      });
    },
    onFail: function (callId, data) {
      data = sailer_private.parseData(data);
      sailer_private.safeExec(function () {
        callbackMap[callId].fail(data, callId);
        sailer_private.clearCallMap(callId);
      });
    },
    fire: function (eventName, data) {
      data = sailer_private.parseData(data);
      sailer_private.safeExec(function () {
        var callbacks = callbackMap[eventName];
        //DO NOT support off event during fire
        for (var i = 0; i < callbacks.length; i++) {
          callbacks[i].call(this, data);
        }
      }, this);
    },
    on: function (eventName, callback) {
      callbackMap[eventName] = callbackMap[eventName] || [];
      callbackMap[eventName].push(callback);
    },
    off: function (eventName, callback) {
      if (arguments.length === 1) {
        sailer_private.clearCallMap(eventName);
      } else {
        var callbacks = callbackMap[eventName];
        return callbacks.splice(callbacks.indexOf(callback), 1);
      }
    },
    ready: function (callback) {
      this.on('ready', callback);
    },
    getUserInfo: function () {
      return _userInfo;
    },
    compareVersion: function() {
      var args = Array.prototype.slice.call(arguments);
      if(args.length === 1) {
        return sailer_private.checkUpgrade(this.getVersion(), args[0]);
      }else if(args.length === 2) {
        return sailer_private.checkUpgrade(args[0], args[1]);
      }else{
        var error = '【Sailer】' + 'compareVersion: Params not match!';
        sailer_private.log(error);
      }
    },
    getVersion: function() {
      if(_userInfo && _userInfo.appver){
        _version = _userInfo.appver;
      }
      return _version;
    },
    updateUserInfo: function (userInfo) {
        sailer_private.simpleExtend(_userInfo, userInfo);
    },
    log: sailer_private.log
  }
  //build action function 
  actionList.forEach(function (action) {
    sailer_public[action] = function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(action);
      if(action === 'open' || action === 'redirect') {
        args[1] = sailer_private.handleUrl(args[1]);
      }
      sailer_public.nativeCall.apply(sailer_public, args);
    }; 
  });

  sailer_public.on('setUserInfo', function (data) {
    _userInfo = data;
    _userInfo.inApp = (_userInfo.inApp === 'true' ? true : false);
  });
  win.Sailer = sailer_public; 
})(window)
