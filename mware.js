'use strict'
const send = require('koa-send')
const { stat } = require('mz/fs')
const Engines = require('consolidate')
const { resolve, extname, join,normalize } = require('path')
const debug = require('debug')('mware')



/**
 * 以下三个中间件均与发送文件相关，特约定以下内容
 * 
 * 1：基路径  ：
 *          每个应用都是独立的，文件要按照约定文件夹名称存放，除了以下三个文件夹允许下发到客户端外，其余任何文件内容均不可发送
 * 
 * 2. Static路径 ：
 *          存放静态文件，早起采用本机存储，后期采用CDN存储，文件必须不存在跨域问题
 *          ctx.path["static"] 静态文件夹的路径 （根路径+机构hash+？应用hash+"static"）
 *          内部应用都是固定的，面向机构的应用都是每个机构相互独立，每安装一个都是一个拷贝镜像
 * 
 * 
 * 3. File路径：
 *          ctx.path["file"]
 *          存放静态文件无法支持的文件，或者需要做处理的文件，尽量减少使用该类型！
 *          该文件夹始终跟随服务器，不会部署到CDN上
 * 
 * 3: View路径 ：
 *          ctx.path["view"] 模板文件夹路径  （根路径+机构hash +？活动hash）
 *          内部应用都是固定的，面向机构的应用都是每个机构相互独立，每安装一个都是一个拷贝镜像
 *          该文件夹始终跟随服务器，不会部署到CDN上
 * 
 * 
 * 5. 使用
 *              
 *          发送文件直接采用 ctx.send() :参数为 相对file的文件路径 不需要加前缀
 *              如: 发送file/avatar/010101.png则参数为 avatar/010101.png，不能加 .  ..  \   / 这些前缀
 *          
 *          模板渲染  ctx.view()  与 ctx.send类似 
 *         
 */


// 定制koa-send
// ctx.send 发送文件
exports.send = function () {
    return async function (ctx, next) {
        if (ctx.send) return await next();
        ctx.send = function (path) {
            // 检查路径(确保没有超出应用的范围)
            //文件发送
            let root = join(__dirname, ctx.base["file"]);
            return send(ctx, path, {
                "root": root
            });
        };
        await next();
    }
}




// 静态中间件
exports.static = function () {
    function safeDecodeURIComponent(text) {
        try {
            return decodeURIComponent(text);
        } catch (e) {
            return text;
        }
    }
   
    return async function serve(ctx, next) {
       

        if (ctx.method !== 'HEAD' && ctx.method !== 'GET')
            return await next();
        let path = ctx.path;
        let done = false;
        if (/^(\/[^(\/|\?|&)]+?)?\/static/.test(path)) {
            path = path.replace(/^(\/[^(\/|\?|&)]+?)?\/static/, "");
            path = safeDecodeURIComponent(normalize(path));
            let root = join(__dirname, ctx.base["static"]);
            try {
                let state = await stat(join(root, path));
                if (state.isFile()){
                    return await send(ctx, path, {"root":root})
                }
            } catch (err) {
                if (err.status !== 404)
                    throw err
            }
        }
        if (!done) {
            return await next()
        }
    }
}

// cdn组件，自动跳转文件请求道到cdn服务 ,预留中间件
exports.cdn = function () {
    // return function (ctx, next) {
    //     if (ctx.send) return next();
    //     ctx.send = function (path) {
    //         //路径处理
    //         return send(ctx, path);
    //     }
    // }
}



// 定时静态文件目录处理
// ctx.static()


// 来源于koa-views
// 注册中间件不需要任何参数
// ctx.render 强制添加后缀文件，不接受文件夹作为参数
const map = {
    // "html": "nunjucks"
}
const options = {
}
exports.view = function () {
    return async function views(ctx, next) {
        if (ctx.render) return next()
        ctx.render = async function (path, locals = {}) {
            try {
                
                // todo 路径检查（跨域检查）
                let rootPath = join(__dirname, ctx.base["view"]);
                let fullPath = join(__dirname, ctx.base["view"], path);
                const suffix = path.split(".").reverse()[0];
                let fstats = await stat(fullPath);
                if (fstats.isFile()) {
                    // 如果文件存在
                    const state = Object.assign(locals, options, ctx.base, ctx.state || {})
                    state.partials = Object.assign({}, options.partials || {})
                    debug('render `%s` with %j', path, state);
                    ctx.type = 'text/html';
                    if (suffix === 'html' ) {
                        // 网页进行全局替换操作  <% _static_/ %>
                        // 截取然后替换
                        return await send(ctx, join(ctx.base["view"], path));
                    } else {
                        const engineName = map && map[suffix] ? map[suffix] : suffix
                        const render = Engines[engineName];
                        if (!engineName || !render)
                            throw new Error(`Engine not found for the ".${suffix}" file extension`);
                        return ctx.body = await render(fullPath, state);
                    }
                }
                throw new Error(`File  ".${path}"  not found!`)
            } catch (error) {
                console.log(error)
                throw error
            }
        }
        return next();
    }
}