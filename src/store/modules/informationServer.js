
const state = {
  maintenanceRecordListOpenConfig:{
    isOpenList:false,
    workGroupId:''
  },
};

const mutations = {
  SET_MAINTENANCE_RECORD_LIST_OPEN_CONFIG: (state, config) => {
    state.maintenanceRecordListOpenConfig = config;
  },
};

const actions = {
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
