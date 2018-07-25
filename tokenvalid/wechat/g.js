//  Generator的缩写   构造一个中间件

'use strict';       //严格模式
var sha1=require('sha1');
var Promise=require('bluebird');
var request=Promise.promisify(require('request'),{multiArgs: true});  //这里是个坑位啊 参考https://segmentfault.com/q/1010000007228715?_ea=1278099
//如果写成var request=Promise.promisify(require('request')）便会报错


var prefix='https://api.weixin.qq.com/cgi-bin/';
var api={
    accessToken:prefix+'token?grant_type=client_credential'
};
//创建一个wechat构造函数
function Wechat(opts){
    var that=this;
    this.appID=opts.appID;
    this.appSecret=opts.appSecret;
    this.getAccessToken=opts.getAccessToken;
    this.saveAccessToken=opts.saveAccessToken;
    
    this.getAccessToken().then(function(data){
        try{
            data=JSON.parse(data);
        }catch (e) {
            return that.updateAccessToken();
        }
        if(that.isValidAccessToken(data)){
            Promise.resolve(data);
        }else{
            return that.updateAccessToken();
        }
    }).then(function (data) {
        that.access_token=data.access_token;
        that.expires_in=data.expires_in;
        that.saveAccessToken(data);
    })
}

Wechat.prototype.isValidAccessToken=function(data){
    if(!data||!data.access_token||!data.expires_in){
        return false;
    }

    var access_token=data.access_token;
    var expires_in=data.expires_in;
    var now=(new Date().getTime());

    if(now<expires_in){
        return true;
    }else{
        return false;
    }
};

Wechat.prototype.updateAccessToken=function(){
    var appID=this.appID;
    var appSecret=this.appSecret;
    var url=api.accessToken+'&appid='+appID+'&secret='+appSecret;

    return new Promise(function (resolve,reject) {
        //封装的一个库，request
        request({url:url,json:true}).then(function (response) {
            var data=response[1];
            var now=(new Date().getTime());
            var expires_in=now+(data.expires_in-20)*1000;
            data.expires_in=expires_in;
            resolve(data);
        });
    });

};

//返回一个中间件接口
module.exports=function(opts){
    //管理微信接口票据更新
    var wechat=new Wechat(opts);

    //关于token验证
    return function *(next) {
        //console.log(this.query);      //返回的是一个对象  微信发过来的包是xml格式的
        var token=opts.token;
        var signature=this.query.signature;
        var nonce=this.query.nonce;
        var timestamp=this.query.timestamp;
        var echostr=this.query.echostr;
        var str=[token,timestamp,nonce].sort().join('');
        // console.log("sort()后的结果： "+[token,timestamp,nonce].sort());
        // console.log("join()后的结果： "+[token,timestamp,nonce].sort().join(''));
        // console.log("字典排序后的结果： "+str);
        var sha=sha1(str);
        // console.log("sha1加密后的结果："+sha);
        if(sha==signature){
            this.body=echostr+'';
        }else{
            this.body='Maybe somewhere hava error,plese check it';
        }
    }
};



