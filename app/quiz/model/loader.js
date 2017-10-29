'use strict';

// 需要使用的模型的文件名
let modelList = ["subject","paper","answersheet"];

// 加载所有module
//加载机构的模型（文件名，不含.js）

let models = [];
for (let key of modelList) {
    let model = require("./" + key);
    models.push(model);
}
var exp={
    // 模型原始文件
    "models":models,
    // 同步 org的 models 方法（引用）
    "complete":complete
}

// 加载完成，注入反射
function  complete(organModel){
    // 修改当前exports（尝试是否成功）
    exp = organModel;
}

module.exports = function(){
    return exp
}

// require后需要自行