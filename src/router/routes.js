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
    meta: { requiresAuth: true },
    component: () => import("components/link.vue")
  },
  {
    path: "/playlists",
    name: "playlists",
    component: () => import("layouts/AppBar.vue"),
    children: [
      { path: "", component: () => import("components/playlists.vue") }
    ]
  },
  {
    path: "/share",
    name: "share",
    component: () => import("layouts/AppBar.vue"),
    children: [{ path: "", component: () => import("components/share.vue") }]
  },
  {
    path: "/fuse",
    name: "fuse",
    meta: { requiresAuth: true },
    component: () => import("layouts/AppBar.vue"),
    children: [{ path: "", component: () => import("components/fuse.vue") }]
  },
  {
    path: "/user",
    name: "user",
    meta: { requiresAuth: true },
    component: () => import("layouts/AppBar.vue"),
    children: [{ path: "", component: () => import("components/user.vue") }]
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
