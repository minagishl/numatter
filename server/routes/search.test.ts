import { describe, expect, it } from "vitest";

import * as schema from "@/db/schema";
import { setup } from "@/tests/vitest.helper";
import app from "./search";

const { createUser, db } = await setup();

describe("/routes/search", () => {
	it("投稿本文とハッシュタグを検索できる", async () => {
		const user = await createUser();

		await db.insert(schema.posts).values([
			{
				id: "search_post_a",
				authorId: user.id,
				content: "Building with TypeScript and #TypeScript",
				createdAt: new Date("2026-01-01T10:00:00Z"),
				updatedAt: new Date("2026-01-01T10:00:00Z"),
			},
			{
				id: "search_post_b",
				authorId: user.id,
				content: "Another post about #typescript and DX",
				createdAt: new Date("2026-01-01T10:01:00Z"),
				updatedAt: new Date("2026-01-01T10:01:00Z"),
			},
			{
				id: "search_post_c",
				authorId: user.id,
				content: "No related keyword here #design",
				createdAt: new Date("2026-01-01T10:02:00Z"),
				updatedAt: new Date("2026-01-01T10:02:00Z"),
			},
		]);

		const response = await app.request("/?q=typescript", {
			method: "GET",
		});
		const json = (await response.json()) as {
			query: string;
			posts: Array<{ id: string }>;
			hashtags: Array<{ tag: string; count: number }>;
		};

		expect(response.status).toBe(200);
		expect(json.query).toBe("typescript");
		expect(json.posts.some((post) => post.id === "search_post_a")).toBe(true);
		expect(json.posts.some((post) => post.id === "search_post_b")).toBe(true);
		expect(
			json.hashtags.find((item) => item.tag === "#typescript")?.count,
		).toBe(2);
	});

	it("複数ハッシュタグを指定した検索ができる", async () => {
		const user = await createUser();

		await db.insert(schema.posts).values([
			{
				id: "search_multi_tag_post_a",
				authorId: user.id,
				content: "Shipped feature with #NextJS and #TypeScript",
				createdAt: new Date("2026-01-02T10:00:00Z"),
				updatedAt: new Date("2026-01-02T10:00:00Z"),
			},
			{
				id: "search_multi_tag_post_b",
				authorId: user.id,
				content: "Only one tag #TypeScript",
				createdAt: new Date("2026-01-02T10:01:00Z"),
				updatedAt: new Date("2026-01-02T10:01:00Z"),
			},
			{
				id: "search_multi_tag_post_c",
				authorId: user.id,
				content: "Another topic with #NextJS",
				createdAt: new Date("2026-01-02T10:02:00Z"),
				updatedAt: new Date("2026-01-02T10:02:00Z"),
			},
		]);

		const response = await app.request("/?q=%23typescript%20%23nextjs", {
			method: "GET",
		});
		const json = (await response.json()) as {
			posts: Array<{ id: string }>;
			hashtags: Array<{ tag: string; count: number }>;
		};

		expect(response.status).toBe(200);
		expect(json.posts.map((post) => post.id)).toEqual([
			"search_multi_tag_post_a",
		]);
		expect(
			json.hashtags.find((hashtag) => hashtag.tag === "#typescript")?.count,
		).toBe(1);
		expect(
			json.hashtags.find((hashtag) => hashtag.tag === "#nextjs")?.count,
		).toBe(1);
	});

	it("空クエリの場合は空配列を返す", async () => {
		await createUser();

		const response = await app.request("/", {
			method: "GET",
		});
		const json = (await response.json()) as {
			query: string;
			posts: unknown[];
			hashtags: unknown[];
		};

		expect(response.status).toBe(200);
		expect(json.query).toBe("");
		expect(json.posts).toEqual([]);
		expect(json.hashtags).toEqual([]);
	});
});
