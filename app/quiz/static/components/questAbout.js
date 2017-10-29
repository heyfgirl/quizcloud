define(['vue'],function(Vue){
    var quest = Vue.extend({
        template:`
        <div class="answer-about">
        <h4>试题详情</h4>
        <div class="level">
            <label>难度等级：</label>
           
                <i v-for="star in yellowstars" style="display:inline-block;width:12px ;height:12px;padding:0 8px;background:url(./static/img/yellowstar.png) no-repeat;" ></i>
                <i v-for="star in greystars" style="display:inline-block;width:12px ;height:12px;padding:0 8px;background:url(./static/img/greystar.png) no-repeat;" ></i>
            
        </div> 
        <p>{{desc}}</p>

    </div>
        `,
        props:['desc','difficulty'],
        computed:{
            yellowstars(){
                var stars = [];
                for(var i=0;i< parseInt(this.difficulty) ;i++){
                    stars.push(i);
                }
                return stars;
            },
            greystars(){
                var stars = [];
                for(var i=0;i< 5 - (this.difficulty);i++){
                    stars.push(i);
                }
                return stars;
            }
        },
       
    });

    Vue.component('quest-about',quest);

    return quest;

});