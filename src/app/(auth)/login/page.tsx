import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <Link href={"/"}>
        <Button>Return home</Button>
      </Link>
    </div>
  );
}
