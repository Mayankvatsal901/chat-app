import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore"


export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,



    getUsers:async()=>{
        try {
            set({isUserLoading:true})
            const res=await axiosInstance.get("message/users");
            set({users:res.data})


            
        } catch (error)
         {
            toast.error(error.message.data.message)
            
        }finally{
            set({isUserLoading:false});
        }
    
    },

    getMessages:async(UserId)=>{
        set({isMessageLoading:true});
        try {
            const res=await axiosInstance.get(`/message/${UserId}`);
            set({messages:res.data});
            
        } catch (error) {
            toast.error(error.message.data.message)
            
        }finally{
            set({isMessageLoading:false})
        }

    },
      setSelectedUser:(selectedUser)=>set({selectedUser}),
      sentMessage:async(messagedata)=>{
        const{selectedUser,messages}=get()
        try {
            const res=await axiosInstance.post(`/message/send/${selectedUser._id}`,messagedata)
            set({messages:[...messages,res.data]})//...messages:res.data data in previous data ok

            
        } catch (error) {
            toast.error(error.response.data.message);
            
        }


      },
        subscribeMessages:()=>{
        const{selectedUser}=get()
        if(!selectedUser) return

        const socket=useAuthStore.getState().socket;


        //optimize this one later 


        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId!==selectedUser._id) return 
            set({
                messages:[...get().messages,newMessage]
            })


        })

    },
    unsubscribefromMessages:()=>{
        const socket=useAuthStore.getState().socket
        socket.off("newMessage")
    }

}))
