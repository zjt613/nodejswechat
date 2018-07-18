'use strict'        //严格模式
//引入模块
var Koa=require('koa');
var sha1=require('sha1');

//初始化配置
var config={
    wechat:{
        appID:'your appID',
        appsecret:'your appsecret',
        token:'your token'
    }
}

//创建Koa对象
var app=new Koa();
//验证逻辑部分
app.use(function *(next) {
    //console.log(this.query);      //返回的是一个对象  微信发过来的包是xml格式的
    var token=config.wechat.token;
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
});

app.listen(1234);
console.log('Listening is on port 1234,please visit http://localhost:1234');