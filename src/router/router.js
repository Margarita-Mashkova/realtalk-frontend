import * as VueRouter from 'vue-router'

import NProgress from 'nprogress'

import LoginPage from "@/pages/LoginPage";
import RegistrationPage from "@/pages/RegistrationPage";
import FeedPage from "@/pages/FeedPage";
import ProfilePage from "@/pages/ProfilePage";
import EditProfilePage from "@/pages/EditProfilePage";
import ChatsPage from "@/pages/ChatsPage";
import SubscriptionsPage from "@/pages/SubscriptionsPage";
import SubscribersPage from "@/pages/SubscribersPage";
import SearchPage from "@/pages/SearchPage";
import ChatCreatePage from "@/pages/ChatCreatePage";
import ChatEditPage from "@/pages/ChatEditPage";
import AddMembersPage from "@/pages/AddMembersPage";
import DeleteMembersPage from "@/pages/DeleteMembersPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ForbiddenPage from "@/pages/ForbiddenPage";
import ChatPage from "@/pages/ChatPage"; 


import RegistrationForm from "@/components/RegistrationForm";
import BirthdateCityForm from "@/components/BirthdateCityForm";
import PhotoForm from "@/components/PhotoForm";
import PersonalDataForm from "@/components/PersonalDataForm";
import LoginDataForm from "@/components/LoginDataForm";


const routes = [
    { path: '/auth', component: LoginPage, name:'login', alias:'/' },
    { path: '/registration', component: RegistrationPage, redirect: { path: "/registration/step-1" },
     children: [
        {
            path: 'step-1',
            component: RegistrationForm
        },
        {
            path: 'step-2',
            component: BirthdateCityForm
        },
        {
            path: 'step-3',
            component: PhotoForm
        },
    ] },
    { path: '/feed', component: FeedPage },
    { path: '/:login', component: ProfilePage },
    { path: '/edit-profile', component: EditProfilePage, redirect: { path: "/edit-profile/personal" },
     children: [
        {
            path: 'personal',
            component: PersonalDataForm,
            meta:{reload: true}
        },
        {
            path: 'login-data',
            component: LoginDataForm,
        },
       
    ] },
    { path: '/chats', component: ChatsPage },
    { path: '/chat-create', component: ChatCreatePage },
    { path: '/chat/:id/edit', component: ChatEditPage },
    { path: '/chat/:id/add-members', component: AddMembersPage },
    { path: '/chat/:id/delete-members', component: DeleteMembersPage },
    { path: '/chat/:id', component: ChatPage },
    { path: '/subscribers', component: SubscribersPage },
    { path: '/subscriptions', component: SubscriptionsPage },
    { path: '/search', component: SearchPage },
    { path: '/forbidden', component: ForbiddenPage, name:'forbidden' },
    { path: '/not-found', component: NotFoundPage, name: 'not-found' },
    { path: '/:pathMatch(.*)*', component: NotFoundPage, name: 'not-found' },
]



let router = new VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes 
})

router.beforeEach((to, from, next) => {
    NProgress.start()

    if (localStorage.getItem('jwt') == 'null') {
        if (to.path == '/auth' || to.path.startsWith('/registration')) {
            next()
        }
        else {
            router.push("/auth")
        }
    }
    else {
        next()
    }

})

router.afterEach((to) => {
    if (to.name == "not-found" || to.name == "forbidden" || to.name == 'login' || to.path.startsWith('/registration')) {
        NProgress.done(true)
    }
})

export default router