import RegisterForm from "@/app/(auth)/register/_components/form";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-center text-4xl font-bold">Đăng ký</h1>
      <div className="flex items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
