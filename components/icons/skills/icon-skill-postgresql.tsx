import React from "react";

import { cn } from "@/lib/utils";

export const IconSkillPostgresqlDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--postgresql-dark]", className)}
    ></span>
  );
};

export const IconSkillPostgresqlLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--postgresql-light]", className)}
    ></span>
  );
};
