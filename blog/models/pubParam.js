/**
 * Created by Administrator on 2017/1/26.
 */
module.exports = pubParam;
var aliyunSettings = require('../aliyunSettings');
function pubParam() {

}

pubParam.generateSign = function (params) {

    /* 配置文件赋值 */
    params.accessKeyId = aliyunSettings.accessKeyId;
    params.sms_signName = aliyunSettings.sms_signName;
    params.sms_templateCode = aliyunSettings.sms_templateCode;

    var signString;

    for (var key in params) {
        signString += key + "%3D" + params.key;
    }
}