export default {
  namespaced: true,
  state: {
    configReady: false,
    mapApi: null,
    configs: null,
    baseLayers: null,
    controlLayers: null,
    addedLayers: null,
    currentBaseLayer: null,
  },
  mutations: {
    SET_MAPAPI: (state, payload) => {
      state.mapApi = payload;
    },
    SET_CONFIGS: (state, payload) => {
      state.configs = payload;
      state.configReady = true;
    },
    SET_BASELAYERS: (state, baseLayers) => {
      state.baseLayers = baseLayers;
    },
    SET_CURRENTBASELAYER: (state, payload) => {
      state.currentBaseLayer = payload;
    },
    SET_CONTORLLAYERS: (state, controlLayers) => {
      state.controlLayers = controlLayers;
    },
    SET_ADDEDLAYERS: (state, addedLayers) => {
      state.addedLayers = addedLayers;
    },
    RESETSTATE: state => {
      state = {
        ...state,
        mapApi: null,
        baseLayers: null,
        controlLayers: null,
        addedLayers: null,
      };
    }
  },
  getters: {
    layerManager: ({ mapApi }) => {
      return mapApi && mapApi.layerManager ? mapApi.layerManager : null;
    },
  },
  actions: {}
};
