
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/userStore'

const httpInstance = axios.create({
  baseURL: '/api',
  timeout: 20000
})




httpInstance.interceptors.request.use(config => {

  const userStore = useUserStore()

  const token = userStore.userInfo.token
  console.log(token)
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
}, e => Promise.reject(e))


httpInstance.interceptors.response.use(
  (response) => {

    const res = response.status
    console.log(res);

    if (res === 200) {
      return Promise.resolve(response);
    }
  },
  (error) => {
    console.log(error);

    if (error.response.status) {
               
            switch (error.response.status) {
                          
                case 401:                    
                    router.replace({
                           
                        path: '/login',                        
                        query: {
    
                            redirect: router.currentRoute.fullPath 
                        }
                    });
                    break;
            
            case 403:
                ElMessage('登录过期，请重新登录')
                
                localStorage.removeItem('token');
               
                setTimeout(() => {
                           
                    router.replace({
                               
                        path: '/login',                            
                        query: {
    
                            redirect: router.currentRoute.fullPath 
                        }                        
                    });                    
                }, 1000);                    
                break; 

         
            case 404:
                ElMessage('网络请求不存在')
               
                break;
           
            default:
                ElMessage('error.response.data.message')
            
        }
        return Promise.reject(error.response);
    }
  }
);


export default httpInstance