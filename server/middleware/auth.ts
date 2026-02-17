import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import * as schema from "@/db/schema";
import { auth } from "@/lib/auth";
import type { Context } from "@/server/types";

export const authMiddleware = createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		await next();
		return;
	}

	c.set("user", session.user);
	c.set("session", session.session);
	await next();
});

export const getUserOrThrow = async (c: Context) => {
	const user = c.get("user");
	const session = c.get("session");

	if (!user || !session) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	return { user, session };
};

export const getDeveloperUserOrThrow = async (c: Context) => {
	const { user } = await getUserOrThrow(c);
	const [currentUser] = await c
		.get("db")
		.select({
			isDeveloper: schema.user.isDeveloper,
		})
		.from(schema.user)
		.where(eq(schema.user.id, user.id))
		.limit(1);

	if (!currentUser?.isDeveloper) {
		throw new HTTPException(403, { message: "Developer access required" });
	}

	return { user };
};
