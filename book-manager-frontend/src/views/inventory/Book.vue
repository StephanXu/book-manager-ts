<template>
  <v-container fluid class="mx-auto" style="max-width: 960px">
    <v-select
      :items="libraryList"
      item-text="name"
      item-value="id"
      @change="refreshBooks"
    >
    </v-select>
  </v-container>
</template>

<script lang="ts">
import library from "@/store/modules/library";
import { Book, listBooks } from "@/api/library";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class InventoryBook extends Vue {
  public get libraryList() {
    return library.library;
  }

  private books: Book[] = [];

  public created(): void {
    library.fetchLibraryList();
  }

  public async refreshBooks(libraryId: number) {
    this.books = await listBooks(libraryId);
  }
}
</script>

<style>
</style>