<template>
  <v-container fluid class="mx-auto" style="max-width: 960px">
    <v-row>
      <v-col span="12">
        <v-card flat outlined>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>图书馆</v-list-item-title>
                <v-list-item-subtitle> 选择图书馆数据源 </v-list-item-subtitle>
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
      <v-data-table
        :items="bookList"
        :headers="bookTableHeaders"
        item-key="title"
      >
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
                  <v-icon left>mdi-plus</v-icon>添加新书
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
        <template v-slot:item.reader="{ item }">
          <strong v-if="item.reader" v-html="item.reader.name"></strong>
          <span class="grey--text" v-else>未借出</span>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-btn
            small
            text
            @click="deleteBook(item.id)"
            :disabled="item.reader != null"
            color="error"
          >
            <v-icon left>mdi-delete</v-icon>删除
          </v-btn>
          <v-dialog v-model="item.bookRecordVisible" scrollable max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" small text v-bind="attrs" v-on="on">
                <v-icon left>mdi-clipboard-edit-outline</v-icon>记录
              </v-btn>
            </template>
            <v-card>
              <v-card-title>{{ item.title }} 借阅记录</v-card-title>
              <v-divider></v-divider>
              <v-data-table
                :items="item.borrowRecord"
                :headers="bookRecordHeaders"
                item-key="id"
              >
              </v-data-table>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="item.bookRecordVisible = false"
                >
                  关闭
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import library from "@/store/modules/library";
import {
  addBook,
  AddBookReq,
  Book,
  listBooks,
  removeBook,
} from "@/api/library";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class InventoryBook extends Vue {
  private books: Book[] = [];
  private libraryId = 0;
  private addBookVisible = false;
  private bookRecordVisible = false;
  private newBookInfo = new AddBookReq();
  private bookTableHeaders = [
    { text: "书名", value: "title" },
    { text: "作者", value: "author" },
    { text: "状态", value: "status" },
    { text: "借书人", value: "reader" },
    { text: "操作", value: "operation" },
  ];
  private bookRecordHeaders = [
    { text: "时间", value: "time" },
    { text: "操作", value: "direction" },
    { text: "读者", value: "reader" },
  ];

  public get libraryList() {
    return library.library;
  }

  public get bookList() {
    return this.books.map((book) => {
      return {
        ...book,
        borrowRecord: book.borrowRecord
          .sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
          )
          .map((rec) => {
            return {
              ...rec,
              time: new Date(rec.time).toLocaleString(),
              reader: rec.reader.name,
              direction: rec.direction ? "借出" : "还书",
              bookRecordVisible: false,
            };
          }),
      };
    });
  }

  public async created() {
    this.newBookInfo.author = [""];
    await library.fetchLibraryList();
    if (this.libraryList.length > 0) {
      await this.refreshBooks(this.libraryList[0].id);
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

  public async deleteBook(bookId: number) {
    await removeBook(bookId);
    this.books = await listBooks(this.libraryId);
  }
}
</script>

<style>
</style>