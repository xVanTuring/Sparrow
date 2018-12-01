<template>
  <div class="tag-panel">
    <input ref="searchInput" class="search-input" placeholder="Search or Create" v-model="searchContent" @keypress.enter="searchEnter"/>
    <div class="tag-group" v-if="searchContent.length === 0">
      <TagGroup v-for="key in tagKeys" :key="key" :tagId="key" :tags="mappedTags[key]" :activatedTags="activatedTags" @tagClick="tagClick"/>
    </div>
    <div class="alphabet-list" v-if="searchContent.length === 0">
      <div class="alphabet-list-item" v-for="tagKey in tagKeys" :key="tagKey" @click="tagKeyClick(tagKey)">{{tagKey}}</div>
    </div>
    <div v-if="searchContent.length > 0" class="filtered-tag">
      <Tag v-for="tag in filteredTags" :key="tag" :name="tag" :type="activatedTags.indexOf(tag)===-1?'1':'2'" @tagClick="tagClick"></Tag>
    </div>
  </div>
</template>

<script>
// TODO: chinese char
import TagGroup from './TagGroup'
import Tag from './Tag'
import store from '@/store'
import pinyin from 'tiny-pinyin'

// import _ from 'lodash'
export default {
  components: {
    TagGroup,
    Tag
  },
  props: {
    activatedTags: Array
  },
  data () {
    return {
      searchContent: ''
    }
  },
  computed: {
    mappedTags () {
      const map = {}
      let Regx = /^[A-Za-z]$/
      this.tags.forEach(tag => {
        if (tag && tag !== '') {
          let firstChar = pinyin.convertToPinyin(tag)[0]
          if (!Regx.test(firstChar)) {
            firstChar = '#'
          } else {
            firstChar = firstChar.toUpperCase()
          }
          if (map[firstChar]) {
            map[firstChar].push(tag)
          } else {
            map[firstChar] = [tag]
          }
        }
      })
      return map
    },
    tagKeys () {
      let keys = Object.keys(this.mappedTags)
      keys.sort()
      return keys
    },
    filteredTags () {
      if (this.searchContent.length > 0) {
        const subItem = this.searchContent.split(' ')
        const result = this.tags.filter((tag) => {
          // better search
          if (tag.indexOf(this.searchContent) !== -1) {
            return true
          }
          return subItem.every(item => {
            return tag.indexOf(item) !== -1
          })
        })
        if (this.tags.indexOf(this.searchContent) === -1) {
          result.unshift('$$Create$$' + this.searchContent)
        }
        return result
      }
      return []
    },
    tags () {
      return store.state.App.tags
    }

  },
  methods: {
    blur () {
      this.$refs.searchInput.focus()
    },
    tagKeyClick (key) {
      const id = '#tag-group-id-' + key.toUpperCase()
      $('.tag-group').animate({
        scrollTop: $(id).offset().top
      })
    },
    tagClick (name) {
      this.$emit('tagClick', name)
    },
    searchEnter () {
      this.tagClick(this.searchContent)
      this.searchContent = ''
    }

  }
  // watch: {
  //   searchContent (newV, oldV) {
  //     console.log(newV)
  //   }
  // }
}
</script>

<style lang="scss">

.tag-panel {
  position: relative;
  .alphabet-list {
    position: absolute;
    width: 10px;
    height: 300px;
    right: 16px;
    top: 48px;
    color: #c0c0c0;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 80%;
    cursor: pointer;
    text-align: center;
    .alphabet-list-item {
      &:hover {
        color: #ffffff;
      }
    }
  }
  .search-input {
    display: block;
    outline: none;
    border: 0px;
    width: calc(100% - 28px);
    border-radius: 4px;
    font-size: 12px;
    height: 28px;
    padding-left: 8px;
    padding-right: 8px;
    background-color: rgb(39, 39, 39);
    color: white;
    margin: auto;
    margin-top: 12px;
    border: 1px solid transparent;
    transition: all 0.5s;
    &:focus {
      border: 1px solid rgb(49, 141, 226);
    }
  }
  .tag-group,.filtered-tag {
    width: calc(100% - 10px);
    margin:auto;
    margin-top: 16px;
    // padding-right: 8px;
    height: 340px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #535353;
    }
  }
}
</style>
