"use client";
import getUsers from "@/api/resources/users/getUsers";
import Description from "@/components/common/Description";
import NotAuthorized from "@/components/common/NotAuthorized";
import PageContainer from "@/components/common/PageContainer";
import Title from "@/components/common/Title";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/lib/types";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((response) => {
      try {
        console.log(response.users);
        setUsers(response.users);
      } catch (error) {
        console.error(error);
        toast.error("Failed to get users");
        setUsers([]);
      } 
    });
  }, []);

  if (!isAdmin) {
    return <NotAuthorized />;
  }

  return (
    <PageContainer>
      <Title>Admin</Title>
      <Description>Manage the users and their permissions</Description>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Admin</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.lastLoginAt ? format(user.lastLoginAt, "MM/dd/yyyy HH:mm") : "-"}
              </TableCell>
              <TableCell>
                {user.admin ? "Yes" : "No"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageContainer>
  );
};

export default AdminPage;