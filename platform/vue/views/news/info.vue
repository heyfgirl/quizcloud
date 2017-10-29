<template>
 <div class="app-container">
        <div class="wrapper-content">
            <Row type="flex" justify="center" align="top" class="code-row-bg">
              <Col span="18">
                <Card shadow>
                  <p slot="title">使用阴影效果的卡片</p>
                  <div class="components-container">
                    <Row>
                        <Col span="18">
                            <Row>
                                <Col span="12">
                                <div class="info">
                                    <span style="font-size:20px">新&nbsp;闻&nbsp;主&nbsp;题：</span>
                                    <Input v-model="title" class="inputserce" placeholder="请输入新闻主题..."></Input>
                                </div>
                                </Col>
                                <Col span="12">
                                <div class="info">
                                    <span  style="font-size:20px">发布日期：</span>
                                    <Date-picker v-model="release" class="inputserce" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间（不含秒）"></Date-picker>
                                </div>
                                </Col>
                                <Col span="12">
                                <div class="info">
                                    <span  style="font-size:20px">新闻编辑人：</span>
                                    <Input  class="inputserce" v-model="edit" placeholder="请输入新闻主题..."></Input>
                                </div>
                                </Col>
                                <Col span="12">
                                <div class="info">
                                    <span  style="font-size:20px">发布活动：</span>
                                    <Select v-model="activitehash" style="width:200px">
                                        <OptionGroup label="热门活动">
                                            <Option v-for="item in activiteList" :value="item.hash" :key="item.hash">{{ item.label }}</Option>
                                        </OptionGroup>
                                        <OptionGroup label="结束活动">
                                            <Option v-for="item in activite2List" :value="item.hash" :key="item.hash">{{ item.label }}</Option>
                                        </OptionGroup>
                                    </Select>
                                    <!-- <Input class="inputserce" v-model="activitehash" placeholder="请输入新闻主题..."></Input> -->
                                </div>
                                </Col>
                            </Row>    
                        </Col>
                        <Col span="6">
                            新闻封面
                            <Upload
                                ref="upload"
                                type="drag"
                                :show-upload-list="false"
                                :on-success="handleSuccess"
                                :format="['jpg','jpeg','png']"
                                action="/api/file?action=uploadfile">
                                <div style="padding: 20px 0;    height: 140px;">
                                    <img  v-if="img.url" :src="img.url">
                                    <Icon v-if="!img.url" type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p>上传新闻主题图片</p>
                                </div>
                            </Upload>
                        </Col>
                    </Row>
                    <div class="editor-container">
                       <script id="editor" ref="ue" type="text/plain"></script>
                    </div>
                  </div>
                </Card>

                <div class="wrapper-bottom">
                    <div class="sssss">
                            <Button type="success" long @click="getUEContent()">确认提交</Button>
                    </div>
                </div>
              </Col>
          </Row>
        </div>
  </div>
</template>
<style>
  .info{
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }
</style>
<script>
import '../../dist/ueditor/ueditor.config.js'
import '../../dist/ueditor/ueditor.all.js'
import '../../dist/ueditor/lang/zh-cn/zh-cn.js'
import { CreateNews, getNewsInfo} from 'common/api/news';


//  RecomActivite /hash  title  content   edit     editid  activitehash  img  recom  click  tag  grop release

  export default {
    data() {
        return {
            img:{},
            content:"",
            title:"",
            edit:"",
            activitehash:"",
            release:new Date(),
            config: {
            initialFrameWidth: null,
            initialFrameHeight: 500
            },
            activiteList:[
                {
                    hash:"123456",
                    label:"这个好活动",
                }
            ],
            activite2List:[
            ],

            editor:"",
            }
    },
    created(){
        
    //   RecomActivite().then(function(res){
    //     let list = [];
    //     if(res.success){
    //       for(let li of res.data.rows){
    //         let row = {};
    //         row["hash"] = li["hash"];
    //         row["label"] = li["name"];
    //         list.push(row);
    //       }
    //       that.activiteList = list;
    //     }
    //   }).catch(function(error){
    //     console.log(error)
    //   });
      
    },
    mounted() {
        this.editor =  UE.getEditor('editor', this.config); // 初始化UE
        this.editor.addListener("ready", function () {
            this.execCommand( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
            this.setContent(that.content);
        });
        let that = this;
        let hash = this.$route.query.hash;
        if(hash){
            let option = {};
            option["hash"] = hash;
            getNewsInfo(option).then(function(res){
                if(res.success){
                    let resData = res.data;
                    that.title = resData.title;
                    that.edit = resData.edit;
                    that.activitehash = resData.activitehash;
                    that.release = resData.release;
                    that.content = resData.content;
                    that.img.url = resData.img ? resData.img : "";
                    that.editor.setContent(that.content);
                }
            }).catch(function(error){
                that.$Message.error(error)
                console.log(error)
            });
        }else{
            this.content = "请输入新增新闻。。。";
        };

    },
    destroyed() {
        this.editor.destroy();
    },
    methods: {
        getUEContent() {
            let option ={};
            option.hash= this.$route.query.hash;
            option.content = this.editor.getContent();
            option.title = this.title;
            option.edit = this.edit;
            option.activitehash = this.activitehash;
            option.release = this.release;
            option.img = this.img.url;
            CreateNews(option).then((data)=>{
                this.$Message.success("保存成功!");
                this.$router.push({ path: '/news/list'});                                                           

            }).catch(function(error){
                this.$Message.error(error)
            });
        },
        destroyed() {
            this.editor.destroy();
        },
        handleSuccess(file){
            this.img = file;
        },
    }
  };
</script>
<style scoped>
  .inputserce{
    width:200px;
    margin-top:-10px;
  }
  .info{
  }
  </style>