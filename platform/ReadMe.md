## 平台管理

### 平台域名约定



#### 平台主域名

平台主域名wwww.quizyun.com （官网）

```
      /           平台首页
      /auth       登录入口
      /news       平台新闻
      /about      关于我们

      /manager    管理后台
      /robot.txt  搜索机器人文件
      /favicon.ico平台网页icon

      /oauth      Oauth 登录
      /oauth/qq
      /oauth/wx

      /sso/        SSO 单点登录（针对平台应用进行授权）
      /mapi/       管理后台的api接口
      /api/v1/     第一版的api接口

```
功能
    1.授权
    2.

```
文件夹规则
    ┣ controller        控制器，操纵事务函数
    ┣ hander            平台静态文件
    ┣ model             平台数据模型
    ┣ news              新闻模块内容
```



