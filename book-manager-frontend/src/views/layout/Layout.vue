<template>
  <v-app id="inspire">
    <transition name="slide-fade" mode="out-in">
      <component :is="rightNavigatorDrawer" v-model="rightDrawer"></component>
    </transition>
    <component :is="currentNavigatorDrawer" v-model="drawer"></component>

    <v-app-bar app clipped-left clipped-right outlined flat dense>
      <v-app-bar-nav-icon
        v-if="currentNavigatorDrawer"
        @click.stop="drawer = !drawer"
      />

      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <span class="title">Borok Library</span>
      </v-toolbar-title>

      <v-tabs background-color="transparent">
          <v-tab
            v-for="item in items"
            :key="item.title"
            link
            :to="item.redirect"
            >{{ item.title }}</v-tab
          >
        </v-tabs>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon @click="switchTheme">mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <transition name="slide-fade" mode="out-in">
        <router-view :key="key" />
      </transition>
    </v-main>

    <v-footer app outlined>
      <v-row no-gutters>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} — <strong>Borok Library</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import DefaultNavigator from "./DefaultNavigator.vue";

export default Vue.extend({
  components: {
    DefaultNavigator,
  },
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    rightDrawer: true,
    items: [
      {
        icon: "mdi-view-dashboard",
        title: "查看馆藏",
        redirect: "/book",
      },
      {
        icon: "mdi-view-dashboard",
        title: "我借的",
        redirect: "/",
      },
      {
        icon: "mdi-view-dashboard",
        title: "个人设置",
        redirect: "/",
      },
      {
        icon: "mdi-view-dashboard",
        title: "读者管理",
        redirect: "/",
      },
      {
        icon: "mdi-view-dashboard",
        title: "库存管理",
        redirect: "/inventory",
      },
    ],
  }),
  computed: {
    ...mapGetters("user", ["name", "alias"]),
    key() {
      return this.$route.path;
    },
    currentNavigatorDrawer() {
      return this.$route.meta.drawer;
    },
    rightNavigatorDrawer() {
      return this.$route.meta.rightDrawer;
    },
  },
  methods: {
    switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.1s ease;
}

.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
