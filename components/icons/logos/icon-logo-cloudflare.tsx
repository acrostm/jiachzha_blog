import React from "react";

import { cn } from "@/lib/utils";

export const IconLogoCloudflare = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn("icon-[logos--cloudflare-icon]", className)}
    ></span>
  );
};