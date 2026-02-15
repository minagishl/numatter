"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { signUpWithEmail } from "@/lib/auth-actions";

export default function SignupPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		const result = await signUpWithEmail({
			name,
			email,
			password,
		});

		if (!result.success) {
			setError(result.error ?? "Signup failed");
			setIsLoading(false);
			return;
		}

		router.push("/");
	};

	return (
		<div className="min-h-screen bg-[var(--app-bg)]">
			<div className="mx-auto grid min-h-screen w-full max-w-[1100px] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
				<section className="hidden flex-col justify-between bg-[linear-gradient(135deg,#1d9bf0,#198ad0,#0f5f8a)] p-12 text-white lg:flex">
					<Link href="/" className="text-2xl font-extrabold tracking-tight">
						Numatter
					</Link>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
							アカウントを作成
						</p>
						<h1 className="mt-4 text-5xl font-extrabold leading-tight">
							あと数秒で参加できます！
						</h1>
						<p className="mt-4 max-w-md text-base text-white/90">
							さぁ、あと少しで完了です！！
						</p>
					</div>
					<p className="text-sm text-white/75">愛によってBuildされました。</p>
				</section>

				<section className="flex items-center justify-center px-6 py-12">
					<div className="w-full max-w-[440px] rounded-3xl border border-[var(--border-subtle)] bg-white p-8 shadow-[0_24px_70px_-40px_rgba(15,20,25,0.45)] sm:p-10">
						<p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-500">
							新時代が始まる
						</p>
						<h1 className="mt-3 text-3xl font-extrabold text-[var(--text-main)]">
							アカウントを作成
						</h1>
						<form onSubmit={handleSubmit} className="mt-8 space-y-4">
							<div className="space-y-2">
								<label
									className="text-sm font-bold text-[var(--text-subtle)]"
									htmlFor="name"
								>
									名前
								</label>
								<input
									id="name"
									required
									value={name}
									onChange={(event) => setName(event.target.value)}
									className="h-12 w-full rounded-2xl border border-[var(--border-subtle)] px-4 text-base text-[var(--text-main)] outline-none transition focus:border-sky-400"
								/>
							</div>

							<div className="space-y-2">
								<label
									className="text-sm font-bold text-[var(--text-subtle)]"
									htmlFor="email"
								>
									メールアドレス
								</label>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									className="h-12 w-full rounded-2xl border border-[var(--border-subtle)] px-4 text-base text-[var(--text-main)] outline-none transition focus:border-sky-400"
								/>
							</div>

							<div className="space-y-2">
								<label
									className="text-sm font-bold text-[var(--text-subtle)]"
									htmlFor="password"
								>
									パスワード
								</label>
								<input
									id="password"
									type="password"
									required
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									className="h-12 w-full rounded-2xl border border-[var(--border-subtle)] px-4 text-base text-[var(--text-main)] outline-none transition focus:border-sky-400"
								/>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="h-12 w-full rounded-full bg-[var(--brand-primary)] px-4 text-sm font-bold text-white transition hover:bg-[var(--brand-primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
							>
								{isLoading ? "アカウントを作成中..." : "アカウントを作成"}
							</button>
						</form>

						{error ? (
							<p className="mt-4 text-sm text-rose-600">{error}</p>
						) : null}

						<p className="mt-6 text-sm text-[var(--text-subtle)]">
							すでに参加していますか?{" "}
							<Link
								href="/login"
								className="font-bold text-[var(--brand-primary)]"
							>
								今すぐログイン
							</Link>
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
