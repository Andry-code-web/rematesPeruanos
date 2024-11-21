create database remajud;


-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bd_remates_inmuebles
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `remajud` DEFAULT CHARACTER SET utf8;
USE `remajud`;

-- -----------------------------------------------------
-- Table `usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombres_apellidos` VARCHAR(100) not NULL,
  `dni` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `confirmar_correo` VARCHAR(45) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `sexo` enum("masculino", "femenino", "otros")  NOT NULL,
  `estado_civil` enum("soltero", "casado", "divorsiado", "viudo" ) NOT NULL,
  `celular` VARCHAR(45) not NULL,
  `departamento` VARCHAR(45) not NULL,
  `provincia` VARCHAR(45) not NULL,
  `distrito` VARCHAR(45) not NULL,
  `direccion` VARCHAR(100) not NULL,
  `usuario` VARCHAR(45) not NULL,
  `contrasena` VARCHAR(45) not NULL,
  `terminos_condiciones` BOOLEAN NULL,
  `oportunidades` varchar(3) null,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `usuario_admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario_admin` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contrasena` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `remates`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `remates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ubicacion` VARCHAR(45) NULL,
  `precios` DECIMAL(10, 2) NULL,
  `fecha_hora` DATETIME NULL,
  `descripcion` TEXT NULL,
  `categoria` enum("departamento", "cochera", "terreno", "residencial", "casa", "local", "casa_playa", "terreno_urbano")  NULL,
  `N_baños` varchar(10)null,
  `N_habitacion` varchar(10)null,
  `pisina` enum("si", "no")null,
  `patio` varchar(10)null,
  `cocina` varchar(10)null,
  `cochera` enum("si" ,"no")null,
  `balcon` varchar(10)null,
  `jardin` varchar(10)null,
  `pisos` varchar(10)null,
  `comedor` varchar(10)null,
  `sala_start` varchar(10)null,
  `studio` varchar(10)null,
  `lavanderia` varchar(10)null,
  `fecha_activacion` datetime null,
  `hora_activacion` datetime null,
  `fecha_remate` datetime null,
  `hora_remate` datetime null,
  `usuario_admin_id` INT NOT NULL,
  `ganador` varchar(255)null,
  `like_count` int,
  `monto_venta` bigint null, 
  `estado` enum("activo", "en_curso", "finalizado")null,
  PRIMARY KEY (`id`),
  INDEX `fk_remates_usuario_admin1_idx` (`usuario_admin_id` ASC),
  CONSTRAINT `fk_remates_usuario_admin1`
    FOREIGN KEY (`usuario_admin_id`)
    REFERENCES `usuario_admin` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `visitas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `visitas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `remate_id` INT NOT NULL,
  `usuarios_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_visitas_usuarios_idx` (`usuarios_id` ASC),
  INDEX `fk_visitas_remate_idx` (`remate_id` ASC),
  CONSTRAINT `fk_visitas_usuarios`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitas_remate`
    FOREIGN KEY (`remate_id`)
    REFERENCES `remates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuarios_id` INT NOT NULL,
  `remates_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_likes_usuarios1_idx` (`usuarios_id` ASC),
  INDEX `fk_likes_remates1_idx` (`remates_id` ASC),
  CONSTRAINT `fk_likes_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_likes_remates1`
    FOREIGN KEY (`remates_id`)
    REFERENCES `remates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ofertas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ofertas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `monto_oferta` DECIMAL(10, 2) NULL,
  `fecha_subasta` DATE NULL,
  `hora_subasta` TIME NULL,
  `usuarios_id` INT NOT NULL,
  `remates_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ofertas_usuarios1_idx` (`usuarios_id` ASC),
  INDEX `fk_ofertas_remates1_idx` (`remates_id` ASC),
  CONSTRAINT `fk_ofertas_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ofertas_remates1`
    FOREIGN KEY (`remates_id`)
    REFERENCES `remates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mensajes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mensajes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ofertas_subasta` VARCHAR(45) NULL,
  `monto` DECIMAL(10, 2) NULL,
  `usuarios_id` INT NOT NULL,
  `remates_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_mensajes_usuarios1_idx` (`usuarios_id` ASC),
  INDEX `fk_mensajes_remates1_idx` (`remates_id` ASC),
  CONSTRAINT `fk_mensajes_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mensajes_remates1`
    FOREIGN KEY (`remates_id`)
    REFERENCES `remates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `img_inmuebles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `img_inmuebles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `imagenes_inmueble` BLOB NULL,
  `remates_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_img_inmuebles_remates1_idx` (`remates_id` ASC),
  CONSTRAINT `fk_img_inmuebles_remates1`
    FOREIGN KEY (`remates_id`)
    REFERENCES `remates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `anexos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `anexos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `papeles_inmuebles` BLOB NULL,
  `remates_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_anexos_remates1_idx` (`remates_id` ASC),
  CONSTRAINT `fk_anexos_remates1`
    FOREIGN KEY (`remates_id`)
    REFERENCES `remates` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
