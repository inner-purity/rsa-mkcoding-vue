import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("../views/Main.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "/guide",
        name: "guide",
        component: () => import("../views/Guide.vue"),
        redirect: "/guide/sumary",
        children: [
          {
            path: "commonAlert",
            name: "commonAlert",
            component: () => import("../views/GuideText/CommonAlert.vue"),
          },
          {
            path: "commonFunction",
            name: "commonFunction",
            component: () => import("../views/GuideText/CommonFunction.vue"),
          },
          {
            path: "producterPlacement",
            name: "producterPlacement",
            component: () =>
              import("../views/GuideText/ProducterPlacement.vue"),
          },
          {
            path: "rsaIntro",
            name: "rsaIntro",
            component: () => import("../views/GuideText/RsaIntro.vue"),
          },
          {
            path: "sumary",
            name: "sumary",
            component: () => import("../views/GuideText/Sumary.vue"),
          },
          {
            path: "userFunction",
            name: "userFunction",
            component: () => import("../views/GuideText/UserFunction.vue"),
          },
          {
            path: "userLogin",
            name: "userLogin",
            component: () => import("../views/GuideText/UserLogin.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/productorplacement",
    name: "productorplacement",
    component: () => import("../views/ProductorPlacement.vue"),
    redirect: "/productorplacement/usermanage",
    children: [
      {
        path: "usermanage",
        name: "usermanage",
        component: () => import("../views/ProductorPlacement/UserManage.vue"),
      },
      {
        path: "productormanage",
        name: "productormanage",
        component: () => import("../views/ProductorPlacement/ProductorManage.vue"),
      },
      {
        path: "projectsocket",
        name: "projectsocket",
        component: () => import("../views/ProductorPlacement/ProjectSocket.vue"),
      },
      
      {
        path: "catchexception",
        name: "catchexception",
        component: () => import("../views/ProductorPlacement/CatchException.vue"),
      },
      {
        path: "ipstorage",
        name: "ipstorage",
        component: () => import("../views/ProductorPlacement/IPStorage.vue"),
      },
      {
        path: "ipmonitor",
        name: "ipmonitor",
        component: () => import("../views/ProductorPlacement/IPMonitor.vue"),
      },
      {
        path: "sendmessage",
        name: "sendmessage",
        component: () => import("../views/ProductorPlacement/SendMessage.vue"),
      },
      {
        path: "manageinvitekey",
        name: "manageinvitekey",
        component: () => import("../views/ProductorPlacement/ManageInviteKey.vue"),
      },
      {
        path: "chatroom",
        name: "chatroom",
        component: () => import("../views/ProductorPlacement/ChatRoom.vue"),
      },
    ],
  },
  {
    path: "/noAuthPage",
    name: "noauthpage",
    component: () => import("../views/errorPage/NoAuthPage.vue"),
  },
  {
    path: "/404page",
    name: "404page",
    component: () => import("../views/errorPage/404Page.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
