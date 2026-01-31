import {defineStore} from 'pinia'
import {ref, reactive} from 'vue'

export const selectExcelData = defineStore('selectdata',()=>{

   let selectdata = reactive([])
   let flagExport = ref(false)
   let title = ref("")
   let tabledata = reactive([])
   return {
      selectdata,flagExport,title,tabledata
   }
},{
   persist:true
})


export const selectForm = defineStore('form',()=>{

   let form = reactive({})
   return {
      form
   }
},{
   persist:true
})
