new Vue({
    el: '#app',
    data: {
        visible: false
    },
    methods: {
        show: function () {
            this.visible = true;
        },
        Getlist:function(){
            this.$http.get("/123456/api/subject/list").then(function(data){
                console.log(data)
            },function(response){
                console.info(response);
            })
        }
    }
})



function getList(param) {
return fetch({
    url: '123456/api/user/list',
    method: 'post',
    data: param 
});
}
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
                // alert( response["data"])
                let error = response["data"]["error"];
                Message.error(error);
                reject(error);
            }
            const res = response.data;
        })
        .catch(error => {
            // alert(error)
            Message.error("请求失败!");
            reject(error);
        });
});
}