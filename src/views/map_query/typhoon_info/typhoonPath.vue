<template>
  <div class="content-wrapper">
    <el-row class="item">
      <!-- 台风信息部分 -->
      <el-col :span="12" class="title"
      ><span class="f-w-600">台风信息</span>
        <el-button size="mini" round @click="hideAllTyphoon">全不选</el-button>
        <el-button size="mini" round>数据源</el-button>
      </el-col
      >
      <el-col :offset="4" :span="8">
        <span class="selcet-label">年份选择</span>
        <el-select
          v-model="selectedYear"
          class="w-100"
          size="mini"
          placeholder="请选择"
          @change="yearChange"
        >
          <el-option
            v-for="year in years"
            :key="year"
            :label="year"
            :value="year"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="24">
        <el-table
          ref="typhoonTable"
          class="list-panel-table"
          size="mini"
          :data="typhoonList"
          style="width: 100%"
          @select="typhoonSelect"
          @row-click="tyRowClick"
          height="180"
          :highlight-current-row="true"
          v-loading="listLoading"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
            label-class-name="select-header"
          >
          </el-table-column>
          <el-table-column
            v-for="(item, i) in infoColumns"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :key="i"
            align="center"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 台风实况路径 -->
    <el-row class="item">
      <el-col :span="24" class="title">
        <span class="f-w-600"
        >{{ lastCheckTyphoon ? lastCheckTyphoon['name'] : '' }}实况路径</span
        >
      </el-col>
      <el-col :span="24">
        <el-table
          class="list-panel-table"
          :data="pathList"
          style="width: 100%"
          size="mini"
          height="180"
          v-loading="routeLoading"
          :highlight-current-row="true"
          @cell-mouse-enter="
            row => {
              toggle(row, true);
            }
          "
          @cell-mouse-leave="
            row => {
              toggle(row, false);
            }
          "
          @row-click="rowClick"
        >
          <el-table-column
            v-for="(item, i) in pathColumns"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :key="i"
            align="center"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 城市测距 预报信息 -->
    <el-row class="item" ref="cityWrap">
      <el-col :span="24">
        <el-tabs v-model="activeName">
          <el-tab-pane label="预报信息" name="first">
            <el-table
              class="list-panel-table"
              :data="forecastList"
              style="width: 100%"
              size="mini"
              :height="cityTableHeight"
              :row-style="rowStyle"
            >
              <el-table-column
                v-for="(item, i) in forecastColumns"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :key="i"
                align="center"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="城市测距" name="second">
            <el-table
              class="list-panel-table"
              :data="cityList"
              style="width: 100%"
              size="mini"
              :height="cityTableHeight"
            >
              <el-table-column
                v-for="(item, i) in cityColumns"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :key="i"
                align="center"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment';
import {default as TyphoonManager, getYBColor,getYBDepartment} from '@/views/components/NMap/managers/typhoonManager';
import {getCityDistance, getForecase, getTyphoon, getTyphoonList} from '@/api/typhoon';
export default {
  name: 'TyphoonPath',
  data () {
    return {
      years: [],
      selectedYear: 1945,
      infoColumns: [
        {prop: 'tfbh', label: '编号', width: 70},
        {prop: 'beginTime', label: '开始时间', width: 90},
        {prop: 'endTime', label: '结束时间', width: 90},
        {prop: 'name', label: '名称'}
      ],
      pathColumns: [
        {prop: 'time', label: '时间', width: 80},
        {prop: 'power', label: '风力', width: 50},
        {prop: 'moveSpeed', label: '移动速度(km/h)'},
        {prop: 'speed', label: '最大风速(m/s)'},
        {prop: 'pressure', label: '最低气压(pa)'}
      ],
      cityColumns: [
        {prop: 'cityNm', label: '名称'},
        {prop: 'dst', label: '距离(km)'}
      ],
      forecastColumns: [
        {prop: 'sets', label: '预报单位'},
        {prop: 'forecastTime', label: '时间'},
        {prop: 'power', label: '风力', width: 50},
        {prop: 'speed', label: '风速', width: 50},
        {prop: 'pressure', label: '气压(pa)'},
        {prop: 'moveSpeed', label: '移速'}
      ],
      typhoonList: [],
      pathList: [],
      cityList: [],
      forecastList: [],
      listLoading: false,
      routeLoading: false,
      activeName: 'first',
      lastCheckTyphoon: null,
      typhoonManager: null,
      cityTableHeight: 180,
      forecastDepChecked:[]
    };
  },
  created () {
    let year = new Date().getFullYear();
    this.years = Array(year - 1944)
      .fill()
      .map((item, i)=>year - i);
    this.selectedYear = year;
  },
  mounted () {
    this.getList();
    this.typhoonManager = TyphoonManager.getInstance();
    this.$nextTick(()=>{
      this.cityTableHeight = this.$refs['cityWrap'].$el.clientHeight - 42;
    });
  },
  beforeDestroy () {
    this.hideAllTyphoon();
  },
  methods: {
    //获取台风列表
    getList () {
      this.listLoading = true;
      getTyphoonList({year: this.selectedYear})
        .then(({code, data})=>{
          if (code === 1000 && data.length) {
            this.typhoonList = data.map(
              ({beginTime, endTime, name, eName, ...other}, index)=>{
                return {
                  ...other,
                  beginTime: moment(beginTime).format('MM-DD HH时'),
                  endTime: moment(endTime).format('MM-DD HH时'),
                  name: `${name || '-'}(${eName || '-'})`,
                };
              }
            );
            //年份来回切换时，恢复表格的勾选状态
            this.$nextTick(()=>{
              this.hideAllTyphoon();
              this.restoreSelected.bind(this);
              //当前台风
              this.currentTyphoonSelect();
            });

          } else {
            this.typhoonList = [];
          }
          this.listLoading = false;
        })
        .catch(err=>{
          this.listLoading = false;
          console.log(err);
        });
    },
    //年份改变
    yearChange () {
      this.getList();
    },
    //选中当前台风
    currentTyphoonSelect () {
      let currentList = this.typhoonList.filter(({isCurrent})=>{
        return isCurrent === 1;
      });
      if(currentList.length>0){
        currentList.forEach(item=>{
          this.$refs['typhoonTable'].toggleRowSelection(item);
          this.typhoonSelect(currentList,item);
        })
      }
    },
    //勾选的台风
    typhoonSelect (sels, row) {
      this.lastCheckTyphoon = row;
      this.pathList = [];
      this.$refs['typhoonTable'].setCurrentRow(row);
      if (sels.some(item=>item.tfbh === row.tfbh)) {
        this.getTyphoonPath(row, true);
      } else {
        this.typhoonManager.remove(row.tfbh);
      }
    },
    //台风列表行点击
    tyRowClick (row) {
      this.lastCheckTyphoon = row;
      this.pathList = [];
      this.typhoonList.some(item=>{
        if (item.tfbh === row.tfbh) {
          if (row.pathList) {
            this.pathList = row.pathList;
          } else {
            this.getTyphoonPath(row);
          }
          return true;
        }
      });
    },
    //获取台风路径
    getTyphoonPath (row, add) {
      this.routeLoading = true;
      getTyphoon({tfbh: row.tfbh})
        .then(({code, data})=>{
          if (code === 1000 && data.length) {
            add &&
            this.typhoonManager
              .create(data, row.name)
              .route.on('point-click', evt=>{
              this.getForecaseData(row.tfbh, evt.feature.t, evt.feature);
            });
            let pathList = data
              .map(item=>{
                return {
                  ...item,
                  moveSpeed: item.moveSpeed || '-',
                  time: moment(item.t).format('MM-DD HH时')
                };
              })
              .reverse();
            this.pathList = row.pathList = pathList;
          }
          this.routeLoading = false;
        })
        .catch(err=>{
          console.log(err);
          this.routeLoading = false;
        });
    },

    //实况路径表格滑动提示框展示
    toggle (row, show) {
      this.typhoonManager.toggleTip(row.tfbh, row.t, show);
    },
    //实况路径表格行点击
    rowClick (row) {
      let typhoon = this.typhoonManager.getTyphoon(row.tfbh);
      if (typhoon) {
        this.typhoonManager.imitateClick(typhoon, row.t);
      } else {
        this.getForecaseData(row.tfbh, row.t);
      }
    },
    //获取预报数据
    getForecaseData (tfbh, t, feature) {
      let pointT = moment(t).format('YYYY/MM/DD HH:mm:ss');
      getForecase({
        tfbh,
        pointT
      }).then(({code, data})=>{
        this.forecastDepChecked = [];
        if (code === 1000 && data.length) {
          feature && this.typhoonManager.showForecat(feature, data);
          this.forecastList = data.map(item=>{
            let {sets} = item;
            let forecastDep = getYBDepartment(sets);
            if(this.forecastDepChecked.indexOf(forecastDep) === -1){
              this.forecastDepChecked.push(forecastDep);
            }
            return {
              ...item,
              moveSpeed: item.moveSpeed || '-',
              forecastTime: moment(item.forecastT).format('MM-DD HH时')
            };
          });
        } else {
          this.forecastList = [];
        }
        this.typhoonManager.setForecasts(this.forecastDepChecked);
       // console.log(this.forecastDepChecked);
      });
      this.getCityData(tfbh, pointT);
    },
    getCityData (tfbh, t) {
      getCityDistance({tfbh, t}).then(({code, data})=>{
        this.cityList = data || [];
      });
    },
    //预报表格颜色获取
    rowStyle ({row}) {
      return {color: getYBColor(row.sets)};
    },
    hideAllTyphoon () {
      this.typhoonManager.setForecasts([]);
      this.$refs['typhoonTable'].clearSelection();
      this.typhoonManager.removeAll();
    },
    //年份来回切换时，恢复表格的勾选状态
    restoreSelected () {
      let typhoons = this.typhoonManager.getAll();
      let table = this.$refs['typhoonTable'];
      if (table && typhoons.length) {
        let ids = typhoons.map(item=>item.id);
        this.typhoonList.some(row=>{
          let i = ids.indexOf(row.tfbh);
          if (i > -1) {
            table.toggleRowSelection(row, true);
            ids.splice(i, 1);
          }
          return !ids.length;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .w-100 {
    width: 80px;
  }

  .f-w-600 {
    font-weight: 600;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;

    :nth-child(n + 3).item {
      flex-grow: 3;
      overflow: hidden;
    }

    .title {
      margin: 8px 0;
      font-size: 14px;
      color: #09f;

      &::before {
        display: inline-block;
        width: 4px;
        height: 16px;
        content: "";
        margin-right: 5px;
        vertical-align: -3px;
        background: linear-gradient(180deg, #09f 0%, #09f 0%, #1acaef 100%, #1acaef 100%);
        border-radius: 10px;
      }

      button {
        padding: 3px;
      }
    }

    .selcet-label {
      font-size: 14px;
      color: #09f;
    }

    /deep/ .el-tabs__header {

      .el-tabs__nav-scroll {
        background: #f7f7f7;
        padding: 0 12px;

        .el-tabs__item {
          font-weight: 600;
          height: 34px;
          line-height: 34px;
        }
      }
    }

    /deep/ .el-table {
      .select-header {
        &.cell {
          label {
            display: none;
          }

          &:before {
            content: "选择";
          }
        }
      }

      .current-row {
        font-weight: bold;
      }

      .el-table__body {
        tr:hover > td {
          font-weight: bold;
        }
      }
    }
  }
</style>
