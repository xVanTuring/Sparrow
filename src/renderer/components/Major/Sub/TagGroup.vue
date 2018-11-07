<template>
  <div :id="'tag-group-id-'+tagId">
    <div class="tag-group-title">
      {{tagId.toUpperCase()}}
    </div>
    <div class="tag-group-container">
      <Tag :type="activatedTags.indexOf(tag)===-1?'1':'2'" v-for="tag in tags" :key="tag" :name="tag" @tagClick="tagClick"/>
    </div>
  </div>
</template>

<script>
import Tag from './Tag'
export default {
  components: {
    Tag
  },
  props: {
    tagId: {
      type: String,
      default: '#'
    },
    tags: {
      type: Array,
      default: () => []
    },
    activatedTags: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    tagClick (name) {
      this.$emit('tagClick', name)
    }
  }

}
</script>

<style lang="scss">
.tag-group-container{
  margin-top: 4px;
}
</style>
