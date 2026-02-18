"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import {
	type FollowListResponse,
	fetchFollowers,
	fetchFollowing,
	fetchUserProfile,
	type ProfileResponse,
} from "@/lib/social-api";
import { createDisplayHandle } from "@/lib/user-handle";

type FollowListMode = "followers" | "following";

type UserFollowListPageProps = {
	userId: string;
	mode: FollowListMode;
};

const modeLabel = (mode: FollowListMode) =>
	mode === "followers" ? "フォロワー" : "フォロー中";

export function UserFollowListPage({ userId, mode }: UserFollowListPageProps) {
	const [profile, setProfile] = useState<ProfileResponse | null>(null);
	const [list, setList] = useState<FollowListResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const title = useMemo(() => {
		if (!profile) {
			return modeLabel(mode);
		}
		return `${profile.user.name}の${modeLabel(mode)}`;
	}, [mode, profile]);

	useEffect(() => {
		let ignore = false;
		setIsLoading(true);
		setError(null);

		const load = async () => {
			try {
				const [nextProfile, nextList] = await Promise.all([
					fetchUserProfile(userId),
					mode === "followers"
						? fetchFollowers(userId)
						: fetchFollowing(userId),
				]);
				if (ignore) {
					return;
				}
				setProfile(nextProfile);
				setList(nextList);
			} catch (loadError) {
				if (ignore) {
					return;
				}
				if (loadError instanceof Error) {
					setError(loadError.message);
				} else {
					setError("Failed to load follow list");
				}
			} finally {
				if (!ignore) {
					setIsLoading(false);
				}
			}
		};

		void load();
		return () => {
			ignore = true;
		};
	}, [mode, userId]);

	return (
		<AppShell pageTitle={title}>
			<section className="border-b border-[var(--border-subtle)] px-4 py-4">
				<Link
					href={`/users/${userId}`}
					className="text-sm font-semibold text-sky-600 hover:underline"
				>
					プロフィールへ戻る
				</Link>
			</section>

			{error ? (
				<section className="border-b border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-700">
					{error}
				</section>
			) : isLoading ? (
				<section className="border-b border-[var(--border-subtle)] px-4 py-6 text-sm text-[var(--text-subtle)]">
					{modeLabel(mode)}を読み込んでいます...
				</section>
			) : (list?.users ?? []).length === 0 ? (
				<section className="border-b border-[var(--border-subtle)] px-4 py-6 text-sm text-[var(--text-subtle)]">
					まだ{modeLabel(mode)}はいません。
				</section>
			) : (
				<ul>
					{(list?.users ?? []).map((account) => {
						const handle = createDisplayHandle({
							handle: account.handle,
							name: account.name,
							userId: account.id,
						});

						return (
							<li
								key={account.id}
								className="border-b border-[var(--border-subtle)]"
							>
								<Link
									href={`/users/${account.id}`}
									className="flex items-center gap-3 px-4 py-3 transition hover:bg-[var(--surface-muted)]"
								>
									<div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">
										{account.image ? (
											<img
												src={account.image}
												alt={account.name}
												className="h-full w-full object-cover"
											/>
										) : (
											account.name.slice(0, 2).toUpperCase()
										)}
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm font-bold text-[var(--text-main)]">
											{account.name}
										</p>
										<p className="truncate text-xs text-[var(--text-subtle)]">
											{handle}
										</p>
										{account.bio ? (
											<p className="mt-1 line-clamp-2 text-xs text-[var(--text-subtle)]">
												{account.bio}
											</p>
										) : null}
									</div>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</AppShell>
	);
}
