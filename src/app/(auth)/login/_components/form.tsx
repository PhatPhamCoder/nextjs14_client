"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  LoginBody,
  LoginBodyType,
} from "@/components/schemaValidations/auth.schema";

import { useToast } from "@/components/ui/use-toast";
import authApiRequest from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { ClientSessionToken } from "@/lib/http";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    try {
      const response = await authApiRequest.login(values);
      toast({
        title: response.payload.message,
      });

      await authApiRequest.auth({
        sessionToken: response?.payload?.data?.token,
      });

      ClientSessionToken.value = response?.payload?.data?.token;
      router.push("/me");
    } catch (error: any) {
      const errors = error.payload.errors as {
        field: string;
        message: string;
      }[];

      const status = error.status as number;

      if (status === 422) {
        errors.forEach((error) => {
          form.setError(error.field as "email" | "password", {
            type: "server",
            message: error.message,
          });
        });
      } else {
        toast({
          title: "Error",
          description: error.payload.message,
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-[400px] flex-shrink-0 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@gmail.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="flex mx-auto !mt-4 w-full" type="submit">
          Đăng ký
        </Button>
      </form>
    </Form>
  );
}
