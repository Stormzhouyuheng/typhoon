import Vue from 'vue';

/*
*  使用方法
*  将以下代码复制到一个js文件中，然后在入口文件main.js中import引入即可；
*  给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了。
*  给dialog设置 :close-on-click-modal="false" , 禁止点击遮罩层关闭弹出层
*  如果是form表单，不要将提交等按钮放置el-form-item，以免在上下拉伸时被隐藏
*  是否全屏设置isFullScreen，默认为false
*  弹层初始宽高initWidth，initHeight
*  modify by typ at 2019-05-20
*/

// v-dialogDrag: 弹窗拖拽+水平方向伸缩
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    //弹框可拉伸最小宽高
    let minWidth = 400;
    let minHeight = 300;
    //初始非全屏
    let isFullScreen = vnode.data.attrs.isFullScreen? vnode.data.attrs.isFullScreen:false;
    //当前宽高
    let nowWidth = vnode.data.attrs.initWidth?vnode.data.attrs.initWidth:0;
    let nowHeight = vnode.data.attrs.initHeight?vnode.data.attrs.initHeight:0;
    let bodyHeight = document.body.clientHeight;
    //当前顶部高度
    let nowMarginTop = nowHeight>0? (parseInt(bodyHeight)-parseInt(nowHeight))/2 + 'px':0;
    //获取弹框头部（这部分可双击全屏）
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    //弹窗
    const dragDom = el.querySelector('.el-dialog');
    if(isFullScreen){
      dragDom.style.left = 0;
      dragDom.style.top = 0;
      dragDom.style.height = "100VH";
      dragDom.style.width = "100VW";
      dragDom.style.marginTop = 0;
    }
    //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
    dragDom.style.overflow = "auto";
    //清除选择头部文字效果
    //dialogHeaderEl.onselectstart = new Function("return false");
    //头部加上可拖动cursor
    dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    let moveDown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;
      // 获取到的值带px 正则匹配替换
      let styL, styT;
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      };

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let l = e.clientX - disX;
        let t = e.clientY - disY;
        const topHeight = parseInt(document.documentElement.clientHeight - dragDom.offsetHeight)/2;
        const leftWidth = parseInt(document.documentElement.clientWidth - dragDom.offsetWidth)/2;
        let nowLeft = l + styL;
        let nowTop = t + styT;
        if ( nowLeft < (-leftWidth) ) {  //如果左侧的距离小于0，就让距离等于0.不能超出屏幕左侧。如果需要磁性吸附，把0改为100或者想要的数字即可
          nowLeft = -leftWidth;
        } else if ( nowLeft > leftWidth ) {  //如果左侧的距离>屏幕的宽度-元素的宽度。也就是说元素的右侧超出屏幕的右侧，就让元素的右侧在屏幕的右侧上
          nowLeft = leftWidth;
        }

        if ( nowTop < (-topHeight) ) {  //和左右距离同理
          nowTop = -topHeight;
        } else if ( nowTop > topHeight ) {
          nowTop = topHeight;
        }
        // 移动当前元素
        dragDom.style.left = nowLeft + 'px';
        dragDom.style.top = nowTop + 'px';
        //将此时的位置传出去
        //binding.value({x:e.pageX,y:e.pageY})
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };

    };
    dialogHeaderEl.onmousedown = moveDown;
    //双击头部全屏效果
    dialogHeaderEl.ondblclick = (e) => {
      if (!isFullScreen) {
        nowHeight = dragDom.clientHeight;
        nowWidth = dragDom.clientWidth;
        nowMarginTop = dragDom.style.marginTop;
        dragDom.style.left = 0;
        dragDom.style.top = 0;
        dragDom.style.height = "100VH";
        dragDom.style.width = "100VW";
        dragDom.style.marginTop = 0;
        isFullScreen = true;
        dialogHeaderEl.style.cursor = 'initial';
        dialogHeaderEl.onmousedown = null;
      } else {
        dragDom.style.height = nowHeight + 'px';
        dragDom.style.width = nowWidth + 'px';
        dragDom.style.marginTop = nowMarginTop;
        isFullScreen = false;
        dialogHeaderEl.style.cursor = 'move';
        dialogHeaderEl.onmousedown = moveDown;
      }
    };
    dragDom.onmousemove = function (e) {
      let moveE = e;
      if (e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 || dragDom.offsetLeft + 10 > e.clientX) {
        dragDom.style.cursor = 'w-resize';
      } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) {
        dragDom.style.cursor = 's-resize';
      } else {
        dragDom.style.cursor = 'default';
        dragDom.onmousedown = null;
      }
      dragDom.onmousedown = (e) => {
        const clientX = e.clientX;
        const clientY = e.clientY;
        let elW = dragDom.clientWidth;
        let elH = dragDom.clientHeight;
        let EloffsetLeft = dragDom.offsetLeft;
        let EloffsetTop = dragDom.offsetTop;
        dragDom.style.userSelect = 'none';
        let ELscrollTop = el.scrollTop;
        //判断点击的位置是不是为头部
        if (clientX > EloffsetLeft && clientX < EloffsetLeft + elW && clientY > EloffsetTop && clientY < EloffsetTop + 100) {
          //如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
        }else{
          document.onmousemove = function (e) {
            e.preventDefault(); // 移动时禁用默认事件
            //左侧鼠标拖拽位置
            if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
              //往左拖拽
              if (clientX > e.clientX) {
                dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px';
              }
              //往右拖拽
              if (clientX < e.clientX) {
                if(dragDom.clientWidth < minWidth){
                }else{
                  dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px';
                }
              }
            }
            //右侧鼠标拖拽位置
            if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
              //往左拖拽
              if (clientX > e.clientX) {
                if (dragDom.clientWidth < minWidth) {
                } else {
                  dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px';
                }
              }
              //往右拖拽
              if (clientX < e.clientX) {
                dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px';
              }
            }
            //底部鼠标拖拽位置
            if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {
              //往上拖拽
              if (clientY > e.clientY) {
                if (dragDom.clientHeight < minHeight) {
                } else {
                  dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px';
                }
              }
              //往下拖拽
              if (clientY < e.clientY) {
                dragDom.style.height = elH + (e.clientY - clientY) * 2 + 'px';
              }
            }
          };
          //拉伸结束
          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        }
      }
    }
  }
});
