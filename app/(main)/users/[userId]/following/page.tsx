import { UserFollowListPage } from "@/components/user-follow-list-page";

export default async function FollowingPage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = await params;

	if (!userId) {
		return null;
	}

	return <UserFollowListPage userId={userId} mode="following" />;
}
