'use client'
import React from "react";
import { useTheme } from "next-themes";
import { VisuallyHidden, useSwitch } from "@nextui-org/react";

function DarkModeSwitch(props: any) {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps
  } = useSwitch(props);
  return (
    <div className="flex flex-col gap-2">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "w-8 h-8",
              "flex items-center justify-center",
              "rounded-lg bg-default-100 hover:bg-default-200",
            ],
          })}
        >
          {isSelected ? <>🌞 </> : <>🌛</>}
        </div>
      </Component>
    </div>
  );
};

export function DarkModeThemeSwitch() {
  const { setTheme, theme } = useTheme();
  return <DarkModeSwitch
    checked={theme === "dark"}
    onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
  />
}
