<template>
  <div class="tool-container">
    <div ref="title" class="tool-title" draggable="true">
      <slot name="title">
        <span class="title-span">{{ name }}</span>
      </slot>
      <div class="placeholder"></div>
      <div v-if="showClose" class="close" @click="close" @mousedown.stop="">
        <i class="el-icon-close tool-btns"></i>
      </div>
    </div>
    <div class="item-space-line"></div>
    <div class="tool-content">
      <slot><div>widget inner</div></slot>
    </div>
  </div>
</template>

<script>
import { mouseBounds, calcPositon, getMiddlePositon } from "../../utils";

export default {
  name: "Widget",
  props: {
    name: {
      type: String,
      default: "widget"
    },
    showClose: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    right: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      zIndex: 1200
    };
  },
  mounted() {
    this.setPosition();
    this.dragSetting();
  },
  methods: {
    setStyle(styles) {
      if (styles) {
        Object.keys(styles).forEach(key => {
          if (key !== "display") {
            this.$el.style[key] = styles[key];
          }
        });
      }
    },
    setPosition() {
      let styles = {};
      if (this.zIndex) {
        styles = { zIndex: this.zIndex };
      }
      let positon = this.getPosition();
      if (positon) {
        styles = {
          ...styles,
          ...positon
        };
      } else {
        //居中
        const { left, top } = getMiddlePositon(
          this.$el.parentElement.getBoundingClientRect(),
          this.$el.getBoundingClientRect()
        );
        styles = {
          ...styles,
          top: top + "px",
          left: left + "px"
        };
      }
      this.setStyle(styles);
    },
    getPosition() {
      let res = null;
      const { left, right, top, bottom } = this;
      let dics = ["top", "right", "bottom", "left"];
      [top, right, bottom, left].map((postion, i) => {
        if (postion) {
          res = res || {};
          res[dics[i]] = postion + "px";
        }
      });
      return res;
    },
    dragSetting() {
      let widgetDiv = this.$el;
      let titleDiv = this.$refs["title"];
      titleDiv.onmousedown = evt => {
        evt.preventDefault();
        let bubble = false; //修复 拖动过程中，mouseup时鼠标被其它内容挡住的情况下冒泡终止，组件widgetClick无法触发
        let parentElement = widgetDiv.parentElement;
        let mBounds = mouseBounds(
          evt,
          titleDiv.getBoundingClientRect(),
          parentElement.getBoundingClientRect()
        );
        titleDiv.onmouseup = evt => {
          evt.preventDefault();
          titleDiv.onmouseup = null;
          bubble = true;
        };
        let style = widgetDiv.style;
        parentElement.onmousemove = evt => {
          evt.preventDefault();
          if (evt === null) evt = window.event; // IE
          let pt = calcPositon(evt, mBounds);
          //根节点为绝对定位，上下左右两个方向上，每个方向只能存在一个属性
          style.right = null;
          style.bottom = null;

          style.left = pt.left + "px";
          style.top = pt.top + "px";
          style.opacity = 0.9;
        };
        parentElement.onmouseup = evt => {
          evt.preventDefault();
          parentElement.onmousemove = null; // 鼠标举起，停止
          parentElement.onmouseup = null;
          style.opacity = 1;
          !bubble && this.widgetClick();
        };
      };
    }
  },
  beforeDestroy() {
    this.$refs["title"] && (this.$refs["title"].onmousedown = null); //事件清空
  },
  destroyed() {
    if (this.appendNode && this.appendNode.contains(this.$el)) {
      this.appendNode.removeChild(this.$el);
    }
  }
};
</script>

<style scoped lang="scss">
$borderColor: #dcdcdc;
$buttonColor: #1890ff;
.tool-container {
  position: absolute;
  max-height: 42rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0.52rem 0.21rem rgba(0, 0, 0, 0.1);
  border-radius: 0.21rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  min-height: 100px;
  .tool-title {
    background: -webkit-linear-gradient(
      1deg,
      rgba(0, 153, 255, 1) 0%,
      rgba(0, 153, 255, 1) 0%,
      #1acaef 100%,
      #1acaef 100%
    );
    background: -moz-linear-gradient(
      89deg,
      rgba(0, 153, 255, 1) 0%,
      rgba(0, 153, 255, 1) 0%,
      #1acaef 100%,
      #1acaef 100%
    );
    background: linear-gradient(
      89deg,
      rgba(0, 153, 255, 1) 0%,
      rgba(0, 153, 255, 1) 0%,
      #1acaef 100%,
      #1acaef 100%
    );
    height: 2.25rem;
    line-height: 2.25rem;
    padding: 0 0.375rem;
    /* padding-left: 2rem; */
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 1);
    display: inline-flex;
    align-items: center;
    cursor: move;
    .placeholder {
      flex-grow: 2;
    }
    .close {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 20px;
      width: 20px;
      cursor: pointer;
      .tool-btns {
        color: #fff;
      }
      &:hover {
        background-color: rgb(212, 108, 108);
        border-radius: 10px;
        .tool-btns {
          font-weight: bold;
        }
      }
    }
  }
  .logo-btn {
    font-size: 1rem;
    color: white;
    cursor: pointer;
    padding-left: 0.63rem;
    padding-right: 0.42rem;
  }
  .title-span {
    vertical-align: top;
    font-weight: bold;
  }

  .item-space-line {
    width: 100%;
    height: 1px;
    background: rgba(220, 220, 220, 1);
  }
  .tool-content {
    margin: 0.6rem 1rem 1rem;
  }
}
</style>
