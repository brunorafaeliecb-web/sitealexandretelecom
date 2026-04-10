CREATE TABLE `admin_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`approvedBy` int,
	`approvedAt` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section` varchar(100) NOT NULL,
	`content` json NOT NULL,
	`colors` json,
	`images` json,
	`updatedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_section_unique` UNIQUE(`section`)
);
--> statement-breakpoint
CREATE TABLE `theme_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`darkModeEnabled` boolean NOT NULL DEFAULT false,
	`primaryColor` varchar(7) NOT NULL DEFAULT '#00D4E8',
	`secondaryColor` varchar(7) NOT NULL DEFAULT '#A855F7',
	`backgroundColor` varchar(7) NOT NULL DEFAULT '#FAF8F5',
	`darkBackgroundColor` varchar(7) NOT NULL DEFAULT '#0D1526',
	`updatedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `theme_settings_id` PRIMARY KEY(`id`)
);
