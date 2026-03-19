PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_restrictions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_restrictions`("id", "name", "value") SELECT "id", "name", "value" FROM `restrictions`;--> statement-breakpoint
DROP TABLE `restrictions`;--> statement-breakpoint
ALTER TABLE `__new_restrictions` RENAME TO `restrictions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;