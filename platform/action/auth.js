'use strict';
const copy = require("copyto");
const crypto = require('crypto');
const ErrorParse = require("../../Data/tool/error.js");

//平台登录
exports.login = async (ctx,options)=>{
    let models = require('./../model/index');
    let UserModel = models.getTableModel('User');
    let attributes = models.getFrontModel('User').query;
    let result = {"success":false,"data":{},"error":{}};
    let user = {};
    copy(options).pick('username','password').to(user);

    try{
        //用户名，密码
        attributes = [].concat(attributes,['password','salt']); //加入查询password，salt字段
        let userExist = await UserModel.findOne({
            'attributes':attributes,
            'where':{
                $or:[
                    {'username':user.username},
                    {'mobile':user.username},
                    {'email':user.username}
                ]
            }
        });

        if(userExist){
            let pass = userExist.dataValues.password;
            let salt = userExist.dataValues.salt;

            if(pass == crypto.createHash('md5').update(user.password + salt).digest('hex')){
                //返回的数据删除password，字段
                delete userExist.dataValues.password;
                delete userExist.dataValues.salt;

                result.data = userExist;
                result.success = true;
                
            }else{
                //密码错误
                result.error = await ErrorParse("password err");
            }
        }else{
            result.error = await ErrorParse("user not find");
        }

    }catch(error){
        result.error = await ErrorParse(error);
    }

    return result;

}