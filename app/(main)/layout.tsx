import { AppShellLayout } from "@/components/app-shell";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <AppShellLayout>{children}</AppShellLayout>;
}
