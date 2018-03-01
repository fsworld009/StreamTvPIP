<template>
  <div class="stream-container" v-if="hasStream">
    <StreamTwitch :options="streamOptions.main"  v-if="hasStream"/>
    <div class="sub-stream">
      <StreamTwitch :options="streamOptions.sub"  />
    </div>
  </div>
</template>


<script>
import StreamTwitch from './StreamTwitch.vue';
export default {
  props: {
    hasStream:{

    },
    streamOptions:{
      type: Object
    }
  },
  components: {
    StreamTwitch
  }
}
</script>

