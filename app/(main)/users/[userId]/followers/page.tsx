import { UserFollowListPage } from "@/components/user-follow-list-page";

export default async function FollowersPage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = await params;

	if (!userId) {
		return null;
	}

	return <UserFollowListPage userId={userId} mode="followers" />;
}
