'use strict'        //严格模式
//引入模块
var Koa=require('koa');
// var sha1=require('sha1');
var gg=require('./wechat/g.js');


//初始化配置
var config={
    wechat:{
        appID:'your appID',
        appsecret:'your appsecret',
        token:'ataolanodejs'
    }
};

//创建Koa对象
var app=new Koa();
// //验证逻辑部分
// app.use(function *(next) {
//     //console.log(this.query);      //返回的是一个对象  微信发过来的包是xml格式的
//     var token=config.wechat.token;
//     var signature=this.query.signature;
//     var nonce=this.query.nonce;
//     var timestamp=this.query.timestamp;
//     var echostr=this.query.echostr;
//     var str=[token,timestamp,nonce].sort().join('');
//     // console.log("sort()后的结果： "+[token,timestamp,nonce].sort());
//     // console.log("join()后的结果： "+[token,timestamp,nonce].sort().join(''));
//     // console.log("字典排序后的结果： "+str);
//     var sha=sha1(str);
//    // console.log("sha1加密后的结果："+sha);
//     if(sha==signature){
//         this.body=echostr+'';
//     }else{
//         this.body='Maybe somewhere hava error,plese check it';
//     }
// });

app.use(gg(config.wechat));

app.listen(1234);
console.log('Listening is on port 1234,please visit http://localhost:1234');


// Wed, 25 Jul 2018 03:07:58 GMT koa deprecated Support for generators will be removed in v3. See the documentation for examples of how to convert old middleware https://github.com/koajs/koa/blob/master/docs/migration.md at app.js:40:5
