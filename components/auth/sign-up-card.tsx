import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
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
import { Separator } from "../ui/separator";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

interface SignUpCardProps {
  setAuth: (value: signInFlow) => void;
}

export const SignUpCard: React.FC<SignUpCardProps> = ({ setAuth }) => {
  const { signIn } = useAuthActions();

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleProviders = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  const onPasswordCredentials = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);
    signIn("password", {
      name: `${state.firstName} ${state.lastName}`,
      email: state.email,
      password: state.password,
      flow: "signUp",
    })
      .catch(() => {
        setError("Something went wrong. Please try again later");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle> Sign up to continue</CardTitle>
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
          <div className="flex items-center justify-center gap-2">
            <Input
              value={state.firstName}
              disabled={pending}
              placeholder="First Name"
              type="text"
              autoComplete="off"
              className="w-full"
              onChange={(e) =>
                setState({ ...state, firstName: e.target.value })
              }
              required
            />
            <Input
              value={state.lastName}
              disabled={pending}
              placeholder="Last Name"
              type="text"
              autoComplete="off"
              className="w-full"
              onChange={(e) => setState({ ...state, lastName: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col relative">
            <Input
              value={state.email}
              disabled={pending}
              placeholder="Email"
              type="email"
              autoComplete="off"
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

          <div className="flex flex-col relative">
            <Input
              value={state.confirmPassword}
              disabled={pending}
              placeholder="Confirm Password"
              type={`${visibleConfirm ? "text" : "password"}`}
              className="w-full"
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
