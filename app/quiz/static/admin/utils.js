///公用js
function getsubject(param) {
    return fetch({
        url: 'api/subject/info',
        method: 'post',
        data: param 
    });
};
// function Getlist(){
//     let option={};
//     option.size = 10;
//     option.page = 1;
//     getList("ss").then(function(res){
//         console.log(res.data);
//     })
// };
function Getlist(param) {
    return fetch({
        url: 'api/subject/list',
        method: 'post',
        data: param 
    });
};
//获取题库分组
function group(param) {
    return fetch({
        url: 'api/subject/group',
        method: 'post',
        data: param 
    });
};
//获取模型
function getModel(tablename) {
    return fetch({
        url: '/api/model/attr?table='+tablename,
        method: 'get',
    });
}
///试卷列表
function getpaperList(param) {
    return fetch({
        url: 'api/paper/list',
        method: 'post',
        data: param 
    });
};
///试卷详情
function PaperInit(param) {
    return fetch({
        url: 'api/paper/info',
        method: 'post',
        data: param 
    });
};
//答卷列表
function GetAnswerSheetList(param) {
    return fetch({
        url: 'api/answersheet/list',
        method: 'post',
        data: param 
    });
};
//答卷列表
function GetAnswerSheetInit(param) {
    return fetch({
        url: 'api/answersheet/info',
        method: 'post',
        data: param 
    });
};
//答卷列表所有信息
function GetAnswerSheetInits(param) {
    return fetch({
        url: 'api/answersheet/infos',
        method: 'post',
        data: param 
    });
};




function fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            timeout: 5000
        });
        instance(options)
            .then((response) => {
                if(response["status"] ===  200  && response["data"]["success"] === true ){
                    resolve(response["data"]);
                }else{                
                    let error = response["data"]["error"];
                    reject(error);
                    console.log(response["data"])
                }
                const res = response.data;
            })
            .catch(error => {
                reject(error);
            });
    });
}