import { createRouter, createWebHistory } from "vue-router";
import Home from "../Views/Home/Home.vue";
import About from "../Views/About/About.vue";
import NotFound from "../components/NotFoundPage/NotFound.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
