import { createRouter, createWebHistory } from 'vue-router'
import TheMainView from "../views/TheMainView.vue";

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
          path:"benefits",
          name:"trip-benefits",
          component: () => import("@/components/trip/TripSearch.vue"),
        }
      ]
    }
  ],
})

export default router
