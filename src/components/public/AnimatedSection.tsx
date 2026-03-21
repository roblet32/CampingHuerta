"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type AnimationType = "fade-up" | "fade-in" | "slide-left" | "slide-right";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    animation?: AnimationType;
    delay?: number; // ms
    threshold?: number;
    once?: boolean;
}

const animationVariants: Record<AnimationType, { hidden: string; visible: string }> = {
    "fade-up": {
        hidden: "opacity-0 translate-y-10",
        visible: "opacity-100 translate-y-0",
    },
    "fade-in": {
        hidden: "opacity-0",
        visible: "opacity-100",
    },
    "slide-left": {
        hidden: "opacity-0 -translate-x-12",
        visible: "opacity-100 translate-x-0",
    },
    "slide-right": {
        hidden: "opacity-0 translate-x-12",
        visible: "opacity-100 translate-x-0",
    },
};

export default function AnimatedSection({
    children,
    className = "",
    animation = "fade-up",
    delay = 0,
    threshold = 0.15,
    once = true,
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    const { hidden, visible } = animationVariants[animation];

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? visible : hidden} ${className}`}
            style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}
