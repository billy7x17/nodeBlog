/**
 * Created by Administrator on 2017/1/26.
 */
module.exports = pubParam;
var Uuid = require('uuid');
var aliyunSettings = require('../aliyunSettings');
var crypto = require('crypto');
function pubParam() {

}

pubParam.generateSign = function (params) {

    function percentEncode(originString) {

        var result = new String("");

        // console.log('origin string: ' + originString);

        for (var index in originString) {
            // console.log('origin char: ' + originString[index]);
            if (originString[index].match('[A-Za-z0-9\-_\.~]')) {
                result += originString[index];
            } else if (originString[index].match('["{:\,}\']')) {
                result += '%25' + originString[index].charCodeAt(0).toString(16).toUpperCase();
            } else {
                // console.log('encode char: ' + '%' + originString[index].charCodeAt(0).toString(16));
                result += '%' + originString[index].charCodeAt(0).toString(16).toUpperCase();
            }
        }
        return result;
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
        var time = date.getUTCFullYear() + '-' + fillOneZero(date.getUTCMonth() + 1) + '-'
            + fillOneZero(date.getUTCDate()) + 'T' + fillOneZero(date.getUTCHours()) + ':'
            + fillOneZero(date.getUTCMinutes()) + ':' + fillOneZero(date.getUTCSeconds()) + 'Z';
        return time;
    }

    /* 配置文件赋值 */
    params.AccessKeyId = aliyunSettings.accessKeyId;
    params.SignName = aliyunSettings.sms_signName;
    params.TemplateCode = aliyunSettings.sms_templateCode;
    params.Version = aliyunSettings.version;
    params.SignatureVersion = aliyunSettings.signatureVersion;
    params.SignatureNonce = Uuid.v4();
    params.SignatureMethod = aliyunSettings.signatureMethod;
    params.Timestamp = generateUTCTime();

    var signString = "POST&" + percentEncode("/") + "&";

    var unsortedKeys = new Array;

    for (var key in params) {
        console.log(key);
        unsortedKeys.push(key);
    }

    console.log('keys:' + unsortedKeys);

    var sortedKeys = unsortedKeys.sort();

    console.log('sorted keys:' + sortedKeys);

    for (var key in sortedKeys) {
        signString += percentEncode(encodeURIComponent(sortedKeys[key])) + percentEncode("=") + percentEncode(encodeURIComponent(params[sortedKeys[key]]));
        if (key != sortedKeys.length - 1) {
            signString += percentEncode("&");
        }
    }

    console.log(signString);

    return crypto.createHmac('sha1', aliyunSettings.accessKeySecret + "&").update(signString).digest().toString('base64');
};

console.log(encodeURIComponent('标签测试'));

var testStr = pubParam.generateSign({
    'Action': 'SingleSendSms',
    'RecNum': '18842330271',
    'ParamString': '{"name":"n","emailAddr":"a@gmail.com","subject":"test","msg":"test"}',
    'Format': 'JSON'

});
console.log(testStr);