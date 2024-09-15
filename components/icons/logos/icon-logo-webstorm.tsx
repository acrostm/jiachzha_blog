import React from "react";

import { cn } from "@/lib/utils";

export const IconLogoWebstormDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--webstorm-dark]", className)}
    ></span>
  );
};

export const IconLogoWebstormLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[skill-icons--webstorm-light]", className)}
    ></span>
  );
};
