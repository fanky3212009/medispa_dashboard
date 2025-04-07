"use client"

import { createContext, useContext, useState } from "react"

type User = {
  name: string
  email: string
  image?: string
}

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>({
    name: "John Doe",
    email: "john@example.com",
  })

  return (
    <AuthContext.Provider value={{ user, setUser: () => {} }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

