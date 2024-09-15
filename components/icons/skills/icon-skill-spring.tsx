import React from "react";

import { cn } from "@/lib/utils";

export const IconSkillSpringDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--spring-dark]", className)}
    ></span>
  );
};

export const IconSkillSpringLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--spring-light]", className)}
    ></span>
  );
};
