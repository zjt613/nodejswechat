# nodejswechat
Do something in wechat with nodejs


## 关于微信token验证
**思路：** 首先的话我们用这里用到koa和sha1用npm安装一下，切淘宝源会快点，然后我们知道微信的验证机制是 timestamp、nonce、以及自己创建的token，
进行字典排序然后sha1加密，出来的结果与signature进行对比，如果对的话，那么返回echostr，如果错误，在调试时候尽可能多的打点信息以便分析整个过程。

**关于封装一个简单的中间件：** 把代码写在app.js里面显然是不明智，通过分析，我们可以构造中间件，把需要暴露的接口暴露出去，这里关于token验证可以
封装在一个middleware里面，通过module.exports暴露出去好多了，这里关于把本地映射到公网localtunnel了解下，用npm安装下就好！

**关于access_token：** 这个就是票据啊，你只要知道两小时自动失效，所有针对这个问题要写个函数控制它两小时自动获取保证你得到的是有用的，这里nodeJS还是
有些坑的可以参考这个地址把这个问题解决[用node做微信开发后台，获取access_token报错](https://segmentfault.com/q/1010000007228715?_ea=1278099)，还有就是
你要知道这个access_token是有次数限制的，所有要慎用啊，避免不必要的麻烦，兄弟！


