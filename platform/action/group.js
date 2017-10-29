'use strict';
const ErrorParse = require("../../Data/tool/error.js");
const Models = require('./../model/index');
const uid = require('uid');

exports.update = async(options)=>{
    let result = {'success:':false,'data':{},'error':{}};

    let GroupModel = Models.getTableModel('Group');
    let CommonModel = Models.getTableModel(options.type);

    if(CommonModel){//检查该类型分组是否被模型使用

        if(options.delKey){//删除分组
            //检查该分组是否使用,有则将分组全部修改为默认：normal
            await CommonModel.update({'gflag':'normal'},{'where':{'gflag':delKey}});

        }

    }

    try{
        let group = await GroupModel.findOne({'where':{'type':options.type}});
        for(let index = 0;index<options.groups.length;index++){
            options.groups[index] = JSON.stringify(options.groups[index]);
        }
        if(group){
            await GroupModel.update({"value":options.groups},{"where":{"type":options.type}});
        }else{
            result.data = await GroupModel.create({'type':options.type,'value':options.groups});
        }

        result.success = true;
    }catch(e){
        result.error = await ErrorParse(e);
    }
    return result;
}

exports.list = async(type)=>{
    let result = {'success':false,'data':{},'error':{}};

    let GroupModel = Models.getTableModel('Group');

    try{
        let group = await GroupModel.findOne({'where':{'type':type}});
        if(group){
            result.data.groups = [];
            for(let val of group.dataValues.value){
                result.data.groups.push(JSON.parse(val));
            }

            
            result.success = true;
        }else{
             result.error = await ErrorParse('no this group type');
        }
        
    }catch(e){
        result.error = await ErrorParse(e);
    }
    return result;
}

exports.create = async(option)=>{
    let result = {'success':false,'data':{},'error':{}};

    let GroupModel = Models.getTableModel("Group");

    try{
        let exixted = await GroupModel.findOne({'where':{'type':option.type}});

        if(exixted){
            let groups = exixted.dataValues.value||[];
            for(let index = 0;index<groups.length;index++){ 

                groups[index] = JSON.parse(groups[index]);
                if(groups[index]['name'] == option.name){
                    result.error.msg = "该分组已存在";
                    return result;
                }
            }

            groups.push({"key":uid(8),"name":option.name,"edit":false,'readonly':false});
            result.data.groups = groups;

            for(let index = 0;index<groups.length;index++){

            groups[index] = JSON.stringify(groups[index]);
        }

            await GroupModel.update({'value':groups},{'where':{'type':option.type}});
            result.success = true;
           
        }else{
            result.error = await ErrorParse('该分组类型不存在');
        }
    }catch(e){
        result.error = await ErrorParse(e);
    }

    return result;
}

exports.delete = async(option)=>{

}