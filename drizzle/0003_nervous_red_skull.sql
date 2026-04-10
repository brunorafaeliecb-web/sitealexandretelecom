CREATE TABLE `content_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionKey` varchar(255) NOT NULL,
	`sectionName` varchar(255) NOT NULL,
	`sectionType` enum('hero','categories','plans','celular','streaming','providers','award','howItWorks','whyUs','links','cta','footer','navbar') NOT NULL,
	`content` json NOT NULL,
	`isVisible` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_sections_sectionKey_unique` UNIQUE(`sectionKey`)
);
--> statement-breakpoint
CREATE TABLE `dynamic_fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionId` int NOT NULL,
	`fieldKey` varchar(255) NOT NULL,
	`fieldLabel` varchar(255) NOT NULL,
	`fieldType` enum('text','textarea','number','color','image','url','email','select','boolean','json') NOT NULL,
	`fieldValue` text,
	`fieldOptions` json,
	`isRequired` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dynamic_fields_id` PRIMARY KEY(`id`)
);
