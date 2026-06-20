import { UserProfilePage } from "@/components/user-profile-page";

export default async function ProfilePage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = await params;

	if (!userId) {
		return null;
	}
	return <UserProfilePage userId={userId} />;
}
