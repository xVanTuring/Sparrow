<template>
  <div class="top-area">
    <div class="slider-wrapper">
      <vueSlider id="slider" v-model="zoomLevel" v-bind="options">--></vueSlider>
    </div>
    <div class="func-wrapper">
      <div class="sort-wrapper" :class="{'hidden':!changingSortType}">
        <div
          class="order-item"
          :class="{'activated':Math.abs(imageSortType)===1,'inverse':imageSortType===-1}"
          @click="sortType(1)"
        >
          <span>N</span>
        </div>
        <div class="sep"></div>
        <div
          class="order-item"
          :class="{'activated':Math.abs(imageSortType)===2,'inverse':imageSortType===-2}"
          @click="sortType(2)"
        >
          <span>M</span>
        </div>
        <div class="sep"></div>
        <div
          class="order-item"
          :class="{'activated':Math.abs(imageSortType)===3,'inverse':imageSortType===-3}"
          @click="sortType(3)"
        >
          <span>S</span>
        </div>
        <div class="sep"></div>
      </div>
      <div class="order-wrapper" :class="{'activated':changingSortType}" @click="orderClick"></div>
      <div class="sep"></div>
      <div class="filter-wrapper"></div>
      <div class="sep"></div>
      <div class="input-wrapper">
        <input :class="{keep:filterWord!==''}" v-model="filterWord">
        <div class="search-in-input"></div>
      </div>
    </div>
  </div>
</template>

<script>
import vueSlider from "vue-slider-component";
import store from "@/store";
export default {
  components: {
    vueSlider
  },
  data() {
    return {
      options: {
        tooltip: "hover",
        min: 0,
        max: 6,
        interval: 0.2,
        "tooltip-dir": "bottom",
        lazy: true
      }
    };
  },
  methods: {
    sortType(type) {
      if (this.imageSortType === type) {
        this.imageSortType = -type;
      } else {
        this.imageSortType = type;
      }
    },
    orderClick() {
      this.changingSortType = !this.changingSortType;
      // store.commit('SET_CHANGING_SORT_TYPE', !this.changingSortType)
    }
  },
  computed: {
    zoomLevel: {
      get() {
        return store.state.App.zoomLevel;
      },
      set(value) {
        store.dispatch("setZoomLevel", value);
      }
    },
    changingSortType: {
      get() {
        return store.state.Center.changingSortType;
      },
      set(value) {
        store.commit("SET_CHANGING_SORT_TYPE", value);
      }
    },
    imageSortType: {
      get() {
        return store.state.App.imageSortType;
      },
      set(value) {
        store.commit("SET_IMAGE_SORT_TYPE", value);
      }
    },
    filterWord: {
      get() {
        return store.state.App.filterWord;
      },
      set(value) {
        store.commit("SET_FILTER_WORD", value);
      }
    }
  }
};
</script>

<style lang="scss">
.top-area {
  display: flex;
  position: relative;
  height: 40px;
  overflow: visible;
  width: 100%;
  border-bottom: 1px solid #282828;
  box-sizing: border-box;
  -webkit-app-region: drag;
  .slider-wrapper {
    -webkit-app-region: no-drag;
    width: 120px;
    margin: auto;
    color: white;
  }
  .sort-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    transition-duration: 0.4s;
    overflow: hidden;
    width: 94px;
    &.hidden {
      width: 0;
    }
  }
  .func-wrapper {
    -webkit-app-region: no-drag;
    position: absolute;
    right: 8px;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .input-wrapper {
      height: 24px;
      overflow: hidden;
      -webkit-app-region: no-drag;
      position: relative;
      input {
        -webkit-app-region: no-drag;
        display: block;
        outline: none;
        border: 0px;
        border-radius: 2px;
        width: 24px;
        height: 20px;
        background-color: transparent;
        color: white;
        overflow: hidden;
        &:hover,
        &:focus,
        &.keep {
          background-color: rgb(39, 39, 39);
          width: calc(160px - 22px);
          padding-left: 8px;
          padding-right: 22px;
        }
        border: 1px solid transparent;
        transition: all 0.3s ease, border 0.5s;
        &:focus {
          border: 1px solid rgb(49, 141, 226);
        }
        &:disabled {
          cursor: not-allowed;
        }
      }
      .search-in-input {
        width: 24px;
        background-size: 18px;
        transition: all 0.3s;
        top: 0;
        bottom: 0;
        right: 0;
      }
    }
    .order-item {
      padding: 4px;
      border-radius: 2px;
      width: 18px;
      height: 18px;
      color: white;
      line-height: 18px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        background-color: #404040;
      }
      &.activated {
        background-color: rgba(82, 82, 82, 0.685);
      }
      &.inverse {
        transform: rotate(180deg);
      }
    }

    .order-wrapper,
    .filter-wrapper {
      padding: 3px;
      border-radius: 2px;
      width: 18px;
      height: 18px;
      background: url(/static/svg/filter.svg) center no-repeat;
      background-size: 20px;
      border: 1px solid transparent;
      transition: border 0.4s;
      &:hover {
        background-color: #404040;
      }
      &.activated {
        background-color: rgba(82, 82, 82, 0.685);
        border: 1px solid #318de2;
      }
    }
    .order-wrapper {
      background: url(/static/svg/order.svg) center no-repeat;
      background-size: 20px;
    }
  }
}
</style>
