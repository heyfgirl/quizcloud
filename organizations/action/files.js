var fs = require('fs');
var fse = require('fs-extra');
var os = require('os');
var path = require('path');
var snowflake = require('node-snowflake').Snowflake;
var ErrorParse = require("../../Data/tool/error.js")
const Models = require("../model/index")

//判断是否为空
var isEmpty = function(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

module.exports =async function (static_url,orgHash,file,filename,encoding,mimetype,storepath) {
    let result = { "success":false ,"error":{} ,"data":{} };    
    // var static_url = __dirname+"/../vue/dist/static"    
    try{
            //保存文件
            var tmpdir = path.join(os.tmpdir(), path.basename(filename));//临时存储文件
            let nameID = snowflake.nextId();//生成文件存储的唯一ID
            let nametmpdir = path.extname(tmpdir);//获取文件扩展名
            var name =  nameID+ nametmpdir;//生成存储的唯一ID名字
            var dest = storepath ? path.join(static_url,orgHash,storepath,name) : path.join(static_url,orgHash,name);   //存储的地方
            let readeStream = fs.createReadStream(file);                
            var writeStream = fs.createWriteStream(tmpdir);
            readeStream.pipe(writeStream);
            writeStream.on("close", function () {
                fse.move(tmpdir, dest, function (err) {
                    if (err) throw err;
                    console.log(  "yes")
                });
            })
            
            //存储数据
            let FileModel = Models.getTableModel(orgHash,"File");             
            let store = {};
            store.hash ='file' + nameID ;
            store.address = dest ;
            store.path = path.join(static_url,orgHash,path.basename(filename));  ;
            store.describe = mimetype ;
            store.size = encoding ;
            store.name = filename ;
            store.storaname = name ;
            await FileModel.create(store);

            result["data"].url =storepath ?  path.join("static/",orgHash,storepath,name).replace(/\\/g,'/') : path.join("static/",orgHash,name).replace(/\\/g,'/');
            result["data"].title =  filename;
            result["data"].original = filename;
            result["data"].state = 'SUCCESS';
            result["success"] = true;            
    }catch(error){
        result["error"] = await ErrorParse(error);                 
    }
    return result;
};
