import React from 'react';

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const computedClassName = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className || ''}`.trim();

  if (asChild) {
    const child = React.Children.only(children);
    if (React.isValidElement<{ className?: string }>(child)) {
      return React.cloneElement(child, {
        ...props,
        ref,
        className: `${computedClassName} ${child.props.className || ''}`.trim(),
      });
    }
  }
  
  return (
    <button className={computedClassName} {...props} ref={ref}>
      {children}
    </button>
  );
});
Button.displayName = "Button";

export default Button;
