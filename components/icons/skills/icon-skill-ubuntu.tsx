import React from "react";

import { cn } from "@/lib/utils";

export const IconSkillUbuntuDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--ubuntu-dark]", className)}
    ></span>
  );
};

export const IconSkillUbuntuLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--ubuntu-light]", className)}
    ></span>
  );
};
