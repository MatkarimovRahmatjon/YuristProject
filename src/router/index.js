import {createRouter, createWebHistory} from "vue-router";
import {isAuthenticated, getRoleFromToken} from "@/auth/auth";

const routes = [
    {
        path: "/edit/:id",
        name: "editFile",
        component: () => import("@/components/file/fileEditor.vue"),
        meta: {requiresAuth: true, allowedRoles: ["admin"]},
    },
    {path: "/", name: "home", component: () => import("@/views/Home.vue")},
    {path: "/login", name: "login", component: () => import("@/components/login.vue")},
    {path: "/path/:id", name: "pathId", component: () => import("@/components/path/path.vue")},
    {path: "/service/:id", name: "service", component: () => import("@/components/file/file.vue")},
    {path: "/offering", name: "offer", component: () => import("@/components/offering/OfferingAdmin.vue")},
    {path: "/appeals", name: "appeals", component: () => import("@/components/appeal/appealAdmin.vue")},
    {
        path: "/aplications/:id",
        name: "aplications",
        component: () => import("@/components/aplications/aplications.vue")
    },
    {
        path: "/admin", component: () => import("@/components/Templates/AdminTemplate.vue"),
        children: [
            {path: "", component: () => import("@/components/main/admin.vue")},
            {path: "/appeal", component: () => import("@/components/appeal/appealAdmin.vue")},
            {path: "/partners", component: () => import("@/components/sponsor/CardAdmin.vue")},
            {path: "/admins", component: () => import("@/components/BigAdminCreate.vue")},
            {path: "/yurists", component: () => import("@/components/BigAdminCreate.vue")},
            {path: "/operators", component: () => import("@/components/BigAdminCreate.vue")},
            {path: "/profile/:id", component: () => import("@/components/ProfilePage/Profile.vue")},
            {path: "/ServiceAdmin/:id", component: () => import("@/components/admin/ServiceAdmin.vue")},
            {path: "/aplicationsAdmin/:id", component: () => import("@/components/aplications/aplicationsAdmin.vue")},
            {path: "/AdminPath/:id", component: ()=> import("@/components/path/adminPath.vue")}
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (!isAuthenticated()) {
            next({name: "login"});
        } else {
            const userRole = getRoleFromToken();
            if (to.meta.allowedRoles?.length && !to.meta.allowedRoles.includes(userRole)) {
                next({name: "home"});
            } else {
                next();
            }
        }
    } else {
        next();
    }
});

export default router;
