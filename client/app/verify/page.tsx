"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Logo from "@/lib/images/MainLogo.png";
import Image from "next/image";
import apiClient from "@/api/apiClient";

type VerifyResponse = { user: { id: number }; message: string };

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => {
        setStatus("error");
        setMessage("Invalid verification link");
      });
      return;
    }

    apiClient
      .get<VerifyResponse>("/api/sessions/verify", { params: { token } })
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified. You can now sign in.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.error ?? "Verification failed");
      });
  }, [token]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-muted/50 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Email verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {status === "loading" && "Verifying your email..."}
          {status === "success" && "You're all set!"}
          {status === "error" && "Something went wrong"}
        </p>
      </div>

      <Card className="max-w-md w-full pt-0 shadow-lg border-border/80">
        <CardHeader className="bg-candido-black p-6 rounded-t-xl flex flex-col items-center justify-center gap-2">
          <Image src={Logo} alt="Candido" height={44} className="rounded" />
        </CardHeader>

        <CardContent className="mt-6 mb-6 px-6">
          <CardTitle className="text-lg text-center">
            {status === "loading" && "Please wait"}
            {status === "success" && "Verified successfully"}
            {status === "error" && "Verification failed"}
          </CardTitle>
          <CardDescription className="mt-1">{message}</CardDescription>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-6 pb-6">
          {(status === "success" || status === "error") && (
            <Button className="w-full" onClick={() => router.push("/login")}>
              Sign in
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyPage;
