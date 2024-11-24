import { createRouter, createWebHistory } from 'vue-router'
import TheMainView from "../views/TheMainView.vue";
import TheMakingView from "../views/TheMakingView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'trip',
      component: TheMainView,
      children:[
        {
          path:"search",
          name:"trip-search",
          component: () => import("@/components/trip/TripSearch.vue"),
        }
        ,{
          path:"plan",
          name:"trip-plan",
          component: () => import("@/components/trip/TripPlan.vue"),
        }
        ,{
          path:"info",
          name:"trip-info",
          component: () => import("@/components/trip/TripSearch.vue"),
        }
        ,{
          path:"newplan",
          name:"trip-newplan",
          component: () => import("@/components/trip/TripNewPlan.vue"),
        }
      ]
    },
    {
      path: "/notices",
      name: "notices",
      // component: TheBoardView,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/TheNoticesView.vue"),
      redirect: { name: "trip-notices" },
      children: [
        {
          path: "list",
          name: "trip-notices",
          component: () => import("@/components/notices/TripNotices.vue"),
        },
        {
          path: "view/:noticesNo",
          name: "article-view",
          component: () => import("@/components/notices/TripNoticesDetail.vue"),
        },
        {
          path: "write",
          name: "article-write",
          component: () => import("@/components/notices/TripNoticesWrite.vue"),
        },
        {
          path: "modify/:noticesNo",
          name: "article-modify",
          component: () => import("@/components/notices/TripNoticesModify.vue"),
        },
      ],
    },
    {
      path: '/attraction/:contentId',
      name: 'attraction-detail',
      component:() => import("@/components/trip/AttractionDetail.vue"),
      props: true, // contentId를 props로 전달
    },
    {
      path:'/plan/making/:planId',
      name: 'plan-making',
      component:TheMakingView
    }
  ],
})

export default router
