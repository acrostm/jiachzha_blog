import React from "react";

import { cn } from "@/lib/utils";

export const IconSkillJavaDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--java-dark]", className)}
    ></span>
  );
};

export const IconSkillJavaLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--java-light]", className)}
    ></span>
  );
};
