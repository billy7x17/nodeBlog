/**
 * 阿里云的相关配置
 *
 * 包括短信、邮箱模板等
 * Created by Billy on 2017/1/25.
 */
module.exports = {
    AccessKeyId: '3UpLTGggFSiYigKJ',
    AccessKeySecret: 'aH1mS9jG866ESl7PmfDC7uS2Q7fFVt',
    SignatureVersion: '1.0',
    SignatureMethod: 'HMAC-SHA1',
    Format: 'JSON',
    smsConfig: {
        SignName: '博客通知',
        TemplateCode: 'SMS_44435024',
        Action: 'SingleSendSms',
        Version: '2016-09-27'
    },
    mailConfig: {
        Version: '2015-11-23',
        Action: 'SingleSendMail',
        AccountName: 'notice@billy119.cn',
        ReplyToAddress: 'true',
        AddressType: '1'
    }
};