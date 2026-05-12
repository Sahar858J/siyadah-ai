import { useAppContext } from "@/context/AppContext";

export default function Footer() {
  const { language } = useAppContext();

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="white" fillOpacity="0.08" />
            <path
              d="M7 8.5C7 7.67 7.67 7 8.5 7h7C16.33 7 17 7.67 17 8.5v0C17 9.33 16.33 10 15.5 10h-4C10.67 10 10 10.67 10 11.5v1C10 13.33 10.67 14 11.5 14h4c.83 0 1.5.67 1.5 1.5v0c0 .83-.67 1.5-1.5 1.5h-7C7.67 17 7 16.33 7 15.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-white/60 text-sm">
            Siyadah AI &mdash; {language === "ar" ? "نظام التشغيل الذكي" : "Your AI Operating System"}
          </span>
        </div>
        <p className="text-white/30 text-xs">
          &copy; {new Date().getFullYear()} Siyadah AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
