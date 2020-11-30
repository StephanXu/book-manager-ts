<template>
  <v-navigation-drawer app clipped :mini-variant.sync="drawer" permanent>
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
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class InventoryNavigator extends Vue {
  @Prop({ default: false }) value!: boolean;

  private currentView = null;
  private items = [
    {
      icon: "mdi-view-dashboard",
      title: "图书馆",
      redirect: "/inventory/library",
    },
    {
      icon: "mdi-view-dashboard",
      title: "馆藏管理",
      redirect: "/inventory/book",
    },
    {
      icon: "mdi-view-dashboard",
      title: "用户设置",
      redirect: "/inventory/people",
    },
  ];

  get drawer(): boolean {
    return this.value;
  }

  set drawer(val: boolean) {
    this.$emit("input", val);
  }
}
</script>
