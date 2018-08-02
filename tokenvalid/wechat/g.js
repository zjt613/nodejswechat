//  Generator的缩写   构造一个中间件

'use strict';       //严格模式
var sha1=require('sha1');
var Promise=require('bluebird');
var request=Promise.promisify(require('request'),{multiArgs: true});  //这里是个坑位啊 参考https://segmentfault.com/q/1010000007228715?_ea=1278099
//如果写成var request=Promise.promisify(require('request')）便会报错
var Wechat=require('./wechat');
var util=require('./util');
var getRawBody=require('raw-body');
//返回一个中间件接口
module.exports=function(opts){
    //管理微信接口票据更新
    var wechat=new Wechat(opts);

    //关于token验证
    return function *(next) {
        //console.log(this.query);      //返回的是一个对象  微信发过来的包是xml格式的
        var that=this;
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

        //分别处理微信发过来的Get请求和Post请求
        if(this.method==='GET'){
            //这里为什么是恒等于 因为如果两个等于的话它可能会类型转换发生
            if(sha===signature){
                this.body=echostr+'';
            }else{
                this.body='Maybe somewhere hava error,plese check it';
            }
        }else if(this.method==='POST'){
            if(sha!==signature){
                this.body='Maybe somewhere hava error,plese check it';
                return false;
            }
            var data= yield getRawBody(this.req,{
                length:this.length,
                limit:'1mb',
                encoding:this.charset
            });

            // console.log(data.toString());
            var content=yield util.parseXMLAsync(data);
            // console.log(content);
            var message=util.formatMessage(content.xml);
            console.log(message);
            if(message.MsgType==='event'){
                if(message.Event==='subscribe'){
                    var now=new Date().getTime();
                    that.status=200;
                    that.type='application/xml';
                    var reply = '<xml>' +
                        '<ToUserName><![CDATA[' + message.FromUserName + ']]></ToUserName>' +
                        '<FromUserName><![CDATA[' + message.ToUserName + ']]></FromUserName>' +
                        '<CreateTime>' + now + '</CreateTime>' +
                        '<MsgType><![CDATA[text]]></MsgType>' +
                        '<Content><![CDATA[你好，欢迎关注之江涛！]]></Content>' +
                        '</xml>';
                    console.log(reply);
                    that.body=reply;
                    return;
                }
            }
        }

    }
};



