import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated, getRoleFromToken } from "@/auth/auth";

const routes = [
  { path: "/", name: "home", component: () => import("@/views/Home.vue") },
  { path: "/login", name: "login", component: () => import("@/components/login.vue") },
  { path: "/path/:id", name: "pathId", component: () => import("@/components/path/path.vue") },
  { path: "/service/:id", name: "service", component: () => import("@/components/file/file.vue") },
  { path: "/offering", name: "offer", component: () => import("@/components/offering/OfferingAdmin.vue") },
  {
    path: "/AdminPath/:id",
    name: "adminPath",
    component: () => import("@/components/path/adminPath.vue"),
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  { path: "/aplications/:id", name: "aplications", component: () => import("../components/aplications/aplications.vue") },
  {
    path: "/aplicationsAdmin/:id",
    name: "aplicationsAdmin",
    component: () => import("../components/aplications/aplicationsAdmin.vue"),
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  {
    path: "/edit/:id",
    name: "editFile",
    component: () => import("@/components/file/fileEditor.vue"),
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  {
    path: "/admin/:id",
    name: "admin",
    component: () => import("@/views/admin.vue"),
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  {
    path: "/ServiceAdmin/:id",
    name: "serviceAdmin",
    component: () => import("@/components/admin/ServiceAdmin.vue"),
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  {
    path: "/bigadmin",
    name: "bigadmin",
    component: () => import("@/views/bigadmin.vue"),
    meta: { requiresAuth: true, allowedRoles: ["bigAdmin"] },
  },
  {
    path: "/bigAdminCreate",
    name: "bigAdminCreate",
    component: () => import("@/components/BigAdminCreate.vue"),
    meta: { requiresAuth: true, allowedRoles: ["bigAdmin"] },
  },
];

const router = createRouter({
  history: createWebHistory("/"), // BASE_URL noto‘g‘ri bo‘lsa, "/" qo‘yish
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      return next({ name: "login" }); // Login sahifasiga yo'naltirish
    }

    const userRole = getRoleFromToken();

    // Foydalanuvchining roli allowedRoles ichida bormi?
    if (to.meta.allowedRoles?.length && !to.meta.allowedRoles.includes(userRole)) {
      return next({ name: "home" }); // Home sahifasiga qaytarish
    }
  }

  next(); // Davom etish
});

export default router;
