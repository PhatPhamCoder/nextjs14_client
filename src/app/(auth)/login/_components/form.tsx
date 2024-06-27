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
import { handleErrorApi } from "@/lib/utils";
import { useState } from "react";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await authApiRequest.login(values);

      await authApiRequest.auth({
        sessionToken: response?.payload?.data?.token,
        expiresAt: response?.payload?.data?.expiresAt,
      });

      ClientSessionToken.value = response?.payload?.data?.token;

      toast({
        title: response.payload.message,
      });
      router.push("/me");
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setIsLoading(false);
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
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
