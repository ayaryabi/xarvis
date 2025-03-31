import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none",
  {
    variants: {
      variant: {
        white: "bg-white text-black hover:bg-white/90 transition-all", 
        ghost: "text-gray-400 hover:text-white transition-colors",
        outline: "border border-white/10 bg-white/5 backdrop-blur-lg text-white hover:bg-white/10",
        gradient: "bg-gradient-to-r from-[#ff6363] to-[#ff3939] hover:from-[#ff7373] hover:to-[#ff4949] text-white shadow-lg shadow-[#ff6363]/20 border border-[#ff6363]/20"
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
