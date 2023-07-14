import {makeAutoObservable, toJS} from "mobx";

class Store {
    selectedItems = []
    isSelectBarShown = false
    user = null

    constructor() {
        makeAutoObservable(this)
    }

    setUser(data) {
        this.user = data
    }

    setIsSelectBarShown(bool) {
        this.isSelectBarShown = bool
    }

    selectItem(key, name) {
        this.selectedItems.push({key, name})
    }

    unselectItem(key, name) {
        this.selectedItems = this.selectedItems.filter(i => !(i.key === key && i.name === name))
    }

    hasSelectedItem(key, name) {
        return this.selectedItems.findIndex(i => i.key === key && i.name === name) !== -1
    }

    clearSelectedItems(name) {
        this.selectedItems = this.selectedItems.filter(i => i.name !== name)
    }
}

export const store = new Store()