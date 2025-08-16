"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  try {
    const { toasts } = useToast()

    // Ensure toasts is always an array and handle undefined/null cases
    const safeToasts = Array.isArray(toasts) ? toasts : []

    return (
      <ToastProvider>
        {safeToasts && safeToasts.length > 0 && safeToasts.map(({ id, title, description, action, ...props }) => (
          <Toast key={id} {...props} className="bg-white border shadow-lg">
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
      </ToastProvider>
    )
  } catch (error) {
    // Fallback if there's any error with the toast system
    console.error('Toaster error:', error)
    return (
      <ToastProvider>
        <ToastViewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
      </ToastProvider>
    )
  }
}
