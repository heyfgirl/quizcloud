
var Model = require("../model/index");
// 获取指定模型前端数据
exports.frontAttr = async(ctx,next)=> {
    try {
        let result=   {"success":false, "error":{}, "data":{}};
        let tablename = ctx.query["table"] ||"";
        if(tablename &&　tablename.length){
            result["data"] = Model.getFrontModel(tablename);
            result["success"] = true;
        }else{
            result["msg"] ="缺少表名"; 
        }
        return ctx.body = result;
    }catch(err){
        console.log(err);
        return ctx.body = err;
    }
}


