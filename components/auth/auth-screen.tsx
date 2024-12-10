"use client";

import React, { useState } from "react";
import { signInFlow } from "./types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export const AuthScreen = () => {
  const [auth, setAuth] = useState<signInFlow>("signIn");

  return (
    <div className="h-full flex justify-center items-center bg-[#5C3B58]">
      <div className="flex flex-col">
        <div className="md:h-auto md:w-[420px]">
          {auth === "signIn" ? (
            <SignInCard setAuth={setAuth} />
          ) : (
            <SignUpCard setAuth={setAuth} />
          )}
        </div>

        <p className="text-xs flex items-center justify-center w-full py-5 mt-auto text-white">
          Lightweight Slack clone made with ❤️ by Steven Audrey Daye 🇧🇯
        </p>
      </div>
    </div>
  );
};
