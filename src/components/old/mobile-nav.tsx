import { Sidebar } from "@/components/sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface MobileNavProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetContent side="left" className="p-0 w-[280px] bg-[#19171D]">
        <Sidebar className="w-full" />
      </SheetContent>
    </Sheet>
  )
} 