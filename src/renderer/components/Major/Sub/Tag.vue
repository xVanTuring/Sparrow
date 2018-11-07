<template>
  <div class="tag-item" :class="{activated:type==='0'||type==='2'}" @click="tagClick($event)">
    <IconAdd v-if="type==='1'" class="add" width="16" height="16"></IconAdd>
    <IconCheck v-if="type==='2'" class="check" width="12" height="12"></IconCheck>
    <div class="name" :class="{closeable:type==='0','large-tag':type!=='0'}">
      {{realName}}
    </div>
    <IconClose v-if="type==='0'" class="close" width="12" height="12" @click.native="close($event)" />
  </div>
</template>

<script>
// MaxLength
import IconClose from './IconClose'
import IconAdd from './IconAdd'
import IconCheck from './IconCheck'
const TAG_PREFIX = '$$Create$$'
export default {
  components: {
    IconClose,
    IconAdd,
    IconCheck
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: '0'
    },
    tagId: {
      type: String,
      default: ''
    }
  },
  computed: {
    realName () {
      if (this.name.indexOf(TAG_PREFIX) === -1) {
        return this.name
      }
      return 'Create tag: ' + this.name.slice(TAG_PREFIX.length)
    }
  },
  methods: {
    close (event) {
      event.stopPropagation()
      // console.log('close')
      if (this.tagId !== '') {
        this.$emit('tagClose', [this.name, this.tagId])
      } else {
        this.$emit('tagClose', this.name)
      }

      // this.$bus.$emit('tagClose', this.name)
    },
    tagClick (event) {
      event.stopPropagation()
      this.$emit('tagClick', this.name)
      // this.$bus.$emit('tagClick', this.name)
    }
  }
}
</script>

<style lang="scss">
@import '@/globals.scss';
.tag-item {
  display: inline-block;
  min-width: 40px;
  height: 20px;
  padding: 2px 0;
  background-color: rgb(95, 95, 95);
  //  $primary;
  color: white;
  border-radius: 2px;
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 4px;
  &.activated {
    background-color: $primary;
  }
  .name {
    float: left;
    line-height: 20px;
    margin-right: 8px;
    max-width: 130px;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    white-space: nowrap;
    &.closeable {
      margin-left: 8px;
    }
    &.large-tag {
      max-width: 200px;
    }
  }
  .add {
    float: left;
    margin-top: 1px;
    margin-left: 4px;
    margin-right: 4px;
  }
  .check {
    float: left;
    margin-top: 4px;
    margin-left: 4px;
    margin-right: 4px;
  }
  .close {
    float: left;
    margin-top: 4px;
    margin-right: 4px;
    cursor: pointer;
  }
}
</style>
