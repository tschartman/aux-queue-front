const routes = [
  {
    path: "/",
    component: () => import("layouts/AppBar.vue"),
    meta: { requiresAuth: true },
    children: [{ path: "", component: () => import("pages/queue/queue.vue") }]
  },
  {
    path: "/shareQueue",
    name: "shareQueue",
    component: () => import("layouts/AppBar.vue"),
    children: [
      { path: "", component: () => import("pages/queue/shareQueue.vue") }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("pages/auth/login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("pages/auth/register.vue")
  },
  {
    path: "/link",
    name: "link",
    meta: { requiresAuth: true },
    component: () => import("pages/auth/link.vue")
  },
  {
    path: "/playlists",
    name: "playlists",
    component: () => import("layouts/AppBar.vue"),
    children: [
      { path: "", component: () => import("pages/playlist/playlists.vue") }
    ]
  },
  {
    path: "/sharePlaylist",
    name: "sharePlaylist",
    component: () => import("layouts/AppBar.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/playlist/sharePlaylist.vue")
      }
    ]
  },
  {
    path: "/fuse",
    name: "fuse",
    meta: { requiresAuth: true },
    component: () => import("layouts/AppBar.vue"),
    children: [{ path: "", component: () => import("pages/playlist/fuse.vue") }]
  },
  {
    path: "/user",
    name: "user",
    meta: { requiresAuth: true },
    component: () => import("layouts/AppBar.vue"),
    children: [{ path: "", component: () => import("pages/user/user.vue") }]
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
