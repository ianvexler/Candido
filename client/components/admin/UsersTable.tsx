import getUsers from "@/api/resources/users/getUsers";
import { User } from "@/lib/types";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import Loader from "../common/Loader";

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((response) => {
      setLoading(true);
      setUsers(response.users);
    }).catch((error) => {
      console.error(error);
      toast.error("Failed to get users");
      setUsers([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="mt-20">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <Table className="mt-2">
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
  )
}

export default UsersTable;