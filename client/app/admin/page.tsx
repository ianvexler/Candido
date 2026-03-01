"use client";
import FeedbackTable from "@/components/admin/FeedbackTable";
import UsersTable from "@/components/admin/UsersTable";
import Description from "@/components/common/Description";
import NotAuthorized from "@/components/common/NotAuthorized";
import PageContainer from "@/components/common/PageContainer";
import Title from "@/components/common/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useAuth } from "@/contexts/AuthContext";

const AdminPage = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <NotAuthorized />;
  }

  return (
    <PageContainer>
      <Title>Admin</Title>
      <Description>Manage the users and their permissions</Description>

      <Tabs defaultValue="users" className="w-full mt-10">
        <TabsList>
          <TabsTrigger value="users" className="px-4">Users</TabsTrigger>
          <TabsTrigger value="feedback" className="px-4">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTable />
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackTable />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default AdminPage;