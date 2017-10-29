'use strict';
var _ = require("lodash");
var copy = require("copyto");
const uid  = require('uid');
const Models = require("../model/index")
var ErrorParse = require("../../Data/tool/error.js")
const crypto = require('crypto');
const filterKeys = ["username","realname","nickname"];//可搜索字段,"gender"
const orderKeys = ["id","createAt"];//可排序字段
const attributes = ["id","username","realname","role","gender","nickname","mobile","address","wechat","qq","mailbox","tag1","tag2","tag3"]//支持查询的字段//
//创建用户
exports.create =async(option,orgHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let UserModel = Models.getTableModel(orgHash,"User");
        let {username,password,role} = option;
        //(?![0-9]+$) 预测该位置后面不全是数字(?![a-zA-Z]+$) 预测该位置后面不全是字母
        let REGUSERNAME=/^(?![0-9]+$)[0-9A-Za-z]{6,16}$/;
        let REGPASSWORD=/^[a-zA-Z0-9\_\.]{6,32}$/;
        //设置可创建管理员的权限
        if(role != "root"){
            if(username&&(REGUSERNAME.test(username))){
                if(password&&(REGPASSWORD.test(password))){
                    option["salt"] = uid(4);
                    option["password"] = crypto.createHash('md5').update(option["password"]+option["salt"]).digest('hex');                    
                    // 检查是否存在（前期做用户名检查，后期手机号，密码都检查）
                    let existsed = await UserModel.findOne({
                        "where":{"username":username}
                    });
                    //如果不存在新建,否则报错
                    if(! existsed){
                        let newUser = await UserModel.create(option);          
                        newUser = newUser["dataValues"];          
                        delete newUser["password"];
                        delete newUser["salt"];
                        delete newUser["updatedAt"];
                        delete newUser["deletedAt"];
                        delete newUser["createdAt"];
                        //数据库账号小写备份
                        let BACKUSER = /[A-Z]+?/;
                        if(BACKUSER.test(option.username)){
                            let backups = option;
                            backups["username"] = option["username"].toLowerCase(); 
                            backups["password"] = "";
                            await UserModel.create(backups);
                        }          
                        result["data"]= newUser;
                        result["success"]=true;
                    }else{
                        result["error"] = await ErrorParse("user exited")
                    }
                }else{
                    result["error"] = await ErrorParse("密码格式不正确或者不存在");                            
                }
            }else{
                result["error"] = await ErrorParse("用户名格式不正确或者不存在");            
            }
        }else{
            result["error"] = await ErrorParse("没有权限");                        
        }
    }catch(error){
        result["error"] = await ErrorParse(error)
    }
    return result;    
};
//导入用户
exports.importuser=async(reqData,orgHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let option = reqData["option"];    
        let UserModel = Models.getTableModel(orgHash,"User");
        let REGUSERNAME=/^(?![0-9]+$)[0-9A-Za-z]{6,16}$/;
        let REGPASSWORD=/^[a-zA-Z0-9\_\.]{6,32}$/;
        let insertdata = [];
        let usernameAry = [];
        let wherefind ={};
        wherefind["$or"] =[]; 
        for(let li of option){
            if((!li["username"])||(!REGUSERNAME.test(li["username"]))){
                result["data"] =  li["username"]+"用户名格式不正确";      
                return result;  
            }
            if((!li["password"])||(!REGPASSWORD.test(li["password"]))){
                result["data"] = li["username"]+"用户密码格式不正确";      
                return result;  
            }
            if(!li["nickname"]){
                li["nickname"] =li["username"];
            }
            li['role'] = reqData['role'];
            li['tag1'] = reqData['tag1'];
            li['tag2'] = reqData['tag2'];
            li['tag3'] = reqData['tag3'];
            if(li['gender']=='男' || li['gender']=='men'){
                li['gender']='men';
            }else if(li['gender']=="女" || li['gender']=='women'){
                li['gender']='women';
            }else{
                li['gender'] =  'unknown';
            }
            li["salt"] = uid(4);
            li["password"] = crypto.createHash('md5').update(li["password"]+li["salt"]).digest('hex');
            insertdata.push(li);
            wherefind["$or"].push({"username":li["username"]});
            usernameAry.push(li["username"]);
        }
        //判断是否存在重复账号
        usernameAry=usernameAry.sort(); 
        for(var i=0;i<usernameAry.length;i++){ 
            if (usernameAry[i]==usernameAry[i+1]){
                result["error"] = "重复账号" ;
                result["data"] = usernameAry[i];      
                return result;  
            } 
        }
        //对非全小写进行全小写的备份
        let BACKUSER = /[A-Z]+?/;
        let datacp = [];
        for(let data of insertdata){
            if(BACKUSER.test(data.username)){
                let backups = data;                        
                backups["username"] = data["username"].toLowerCase(); 
                datacp.push(backups);
            }  
        }
        insertdata = insertdata.concat(datacp);
        ///判断是否已有账号存在
        let power = 1;
        let existsed = await UserModel.findAll({"where":wherefind});
        if(existsed.length>0) power =0;
        ///进行用户创建
        if(power){
            let users =[];            
            await UserModel.bulkCreate(insertdata);
            // for(let li of insertdata){
            //     (async(li)=>{
            //         await UserModel.create(li);
            //         users.push(li["username"]);
            //         if(users.length == insertdata.length){
            //             result["data"] = users;
            //             result["success"] = true;
            //         }
            //     })
            // }
            for(let user of wherefind["$or"]){
                users.push(user.username);
            }
            result["data"] = users;
            result["success"] = true;
        }else{
            let resdata = [];            
            for(let dt of existsed){
                resdata.push(dt["dataValues"]["username"]);
            }
            result["data"] = resdata;
            result["error"] = "以下用户已存在";                   
        }
    }catch(error){
        result["error"] = await ErrorParse(error)        
    } 
    return result;        
};
// 根据字段精确查询用户信息（id,username,mobile等or查询）
exports.info = async (option,orgHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let UserModel = Models.getTableModel(orgHash,"User");
        let search = {};
        copy(option).pick(["id","username","mobile","tag1","tag2","tag3"]).to(search);
        let where = {};
        where["$or"] = [];
        for(let  skey of Object.keys(search)){
            where["$or"].push({[skey]:search[skey]})
        }
        let existUser = await UserModel.findOne({"attributes":attributes,"where":where});
        if(existUser){
            existUser = existUser["dataValues"];
            result["data"]= existUser;
            result["success"]=true;
        }else{
            result["error"] = await ErrorParse("user not find")
        }
    }catch(error){
        result["error"] = await ErrorParse(error)
    }
    return result;    
}
// 更新用户信息（根据ID更新）
exports.update = async (uid,option,orgHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let UserModel = Models.getTableModel(orgHash,"User");
        if(typeof uid === "number"){
            let newInfo = {};
            copy(option).pick(["mobile","mailbox"]).to(newInfo)
            let existUser = await UserModel.update(newInfo,{"where":{"id":uid}});
            if(existUser){
                let existUser = await UserModel.findOne({"attributes":attributes,"where":{"id":uid}});                
                result["data"]= existUser["dataValues"];
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
// 列表查询，支持关键字搜索
exports.list =async(option,orgHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let query = {};//查询参数
        query["attributes"] = attributes;
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
                $or.push(orLike);
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
        let UserModel = Models.getTableModel(orgHash,"User");
        let userlist = await UserModel.findAndCountAll(query);
        copy(userlist).to(resData);     

        result["data"] = resData;
        result["success"] = true;
    }catch(error){
        result["error"] = await ErrorParse(error);
    }
    return result;
};

exports.remove =async(uid,orgHash)=>{
    let result = {success:false ,error:{} ,data:{}};
    try{
        if(typeof uid  == "number"){
            let UserModel = await Models.getTableModel(orgHash,"User");
            await UserModel.destroy({where:{id:uid}});
        }else{
            result["error"] = await ErrorParse("arg err",{"field":["id"]});            
        }
    }catch(error){
        result["error"] = await ErrorParse(error);
    }
   return result;
}

exports.login = async(username,password,orgHash)=>{
    let result = {success:false ,error:{} ,data:{}};    
    try{
        let UserModel = await Models.getTableModel(orgHash,"User");        
        let resData = await UserModel.findOne({"attributes":["username","password","salt","role"],where:{username:username}});
        if(resData&&resData["dataValues"]){
            let respassword = crypto.createHash('md5').update(password+resData.salt).digest('hex');
            if(respassword == resData["password"]){
                result["data"]["role"] = resData["role"];
                result["success"] =true;
            }else{
                result["error"] = await ErrorParse("密码错误");        
            }
        }else{
            result["error"] = await ErrorParse("账号错误");        
        }
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return result;
}
///userGroup delete
exports.deleteGroup = async(option,orgHash)=>{
    let result = {success:false ,error:{} ,data:{}};    
    try{
        let resData = {};//返回数据
        let UserModel = Models.getTableModel(orgHash,"User");
        let s = {[option.key]:option.replaceKey};
        let so = {where:{[option.key]:option.DeleteKey}};
        let tiao = await UserModel.update({[option.key]:option.replaceKey},{where:{[option.key]:option.DeleteKey}});
        if(tiao>1){
            result["data"] =true;
        }else{
            result["data"] =false;
        }
        result["success"] =true; 
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return result;
}
