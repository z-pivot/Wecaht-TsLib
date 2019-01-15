"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_js_1 = require("../../plugins/es6-promise.js");
var z_http_error_reply_1 = require("z-http-error-reply");
var z_http_error_1 = require("z-http-error");
var z_util_1 = require("../../utils/z.util");
var z_http_reply_default_1 = require("z-http-reply-default");
var z_log_util_1 = require("../../utils/z-log.util");
var ZHttpService = (function () {
    function ZHttpService() {
    }
    ZHttpService.prototype.get = function (url, zOption, result) {
        zOption = zOption || {};
        zOption.type = 'get';
        zOption.url = url || zOption.url;
        zOption.result = result || zOption.result;
        return this.request(zOption);
    };
    ZHttpService.prototype.post = function (url, zOption, result) {
        zOption = zOption || {};
        zOption.type = 'post';
        zOption.url = url || zOption.url;
        zOption.result = result || zOption.result;
        return this.request(zOption);
    };
    ZHttpService.prototype.getMultiRequest = function (requestMulti) {
        if (requestMulti.option && requestMulti.option.length > 0) {
            requestMulti.option.forEach(function (value) { return value.type = 'get'; });
        }
        return this.requestMulti(requestMulti);
    };
    ZHttpService.prototype.postMultiRequest = function (requestMulti) {
        if (requestMulti.option && requestMulti.option.length > 0) {
            requestMulti.option.forEach(function (value) { return value.type = 'post'; });
        }
        return this.requestMulti(requestMulti);
    };
    ZHttpService.prototype.requestMulti = function (multiRequestOption) {
        var obArray = [];
        if (!multiRequestOption.isHideLoading) {
            wx.showLoading({
                title: multiRequestOption.loadingMsg,
            });
        }
        ;
        if (multiRequestOption.option && multiRequestOption.option.length > 0) {
            for (var _i = 0, _a = multiRequestOption.option; _i < _a.length; _i++) {
                var request = _a[_i];
                request.result = request.result || {};
                obArray.push(this.requestObservable(request));
            }
        }
        return es6_promise_js_1.Promise.all(obArray)
            .then(function (obj) {
            wx.hideLoading();
            for (var i = 0; i < obj.length; i++) {
                var item = obj[i];
                if (multiRequestOption.option[i].result.success) {
                    multiRequestOption.option[i].result.success(item);
                }
                if (multiRequestOption.option[i].result.complete) {
                    multiRequestOption.option[i].result.complete();
                }
            }
        }).catch(function (error) {
            wx.hideLoading();
            for (var i = 0; i < multiRequestOption.option.length; i++) {
                if (multiRequestOption.option[i].result.error) {
                    multiRequestOption.option[i].result.error(error);
                }
                if (multiRequestOption.option[i].result.complete) {
                    multiRequestOption.option[i].result.complete();
                }
            }
        });
    };
    ZHttpService.prototype.request = function (zOption) {
        zOption.result = zOption.result || {};
        if (!zOption.isHideLoading) {
            wx.showLoading({
                title: zOption.loadingMsg,
            });
        }
        return this.requestObservable(zOption)
            .then(this.successResult(zOption.result))
            .catch(this.errorResult(zOption.result));
    };
    ZHttpService.prototype.requestObservable = function (zOption) {
        var _this = this;
        zOption.type = zOption.type || 'post';
        zOption.header = this.processHeader(zOption.header);
        zOption.zreply = zOption.zreply || new z_http_reply_default_1.ZHttpReplyDefault();
        z_log_util_1.ZLogUtil.log("\n===================================================================");
        z_log_util_1.ZLogUtil.log("ADDR:" + zOption.url);
        z_log_util_1.ZLogUtil.log(zOption.body ? "APPLY:" + JSON.stringify(zOption.body) : "");
        return new es6_promise_js_1.Promise(function (resolve, reject) {
            wx.request({
                url: zOption.url,
                data: zOption.body,
                header: zOption.header,
                method: zOption.type,
                success: function (res) {
                    _this.processResponse(zOption.zreply, res, zOption.isHideLoading, resolve, reject);
                },
                fail: function (error) {
                    _this.processCatch(zOption.isHideToastError, error);
                }
            });
        });
    };
    ZHttpService.prototype.processHeader = function (header) {
        return {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        };
    };
    ZHttpService.prototype.processResponse = function (zreply, res, isHideLoading, resolve, reject) {
        var jsonObj = res;
        z_log_util_1.ZLogUtil.log("===================================================================");
        z_log_util_1.ZLogUtil.log("REPLY:" + JSON.stringify(jsonObj));
        if (zreply.isSuccess(jsonObj[zreply.codeKey])) {
            if (jsonObj[zreply.dataKey]) {
                resolve(jsonObj[zreply.dataKey]);
            }
            else {
                resolve(jsonObj);
            }
            return;
        }
        if (!zreply.isSuccess(jsonObj[zreply.codeKey]) && (jsonObj[zreply.codeKey] || jsonObj[zreply.msgKey])) {
            reject(this.processCatch(isHideLoading, new z_http_error_1.ZHttpError(jsonObj.code, jsonObj.msg)));
        }
        else {
            reject(this.processCatch(isHideLoading, new z_http_error_1.ZHttpError(1001, "数据不符合规范：\n" + JSON.stringify(res))));
        }
    };
    ZHttpService.prototype.processCatch = function (isHideToastError, error) {
        var errorObj;
        if (error instanceof z_http_error_1.ZHttpError || (z_util_1.ZUtil.isValid(error.code) && z_util_1.ZUtil.isValid(error.errMsg))) {
            errorObj = this.getErrorReply(error.errMsg, error.code);
        }
        else {
            errorObj = this.getErrorReply(error.errMsg, -1);
        }
        if (!isHideToastError) {
            var msg = z_util_1.ZUtil.isValid(errorObj.code) ? errorObj.msg + "(" + errorObj.code + ")" : errorObj.msg;
            wx.showToast({
                title: msg,
            });
        }
        return errorObj;
    };
    ZHttpService.prototype.getErrorReply = function (message, code) {
        var errorObj = new z_http_error_reply_1.ZHttpErrorReply();
        errorObj.code = code;
        errorObj.msg = (message == null) ? "null" : message;
        return errorObj;
    };
    ZHttpService.prototype.successResult = function (result) {
        return function (obj) {
            wx.hideLoading();
            if (result.success) {
                result.success(obj);
            }
            if (result.complete) {
                result.complete();
            }
        };
    };
    ZHttpService.prototype.errorResult = function (result) {
        return function (error) {
            wx.hideLoading();
            if (result.error) {
                result.error(error);
            }
            if (result.complete) {
                result.complete();
            }
        };
    };
    return ZHttpService;
}());
exports.ZHttpService = ZHttpService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiei1odHRwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ6LWh0dHAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLCtEQUF1RDtBQUN2RCx5REFBcUQ7QUFHckQsNkNBQTBDO0FBQzFDLDZDQUEyQztBQUMzQyw2REFBeUQ7QUFHekQscURBQWtEO0FBRWxEO0lBQUE7SUE0UEEsQ0FBQztJQW5QVSwwQkFBRyxHQUFWLFVBQWMsR0FBVyxFQUFFLE9BQXVCLEVBQUUsTUFBc0I7UUFDdEUsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDeEIsT0FBTyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDckIsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUNqQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBU00sMkJBQUksR0FBWCxVQUFlLEdBQVcsRUFBRSxPQUF1QixFQUFFLE1BQXNCO1FBQ3ZFLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDakMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUMxQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQU9NLHNDQUFlLEdBQXRCLFVBQXVCLFlBQXFDO1FBQ3hELElBQUksWUFBWSxDQUFDLE1BQU0sSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkQsWUFB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QUM7SUFDTixDQUFDO0lBT08sa0NBQVcsR0FBbkIsVUFBdUIsTUFBc0I7UUFDekMsT0FBTyxVQUFDLEtBQVU7WUFDZCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakIsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdkI7WUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNyQjtRQUNMLENBQUMsQ0FBQztJQUNOLENBQUM7SUFDTCxtQkFBQztBQUFELENBQUMsQUE1UEQsSUE0UEM7QUE1UFksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGh0dHAg5pyN5Yqh57G7XG4gKi9cbmltcG9ydCB7IFByb21pc2UgfSBmcm9tICcuLi8uLi9wbHVnaW5zL2VzNi1wcm9taXNlLmpzJztcbmltcG9ydCB7IFpIdHRwRXJyb3JSZXBseSB9IGZyb20gXCJ6LWh0dHAtZXJyb3ItcmVwbHlcIjtcbmltcG9ydCB7IFpIdHRwUmVzdWx0IH0gZnJvbSBcInotaHR0cC1yZXN1bHRcIjtcbmltcG9ydCB7IFpIdHRwT3B0aW9uIH0gZnJvbSAnei1odHRwLW9wdGlvbic7XG5pbXBvcnQgeyBaSHR0cEVycm9yIH0gZnJvbSAnei1odHRwLWVycm9yJztcbmltcG9ydCB7IFpVdGlsIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3oudXRpbFwiO1xuaW1wb3J0IHsgWkh0dHBSZXBseURlZmF1bHQgfSBmcm9tIFwiei1odHRwLXJlcGx5LWRlZmF1bHRcIjtcbmltcG9ydCB7IFpIdHRwUmVwbHkgfSBmcm9tIFwiei1odHRwLXJlcGx5XCI7XG5pbXBvcnQgeyBaSHR0cE11bHRpUmVxdWVzdE9wdGlvbiB9IGZyb20gXCJ6LWh0dHAtbXVsdGktcmVxdWVzdC1vcHRpb25cIjtcbmltcG9ydCB7IFpMb2dVdGlsIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3otbG9nLnV0aWxcIjtcblxuZXhwb3J0IGNsYXNzIFpIdHRwU2VydmljZSB7XG5cbiAgICAvKipcbiAgICAgKiBnZXTor7fmsYIo5LyY5YWI5L2/55SodXJs77yMcmVzdWx05Y+C5pWw77yM5aaC5p6c5LiN6K6+572u77yM5YiZ5L2/55Soek9wdGlvbuS4reeahHVybO+8jHJlc3VsdCwg5aaC5p6cek9wdGlvbuS4uuepuu+8jOWImeaWsOW7unpPcHRpb24pXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdXJsICAgICAgICAgICAgICAgICAgIOivt+axguWcsOWdgFxuICAgICAqIEBwYXJhbSB6T3B0aW9uICAgICAgICAgICAgICAg6K+35rGC5Y+C5pWwIHtAbGluayBaSHR0cEVycm9yfVxuICAgICAqIEBwYXJhbSByZXN1bHQgICAgICAgICAgICAgICAg5Zue6LCD5o6l5Y+jIHtAbGluayBaSHR0cFJlc3VsdH1cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0PFQ+KHVybDogc3RyaW5nLCB6T3B0aW9uOiBaSHR0cE9wdGlvbjxUPiwgcmVzdWx0OiBaSHR0cFJlc3VsdDxUPikge1xuICAgICAgICB6T3B0aW9uID0gek9wdGlvbiB8fCB7fTtcbiAgICAgICAgek9wdGlvbi50eXBlID0gJ2dldCc7XG4gICAgICAgIHpPcHRpb24udXJsID0gdXJsIHx8IHpPcHRpb24udXJsO1xuICAgICAgICB6T3B0aW9uLnJlc3VsdCA9IHJlc3VsdCB8fCB6T3B0aW9uLnJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh6T3B0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwb3N06K+35rGCKOS8mOWFiOS9v+eUqHVybO+8jHJlc3VsdOWPguaVsO+8jOWmguaenOS4jeiuvue9ru+8jOWImeS9v+eUqHpPcHRpb27kuK3nmoR1cmzvvIxyZXN1bHQsIOWmguaenHpPcHRpb27kuLrnqbrvvIzliJnmlrDlu7p6T3B0aW9uKVxuICAgICAqXG4gICAgICogQHBhcmFtIHVybCAgICAgICAgICAgICAgICAgICDor7fmsYLlnLDlnYBcbiAgICAgKiBAcGFyYW0gek9wdGlvbiAgICAgICAgICAgICAgIOivt+axguWPguaVsCB7QGxpbmsgWkh0dHBFcnJvcn1cbiAgICAgKiBAcGFyYW0gcmVzdWx0ICAgICAgICAgICAgICAgIOWbnuiwg+aOpeWPoyB7QGxpbmsgWkh0dHBSZXN1bHR9XG4gICAgICovXG4gICAgcHVibGljIHBvc3Q8VD4odXJsOiBzdHJpbmcsIHpPcHRpb246IFpIdHRwT3B0aW9uPFQ+LCByZXN1bHQ6IFpIdHRwUmVzdWx0PFQ+KSB7XG4gICAgICAgIHpPcHRpb24gPSB6T3B0aW9uIHx8IHt9O1xuICAgICAgICB6T3B0aW9uLnR5cGUgPSAncG9zdCc7XG4gICAgICAgIHpPcHRpb24udXJsID0gdXJsIHx8IHpPcHRpb24udXJsO1xuICAgICAgICB6T3B0aW9uLnJlc3VsdCA9IHJlc3VsdCB8fCB6T3B0aW9uLnJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh6T3B0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICog5ZCM5pe25Y+R6LW35aSa5LiqR2V06K+35rGC77yMIOaMieiHquWumuS5ieWbnuiwg+aWueazlei/m+ihjOWbnuiwg++8jOWbnuiwg+mhuuW6j+aMieWPkei1t+mhuuW6j+OAguacieS4gOS4quaOpeWPo+Wksei0pe+8jOWImeaJgOacieivt+axguWksei0peOAglxuICAgKiBAcGFyYW0ge1pIdHRwTXVsdGlSZXF1ZXN0T3B0aW9uW119IHJlcXVlc3RNdWx0aVxuICAgKiBAcmV0dXJucyB7U3Vic2NyaXB0aW9ufVxuICAgKi9cbiAgICBwdWJsaWMgZ2V0TXVsdGlSZXF1ZXN0KHJlcXVlc3RNdWx0aTogWkh0dHBNdWx0aVJlcXVlc3RPcHRpb24pIHtcbiAgICAgICAgaWYgKHJlcXVlc3RNdWx0aS5vcHRpb24gJiYgcmVxdWVzdE11bHRpLm9wdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXF1ZXN0TXVsdGkub3B0aW9uLmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHZhbHVlLnR5cGUgPSAnZ2V0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdE11bHRpKHJlcXVlc3RNdWx0aSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAqIOWQjOaXtuWPkei1t+WkmuS4qlBvc3Tor7fmsYLvvIwg5bey5oyJ6Ieq5a6a5LmJ5Zue6LCD5pa55rOV6L+b6KGM5Zue6LCD77yM5Zue6LCD5pWw5o2u5pyq5pWw57uE77yM5Zue6LCD6aG65bqP5oyJ5Y+R6LW36aG65bqPXG4gICAqIEBwYXJhbSB7Wkh0dHBNdWx0aVJlcXVlc3RPcHRpb259IHJlcXVlc3RNdWx0aVxuICAgKiBAcmV0dXJucyB7U3Vic2NyaXB0aW9ufVxuICAgKi9cbiAgICBwdWJsaWMgcG9zdE11bHRpUmVxdWVzdChyZXF1ZXN0TXVsdGk6IFpIdHRwTXVsdGlSZXF1ZXN0T3B0aW9uKSB7XG4gICAgICAgIGlmIChyZXF1ZXN0TXVsdGkub3B0aW9uICYmIHJlcXVlc3RNdWx0aS5vcHRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVxdWVzdE11bHRpLm9wdGlvbi5mb3JFYWNoKCh2YWx1ZTogYW55KSA9PiB2YWx1ZS50eXBlID0gJ3Bvc3QnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0TXVsdGkocmVxdWVzdE11bHRpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlkIzml7blj5HotbflpJrkuKrnvZHnu5zor7fmsYLvvIwg5bey5oyJ6Ieq5a6a5LmJ5Zue6LCD5pa55rOV6L+b6KGM5Zue6LCD77yM5Zue6LCD5pWw5o2u5pyq5pWw57uE77yM5Zue6LCD6aG65bqP5oyJ5Y+R6LW36aG65bqPXG4gICAgICogQHBhcmFtIHtaSHR0cE11bHRpUmVxdWVzdE9wdGlvbltdfSBtdWx0aVJlcXVlc3RPcHRpb25cbiAgICAgKiBAcmV0dXJucyB7U3Vic2NyaXB0aW9ufVxuICAgICAqL1xuICAgIHB1YmxpYyByZXF1ZXN0TXVsdGkobXVsdGlSZXF1ZXN0T3B0aW9uOiBaSHR0cE11bHRpUmVxdWVzdE9wdGlvbikge1xuICAgICAgICBsZXQgb2JBcnJheSA9IFtdO1xuICAgICAgICBpZiAoIW11bHRpUmVxdWVzdE9wdGlvbi5pc0hpZGVMb2FkaW5nKSB7XG4gICAgICAgICAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IG11bHRpUmVxdWVzdE9wdGlvbi5sb2FkaW5nTXNnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChtdWx0aVJlcXVlc3RPcHRpb24ub3B0aW9uICYmIG11bHRpUmVxdWVzdE9wdGlvbi5vcHRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgcmVxdWVzdCBvZiBtdWx0aVJlcXVlc3RPcHRpb24ub3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZXN1bHQgPSByZXF1ZXN0LnJlc3VsdCB8fCB7fTtcbiAgICAgICAgICAgICAgICBvYkFycmF5LnB1c2godGhpcy5yZXF1ZXN0T2JzZXJ2YWJsZShyZXF1ZXN0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL+iuoeaVsOWbnuiwg++8jOWbnuiwg+WvueW6lOivt+axgueahOWvueW6lOWbnuiwg++8jOWmguaenOWbnuiwg+WFqOmDqOWujOaIkO+8jOWImemakOiXj+i/m+W6puadoVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwob2JBcnJheSlcbiAgICAgICAgICAgIC50aGVuKChvYmo6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBvYmpbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aVJlcXVlc3RPcHRpb24ub3B0aW9uW2ldLnJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aVJlcXVlc3RPcHRpb24ub3B0aW9uW2ldLnJlc3VsdC5zdWNjZXNzKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aVJlcXVlc3RPcHRpb24ub3B0aW9uW2ldLnJlc3VsdC5jb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlSZXF1ZXN0T3B0aW9uLm9wdGlvbltpXS5yZXN1bHQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNhdGNoKFxuICAgICAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXVsdGlSZXF1ZXN0T3B0aW9uLm9wdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG11bHRpUmVxdWVzdE9wdGlvbi5vcHRpb25baV0ucmVzdWx0LmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlSZXF1ZXN0T3B0aW9uLm9wdGlvbltpXS5yZXN1bHQuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG11bHRpUmVxdWVzdE9wdGlvbi5vcHRpb25baV0ucmVzdWx0LmNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlSZXF1ZXN0T3B0aW9uLm9wdGlvbltpXS5yZXN1bHQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog572R57uc6K+35rGC77yMIOW3suaMieiHquWumuS5ieWbnuiwg+aWueazlei/m+ihjOWbnuiwg1xuICAgICAqIEBwYXJhbSB7Wkh0dHBPcHRpb259IHpPcHRpb25cbiAgICAgKiBAcmV0dXJucyB7U3Vic2NyaXB0aW9ufVxuICAgICAqL1xuICAgIHB1YmxpYyByZXF1ZXN0PFQ+KHpPcHRpb246IFpIdHRwT3B0aW9uPFQ+KSB7XG4gICAgICAgIHpPcHRpb24ucmVzdWx0ID0gek9wdGlvbi5yZXN1bHQgfHwge307XG4gICAgICAgIGlmICghek9wdGlvbi5pc0hpZGVMb2FkaW5nKSB7XG4gICAgICAgICAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHpPcHRpb24ubG9hZGluZ01zZyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3RPYnNlcnZhYmxlKHpPcHRpb24pXG4gICAgICAgICAgICAudGhlbih0aGlzLnN1Y2Nlc3NSZXN1bHQoek9wdGlvbi5yZXN1bHQpKVxuICAgICAgICAgICAgLmNhdGNoKHRoaXMuZXJyb3JSZXN1bHQoek9wdGlvbi5yZXN1bHQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnvZHnu5zor7fmsYLvvIzlpITnkIblrozmiYDmnInkuJrliqHmlbDmja7vvIzmnKrmjInoh6rlrprkuYnlm57osIPmlrnms5Xlm57osIPvvIzov5Tlm55PYnNlcnZhYmxl77yM5Y+v5Lul6L+b6KGM6L+b5LiA5q2l5aSE55CGXG4gICAgICogQHBhcmFtIHtaSHR0cE9wdGlvbn0gek9wdGlvblxuICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPFQ+fVxuICAgICAqL1xuICAgIHB1YmxpYyByZXF1ZXN0T2JzZXJ2YWJsZTxUPih6T3B0aW9uOiBaSHR0cE9wdGlvbjxUPikge1xuICAgICAgICB6T3B0aW9uLnR5cGUgPSB6T3B0aW9uLnR5cGUgfHwgJ3Bvc3QnO1xuICAgICAgICB6T3B0aW9uLmhlYWRlciA9IHRoaXMucHJvY2Vzc0hlYWRlcih6T3B0aW9uLmhlYWRlcik7IC8v5re75Yqg6YCa55SoaGVhZGVyXG4gICAgICAgIHpPcHRpb24uenJlcGx5ID0gek9wdGlvbi56cmVwbHkgfHwgbmV3IFpIdHRwUmVwbHlEZWZhdWx0KCk7XG4gICAgICAgIFpMb2dVdGlsLmxvZyhcIlxcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIik7XG4gICAgICAgIFpMb2dVdGlsLmxvZyhcIkFERFI6XCIgKyB6T3B0aW9uLnVybCk7XG4gICAgICAgIFpMb2dVdGlsLmxvZyh6T3B0aW9uLmJvZHkgPyBcIkFQUExZOlwiICsgSlNPTi5zdHJpbmdpZnkoek9wdGlvbi5ib2R5KSA6IFwiXCIpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogek9wdGlvbi51cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogek9wdGlvbi5ib2R5LFxuICAgICAgICAgICAgICAgIGhlYWRlcjogek9wdGlvbi5oZWFkZXIsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiB6T3B0aW9uLnR5cGUsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmVzcG9uc2Uoek9wdGlvbi56cmVwbHksIHJlcywgek9wdGlvbi5pc0hpZGVMb2FkaW5nLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmFpbDogZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NDYXRjaCh6T3B0aW9uLmlzSGlkZVRvYXN0RXJyb3IsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+W6buY6K6k55qESGVhZGVy5L+h5oGvXG4gICAgICovXG4gICAgcHVibGljIHByb2Nlc3NIZWFkZXIoaGVhZGVyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JyxcbiAgICAgICAgICAgIC8vICdYLVRILVRPS0VOJzogVXNlclNlcnZpY2UuZ2V0VG9rZW4oKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5aSE55CG6L+U5Zue5L+h5oGvXG4gICAgICogQHBhcmFtIHpyZXBseSAgIOiHquWumuS5iee7k+aenOWvueixoVxuICAgICAqIEBwYXJhbSByZXMgICAgICBodHRw5ZON5bqU5a+56LGhXG4gICAgICovXG4gICAgcHVibGljIHByb2Nlc3NSZXNwb25zZSh6cmVwbHk6IFpIdHRwUmVwbHksIHJlczogYW55LCBpc0hpZGVMb2FkaW5nOiBib29sZWFuLCByZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XG4gICAgICAgIGxldCBqc29uT2JqID0gcmVzOyAvL+atpOWkhGpzb25PYmrkuIDlrprmnInlgLzvvIzlpoLmnpzovazmjaLplJnor6/vvIzkvJrlho1wcm9jZXNzQ2F0Y2jkuK3lpITnkIZcbiAgICAgICAgWkxvZ1V0aWwubG9nKFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKTtcbiAgICAgICAgWkxvZ1V0aWwubG9nKFwiUkVQTFk6XCIgKyBKU09OLnN0cmluZ2lmeShqc29uT2JqKSk7XG5cbiAgICAgICAgaWYgKHpyZXBseS5pc1N1Y2Nlc3MoanNvbk9ialt6cmVwbHkuY29kZUtleV0pKSB7XG4gICAgICAgICAgICBpZiAoanNvbk9ialt6cmVwbHkuZGF0YUtleV0pIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGpzb25PYmpbenJlcGx5LmRhdGFLZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uT2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghenJlcGx5LmlzU3VjY2Vzcyhqc29uT2JqW3pyZXBseS5jb2RlS2V5XSkgJiYgKGpzb25PYmpbenJlcGx5LmNvZGVLZXldIHx8IGpzb25PYmpbenJlcGx5Lm1zZ0tleV0pKSB7IC8v5pivanNvbuWvueixoe+8jOS9huaYr+S4jeaYr+e6puWumuS4reeahOaVsOaNrlxuICAgICAgICAgICAgcmVqZWN0KHRoaXMucHJvY2Vzc0NhdGNoKGlzSGlkZUxvYWRpbmcsIG5ldyBaSHR0cEVycm9yKGpzb25PYmouY29kZSwganNvbk9iai5tc2cpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QodGhpcy5wcm9jZXNzQ2F0Y2goaXNIaWRlTG9hZGluZywgbmV3IFpIdHRwRXJyb3IoMTAwMSwgXCLmlbDmja7kuI3nrKblkIjop4TojIPvvJpcXG5cIiArIEpTT04uc3RyaW5naWZ5KHJlcykpKSkgLy/op6PmnpDnmoRqc29u5pWw5o2u5LiN56ym5ZCI6KeE6IyDXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlpITnkIblvILluLjkv6Hmga9cbiAgICAgKiBAcGFyYW0gaXNIaWRlVG9hc3RFcnJvciAgICAgIOaYr+WQpuaYvuekumVycm9yVG9hc3RcbiAgICAgKiBAcGFyYW0gZXJyb3IgICAgICAgICAgICAgICAgIOmUmeivr+WvueixoVxuICAgICAqL1xuICAgIHB1YmxpYyBwcm9jZXNzQ2F0Y2goaXNIaWRlVG9hc3RFcnJvcjogYm9vbGVhbiwgZXJyb3I6IGFueSkge1xuICAgICAgICBsZXQgZXJyb3JPYmo7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFpIdHRwRXJyb3IgfHwgKFpVdGlsLmlzVmFsaWQoZXJyb3IuY29kZSkgJiYgWlV0aWwuaXNWYWxpZChlcnJvci5lcnJNc2cpKSkgeyAvL+iHquW3seWumuS5ieeahOmUmeivryBpbnRhbmNlb2bliKTmlq3kuI3lh7rmnaXvvJ9cblxuICAgICAgICAgICAgZXJyb3JPYmogPSB0aGlzLmdldEVycm9yUmVwbHkoZXJyb3IuZXJyTXNnLCBlcnJvci5jb2RlKTsgLy/mnI3liqHlmajov5Tlm57nmoTplJnor69cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yT2JqID0gdGhpcy5nZXRFcnJvclJlcGx5KGVycm9yLmVyck1zZywgLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0hpZGVUb2FzdEVycm9yKSB7XG4gICAgICAgICAgICBsZXQgbXNnID0gWlV0aWwuaXNWYWxpZChlcnJvck9iai5jb2RlKSA/IGVycm9yT2JqLm1zZyArIFwiKFwiICsgZXJyb3JPYmouY29kZSArIFwiKVwiIDogZXJyb3JPYmoubXNnO1xuICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICB0aXRsZTogbXNnLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJyb3JPYmo7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+W57uE5ZCIRXJyb3JSZXBseeWvueixoVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0RXJyb3JSZXBseShtZXNzYWdlOiBzdHJpbmcsIGNvZGU/OiBudW1iZXIpOiBaSHR0cEVycm9yUmVwbHkge1xuICAgICAgICBsZXQgZXJyb3JPYmogPSBuZXcgWkh0dHBFcnJvclJlcGx5KCk7XG4gICAgICAgIGVycm9yT2JqLmNvZGUgPSBjb2RlOyAvL+iHquWumuS5iemUmeivr+agh+ivhlxuICAgICAgICBlcnJvck9iai5tc2cgPSAobWVzc2FnZSA9PSBudWxsKSA/IFwibnVsbFwiIDogbWVzc2FnZTtcbiAgICAgICAgcmV0dXJuIGVycm9yT2JqO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWkhOeQhuaIkOWKn+Wbnuiwg1xuICAgICAqIEBwYXJhbSB7SHR0cFJlc3VsdDxUPn0gcmVzdWx0XG4gICAgICogQHJldHVybnMgeyhvYmopID0+IHZvaWR9XG4gICAgICovXG4gICAgcHJpdmF0ZSBzdWNjZXNzUmVzdWx0PFQ+KHJlc3VsdDogWkh0dHBSZXN1bHQ8VD4pIHtcbiAgICAgICAgcmV0dXJuIChvYmo6IGFueSkgPT4ge1xuICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zdWNjZXNzKG9iaik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlpITnkIbplJnor6/lm57osINcbiAgICAgKiBAcGFyYW0ge0h0dHBSZXN1bHQ8VD59IHJlc3VsdFxuICAgICAqIEByZXR1cm5zIHsoZXJyb3IpID0+IHZvaWR9XG4gICAgICovXG4gICAgcHJpdmF0ZSBlcnJvclJlc3VsdDxUPihyZXN1bHQ6IFpIdHRwUmVzdWx0PFQ+KSB7XG4gICAgICAgIHJldHVybiAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzdWx0LmNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSJdfQ==