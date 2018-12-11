<template>
  <div class="center-viewer">
    <viewer :images="images" :options="options">
      <template slot-scope="scope">
        <img class="template-image" v-for="src in scope.images" :src="src" :key="src">
      </template>
    </viewer>
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer/src/component.vue";
export default {
  components: {
    Viewer
  },
  data() {
    return {
      images: [
        "C:\\Users\\xVanT\\Pictures\\Camera Roll\\tom-sodoge-1169777-unsplash.jpg"
      ],
      options: {
        inline: true,
        navbar: false,
        title: false,
        fullscreen: false,
        toolbar: false
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss">
.center-viewer {
  overflow: hidden;
  width: 100%;
  height: calc(100% - 42px);
}
.template-image {
  display: none;
}
.viewer-button.viewer-fullscreen {
  display: none;
}
</style>
