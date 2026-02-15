import { PostDetailPage } from "@/components/post-detail-page";

export default async function PostDetailRoute({
	params,
}: {
	params: Promise<{ postId: string }>;
}) {
	const { postId } = await params;

	if (!postId) {
		return null;
	}

	return <PostDetailPage postId={postId} />;
}
