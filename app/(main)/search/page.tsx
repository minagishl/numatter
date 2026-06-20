import { SearchPage } from "@/components/search-page";

export default async function SearchRoutePage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string | string[] }>;
}) {
	const { q } = await searchParams;
	const initialQuery = typeof q === "string" ? q : "";

	return <SearchPage initialQuery={initialQuery} />;
}
