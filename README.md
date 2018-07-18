# nodejswechat
Do something in wechat with nodejs


## 关于微信token验证
**思路：** 首先的话我们用这里用到koa和sha1用npm安装一下，切淘宝源会快点，然后我们知道微信的验证机制是 timestamp、nonce、以及自己创建的token，
进行字典排序然后sha1加密，出来的结果与signature进行对比，如果对的话，那么返回echostr，如果错误，在调试时候尽可能多的打点信息以便分析整个过程。

