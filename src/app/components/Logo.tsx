interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

export function Logo({ size = "md", variant = "light" }: LogoProps) {
  const sizes = {
    sm: { icon: 28, title: "text-base", sub: "text-[9px]" },
    md: { icon: 38, title: "text-xl", sub: "text-[10px]" },
    lg: { icon: 52, title: "text-3xl", sub: "text-xs" },
  };
  const s = sizes[size];
  const titleColor = variant === "light" ? "text-white" : "text-green-900";
  const subColor = variant === "light" ? "text-green-200" : "text-amber-700";

  return (
    <div className="flex items-center gap-2">
      {/* SVG Icon */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Coconut shell circle */}
        <circle cx="26" cy="26" r="24" fill="#4d7c0f" />
        {/* Coconut husk texture rings */}
        <circle cx="26" cy="26" r="18" fill="#3f6212" />
        <circle cx="26" cy="26" r="12" fill="#65a30d" />
        {/* Palm leaf */}
        <path
          d="M26 8 C20 14 14 18 10 28 C16 24 22 20 26 18 C30 20 36 24 42 28 C38 18 32 14 26 8Z"
          fill="#86efac"
        />
        <path
          d="M26 8 C22 16 20 22 20 30"
          stroke="#4ade80"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M26 8 C30 16 32 22 32 30"
          stroke="#4ade80"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Fiber strands */}
        <path
          d="M18 32 Q22 30 26 32 Q30 34 34 32"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 36 Q22 34 26 36 Q30 38 36 36"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M19 40 Q22 38 26 40 Q30 42 33 40"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {/* Text */}
      <div className="leading-tight">
        <div className={`${s.title} font-extrabold tracking-tight ${titleColor}`}>
          CocoFiber
        </div>
        <div className={`${s.sub} font-semibold uppercase tracking-widest ${subColor}`}>
          Philippines
        </div>
      </div>
    </div>
  );
}
