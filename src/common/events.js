import store from '@/store'
import {socket} from './socket'

socket.on('addFriend',({friendId}) => {
    let {user,activeList} = store.state
    if(user && user._id == friendId && activeList === 'friends') {
        store.dispatch('getList')
    }
    return
})

socket.on('removeFriend',({from,friendId}) => {
    let {user,activeList,currentRoom} = store.state
    if(user && user._id == friendId && activeList === 'friends') {
        store.dispatch('getList')
    }
    if(from === currentRoom._id) {
        store.commit('removeCurrentRoom')
    }
    return
})
