<template>
  <v-navigation-drawer app clipped :mini-variant.sync="drawer" permanent>
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-title></v-list-item-title>

        <v-btn icon @click.stop="drawer = !drawer">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="title">{{ alias }}</v-list-item-title>
          <v-list-item-subtitle>{{ name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-list nav dense>
      <v-list-item-group v-model="currentView" color="primary">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.redirect"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="logout">Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import users from "@/store/modules/user";

export default Vue.extend({
  name: "DefaultNavigator",
  props: {
    value: Boolean as () => boolean,
  },
  data() {
    return {
      currentView: null,
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
    };
  },
  computed: {
    name() {
      return users.name;
    },
    alias() {
      return users.alias;
    },
    avatar() {
      return users.avatar;
    },

    drawer: {
      get(): boolean {
        return this.value;
      },
      set(val: boolean) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push({ path: "/login" });
    },
  },
});
</script>
