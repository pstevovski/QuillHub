ALTER TABLE `posts_images` DROP FOREIGN KEY `posts_images_post_id_posts_id_fk`;
--> statement-breakpoint
ALTER TABLE `posts_images` ADD CONSTRAINT `posts_images_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;