'use strict';
const copy = require('copyto');
const ErrorParse = require('./../../Data/tool/error');
const Models = require(__dirname + '/../../platform/model/index');  //////platfrom里文件
const _ = require('lodash');

////列表
exports.list = async(ctx,next)=>{
    let result = {"success":false, "error":{}, "data":{}};
    let option = {};
    //关键字（搜索词 ）  GET/POST
    option["kw"] = ctx.query["kw"] || ctx.request.body["kw"] ||"";
    //过滤字段（默认选择全部 ） POST
    option["filter"] = ctx.query["filter"] || ctx.request.body["filter"] || [];
    //需要获取的页码数/分页大小  GET/POST
    option["page"] =  ctx.query["page"] || ctx.request.body["page"] || 1 ;
    option["size"] =  ctx.query["size"] || ctx.request.body["size"] || "20";
    //排序数据 [["name","DESC"],["id","ESC"]]
    let order = ctx.query["order"] || [];
    try{ 
        let NewsModel = Models.getTableModel('News');
        let NewsFrontModel = Models.getFrontModel('News');
        let filterKeys = NewsFrontModel.search;//可搜索字段
        let orderKeys = NewsFrontModel.order;//可排序字段
        let attributes = NewsFrontModel.query;//可查询字段
        let query = {};//查询参数
        query["attributes"] =filterKeys;
        // 分页处理
        let order = orderKeys;
        let {kw,page,size,filter} = option;
        size = parseInt(size) || 20;
        size = size < 100 ? size :100; //最大100
        size = size > 1 ? size :1;   //最小10
        query["limit"]   = size ;
        page = parseInt(page) || 1;
        query["offset"] =  size*(page-1);
        // 搜索处理(如果有值采用与默认filter的合集，为空采用默认filter)
        // if((filter && filter.length) && (filter != "ALL")){
        //     filter = _.intersection(filter,filterKeys);
        // }else{
        //     filter = filterKeys;
        // }
        if(filter.constructor==Array && filter.length){
            filter = _.intersection(filter,filterKeys);
        }else if(filter == "ALL"){
            filter = _.difference(filterKeys,["recom","click","release"]);
        }else{
            filter = _.difference(filterKeys,["recom","click","release"]);
        }
        query["where"] ={};
        ////处理未发布的新闻
        query["where"]["release"]={
            $lte: new Date()
        };        
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
                    && ["DESC","ASC"].indexOf(String(or[1]).toUpperCase()) != -1
                ){
                    query["order"].push(or)
                }
            }
        }
        query["order"].push(["release","DESC"]);
        
        let resData = await NewsModel.findAndCountAll(query);
        //////匹配新闻摘要
        let IMGREG = /<img[^>]+>/g;
        for(let news of resData.rows){
            let str = news["dataValues"]["content"].replace(IMGREG,"[图片]");
            // let one = str.substr(0,str.indexOf("</p>")).replace(/<[^>]*>/g,"").replace(/\&nbsp\;/g,"");
            // let two = str.substr(0,str.indexOf("<br/>")).replace(/<[^>]*>/g,"").replace(/\&nbsp\;/g,"");
            let abstract = str.replace(/<[^>]*>/g,"").replace(/\&nbsp\;/g,"").substr(0,160);
            news["dataValues"]["content"] = abstract+".....";
            news["content"] =  abstract + "......";
        }
        result["data"] = resData;
        result["success"] = true;        
    }catch(error){
        //未知错误
        console.log(error)
        result["msg"] ="页面加载出错";
        result["success"] = false;
        result["error"] = await ErrorParse(error);
    }
    return ctx.body = result;
}

///详情
exports.info = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try{
        //hash  title  content   edit     editid  activitehash  img  recom  click  tag  grop release
        let option={};
        copy(ctx.query).to(option);
        let NewsModel = Models.getTableModel("News");           
        //设置权限  ctx.session["role"] == "admin"  || ctx.session["role"] == "root";
        if(1){
            if(option.hash){
                let  resData = await NewsModel.findOne({where:{"hash":option.hash}});   
                let  newNews = {};
                if(resData){
                    copy(resData.dataValues).to(newNews);
                    /////推荐//////
                    let paginglist = await NewsModel.findAll({
                        "attributes":["title","hash"],
                        "order":[["release","DESC"]],
                        "where":{"release":{$lte: new Date()}}
                    });   
                    newNews["paging"] = paging(paginglist,option.hash);
                    result["success"] = true;
                    delete newNews["updatedAt"];
                    delete newNews["deletedAt"];
                    delete newNews["createdAt"];
                    result["data"] = newNews;
                }else{
                    result["error"] = await ErrorParse("未查到数据出错");                                                
                }
            }
        }else{
            result["error"] = await ErrorParse("没有权限");                            
        }
    }catch(error){
        result["error"] = await ErrorParse(error);                
    }
    return ctx.body = result;          
}
///处理前后页面
function paging(paginglist,hash){
    let pagi = {};
    let sss = paginglist.length;
    for(let index in paginglist){
        if(paginglist[index]['hash'] == hash){
            if(index == 0){
                pagi["left"] = {"hash": paginglist[parseInt(index)]["dataValues"]["hash"],"title":"没有了"} ; 
                pagi["right"]= paginglist[parseInt(index)+1]["dataValues"];   
                break ;                 
            }else if(index == (paginglist.length-1)){
                pagi["left"] = paginglist[parseInt(index)-1]["dataValues"];
                pagi["right"]={"hash":paginglist[parseInt(index)]["dataValues"]["hash"],"title":"没有了"} ; 
                break ;              
            }else{
                let fff= index+1
                pagi["left"] = paginglist[parseInt(index)-1]["dataValues"];                
                pagi["right"]= paginglist[parseInt(index)+1]["dataValues"];  
                break ;                   
            }
        }
    }
    return pagi;
}

////推荐
exports.recom = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    let option = {};
    copy(ctx.query).to(option);
    try{
        let NewsModel = Models.getTableModel("News");         
        let query = {};
        query["where"]={};
        query["attributes"]=["title","hash"];
        query["order"]=[["release","DESC"]];
        query["where"]["release"]={$lte: new Date()};
        query["limit"] = option.size || 5;
        let  resData = await NewsModel.findAll(query);   
        result["data"] = resData;
        result["success"] = true;
    }catch(error){
        result["error"] = await ErrorParse(error);                        
    }
    return ctx.body = result;          
}
    
exports.click = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try{
        let hash = ctx.query.hash;
        let click = ctx.request.body.click;
        if(!click) click = 0 ;
        let newclick = typeof click == "number" ? click+1 : parseInt(click)+1;
        let NewsModel = Models.getTableModel("News");         
        let T = await NewsModel.update({"click":newclick},{"where":{"hash":hash},"fields":["click"],"silent":true});  
        if(T){
            result["data"] = {"click":newclick};                        
            result["success"] = true; 
        }
    }catch(error){
        result["error"] = await ErrorParse(error);                                
    }
    return ctx.body = result;              
}

