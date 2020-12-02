<template>
  <v-container fluid class="mx-auto" style="max-width: 960px">
    <v-card flat outlined>
      <v-data-table
        :items="mappedUserList"
        :headers="userTableHeaders"
        item-key="title"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-menu
              top
              :close-on-content-click="false"
              :nudge-width="300"
              offset-y
              v-model="addUserVisible"
              transition="slide-y-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on" depressed>
                  <v-icon left>mdi-account-plus-outline</v-icon>添加用户
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>添加用户</v-list-item-title>
                      <v-list-item-subtitle>
                        添加一个新的用户
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-card-text>
                  <v-form>
                    <v-text-field
                      label="邮箱"
                      v-model="newUser.username"
                      outlined
                      dense
                      prepend-icon="mdi-email"
                    >
                    </v-text-field>
                    <v-text-field
                      label="密码"
                      v-model="newUser.password"
                      outlined
                      dense
                      type="password"
                      prepend-icon="mdi-form-textbox-password"
                    >
                    </v-text-field>
                    <v-text-field
                      label="头像"
                      v-model="newUser.avatar"
                      outlined
                      dense
                      prepend-icon="mdi-face-recognition"
                    ></v-text-field>
                    <v-text-field
                      label="生日"
                      v-model="newUser.birthday"
                      outlined
                      dense
                      prepend-icon="mdi-calendar"
                    ></v-text-field>
                    <v-text-field
                      label="电话"
                      v-model="newUser.telephone"
                      outlined
                      dense
                      prepend-icon="mdi-phone"
                    ></v-text-field>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="confirmAddUser">
                    <v-icon left>mdi-account-plus-outline</v-icon>添加
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-toolbar>
        </template>
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="36px">
            <img :src="item.avatar" :alt="item.alias" />
          </v-avatar>
        </template>
        <template v-slot:item.roles="{ item }">
          <v-chip v-for="(role, index) in item.roles" :key="index" small>
            {{ role === "admin" ? "管理员" : "读者" }}
          </v-chip>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-btn small text color="error" :disabled="item.roles[0] === 'admin'">
            <v-icon left>mdi-delete</v-icon>删除
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getUserList,
  RegisterRequest,
  registerUser,
  UserProfile,
} from "@/api/user";

@Component
export default class InventoryLibrary extends Vue {
  private newUser = new RegisterRequest();
  private addUserVisible = false;
  private userList: UserProfile[] = [];
  private userTableHeaders = [
    { text: "UID", value: "id" },
    { text: "头像", value: "avatar" },
    { text: "姓名", value: "alias" },
    { text: "邮箱", value: "username" },
    { text: "生日", value: "birthday" },
    { text: "电话", value: "telephone" },
    { text: "权限", value: "roles" },
    { text: "操作", value: "operation" },
  ];

  get mappedUserList() {
    return this.userList.map((user) => {
      return {
        ...user,
        birthday: new Date(user.birthday).toDateString(),
      };
    });
  }

  public async created() {
    this.userList = await getUserList();
  }

  public async confirmAddUser() {
    await registerUser(this.newUser);
    this.userList = await getUserList();
    this.addUserVisible = false;
  }
}
</script>

<style>
</style>