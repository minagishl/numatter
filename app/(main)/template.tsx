import { PageContentTransition } from "@/components/page-content-transition";

export default function MainTemplate({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <PageContentTransition>{children}</PageContentTransition>;
}
