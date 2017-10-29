<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
import '../../dist/ueditor/ueditor.config.js'
import '../../dist/ueditor/ueditor.all.min.js'
import '../../dist/ueditor/lang/zh-cn/zh-cn.js'
// import '../../assets/ueditor/ueditor.parse.min.js'
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      value: {
        type: String,
        default: null,
      },
      config: {
        type: Object,
        default: {},
      }
    },
    watch: {
      value: function value(val, oldVal) {
        this.editor = UE.getEditor('editor', this.config);
        if (val !== null) {
          this.editor.setContent(val);
        }
      },
    },
    created() {
    },

    mounted() {

      this.editor = UE.getEditor('editor', this.config); // 初始化UE
      this.editor.addListener("ready", function () {
            // this.execCommand();
      });
      this.editor.addListener("contentChange", function () {
            const wordCount = this.editor.getContentLength(true);
            const content = this.editor.getContent();
            const plainTxt = this.editor.getPlainTxt();
            this.$emit('input', { wordCount: wordCount, content: content, plainTxt: plainTxt });
      }.bind(this));


    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>