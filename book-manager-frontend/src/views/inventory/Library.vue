<template>
  <v-container fluid class="mx-auto" style="max-width: 960px">
    <v-menu
      top
      :close-on-content-click="false"
      :nudge-width="300"
      offset-y
      v-model="addLibraryVisible"
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on" depressed> 添加图书馆 </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>添加图书馆</v-list-item-title>
              <v-list-item-subtitle>
                添加新的图书馆以建立馆藏
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-text>
          <v-form>
            <v-text-field
              label="名称"
              v-model="addLibrary.name"
              outlined
            ></v-text-field>
            <v-text-field
              label="位置"
              v-model="addLibrary.position"
              outlined
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="confirmAddLibrary">添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-row v-for="item in libraryList" :key="item.id">
      <v-col span="12">
        <v-card outlined>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.position }}</v-card-subtitle>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="deleteLibrary(item.id)">
              删除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import library from "@/store/modules/library";
import { addLibrary, removeLibrary } from "@/api/library";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class InventoryLibrary extends Vue {
  private addLibrary = {
    name: "",
    position: "",
  };
  private addLibraryVisible = false;

  get libraryList() {
    return library.library;
  }

  public created() {
    library.fetchLibraryList();
  }

  public async confirmAddLibrary() {
    await addLibrary(this.addLibrary);
    await library.fetchLibraryList();
    this.addLibraryVisible = false;
  }

  public async deleteLibrary(libraryId: number) {
    await removeLibrary(libraryId);
    await library.fetchLibraryList();
  }
}
</script>

<style>
</style>