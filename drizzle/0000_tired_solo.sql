CREATE TABLE if not exists `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`description` text NOT NULL,
	`date_creation` text NOT NULL,
	`week` integer,
	`month` integer,
	`year` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE if not exists `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`date_creation` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX if not exists `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX if not exists `users_username_unique` ON `users` (`username`);