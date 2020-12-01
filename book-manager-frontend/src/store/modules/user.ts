import store from '@/store'
import { setToken, removeToken } from '@/utils/auth'
import { login, getInfo } from '@/api/user'
import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators'

@Module({
    namespaced: true,
    name: 'user',
    dynamic: true,
    store
})
class UserStore extends VuexModule {
    id = 0;
    token = '';
    name = '';
    alias = '';
    roles: string[] = [];
    avatar = '';
    birthday = new Date;
    telephone = '';

    @MutationAction({ mutate: ['token', 'name', 'alias', 'roles'] })
    async login(userInfo: { username: string; password: string }) {
        const response = (await login({
            username: userInfo.username.trim(),
            password: userInfo.password
        }))
        setToken(response.token)
        return response
    }

    @MutationAction({ mutate: ['roles', 'name', 'alias', 'avatar', 'birthday', 'telephone', 'id'] })
    async getInfo() {
        try {
            const info = await getInfo();
            if (!info) {
                throw 'Verification failed, please Login again.'
            }
            if (!info.roles || info.roles.length <= 0) {
                throw 'getInfo: roles must be a non-null array!';
            }
            return {
                name: info.username,
                alias: info.alias,
                roles: info.roles,
                avatar: info.avatar,
                birthday: info.birthday,
                telephone: info.telephone,
                id: info.id
            };
        }
        catch (err) {
            removeToken()
            location.reload()
            return {
                name: '',
                alias: '',
                roles: [],
                avatar: '',
                birthday: new Date,
                telephone: '',
                id: 0
            }
        }
    }

    @MutationAction({ mutate: ['token', 'name', 'roles'] })
    async logout() {
        removeToken()
        return {
            name: '',
            token: '',
            roles: []
        }
    }
}

export default getModule(UserStore);