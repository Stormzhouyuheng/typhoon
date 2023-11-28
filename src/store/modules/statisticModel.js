
const state = {
  activeTab:"",//建立统计模型-添加模型 当前页面
  statisticData:null,//建模数据列表
  statisticsResultId:"",//统计模型结果ID
};

const mutations = {
  SET_ACTIVE_TAG:(state,item)=>{
    state.activeTab = item;
  },
  SET_STATISTIC_MODEL_DATA:(state,item)=>{
    state.statisticData = item;
  },
  SET_STATISTIC_RESULT_ID:(state,id)=>{
    state.statisticsResultId = id;
  },
};

const actions = {
  setActiveTag({commit},item){
    commit("SET_ACTIVE_TAG", item);
  },
  setStatisticModelData({commit},item){
    commit("SET_STATISTIC_MODEL_DATA", item);
  },
  setStatisticsResultId({commit},id){
    commit("SET_STATISTIC_RESULT_ID", id);
  },


};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
