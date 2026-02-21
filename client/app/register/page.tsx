"use client";

import Title from "@/components/common/Title";
import { Alert, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { redirect, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SubmitEvent, useEffect, useState } from "react";
import Link from "@/components/common/Link";
import { AxiosError } from "axios";

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const { handleRegister, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") ?? "/";

  useEffect(() => {
    if (isAuthenticated) {
      redirect(from);
    }
  }, [isAuthenticated, from]);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await handleRegister(email, password, name);
      redirect(from);

    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error ?? "Login failed");
        return;
      }

      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16 mt-20">
    <Title>Create an account</Title>
    <Card className="mt-8">
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 mt-5 mb-8">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
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
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>

        <div className="mt-2 text-center">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </form>
    </Card>
  </div>
  );
};

export default RegisterPage;