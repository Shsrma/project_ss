import Link from "next/link"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-orange-500 flex items-center justify-center shadow-lg`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2 text-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" />
          <path
            d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z"
            fill="currentColor"
            opacity="0.7"
          />
          <path d="M5 6L5.5 8.5L8 9L5.5 9.5L5 12L4.5 9.5L2 9L4.5 8.5L5 6Z" fill="currentColor" opacity="0.7" />
        </svg>
      </div>
      {showText && (
        <span
          className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent`}
        >
          FashionKart
        </span>
      )}
    </Link>
  )
}
