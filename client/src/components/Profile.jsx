import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AtSign,
  Heart,
  MessageCircle,
  Grid,
  Bookmark,
  Film,
  Tag,
} from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  const { getUserProfile, userProfile } = useUserStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      await getUserProfile(userId);
      setIsLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const tabs = [
    { id: "posts", label: "POSTS", icon: <Grid className="w-4 h-4" /> },
    { id: "saved", label: "SAVED", icon: <Bookmark className="w-4 h-4" /> },
    { id: "reels", label: "REELS", icon: <Film className="w-4 h-4" /> },
    { id: "tags", label: "TAGS", icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full transition-all duration-300 ease-in-out">
      {/* Added proper padding for all screen sizes */}
      <div className="pl-4 md:pl-[16%] lg:pl-[16%] w-full">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 py-6 md:py-8 transition-all duration-300">
            {/* Avatar Section */}
            <div className="flex justify-center md:justify-start md:w-1/3">
              <Avatar className="h-20 w-20 md:h-32 md:w-32 transition-all duration-300">
                <AvatarImage
                  src={userProfile?.profilePicture}
                  alt="profilephoto"
                  className="transition-opacity duration-300"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 space-y-4 transition-all duration-300">
              {/* Username and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-xl font-medium">
                  {userProfile?.username}
                </span>
                <div className="flex flex-wrap gap-2 transition-all duration-300">
                  {isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit">
                        <Button
                          variant="secondary"
                          className="h-8 text-sm transition-colors duration-200 hover:bg-gray-200"
                        >
                          Edit profile
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        className="h-8 text-sm transition-colors duration-200 hover:bg-gray-200"
                      >
                        View archive
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-8 text-sm transition-colors duration-200 hover:bg-gray-200"
                      >
                        Ad tools
                      </Button>
                    </>
                  ) : isFollowing ? (
                    <>
                      <Button
                        variant="secondary"
                        className="h-8 text-sm transition-colors duration-200 hover:bg-gray-200"
                      >
                        Unfollow
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-8 text-sm transition-colors duration-200 hover:bg-gray-200"
                      >
                        Message
                      </Button>
                    </>
                  ) : (
                    <Button className="h-8 text-sm bg-[#0095F6] hover:bg-[#3192d2] transition-colors duration-200">
                      Follow
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm">
                <p className="transition-all duration-200 hover:opacity-80">
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p className="transition-all duration-200 hover:opacity-80">
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p className="transition-all duration-200 hover:opacity-80">
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge
                  className="w-fit transition-all duration-200 hover:bg-gray-200"
                  variant="secondary"
                >
                  <AtSign className="w-3 h-3" />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span>🤯Learn code with patel mernstack style</span>
                <span>🤯Turing code into fun</span>
                <span>🤯DM for collaboration</span>
              </div>
            </div>
          </div>

          {/* Tabs and Posts */}
          <div className="border-t border-gray-200 mt-8">
            {/* Tabs */}
            <div className="flex items-center justify-around md:justify-center md:gap-16 text-xs sm:text-sm border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 py-3 px-1 transition-all duration-200 hover:bg-gray-50 
                    ${
                      activeTab === tab.id
                        ? "font-bold border-t border-black"
                        : ""
                    }`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className="md:hidden">{tab.icon}</span>
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4 mt-4">
              {displayedPost?.map((post) => (
                <div
                  key={post?._id}
                  className="relative group cursor-pointer aspect-square overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt="postimage"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center text-white space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <button className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm">{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200">
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm">{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
