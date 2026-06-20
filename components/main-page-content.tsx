"use client";

import type { ReactNode } from "react";

type MainPageContentProps = {
	title: string;
	children: ReactNode;
};

export function MainPageContent({ title, children }: MainPageContentProps) {
	return (
		<>
			<div className="sticky top-0 z-30 hidden border-b border-[var(--border-subtle)] bg-white/95 px-4 py-3 backdrop-blur md:block">
				<p className="text-xl font-extrabold text-[var(--text-main)]">
					{title}
				</p>
			</div>
			{children}
		</>
	);
}
