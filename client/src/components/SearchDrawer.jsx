import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import moment from "moment";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

export default function SearchDrawer({ isOpen, onClose }) {
  const { searchUsers, searchForUsers } = useUserStore();

  const handleSearch = (e) => {
    searchForUsers(e.target.value);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-full sm:w-96 bg-white z-[9] shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed pl-20 top-0 left-0 h-screen w-full sm:w-96 bg-white z-[10] shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex flex-col justify-start gap-6 items-center w-full">
            <h2 className="text-xl font-semibold text-left self-start">
              Recherche
            </h2>
            <div className="relative py-4 w-full flex items-center">
              <Search className="absolute left-2 top-4.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Rechercher"
                className="pl-10 py-4 w-full"
                onChange={handleSearch}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)] p-4">
          {searchUsers?.length > 0 ? (
            searchUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between my-5 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${user?._id}`}>
                    <Avatar>
                      <AvatarImage
                        src={user?.profilePicture}
                        alt="post_image"
                      />
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
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 font-medium">
                Aucune recherche récente
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
