import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/login">Đăng Nhập</Link>
        </li>
        <li>
          <Link href="/register">Đăng Ký</Link>
        </li>
        <li>
          <ButtonLogout />
        </li>
      </ul>
      <ModeToggle />
    </div>
  );
}
