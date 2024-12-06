import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import CheckIn from "@/components/CheckIn.vue";
import CheckInForm from "@/components/CheckInForm.vue";
import CheckInHistory from "@/components/CheckInHistory.vue";

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
  {
    path: "/checkin",
    name: "CheckInForm",
    component: CheckInForm,
  },
  {
    path: "/checkin/history",
    name: "CheckInHistory",
    component: CheckInHistory,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
