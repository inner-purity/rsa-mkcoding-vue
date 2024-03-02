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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
