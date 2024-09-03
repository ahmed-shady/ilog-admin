import LoginResponse from "@app/types/loginResponse";
import User from "@app/types/user";
import {callApi} from "./axios";
import endPoints from "./Endpoints";
import UserRole from "@app/types/UserRole";
import { toast } from "react-toastify";
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const check = (loginResponse: LoginResponse) => {
          console.log(loginResponse);
          if(loginResponse?.user?.role !== UserRole.ADMIN && loginResponse?.user?.role !== UserRole.SUPER_ADMIN)
            throw {message: "You are not admin. You can't login"}
        }

        const response = await callApi(endPoints.login,{
          data: {email, password}
        }, check);

        if(!response.token){
          throw {reason: "no token not enabled"};
        }



        localStorage.setItem("token", response.token);

        localStorage.setItem("user", JSON.stringify(response.user))
        return response.user;
    } catch (error) {
      throw error;
    }
  };

  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }