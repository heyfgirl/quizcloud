'use strict';
const crypto = require('crypto');
const _ = require("lodash");
const copy = require("copyto");
const uid = require('uid');
const ErrorParse = require("../../Data/tool/error.js")
const Models = require('./../model/index');


    

exports.create = async(option)=>{

    let UserModel = Models.getTableModel('User');
   
    let result = { "success":false ,"error":{} ,"data":{} };
    try{

        let {username} = option;
        // 检查是否存在（前期做用户名检查，后期手机号，密码都检查）
        let existsed = await UserModel.findOne({
            "where":{"usernamelower":username.toLocaleLowerCase()}
        });
        //如果不存在新建,否则报错
        if(!existsed){
            option.salt = uid(4);//加盐
            option.password = crypto.createHash('md5').update(option.password + option.salt).digest('hex')
            option.usernamelower = option.username.toLocaleLowerCase();//存用户名小写字符
            let newUser = await UserModel.create(option);
            delete newUser["password"];
            result["data"]= newUser;
            result["success"]=true;
        }else{
            result["error"] = await ErrorParse("user exited")
        }
    }catch(err){
        result["error"] = await ErrorParse(err)
    }

    return result;
}

exports.list = async (option)=>{
    let UserModel = Models.getTableModel('User');
    let UserFrontModel = Models.getFrontModel('User');
    let filterKeys = UserFrontModel.search;//可搜索字段
    let orderKeys = UserFrontModel.order;//可排序字段
    let attributes = UserFrontModel.query;//可查询字段
   
    //默认返回值
    let result = {"success":false, "error":{}, "data":{}};
    let resData = {};//返回数据
    try{ 
        let query = {};//查询参数
        query["attributes"] = {exclude:['password','deletedAt','salt']};
        // 分页处理
        let {kw,page,size,filter,order} = option;
        size = parseInt(size) || 20;
        size = size < 100 ? size :100; //最大100
        size = size > 10 ? size :10;   //最小10
        resData["size"] = query["limit"]   = size ;
        resData["page"] = page = parseInt(page) || 1;
        query["offset"] =  size*(page-1);

        // 搜索处理(如果有值采用与默认filter的合集，为空采用默认filter)
        if(filter && filter.length){
            filter = _.intersection(filter,filterKeys);
        }else{
            filter = filterKeys;
        }

        query["where"] ={};

        if(kw){
            let $or = [];
            let $like = "%"+kw+"%";
            for(let fkey of filter){
                let orLike = {};
                orLike[fkey] = {"$like":$like};
                $or.push(orLike)
            }
            query["where"]["$or"]=$or;
        }
         

        // 排序处理
        if(order &&　order instanceof Array){
            query["order"] = [];
            for(let or of order){
                if(order instanceof Array 
                    && orderKeys.indexOf(or[0]) != -1 
                    && ["DESC","ESC"].indexOf(String(or[1]).toUpperCase()) != -1
                ){
                    query["order"].push(or)
                }
            }
        }
        
        let search = await UserModel.findAndCountAll(query);

        resData["total"] =search["count"];
        resData["rows"] = search["rows"];
        result["data"] = resData;
        result["success"] = true;
        result["code"] = 0;
        
    }catch(error){
        //未知错误
        console.log(error)

        result["code"] = -1;
        result["msg"] ="页面加载出错";
        result["success"] = false;
        result["error"] = await ErrorParse(error);

    }
    return result;
  
}

// 根据字段精确查询用户信息（id,username,phone等or查询）
exports.info = async (option)=>{
    let UserModel = Models.getTableModel('User');
    let UserFrontModel = Models.getFrontModel('User');
    let filterKeys = UserFrontModel.search;//可搜索字段
    let attributes = UserFrontModel.query;//可查询字段

     let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let search = {};
        copy(option).pick("id","username","email","mobile").to(search);
        let where = {};
        where["$or"] = [];
        for(let  skey of Object.keys(search)){

            if(search[skey]){
                where["$or"].push({[skey]:search[skey]});
            }
            
        }
        let existUser = await UserModel.findOne({
                "attributes":attributes,
                "where":where
             });
        if(existUser){
            delete existUser["password"];
            result["data"]= existUser;
            result["success"] = true;
        }else{
            result["error"] = await ErrorParse("user not find");
        }
    }catch(error){
        result["error"] = await ErrorParse(error);
    }
    return result;
}

// 更新用户信息（根据ID更新）
exports.update = async (option)=>{

    let UserModel = Models.getTableModel('User');
    let UserFrontModel = Models.getFrontModel('User');
    let attributes = UserFrontModel.query;//可查询字段

    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        if(typeof option.username === "string"){
            let newInfo = {};
            // 可以修改 password 
            attributes.push("password");
            copy(option).pick('nickname','gflag','realname','password','userpic','role','gender','addr','mobile','qq','email','state').to(newInfo)
            let existUser = await UserModel.update(newInfo,{
                "attributs":attributes,
                "where":{"username":option.username}
            });
            if(existUser){
                // delete existUser["passsword"]
                result["data"]= existUser;
                result["success"]=true;
            }else{
                result["error"] = await ErrorParse("user not find",{})
            }
        }else{
            result["error"] = await ErrorParse("arg err",{"field":["id"]})
        }
    }catch(error){
        result["error"] = await ErrorParse(error)
    }
    return result;
}

exports.remove = async(uid)=>{
    let UserModel = Models.getTableModel('User');

    let result = {"success":false, "error":{}, "data":{}};
    try{ 
        if(typeof uid === "number"){
            result.data = await UserModel.destroy({"where":{"id":uid}});
            result.success = true;
        }else{
            result["error"] = await ErrorParse("arg err",{"field":["id"]});
        }

        
    }catch(e){
        result["error"] = await ErrorParse(error)
    }
    return result;
}