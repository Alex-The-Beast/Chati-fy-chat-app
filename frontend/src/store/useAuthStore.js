import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import {toast} from "react-hot-toast"
import {io} from "socket.io-client"
const BASE_URL= import.meta.env.MODE==="developement"?"http://localhost:5001":"/"



export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdateProfile:false,

    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth:async()=>{
        try{

            const res= await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket()
        }catch(error){
            console.log("Error in checkAuth",error)
            set({authUser:null})
           
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async (data)=>{
        set({isSigningUp:true})
        try{
            const res=await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Accoount created seccessfully")
            get().connectSocket()

        }catch(error){

            toast.error(error.response.data.message)
        }
        finally{
            set({isSigningUp:false})
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true})
        try{
            const res=await axiosInstance.post("/auth/login",data)
            set({authuser:res.data})
            toast.success("Logged in successfully")

            get().connectSocket()

        }catch(error){
            toast.error(error.response.data.message)

        }
        finally{
            set({isLoggingIn:false})
        }
    },
   
    logout:async (data)=>{
        try{
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
            get().disconnectSocket()

        }catch(error){
            toast.error(error.response.data.message)

        }

    },

    updateProfile:async(data)=>{
        set({isUpdateProfile:true})
        try{
            const res =await axiosInstance.put("/auth/update-profile",data)
            toast.success("Profile Updated Successfully")


        }catch(error){
            console.log("Error in update profile:",error)
            toast.error(error.response.data.message)

        }
        finally{
            set({isUpdateProfile:false})
        }
    },

    connectSocket:async ()=>{
        const {authUser} =get()
        if(!authUser || get().socket?.connected) return 

        const socket =io(BASE_URL,{
            query:{
                userId:authUser._id,
            },
        })
        socket.connect()

        set({socket:socket})
        socket.on("getOnlineUsers" ,(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnectSocket:async()=>{
        if(get().socket?.connected) get().socket.disconnect()
    },



}))