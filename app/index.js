'use strict';
const fs = require("fs");
const {join} = require("path");

const {regist , complete} = require("../organizations/model/index");

var indexPaths = [];
var modelPaths = [];
var modelArr = [];
// 遍历文件内所有的应用目录
var flist = fs.readdirSync(__dirname);
for(var file of flist ){
    // if(file != "quiz"){
    //     continue;
    // }
    if(fs.existsSync(join(__dirname,file))){
        let hasIndex = fs.existsSync(join(__dirname,file,"index.js"));
        let hasModel = fs.existsSync(join(__dirname,file,"model/loader.js"))
        if(hasIndex &&hasModel){
            indexPaths.push("./"+file+"/index.js")
            modelPaths.push("./"+file+"/model/loader.js")
            let mpath = "./"+file+"/model/loader"
            let model = require(mpath)();
            modelArr.push(model);
            let modelList = model["models"];
            for(let m of modelList){
                regist(m);
            }
        }
    }
}

// 注入完成开始通知初始化
complete(function(organModel){
    for(let m of modelArr){
        m.complete(organModel)
    };
});
// 注入到模型列表里

const Apps = {}
for(let index of indexPaths){
    var app = require(index);
    if(app["hash"]){
        console.log("app hash: "+app["hash"]);
        Apps[app["hash"]] = app["app"];
    }else{
        console.log("app no setting hash!!")
    }
}


exports.load = function(){
    return Apps;
}






