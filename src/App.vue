<template>
  <div id="app">
    <!-- When user does exist move from the create-user component to the other template. -->
    <template v-if="!!user">
      <left-side></left-side>
      <right-side></right-side>
    </template>
    <create-user v-else></create-user>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LeftSide from './components/LeftSide'
import RightSide from './components/RightSide'
import CreateUser from './components/CreateUser'

export default {
  // map the user state to the root component.
  computed: mapState(['user']),
  components: { LeftSide, RightSide, CreateUser },
}
</script>

<style>
#app {
  margin: 0 auto;
  width: 80%;
  height: 100%;
  display: flex;
}

@media (max-width: 1000px) {
  #app {
    margin: 0;
    width: 100%;
  }
}

.iconfont {
  font-size: 22px;
}
</style>
