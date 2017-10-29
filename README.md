## 竞赛云


### app 全局状态

    Session
    ctx.sessionId Session 的唯一ID ，和浏览器cookie同步.域间不同步（因为会有绑定域名）
    ctx.session   请求的session信息，json对象存储


    请求基础信息
    ctx.base = {}
    ctx.base["curDomain"]  = 被访问的域名（IP请求需要过滤掉）
    ctx.base["subDomain"]   = 被访问的子域名 （www  或者 api 或者  机构的默认名称）[统一为小写字母]
    ctx.base["customDomain"]    =  自定义域名


    //路径
    ctx.base["view"]   = "" //模板文件夹地址
    ctx.base["file"]   = "" //机构下非静态文件地址，（和view文件夹存在一起）
    ctx.base["static"] = "" //静态目录地址（存放css/js/img/video等）需要支持cdn的访问
   

    //应用类型 
    ctx.base["type"] =   访问应用类型  （ www:官网    admin:平台后台   user:用户中心   organ:机构    xxx：应用 ）

    //机构信息
    ctx.base["organ"] = {}   //当前机构的信息

    //活动信息
    ctx.base["activite"]  = {}


### Host域名约定

本程序开发期间采用本地host方式实现域名访问，请按要求添加以下内容到host文件中
```
 quizyun.com     => 127.0.0.1  根域名  自动跳转到  www 域名
 www.quizyun.com=> 127.0.0.1  平台门户站点
 cdn.quizyun.com => 127.0.0.1  平台静态数据域名，存储文件专用
 abc.quizyun.com => 127.0.0.1  机构ABC二级域名（平台分配）
 js.abcorg.cn    => 127.0.0.1  机构ABC的自由域名（自行绑定）
 xyz.quizyun.com => 127.0.0.1  机构XYZ 二级域名（平台分配）
 huodong.iamxyz.cn => 127.0.0.1  机构XYZ的自由域名（自行绑定）

```

请在host文件(`C:\Windows\System32\drivers\etc`)中添加以下内容  

```
127.0.0.1 quizyun.com
127.0.0.1 www.quizyun.com
127.0.0.1 cnd.quizyun.com
127.0.0.1 abc.quizyun.com
127.0.0.1 js.abcorg.cn
127.0.0.1 xyz.quizyun.com
127.0.0.1 huodong.iamxyz.cn
```


### 路由约定

### 根目录约定说明

      ┣  data 数据目录
      ┣  model  数据库模型
      ┣  mware 中间件
      ┣  platform  平台管理控制器(平台级别接口及页面)
      ┣  public  静态文件  
      ┣  organizations  机构控制器

#### 应用目录约定(通用)

    每一应用都应是独立的一个Koa类实例（var app = new Koa();）
    目录结构约定
    /index.js   
    /route.js   本应用路由
    /ReadMe.md  应用说明文件
    /view/      视图文件，允许采用多种模板视图
    /api/
    /vue        vue 项目目录
    /static/    静态文件（编程时文件）
