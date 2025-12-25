"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { cn } from "@/utils/cn";

interface CyberDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "warning" | "danger" | "info";
}

export default function CyberDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning"
}: CyberDialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Dialog Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden"
                    >
                        {/* Outer Glow wrapper */}
                        <div className="relative group">
                            <div className={cn(
                                "absolute -inset-1 rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200",
                                variant === "warning" ? "bg-yellow-500" : variant === "danger" ? "bg-red-500" : "bg-cyan-500"
                            )} />

                            <div className="relative bg-[#0a0f14] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:100%_4px] animate-scan" />
                                </div>

                                {/* Header with Circuit Pattern Overlay */}
                                <div className="relative h-2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                                <div className="p-6 pt-8">
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "p-3 rounded-lg bg-white/5 border border-white/10 flex-shrink-0",
                                            variant === "warning" ? "text-yellow-500" : variant === "danger" ? "text-red-500" : "text-cyan-500"
                                        )}>
                                            <FiAlertTriangle size={24} className="animate-pulse" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-display font-bold text-white tracking-tight mb-2">
                                                {title}
                                            </h3>
                                            <p className="text-gray-400 text-sm font-sans leading-relaxed">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-6 bg-black/20 border-t border-white/5 flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-200 border border-white/5 flex items-center justify-center gap-2 group/btn"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className={cn(
                                            "flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-2",
                                            variant === "warning" ? "bg-yellow-500 text-black hover:bg-yellow-400 shadow-yellow-500/10" :
                                                variant === "danger" ? "bg-red-600 text-white hover:bg-red-500 shadow-red-500/10" :
                                                    "bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/10"
                                        )}
                                    >
                                        {confirmText}
                                    </button>
                                </div>

                                {/* Bottom decorative bar */}
                                <div className="flex px-6 pb-2 justify-between">
                                    <div className="h-1 w-12 bg-white/5 rounded-full" />
                                    <div className="h-1 w-24 bg-white/5 rounded-full" />
                                    <div className="h-1 w-8 bg-white/5 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Close button (top right) */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
