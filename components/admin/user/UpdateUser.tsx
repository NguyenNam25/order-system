"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User, UserRegister, UserUpdate } from "@/types/user";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "@/api/Routes/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, userSchema } from "@/schemas/userSchema";

export default function UpdateUser({
  data,
  open,
  onOpenChange,
}: {
  data: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdate>({
    defaultValues: {
      fullname: data.fullname,
      email: data.email
    },
    resolver: zodResolver(updateUserSchema),
  });

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: number; user: UserUpdate }) =>
      userApi.updateUser(id, user),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Update successfully");
      onOpenChange(false);
    },
  });

  const onUpdate = (formdata: UserUpdate) => {
    updateUserMutation.mutate({
      id: data.id,
      user: {
        fullname: formdata.fullname,
        email: formdata.email
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>Update information of user</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onUpdate)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
              <Input
                {...register("fullname")}
                id="fullname"
                type="text"
                placeholder="Enter Full Name"
              />

              {errors.fullname && (
                <p className="text-red-500 text-sm">{errors.fullname.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </Field>
            <div className="flex justify-end">
              <Button type="button" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
