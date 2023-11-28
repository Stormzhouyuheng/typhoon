<template>
  <div class="content-wrapper">
    <!-- 分析条件 -->
    <el-form
      class="item"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="110px"
      size="mini"
    >
      <el-form-item label="台风选择">
        <el-col :span="5">
          <el-select
            v-model="ruleForm.year"
            class="w-100"
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
        <el-col :offset="1" :span="6">
          <el-form-item prop="tfbh">
            <el-select
              v-model="ruleForm.tfbh"
              class="w-100"
              placeholder="请选择"
            >
              <el-option
                v-for="{ tfbh, name } in typhoons"
                :key="tfbh"
                :label="`${name}(${tfbh})`"
                :value="tfbh"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="form-content-label">预报单位</div>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="ruleForm.forecast"
            class="w-100"
            placeholder="请选择"
            :clearable="true"
          >
            <el-option
              v-for="item in forecasts"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>

      <el-col :span="12">
        <el-form-item label="相似性计算参数" prop="calcParam">
          <el-input v-model="ruleForm.calcParam"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="台风生成点" prop="startPoint">
          <el-col :span="18">
            <el-input v-model="ruleForm.startPoint"></el-input>
          </el-col>
          <el-col :offset="1" :span="4">度</el-col>
        </el-form-item>
      </el-col>
      <!--<el-col :span="12">
        <el-form-item label="预报单位" prop="forecast">
          <el-select
            v-model="ruleForm.forecast"
            class="w-100"
            placeholder="请选择"
            :clearable="true"
          >
            <el-option
              v-for="item in forecasts"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>-->
      <el-form-item label="台风登陆点" class="fix-front">
        <el-col :span="12">
          <el-input v-model="ruleForm.land" placeholder=""></el-input>
        </el-col>
        <el-col :offset="3" :span="4">
          <el-button @click="draw('land')">绘制</el-button>
        </el-col>
        <el-col :offset="1" :span="4">
          <el-button @click="clear('land')">清除</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="经过的区域">
        <el-col :span="12">
          <el-input v-model="ruleForm.pass" placeholder=""></el-input>
        </el-col>
        <el-col :offset="3" :span="4">
          <el-button @click="draw('pass')">绘制</el-button>
        </el-col>
        <el-col :offset="1" :span="4">
          <el-button @click="clear('pass')">清除</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="最大强度" prop="power">
        <el-checkbox-group v-model="ruleForm.power">
          <el-checkbox
            v-for="(power, i) in powers"
            :label="power"
            :key="i"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="生成时间" class="fix-front">
        <!-- 年 -->
        <el-row>
          <el-col :span="10">
            <el-select
              v-model="ruleForm.startYear"
              class="w-100"
              placeholder="年"
              :clearable="true"
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
          <el-col :span="2">年 -</el-col>
          <el-col :span="10">
            <el-select
              v-model="ruleForm.endYear"
              class="w-100"
              placeholder="年"
              :clearable="true"
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
          <el-col :span="2">年</el-col>
        </el-row>
        <!-- 月日 -->
        <el-row>
          <el-col :span="4">
            <el-select
              v-model="ruleForm.startMonth"
              placeholder="月"
              :clearable="true"
              @change="monthChange($event, 'start')"
            >
              <el-option v-for="i in 12" :key="i" :label="i" :value="i">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">月</el-col>
          <el-col :span="4">
            <el-select
              v-model="ruleForm.startDate"
              placeholder="日"
              :clearable="true"
            >
              <el-option
                v-for="date in startDates"
                :key="date"
                :label="date"
                :value="date"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">日 -</el-col>
          <el-col :span="4">
            <el-select
              v-model="ruleForm.endMonth"
              placeholder="月"
              :clearable="true"
              @change="monthChange($event, 'end')"
            >
              <el-option v-for="i in 12" :key="i" :label="i" :value="i">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">月</el-col>
          <el-col :span="4">
            <el-select
              v-model="ruleForm.endDate"
              placeholder="日"
              :clearable="true"
            >
              <el-option
                v-for="date in endDates"
                :key="date"
                :label="date"
                :value="date"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1">日</el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="btn-wrapper">
        <el-button
          class="gradient-bg"
          type="primary"
          @click="submit('ruleForm')"
        >
          相似度分析
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 分析结果 -->
    <el-row class="item" ref="resultWrap">
      <el-table
        class="list-panel-table"
        ref="typhoonTable"
        size="mini"
        :data="analysisList"
        style="width: 100%"
        :height="tableHeight"
        :highlight-current-row="true"
        @select="typhoonSelect"
        v-loading="loading"
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
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import DrawManager from "@/views/components/NMap/managers/drawManager";
import {
  default as TyphoonManager,
  getLevel
} from "@/views/components/NMap/managers/typhoonManager";
import {
  getForecase,
  getTyphoon,
  getTyphoonList,
  typhoonAnalysis
} from "@/api/typhoon";

const spliceLatlngs = data => {
  return Array.isArray(data)
    ? data.map(spliceLatlngs).join(";")
    : data.lng + "," + data.lat;
};
const patchZero = val => {
  let value = "" + val;
  return value.length === 1 ? "0" + value : value;
};

const dateDict = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const powerDict = [
  [16, 17, 18, 19, 20, 21, 22, 23],
  [14, 15],
  [12, 13],
  [10, 11],
  [8, 9]
];
const stesDict = ["中国", "中国香港", "中国台湾", "日本", "美国", "韩国"];

export default {
  data() {
    return {
      loading: false,
      infoColumns: [
        { prop: "label", label: "台风名称", width: 120 },
        { prop: "tfbh", label: "编号", width: 60 },
        { prop: "score", label: "相似度", width: 60 },
        { prop: "powerC", label: "最大强度" },
        { prop: "power", label: "最大风力" }
      ],
      years: [],
      typhoons: [],
      forecasts: ["中国", "香港", "台湾", "日本", "美国", "韩国"],
      powers: ["超强台风", "强台风", "台风", "强热带风暴", "热带风暴"],
      startDates: [],
      endDates: [],
      ruleForm: {
        year: "",
        tfbh: "",
        land: "",
        pass: "",
        name: "",
        calcParam: "3",
        forecast: "",
        power: [],
        startPoint: "",
        startYear: "",
        endYear: "",
        startMonth: "",
        endMonth: "",
        startDate: "",
        endDate: ""
      },
      rules: {
        tfbh: [{ required: true, message: "请选择台风", tigger: "change" }],
        calcParam: [{ required: true, message: "请输入参数", tigger: "blur" }]
      },
      drawManager: null,
      typhoonManager: null,
      landFeature: null,
      passFeature: null,
      tableHeight: 180,
      analysisList: []
    };
  },
  created() {
    let year = new Date().getFullYear();
    this.years = Array(year - 1944)
      .fill()
      .map((item, i) => year - i);
    this.ruleForm.year = year;
    this.$nextTick(() => {
      this.getTyphoons();
    });
    this.drawManager = DrawManager.getInstance();
    this.typhoonManager = TyphoonManager.getInstance();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$refs["resultWrap"].$el.clientHeight;
    });
  },
  beforeDestroy() {
    this.clear();
    this.clear("land");
    this.typhoonManager.removeAll();
  },
  watch: {
    "ruleForm.tfbh": function(tfbh, oldVal) {
      if (oldVal) {
        this.typhoonManager.remove(oldVal);
      }
      if (tfbh) {
        this.typhoons.some(item => {
          if (item.tfbh === tfbh) {
            this.getTyphoonPath(tfbh, item.name);
            return true;
          }
        });
      }
    }
  },
  methods: {
    yearChange() {
      this.getTyphoons();
    },
    getTyphoons() {
      getTyphoonList({ year: this.ruleForm.year }).then(({ code, data }) => {
        this.typhoons = data;
        data.length && (this.ruleForm.tfbh = data[0]["tfbh"]);
      });
    },
    getTyphoonPath(tfbh, name) {
      getTyphoon({ tfbh }).then(({ code, data }) => {
        if (code === 1000 && data.length) {
          this.typhoonManager
            .create(data, name)
            .route.on("point-click", evt => {
              this.getForecaseData(tfbh, evt.feature.t, evt.feature);
            });
        }
      });
    },
    getForecaseData(tfbh, t, feature) {
      let pointT = moment(t).format("YYYY/MM/DD HH:mm:ss");
      getForecase({
        tfbh,
        pointT
      }).then(({ code, data }) => {
        if (code === 1000 && data.length) {
          feature && this.typhoonManager.showForecat(feature, data);
        }
      });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.analysis();
        } else {
          return false;
        }
      });
    },
    analysis() {
      this.loading = true;
      //去除上次分析结果已勾选的台风
      this.clearExpired();

      const {
        ruleForm: {
          tfbh,
          calcParam,
          land,
          pass,
          startPoint,
          forecast,
          power,
          startYear,
          endYear,
          startMonth,
          endMonth,
          startDate,
          endDate
        },
        powers,
        forecasts
      } = this;
      let params = { tfbh, radius: calcParam };
      if (land) {
        params["landingPlace"] = JSON.stringify(
          this.landFeature.polygon.toGeoJSON()["geometry"]
        );
      }
      if (pass) {
        params["crossPlace"] = JSON.stringify(
          this.passFeature.polygon.toGeoJSON()["geometry"]
        );
      }
      if (startPoint) {
        params["startPointRadius"] = startPoint;
      }
      if (forecast) {
        params["forecastFlag"] = true;
        params["sets"] = stesDict[forecasts.indexOf(forecast)];
      }
      if (power.length) {
        params["powers"] = power
          .map(item => {
            return powers.indexOf(item);
          })
          .reduce((prev, i) => {
            return prev.concat(powerDict[i]);
          }, []);
      }
      if (startYear && endYear) {
        params["beginYyyy"] = startYear;
        params["endYyyy"] = endYear;
      }
      if (startMonth && endMonth && startDate && endDate) {
        params["beginMmdd"] = patchZero(startMonth) + patchZero(startDate);
        params["endMmdd"] = patchZero(endMonth) + patchZero(endDate);
      }
      typhoonAnalysis(params)
        .then(({ code, data }) => {
          if (code === 1000) {
            this.analysisList = data.map(
              ({ similar, name, ename, power, ...other }) => {
                return {
                  ...other,
                  name,
                  label: `${name || "-"}(${ename || "-"})`,
                  score: (similar * 100).toFixed(0),
                  power,
                  powerC: powers[6 - getLevel(power)]
                };
              }
            );
          } else {
            this.analysisList = [];
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.analysisList = [];
          console.log(err);
        });
    },
    //勾选的台风
    typhoonSelect(sels, row) {
      this.lastCheckTyphoon = row;
      this.pathList = [];
      this.$refs["typhoonTable"].setCurrentRow(row);
      if (sels.some(item => item.tfbh === row.tfbh)) {
        this.getTyphoonPath(row.tfbh, row.name || "-");
      } else {
        this.typhoonManager.remove(row.tfbh);
      }
    },
    //绘制图形
    draw(type) {
      this.clear(type);
      this.drawManager
        .drawPolygon()
        .then(res => {
          let poly = this.drawManager.addPolygon(res);
          let str = spliceLatlngs(poly.polygon.getLatLngs());
          if (type === "land") {
            this.landFeature = poly;
            this.ruleForm.land = str;
          } else {
            this.passFeature = poly;
            this.ruleForm.pass = str;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //清除图形
    clear(type) {
      if (type === "land") {
        this.landFeature && this.landFeature.remove();
        this.ruleForm.land = "";
      } else {
        this.passFeature && this.passFeature.remove();
        this.ruleForm.pass = "";
      }
    },
    //月份改变
    monthChange(month, type) {
      let arr = Array(dateDict[month - 1])
        .fill()
        .map((item, i) => {
          return i + 1;
        });
      if (type === "start") {
        this.startDates = arr;
        this.ruleForm.startDate || (this.ruleForm.startDate = arr[0]);
      } else {
        this.endDates = arr;
        this.ruleForm.endDate || (this.ruleForm.endDate = arr[arr.length - 1]);
      }
    },
    //清除非当前目标台风
    clearExpired() {
      let typhoons = this.typhoonManager.getAll();
      typhoons.map(item => {
        if (item.id !== this.ruleForm.tfbh) {
          this.typhoonManager.remove(item.id);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;

  :nth-child(n + 2).item {
    flex-grow: 3;
    overflow: hidden;
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

/deep/ .el-form-item {
  margin-bottom: 5px !important;

  .el-form-item__label {
    padding-right: 5px;
    font-weight: 600;
    font-size: 13px;
    color: #888;
  }

  .el-input--mini {
    .el-input__inner {
      padding-left: 12px;
      padding-right: 26px;
    }
  }

  .el-form-item__content {
    .el-checkbox-group {
      line-height: 20px;
    }

    :nth-child(n + 2).el-row {
      margin-top: 5px;
    }
  }

  &.fix-front {
    .el-form-item__content {
      position: initial;
    }
  }

  &.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
  &.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before {
    margin-right: 0;
  }

  .form-content-label {
    text-align: right;
    margin-right: 5px;
    font-weight: 600;
    font-size: 13px;
    color: #888;
    /* color:#606266;*/
  }
  &.btn-wrapper {
    padding: 4px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    background: #f7f7f7;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>
