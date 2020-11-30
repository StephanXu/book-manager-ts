import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'

@Module({
    namespaced: true,
    dynamic: true,
    store
})
class ViewStore extends VuexModule {
    clientWidth = 0;
    clientHeight = 0;

    @Mutation
    SET_CLIENT_WIDTH(val: number) { this.clientWidth = val }

    @Mutation
    SET_CLIENT_HEIGHT(val: number) { this.clientHeight = val }
}

export default getModule(ViewStore)