import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import CheckIn from "@/components/CheckIn.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/checkin",
  },
  {
    path: "/checkin",
    name: "CheckIn",
    component: CheckIn,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
