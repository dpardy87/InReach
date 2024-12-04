import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import CheckIn from "@/components/CheckIn.vue";
import CheckInForm from "@/components/CheckInForm.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
