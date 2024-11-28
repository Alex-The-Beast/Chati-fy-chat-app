import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import {useAuthStore }from "../store/useAuthStore"

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } =
    useChatStore();
  const {onlineUsers } =useAuthStore()

  const [shownOnlineOnly,setShowOnlineOnly] =useState(false)

  useEffect(() => {
    getUsers();
   
  },[getUsers]);

  const filteredUsers=shownOnlineOnly?users.filter(user=>onlineUsers.includes(user._id)) :users;
  if(isUserLoading) return <SidebarSkeleton/>


  
  return(
    <aside className="h-full bg-base-100 w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="font-medium hidden lg:block"/>
          <h2 className="text-sm md:text-md">Contacts</h2>
        </div>

        {/* Todo:online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label 
          className="cursor-pointer flex items-center gap-2"
           >
            <input 
            type="checkbox" 
            checked={shownOnlineOnly}
            onChange={(e)=>setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm" 
            />
            <span className="text-sm ">Show online only</span>
            
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length-1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2">
        {filteredUsers.map((user)=>(
          <button 
          key={user._id}
          onClick={()=>setSelectedUser(user)}
          className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id===user._id?"bg-base-300 ring-1 ring-base-300":""} `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img 
              src={user.profilePic || "/avatar.png"} 
              alt={user.name}
              className="size-12 object-cover rounded-full"
              />

              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"/>
              )}
            </div>

            {/* user info -visible only on largeer screens */}
            <div className="hidden lg:block text-left mon-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id)?"Online":"Offline"}
                 </div>
            </div>

          </button>
        ))}

        {filteredUsers.length===0 &&(
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>

    </aside>
  )
};

export default Sidebar;