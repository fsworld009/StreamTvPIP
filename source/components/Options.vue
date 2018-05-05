<template>
  <Modal :options="modalOptions" @close="onCloseModal">
     
      <div class="ui grid">
        <div class="two column row">
          <div class="column">
            <SeForm :validation="validationOptions">
              <h5 class="ui dividing header">{{$lang("options.main")}}</h5>
              <div class="fields">
                <Dropdown class="four wide" name="mainSite" :items="sites" :value="compOptions.mainSite" :label="$lang('options.site')"></Dropdown>
                <SeInput class="twelve wide" name="mainChannel" :value="compOptions.mainChannel" :label="$lang('options.channelId')"></SeInput>
              </div>
              <h5 class="ui dividing header">{{$lang("options.sub")}}</h5>
              <div class="fields">
                <Dropdown class="four wide" name="subSite" :items="sites" :value="compOptions.subSite" :label="$lang('options.site')"></Dropdown>
                <SeInput class="twelve wide" name="subChannel" :value="compOptions.subChannel" :label="$lang('options.channelId')"></SeInput>
              </div>
            </SeForm>
          </div>
          <div class="column">
            <Dropdown class="" name="langCode" :items="languages" :value="$lang.langCode()" :label="$lang('common.language')" @change="onLangCodeChange" :disabled="disableLangList"></Dropdown>
            <h5 class="ui dividing header">{{$lang("info.changeLog")}}</h5>
            <pre style="overflow:auto">
05.05.2018
Fix Chatroom Url
03.01.2018
First Version
            </pre>
            <!-- <h5 class="ui dividing header">Load Sessions</h5>
            <div class="ui grid">
              <div class="thirteen wide column">
                <Dropdown name="session" :items="savedSessionsTest" placeholder="Select Session"/>
              </div>
              <div class="one wide column"><SeButton class="green load-session">Load</SeButton></div>
            </div> -->
          </div>

        </div>
      </div>

      <template slot="footer">
      <div class="ui divider"></div>
        <div class="ui">
          by <a href="https://github.com/fsworld009/" target="_blank">fsworld009</a>
          <i class="ui large icon github"></i><a href="https://github.com/fsworld009/StreamTvPIP" target="_blank">{{$lang("info.projectGitHub")}}</a>
          <i class="ui large icon warning circle"></i><a href="https://github.com/fsworld009/StreamTvPIP/issues/" target="_blank">{{$lang("info.reportIssues")}}</a>
        </div> 
      </template>
  </Modal>
</template>


<script>
import {mapState} from 'vuex';
import Modal from './semantic/Modal.vue';
import SeForm from './semantic/Form.vue';
import SeButton from './semantic/Button.vue';
import SeInput from './semantic/Input.vue';
import Dropdown from './semantic/Dropdown.vue';
var _ = require("lodash");
import {UPDATE_STREAM, RESET_ARRAY, CHANGE_LANG_CODE} from '../mutations.js';
import {LOAD_LANG} from '../actions.js';

export default {
  components: {
    Modal,
    SeForm,
    SeInput,
    SeButton,
    Dropdown
  },
  data(){
    return {
      validationOptions: {
        fields: {
          mainChannel: 'empty',
          subChannel: 'empty'
        }
      },
      sites: [
        {text: "Twitch", value: "twitch"}
      ],
      disableLangList: false
    }
  },
  computed: mapState({

    modalOptions(state){
      var closeble = false;//state.width != 0 && state.height != 0;
      return {
        title: "Stream TV PIP",
        closable: closeble,
        closeIcon: closeble,
        actions: [
          {text: this.$lang("common.apply"), styleClasses: "green", action: this.applyOptions.bind(this)}
        ]
      };
    },
    
    compOptions(state){
      return {
        mainSite: state.main.site,
        mainChannel: state.main.channel,
        subSite: state.sub.site,
        subChannel: state.sub.channel
      }
    },

    languages(state){
      return state.langList
    },

    streamOptions(state){
      return state.streams;
    }
  }),

  methods: {
    onCloseModal(){
      this.$emit("close");
    },
    applyOptions(){
      var $el = $(this.$el);
      var data = {};

      var $form = $el.find('form');
      $form.form("validate form");  //force UI update
      if($form.form('is valid')){
        $form.find('input, textarea, select').each(function(i, field) {
          data[field.name] = field.value;
        });
        let options = {
        main: {
          site: data.mainSite,
          channel: data.mainChannel
        },
        sub: {
          site: data.subSite,
          channel: data.subChannel
          }
        };

        this.$store.commit(
          {
            type: UPDATE_STREAM,
            options: options
          }
        );
        $el.modal("hide");
        this.$emit("close");
      }
    },

    onLangCodeChange(value, text, $choice){
      this.disableLangList = true;
      this.$store.dispatch({
        type: LOAD_LANG,
        langCode: value,
        callback: ()=>{
          this.$store.commit({
            type: CHANGE_LANG_CODE,
            langCode: value
          });
          this.disableLangList = false;
        }
      });
      
    }
  }
}
</script>
