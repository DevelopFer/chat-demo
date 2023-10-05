<template>
  <v-container fluid>
    <v-app-bar color="primary">
      <v-btn icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
      <v-app-bar-title>Title</v-app-bar-title>
    </v-app-bar>
    <v-row>
      <v-col lg="2">
        <v-card absolute style="overflow-y: scroll;" max-height="90vh" flat min-height="100vh">
        <v-list lines="one">
          <v-list-item
            v-for="(user, index) in users"
            :key="index"
          >
          <v-card>
            {{ user.name }}
          </v-card>
        </v-list-item>
      </v-list>
      </v-card>
      </v-col>
      <v-col lg="10">
        <v-card   width="100%" flat fixed style="margin-bottom: 20%; max-height: 82vh;overflow-y: scroll;min-height: 92vh;">
        <v-list lines="one" style="padding-top: 10%;">
          <v-list-item
            v-for="(message, index) in messages"
            :key="index"
          >
          <message-card :my-message="message.mymessage" :body="message.body"></message-card>
        </v-list-item>
        </v-list>
      </v-card>
      <v-card variant="elevated" style="position: fixed;bottom: -1vh;width: 100%;">
        <v-card-text class="">
          <v-textarea column="10" class="flex-grow-1" rows="3" placeholder="Type your message..." density="compact" variant="outlined">
            <template v-slot:append-inner>  
              <v-btn size="medium" icon variant="flat" style="position: absolute; bottom: 10%;right: 1%;">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </template>
          </v-textarea>  
        </v-card-text>
      </v-card>
      </v-col>
    </v-row>
    
   
  </v-container>
    
  
</template>

<script setup lang="ts">
import { ref } from 'vue'

import MessageCard from './MessageCard.vue';
const messages = ref([
  {
    mymessage:true,
    body:"Irure cillum officia velit commodo aute esse occaecat et sit do."
  },
  {
    mymessage:true,
    body:"Irure cillum officia velit commodo aute esse occaecat et sit do."
  },
  {
    mymessage:false,
    body:"Est ad ex ipsum ipsum duis eu velit Lorem aliqua aliquip sint adipisicing laboris pariatur. Velit ullamco ut deserunt quis veniam nostrud culpa quis mollit veniam fugiat. Et laborum nulla nisi ut amet aliquip nostrud est eiusmod magna. Exercitation cillum occaecat esse laborum laborum enim dolore labore. Consequat quis mollit aliqua dolore enim pariatur minim dolor aliqua enim pariatur elit ipsum. Ea qui dolore et deserunt est adipisicing duis pariatur labore amet."
  },
  {
    mymessage:true,
    body:"Irure cillum officia velit commodo aute esse occaecat et sit do."
  },
  {
    mymessage:true,
    body:"Excepteur sunt sint cupidatat do ut nostrud adipisicing."
  },
  {
    mymessage:false,
    body:"Ex aliquip ea tempor qui quis occaecat sint reprehenderit aliqua non ut ipsum voluptate consequat."
  },
  {
    mymessage:false,
    body:"Minim aute laboris ex non. Sit proident officia nisi mollit id nulla duis esse ullamco. Proident non sit amet sunt eiusmod commodo. Dolore laborum ex elit aliquip fugiat ullamco elit. Exercitation aute amet consectetur qui amet adipisicing officia veniam dolore duis non ad sunt excepteur. Laboris excepteur adipisicing culpa id sint eu amet ex sit cupidatat do velit. Nisi cillum in pariatur adipisicing qui Lorem exercitation id adipisicing dolore irure nulla est proident."
  },
  {
    mymessage:true,
    body:"Enim mollit sint labore elit cillum labore ea voluptate do proident aute elit deserunt. Dolor nulla minim culpa aliquip. Non minim magna aute in exercitation reprehenderit duis proident nisi do fugiat aute. Quis nostrud anim pariatur pariatur minim labore ut commodo consectetur cupidatat incididunt est aute tempor."
  },
]);

const users = ref([
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },
  {
    avatar:"https://i.pravatar.cc/150?img=3",
    name:"demo demo"
  },

]);
  //
</script>
