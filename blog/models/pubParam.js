/**
 * Created by Administrator on 2017/1/26.
 */
module.exports = pubParam;
var Uuid = require('uuid');
var aliyunSettings = require('../aliyunSettings');
var crypto = require('crypto');
function pubParam() {

}

/**
 * Format: JSON
 * Version: 邮件与短信不同
 * AccessKeyId: 见aliyunSettings.js
 * Signature: 生成
 * SignatureMethod: 见aliyunSettings.js
 * Timestamp: 当前时间，格式固定
 * SignatureVersion: 见aliyunSettings.js
 * SignatureNonce: 随机数，格式固定
 */
pubParam.commonParams = function (params) {
    params.Format = aliyunSettings.Format;
    if (params.Action == aliyunSettings.mailConfig.Action) {
        params.Version = aliyunSettings.mailConfig.Version;
    } else if (params.Action == aliyunSettings.smsConfig.Action) {
        params.Version = aliyunSettings.smsConfig.Version;
    }
    params.AccessKeyId = aliyunSettings.AccessKeyId;
    params.SignatureMethod = aliyunSettings.SignatureMethod;
    params.Timestamp = generateUTCTime();
    params.SignatureVersion = aliyunSettings.SignatureVersion;
    params.SignatureNonce = Uuid.v4();
    params.Signature = generateSign(params);
    return params;
};

/**
 * 生成签名
 * @param params 所有请求参数
 */
function generateSign(params) {

    function percentEncode(originString) {

        var result = "";

        for (var index in originString) {
            if (originString[index].match('[A-Za-z0-9\-_\.~]')) {
                result += originString[index];
            } else if (originString[index].match('["{:\,}\']')) {
                result += '%25' + originString[index].charCodeAt(0).toString(16).toUpperCase();
            } else {
                result += '%' + originString[index].charCodeAt(0).toString(16).toUpperCase();
            }
        }
        return result;
    }

    var signString = "POST&" + percentEncode("/") + "&";

    var unsortedKeys = [];

    for (var paramIter in params) {
        unsortedKeys.push(paramIter);
    }

    var sortedKeys = unsortedKeys.sort();

    for (var keyIter in sortedKeys) {
        signString += percentEncode(encodeURIComponent(sortedKeys[keyIter])) + percentEncode("=") + percentEncode(encodeURIComponent(params[sortedKeys[keyIter]]));
        if (keyIter != sortedKeys.length - 1) {
            signString += percentEncode("&");
        }
    }

    return crypto.createHmac('sha1', aliyunSettings.AccessKeySecret + "&").update(signString).digest().toString('base64');
}

function generateUTCTime() {

    function fillOneZero(number) {
        if (number < 10) {
            return "0" + number;
        } else {
            return number;
        }
    }

    var date = new Date();
    return date.getUTCFullYear() + '-' + fillOneZero(date.getUTCMonth() + 1) + '-'
        + fillOneZero(date.getUTCDate()) + 'T' + fillOneZero(date.getUTCHours()) + ':'
        + fillOneZero(date.getUTCMinutes()) + ':' + fillOneZero(date.getUTCSeconds()) + 'Z';
}