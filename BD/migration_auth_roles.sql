-- Execute uma vez em bancos criados antes da autenticação por papéis.
USE `rtual`;

ALTER TABLE `usuarios`
  ADD COLUMN `tipo` ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente'
  AFTER `nome`;

-- Promova explicitamente os usuários que devem acessar o painel.
-- Troque o e-mail antes de executar esta linha:
-- UPDATE `usuarios` SET `tipo` = 'administrador' WHERE `email` = 'admin@exemplo.com';
