import { listConfig } from "@/api/system/config";
import { getDicts } from "@/api/system/dict/data";
const config = {
  state: {
    typhoonUrl:'',
    cloudChartUrl:"",
    isInternal:"",
    monitorDataTypeList:[],
  },
  mutations: {
    SET_BASEURL: (state, config) => {
      for(let key in config){
        if(config[key]!==undefined && state[key]!==undefined){
          state[key] = config[key];
        }
      }
    },
    SET_MONITOR_DATA_TYPE_LIST: (state, listItems) => {
      state.monitorDataTypeList = listItems;
    },
  },
  actions: {
    //获取基本参数设置信息
    GetBaseConfig({ commit, dispatch }) {
      return new Promise(resolve => {
        let param = {
          pageSize: 200,
          pageNo: 1
        };
        listConfig(param).then(res => {
          if (res.code === 200) {
            let data = res.rows;
            let config = {};
            data.forEach(item => {
              switch (item.configKey) {
                case "typhoonUrl":
                  config.typhoonUrl = item.configValue;
                  break;
                  case "cloudChartUrl":
                  config.cloudChartUrl = item.configValue;
                  break;
                  case "isInternal":
                  config.isInternal = Number(item.configValue);
                default:
              }
            });
            commit("SET_BASEURL", config);
          }
          resolve(res);
        });
      });
    },
    getMonitorDataTypeList({commit}){
      getDicts("monitor_data_type").then(response => {
        const listItems  = response.data || [];
        commit("SET_MONITOR_DATA_TYPE_LIST", listItems);
      }).catch(err => {
        //console.log(err);
        console.log("获取监控项目类型失败");
      });
    }

  }
};

export default config;
