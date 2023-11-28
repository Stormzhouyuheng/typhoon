<template>
  <div class="app-container">
      <!--左侧列表弹层-->
      <listPanel
        :titleList.sync="listPanelTitleList"
        customStyle="top:52px;width:462px;"
        @change="tabChange"
        v-if="activeMenu && showLegend"
      >
        <component :is="compList" :curName="tabName" @item-click="itemClick" />
      </listPanel>
      <!--地图底图-->
      <base-map @ready="initLayers" />
      <Legend v-if="showLegend" />
  </div>
</template>

<script>
import baseMap from "@/views/components/NMap";
import listPanel from "@/views/components/listPanel/index";
import Legend from "./typhoon_info/typhoonLegend.vue";

export default {
  name: "index",
  components: {
    baseMap,
    listPanel,
    Legend
  },
  data() {
    return {
      index:0,
      mapMenuList: [
        {
          name: "typhoonInfo",
          title: "台风路径",
          icon: "taifeng",
          component: "typhoon_info/index",
          path: "videoInfo",
          rolePermi: "",
          listItem: [
            {
              name: "typhoonPath",
              title: "台风路径"
            },
            {
              name: "typhoonAnalysis",
              title: "台风分析"
            }
          ]
        }
      ],
      activeMenu: "",
      tabName: "typhoonAnalysis",
      listPanelTitleList: "",
      compList: null,
      showLegend: false
    };
  },

  mounted() {
    this.menuItemClick("typhoonInfo", this.mapMenuList[0]);
  },
  computed: {},
  beforeDestroy(){
    this.showLegend = false;
  },
  methods: {
    initLayers() {
      this.showLegend = true;
    },
    //装载列表组件
    mountedList({ component }) {
      if (component) {
        this.compList = resolve =>
          require(["./" + component + ".vue"], resolve);
      }
    },
    //地图上导航菜单点击
    menuItemClick(activeMenu, item) {
      const { listItem } = item;
      //加载列表组件在页面上显示
      this.mountedList(item);

      this.activeMenu = activeMenu;
      //设置列表标题及默认展开项
      this.listPanelTitleList = listItem;
      this.tabName = listItem.length ? listItem[0]["name"] : "";
    },
    tabChange(name) {
      this.tabName = name;
    },
    itemClick(item) {
      if (item.type) {
      }
    },
  }
};
</script>

<style scoped lang="scss">
.app-container {
  position: relative;
  padding: 0;
  overflow: hidden;
  user-select: none;

  /deep/.el-tabs {
    .el-tabs__header {
      margin-bottom: 2px;
    }
  }

  /deep/.gradient-bg {
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
  }

  /deep/.el-table--mini th,
  /deep/.el-table--mini td {
    padding: 0 !important;
  }
  /deep/ .el-table {
    .cell {
      padding: 4px;
    }

    &::before {
      height: 0;
    }
    .el-table__header-wrapper {
      border: 1px solid #e8e8e8;
      border-radius: 8px;
    }

    th.is-leaf {
      border: none;
    }

    td {
      border-bottom: 1px dashed #ccc;
      border-right: 1px dashed #ccc;
      &:last-child {
        border-right: 1px dashed transparent;
      }
    }
    .el-table__header-wrapper th,
    .el-table__fixed-header-wrapper th {
      background: #fafafa;
    }

    &.el-table--striped .el-table__body tr.el-table__row--striped td {
      /* background: #f6fdff;*/
      background: #f5f9fa;
    }

    &.list-panel-table .el-table__header-wrapper {
      border: 1px solid #0099f2;
      /*border-width: 1px 0;*/
      border-radius: 3px;
    }

    &.list-panel-table th,
    &.list-panel-table td {
      padding: 6px 0;
      font-size: 12px;
    }

    &.list-panel-table .cell {
      padding-left: 2px;
      padding-right: 2px;
    }

    &.list-panel-table .el-table__header-wrapper th,
    &.list-panel-table .el-table__fixed-header-wrapper th {
      color: #2196f3;
      background-color: #def7fc;
      height: 26px;
      line-height: 26px;
      font-weight: 600;
    }
    .el-table__body {
      tr:nth-child(even) {
        background: #fcfdff;
      }
    }
  }

  .text-link {
    color: #fff;
  }
}
</style>
