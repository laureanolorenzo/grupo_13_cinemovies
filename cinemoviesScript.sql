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
  
INSERT INTO peliculas (titulo,fecha_estreno,anio,es_estreno,descripcion,puntuacion,clasificacion,duracion,origen,poster,banner,awards,idioma,id_categoria_pelicula,local,tmdb_id,director,reparto)
VALUES 
('Me gusta cuando hablas','2024-03-07','2024','1','Me gusta cuando hablas, recorre un día en la vida de distintas mujeres y diversidad
es feministas: una poeta erótica, una influencer, una activista ambiental, una trabajadora de la tierra, la ceo de una empresa, una am
a de casa. ¿Cuál es la imagen que...','0.00','N/A','70','Argentina','https://image.tmdb.org/t/p/original/sMp6GO4LbhLpnJh4v2pQHdA2i8Q.jpg',
null,'N/A','Español','6','0','1254932','Silvina Estévez','Silvina Estévez'),
('Oppenheimer','2023-07-19','2023','0','Película sobre el físico J. Robert Oppenheimer y su papel como desarrollador de la bomba atómi
ca. Basada en el libro "American Prometheus: The Triumph and Tragedy of J. Robert Oppenheimer" de Kai Bird y Martin J. Sherwin.','8.12
','+13','181','United Kingdom, United States of America','https://image.tmdb.org/t/p/original/ncKCQVXgk4BcQV6XbvesgZ2zLvZ.jpg',null,'N
ominated for 13 Oscars. 326 wins & 362 nominations total','Inglés','7','0','872585','Christopher Nolan','Cillian Murphy, Emily Blunt, 
Matt Damon, Robert Downey Jr., Florence Pugh'),
('Dune','2021-09-15','2021','0','En un lejano futuro, la galaxia conocida es gobernada mediante un sistema feudal de casas nobles bajo
 el mandato del Emperador. Las alianzas y la política giran entorno a un pequeño planeta, Dune,  del que extrae la "especia melange", 
la materia prim','7.79','13','155','United States of America','https://image.tmdb.org/t/p/original/hIEKzq0klqtz1H3S7QxzH4mMbvT.jpg',null,'Won 6 Oscars. 173 wins & 294 nominations total','Inglés','15','0','438631','Denis Villeneuve','Timothée Chalamet, Rebecca Ferguson
, Oscar Isaac, Josh Brolin, Stellan Skarsgård'),
('The Marvels','2023-11-08','2023','0','Cuando sus obligaciones la envían a un agujero de gusano vinculado a un revolucionario kree, l
os poderes de Carol Danvers, la capitana Marvel, se entremezclan con los de Kamala Khan, también conocida como la Sra. Marvel y la sob
rina de Carol, ahora a...','6.21','PG-13','105','United States of America','https://image.tmdb.org/t/p/original/cLSNV04YUkTL33fzXY1owroZQ
au.jpg',null,'3 wins & 9 nominations','Inglés','15','0','609681','Nia DaCosta','Brie Larson, Teyonah Parris, Iman Vellani, Zawe Ashton
, Samuel L. Jackson'),
('Kung Fu Panda 4','2024-03-02','2024','1','Po se prepara para ser el líder espiritual del Valle de la Paz, buscando un sucesor como G
uerrero Dragón. Mientras entrena a un nuevo practicante de kung fu, enfrenta al villano llamado "el Camaleón", que evoca villanos del 
pasado, desafiando todo lo','6.90','N/A','94','China, United States of America','https://image.tmdb.org/t/p/original/bqe5pdLIoLeZSszA8
N5ZvoIS4aB.jpg','https://image.tmdb.org/t/p/original/gJL5kp5FMopB2sN4WZYnNT5uO0u.jpg','N/A','Inglés','1','0','1011985','Mike Mitchell'
,'Jack Black, Bryan Cranston, Dustin Hoffman, Awkwafina, Viola Davis'),
('Dune: Parte dos','2024-02-27','2024','1','Sigue el viaje mítico de Paul Atreides mientras se une a Chani y los Fremen en una guerra 
de venganza contra los conspiradores que destruyeron a su familia. Al enfrentarse a una elección entre el amor de su vida y el destino
 del universo conocido, Pa...','8.40','+13','167','United States of America','https://image.tmdb.org/t/p/original/v2NN1TMK3ifuiEyawa3ukkc
SOUQ.jpg','https://image.tmdb.org/t/p/original/8uVKfOJUhmybNsVh089EqLHUYEG.jpg','2 nominations','Inglés','15','0','693134','Denis Vill
eneuve','Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Josh Brolin'),
('Robot Dreams','2023-10-20','2023','0','DOG es un perro solitario que vive en Manhattan. Un día decide construirse un robot, un amigo
. Su amistad crece, hasta hacerse inseparables, al ritmo del Nueva York de los ochenta. Una noche de verano, Dog con gran pena, se ve 
obligado a abandonar a ','7.34','ATP','102','France, Spain','https://image.tmdb.org/t/p/original/qLtK6DFeuJNuB3THGVDklirhQ8u.jpg',null
,'Nominated for 1 Oscar. 19 wins & 43 nominations total','Español','3','0','838240','Pablo Berger','Ivan Labanda, Tito Trifol, Rafa Ca
lvo, José García Tos, José Luis Mediavilla'),
('Madame Web','2024-02-14','2024','1','Una historia de origen de la clarividente conocida como Madame Web, cuyas habilidades psíquicas
 le permiten ver dentro del mundo de las arañas.','5.27','N/A','116','United States of America','https://image.tmdb.org/t/p/original/8
enikn5rdpsVyQd1qnpOqpACZqO.jpg','https://image.tmdb.org/t/p/original/zAepSrO99owYwQqi0QG2AS0dHXw.jpg','N/A','Inglés','1','0','634492',
'S.J. Clarkson','Dakota Johnson, Sydney Sweeney, Isabela Merced, Celeste O Connor, Tahar Rahim'),
('Chicas malas','2024-01-10','2024','1','La nueva estudiante Cady Heron es bienvenida a la cima de la cadena social por el elitista gr
upo de chicas populares llamado "Las Plásticas", gobernado por la intrigante abeja reina Regina George y sus secuaces Gretchen y Karen
. Sin embargo, cuando C','6.24','+13','113','United States of America','https://image.tmdb.org/t/p/original/OcZPwR89CM8ay8asq3J4XFeKII
.jpg','https://image.tmdb.org/t/p/original/dmiN2rakG9hZW04Xx7mHOoHTOyD.jpg','2 nominations','Inglés','4','0','673593','Samantha Jayne'
,'Angourie Rice, Reneé Rapp, Auli i Cravalho, Jaquel Spivey, Avantika'),
('Los que se quedan','2023-10-27','2023','0','A nadie le gusta el profesor Paul Hunham (Giamatti), ni a sus alumnos, ni a sus compañer
os, ni al director de la escuela secundaria donde trabaja, a todos les resulta exasperante su pomposidad y rigidez. Sin familia y sin 
ningún lugar a donde ir dura','7.77','+13','133','United States of America','https://image.tmdb.org/t/p/original/aZj21Kcmazecm6VDBn4bY
U4evi3.jpg',null,'Nominated for 5 Oscars. 129 wins & 196 nominations total','Inglés','4','0','840430','Alexander Payne','Paul Giamatti
, Dominic Sessa, Da Vine Joy Randolph, Carrie Preston, Brady Hepner'),
('Vidas pasadas','2023-06-02','2023','0','La familia de Nora emigra a Canadá cuando ella tiene 10 años. Pierde el contacto con su amor
 de la infancia. Muchos años después, cuando Nora está estudiando teatro en Nueva York, se reencuentra con él online.','7.79','ATP','1
06','South Korea, United States of America','https://image.tmdb.org/t/p/original/jWrJrLMD7SZoxc65KSYej6QOw12.jpg',null,'Nominated for 
2 Oscars. 77 wins & 219 nominations total','Inglés','7','0','666277','Celine Song','Greta Lee, Teo Yoo, John Magaro, Moon Seung-ah, Yi
m Seung-min'),
('Ferrari','2023-12-14','2023','1','Verano de 1957. El ex piloto de carreras, Ferrari, está en crisis. La bancarrota acecha a la empre
sa que él y su esposa, Laura, construyeron de la nada diez años antes. Su tormentoso matrimonio se encuentra en medio de una gran cris
is, mientras lidia','6.61','N/A','131','United Kingdom, United States of America','https://image.tmdb.org/t/p/original/hRrg9hbdNEEpPXk
gly77FxDYpoD.jpg','https://image.tmdb.org/t/p/original/du11oPPbEoDnUpiREO5tUg47rJd.jpg','Nominated for 1 BAFTA Award4 wins & 38 nomina
tions total','Inglés','10','0','365620','Michael Mann','Adam Driver, Penélope Cruz, Shailene Woodley, Patrick Dempsey, Jack O Connell'),
('Desconocidos','2023-12-22','2023','1','Adam es un guionista que, tras un encuentro casual con su misterioso vecino, regresa a la cas
a de su infancia donde descubre que sus padres, fallecidos hace mucho tiempo, están vivos y tienen la misma edad que el día de su muer
te.','7.51','N/A','106','United Kingdom, United States of America','https://image.tmdb.org/t/p/original/4k6Lqd28DgIog9GqTjDskcj60oG.jp
g','https://image.tmdb.org/t/p/original/2GzgongTSptjSkT7iCoXUcGIVB9.jpg','Nominated for 6 BAFTA 22 wins & 99 nominations total','Inglé
s','14','0','994108','Andrew Haigh','Andrew Scott, Paul Mescal, Jamie Bell, Claire Foy, Carter John Grout'),
('Secretos de un escándalo','2023-11-16','2023','1','Veinte años después de que el mediático romance entre Gracie Atherton-Yu (Juliann
e Moore) y su joven marido Joe escandalizara al país, con sus hijos a punto de graduarse en el instituto, se va a rodar una película s
obre su historia. La actriz Elizabe','6.78','+13','117','United States of America','https://image.tmdb.org/t/p/original/1UigK1aTcKR9NS
oTghTJdsOYvFu.jpg','https://image.tmdb.org/t/p/original/g038qLsW7465wJ8WSEN0yHnBW2X.jpg','Nominated for 1 Oscar. 36 wins & 179 nominat
ions total','Inglés','7','0','839369','Todd Haynes','Natalie Portman, Julianne Moore, Chris Tenzis, Charles Melton, Andrea Frankle'),   
('La Renga: Totalmente poseídos','2024-03-07','2024','1','La Renga estrena su primera película documental, basada en la vuelta a los e
scenarios de la banda en 2022 para la gira presentación del disco Alejado de la Red, con un viaje en moto que los llevaría a recorrer 
más de cinco mil kilómetros para dar cua...','0.00','N/A','93','Argentina','https://image.tmdb.org/t/p/original/e0unTzEcZe1xOWNZvPLiD1yvR
co.jpg',null,'N/A','Español','6','0','1249452','Gustavo Nápoli','Gustavo Nápoli, Gabriel Iglesias, Jorge Iglesias, Manuel Varela'),    
("Cinderella's Curse",'2024-02-29','2024','1','','10.00','+16','0','United Kingdom','https://image.tmdb.org/t/p/original/vN0tdf6ane2Db
gCxnDFT0rQopLy.jpg','https://image.tmdb.org/t/p/original/orTQxcx2aoNpx1DIKTjBzpzvzd0.jpg','N/A','Inglés','11','0','1130053','Louisa Wa
rren','Kelly Rian Sanson, Chrissie Wunna, Natasha Tosini, Lauren Budd, Danielle Scott'),
('Cierren los ojos: La final eterna','2024-02-29','2024','1','A cinco años del histórico 9 de diciembre de 2018, un documental único p
ara rememorar la final eterna de Madrid.','0.00','N/A','80','Argentina','https://image.tmdb.org/t/p/original/69Dd9fz1WND8jBLAA7ce1dxjK
UY.jpg','https://image.tmdb.org/t/p/original/cBAS0ndJyXYwhaNE9vU2DZy3QsC.jpg','N/A','Español','6','0','1202087','Silvina Dell Occhio',
'Marcelo Gallardo, Leonardo Ponzio, Gonzalo "Pity" Martínez, Juan Fernando Quintero, Lucas Pratto'),
('Los Xey: una historia de película','2024-03-07','2024','1','La increíble historia de Los Xey, un grupo musical nacido en San Sebasti
án, España, en 1940, que alcanzó y mantuvo un extraordinario éxito mundial hasta su disolución en 1961.','0.00','N/A','96','Argentina,
 Mexico, Spain','https://image.tmdb.org/t/p/original/5Z8d4CeNQFvItBmPJ03VQpOe5qD.jpg','https://image.tmdb.org/t/p/original/58rVFsqjBRL
QPliOHnFMTFAnqat.jpg','N/A','Español','6','0','1038877','Eneko Olasagasti','José Felipe Auzmendi, Celia Gámez, Juan Domingo Perón, Fra
ncisco Franco, Fulgencio Batista'),
('Ya no te acercas formando un refugio con los brazos','2024-03-05','2024','1','Cortometraje ISCAA por Josefina Testa','0.00','N/A','1
','Argentina','https://image.tmdb.org/t/p/original/AdilWA30GWgPaWOIFRKw0e3OgPD.jpg','https://image.tmdb.org/t/p/original/naLOel8QATJ64
uISfOWrMWpiT2k.jpg','N/A','Español','7','0','1256382','Josefina Testa','Lara Chia'),
('Blues de la civilización','2024-02-29','2024','1','La secretaria del director de la AIC, es hallada muerta. Se presume que fue un su
icidio. El detective José Beltrán debe investigar el hecho. Sin embargo, lo ocurrido provoca ecos en su pasado, un pasado que Beltrán 
intenta olvidar. Sumergido en una r','0.00','N/A','68','Argentina','https://image.tmdb.org/t/p/original/jB2S28TqFD6s1ioYr7nMJqdwjPf.jp
g','https://image.tmdb.org/t/p/original/nJ4mZD9arUZYOIkcYp5SDsd9j3B.jpg','N/A','Español','5','0','1251477','Guido Ferrari','Alfredo Ca
stellani, Silvina Sinatra, Matías Flores, José Luciano González, Eduardo Perilli'),
('Paisaje','2024-02-15','2024','1','Una joven pareja que transita los 8 meses de embarazo decide regresar de sus vacaciones familiares
 de manera impulsiva. A mitad de camino su auto se rompe y quedan varados en medio de la montaña. En el trance de buscar un refugio, l
legan a un parador','0.00','N/A','89','','https://image.tmdb.org/t/p/original/7eJjDsMiX7LCcUlfe7VQT3KTAkS.jpg',null,'N/A','Español','7
','0','1245241','Matías Rojo','Juan Luppi, Ailín Salas, Dady Brieva, María Ucedo, Francisco Tonidandel'),
('HAM: Historia del agua de Mendoza','2024-02-29','2024','1','Durante los últimos días de 2019, el gobierno local en acuerdo con la op
osición derogan la ley N° 7722, que impide el uso de sustancias tóxicas en la minería. Esto desató la lucha del pueblo mendocino en de
fensa del agua y obligó a los poderes concen','0.00','N/A','98','Argentina','https://image.tmdb.org/t/p/original/6c0MoXdEYiPgYGPAEzwJo
RZVgAo.jpg',null,'N/A','Español','6','0','1251960','Bernardo Blanco','Bernardo Blanco'),
('El banquete','2024-02-08','2024','1','Un actor interpreta a un fiscal que da la vida por la República. Un sindicalista entrega a una
 menor de edad a un diputado para luego extorsionarlo. Una periodista dispuesta a todo con tal de que no la saquen de una pantalla de 
televisión. Y un joven','0.00','N/A','102','Argentina','https://image.tmdb.org/t/p/original/sJaaBO1iinrX1FD8VgplQmSss6O.jpg',null,'N/A
','Español','17','0','1242045','Federico Badía','Gabriel Goity, Emiliano Carrazzone, Agustina Fernández Cambra, Manuel Martínez Sobrad
o, Camila Flamenco'),
('Luces azules','2024-02-22','2024','1','En una casa de clase media alta de la Ciudad de Buenos Aires, un grupo de amigos se reúne par
a festejar el cumpleaños 70 de Alejandro. Él está casado con Pedro y mantienen una relación de hace más de 30 años. Los diversos invit
ados son una pareja het','0.00','N/A','101','','https://image.tmdb.org/t/p/original/rtto0ckylNxuTDH8kAOVqoGaeE8.jpg',null,'N/A','Españ
ol','7','0','1229873','Lucas Santa Ana','Ernesto Larresse, Claudio Da Passano, Osmar Núñez, Estela Garelli, Fernando Dente'),
('Indivisible','2024-02-16','2024','1','','0.00','ATP','6','','https://image.tmdb.org/t/p/original/u5Dto5yxio1ImEfZFLQrj9pA08d.jpg',null,'N/A','Español','13','0','1249280','Pedro Bitti','Valentino Rossi, Pedro Bitti, Magalí Damiani'),
('Migración: un viaje patas arriba','2023-12-06','2023','1','Una familia de patos intenta convencer a su sobreprotector padre para que se vayan a las vacaciones de su vida.','7.55','N/A','83','United States of America, Canada, France','https://image.tmdb.org/t/p/original/brAqSBoSXzxEYV6rGYwbRvhlXCE.jpg','https://image.tmdb.org/t/p/original/meyhnvssZOPPjud4F1CjOb4snET.jpg','1 win & 6 nominations','Inglés','3','0','940551','Benjamin Renner','Kumail Nanjiani, Elizabeth Banks, Caspar Jennings, Tresi Gazal, Awkwafina');