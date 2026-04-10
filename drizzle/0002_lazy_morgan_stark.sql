CREATE TABLE `edit_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section` varchar(100) NOT NULL,
	`userId` int NOT NULL,
	`userName` text,
	`userEmail` varchar(320),
	`changeType` enum('create','update','delete') NOT NULL,
	`oldValue` json,
	`newValue` json,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `edit_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `two_factor_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`code` varchar(6) NOT NULL,
	`email` varchar(320) NOT NULL,
	`isUsed` boolean NOT NULL DEFAULT false,
	`expiresAt` datetime NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `two_factor_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_two_factor_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`twoFactorEnabled` boolean NOT NULL DEFAULT false,
	`twoFactorMethod` enum('email') NOT NULL DEFAULT 'email',
	`verifiedEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_two_factor_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_two_factor_settings_userId_unique` UNIQUE(`userId`)
);
