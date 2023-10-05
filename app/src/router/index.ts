import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from "@/components/HelloWorld.vue"
import Login from "@/components/Login.vue";
import PageNotFound from "@/components/PageNotFound.vue";


const sessionKey = "username";
const uuidKey = "username";


const hasUsername = () => sessionStorage.getItem(sessionKey) && sessionStorage.getItem(uuidKey);

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        component: Login,
      },
      {
        path: '/chat',
        component: () => import('@/components/HelloWorld.vue'),
        beforeEnter: (to, from, next) => {
            if( ! hasUsername() ) next("/");
            else next();
          },
      },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound }
    //   {
    //     path: '/contact',
    //     component: () => import('@/views/Contact.vue'),
    //   },
    ],
  });





  export { router };
  