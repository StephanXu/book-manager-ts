<template>
  <v-container fluid class="mx-auto" style="max-width: 960px">
    <v-card flat outlined>
      <v-data-table :items="books" :headers="bookTableHeaders" item-key="title">
        <template v-slot:item.author="{ item }">
          <v-chip v-for="author in item.author" :key="author.id" small>
            {{ author.name }}
          </v-chip>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-btn small text @click="returnBook(item.id)">
            <v-icon left>mdi-cube-send</v-icon>还书
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import library from "@/store/modules/library";
import users from "@/store/modules/user";
import { Book, getBorrowedBook, returnBook } from "@/api/library";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class InventoryBook extends Vue {
  public get libraryList() {
    return library.library;
  }

  private books: Book[] = [];
  private bookTableHeaders = [
    { text: "书名", value: "title" },
    { text: "作者", value: "author" },
    { text: "操作", value: "operation" },
  ];
  public async created() {
    this.books = await getBorrowedBook();
  }
  public async returnBook(bookId: number) {
    await returnBook(bookId, users.id);
    this.books = await getBorrowedBook();
  }
}
</script>

<style>
</style>