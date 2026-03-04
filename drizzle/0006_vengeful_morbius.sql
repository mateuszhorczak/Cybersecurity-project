ALTER TABLE `message_permission` RENAME TO `message_permissions`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_message_permissions` (
	`user_id` integer NOT NULL,
	`message_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `message_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_message_permissions`("user_id", "message_id") SELECT "user_id", "message_id" FROM `message_permissions`;--> statement-breakpoint
DROP TABLE `message_permissions`;--> statement-breakpoint
ALTER TABLE `__new_message_permissions` RENAME TO `message_permissions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;