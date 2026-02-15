"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type PageTransitionProps = {
	children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <>{children}</>;
	}

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={pathname}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
				className="min-h-screen"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
