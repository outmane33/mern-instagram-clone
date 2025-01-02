import React from "react";
import Post from "./Post";
import { usePostStore } from "../store/usePostStore";

export default function Posts() {
  const { posts } = usePostStore();
  return (
    <div className="">
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
