"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id });
  };

  // Auto-dismiss logic moved to useEffect for cleaner lifecycle management
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Fixed Positioning Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {notification && (
          <div
            key={notification.id}
            className={`
              flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-xl shadow-lg border animate-in slide-in-from-right-5 fade-in duration-300
              ${getStyles(notification.type)}
            `}
          >
            {/* Icon */}
            <div className="shrink-0">{getIcon(notification.type)}</div>
            
            {/* Message */}
            <p className="text-sm font-medium flex-1">{notification.message}</p>
            
            {/* Close Button */}
            <button 
              onClick={() => setNotification(null)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  );
}

// Helper: Get Tailwind styles based on type
function getStyles(type: NotificationType): string {
  switch (type) {
    case "success":
      return "bg-white border-emerald-100 text-emerald-800 shadow-emerald-500/10 ring-1 ring-emerald-500/20";
    case "error":
      return "bg-white border-red-100 text-red-800 shadow-red-500/10 ring-1 ring-red-500/20";
    case "warning":
      return "bg-white border-amber-100 text-amber-800 shadow-amber-500/10 ring-1 ring-amber-500/20";
    case "info":
      return "bg-white border-blue-100 text-blue-800 shadow-blue-500/10 ring-1 ring-blue-500/20";
    default:
      return "bg-white border-zinc-200 text-zinc-800 shadow-zinc-500/10";
  }
}

// Helper: Get Icon based on type
function getIcon(type: NotificationType) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "error":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case "info":
      return <Info className="w-5 h-5 text-blue-500" />;
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}