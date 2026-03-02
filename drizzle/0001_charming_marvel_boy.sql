PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`description` text NOT NULL,
	`date_creation` text NOT NULL,
	`week` integer NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_events`("id", "user_id", "name", "type", "date", "description", "date_creation", "week", "month", "year") SELECT "id", "user_id", "name", "type", "date", "description", "date_creation", "week", "month", "year" FROM `events`;--> statement-breakpoint
DROP TABLE `events`;--> statement-breakpoint
ALTER TABLE `__new_events` RENAME TO `events`;--> statement-breakpoint
PRAGMA foreign_keys=ON;