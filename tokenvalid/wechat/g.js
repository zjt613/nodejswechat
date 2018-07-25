//  Generator的缩写   构造一个中间件

'use strict'        //严格模式
var sha1=require('sha1');


//返回一个中间件接口
module.exports=function(opts){
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



