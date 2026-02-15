ALTER TABLE "user" ADD COLUMN "handle" varchar(15);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_handle_unique" UNIQUE("handle");