import React from "react";

import { cn } from "@/lib/utils";

export const IconSkillRedisDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--redis-dark]", className)}
    ></span>
  );
};

export const IconSkillRedisLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--redis-light]", className)}
    ></span>
  );
};
