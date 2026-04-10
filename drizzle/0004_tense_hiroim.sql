CREATE TABLE `cep_search_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cep` varchar(10) NOT NULL,
	`logradouro` text,
	`bairro` varchar(100),
	`localidade` varchar(100),
	`uf` varchar(2),
	`regiao` varchar(50),
	`ddd` varchar(3),
	`ibge` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cep_search_history_id` PRIMARY KEY(`id`)
);
