CREATE TABLE `posts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`text` text NOT NULL,
	`cover_photo_url` varchar(512),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`label` varchar(30) NOT NULL,
	`description` varchar(255) DEFAULT null,
	`created_at` timestamp(6) DEFAULT (now()),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user_password_resets` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(512) NOT NULL,
	CONSTRAINT `user_password_resets_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_password_resets_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`password` varchar(512) NOT NULL,
	`biography` varchar(1024) DEFAULT null,
	`profile_picture` varchar(512) DEFAULT null,
	`theme` enum('light','dark','system') NOT NULL DEFAULT 'light',
	`role_id` bigint unsigned NOT NULL DEFAULT 1,
	`last_signin` datetime(6) DEFAULT null,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;