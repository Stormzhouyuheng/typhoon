<template>
  <l-control
    ref="lc"
    :position="position"
    class="leaflet-control-zoom leaflet-bar a-navbar-wrapper"
  >
    <el-popover placement="left" trigger="click">
      <ul class="baselayer-popper">
        <li
          v-for="(item, i) in baseLayers"
          :key="i"
          class="baselayer-item"
          :class="currentBaseLayer === i ? 'selected' : ''"
          @click="baseLayerClick(i, item)"
        >
          <img :src="item.imgUrl" alt="" />
          <span>{{ i }}</span>
        </li>
      </ul>
      <el-button
        icon="el-icon-coin"
        slot="reference"
        size="mini"
        title="底图"
      ></el-button>
    </el-popover>
    <el-button
      size="mini"
      icon="el-icon-house"
      @click="setHomeView"
      title="home"
    ></el-button>
    <el-button
      size="mini"
      icon="el-icon-back"
      @click="setBackView"
      :disabled="!(historyList.length > 1)"
      title="后退"
    ></el-button>
    <el-button
      size="mini"
      icon="el-icon-right"
      @click="setFrontView"
      :disabled="!!!historyBack.length"
      title="前进"
    ></el-button>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import lControl from "../mixins/lControl";
import history from "./mixins/historyHandle";
import baseLayer from "./mixins/baseHandle";

export default {
  name: "NNavBar",
  mixins: [lControl, history, baseLayer],
  components: { LControl },
  props: {
    position: {
      type: String,
      default: "topright"
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.a-navbar-wrapper {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  background: #fff;
  overflow: hidden;
  box-shadow: 2px 1px 5px #ccc;
  button {
    margin: 0;
    border: none;
    border-radius: 0;
    height: 30px;
    width: 30px;
    padding: 7px;
    &:nth-child(n + 2) {
      border-top: 1px solid #ccc;
    }
    :nth-child(n) {
      font-size: 16px;
    }
  }
  .contextmenu-tips {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: #fff;
    border-radius: 2px;
    overflow: hidden;
    p {
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background-color: #c3c3c3;
        color: #00a0e9;
      }
    }
  }
}
.baselayer-popper {
  margin: 0;
  padding: 0;
  display: inline-flex;
  vertical-align: middle;
  .baselayer-item {
    position: relative;
    list-style: none;
    width: 50px;
    height: 50px;
    text-align: center;
    img {
      border: 1px solid #ccc;
    }
    span {
      position: absolute;
      bottom: -1px;
      left: 2px;
      right: 0;
      background-color: #ffffffcf;
    }
    &:hover {
      span {
        color: #00a0e9;
      }
    }
    &.selected {
      span {
        color: #00a0e9;
      }
    }
  }
  li:nth-child(n + 2) {
    margin-left: 5px;
  }
}
</style>
