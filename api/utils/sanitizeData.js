exports.sanitizeUser = (user) => {
  data = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    gender: user.gender,
    followers: user.followers,
    following: user.following,
    posts: user.posts,
    bookmarks: user.bookmarks,
  };
  return data;
};
