import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none",
  {
    variants: {
      variant: {
        white: "bg-white text-black hover:bg-white/90 transition-all", 
        ghost: "text-gray-400 hover:text-white transition-colors",
        outline: "border border-white/10 bg-white/5 backdrop-blur-lg text-white hover:bg-white/10"
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8 py-2 text-lg rounded-lg",
        xl: "px-8 py-4 text-lg rounded-lg",
        full: "w-full"
      },
    },
    defaultVariants: {
      variant: "white",
      size: "default",
    },
  }
);
