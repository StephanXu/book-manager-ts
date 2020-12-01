<template>
  <v-container fluid class="mx-auto" style="max-width: 960px">
    <v-row>
      <v-col span="12">
        <v-card flat outlined>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>图书馆</v-list-item-title>
                <v-list-item-subtitle> 编辑图书馆数据源 </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-text>
            <v-select
              :items="libraryList"
              item-text="name"
              item-value="id"
              @change="refreshBooks"
              outlined
              v-model="libraryId"
            >
            </v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card flat outlined>
      <v-data-table :items="books" :headers="bookTableHeaders" item-key="title">
        <template v-slot:top>
          <v-toolbar flat>
            <v-menu
              top
              :close-on-content-click="false"
              :nudge-width="300"
              offset-y
              v-model="addBookVisible"
              transition="slide-y-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on" depressed>
                  添加新书
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>添加新书</v-list-item-title>
                      <v-list-item-subtitle>
                        添加新的图书到馆藏
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-card-text>
                  <v-form>
                    <v-text-field
                      label="书名"
                      v-model="newBookInfo.title"
                      outlined
                      dense
                    >
                      <template v-slot:append-outer>
                        <v-btn depressed style="margin-top: -5px"
                          >匹配书名</v-btn
                        >
                      </template>
                    </v-text-field>
                    <v-text-field
                      label="作者"
                      v-model="newBookInfo.author[0]"
                      outlined
                      dense
                    ></v-text-field>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="addNewBook">添加</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-toolbar>
        </template>
        <template v-slot:item.author="{ item }">
          <v-chip v-for="author in item.author" :key="author.id" small>
            {{ author.name }}
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip small>
            {{ item.reader ? "不可借" : "可借" }}
          </v-chip>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-btn small text @click="borrowBook(item.id)" :disabled="item.reader"
            ><v-icon left>mdi-cube-send</v-icon>借书</v-btn
          >
          <v-btn small text @click="deleteBook(item.id)" :disabled="item.reader">
            <v-icon left>mdi-delete</v-icon>删除</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import library from "@/store/modules/library";
import users from "@/store/modules/user";
import {
  addBook,
  AddBookReq,
  Book,
  borrowBook,
  listBooks,
  removeBook,
} from "@/api/library";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class InventoryBook extends Vue {
  public get libraryList() {
    return library.library;
  }

  private books: Book[] = [];
  private libraryId = 0;
  private addBookVisible = false;
  private newBookInfo = new AddBookReq();
  private bookTableHeaders = [
    { text: "书名", value: "title" },
    { text: "作者", value: "author" },
    { text: "状态", value: "status" },
    { text: "操作", value: "operation" },
  ];
  public async created() {
    this.newBookInfo.author = [""];
    await library.fetchLibraryList();
    if (this.libraryList.length > 0) {
      this.refreshBooks(this.libraryList[0].id);
    }
  }

  public async refreshBooks(libraryId: number) {
    this.libraryId = libraryId;
    this.books = await listBooks(libraryId);
  }

  public async addNewBook() {
    this.newBookInfo.library = this.libraryId;
    await addBook(this.libraryId, this.newBookInfo);
    this.books = await listBooks(this.libraryId);
    this.addBookVisible = false;
  }

  public async borrowBook(bookId: number) {
    await borrowBook(bookId, users.id);
    this.books = await listBooks(this.libraryId);
  }

  public async deleteBook(bookId: number) {
    await removeBook(bookId);
    this.books = await listBooks(this.libraryId);
  }
}
</script>

<style>
</style>