import {socket} from './socket'

export default {
    getUser(from) {
        return new Promise((res,rej) => {
            socket.emit('getUser',{from})
            socket.once('getUser',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    createUser(payload) {
        return new Promise((res,rej) => {
            socket.emit('createUser',payload)
            socket.once('createUser',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    getFriends(from) {
        return new Promise((res,rej) => {
            socket.emit('getFriends',{from})
            socket.once('getFriends',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    getGroups(from) {
        return new Promise((res,rej) => {
            socket.emit('getGroups',{from})
            socket.once('getGroups',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    searchUsers({keyword,from}) {
        return new Promise((res,rej) => {
            socket.emit('searchUsers',{keyword,from})
            socket.once('searchUsers',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    searchGroups(keyword) {
        return new Promise((res,rej) => {
            socket.emit('searchGroups',{keyword})
            socket.once('searchGroups',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    createGroup(params) {
        return new Promise((res,rej) => {
            socket.emit('createGroup',params)
            socket.once('createGroup',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    joinGroup(params) {
        return new Promise((res,rej) => {
            socket.emit('joinGroup',params)
            socket.once('joinGroup',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    addFriend(params) {
        return new Promise((res,rej) => {
            socket.emit('addFriend',params)
            socket.once('addFriend',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    pullMsg(params) {
        return new Promise((res,rej) => {
            socket.emit('pullMsg',params)
            socket.once('pullMsg',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    pushMsg(params) {
        socket.emit('pushMsg',params)
    },
    removeFriend(params) {
        return new Promise((res,rej) => {
            socket.emit('removeFriend',params)
            socket.once('removeFriend',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    leaveGroup(params) {
        return new Promise((res,rej) => {
            socket.emit('leaveGroup',params)
            socket.once('leaveGroup',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    getGroupMember(params) {
        return new Promise((res,rej) => {
            socket.emit('getGroupMember',params)
            socket.once('getGroupMember',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    uploadImg(params) {
        return new Promise((res,rej) => {
            socket.emit('uploadImg',params)
            socket.once('uploadImg',data => {
                if(data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    }

}
