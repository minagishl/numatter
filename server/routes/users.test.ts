import { describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import { setup } from "@/tests/vitest.helper";
import app from "./users";

const { createUser, db } = await setup();

describe("/routes/users", () => {
	it("未ログイン時に /me は取得できない", async () => {
		const response = await app.request("/me", {
			method: "GET",
		});

		expect(response.status).toBe(401);
	});

	it("ログイン時に /me を取得できる", async () => {
		const user = await createUser();
		const response = await app.request("/me", {
			method: "GET",
		});
		const json = (await response.json()) as {
			user: { id: string; email: string; handle: string | null };
		};

		expect(response.status).toBe(200);
		expect(json.user.id).toBe(user.id);
		expect(json.user.email).toBe(user.email);
		expect(json.user.handle).toBeNull();
	});

	it("フォローと解除ができる", async () => {
		const currentUser = await createUser();
		await db.insert(schema.user).values({
			id: "target_user_id",
			name: "Target User",
			handle: "target_user",
			email: "target@example.com",
			emailVerified: true,
			createdAt: new Date("2026-01-01"),
			updatedAt: new Date("2026-01-01"),
		});

		const followResponse = await app.request("/target_user_id/follow", {
			method: "POST",
		});
		const followed = (await followResponse.json()) as {
			viewer: { isFollowing: boolean };
			stats: { followers: number };
		};

		const unfollowResponse = await app.request("/target_user_id/follow", {
			method: "DELETE",
		});
		const unfollowed = (await unfollowResponse.json()) as {
			viewer: { isFollowing: boolean };
			stats: { followers: number };
		};

		expect(followResponse.status).toBe(200);
		expect(followed.viewer.isFollowing).toBe(true);
		expect(followed.stats.followers).toBe(1);

		expect(unfollowResponse.status).toBe(200);
		expect(unfollowed.viewer.isFollowing).toBe(false);
		expect(unfollowed.stats.followers).toBe(0);

		expect(currentUser.id).toBe("test_user_id");
	});

	it("プロフィールの名前と自己紹介を更新できる", async () => {
		await createUser();
		const formData = new FormData();
		formData.set("name", "Updated Name");
		formData.set("handle", "updated_handle");
		formData.set("bio", "Updated bio");

		const response = await app.request("/me", {
			method: "PATCH",
			body: formData,
		});
		const json = (await response.json()) as {
			user: { name: string; handle: string | null; bio: string | null };
		};

		expect(response.status).toBe(200);
		expect(json.user.name).toBe("Updated Name");
		expect(json.user.handle).toBe("updated_handle");
		expect(json.user.bio).toBe("Updated bio");
	});

	it("すでに使われているハンドルには更新できない", async () => {
		await createUser();
		await db.insert(schema.user).values({
			id: "taken_handle_user",
			name: "Taken Handle User",
			handle: "taken_handle",
			email: "taken-handle@example.com",
			emailVerified: true,
			createdAt: new Date("2026-01-01"),
			updatedAt: new Date("2026-01-01"),
		});

		const formData = new FormData();
		formData.set("handle", "taken_handle");

		const response = await app.request("/me", {
			method: "PATCH",
			body: formData,
		});

		expect(response.status).toBe(400);
	});
});
