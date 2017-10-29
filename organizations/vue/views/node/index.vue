<template>
  <div class="app-container">
    <div class="wrapper">
      节点管理
      <i>{{path}}</i>
    </div>
  </div>
</template>
<style scoped>
  .wrapper{
      width: 800px;
      margin: 30px auto;
  }
</style>


<script>
    export default {
          computed: {
            path() {
                return this.$route.path;
            }
          }


    }

</script>