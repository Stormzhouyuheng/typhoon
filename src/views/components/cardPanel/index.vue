<template>
  <div class="card-panel-wrapper">
    <div ref="title" class="tool-title">
      <div class="title">
        <slot name="title">
          <span class="mr5 ml5"><i class="el-icon-tickets" /></span>
          <span class="title-span">{{ name }}</span>
        </slot>
      </div>
      <div class="placeholder">
        <slot name="placeholder"></slot>
      </div>
      <div class="title-right">
        <slot name="timeText"></slot>
        <slot name="refresh">
          <a @click="refreshClick" class="text-transition"><i class="el-icon-refresh"></i></a>
        </slot>
        <slot name="btnGroup"></slot>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    name: {
      type: String,
      default: 'card'
    }
  },
  methods:{
    refreshClick(){
      this.$emit('refreshClick');
    }
  }
};
</script>

<style scoped lang="scss">
.card-panel-wrapper {
  background: #fff;
  margin: 10px;
  padding: 15px;
  .tool-title {
    display: flex;
    margin-bottom: 15px;
    .title {
      font-size: 15px;
      color: #20a6ff;
      font-weight: bold;
      i {
        font-size: 16px;
      }
      .svg-icon {
        font-size: 18px;
      }
    }
    .placeholder {
      flex: 1;
    }
    .title-right {
      color: #666;
    }
  }
}
</style>
