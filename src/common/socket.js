const socket = io.connect("/")

function addGroupsListener(user,state) {
    _.forEach(user.groups,item => {
        socket.on(item,({from,data}) => {
            if(data.type) return
            if(item === state.currentRoom._id) {
                state.messages.push(data)
            } else {
                if(_.isString(state.count)) {
                    state.count = {[item]: 1}
                } else {
                    let count = state.count[item]
                    state.count = _.assign(state.count,{
                        [item]: count ? ++count : 1
                    })
                }
            }
        })
    })
}

function addUserListener(user,state) {
    let old = state.user
    socket.removeAllListeners(old._id)
    socket.on(user._id,({from,data}) => {

        if(from === state.currentRoom._id) {
            state.messages.push(data)
        } else {
            if(_.isString(state.count)) {
                state.count = {[from]: 1}
            } else {
                let count = state.count[from]
                state.count = _.assign(state.count,{
                    [from]: count ? ++count : 1
                })
            }
        }
    })
}

function removeGroupAndUserListeners(user) {
    socket.removeAllListeners(user._id)
    _.forEach(user.groups,item => {
        socket.removeAllListeners(item)
    })
}

function addSingleGroupListener(groupId,state) {
    socket.on(groupId,({from,data}) => {
        if(data.type) return

        if(groupId === state.currentRoom._id) {
            state.messages.push(data)
        } else {
            if(_.isString(state.count)) {
                state.count = {[groupId]: 1}
            } else {
                let count = state.count[groupId]
                state.count = _.assign(state.count,{
                    [groupId]: count ? ++count : 1
                })
            }
        }
    })
}

function removeSingleGroupListener(groupId) {
    socket.removeAllListeners(groupId)
}

export {
    socket,
    addGroupsListener,
    addUserListener,
    removeGroupAndUserListeners,
    addSingleGroupListener,
    removeSingleGroupListener
}
