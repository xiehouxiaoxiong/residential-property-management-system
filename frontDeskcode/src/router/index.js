import {createRouter,createWebHashHistory} from 'vue-router'
import {useUserStore} from '../store/userStore';


const routes = [
    {
            path:"/",
            name:'/',
            redirect:"/login",
            component:()=>import("../views/loginPage/login.vue")
     },
     {
            path:"/login",
            component:()=>import("../views/loginPage/login.vue"),
   
     },
     {
        path:"/index",
        name:'index',
        meta:{
            keepAlive:true
        },
        component:()=>import("../views/indexPage/index.vue"),
        children:[
            {
             path:"0",
             component:()=>import("../views/PersonalCenterPage/index.vue")
            },
            {
             path:"1",
             component:()=>import("../views/ProprietorManagePage/proprietorManage.vue")
            },
             {
             path:"2",
           
             component:()=>import("../views/EmployeeManagement/employeePage.vue")
            },
            {
             path:"3",
             component:()=>import("../views/AnnouncementManagement/AnnouncementManagement.vue")
            },
            
              {
             path:"4-0",
              component:()=>import("../views/VehicleManagement/ParkingInformation.vue")
            },
            {
             path:"4-1",
             component:()=>import("../views/VehicleManagement/VehicleInformation.vue")
            },
               {
             path:"4-2",
             component:()=>import("../views/VehicleManagement/ParkingApplication.vue")
            },
              
               {
             path:"5",
             component:()=>import("../views/RepairInfoManagement/repairInfoPage.vue")
            },
              
               {
             path:"6",
             component:()=>import("../views/ComplaintInfoManagement/ComplaintInfoPage.vue")
            },
               
               {
             path:"7",
             component:()=>import("../views/payManagement/payPage.vue")
            },

          {
            path: "8",
            component: () => import("../views/visitorInfoManagePage/visitorInfoManage.vue")
          },
            {
              path: "9",
              component: () => import("../views/AccountManagement/AccountManagement.vue")
            }

        ]
     },
     {
        path:"/Changepassword",
        component:()=>import("../views/loginPage/changepassword.vue")
    }
]
const router = createRouter({
    history:createWebHashHistory(),
    routes:routes
})
router.beforeEach(async(to,from,next)=>{
   
   const userInfoStore = useUserStore()
   let token = userInfoStore.userInfo.token
   console.log(token);
   if(to.path==='/login'){
          next()
      } 
   if(token){
    
       await next()
      
   }else{
       next('/login')
   }  
   
})  

    
export default router

