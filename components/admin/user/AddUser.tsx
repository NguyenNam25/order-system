"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import type { User, UserRegister } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import authApi from "@/api/Routes/authApi";

export default function AddUser() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserRegister>({
    resolver: zodResolver(userSchema),
  });

  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: authApi.register,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Create succesfully");
      reset();
      setOpen(false);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    },
  });

  const onSubmit = async (data: UserRegister) => {
    addUserMutation.mutate({
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={"border py-1 px-2 rounded-lg text-white bg-black"}
      >
        Add
      </DialogTrigger>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>New User</DialogTitle>
          <DialogDescription>Add new user</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...register("password")}
                id="password"
                type="text"
                placeholder="Enter Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
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
