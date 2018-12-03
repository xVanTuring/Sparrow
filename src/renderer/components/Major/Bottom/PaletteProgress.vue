<template>
    <el-popover
        v-model="visible"
        placement="top"
        trigger="manual"
        class="type"
    >
        <div class="palette-progress-pop">
            11/63
        </div>
        <div class="hor-line">
        </div>
        <div class="operation">
            <div class="cancel" @click="cancel">
                <img src="@/assets/svgs/cancel.svg"/>
            </div>
            <div class="sep">
            </div>
            <div class="reload">
                <img src="@/assets/svgs/reload.svg"/>
            </div>
        </div>
        <div slot="reference" class="palette-progress-indicator" :class="{'activated':visible}" @click="indicatorClicked" @contextmenu="indicatorContext">
            <div class="circle-out">
                <div class="circle-indicator-activated" v-if="activated">
                    <div>
                    </div>
                    <div>
                    </div>
                </div>
                <div class="circle-indicator-paused" v-else>
                </div>
            </div>
            <div class="circle-in" :class="{'rotating':activated}">
            </div>
        </div>
    </el-popover>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      activated: true
    }
  },
  methods: {
    indicatorClicked () {
      this.activated = !this.activated
    },
    indicatorContext () {
      this.visible = true
    },
    gloMouseDown () {
      // beter detect
      this.visible = false
    },
    cancel () {
      console.log('Cancel')
    }
  },
  mounted () {
    document.addEventListener('mousedown', this.gloMouseDown)
    setTimeout(() => {
      this.visible = true
    }, 0)
  },
  beforeDestroy () {
    document.removeEventListener('mousedown', this.gloMouseDown)
  }
}
</script>

<style lang="scss">
$size:20px;
@keyframes rotate {
    0%{
        rotate: 0deg;
    }
    100%{
        rotate: 360deg;
    }
}
.palette-progress-indicator{
    height: 26px;
    width: 26px;
    outline: none;
    border-radius: 2px;
    &.activated,
    &:hover{
        background-color: #404040;
    }
    .circle-out{
        position: absolute;
        width: $size;
        height: $size;
        border: 2px solid rgb(87, 87, 87);
        border-radius: 50%;
        box-sizing: border-box;
        top: 3px;
        left: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .circle-in{
        position: absolute;
        top: 3px;
        left: 3px;
        width: $size;
        height: $size;
        border: 2px solid rgb(223, 223, 223);
        border-radius: 50%;
        box-sizing: border-box;
        border-left-color: transparent;
        border-top-color: transparent;
        border-right-color: transparent;
        &.rotating{
            animation: rotate 1s infinite linear;
        }
    }
    .circle-indicator-paused{
        position: absolute;
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-left: 8px solid rgb(255, 255, 255);
        border-bottom:  5px solid transparent;
        margin-left: 1px;
    }
    .circle-indicator-activated{
        display: flex;
        position: absolute;
        div{
            width: 3px;
            height: 8px;
            background-color: white;
            margin: 1px;
            // border-radius: 1.5px;
        }
    }
}

.el-popover {
  background-color: rgb(49, 141, 226) !important;
  border: 0 !important;
  border: 0px;
  box-shadow: 0 4 8px rgba(0, 0, 0, 0.4) !important;
  min-width: 100px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 2px !important;
  padding-bottom: 8px !important;
  border-radius: 8px !important;
}
.el-popper[x-placement^="top"] .popper__arrow{
    border-top-color:rgb(49, 141, 226) !important;
    &::after{
        border-top-color:rgb(49, 141, 226) !important;
    }
}
.palette-progress-pop{
    color: white;
    text-align: center;
    width: 100%;
    font-size: 130%;
    height: 30px;
    line-height: 30px;
}
.hor-line{
    height: 1px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.6);
}
.operation{
    margin-top: 8px;
    display: flex;
    height: 18px;
    justify-content: center;
    align-items: center;
    .reload,.cancel{
        width: 18px;
        height: 18px;
        padding: 3px;
        border-radius: 2px;
        &:hover{
            background-color: #ffffff1f;
        }
        img{
            width: 100%;
        }
    }
    .sep{
        background-color: rgba(255, 255, 255, 0.6);
        margin: 4px;
        height: 16px;
    }
}
</style>
