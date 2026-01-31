
import { defineStore } from 'pinia'
import { ref, h, getCurrentInstance, computed, reactive } from 'vue'

import { loginAPI, updatePassword, UpdateUser, UserDetailById } from '@/apis/sysUser'
import { ElMessageBox } from "element-plus";

import { useRouter } from 'vue-router';

const cns = getCurrentInstance()


export const useUserStore = defineStore('user', () => {

  const router = useRouter()
  const userInfo = ref({})
  let flagFirst = ref(true)
  function elmessage(imgsrc, titletext) {
    ElMessageBox({

      message: h('div', { style: { width: "200px", height: "200px" }}, [
        h('img', { style: {margin:"0 auto",display:"block",width:"100px" }, src: imgsrc }),
        h('h3', { style: { marginTop: "8px",textAlign:"center" } }, titletext),
      ]),
      showClose: false,
      customStyle: { width: "220px", height: "180px", borderRadius: "20px" },
      showConfirmButton: false,
      beforeClose: (action, instance, done) => {
        setTimeout(() => {
          done()
        }, 500)
      },
    })
    setTimeout(() => {
      ElMessageBox.close(false)
    }, 1000)
  }

  const getUserInfo = async (userName, password) => {
    const res = await loginAPI(userName, password)
    if (password === '123456') {
      flagFirst.value = true
    } else {
      flagFirst.value = false
    }
    console.log(res);
    if(res.data.status===401){
      elmessage("/src/assets/failure.png", res.data.message)
      return undefined
    } else if (res.data.status === 200 && flagFirst.value === true) {
      userInfo.value.token = res.data.data.token
      userInfo.value.user = res.data.data.user
      userInfo.value.user.avatar = res.data.data.user.avatar
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('userinfo', JSON.stringify(res.data.data.user));
      elmessage("/src/assets/success.png", "登录成功")
      router.replace("/Changepassword")
      return res.data.data.token
    } else if (res.data.status === 200 && flagFirst.value === false) {
      userInfo.value.token = res.data.data.token
      userInfo.value.user = res.data.data.user
      userInfo.value.user.avatar = res.data.data.user.avatar
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('userinfo', JSON.stringify(res.data.data.user));
      elmessage("/src/assets/success.png", "登录成功")
      router.replace("/index")
      return res.data.data.token
    }
    
  }

  const clearUserInfo = () => {
    userInfo.value.token = ''
    userInfo.value.user.nickName = '未登录'
    userInfo.value.user.role = ''
    userInfo.value.user.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  }

  const ResetPassword = async (userName) => {

    console.log(res);

    return res
  }

  const UpdatePasswordpass = async (password) => {
    let userName = userInfo.value.user.userName
    console.log(password);
    console.log(userName);
    const res = await updatePassword({ password, userName })
    console.log(res);
    return res
  }
  const updateUserProfile = async (form) => {
    console.log(form);
    let id = userInfo.value.user.userId
    console.log(userInfo.value);
    console.log(id);
    await UpdateUser(id, form).then((res) => {
      console.log(res);
      if (res.status == 200) {
        getUserDetailById()

      }
    })
  }
  const getUserDetailById = async () => {
    let id = userInfo.value.user.userId
    await UserDetailById(id).then((res) => {
      userInfo.value.user = res.data.data.user
      console.log(userInfo.value.user);
    })
  }
  const validatePassword = async (password) => {
    let userName = userInfo.value.user.userName
    const res = await loginAPI(userName, password)
    console.log(res.data);
    if (res.data.status === 200) {
      return true
    } else {
      return false
    }
  }

  return {
    validatePassword,
    updateUserProfile,
    getUserDetailById,
    flagFirst,
    userInfo,
    getUserInfo,
    clearUserInfo,
    UpdatePasswordpass,
    ResetPassword
  }
}, {
  persist: true,
})