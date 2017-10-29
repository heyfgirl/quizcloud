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

module.exports =async function (orgHash,option,base) {
    let result = { "success":false ,"error":{} ,"data":{} };   
    try{
        //////////////////取出传入文件信息
        let {filesize,filename,filetmpdir,filetype} =  option;
        //////////////////////取出需要处理信息
        let static_url = __dirname +"/../../"+base["static"] || "";    
        let file_url = __dirname +"/../../"+ base["file"] || "";    
        let view_url = __dirname +"/../../"+ base["view"] || "";

        let activite_hash = null;
        let activite_id = null;
        if(base.activite){
            activite_hash = base["activitehash"] || base["activite"]["hash"] || "";  
            activite_id = base["activiteid"] || base["activite"]["id"] || ""; 
        }
        //保存文件
        if(option){
            if(!isEmpty(base)){
                var tmpdir_store = path.join(os.tmpdir(), path.basename(filename));//临时存储文件
                let file_extension = path.extname(tmpdir_store);//获取文件后缀名 ==>.jpg

                let store_name_ID = snowflake.nextId();//生成文件存储的唯一ID
                var store_file_name = store_name_ID+file_extension;//生成存储的唯文件一ID名字
                
                // var dest = path.join(static_url,filetype,store_file_name);   //  正式的存储的地方
                var dest = path.join(static_url,orgHash,filetype,store_file_name);   //  测试使用存储的地方
                
                let readeStream = fs.createReadStream(filetmpdir);                
                var writeStream = fs.createWriteStream(tmpdir_store);
                readeStream.pipe(writeStream);
                writeStream.on("close", function () {
                    fse.move(tmpdir_store, dest, function (err) {
                        if (err) throw err;
                        console.log(  "yes")
                    });
                })
                    
                //存储数据
                let FileModel = Models.getTableModel(orgHash,"File");
                let store = {};
                store.hash = store_name_ID ;
                store.path = dest;
                // store.address = path.join(orgHash,filetype,store_file_name);//////////////
                // store.activitehash = activite_hash || orgHash; 
                store.address = path.join(orgHash,filetype,store_file_name).replace(/\\/g,'/');//////临时
                store.describe = base.describe || filetype;
                store.size = filesize ;
                store.name = filename ;
                store.storaname = store_file_name ;
                let store_file_data  =  await FileModel.create(store);
                result["data"] = store_file_data['dataValues'];
                result["type"] = file_extension;
                delete result["data"]["deletedAt"];                
                result["success"] =true;
            }else{
                result["error"] = await ErrorParse("缺少 base 参数 未知错误");                                 
            }
        }else{
            result["error"] = await ErrorParse("文件传输失败");                 
        }            
    }catch(error){
        result["error"] = await ErrorParse(error);                 
    }
    return result;
};
