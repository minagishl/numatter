ALTER TABLE "posts" DROP CONSTRAINT "posts_reply_to_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_reply_to_post_id_posts_id_fk" FOREIGN KEY ("reply_to_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;