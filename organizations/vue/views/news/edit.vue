<template>
 <div class="app-container">
        <div class="wrapper-content">
            <Row type="flex" justify="center" align="top" class="code-row-bg">
              <Col span="18">
                <Card shadow>
                  <p slot="title">使用阴影效果的卡片</p>
                  <div class="components-container">
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
import { CreateNews,RecomActivite } from 'common/api/news';


///hash  title  content   edit     editid  activitehash  img  recom  click  tag  grop release

  export default {
    data() {
      return {
        activemode:"",

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
          {
            hash:"sdfasdfs",
            label:"这个结束的活动1",
          },
          {
            hash:"sdfasdfs",
            label:"这个结束的活动2",
          },
          {
            hash:"sdfasdfs",
            label:"这个结束的活动3",
          }
        ],

        editor:"",
      }
    },
    created(){
      let that = this;
      RecomActivite().then(function(res){
        let list = [];
        if(res.success){
          for(let li of res.data.rows){
            let row = {};
            row["hash"] = li["hash"];
            row["label"] = li["name"];
            list.push(row);
          }
          that.activiteList = list;
        }
      }).catch(function(error){
        console.log(error)
      });
      
    },
    mounted() {
      this.editor =  UE.getEditor('editor', this.config); // 初始化UE
      this.editor.addListener("ready", function () {
          this.execCommand( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
          this.setContent("请在此处编辑。。。");
      });

    },
    destroyed() {
      this.editor.destroy();
    },
    methods: {
      getUEContent() {
        let option ={};
        option.content = this.editor.getContent();
        option.title = this.title;
        option.edit = this.edit;
        option.activitehash = this.activitehash;
        option.release = this.release;
        CreateNews(option).then((data)=>{
          
        });
      },
      destroyed() {
        this.editor.destroy();
      }
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