DROP SCHEMA IF EXISTS  cinemovies;
CREATE SCHEMA cinemovies;
USE cinemovies;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
   `id` INT AUTO_INCREMENT,
   `nombre` VARCHAR(70),
   `foto` VARCHAR(255),
   `estado` FLOAT,
   `id_rol` INT,
   `email` VARCHAR(70),
   `password` VARCHAR(70),
   PRIMARY KEY (`id`)
);

CREATE TABLE `peliculas` (
   `id` INT AUTO_INCREMENT,
   `titulo` VARCHAR(255),
   `anio` INT,
   `es_estreno` TINYINT,
   `descripcion` VARCHAR(255),
   `director` VARCHAR(255),
   `reparto` VARCHAR(255),
   `puntuacion` FLOAT,
   `clasificacion` VARCHAR(100),
   `duracion` INT,
   `origen` VARCHAR(255),
   `poster` VARCHAR(255),
   `banner` VARCHAR(255),
   `awards` VARCHAR(255),
   `idioma` VARCHAR(20),
   `fecha_estreno` DATE,
   `id_categoria_pelicula` INT,
   `tmdb_id` INT UNIQUE,
   `local` TINYINT,
   PRIMARY KEY (`id`)
);

CREATE TABLE `roles` (
   `id` INT AUTO_INCREMENT,
   `tipo` VARCHAR(25),
   PRIMARY KEY (`id`)
);

CREATE TABLE `categorias_peliculas` (
   `id` INT AUTO_INCREMENT,
   `categoria` VARCHAR(25),
   `titulo` VARCHAR(50),
   `poster` VARCHAR(100),
   PRIMARY KEY (`id`)
);

CREATE TABLE `funciones` (
   `id` INT AUTO_INCREMENT,
   `id_usuario` INT,
   `id_pelicula` INT,
   `fecha` DATE,
   `sala` INT,
   `precio_boleto` DECIMAL,
   PRIMARY KEY (`id`)
);

ALTER TABLE `usuarios` ADD CONSTRAINT `FK_070d4b50-c0e0-4df8-a551-15179f395f22` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id`) ON DELETE SET NULL ;

ALTER TABLE `peliculas` ADD CONSTRAINT `FK_03106704-7761-4429-9d39-b0aa6c1fd5ab` FOREIGN KEY (`id_categoria_pelicula`) REFERENCES `categorias_peliculas`(`id`) ON DELETE SET NULL ;

ALTER TABLE `funciones` ADD CONSTRAINT `FK_354ba8a2-90d7-4fda-8cc2-1e1a78fe4f2d` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas`(`id`)  ;

ALTER TABLE `funciones` ADD CONSTRAINT `FK_38b8a0fb-92cb-4423-aa9a-014e09f8231f` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`)  ;


INSERT INTO roles (tipo)
VALUES
('admin'),
('invitado');

INSERT INTO categorias_peliculas (titulo,categoria, poster)
VALUES 
  ('Acción','accion', 'https://image.tmdb.org/t/p/original/br6krBFpaYmCSglLBWRuhui7tPc.jpg'),
  ('Aventura','aventura','https://image.tmdb.org/t/p/original/HPEXPFY5B2TWyC1mKoUtz4fNsB.jpg'),
  ('Animación', 'animacion','https://image.tmdb.org/t/p/original/CtISczftMz6g7kyk5uLxBben8b.jpg'),
  ('Comedia','comedia','https://image.tmdb.org/t/p/original/hKlpYtDLBtJEvYVvaUIq39Gh6rI.jpg'),
  ('Crimen','crimen','https://image.tmdb.org/t/p/original/8QDQExnfNFOtabLDKqfDQuHDsIg.jpg'),
  ('Documental','documental','https://image.tmdb.org/t/p/original/nZbLCbRoP6iJq5sr8daHQzjnzFh.jpg'),
  ('Drama','drama','https://image.tmdb.org/t/p/original/4Yy63A10sPQZ9kd2kWj13S4WUkn.jpg'),
  ('Familia','familiar','https://image.tmdb.org/t/p/original/6eHcR7zwvNSvkOl9jbctU0lvZQ1.jpg'),
  ('Fantasía','fantasia','https://image.tmdb.org/t/p/original/p4BabO5lvfXnIsVIBLDpN2wLORz.jpg'),
  ('Historia','historia','https://image.tmdb.org/t/p/original/re6SSQS1HgBGG9AMiNuPGISOfMx.jpg'),
  ('Terror', 'terror','https://image.tmdb.org/t/p/original/o0ndJZaa9ZFFfpnl1IejajXv0II.jpg'),
  ('Música','musica','https://image.tmdb.org/t/p/original/sL32IZkyjlF7otj5vcUxiKSKzg5.jpg'),
  ('Misterio','misterio','https://image.tmdb.org/t/p/original/kWz6Aa2chxcNUgAQNooYS4yyLkC.jpg'),
  ('Romance','romance','https://image.tmdb.org/t/p/original/wzpwCQF9et6ltaw21tSI2gl9wXa.jpg'),
  ('Ciencia ficción','sci-fi','https://image.tmdb.org/t/p/original/nrSaXF39nDfAAeLKksRCyvSzI2a.jpg'),
  ('Película de TV','tv','https://image.tmdb.org/t/p/original/d3Nw4grn02Ca5AmOiRcZLgrAL2k.jpg'),
  ('Suspense','suspenso','https://image.tmdb.org/t/p/original/eJuoXzQPnBeiezrRsQCMjetS1fM.jpg'),
  ('Bélica','belica','https://image.tmdb.org/t/p/original/axdhbcZeOsfX3ZpwtgdgPIjc06l.jpg'),
  ('Western','western','https://image.tmdb.org/t/p/original/naaYX64yMGzEFsATOFQDaxxQWbJ.jpg');