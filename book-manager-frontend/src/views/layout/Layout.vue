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
          v-for="item in navigateItems"
          :key="item.title"
          link
          :to="item.redirect"
          >{{ item.title }}</v-tab
        >
      </v-tabs>

      <v-spacer></v-spacer>

      <v-btn icon @click="switchTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-avatar color="indigo" size="36px" style="margin-left: 10px">
        <img v-if="avatar.length" :src="avatar" />
        <v-icon dark v-else> mdi-account-circle </v-icon>
      </v-avatar>
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
import users from "@/store/modules/user";

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
        needAdmin: false,
      },
      {
        icon: "mdi-view-dashboard",
        title: "我借的",
        redirect: "/borrow",
        needAdmin: false,
      },
      {
        icon: "mdi-view-dashboard",
        title: "图书馆管理",
        redirect: "/library",
        needAdmin: true,
      },
      {
        icon: "mdi-view-dashboard",
        title: "用户管理",
        redirect: "/reader",
        needAdmin: true,
      },
      {
        icon: "mdi-view-dashboard",
        title: "书库管理",
        redirect: "/inventory",
        needAdmin: true,
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
    avatar() {
      return users.avatar;
    },
    isAdmin() {
      return users.roles[0] === "admin";
    },
    navigateItems() {
      return this.items.filter((item) => !item.needAdmin || this.isAdmin);
    },
  },
  methods: {
    switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    async logout() {
      await users.logout();
      this.$router.push({ path: "/login" });
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
