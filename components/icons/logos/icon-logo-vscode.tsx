import React from "react";

import { cn } from "@/lib/utils";

export const IconLogoVscodeDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--vscode-dark]", className)}
    ></span>
  );
};

export const IconLogoVscodeLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--vscode-light]", className)}
    ></span>
  );
};
