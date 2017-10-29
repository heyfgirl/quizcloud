define(['vue'],function(Vue){
    var header = Vue.extend({
        template:`
        <div class = "content">
            <nav class="pull-left">    
                <span>主办单位：<a href="http://amazeui.org" >上业科技</a></span>
                <span>|</span>
                <span><a href="http://amazeui.org" >上海市教育局</a></span>
                <span>|</span>
                <span>承办单位：<a href="http://amazeui.org" >上业云竞赛</a></span>
            
            </nav>
            <nav class="pull-right navRight" >
                    <span>客服热线：<a href="http://amazeui.org" >010-5326480</a></span>
                    <span>|</span>
                    <span><a href="http://amazeui.org" >帮助中心</a></span>
                    <span>|</span>
                    <span><a href="http://amazeui.org" >首页链接</a></span>
            </nav>
            <div class="clear" ></div>
        </div>
        `,
        data(){
            return {
                rows:[]
            }
        },
        methods:{

        }

    });

    Vue.component("quiz-head",header);
    
    return header;

});