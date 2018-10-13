import {
  addGroupsListener,
  addUserListener,
  removeGroupAndUserListeners,
  addSingleGroupListener,
  removeSingleGroupListener
} from '@/common/socket'

import ws from '@/common/ws'


// actions to allow the client to communicate with the websocket server and talk with the store state.
export default {
  getUser({commit,state}) {
    return ws.getUser(state.user._id).then(user => {
      commit('setUser',{user})
    })
  },
  createUser({state,commit},payload) {
    return ws.createUser(payload).then(user => {
      addUserListener(user,state)
      addGroupsListener(user,state)
      commit('setUser',{user})
    })
  },
  signOut({state,commit,dispatch}) {
    ws.getUser(state.user._id).then(removeGroupAndUserListeners)
    commit('removeUser')
  },
  setActiveList({commit},type) {
    commit('setActiveList',{type})
    commit('removeCurrentRoom')
  },
  getList({commit,state}) {
    if(state.activeList === 'friends') {
      return ws.getFriends(state.user._id)
        .then(list => commit('setList',list))
    } else {
      return ws.getGroups(state.user._id)
        .then(list => commit('setList',list))
    }
  },
  createGroup({state,dispatch},keyword) {
    return ws.createGroup({
      from: state.user._id,
      data: {name: keyword}
    }).then(({groupId}) => {
      addSingleGroupListener(groupId,state)
      return dispatch('getList')
    })
  },
  searchUsers({state,commit},keyword) {
    return ws.searchUsers({
      keyword,
      from: state.user._id
    }).then(result => {
      commit('setResult',{result})
    })
  },
  searchGroups({commit},keyword) {
    return ws.searchGroups(keyword).then(result => {
      commit('setResult',{result})
    })
  },
  joinGroup({state,dispatch},groupId) {
    addSingleGroupListener(groupId,state)
    return ws.joinGroup({
      from: state.user._id,
      groupId
    }).then(() => {
      return dispatch('getList')
    })
  },
  addFriend({state,dispatch},friendId) {
    return ws.addFriend({
      from: state.user._id,
      friendId
    }).then(() => {
      return dispatch('getList')
    })
  },
  removeResult({commit}) {
    commit('removeResult')
  },
  changeCurrentRoom({commit},item) {
    commit('changeCurrentRoom',{item})
  },
  pullMsg({commit,state},page) {
    let params = {
      from: state.user._id,
      data: {page}
    }
    if(state.activeList === 'friends') {
      params.friendId = state.currentRoom._id
    } else {
      params.groupId = state.currentRoom._id
    }

    return ws.pullMsg(params).then(({data}) => {
      commit('pullMsg',data)
      if(data.length < 1) return false
    })
  },
  pushMsg({commit,state},content) {
    let params = {
      from: state.user._id,
      data: {content}
    }

    if(state.activeList === 'friends') {
      params.friendId = state.currentRoom._id
    } else {
      params.groupId = state.currentRoom._id
    }

    ws.pushMsg(params)
    if(state.activeList === 'friends') {
      commit('pushMsg',{
        from: _.pick(state.user,['_id','name','avatar']),
        content
      })
    }
  },
  removeFriend({commit,state,dispatch}) {
    let id = state.currentRoom._id
    let params = {
      from: state.user._id,
      friendId: id
    }

    if(state.count[id]) {
      state.count = _.assign(state.count,{
        [id]: 0
      })
    }

    return ws.removeFriend(params).then(() => {
      commit('removeCurrentRoom')
      dispatch('getList')
    })
  },
  leaveGroup({commit,state,dispatch}) {
    let id = state.currentRoom._id
    let params = {
      from: state.user._id,
      groupId: id
    }

    removeSingleGroupListener(id)

    if(state.count[id]) {
      state.count = _.assign(state.count,{
        [id]: 0
      })
    }

    return ws.leaveGroup(params).then(() => {
      commit('removeCurrentRoom')
      dispatch('getList')
    })
  },
  getGroupMember({state}) {
    let groupId = state.currentRoom._id
    return ws.getGroupMember({groupId}).then(({data}) => data)
  },
  uploadImg({state,commit},data) {
    let params = {
      from: state.user._id,
      data
    }

    return ws.uploadImg(params)
  }
}
