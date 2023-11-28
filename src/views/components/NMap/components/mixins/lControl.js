import { mapState } from 'vuex';

export default {
  data () {
    return {
      map: null
    }
  },
  computed: {
    ...mapState('NMap', ['mapApi'])
  },
  mounted () {
    let lc = this.$refs['lc'];
    if (lc && lc.mapObject) {
      this.map = lc.mapObject._map;
    }
  }
}