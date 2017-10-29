'use strict';
const ErrorParse = require("../../Data/tool/error.js");
const {FrontAction} = require('./../action/index');

exports.fields = async(ctx,next)=>{
    let result = {"success":false,"data":{},error:{}};
    let tbname = ctx.params.tbname || "";
    tbname ? result = await FrontAction.fields(tbname) : result.error = await ErrorParse("args err");
    ctx.body = result;
}
