<template>
  <div
    class="fixed-panel"
    :class="[packUpDirection, isOpenList ? 'open' : 'close']"
    :style="customStyle"
  >
    <div class="list-panel" :style="contentStyle" v-show="isOpenList">
      <div class="list-title">
        <slot name="panel-title">
          <ul class="title-tab">
            <li
              v-for="item in titleList"
              :class="item.name === activeTabName ? 'is-active' : ''"
              @click="titleTabClick(item)"
              :key="item.name"
            >
              <svg-icon :icon-class="item.iconClass" v-if="item.iconClass" />
              {{ item.title }}
            </li>
          </ul>
        </slot>
      </div>
      <div class="list-con">
        <slot></slot>
      </div>
    </div>
    <div
      class="extend-btn"
      :class="isOpenList ? 'open' : ''"
      :title="isOpenList ? '收起' : '展开' + title"
      @click="isOpenList = !isOpenList"
    >
      <span class="out-jump-click">
        <svg-icon icon-class="arrow" />
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: " "
    }, //展开收起移上去的标题
    titleList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    iconClass: {
      type: String,
      default: "list-search"
    },
    customStyle: {
      type: String,
      default: ""
    },
    contentStyle: {
      type: String,
      default: ""
    },
    packUpDirection: {
      type: String,
      default: "right"
    }
  },
  data() {
    return {
      isOpenList: true,
      activeTabName: ""
    };
  },
  mounted() {
    if (this.titleList.length) {
      this.activeTabName = this.titleList[0]["name"];
    }
  },
  methods: {
    titleTabClick(item) {
      this.$emit("change", (this.activeTabName = item.name));
    }
  }
};
</script>
<style lang="scss" scoped>
.fixed-panel {
  z-index: 1009;
  position: absolute;
  width: 20vw;
  height: calc(100% - 70px);

  .list-panel {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1010;
    padding: 0;
    border-radius: 0.25rem;
    box-shadow: 0 0 0.25rem #1a8cffbf;
    background: #fff;

    .list-title {
      display: flex;
      padding: 0 0.625rem;
      height: 2.25rem;
      line-height: 2.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.25rem 0.25rem 0 0;
      color: #fff;
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

      .title {
        .svg-icon {
          margin: 0 5px;
        }

        flex: 1;
      }

      .title-tab {
        padding: 0.25rem 0 0 0;
        margin: 0;
        height: 2.25rem;
        list-style-type: none;

        li {
          padding: 0 0.5rem;
          border-radius: 5px 5px 0 0;
          display: inline-block;
          cursor: pointer;

          &.is-active {
            background: -webkit-linear-gradient(
              270deg,
              rgba(77, 171, 252, 1) -100%,
              rgba(255, 255, 255, 1) 80%
            );
            background: -moz-linear-gradient(
              180deg,
              rgba(77, 171, 252, 1) -100%,
              rgba(255, 255, 255, 1) 80%
            );
            background: linear-gradient(
              180deg,
              rgba(77, 171, 252, 1) -100%,
              rgba(255, 255, 255, 1) 80%
            );
            color: #0099ff;
          }
        }
      }

      .action {
        width: 50px;
        font-weight: 400;
        font-size: 0.75rem;
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .list-con {
      padding: 0.5rem;
      height: calc(100% - 2.25rem);
      border: 2px solid #1a8cff;
      border-width: 0 2px 2px;
      border-radius: 0 0 0.25rem 0.25rem;
    }
  }

  .extend-btn {
    position: absolute;
    text-align: center;
    cursor: pointer;
    color: #fff;

    &:before {
      z-index: 1009;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
    }

    span {
      display: block;
      position: relative;
      z-index: 1011;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      background: -webkit-linear-gradient(
        0deg,
        rgba(37, 134, 255, 1) 0%,
        rgba(77, 171, 252, 1) 100%
      );
    }
  }

  &.right,
  &.left {
    .extend-btn {
      width: 20px;
      height: 50px;
      line-height: 50px;
      margin-top: -25px;
      top: 50%;
    }
  }

  &.right {
    right: 10px;

    .extend-btn {
      left: -10px;

      &:before {
        top: -16px;
        left: -16px;
        border-top: 18px solid transparent;
        border-right: 18px solid #113e76;
        border-left: 18px solid transparent;
      }

      .svg-icon {
        transform: rotate(90deg);
      }

      &.open {
        .svg-icon {
          transform: rotate(-90deg);
        }
      }
    }
  }

  &.left {
    left: 10px;

    .extend-btn {
      right: -10px;

      &:before {
        top: -14px;
        left: 0px;
        border-top: 18px solid transparent;
        border-right: 18px solid transparent;
        border-left: 20px solid #113e76;
      }

      .svg-icon {
        transform: rotate(-90deg);
      }

      &.open {
        .svg-icon {
          transform: rotate(90deg);
        }
      }
    }
  }

  &.bottom,
  &.top {
    .extend-btn {
      height: 20px;
      line-height: 20px;
      width: 50px;
      margin-left: -25px;
      left: 50%;
    }
  }

  &.bottom {
    bottom: 10px;

    .extend-btn {
      top: -17px;

      &:before {
        top: 0px;
        left: -33px;
        border-top: 18px solid transparent;
        border-right: 18px solid #113e76;
        border-left: 18px solid transparent;
      }

      .svg-icon {
        transform: rotate(180deg);
      }

      &.open {
        top: -10px;

        .svg-icon {
          transform: rotate(0deg);
        }
      }
    }
  }

  &.top {
    top: 10px;

    .extend-btn {
      bottom: -10px;

      .svg-icon {
        transform: rotate(0deg);
      }

      &.open {
        .svg-icon {
          transform: rotate(180deg);
        }
      }
    }
  }

  &.left.close,
  &.right.close {
    width: 0 !important;
  }

  &.top.close,
  &.bottom.close {
    height: 0 !important;
  }
}
</style>
