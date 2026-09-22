-- Script de criação do banco de dados do R.tual Hair Care
-- Gerado a partir da estrutura atual do banco local (MySQL/MariaDB - XAMPP)

CREATE DATABASE IF NOT EXISTS `rtual`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `rtual`;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(50) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `nome` VARCHAR(100) DEFAULT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
