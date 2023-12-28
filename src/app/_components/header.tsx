'use client'
import { Link, Navbar, NavbarContent, NavbarBrand, NavbarItem } from "@nextui-org/react";
import React from "react";
import { DarkModeThemeSwitch } from "./darkmode-switch";

export function Header({ children }: { children?: React.ReactNode }) {
  return <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
    <Navbar
      className="w-full"
      classNames={{
        wrapper: "w-full max-w-full",
      }}
    >
      <NavbarBrand>
        <p className="font-bold text-inherit">崩坏·星穹铁道跃迁分析</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link
            href="https://github.com/Siumauricio/nextui-dashboard-template"
            target={"_blank"}
          >
            GitHub
          </Link>
        </NavbarItem>

        <NavbarItem>
          <DarkModeThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    {children}
  </div>
}