<template>
  <div>
        
      
    <template v-if="loading">
      <div class="stream-col overlay-text stream-overlay">
        <h1 class="text white"><i class=" spinner loading icon"></i></h1>
      </div>
    </template>
    <template v-else> 
      <!-- <StreamContainer position="main"/> -->
      <!-- <component :is="'StreamTwitch'" :options="stream"  :style="streamColStyle" @streamLoad="onStreamLoad"/> -->
      <!-- <template v-if="hasStream"> -->
        <!-- <StreamTwitch :options="streamOptions.main"  v-if="hasStream"/> -->
        <template v-if="showOptions">
          <Options @close="onCloseOptionsModal"/>
        </template>
        <StreamWrapper :hasStream="hasStream" , :streamOptions="streamOptions"/>
      </template>
      
      
    <!--</template>-->
  </div>
</template>

<script>
import Options from './components/Options.vue';
import StreamWrapper from './components/StreamWrapper.vue';
import {mapState, mapGetters} from 'vuex';
import {LOAD_LANG_LIST, LOAD_LANG} from './actions.js';
import {PAGE_LOADED} from './mutations.js';

export default {
  components: {
    Options,
    // StreamTwitch,
    StreamWrapper
  },
  
  data (){
    var state = this.$store.state;
    console.log("state",state)
    return {
      loading: true
    };
  },

  computed: Object.assign(mapGetters(['showOptions']), mapState({
    streamOptions(state){
      return {
        main: {
          site: state.main.site,
          channel: state.main.channel,
          openChat: true,
          showChat: true,
          chatOpacity: 50,
          chatPosition: "right",
          chatWidth: 30,
          chatExpandOnHover: false
        },
        sub: {
          site: state.sub.site,
          channel: state.sub.channel,
          openChat: false
        }
      };
    },
    hasStream(state){
      return state.main.channel && state.sub.channel? true:false;
    }
    
  })),

  mounted(){

    //ajax calls on page load
    if(this.loading){
      var $langListDeferred = $.Deferred(), $langDeferred = $.Deferred();
      this.$store.dispatch({
        type: LOAD_LANG_LIST,
        callback: ()=>{
          $langListDeferred.resolve();
        }
      });
      this.$store.dispatch({
        type: LOAD_LANG,
        callback: ()=>{
         $langDeferred.resolve();
        }
      });
      $.when($langListDeferred, $langDeferred).then(()=>{
        this.loading = false;
      });
    }
  },

  
  methods: {
    onCloseOptionsModal(){
      // this.showOptions=false;
      // this.hasStream=true;
    }
  }
};
</script>
