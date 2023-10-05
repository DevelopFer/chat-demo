<template>
  <v-container fluid>
    <v-app-bar color="primary">
      
      <v-app-bar-title>{{userName}}</v-app-bar-title>
    </v-app-bar>
    <v-row>
      <v-col lg="2" class="d-none d-lg-flex .d-xl-none">
        <v-card class="d-flex" width="100%" flat>
          <v-row v-if=" ! activeUsers.length" justify="center" align="center">
            <div class="d-flex flex-column justify-center align-center">
              <v-avatar color="primary" size="90" >
                <v-icon size="x-large" style="font-size: 4rem;">mdi-account-group</v-icon>
              </v-avatar>
              <span class="subtitle py-2">It looks like nobody is online.</span>
            </div>
          </v-row>
          <v-list lines="two"  v-else>
            <v-list-item
              v-for="(user, index) in activeUsers"
              :key="index"
              @click="setConversation(user)">
              <template v-slot:prepend>
                <v-avatar>
                  <v-img :src="user.prependAvatar"></v-img>
                </v-avatar>
              </template>
              <template v-slot:title>
                {{ user.title }}
              </template>
              <template v-slot:subtitle>
                <div v-html="user.subtitle"></div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col lg="10" xs="12">
        <v-card v-if=" ! hasConversationSelected " height="100vh" class="d-flex">
          <v-row justify="center" align="center">
            <div class="d-flex flex-column justify-center align-center">
              <v-avatar color="primary" size="90" >
                <v-icon size="x-large" style="font-size: 4rem;">mdi-forum</v-icon>
              </v-avatar>
              <span class="subtitle py-2">Here you'll find your messages.</span>
            </div>
          </v-row>
        </v-card>
        <div v-else>
          <v-list ref="messagesList" lines="one" max-height="80vh" style="margin-bottom: 20%;">
            <v-list-item
            v-for="(message,index) in conversationMessages"
              :id="'list-item-' + ( index + 1)"
              :key="index">
              <message-card :my-message="message.mymessage" :body="message.body"></message-card>
            </v-list-item>
          </v-list>
          <div id="list-bottom"></div>
        </div>
        <v-row>
          <v-col lg="12">
            <v-card v-if="hasConversationSelected" flat style="position: fixed;bottom: -1vh;" width="80%">
              <v-textarea color="secondary" v-model="message" density="compact" focused placeholder="Type your message here" variant="outlined" name="" id="" cols="200" rows="3">
                <template v-slot:append-inner>  
                  <v-btn :disabled="!message.length" color="success" @click="send" size="small" icon variant="flat" style="position: absolute; bottom: 10%;right: 1%;">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </template>
              </v-textarea>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">



import { ref, Ref, onMounted, computed } from 'vue'
import {useStore} from 'vuex';


import MessageCard from './MessageCard.vue';

import {io} from 'socket.io-client';
import { API } from '@/api/API';
import { formToJSON } from 'axios';

const store = useStore();

const socket = io("http://localhost:3010");







onMounted(async ()=>{
  
  await reportLogin();
  await loadUsers();
  await handleSocketEvents();

  

});


const handleSocketEvents = () => {
  
  
  socket.on("userLoggedIn",(payload) => {
    store.commit("handleUserStatus", payload);
  });


  socket.on("userLoggedOut",(payload) => {
    store.commit("handleUserStatus", payload);
  });

  socket.on("newMessage",(payload) => {
    store.dispatch("handleNewMessage", payload);
    scrollList();
  });


}


const setConversation = (item:{[key:string]:string}) => {

  store.dispatch("resolveConversation", item.uuid);
  scrollList();
}



const activeUsers = computed( () => {
  return store.state.users.filter( (user:{[key:string]:string}) => user.uuid !== sessionStorage.getItem('uuid') )
  .sort((a:{[key:string]:string}, b:{[key:string]:string}) => {
    const nameA = a.title.toUpperCase();
    const nameB = b.title.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
});


const loadUsers = async () => {
  try {
    const response = await API.get('/api/users');
    if( ! response.data.success ) throw new Error(response.data.error);
    const container:{[key:string]:string}[] = [];
    for(let user of response.data.users){
      container.push({
        uuid         : user.uuid,
        prependAvatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        title        : user.name,
        subtitle     : `<span class="text-${user.online ? 'success':'info'}">
          <strong>${user.online?'On Line':'Offline'}</strong>
        </span>`,
      });
    }
    store.commit('setUsers', container);
  } catch (error) {
    console.error(error);
  }
};


const reportLogin = () => {
  const uuid = sessionStorage.getItem("uuid");
  socket.emit("login",{uuid}, (error:any) => {
    if(error){
      console.error(error);
      return;
    }
  });
};



const message = ref("")


const resetMessage = () => {
  message.value = "";
};


const send = async () => {
  const newMessage:IMessage = {
    mymessage   : true,
    body        : message.value,
    author      : sessionStorage.getItem('uuid')!,
    conversation: store.state.conversation.uuid
  }
  await store.dispatch("sendMessage",newMessage);
  scrollList();
  await resetMessage();
}


const scrollList = () => {
  if( ! conversationMessages ) return;
  const totalMessages = conversationMessages.value.length;
  //document.getElementById("list-item-20").scrollIntoView()
  const element = document.getElementById(`list-item-${totalMessages}`);
  if( ! element ) return;
  element.scrollIntoView({behavior:"smooth",block:"end"});

}


const conversationMessages = computed(()=>{
  
  if( ! store.state.conversation ) return [];
  if( ! ( 'messages' in store.state.conversation ) ) return [];
  return store.state.conversation.messages;

})


const hasConversationSelected = computed( () => store.state.conversation);

const userName = computed(() => sessionStorage.getItem('username'));

</script>
<style>
html { overflow-y: hidden }
</style>