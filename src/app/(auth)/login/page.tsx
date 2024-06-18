import LoginForm from "@/app/(auth)/login/_components/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-center text-4xl font-bold">Đăng nhập</h1>
      <div className="flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
