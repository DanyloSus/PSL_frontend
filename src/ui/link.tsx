import { type ComponentPropsWithoutRef, type FC, type ReactNode } from "react";

import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps
} from "@tanstack/react-router";

import { cn } from "@/utils/cn";

type RouterLinkAllProps = ComponentPropsWithoutRef<typeof RouterLink>;
type LinkToType = RouterLinkProps["to"] | (string & {});

interface LinkProps extends Omit<RouterLinkAllProps, "to"> {
  to?: LinkToType;
}

const Link: FC<LinkProps> = ({ to, children, className, ...props }) => {
  const isExternal =
    typeof to === "string" &&
    (to.startsWith("http") ||
      to.startsWith("mailto:") ||
      to.startsWith("tel:"));

  const style = cn(
    "underline decoration-current/0 transition-all hover:decoration-current",
    className
  );

  if (isExternal) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={style}
        {...props}
      >
        {children as ReactNode}
      </a>
    );
  }

  return (
    <RouterLink
      to={to as RouterLinkProps["to"]}
      className={style}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export { Link, type LinkProps, type LinkToType };
