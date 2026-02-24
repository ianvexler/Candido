"use client";

// import PageContainer from "@/components/common/PageContainer";
// import Title from "@/components/common/Title";
// import useAuthStore from "@/lib/stores/authStore";
import { redirect } from "next/navigation";

const HomePage = () => {
  redirect("/board");
  return null;
};

// const HomePage = () => {
//   const user = useAuthStore((state) => state.user);

//   return (
//     <PageContainer>
//       <Title>Welcome</Title>
//       {user && (
//         <p className="mt-4 text-muted-foreground">Welcome back, {user.name ?? user.email}</p>
//       )}
//     </PageContainer>
//   );
// };

export default HomePage;
