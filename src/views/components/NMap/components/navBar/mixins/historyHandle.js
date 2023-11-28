import { debounce } from '../../../utils'
export default {
	data() {
		return {
			home: null,
			curIndex: 0,
			historyList: [],
			historyBack: [],
			histotyState: false,
		}
	},
	created() {
		this.viewChangeHandle = debounce(this.viewChange, 200)
	},
	beforeDestroy() {
		this.map.off('moveend', this.viewChangeHandle, this)
	},
	watch: {
		map: function(val) {
			if (val) {
				let home = {
					zoom: val.getZoom(),
					center: val.getCenter(),
				}
				this.home = home
				this.historyList.push({ ...home })
				val.on('moveend', this.viewChangeHandle, this)
			}
		},
		curIndex: function(val) {
			let view = this.historyList[0]
			view && this.map.setView(view.center, view.zoom)
		},
	},
	methods: {
		setHomeView() {
			const { center, zoom } = this.home
			this.map.setView(center, zoom)
		},
		setBackView() {
			this.histotyState = true
			if (this.historyList.length > 1) {
				this.historyBack.unshift(this.historyList.shift())
				this.curIndex--
			}
		},
		setFrontView() {
			this.histotyState = true
			this.historyList.unshift(this.historyBack.shift())
			this.curIndex++
		},
		viewChange(e) {
			if (this.histotyState) {
				//前进、返回操作时，不增加视图历史
				this.histotyState = false
				return
			}
			const { map, historyList, compareView } = this
			if (!map) return
			let view = { center: map.getCenter(), zoom: map.getZoom() }
			if (!compareView(historyList[0], view)) {
				this.curIndex = this.historyList.unshift(view) - 1
				this.historyBack = [] //新视图内容加入后，舍弃已回退的视图
			}
		},
		compareView(prev, next) {
			let res = false
			if (prev.zoom === next.zoom) {
				res = prev.center.lat === next.center.lat && prev.center.lng === next.center.lng
			}
			return res
		},
	},
}
