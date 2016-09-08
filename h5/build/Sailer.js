(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9oYy93d3cvZ2l0L3NhaWxlci9oNS9ub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2hjL3d3dy9naXQvc2FpbGVyL2g1L3NyYy9TYWlsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24gKHdpbikge1xuICB2YXIgZG9jID0gd2luLmRvY3VtZW50O1xuICB2YXIgdWEgPSB3aW4ubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgdmFyIGlzSU9TID0gKC9pUGhvbmV8aVBhZHxpUG9kL2kpLnRlc3QodWEpO1xuICB2YXIgaXNBbmRyb2lkID0gKC9BbmRyb2lkL2kpLnRlc3QodWEpO1xuICB2YXIgY2FsbElkID0gMDtcbiAgXG4gIHZhciBfdXNlckluZm8gPSB7XG4gICAgJ3VpZCc6IC0xMDAwLFxuICAgICd1dWlkJzogJycsXG4gICAgLy8wIOe6v+S4iu+8jDHmmK9xYSwgM+aYr+mihOWPkVxuICAgICdlbnZUeXBlJzogMSxcbiAgICAnc24nOiAnJyxcbiAgICAnYXBwdmVyJzogJycsXG4gICAgJ3Rva2VuJzogJycsXG4gICAgJ2FjdGl2aXR5JzogJycsXG4gICAgJ2luQXBwJzogZmFsc2VcbiAgfTtcbiAgdmFyIF92ZXJzaW9uID0gXCJcIjtcbiAgdmFyIGFjdGlvbkxpc3QgPSBbXG4gICAgJ29wZW4nLCAvL+aJk+W8gOS4gOS4quaWsOeahHdlYnZpZXdcbiAgICAncmVkaXJlY3QnLC8v6YeN5a6a5ZCRXG4gICAgJ2NhbGxOYXRpdmVCYWNrJyxcbiAgICAnY2xvc2VCcm93c2VyJywgLy/lhbPpl63lvZPliY3nmoR3ZWJWaWV3XG4gICAgJ3d4cGF5JywgLy/lvq7kv6HmlK/ku5hcbiAgICAneWluTGlhblBheScsIC8v6ZO26IGU5pSv5LuYXG4gICAgJ2FsaVBheScsLy/mlK/ku5jlrp3mlK/ku5gsXG4gICAgJ2NhbGxMb2dpbicsIC8v5ZSk6LW3bmF0aXZl55m76ZmGXG4vLyAgICAnY2FsbExvZ291dCcsIC8v5ZSk6LW3bmF0aXZl55m75Ye6XG4gICAgJ29wZW5TaGFyZScsXG4gICAgJ2NvcHlXb3JkJyxcbiAgICAnYXN5bmNHZXRVc2VySW5mbycsXG4gICAgJ29wZW5vcGVuQ2FtZXJhJyxcbiAgICAnc2hvd05hdkJhcicsXG4gICAgJ2hpZGVOYXZCYXInLFxuICAgICdzaG93VGFiQmFyJyxcbiAgICAnaGlkZVRhYkJhcidcbiAgXTtcbiAgdmFyIG5vcGUgPSBmdW5jdGlvbiAoKSB7fTtcbiAgdmFyIGNhbGxiYWNrTWFwID0ge307IFxuICBcbiAgdmFyIHNhaWxlcl9wcml2YXRlID0ge1xuICAgIGdldENhbGxJZDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdjYWxsSWQnICsgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSArICcnICsgY2FsbElkKys7XG4gICAgfSxcbiAgICBjYWxsSW9zOiBmdW5jdGlvbiAobWV0aG9kVXJsKSB7XG4gICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIklGUkFNRVwiKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgbWV0aG9kVXJsKTtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgaWZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgIGlmcmFtZSA9IG51bGw7XG4gICAgfSxcbiAgICBjYWxsQW5kcm9pZDogZnVuY3Rpb24gKG1ldGhvZFVybCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgd2luZG93Lk5hdGl2ZUludGVyZmFjZS5qc0NhbGxBbmRyb2lkTWV0aG9kKG1ldGhvZFVybCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ+OAkFNhaWxlcuOAkScgKyBlLm5hbWUgKyAnOicgKyBlLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc3RyaW5naWZ5RGF0YTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgaWYgKG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvYmogfHwgJyc7XG4gICAgICB9XG4gICAgfSxcbiAgICBsb2dNZXRob2RVcmw6IGZ1bmN0aW9uIChtZXRob2RVcmwpIHtcbiAgICAgIHZhciBwYXJhbSA9ICcnO1xuICAgICAgbWV0aG9kVXJsQXJyYXkgPSBtZXRob2RVcmwuc3BsaXQoJyQnKTtcbiAgICAgIHBhcmFtID0gbWV0aG9kVXJsQXJyYXkuc3BsaWNlKDMpLmpvaW4oJyQnKTtcbiAgICAgIG1ldGhvZFVybEFycmF5WzBdID0gJzxzcGFuIHN0eWxlPVwiY29sb3I6bGlnaHRibHVlXCI+JyArIG1ldGhvZFVybEFycmF5WzBdICsgJzwvc3Bhbj4nO1xuICAgICAgbWV0aG9kVXJsQXJyYXlbMl0gPSAnPHNwYW4gc3R5bGU9XCJjb2xvcjp5ZWxsb3dcIj4nICsgbWV0aG9kVXJsQXJyYXlbMl0gKyAnPC9zcGFuPic7XG4gICAgICBtZXRob2RVcmxBcnJheVszXSA9ICc8c3BhbiBzdHlsZT1cImNvbG9yOmxpZ2h0Z3JlZW5cIj4nICsgcGFyYW0gKyAnPC9zcGFuPic7XG5cbiAgICAgIHNhaWxlcl9wdWJsaWMuJGNvbnNvbGUuaW5uZXJIVE1MID0gbWV0aG9kVXJsQXJyYXkuam9pbignJCcpO1xuICAgICAgY29uc29sZS5sb2cobWV0aG9kVXJsKTtcblxuICAgIH0sXG4gICAgY2FsbEFwcE1ldGhvZDogZnVuY3Rpb24gKGFjdGlvbiwgcGFyYW0sIGNhbGxJZCkge1xuICAgICAgdmFyIHBhcmFtID0gdGhpcy5zdHJpbmdpZnlEYXRhKHBhcmFtKTtcbiAgICAgIHZhciBtZXRob2RVcmw9XCJuYXRpdmUtY2FsbDpcIiArIGNhbGxJZCArIFwiJGFjdGlvbjokXCIrYWN0aW9uK1wiJFwiICsgcGFyYW07XG5cbiAgICAgIHNhaWxlcl9wdWJsaWMudGVzdE1vZGUgJiYgdGhpcy5sb2dNZXRob2RVcmwobWV0aG9kVXJsKTtcblxuICAgICAgaWYgKGlzSU9TKSB7XG4gICAgICAgIHRoaXMuY2FsbElvcyhtZXRob2RVcmwpO1xuICAgICAgfVxuICAgICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgICB0aGlzLmNhbGxBbmRyb2lkKG1ldGhvZFVybCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhckNhbGxNYXA6IGZ1bmN0aW9uIChjYWxsSWQpIHtcbiAgICAgIGRlbGV0ZSBjYWxsYmFja01hcFtjYWxsSWRdOyBcbiAgICB9LCBcbiAgICBsb2c6IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgIHNhaWxlcl9wdWJsaWMuJGNvbnNvbGUuaW5uZXJIVE1MID0gc3RyO1xuICAgIH0sXG4gICAgaGFuZGxlQ2FsbEJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgIFxuICAgIH0sXG4gICAgc2FmZUV4ZWM6IGZ1bmN0aW9uIChjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHZhciBlcnJvciA9ICfjgJBTYWlsZXLjgJEnICsgZS5uYW1lICsgJzonICsgZS5tZXNzYWdlO1xuICAgICAgICB0aGlzLmxvZyhlcnJvcik7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhlcnJvcik7XG4gICAgICB9XG4gICAgfSxcbiAgICBwYXJzZURhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIganNvbkRhdGEgPSAnJztcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAganNvbkRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqc29uRGF0YTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdmFyIGVycm9yID0gJ+OAkFNhaWxlcuOAkScgKyBlLm5hbWUgKyAnOicgKyBlLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMubG9nKGVycm9yKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGVycm9yKTtcblxuICAgICAgICByZXR1cm4gZGF0YTsgXG4gICAgICB9XG4gICAgfSxcbiAgICBzaW1wbGVFeHRlbmQ6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfSxcbiAgICBjaGVja1VwZ3JhZGU6IGZ1bmN0aW9uKGN2LCB0dikge1xuICAgICAgY3YgPSBjdiA/IGN2IDogJyc7XG4gICAgICB0diA9IHR2ID8gdHYgOiAnJztcbiAgICAgIHZhciBjdkFyciA9IGN2LnNwbGl0KCcuJyk7XG4gICAgICB2YXIgdHZBcnIgPSB0di5zcGxpdCgnLicpO1xuICAgICAgdmFyIGN2TGVuID0gY3ZBcnIubGVuZ3RoO1xuICAgICAgdmFyIHR2TGVuID0gdHZBcnIubGVuZ3RoO1xuXG4gICAgICB2YXIgbG9vcExlbiA9IE1hdGgubWluKGN2TGVuLCB0dkxlbik7XG4gICAgICBmb3IodmFyIGk9MDsgaTxsb29wTGVuOyBpKyspIHtcbiAgICAgICAgaWYoY3ZBcnJbaV0+dHZBcnJbaV0pIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfWVsc2UgaWYoY3ZBcnJbaV08dHZBcnJbaV0pe1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYoY3ZMZW4+PXR2TGVuKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZVVybDogZnVuY3Rpb24gKHVybCkge1xuICAgICAgdmFyIHJlZyA9IC8oaHR0cFtzXT86XFwvXFwvKXwobmF0aXZlOlxcL1xcLyl8KGh5YmlyZDpcXC9cXC8pLztcbiAgICAgIHZhciBwYXRoTmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgdmFyIHBhdGhBcnIgPSBwYXRoTmFtZS5zcGxpdCgnLycpO1xuICAgICAgcGF0aEFyci5wb3AoKTtcbiAgICAgIHBhdGhOYW1lID0gcGF0aEFyci5qb2luKCcvJyk7XG4gICAgICB2YXIgYWJzVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIHBhdGhOYW1lICsgJy8nICsgdXJsO1xuICAgICAgcmV0dXJuIHJlZy50ZXN0KHVybCkgPyB1cmw6IGFic1VybDtcbiAgICB9XG4gIH1cbiAgdmFyIHNhaWxlcl9wdWJsaWMgPSB7XG4gICAgaXNJT1M6IGlzSU9TLFxuICAgIGlzQW5kcm9pZDogaXNBbmRyb2lkLFxuICAgIHRlc3RNb2RlOiBmYWxzZSxcbiAgICB0ZXN0Q2FsbEJhY2s6IGZhbHNlLFxuICAgIGNhbGxiYWNrTWFwOiBjYWxsYmFja01hcCxcbiAgICAkY29uc29sZTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgc2V0VGVzdE1vZGU6IGZ1bmN0aW9uIChtb2RlKSB7XG4gICAgICBpZiAobW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICB2YXIgJGNvbnNvbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgJGNvbnNvbGUuaWQgPSAnU2FpbGVyX2NvbnNvbGUnO1xuICAgICAgICB2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMCwgMCwgMCwgMC40KScsXG4gICAgICAgICAgY29sb3I6ICcjRkZGJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBib3R0b206ICcwcHgnLFxuICAgICAgICAgIGxlZnQ6ICcwcHgnLFxuICAgICAgICAgIHJpZ2h0OiAnMHB4JyxcbiAgICAgICAgICBmb250U2l6ZTogJzE2cHgnLFxuICAgICAgICAgIGxpbmVIZWlnaHQ6ICcxLjUnLFxuICAgICAgICAgIG1pbkhlaWdodDogJzQwcHgnLFxuICAgICAgICAgIG1hcmdpbjogJzBweCcsXG4gICAgICAgICAgd29yZEJyZWFrOiAnYnJlYWstYWxsJyxcbiAgICAgICAgICBwYWRkaW5nOiAnMHB4IDEwcHgnLFxuICAgICAgICAgIHpJbmRleDogJzk5OTk5OTk5OTk5J1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuICAgICAgICAgICRjb25zb2xlLnN0eWxlW2tleV0gPSBzdHlsZVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoJGNvbnNvbGUpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgdGhpcy4kY29uc29sZSA9ICRjb25zb2xlO1xuICAgICAgICB0aGlzLnRlc3RNb2RlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGNvbnNvbGUucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuJGNvbnNvbGUgPSBudWxsO1xuICAgICAgICB0aGlzLnRlc3RNb2RlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIG5hdGl2ZUNhbGw6IGZ1bmN0aW9uIChhY3Rpb24sIHBhcmFtLCBzdWNjZXNzQ2FsbCwgZmFpbENhbGwpIHtcbiAgICAgIHN1Y2Nlc3NDYWxsID0gc3VjY2Vzc0NhbGwgfHwgbm9wZTtcbiAgICAgIGZhaWxDYWxsID0gZmFpbENhbGwgfHwgbm9wZTsgXG4gICAgICBwYXJhbSA9IHBhcmFtID09PSB1bmRlZmluZWQgPyAnJyA6IHBhcmFtO1xuXG4gICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIC8v5LuF5pyJYWN0aW9u5ZKMc3VjY2Vzc0NhbGznmoTmg4XlhrVcbiAgICAgICAgaWYgKHBhcmFtLmNvbnN0cnVjdG9yID09PSBGdW5jdGlvbikge1xuICAgICAgICAgc3VjY2Vzc0NhbGwgPSBwYXJhbTsgXG4gICAgICAgICBwYXJhbSA9ICcnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBjYWxsSWQgPSBzYWlsZXJfcHJpdmF0ZS5nZXRDYWxsSWQoKTtcbiAgICAgIHZhciBjYWxsQmFjayA9IHtcbiAgICAgICAgc3VjY2Vzczogc3VjY2Vzc0NhbGwsXG4gICAgICAgIGZhaWw6IGZhaWxDYWxsXG4gICAgICB9O1xuICAgICAgY2FsbGJhY2tNYXBbY2FsbElkXSA9IGNhbGxCYWNrO1xuICAgICAgc2FpbGVyX3ByaXZhdGUuY2FsbEFwcE1ldGhvZChhY3Rpb24sIHBhcmFtLCBjYWxsSWQpO1xuICAgICAgaWYgKHRoaXMudGVzdENhbGxCYWNrKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHRlc3REYXRhID0ge1xuICAgICAgICAgICAgcmV0dXJuQ29kZTogJzAwMDAnLFxuICAgICAgICAgICAgcmV0dXJuTXNnOiAn5oiQ5Yqf5omn6KGMJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGVzdERhdGE6ICdzdWNjZXNzJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgc2VsZi5vblN1Y2Nlc3MoY2FsbElkLCBKU09OLnN0cmluZ2lmeSh0ZXN0RGF0YSkpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uU3VjY2VzczogZnVuY3Rpb24gKGNhbGxJZCwgZGF0YSkge1xuICAgICAgZGF0YSA9IHNhaWxlcl9wcml2YXRlLnBhcnNlRGF0YShkYXRhKTtcbiAgICAgIHNhaWxlcl9wcml2YXRlLnNhZmVFeGVjKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FsbGJhY2tNYXBbY2FsbElkXS5zdWNjZXNzKGRhdGEsIGNhbGxJZCk7XG4gICAgICAgIHNhaWxlcl9wcml2YXRlLmNsZWFyQ2FsbE1hcChjYWxsSWQpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBvbkZhaWw6IGZ1bmN0aW9uIChjYWxsSWQsIGRhdGEpIHtcbiAgICAgIGRhdGEgPSBzYWlsZXJfcHJpdmF0ZS5wYXJzZURhdGEoZGF0YSk7XG4gICAgICBzYWlsZXJfcHJpdmF0ZS5zYWZlRXhlYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbGxiYWNrTWFwW2NhbGxJZF0uZmFpbChkYXRhLCBjYWxsSWQpO1xuICAgICAgICBzYWlsZXJfcHJpdmF0ZS5jbGVhckNhbGxNYXAoY2FsbElkKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZmlyZTogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgZGF0YSA9IHNhaWxlcl9wcml2YXRlLnBhcnNlRGF0YShkYXRhKTtcbiAgICAgIHNhaWxlcl9wcml2YXRlLnNhZmVFeGVjKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IGNhbGxiYWNrTWFwW2V2ZW50TmFtZV07XG4gICAgICAgIC8vRE8gTk9UIHN1cHBvcnQgb2ZmIGV2ZW50IGR1cmluZyBmaXJlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2FsbGJhY2tzW2ldLmNhbGwodGhpcywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFja01hcFtldmVudE5hbWVdID0gY2FsbGJhY2tNYXBbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgIGNhbGxiYWNrTWFwW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjayk7XG4gICAgfSxcbiAgICBvZmY6IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBzYWlsZXJfcHJpdmF0ZS5jbGVhckNhbGxNYXAoZXZlbnROYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjYWxsYmFja3MgPSBjYWxsYmFja01hcFtldmVudE5hbWVdO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2tzLnNwbGljZShjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayksIDEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVhZHk6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbigncmVhZHknLCBjYWxsYmFjayk7XG4gICAgfSxcbiAgICBnZXRVc2VySW5mbzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF91c2VySW5mbztcbiAgICB9LFxuICAgIGNvbXBhcmVWZXJzaW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIGlmKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBzYWlsZXJfcHJpdmF0ZS5jaGVja1VwZ3JhZGUodGhpcy5nZXRWZXJzaW9uKCksIGFyZ3NbMF0pO1xuICAgICAgfWVsc2UgaWYoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHNhaWxlcl9wcml2YXRlLmNoZWNrVXBncmFkZShhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB2YXIgZXJyb3IgPSAn44CQU2FpbGVy44CRJyArICdjb21wYXJlVmVyc2lvbjogUGFyYW1zIG5vdCBtYXRjaCEnO1xuICAgICAgICBzYWlsZXJfcHJpdmF0ZS5sb2coZXJyb3IpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0VmVyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZihfdXNlckluZm8gJiYgX3VzZXJJbmZvLmFwcHZlcil7XG4gICAgICAgIF92ZXJzaW9uID0gX3VzZXJJbmZvLmFwcHZlcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfdmVyc2lvbjtcbiAgICB9LFxuICAgIHVwZGF0ZVVzZXJJbmZvOiBmdW5jdGlvbiAodXNlckluZm8pIHtcbiAgICAgICAgc2FpbGVyX3ByaXZhdGUuc2ltcGxlRXh0ZW5kKF91c2VySW5mbywgdXNlckluZm8pO1xuICAgIH0sXG4gICAgbG9nOiBzYWlsZXJfcHJpdmF0ZS5sb2dcbiAgfVxuICAvL2J1aWxkIGFjdGlvbiBmdW5jdGlvbiBcbiAgYWN0aW9uTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICBzYWlsZXJfcHVibGljW2FjdGlvbl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICBhcmdzLnVuc2hpZnQoYWN0aW9uKTtcbiAgICAgIGlmKGFjdGlvbiA9PT0gJ29wZW4nIHx8IGFjdGlvbiA9PT0gJ3JlZGlyZWN0Jykge1xuICAgICAgICBhcmdzWzFdID0gc2FpbGVyX3ByaXZhdGUuaGFuZGxlVXJsKGFyZ3NbMV0pO1xuICAgICAgfVxuICAgICAgc2FpbGVyX3B1YmxpYy5uYXRpdmVDYWxsLmFwcGx5KHNhaWxlcl9wdWJsaWMsIGFyZ3MpO1xuICAgIH07IFxuICB9KTtcblxuICBzYWlsZXJfcHVibGljLm9uKCdzZXRVc2VySW5mbycsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3VzZXJJbmZvID0gZGF0YTtcbiAgICBfdXNlckluZm8uaW5BcHAgPSAoX3VzZXJJbmZvLmluQXBwID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UpO1xuICB9KTtcbiAgd2luLlNhaWxlciA9IHNhaWxlcl9wdWJsaWM7IFxufSkod2luZG93KVxuIl19
