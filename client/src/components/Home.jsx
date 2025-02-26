import React, { useEffect } from "react";
import Feed from "./Feed";
import { Outlet, useLocation } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import { usePostStore } from "../store/usePostStore";
import { useUserStore } from "../store/useUserStore";
import { useNotificationStore } from "../store/useNotificationStore";
export default function Home() {
  const location = useLocation();
  const { getAllPosts } = usePostStore();
  const { getSuggestedUsers } = useUserStore();
  const {
    getNotifications,
    subscribeToNotifications,
    unsubscribeFromMessages,
  } = useNotificationStore();
  useEffect(() => {
    getAllPosts();
    getSuggestedUsers();
  }, [location]);

  useEffect(() => {
    getNotifications();
    subscribeToNotifications();
    return () => unsubscribeFromMessages();
  }, [getNotifications, subscribeToNotifications, unsubscribeFromMessages]);

  return (
    <div className="flex gap-4">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
}
