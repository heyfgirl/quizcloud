<!-- 用户列表 -->
<template>
    <div class="app-container">
        <div class="wrapper-content">
             <Card shadow style="heigth:100%">
                <p slot="title">使用阴影效果的卡片</p>
                <div class="wrapper-apps">
                    <div class="contentcative">
                        <Row :gutter="16">
                            <Col span="4" v-for="app in apps" class="appdiv" >
                                {{app.name}}
                            </Col>
                        </row>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
import { getModel} from 'common/api/model';
export default {
    data() {
        return {
            apps:[
                {
                    hash:"quiz",
                    name:"竞赛云",
                    explain:"竞赛云是新项目",
                    img:"123"
                }, 
            ],
        }
    },
    created() {
    },
    //监视变量变化
    watch: {
    },
    methods: {
    }
}
</script>
<style rel="stylesheet/less" lang="less" scoped>
.contentcative{
    min-height: 600px;
}
.appdiv{
    line-height: 7;
    text-align: center;
    height: 100px;
    background: #DEB887;
    margin: 19px;
}
</style>
