const routes = [
  {
    path: "/",
    component: () => import("layouts/AppBar.vue"),
    meta: { requiresAuth: true },
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("components/login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("components/register.vue")
  },
  {
    path: "/link",
    name: "link",
    component: () => import("components/link.vue")
  },
  {
    path: "/share",
    name: "share",
    component: () => import("layouts/AppBar.vue"),
    meta: { requiresAuth: true },
    children: [{ path: "", component: () => import("components/share.vue") }]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
