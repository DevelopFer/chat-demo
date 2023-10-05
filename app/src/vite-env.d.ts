/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}



interface IUser {
  username:string,
  uuid:string
}

interface IMessage {
  mymessage:boolean,
  body:string,
  author:string,
  conversation:string
}