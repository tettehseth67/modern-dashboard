"use client"

import { AlertCircle, Lock, Mail, ShieldLock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")
        setIsLoading(true)

        try {
            // 1. Submit the login request directly to your Supabase Auth server
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // 2. If successful, redirect the authorized administrator straight to the dashboard
            router.push("/")
            router.refresh()
        } catch (err: any) {
            setErrorMsg(err.message || "Invalid authentication credentials")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6">
                {/* Top header Branding */}
                <div className="text-center sace-y-2">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto border border-blue-500/20">
                        <ShieldLock className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight p-3">
                        EduSuite Admin Entry
                    </h1>
                    <p className="text-slate-400 text-xs">
                        Sign in to unlock full administrative system access controls.
                    </p>
                </div>

                {/* Error Notification Banner */}
                {errorMsg && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs flex items-center gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Credentials Authentication Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="email"
                            className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                required
                                placeholder="admin@edusuite.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Secure Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => HackerPasswordSetter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/10"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Authenticating Session...
                                    </>
                                ) : (
                                    "Sign In to Workspace"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
    function HackerPasswordSetter(val: string) {
        setPassword(val)
    }
}
