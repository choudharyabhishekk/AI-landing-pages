import React, { useContext, useState } from "react";
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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

function LoginDialog({ openDialog, closeDialog }) {
  const { setUserDetail } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const createUser = useMutation(api.users.CreateUser);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("[LoginDialog] Starting Google login process");

        const { data: user } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        console.log("[LoginDialog] Google user data received:", {
          name: user.name,
          email: user.email,
        });

        const convexUser = await createUser({
          name: user.name,
          email: user.email,
          picture: user.picture,
          uid: user.sub,
        });

        console.log("[LoginDialog] Convex createUser response:", convexUser);

        if (!convexUser) {
          throw new Error("Failed to create/update user in database");
        }

        const userToStore = {
          name: user.name,
          email: user.email,
          picture: user.picture,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userToStore));
          console.log("[LoginDialog] User data stored in localStorage");
        }

        setUserDetail(userToStore);
        closeDialog(false);
        console.log("[LoginDialog] Login process completed successfully");
      } catch (error) {
        console.error("[LoginDialog] Error during login process:", error);
        setError(
          error.message || "Failed to complete login process. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("[LoginDialog] Google login failed:", error);
      setError("Google login failed. Please try again.");
      setIsLoading(false);
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl text-center">
            Login
          </DialogTitle>
        </DialogHeader>

        {/* Removed DialogDescription wrapper and restructured content */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Login to use Landing Pages
          </p>

          <div className="mt-4 space-y-4">
            {error && (
              <p className="text-red-500 text-sm break-words max-w-[300px] mx-auto">
                {error}
              </p>
            )}

            <Button
              onClick={() => {
                console.log("[LoginDialog] Login button clicked");
                handleGoogleLogin();
              }}
              disabled={isLoading}
              className="w-full max-w-sm mx-auto flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In with Google"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginDialog;
