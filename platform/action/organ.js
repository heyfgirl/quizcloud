'use strict';
const _ = require("lodash");
const copy = require("copyto");
const ErrorParse = require("../../Data/tool/error.js");
const Models = require('./../model/index');
const uid = require('uid');

exports.create = async(option)=>{
    let OrganModel = Models.getTableModel('Organ');
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        
        let {orgname} = option;
        // 检查是否存在
        let existsed = await OrganModel.findOne({
            "where":{"orgname":orgname}
        });
        //如果不存在新建,否则报错
        if(! existsed){
            let newOrg = await OrganModel.create(option);
            // delete newUser["password"];
            copy(newOrg.dataValues).pick("hash","node","orgname","gflag","telephone","proposer","mobile","email","abstract","subdomain","custodomian","qualification","state").to(result.data);
            // result["data"]= newOrg;
            result["success"]=true;
        }else{
            result["error"] = await ErrorParse("user exited")
        }
    }catch(err){
        result["error"] = await ErrorParse(err)
    }

    return result;
}
//再次提交申请
exports.reapply = async(hash,option)=>{
    let OrganModel = Models.getTableModel('Organ');
    
    let result = { "success":false ,"error":{} ,"data":{} };
    try{

        let existOrgan = await OrganModel.update(option,{
            "where":{"hash":hash}
        });
        if(existOrgan){
            result["data"] = {"msg":"修改成功"};
            result["success"] = true;
        }else{
            result["error"] = await ErrorParse("organ not find",{});
        }
    
    }catch(error){
        result["error"] = await ErrorParse(error)
    }
    return result;
}
//审核状态
exports.audit = async (option)=>{
    let OrganModel = Models.getTableModel('Organ');
    let result = {"success":false,"error":{},"data":{}};
    try{
        let exist =await OrganModel.findOne({'where':{'hash':option.hash}});
        if(exist){
            if(exist.dataValues.state == "auditing" && option.state == "approved"){
                //通过审核

                //创建该机构的数据库
                let result = await createDB({'hash':option.hash,'host':option.host,'port':option.port});//初始化数据库

                if(result.success){
                    await OrganModel.update({"state":option.state},{"where":{"hash":option.hash}});
                }else{
                    result.error  = await ErrorParse('审核失败：数据库初始化失败，请稍后尝试。')
                }

            }else if(exist.dataValues.state == "auditing" && option.state == "unapproved"){
                //未通过审核
                await OrganModel.update({"state":option.state},{"where":{"hash":option.hash}});
                result.success = true;

            }else{
                //已完成审核，在下次提交机构信息前无法再次审核
                result.error = await ErrorParse('下次提交机构信息前无法再次审核');
            }
            
        }else{
            result.error = await ErrorParse('organ not found');
        }
                
    }catch(e){
        result.error = await ErrorParse(e);
    }
    

    return result;
}

exports.list = async (option)=>{

    let OrganModel = Models.getTableModel('Organ');
    let OrganFrontModel = Models.getFrontModel('Organ');
    let filterKeys = OrganFrontModel.search;//可搜索字段
    let orderKeys = OrganFrontModel.order;//可排序字段
    let attributes = OrganFrontModel.query;//可查询字段
    
    //默认返回值
    let result = {"success":false, "error":{}, "data":{}};
    let resData = {};//返回数据
    try{ 
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
        
        let search = await OrganModel.findAndCountAll(query);

        resData["total"] =search["count"];
        let rows = [];
        for(let row of search.rows){
           if(row.state == "approved"){
               row.state = "通过";
           }else if(row.state == "auditing"){
               row.state = "审核中";
           }else {
               row.state = "未通过";
           }
        }
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


// 根据字段精确查询机构信息（id,username,phone等or查询）
exports.info = async (option)=>{
    let OrganModel = Models.getTableModel('Organ');
    let OrganFrontModel = Models.getFrontModel('Organ');
    let attributes = OrganFrontModel.query;//可查询字段
    
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let search = {};
        copy(option).pick(attributes).to(search);
        let where = {};
        where["$or"] = [];
        for(let  skey of Object.keys(search)){

            if(search[skey]){
                where["$or"].push({[skey]:search[skey]});
            }
            
        }
        let existOrgan = await OrganModel.findOne({"where":where});
        if(existOrgan){
            delete existOrgan["password"];
            result["data"]= existOrgan;
            result["success"] = true;
        }else{
            result["error"] = await ErrorParse("Organ not find");
        }
    }catch(error){
        result["error"] = await ErrorParse(error);
    }

    return result;
}

// exports.auditInfo = async(hash)=>{
//     let OrganModel = Models.getTableModel('Organ');
//     let result = {'success':false,'data':{},'error':{}};
//     try{
//         let organ = await OrganModel.findOne({'where':{'hash':hash}});
//         if(organ && organ.dataValues){
//             copy(organ.dataValues).pick('hash','orgname','gflag','telephone','proposer','mobile','email','abstract','subdomain','customdomain','qualification').to(result.data);
//             result.success = true;
//         }else{
//             result.error = await ErrorParse('org not found');
//         }

//     }catch(e){
//         result.error = await ErrorParse(e);
//     }

//     return result;
// }

// 更新机构信息（根据hash更新）
exports.update = async (hash,organ,option)=>{

    let OrganModel = Models.getTableModel('Organ');
    
    let result = { "success":false ,"error":{} ,"data":{} };
    try{

        let existOrgan = await OrganModel.update(organ,{
            "where":{"hash":hash}
        });
        if(existOrgan){
            result["data"] = {"msg":"修改成功"};
            result["success"] = true;
        }else{
            result["error"] = await ErrorParse("organ not find",{});
        }
    
    }catch(error){
        result["error"] = await ErrorParse(error)
    }
    return result;
}
 
exports.remove = async(uid)=>{
    let OrganModel = Models.getTableModel('Organ');
    let result = {"success":false, "error":{}, "data":{}};
    try{ 
        if(typeof uid === "number"){
            result.data = await OrganModel.destroy({"where":{"id":uid}});
            result.success = true;
        }else{
            result["error"] = await ErrorParse("arg err",{"field":["id"]});
        }

        
    }catch(e){
        result["error"] = await ErrorParse(error)
    }
    return result;
}

exports.alldbs = async()=>{
    let OrganModel = Models.getTableModel('Organ');
    let result = {"success":false,"data":{},"error":{}};
    

    try{
        let organs = await OrganModel.findAll({
            "attributes":["hash","host","port","password"],
            "where":{
                "state":"approved"
            }
        });
        result.data.organs = [];
        for(let organ of organs){
            let newOrgan = {};
            newOrgan.hash = organ.dataValues.hash;
            newOrgan.dbname = "quiz_"+organ.dataValues.hash;
            newOrgan.host = organ.dataValues.host;
            newOrgan.port = organ.dataValues.port;
            newOrgan.pass = organ.dataValues.password;
            result.data.organs.push(newOrgan);
        }
        result.success = true;
    }catch(e){
        result.error = await ErrorParse(e);
    }

    return result;
}

exports.detailInfor = async(hash)=>{
    let OrganModel = Models.getTableModel('Organ');
    
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let existOrgan = await OrganModel.findOne({
            "attributes":{"exclude":["id","createdAt","updatedAt","deletedAt"]},
            "where":{"hash":hash,"state":"approved"}});
        if(existOrgan){
            result["data"]= existOrgan;
            result["success"] = true;
        }else{
            result["error"] = await ErrorParse("Organ not find");
        }
    }catch(error){
        result["error"] = await ErrorParse(error);
    }

    return result;
}

let createDB = exports.createDB = async(organ)=>{
    // let Models.getSequelize();

    let result = {"success":false,"error":{},"data":{}};
    try{
        let OrganModel = Models.getTableModel('Organ');
        let existOrgan = await OrganModel.findOne({"where":{"hash":organ.hash}});
        if(existOrgan){
            let sequelize = await Models.getSequelize();
            
            let hash = existOrgan.dataValues.hash;
            let dbname = "quiz_" + hash;
            let user = hash;
            let password = uid(12);
            let host = organ.host||'192.168.1.3';
            let port = organ.port||6541;
            await sequelize.query("CREATE USER "+ user +" WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1 PASSWORD "+"'"+ password +"'");
            await sequelize.query("CREATE DATABASE "+ dbname +" WITH OWNER = "+ user +"  ENCODING = 'UTF8' LC_COLLATE = 'Chinese (Simplified)_China.936' LC_CTYPE = 'Chinese (Simplified)_China.936' TABLESPACE = pg_default CONNECTION LIMIT = -1");
            await sequelize.query("REVOKE ALL ON DATABASE "+ dbname +" FROM PUBLIC;");

            await OrganModel.update({"password":password,"username":user,"host":host,"port":port},{"where":{"hash":hash}});
            result.success = true;
            result.data = {"msg":"数据库初始化成功"};
            // result.data = {"host":host,"port":port,"database":dbname,"user":user,"pass":password};
        }else{
            result.error = await ErrorParse('organ not find')
        }
        
    }catch (err){
        result = await ErrorParse(err);
    }
    return result;

}
