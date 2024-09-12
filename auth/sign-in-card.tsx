import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signInFlow } from "./types";

import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

interface SignInCardProps {
  setAuth: (value: signInFlow) => void;
}

export const SignInCard: React.FC<SignInCardProps> = ({ setAuth }) => {
  const { signIn } = useAuthActions();

  const [state, setState] = useState({ email: "", password: "" });
  const [visible, setVisible] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleProviders = (value: "google" | "github") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  const onPasswordCredentials = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    signIn("password", {
      email: state.email,
      password: state.password,
      flow: "signIn",
    })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle> Log in to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      {!!error && (
        <div className="flex items-center bg-destructive/15 p-3 rounded-md gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordCredentials}>
          <div className="flex flex-col relative">
            <Input
              value={state.email}
              disabled={pending}
              placeholder="Email"
              type="email"
              className="w-full"
              onChange={(e) => setState({ ...state, email: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col relative">
            <Input
              value={state.password}
              disabled={pending}
              placeholder="Password"
              type={`${visible ? "text" : "password"}`}
              className="w-full"
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

          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={pending}
          >
            Conitnue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            disabled={pending}
            onClick={() => void handleProviders("google")}
            variant={"outline"}
            size={"lg"}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>

          <Button
            className="w-full relative"
            disabled={pending}
            onClick={() => void handleProviders("github")}
            variant={"outline"}
            size={"lg"}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Button
            variant={"link"}
            size={"sm"}
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setAuth("signUp")}
          >
            Sign up
          </Button>
        </p>
      </CardContent>
    </Card>
  );
};
