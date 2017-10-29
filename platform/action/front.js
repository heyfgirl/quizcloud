'use strict';
const ErrorParse = require("../../Data/tool/error.js");
const Model = require('./../model/index');

exports.fields = async (tbname) =>{
    let result = {"success":false,"data":{},"error":{}};

    try{
        let frontModel = await Model.getFrontModel(tbname);
        result.data = frontModel;
        // let frontModel = await Model.getFrontModel(tbname);
        // let {query,search,order} = frontModel;
        // for(let key of Object.keys(frontModel.attributes)){
        //     if(frontModel.attributes[key]['query']){
        //         let attrObj = {};
        //         attrObj.index = frontModel.attributes[key]['index'];
        //         attrObj.title = frontModel.attributes[key]['title'];
        //         attrObj.title
        //         attributes.push(attrObj)

        //     }
            
        // }
        

        // result.data = {"query":query,"filter":search,"order":order,"attributes":attributes,"props":frontModel.props};
        result.success = true;
    }catch(e){
        result.error = await ErrorParse(e);
    }
    return result;
}