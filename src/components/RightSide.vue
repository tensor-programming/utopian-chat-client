<template>
  <div class="right-side" v-if="currentRoom">
    <div class="message-show">
      <div class="avatar-area clearfix">
        <span @mouseleave="showMember=false">
          {{upperFirst(currentRoom.name.replace('@', ''))}}
          <i class="link" @mouseenter="getGroupMember" v-if="activeList == 'groups'" :class="showMember?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
        </span>
        <p class="pull-right padding-right-15">
          <el-button @click="quit" type="danger">{{activeList=='friends'?'Unfriend':'Leave Group'}}</el-button>
        </p>
        <div v-if="showMember" class="member-list scrollbar" @mouseenter="showMember=true" @mouseleave="showMember=false">
          <div :title="item.name" class="member-item padding-10" v-for="item in members">
            <img :src="item.avatar" class="avatar">
            <p class="member-name">{{upperFirst(item.name.replace('@', ''))}}</p>
          </div>
        </div>
      </div>
      <div class="show-area scrollbar" id="show-area">
        <div class="text-center padding-5" v-if="noMoreMsgs">
          <span class="chat-tip">No earlier messages</span>
        </div>
        <div class="text-center padding-5" v-if="getMore && messages.length>0">
          <i class="padding-5 el-icon-arrow-down link" @click="getMoreMsg" title="Get more messages"></i>
        </div>
        <div class="content clearfix padding-10" v-for="(msg, index) in messages" :key="index">
          <div class="text-center padding-5" v-if="msg.type==='system'">
            <span class="chat-tip">{{upperFirst(msg.name.replace('@', ''))}}: {{msg.content}}</span>
          </div>
          <template v-else>
            <div :class="msg.from._id==user._id?'pull-right':'pull-left'">
              <img :src="msg.from._id==user._id?user.avatar:msg.from.avatar" class="avatar">
            </div>
            <div class="triangle" :class="msg.from._id==user._id?'pull-right item-right':'pull-left item-left'">
              <p :class="msg.from._id==user._id?'text-right':'text-left'">{{upperFirst(msg.from.name.replace('@', ''))}}</p>
              <pre class="content-item" v-html="msg.content"></pre>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="message-input">
      <div class="message-options clearfix">
        <div class="pull-left options options-img">
          <i class="el-icon-picture"></i>
          <form id="options-img-file">
            <input @change="sendFile($event.target.files[0])" class="options-img-file" type="file" accept="image/jpeg, image/gif, image/png">
          </form>
        </div>
      </div>
      <textarea id="message-content" class="scrollbar" v-model="content" @keydown.enter.stop.prevent="submitMsg()" @keydown.ctrl.stop.prevent="breakLine($event)"></textarea>
      <div class="post-btn clearfix">
        <p>
          <span class="post-tip">Enter to Submit, Ctrl to make a Line Break</span>
          <el-button :disabled="!content" type="success" @click="submitMsg()">Submit</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            content: '',
            page: 1,
            getMore: true,
            gettingMoreMsgs: false,
            noMoreMsgs: false,
            showMember: false,
            members: '',
        }
    },
    computed: {
        length() {
            return this.$store.state.messages.length
        },
        ...mapState(['user', 'currentRoom', 'messages', 'activeList'])
    },
    methods: {
      upperFirst: _.upperFirst,

        breakLine($e) {
            this.content = this.content + '\n'
            let txt = $e.target
            txt.scrollTop = txt.scrollHeight
        },
        submitMsg(content) {
            let ctt = content || this.content
            if (!ctt) return
            this.gettingMoreMsgs = false
            this.$store.dispatch('pushMsg', ctt.replace(/</g, '&lt;').replace(/&lt;img/g, '<img'))
            if (ctt == this.content) {
                this.content = ''
            }
        },
        getMoreMsg() {
            this.gettingMoreMsgs = true
            this.$store.commit('notChange')
            this.$store
                .dispatch('pullMsg', ++this.page)
                .then(flag => {
                    if (flag === false) {
                        this.getMore = false
                        this.noMoreMsgs = true
                        setTimeout(() => { this.noMoreMsgs = false }, 500)
                    }
                })
        },
        quit() {
            if (this.activeList === 'friends') {
                this.$store.dispatch('removeFriend')
            } else {
                this.$store.dispatch('leaveGroup')
            }
        },
        getGroupMember() {
            this.showMember = true
            this.$store.dispatch('getGroupMember').then(members => this.members = members)
        },
        sendFile(file) {

            if (!file) return
            let fileElem = document.getElementById('options-img-file')
            let inputElem = document.getElementById('message-content')

            let valid = this.fileValid(file, 1024)
            if (!valid.flag) {
                alert(valid.msg)
                return
            }

            this.$store
                .dispatch('uploadImg', {
                    file,
                    type: this.fileValid.types[file.type]
                })
                .then(url => {
                    fileElem.reset();
                    let img = `<img src="${url.img}">`
                    this.submitMsg(img)
                    inputElem.focus()
                })
        }
    },
    watch: {
        currentRoom(newVal) {
            if (!newVal) return
            this.getMore = true
            this.noMoreMsgs = false
            this.page = 1
            this.$store.dispatch('pullMsg', this.page)
        },
        length(newVal) {
            let elem = document.getElementById('show-area')
            if (!newVal) return
            if (!elem) return
            if (!this.gettingMoreMsgs) {
                this.$nextTick(() => {
                    elem.scrollTop = elem.scrollHeight
                })
            }
        }
    }
}
</script>

<style>
.right-side {
  flex: auto;
  display: flex;
  flex-direction: column;
}

.message-show {
  height: 460px;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

.avatar-area {
  flex: none;
  height: 50px;
  text-align: center;
  line-height: 50px;
  position: relative;
}

.member-list {
  position: absolute;
  height: 150px;
  width: 100%;
  top: 100%;
  left: 0;
  z-index: 10;
  line-height: normal;
}

.member-item {
  float: left;
}

.member-name {
  font-size: 12px;
  max-width: 72px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.avatar-area span {
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.show-area {
  flex: auto;
  overflow: auto;
}

.content-item {
  background: #b2e281;
  padding: 12px;
  border-radius: 5px;
  max-width: 480px;
}

.content-item img {
  max-width: 100%;
  height: auto;
}

.item-right {
  margin-right: 12px;
}

.triangle.item-right:after {
  right: -12px;
}

.item-left {
  margin-left: 12px;
}

.triangle.item-left:after {
  left: -12px;
}

.triangle {
  position: relative;
}

.triangle:after {
  content: '';
  position: absolute;
  top: 24px;
  border: 6px solid transparent;
}

.chat-tip {
  padding: 2px 15px;
  border-radius: 11px;
  display: inline-block;
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-input {
  height: 180px;
  flex: none;
}

.message-options {
  padding: 5px 12px;
}

.options {
  position: relative;
}

.options-img {
  margin-left: 24px;
}

.options-img > i {
  font-size: 22px;
}

.options-img-file {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.message-input textarea {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 96px;
  border: none;
  outline: none;
  padding: 12px;
  padding-top: 0;
  overflow: auto;
  font-size: 16px;
}

.post-btn {
  height: 50px;
}

.post-btn p {
  float: right;
  padding-right: 20px;
}

span.post-tip {
  line-height: 50px;
}
</style>
