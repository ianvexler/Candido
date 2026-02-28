"use client";

import { SubmitEvent, useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/Label";
import Logo from "@/lib/images/MainLogo.png";
import Image from "next/image";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const { handleRegister, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") ?? "/";

  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      redirect(from);
    }
  }, [isAuthenticated, from]);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await handleRegister(email, password, name);
      setRegistered(true);
      toast.success("Check your email to verify your account");
    } catch (err) {
      const message =
        err instanceof AxiosError && err.response?.data?.error
          ? (err.response.data.error as string)
          : err instanceof Error
            ? err.message
            : "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Get started</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create an account to track your job applications</p>
      </div>

      <Card className="max-w-md w-full pt-0 shadow-lg border-border/80">
        <form onSubmit={onSubmit}>
          <CardHeader className="bg-candido-black p-6 rounded-t-xl flex flex-col items-center justify-center gap-2">
            <Image src={Logo} alt="Candido" height={44} className="rounded" />
          </CardHeader>

          <CardContent className="space-y-4 mt-6 mb-6 px-6">
            <div className="mb-5">
              <CardTitle className="text-lg">
                {registered ? "Check your email" : "Create an account"}
              </CardTitle>

              <CardDescription className="mt-1">
                {registered
                  ? "We sent a verification link to your email. Click the link to verify your account, then sign in."
                  : "Enter your details to get started"}
              </CardDescription>
            </div>

            {!registered && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 pb-6 mt-8">
            {!registered ? (
              <>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating account..." : "Create account"}
                </Button>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="w-full"
                  onClick={() => redirect(`/login?from=${from}`)}
                >
                  Sign in
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={() => redirect(`/login?from=${from}`)}
              >
                Go to sign in
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
