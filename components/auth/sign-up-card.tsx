import React, { useState } from "react";
import { signInFlow } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

interface SignUpCardProps {
  setAuth: (value: signInFlow) => void;
}

export const SignUpCard: React.FC<SignUpCardProps> = ({ setAuth }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle> Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <div className="flex flex-col relative">
            <Input
              value={state.email}
              disabled={false}
              placeholder="Email"
              type="email"
              className=""
              onChange={(e) => setState({ ...state, email: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col relative">
            <Input
              value={state.password}
              disabled={false}
              placeholder="Password"
              type={`${visible ? "text" : "password"}`}
              className=""
              onChange={(e) => setState({ ...state, password: e.target.value })}
              required
            />

            {!visible ? (
              <LiaEyeSolid
                className="w-5 h-5 absolute right-3 top-[10px] cursor-pointer"
                onClick={() => setVisible(true)}
              />
            ) : (
              <LiaEyeSlashSolid
                className="w-5 h-5 absolute right-3 top-[10px] cursor-pointer"
                onClick={() => setVisible(false)}
              />
            )}
          </div>

          <div className="flex flex-col relative">
            <Input
              value={state.confirmPassword}
              disabled={false}
              placeholder="Confirm Password"
              type={`${visibleConfirm ? "text" : "password"}`}
              className=""
              onChange={(e) =>
                setState({ ...state, confirmPassword: e.target.value })
              }
              required
            />

            {!visibleConfirm ? (
              <LiaEyeSolid
                className="w-5 h-5 absolute right-3 top-[10px] cursor-pointer"
                onClick={() => setVisibleConfirm(true)}
              />
            ) : (
              <LiaEyeSlashSolid
                className="w-5 h-5 absolute right-3 top-[10px] cursor-pointer"
                onClick={() => setVisibleConfirm(false)}
              />
            )}
          </div>

          <Button type="submit" className="w-full" size={"lg"} disabled={false}>
            Conitnue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            disabled={false}
            onClick={() => {}}
            variant={"outline"}
            size={"lg"}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>

          <Button
            className="w-full relative"
            disabled={false}
            onClick={() => {}}
            variant={"outline"}
            size={"lg"}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant={"link"}
            size={"sm"}
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setAuth("signIn")}
          >
            Sign in
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};
