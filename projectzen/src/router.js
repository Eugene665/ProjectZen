import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/homeView.vue";
import Login from "./components/logForm.vue";
import Register from "./components/regForm.vue";
import Profile from "./views/profile.vue";
import Project_page from "./views/project_page.vue";
import ProjectView from "./views/projectView.vue";
import Company from "./views/companyView.vue";
import { ref, inject } from "vue";
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/project_page", component: Project_page },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/project/:id", component: ProjectView },
  { path: "/company/:id", component: Company },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = inject("isAuthenticated");
  const user = inject("user");
  if (to.path === "/profile" && !isAuthenticated.value) {
    next("/login");
  } else if (to.path === "/project_page" && user.value.type !== "company") {
    next("/");
  } else {
    next();
  }
});

export default router;
