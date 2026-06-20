"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function MeRedirectPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (session?.user.id) {
			router.replace(`/users/${session.user.id}`);
		}
	}, [router, session?.user.id]);

	if (isPending) {
		return (
			<div className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-white p-6 text-sm text-[var(--text-subtle)]">
				プロフィールを読み込んでいます...
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-white p-6 text-sm text-[var(--text-subtle)]">
				<p>ログインしてあなたのかっこいいプロフィールを確認してください！！</p>
				<div className="mt-4 flex gap-2">
					<Link
						href="/login"
						className="inline-block rounded-full bg-[var(--brand-primary)] px-4 py-2 text-sm font-bold text-white"
					>
						ログインへ移動
					</Link>
					<Link
						href="/signup"
						className="inline-block rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm font-bold text-[var(--text-main)]"
					>
						今すぐ参加する
					</Link>
				</div>
			</div>
		);
	}

	return null;
}
