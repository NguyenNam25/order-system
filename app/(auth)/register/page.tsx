"use client";

import authApi from "@/api/routes/authApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserRegister } from "@/interfaces/user";
import { userSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserRegister>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "USER",
    },
  });

  const queryClient = useQueryClient();
  const router = useRouter()

  const registerMutation = useMutation({
    mutationFn: authApi.register,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Create succesfully");
      reset();
      router.push("/login")
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    },
  });

  const onSubmit = (data: UserRegister) => {
    registerMutation.mutate({
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: "USER",
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <p className="text-red-500 text-sm">
                    {errors.fullname.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  {...register("phone")}
                  id="phone"
                  type="text"
                  placeholder=""
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
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
                  type="password"
                  placeholder="Enter Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col w-full gap-2 mt-6">
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Signing up..." : "Sign up"}
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Back to Login
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
