import { Bell, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNotificationStore } from "../store/useNotificationStore";
import moment from "moment";
import { useAuthStore } from "../store/useAuthStore";

const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications } = useNotificationStore();
  const { user, followUnfollowUser } = useAuthStore();

  const handleFollow = (id) => {
    followUnfollowUser(id);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed top-0 left-0 h-screen w-full sm:w-96 bg-white z-[9] shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed pl-20 top-0 left-0 h-screen w-full sm:w-96 bg-white z-[10] shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="p-4 border-b hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={notification.relatedUser.profilePicture} />
                  <AvatarFallback>
                    {notification?.relatedUser?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">
                      {notification?.relatedUser?.username}
                    </p>
                    {user?.following?.includes(
                      notification?.relatedUser?._id
                    ) ? (
                      <button
                        className="px-2 py-1 text-sm text-white bg-gray-400 rounded-md font-semibold"
                        onClick={() =>
                          handleFollow(notification?.relatedUser?._id)
                        }
                      >
                        Suivi(e)
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 text-sm text-white bg-blue-400 rounded-md font-semibold"
                        onClick={() =>
                          handleFollow(notification?.relatedUser?._id)
                        }
                      >
                        Suivre
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {notification?.type === "comment" &&
                      "a commenté votre post"}
                    {notification?.type === "like" && "a aimé votre post"}
                    {notification?.type === "follow" && "commncé à vous suivre"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {moment(notification.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default function NotificationExample({ isOpen, setIsOpenNotification }) {
  return (
    <div className=" z-[-10]">
      <NotificationDrawer
        isOpen={isOpen}
        onClose={() => setIsOpenNotification(false)}
      />
    </div>
  );
}
