import { User } from "@/types/user";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import AlertDialogDelete from "../Components/AlertDialogDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "@/api/Routes/userApi";
import { toast } from "sonner";
import UpdateUser from "./UpdateUser";
import ChangePassword from "./ChangePassword";

export default function UserActions({ user }: { user: User }) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openChangePass, setOpenChangePass] = useState(false);

  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Deleted succesfully");
    },

    onError: (error) => {
      toast.error("Deleted failed");
    },
  });

  const handleDeleteUser = (id: number) => {
    deleteUserMutation.mutate(id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="h-8 w-8 p-0" />}
        >
          <span className="sr-only">Open menu actions</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setOpenChangePass(true);
              }}
            >
              Change password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setOpenUpdate(true);
              }}
            >
              Update
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setOpenDelete(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePassword data={user} open = {openChangePass} onOpenChange = {setOpenChangePass}/>

      <UpdateUser data={user} open={openUpdate} onOpenChange={setOpenUpdate} />

      <AlertDialogDelete
        id={user.id}
        type="user"
        open={openDelete}
        onOpenChange={setOpenDelete}
        onDelete={handleDeleteUser}
      />
    </>
  );
}
