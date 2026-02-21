"use client";

import { SubmitEvent, useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import Title from "@/components/common/Title";
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
import { Alert, AlertTitle } from "@/components/ui/Alert";
import PageContainer from "@/components/common/PageContainer";
import { Label } from "@/components/ui/Label";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const { handleLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
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
      await handleLogin(email, password);
      redirect(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Title>Login</Title>
      <Card className="mt-8">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 mt-5 mb-8">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
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
              <Label htmlFor="password">
                Password
              </Label>
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
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>

          <CardFooter className="mt-3">
            <Button 
              type="button" 
              variant="outline" 
              disabled={loading} 
              className="w-full"
              onClick={() => redirect(`/register?from=${from}`)}
            >
              Register
            </Button>
          </CardFooter>
        </form>
      </Card>
    </PageContainer>
  );
};

export default LoginPage;
