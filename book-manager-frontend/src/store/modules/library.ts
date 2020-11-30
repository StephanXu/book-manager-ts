import store from '@/store'
import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators'
import { Library, listLibrary } from '@/api/library'
@Module({
    namespaced: true,
    name: 'library',
    dynamic: true,
    store
})
class LibraryStore extends VuexModule {
    library: Library[] = [];

    @MutationAction({ mutate: ['library'] })
    async fetchLibraryList() {
        return {
            library: await listLibrary()
        };
    }
}

export default getModule(LibraryStore);