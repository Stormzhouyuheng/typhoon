<template>
  <div class="panel-wrap">
    <el-row>
      <el-col :span="defaultLeft">
        <slot name="title">
          <p class="title">{{ title }}</p>
        </slot>
      </el-col>
      <el-col :span="defaultRight" class="action">
        <slot name="action"></slot>
      </el-col>
    </el-row>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {
      defaultLeft: 12,
      defaultRight: 12
    };
  },
  mounted() {
    if (!this.$slots['action']) {
      this.defaultLeft = 24;
      this.defaultRight = 0;
    }
  }
};
</script>
<style lang='scss' scoped>
.panel-wrap {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #727cf5;
    margin-top: 0;
    margin-bottom: 20px;
  }

  .action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .panel-content {
    flex-grow: 2;
  }
}
</style>