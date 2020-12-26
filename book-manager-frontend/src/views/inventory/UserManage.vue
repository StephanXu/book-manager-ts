<template>
  <v-container fluid class="mx-auto" style="max-width: 1140px">
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

                <v-list>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-avatar color="indigo">
                        <img
                          v-if="newUser.avatar.length"
                          :src="newUser.avatar"
                        />
                        <v-icon dark v-else> mdi-account-circle </v-icon>
                      </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ newUser.name.length ? newUser.name : "姓名" }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          newUser.username.length ? newUser.username : "邮箱"
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn
                        fab
                        depressed
                        small
                        dark
                        color="primary"
                        @click="confirmAddUser"
                      >
                        <v-icon dark>mdi-plus</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                  <v-list-item>
                    <v-text-field
                      class="mt-3"
                      label="姓名"
                      v-model="newUser.name"
                      outlined
                      dense
                      prepend-icon="mdi-rename-box"
                    >
                    </v-text-field>
                  </v-list-item>
                  <v-list-item>
                    <v-text-field
                      label="邮箱"
                      v-model="newUser.username"
                      outlined
                      dense
                      prepend-icon="mdi-email"
                    >
                    </v-text-field>
                  </v-list-item>
                  <v-list-item>
                    <v-text-field
                      label="密码"
                      v-model="newUser.password"
                      outlined
                      dense
                      type="password"
                      prepend-icon="mdi-form-textbox-password"
                    >
                    </v-text-field>
                  </v-list-item>
                  <v-list-item>
                    <v-text-field
                      label="头像"
                      v-model="newUser.avatar"
                      outlined
                      dense
                      prepend-icon="mdi-face-recognition"
                    >
                      <template v-slot:append-outer>
                        <v-btn
                          class="mt-n2"
                          text
                          color="primary"
                          @click="generateRandomAvatar"
                          :loading="fetchAvatarLoading"
                        >
                          获取头像
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-list-item>
                  <v-list-item>
                    <birthday-selection
                      v-model="BirthdaySelectionvisible"
                      @change="selectBirthday"
                    >
                    </birthday-selection>
                  </v-list-item>
                  <v-list-item>
                    <v-text-field
                      label="电话"
                      v-model="newUser.telephone"
                      outlined
                      dense
                      prepend-icon="mdi-phone"
                    ></v-text-field>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-toolbar>
        </template>
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="36px" color="grey">
            <img
              v-if="item.avatar.length"
              :src="item.avatar"
              :alt="item.alias"
            />
            <v-icon dark v-else> mdi-account-circle </v-icon>
          </v-avatar>
        </template>
        <template v-slot:item.roles="{ item }">
          <v-chip
            v-for="(role, index) in item.roles"
            :key="index"
            small
            :disabled="curtUserId == item.id"
            @click="changeUserRole(item.id, role)"
            :color="role === 'admin' ? 'warning' : 'default'"
          >
            {{ role === "admin" ? "管理员" : "读者" }}
          </v-chip>
        </template>
        <template v-slot:item.operation="{ item }">
          <v-btn
            small
            text
            color="error"
            :disabled="item.roles[0] === 'admin'"
            @click="deleteUser(item.id)"
          >
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
  changeUserRole,
  fetchRandomUser,
  getUserList,
  RegisterRequest,
  registerUser,
  removeUser,
  UserProfile,
} from "@/api/user";
import BirthdaySelection from "./BirthdaySelection.vue";
import users from "@/store/modules/user";

@Component({
  components: {
    BirthdaySelection,
  },
})
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
  private fetchAvatarLoading = false;
  private BirthdaySelectionvisible = false;

  get mappedUserList() {
    return this.userList.map((user) => {
      return {
        ...user,
        birthday: new Date(user.birthday).toDateString(),
      };
    });
  }

  get curtUserId() {
    return users.id;
  }

  public async created() {
    this.userList = await getUserList();
  }

  public async confirmAddUser() {
    await registerUser(this.newUser);
    this.userList = await getUserList();
    this.addUserVisible = false;
  }

  public async generateRandomAvatar() {
    this.fetchAvatarLoading = true;
    const randomUser = (await fetchRandomUser()).results[0];
    this.newUser.avatar = randomUser.picture.large;
    this.fetchAvatarLoading = false;
  }

  public async changeUserRole(userId: number, curtRole: string) {
    await changeUserRole(userId, [curtRole === "admin" ? "member" : "admin"]);
    this.userList = await getUserList();
  }

  public async deleteUser(userId: number) {
    try {
      await removeUser(userId);
    } catch (err) {
      // TODO: Need to display message box
    }
    this.userList = await getUserList();
  }

  public async selectBirthday(birthday: Date) {
    this.newUser.birthday = birthday;
  }
}
</script>

<style>
</style>