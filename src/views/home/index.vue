<template>
  <div class="app-container">
    <h4>Element 2.11</h4>
    <div class="demo-image__preview">
      <el-image :src="url" :preview-src-list="srcList" style="width: 100px; height: 100px" />
    </div>
    <el-button type="text" @click="table = true">打开嵌套表格的 Drawer</el-button>
    <el-drawer
      title="我嵌套了表格!"
      :visible.sync="table"
      direction="rtl"
      size="50%"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      table: false,
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ]
    }
  }
}
</script>
