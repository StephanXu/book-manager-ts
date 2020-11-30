import store from '@/store'
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
    namespaced: true,
    name: 'library',
    dynamic: true,
    store
})
class LibraryStore extends VuexModule {
    clientWidth = 0;
    clientHeight = 0;

    @Mutation
    SET_CLIENT_WIDTH(val: number) { this.clientWidth = val }

    @Mutation
    SET_CLIENT_HEIGHT(val: number) { this.clientHeight = val }
}

export default getModule(LibraryStore);