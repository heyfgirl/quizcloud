'use srict';
const copy = require('copy-to');
const ErrorParse = require('./../../Data/tool/error');
const {UserAction,AuthAction} = require('./../action/index');

//平台用户注册
exports.register = async (ctx,next)=>{
    let option = {};
    let result = {"success":false, "error":{}, "data":{}};
    let user = {};
    copy(ctx.request.body).to(user);

    //检查用户名，密码，手机号非空
    if(!user.username){
        result.error = await ErrorParse("用户名不能为空！");
        return ctx.body = result;
    }else if(!user.password){
        result.error = await ErrorParse("密码不可为空！");
        return ctx.body = result;
    }else if(!user.mobile){
        result.error = await ErrorParse("请填写正确的手机号码！");
        return ctx.body = result;
    }


    //默认用户分组 vistor
    user.role = user.role||"normal";
    result = await UserAction.create(user);

    ctx.body = result;
}

//平台登录
exports.login = async (ctx,next)=>{

    let result = {"success":false,"data":{},"error":{}};
    let options = {};

    options.username = ctx.request.body.username||"";
    options.password = ctx.request.body.password||"";

    // todo 对接微信，qq 登录授权

    //系统用户
    if(options.username && options.password){

        result = await AuthAction.login(ctx,options);
        // let curuser = result.data.user||{};
        if(result.success){
            //登录成功
            let curUser = result.data||{}
            // ctx.session.uid = curUser.id;
            // ctx.session.username = curUser.username;
            // ctx.session.gflag = curUser.gflag;
            // ctx.session.realname = curUser.realname;
        }
        
    }else{
        result.error = ErrorParse("请填写用户名或密码");
    }

    ctx.body = result;

}