"use client";

import Title from "@/components/common/Title";
import useAuthStore from "@/lib/stores/authStore";

const HomePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Title>Welcome</Title>
      {user && (
        <p className="mt-4 text-muted-foreground">Welcome back, {user.name ?? user.email}</p>
      )}
    </div>
  );
};

export default HomePage;
