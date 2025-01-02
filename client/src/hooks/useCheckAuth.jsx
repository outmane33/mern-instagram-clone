import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const useCheckAuth = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/v1/user/checkauth",
          {
            withCredentials: true,
          }
        );
        if (res.data.status === "success") {
          dispatch(setAuthUser(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkAuth();
  }, []);
};

export default useCheckAuth;
