CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`business` varchar(180) NOT NULL,
	`city` varchar(160) NOT NULL,
	`invests` varchar(120) NOT NULL,
	`objective` varchar(160) NOT NULL,
	`budget` varchar(120) NOT NULL,
	`source` varchar(120) NOT NULL DEFAULT 'kriaat-trafego-pago',
	`page` varchar(255),
	`utmSource` varchar(160),
	`utmMedium` varchar(160),
	`utmCampaign` varchar(160),
	`utmContent` varchar(160),
	`consent` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
