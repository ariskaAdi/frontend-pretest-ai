import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "../Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      "bg-primary text-white  font-bold  hover:bg-primary-hover hover:text-white",
    secondary:
      "bg-primary-white text-primary border border-primary border-dashed hover:bg-primary-hover hover:text-primary",
    danger: "bg-danger text-white hover:bg-danger-hover",
    ghost:
      "bg-transparent  text-primary hover:bg-primary-light border-1 border-primary/30 hover:text-primary hover:border-primary hover:bg-primary-light",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}>
      {loading && <Spinner size="sm" className="border-t-current" />}
      {!loading && leftIcon && <span>{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}
