<template>
  <div class="vue-infinite-grid">
  </div>
</template>

<script>
import InfiniteGrid, { GridLayout } from '@egjs/infinitegrid'
import store from '@/store'
import path from 'path'

export default {
  ig: null,
  layout: null,
  props: {
    list: {
      type: Array,
      default: () => []
    },
    itemSize: {
      type: Number,
      default: 150
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      start: 0
    }
  },
  mounted () {
    this.initgrid()
  },
  watch: {
    selected: function (newV, oldV) {
      $('.item.selected').removeClass('selected')
      newV.forEach(v => {
        $('#item-' + v).addClass('selected')
      })
    },
    list: function (newV, oldV) {
      if (this.ig) {
        this.ig.clear()
        this.ig.destroy()
        this.start = 0
      }
      this.initgrid()
    },
    itemSize: function (newV) {
      if (this.ig) {
        if (newV < 150) {
          $('.vue-infinite-grid').addClass('no-title')
        } else {
          $('.vue-infinite-grid').removeClass('no-title')
        }
        this.resize(newV)
      }
    }
  },
  methods: {
    resize (number) {
      this.layout.options.itemSize = parseInt(number)
      document.getElementById('griditem').innerHTML = `
            .item {
                width: ${parseInt(number)}px;
            }
            `
      // for update
      // https://naver.github.io/egjs-infinitegrid/assets/html/grid.html
      this.ig._renderer._size.viewport = 0
      this.ig.layout()
    },
    getItems (length) {
      var arr = []
      for (var i = 0; i < length; i++) {
        var fileMeta = this.list[this.start]
        if (fileMeta) {
          arr.push(this.getItem(fileMeta))
          this.start += 1
        }
      }
      return arr
    },
    getItem (options) {
      let imageName = (options.width > 620 && options.height > 620) ? options.name + '_thumb.png' : options.name + '.' + options.ext
      var _path = 'file://' + path.join(store.state.App.libraryPath, 'images', options.id + '.image', imageName)
      return (
        `<div class="item" id="item-${options.id}">
          <div class="thumbnail ">
            <img class="thumbnial-img tbackground" draggable="true" src="${_path}" data-src="${_path}" data-width="${options.width}" data-height="${options.height}">
          </div>
          <!-- <div class="tag-num">${parseInt(Math.random() * 10 + 1)}</div> -->
          
          <div class="title">${options.name}</div>
          <div class="des">${options.width} × ${options.height}</div>
        </div>
        `
      )
    },
    initgrid () {
      var num = 48
      const that = this
      this.ig = new InfiniteGrid(this.$el, {
        useRecycle: true,
        transitionDuration: 0.2,
        threshold: 1000,
        isOverflowScroll: false
      })
      this.layout = new GridLayout({
        align: 'center',
        margin: 16
        // minSize: 110
        // maxSize: 100
      })
      this.ig.setLayout(this.layout)
      this.ig.on({
        'prepend': function (e) {
        },
        'append': function (e) {
          if (that.start < that.list.length) {
            var count = num
            if (that.list.length - this.start < num) {
              count = that.list.length - this.start - 1
            }
            that.ig.append(that.getItems(count), e.groupKey + 1)
          }
        },
        'layoutComplete': function (e) {
          e.target.forEach(function (item) {
            if (!item.el) {
              return
            }
            let id = item.el.id.replace('item-', '')
            $(item.el).addClass('loaded')
            if (that.selected.indexOf(id) !== -1) {
              $(item.el).addClass('selected')
            }
          })
          $('.thumbnial-img').on('dragstart', that.itemDragStart)
          $('.thumbnial-img').on('dragend', function (e) {
            store.commit('SET_IMAGE_DRAGGING', false)
          })
        }

      })
      if (this.list.length > 0) {
        this.ig.append(this.getItems(num), 0)
      }
      this.resize(this.itemSize)
    },
    itemDragStart (event) {
      let $item = $('.item').has(event.target)
      let id = $item[0].id.replace('item-', '')
      if (this.selected.length > 0 && this.selected.indexOf(id) !== -1) {
        event.originalEvent.dataTransfer.setData('list', JSON.stringify(this.selected))
        store.commit('SET_IMAGE_DRAGGING', true)
      } else {
        event.originalEvent.dataTransfer.setData('list', JSON.stringify([id]))
        store.commit('SET_IMAGE_DRAGGING', true)
      }
    },
    removeItem (items) {
      items.forEach(item => {
        const id = '#item-' + item
        const view = $(id)[0]
        this.ig.remove(view)
        this.ig.layout(false)
      })
    }

  },
  created () {
    this.$bus.$on('remove-item', this.removeItem)
  },
  beforeDestroy () {
    this.$bus.$off('remove-item', this.removeItem)
  }
}
</script>

<style lang="scss">

.item {
  position: relative;
	pointer-events: none;
  text-align: center;
  color: white;
  opacity: 0;
  transition: opacity .3s;
  .title {
    margin-top: 2px;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 80%;
    height: 14px;
  }
  .des {
    margin-top: 2px;
    font-size: 60%;
    color: #535353;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 10px;
  }
  .tag-num{
    font-weight: 600;
    position: absolute;
    right: 8px;
    top: 8px;
    height: 20px;
    width: 20px;
    background-color: rgb(49, 141, 226);
    font-size: 12px;
    text-align: center;
    line-height: 24px;
    border-radius: 50%;
    overflow: hidden;
  }
}
.vue-infinite-grid.no-title  .item{
  .title{
    display: none;
  }
  .des{
    display: none;
  }
}
.item.loaded{
  opacity: 1;
}

.item .thumbnail {
	padding: 3px;
	overflow: hidden;
	box-sizing: border-box;
	border: 2px solid transparent;
	border-radius: 4px;
}
.item.selected .thumbnail {
	border: 2px solid rgb(49, 141, 226);
}
.item .thumbnail img {
	width: 100%;
	display: block;
	border-radius: 4px;
	pointer-events: all;
}
.vue-infinite-grid {
	width: calc(100% - 48px);
	margin: auto;
  margin-top: 8px;
  pointer-events: none;
}
.tbackground {
    background-position: 0 0, 10px 10px !important;
    background-size: 20px 20px !important;
    background-image: linear-gradient(45deg,#eee 25%,transparent 25%,transparent 75%,#eee 75%,#eee 100%),linear-gradient(45deg,#eee 25%,#fff 25%,#fff 75%,#eee 75%,#eee 100%)!important;
}
</style>
