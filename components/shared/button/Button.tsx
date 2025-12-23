import { Children, ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "playground" | "destructive";
  size?: "default" | "large";
  disabled?: boolean;
}

export default function Button({
  variant = "primary",
  size = "default",
  disabled,
  ...attrs
}: Props) {
  const children = handleChildren(attrs.children);

  return (
    <button
      {...attrs}
      type={attrs.type ?? "button"}
      className={cn(
        attrs.className,
        "[&>span]:px-6 flex items-center justify-center button relative [&>*]:relative transition-all duration-300",
        "text-label-medium lg-max:[&_svg]:size-24",
        `button-${variant} group/button`,
        {
          "rounded-8 p-6": size === "default",
          "rounded-10 p-8 gap-2": size === "large",

          // Primary: High-glow cyan background with black text
          "bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-[0.995]": variant === "primary",

          // Secondary: Ghost style
          "bg-transparent border border-border text-primary hover:bg-primary/10 active:scale-[0.99]": variant === "secondary",

          // Tertiary: Similar to secondary but less prominence
          "text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10": variant === "tertiary",

          "bg-surfaceHighlight text-gray-400": variant === "playground",
        },
        variant === "playground" && [
          "inside-border before:border-white/5",
          disabled
            ? "before:opacity-0 opacity-50 cursor-not-allowed"
            : "hover:bg-surfaceHighlight/80 hover:before:opacity-0 active:before:opacity-0",
        ],
      )}
      disabled={disabled}
    >
      {variant === "primary" && (
        <div className="overlay button-background !absolute" />
      )}

      {children}
    </button>
  );
}

const handleChildren = (children: React.ReactNode) => {
  return Children.toArray(children).map((child) => {
    if (typeof child === "string") {
      return <span key={child}>{child}</span>;
    }

    return child;
  });
};
