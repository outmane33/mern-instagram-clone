import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";

export default function SuggestedUsers() {
  const { suggestedUsers } = useUserStore();
  const { user: authUser, followUnfollowUser } = useAuthStore();
  const handleFollow = (id) => {
    followUnfollowUser(id);
  };
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm gap-2">
        <h1 className="font-semibold text-gray-600 whitespace-nowrap">
          Suggested for you
        </h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers?.map((user) => {
        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm whitespace-nowrap">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>

            {authUser?.following?.includes(user?._id) ? (
              <span
                className="text-gray-400 text-xs font-bold cursor-pointer hover:text-[#3495d6]"
                onClick={() => handleFollow(user?._id)}
              >
                Follow
              </span>
            ) : (
              <span
                className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]"
                onClick={() => handleFollow(user?._id)}
              >
                Follow
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
