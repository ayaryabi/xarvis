import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "relative bg-black backdrop-blur-xl border rounded-xl shadow-xl transition-all",
  {
    variants: {
      variant: {
        default: "border-white/10 hover:border-white/20",
        feature: "bg-black/40 border-white/10 hover:border-white/20",
        results: "border-white/10"
      },
      glowOnHover: {
        true: "group", // Add group class for targeting child elements on hover
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      glowOnHover: false
    }
  }
); 