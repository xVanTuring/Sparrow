<template>
  <div class="center-root">
    <CenterTop></CenterTop>
    <v-contextmenu ref="contextmenu" class="center-context-menu menu-container">
      <v-contextmenu-submenu title="Order" class="center-context-menu-sub">
        <v-contextmenu-item @click="setSortType(1)">
          <MenuChooseItem title="Name" :activated="Math.abs(imageSortType)===1"/>
        </v-contextmenu-item>
        <v-contextmenu-item @click="setSortType(3)">
          <MenuChooseItem title="File Size" :activated="Math.abs(imageSortType)===3"/>
        </v-contextmenu-item>
        <v-contextmenu-item @click="setSortType(2)">
          <MenuChooseItem title="Modification Time" :activated="Math.abs(imageSortType)===2"/>
        </v-contextmenu-item>
        <v-contextmenu-item divider></v-contextmenu-item>
        <v-contextmenu-item @click="reverseSortType(true)">
          <MenuChooseItem title="Up" :activated="imageSortType>0"/>
        </v-contextmenu-item>
        <v-contextmenu-item @click="reverseSortType(false)">
          <MenuChooseItem title="Down" :activated="imageSortType<0"/>
        </v-contextmenu-item>
      </v-contextmenu-submenu>
      <v-contextmenu-item>Display</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item>
        <MenuChooseItem title="Masonary Layout" :activated="layoutType===0"/>
      </v-contextmenu-item>
      <v-contextmenu-item>
        <MenuChooseItem title="Justified Layout" :activated="layoutType!==0"/>
      </v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item>Hide Left Panel</v-contextmenu-item>
      <v-contextmenu-item>Hide Right Panel</v-contextmenu-item>
    </v-contextmenu>
    <v-contextmenu ref="contextmenu2" class="center-context-menu menu-image">
      <v-contextmenu-item>Open in New Window</v-contextmenu-item>
      <v-contextmenu-item>Open with Default App</v-contextmenu-item>
      <v-contextmenu-item>Reveal in Explorer</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item>Rename</v-contextmenu-item>
      <v-contextmenu-item>Copy Image (File)</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item>Re-Generate Thumb</v-contextmenu-item>
      <v-contextmenu-item>Thumb Background</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item>Add to ...</v-contextmenu-item>
      <v-contextmenu-item>Remote From Current Folder</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item>Move to Trash</v-contextmenu-item>
    </v-contextmenu>
    <CenterGallery></CenterGallery>
  </div>
</template>
<script>
import MenuChooseItem from "./MenuChooseItem";
import CenterTop from "./CenterTop";
import CenterGallery from "./CenterGallery";
import store from "@/store";
import { remote } from "electron";
export default {
  components: {
    MenuChooseItem,
    CenterTop,
    CenterGallery
  },
  data() {
    return {};
  },
  methods: {
    setSortType(value) {
      if (Math.abs(this.imageSortType) === value) {
        this.reverseSortType();
      } else {
        this.imageSortType = value;
      }
    },
    reverseSortType(up) {
      if (up == null) {
        this.imageSortType = !this.imageSortType;
      } else if (up) {
        this.imageSortType = Math.abs(this.imageSortType);
      } else {
        this.imageSortType = -Math.abs(this.imageSortType);
      }
    },
    mousedown(e) {
      this.$refs.contextmenu.hide();
      this.$refs.contextmenu2.hide();
      if (e.button === 2 && $(e.target).is(".thumbnial-img")) {
        let id = $(e.target)
          .parent()
          .parent()
          .attr("id")
          .replace("item-", "");
        if (this.selected.length === 0 || this.selected.indexOf(id) === -1) {
          this.selected = [id];
        }
        if (
          remote.getCurrentWindow().getBounds().height <
          e.clientY + ($(".menu-image").height() || 360)
        ) {
          this.$refs.contextmenu2.show({
            top: e.clientY - $(".menu-image").height() || 360,
            left: e.clientX
          });
        } else {
          this.$refs.contextmenu2.show({
            top: e.clientY,
            left: e.clientX
          });
        }
        return;
      }
      if (e.button === 2 && $(e.target).is(".container")) {
        this.selected = [];
        this.selectedSubFolder = "";
        if (
          remote.getCurrentWindow().getBounds().height <
          e.clientY + ($(".menu-container").height() || 218)
        ) {
          this.$refs.contextmenu.show({
            top: e.clientY - $(".menu-container").height() || 218,
            left: e.clientX
          });
        } else {
          this.$refs.contextmenu.show({
            top: e.clientY,
            left: e.clientX
          });
        }
      }
    }
  },
  computed: {
    imageSortType: {
      get() {
        return store.state.App.imageSortType;
      },
      set(value) {
        store.commit("SET_IMAGE_SORT_TYPE", value);
      }
    },
    layoutType: {
      get() {
        return store.state.App.layoutType;
      },
      set(value) {
        store.commit("SET_LAYOUT_TYPE", value);
      }
    },
    selected: {
      get() {
        return store.state.App.selectedImageIds;
      },
      set(value) {
        store.commit("SET_SELECTED_IMAGE_IDS", value);
      }
    },
    selectedSubFolder: {
      get() {
        return store.state.App.selectedSubFolder;
      },
      set(value) {
        store.commit("SET_SELECTED_SUB_FOLDER", value);
      }
    }
  },
  mounted() {
    $(document).on("mousedown", this.mousedown);
  }
};
</script>
<style lang="scss">
.center-root {
  position: absolute;
  left: 230px;
  right: 230px;
  top: 0;
  bottom: 40px;
  overflow: hidden;
}

.vue-slider-component {
  .vue-slider {
    height: 4px !important;
    border-radius: 2px !important;
  }
  .vue-slider-process {
    border-radius: 2px !important;
  }
  -webkit-app-region: no-drag;
}

.center-context-menu,
.center-context-menu .v-contextmenu {
  background-color: #333333 !important;
  border: 0px !important;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.8) !important;
  min-width: 180px;
  padding: 8px 0px !important;
  .center-context-menu-sub .v-contextmenu {
    min-width: 140px;
  }
  .v-contextmenu-item {
    color: white !important;
    padding: 8px 14px 8px 20px !important;
  }
  .v-contextmenu-item--hover {
    background-color: #404040 !important;
  }
  .v-contextmenu-divider {
    border-bottom: 1px solid #686868 !important;
  }
}
</style>

