/**
 * Created by Administrator on 2017/1/26.
 */
module.exports = pubParam;
var encoding = require("encoding");
var aliyunSettings = require('../aliyunSettings');
function pubParam() {

}

pubParam.generateSign = function (params) {

    function percentEncode(originString) {

        var result = new String("");

        for (var char in originString) {
            if (char in ['A', 'B', 'C']) {//TODO: all words
                result += originString;
            }
            else {
                result += '%' + originString.charCodeAt().toString(16);
            }
        }
        return result;
    }

    /* 配置文件赋值 */
    params.accessKeyId = aliyunSettings.accessKeyId;
    params.sms_signName = aliyunSettings.sms_signName;
    params.sms_templateCode = aliyunSettings.sms_templateCode;

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
        signString += sortedKeys[key] + percentEncode("=") + percentEncode(params[sortedKeys[key]]);
    }

    return signString;
};

var testStr = pubParam.generateSign({'a': 'avalue', 'b': 'bvalue'});
console.log(testStr);