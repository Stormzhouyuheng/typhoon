import { getDicts } from "@/api/system/dict/data";
import { getConfigData } from "@/api/map";
import { listConfig } from "@/api/system/config";

export default {
  namespaced: true,
  state: {
    sections: null,
    monitorTypes: [],
    waterStationId: null
  },
  mutations: {
    SET_SECTIONS: (state, payload) => {
      state.sections = payload;
    },
    SET_TYPES: (state, payload) => {
      state.monitorTypes = payload;
    },
    SET_STATIONID: (state, payload) => {
      state.waterStationId = payload;
    }
  },
  actions: {
    getSectionConfig({ commit }) {
      return getConfigData("sectionConfig.json").then(({ sections }) => {
        commit("SET_SECTIONS", sections);
        return sections;
      });
    },
    getMonitorTypes({ commit }) {
      return getDicts("monitor_data_type").then(({ code, data }) => {
        if (code === 200 && data) {
          commit("SET_TYPES", data);
        }
        return data || [];
      });
    },
    getRiverStationId({ commit }) {
      const params = {
        configKey: "timeRiverStationId"
      };
      return listConfig(params).then(({ code, rows }) => {
        if (code === 200 && rows.length) {
          const [{ configValue }] = rows;
          commit("SET_STATIONID", configValue);
          return configValue;
        }
      });
    }
  }
};
