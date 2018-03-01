import Vuex from 'vuex';
import Vue from 'vue';
import VueLang from "./plugins/vue-lang.js";

Vue.use(Vuex);


// import getQueryParams from './queryParams.js';
// let queryParams = getQueryParams(["main","sub"]);
import {RESET_ARRAY, UPDATE_STREAM, SHOW_ARRAY_OPTIONS, UPDATE_LANG, UPDATE_LANG_LIST, CHANGE_LANG_CODE, SWAP_STREAM_ORDER} from "./mutations.js";
import {LOAD_LANG_LIST, LOAD_LANG} from "./actions.js";


const sessionStorageKey = 'StreamTvPIP';
let session = sessionStorage.getItem(sessionStorageKey) || "{}";

let initialState =  Object.assign({
    // sessionId: 1,
    main: {
        site: "twitch",
        channel: ""
    },
    sub: {
        site: "twitch",
        channel: ""
    },
    showOptionFlag: true,
    langCode: "en"
  //   savedSessions: []
}, JSON.parse(session));



let defaultLangCode = "en";
initialState.langList = [];

Vue.use(VueLang, {
    langCode: initialState.langCode,
    default: defaultLangCode
});




function saveSession(state){
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(state));
}

function loadLang(langCode, commit){
    return $.getJSON("./languages/"+langCode+".json", function(messages){
        commit({
            type: UPDATE_LANG,
            langCode: langCode,
            messages: messages
        });
    });
}

const store = new Vuex.Store({
    state: initialState,
    getters: {
        showOptions(state){
            return state.showOptionFlag;
        }
    //   savedSessionsById(state){
    //     return _.keyBy(state.savedSessions, "id");
    //   }
    },
    actions:{
        [LOAD_LANG_LIST]({ commit, state }, payload){
            $.getJSON("./languages/langCodes.json", function(langList){
                commit({
                    type: UPDATE_LANG_LIST,
                    langList: langList
                });
                if(typeof payload.callback == "function"){
                    payload.callback();
                }
            });
        },
        [LOAD_LANG]({ commit, state }, payload){
            var $defaultLangPromise;
            
            if(!Vue.$lang.loaded(defaultLangCode)){
                $defaultLangPromise = loadLang(defaultLangCode, commit);
            }else{
                $defaultLangPromise = $.Deferred().resolve();
            }
            $defaultLangPromise.then(()=>{
                var langCode = payload.langCode || state.langCode;
                if(langCode && !Vue.$lang.loaded(langCode)){
                    return loadLang(langCode, commit);
                }else{
                    return $.Deferred().resolve();
                }
            }).always(()=>{
                if(typeof payload.callback == "function"){
                    payload.callback();
                }
            });
        }
    },
    mutations: {
    //   [RESET_ARRAY](state, payload){
    //     if(payload.width && payload.height){
    //         state.width = Number(payload.width);
    //         state.height = Number(payload.height);
    //     }

    //     state.showOptionFlag = false;

    //     for(let i=0; i< state.width*state.height; i++){
    //         if(!state.streams[i]){
    //             Vue.set(state.streams, i, {
    //                 id: i,
    //                 order: i
    //             });
    //         }
    //     }

    //     saveSession(state);

    //   },
      [UPDATE_STREAM](state, payload){
        let options = payload.options;
        state.main = options.main;
        state.sub = options.sub;
        state.showOptionFlag = false;
        // saveSession(state);
      },
      [SHOW_ARRAY_OPTIONS](state, payload){
        state.showOptionFlag = true;
        saveSession(state);
      },

      [CHANGE_LANG_CODE](state, payload){
        state.langCode = payload.langCode;
        Vue.$lang.changeLangCode(payload.langCode);
        saveSession(state);
      },

      [UPDATE_LANG](state, payload){
        Vue.$lang.update(payload.langCode, payload.messages);
      },
      [UPDATE_LANG_LIST](state, payload){
          state.langList = payload.langList;
      }
    }
  });

  export default store;