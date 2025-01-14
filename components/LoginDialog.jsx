import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { UserContext } from "@/context/UserContext";
import axios from "axios";

function LoginDialog({ openDialog, closeDialog }) {
  const { setUserDetail } = useContext(UserContext);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        setUserDetail(userInfo.data);
        closeDialog(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (errorResponse) => {
      console.error("Login failed:", errorResponse);
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <p className="font-bold text-3xl text-white text-center">Login</p>
            <div className="flex items-center flex-col justify-center gap-2">
              <p className="text-center py-2">Login to use Landing Pages</p>
              <Button onClick={() => handleGoogleLogin()}>
                Sign In with Google
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default LoginDialog;
