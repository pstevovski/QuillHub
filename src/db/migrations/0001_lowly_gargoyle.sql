ALTER TABLE `posts` ADD `created_by` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `updated_at` timestamp(6) DEFAULT (now());--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;