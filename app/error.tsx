"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <Image src={"/error.png"} height={300} width={300} alt="Error" />

      <h2 className="max-w-2xl text-sm md:text-lg font-normal text-center px-4">
        Sorry, we had some technical problems during your last last operation.
        Please go back to the home page and let's start over.
      </h2>
      <Button asChild>
        <Link href={"/"}>Go back</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
