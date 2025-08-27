import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "warning" | "danger" | "success";
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  variant = "default",
  className 
}: StatsCardProps) {
  const variantStyles = {
    default: "border-card-border",
    warning: "border-expiring bg-expiring-light",
    danger: "border-expired bg-expired-light",
    success: "border-fresh bg-fresh-light"
  };

  return (
    <Card className={cn(
      "p-6 transition-smooth hover:shadow-lg",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className={cn(
              "text-2xl font-bold",
              variant === "warning" && "text-warning",
              variant === "danger" && "text-danger",
              variant === "success" && "text-success"
            )}>
              {value}
            </p>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-danger"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          variant === "default" && "bg-accent text-accent-foreground",
          variant === "warning" && "bg-warning/10 text-warning",
          variant === "danger" && "bg-danger/10 text-danger",
          variant === "success" && "bg-success/10 text-success"
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}