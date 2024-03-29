### La retrospectiva

A esta altura ya tenemos un sprint terminado. Eso quiere decir que tienen evidencia de cómo
funcionó el grupo durante estas semanas y es un muy buen momento para hacer un análisis.
La retrospectiva se centra en mejorar como equipo. Los invitamos a que implementen la
dinámica de la estrella de mar que busca resaltar aquello que hay que:

1. Comenzar a hacer.
2. Hacer más.
3. Continuar haciendo.
4. Hacer menos.
5. Dejar de hacer.

—--------------------------------------------------------------------------
A nuestro equipo le sirvió bastante la devolución de Mati. Decidimos que para este sprint la comunicación debe ser más fluida y organizada para poder entregar los sprints a tiempo.

##### Lo que hicimos bien:
* Creemos que cada miembro fue responsable a la hora de trabajar y contribuir a que se avance con las tareas.
* Las reuniones sirvieron para completar las tareas (logramos usar el tiempo en forma eficiente cuando nos reunimos).
Lo que hicimos mal:
* No definimos reuniones semanales fijas, sino que adaptamos fecha y horario a la circunstancia de acuerdo a los tiempos de cada uno.
Entregar el sprint sobre la fecha.
##### Lo que deberíamos empezar a hacer:
* Definir  mejor las tareas antes de lanzarnos a trabajar.
* Dividir más las tareas de acuerdo a las habilidades y horarios de cada miembro.


##### Lo que deberíamos dejar de hacer:
* No procrastinar con las reuniones y tener fechas definidas de antemano (para entregar el sprint con más margen de tiempo).

—--------------------------------------------------------------------------
### Retrospectiva Sprint 3 

La devolución de Mati nos motivó a seguir esforzándonos, aunque el módulo se complicó un poco. Incluso algunos compañeros dejaron el curso y eso nos complicó un poco.

#### Lo que hicimos bien:
* Aportamos ideas creativas desde cada perspectiva
* Mantuvimos buena comunicación incluso en los momentos más arduos.
* Apoyarnos entre nosotros cuando surge alguna dificultad.

#### Lo que hicimos mal:
* Seguimos sin reunirnos en forma periódica (sin definir fechas semanales), aunque sí tuvimos varias conferencias.
* No llegamos a completar el sprint a tiempo.
* Nos atrasamos algo con el curso en sí, lo que complicó también el proyecto en grupo
* Lo que deberíamos empezar a hacer:
* Definir  mejor las tareas antes de lanzarnos a trabajar.
* Dividir más las tareas de acuerdo a las habilidades y horarios de cada miembro.
* Programar reuniones semanales estrictas.
* Empezar a encarar los sprints desde el primer momento para que no se acumule al final.
* Buscar ayuda externa ante ciertas complicaciones


Lo que deberíamos dejar de hacer:
* No procrastinar con las reuniones y tener fechas definidas de antemano (para entregar el sprint con más margen de tiempo).


—--------------------------------------------------------------------------
### Retrospectiva Sprint 4 

La devolución de Mati nos hizo ver que estuvimos medio flojos en el sprint 3,  así que intentamos corregir lo que faltaba antes de seguir con el 4.

### Lo que hicimos bien:
* Nos dividimos las tareas más eficientemente.
* Mantuvimos buena comunicación incluso en los momentos más arduos.
* Trabajamos más en forma conjunta (en lugar de asincrónica).

### Lo que hicimos mal:
* Seguimos sin reunirnos en forma periódica (sin definir fechas semanales), aunque sí tuvimos varias conferencias, denuevo.
* No llegamos a completar el sprint a tiempo? Quizás, se entrega al momento de escribirse esta retrospectiva.
* Nos atrasamos algo con el curso en sí, lo que complicó también el proyecto en grupo (el módulo 5 nos complicó denuevo).
### Lo que deberíamos empezar a hacer:
* Planificar con mayor anticipación, incluyendo aspectos técnicos que luego haráb más o menos difícil avanzar con el proyecto (ejemplo la estructura del sitio nos complicó un poco el tema de las rutas).
* Programar reuniones semanales estrictas.
* Empezar a encarar los sprints desde el primer momento para que no se acumule al final. Nos cuesta este punto...
* Buscar ayuda externa ante ciertas complicaciones: por suerte pudimos resolver la mayoría de dificultades técnicas que encontramos.
* 
### Lo que deberíamos dejar de hacer:
* Procrastinar con las reuniones. 
* No tener fechas definidas de antemano (para entregar el sprint con más margen de tiempo, de nuevo).
* Lanzarnos a codear sin definir bien las tareas a realizar. 

### Aclaraciones sobre la entrega:
* Agregamos un botón para "crear película" que sirve para acceder a la creación de un producto nuevo. 
* No tenemos la ruta "/productos" (por el propio diseño de nuestro negocio). Las rutas del CRUD parten del home, y se acceden a través de la vista de cada producto específico (por ejemplo, el usuario admin puede ir a una categoría, acceder a la vista de una película en particular, y cilckear en editar o borrar).
* Seguimos trabajando en cuestiones de "calidad de experiencia" (de a poco) que está relacionada también con aspectos de sprints anteriores. 

—--------------------------------------------------------------------------

### Retrospectiva Sprint 5

Se nos facilitó un poco la tarea (especialmente en comparación con el sprint anterior). Obviamente falta mucho por mejorar. 

### Lo que hicimos bien:
* Nos concentramos en las tareas que pedía el sprint
* Mantuvimos buena comunicación incluso en los momentos más arduos.

### Lo que hicimos mal:
* Seguimos sin reunirnos en forma periódica (sin definir fechas semanales), aunque sí tuvimos varias conferencias, denuevo.
* No llegamos a completar el sprint a tiempo, otra vez.
* No dividimos las tareas equitativamente y a tiempo.
### Lo que deberíamos empezar a hacer:
* Seguimos sin planificar.
* Definir fechas regulares para reunirnos.
* Apurarnos para encarar los sprints.
* Implementar funcionalidades extra (más allá de lo que pide el sprint).
### Lo que deberíamos dejar de hacer:
* Procrastinar (en general).
* Ponernos a trabajar sin definir bien las tareas (de nuevo).
### Aclaraciones sobre la entrega:
* DUDA: En un primer lugar usamos la propia cookie de session para extender la sesión. Pero tiene el problema de que se termina al reiniciar el servidor. (Es lo que está en el controller "userController"). Pero la idea es hacerlo con cookieParser en los próximos días (ya funciona, menos cuando se reinicia).
* Implementamos express-validator y multer en el proceso de registro de usuarios.
* Contruimos el session (proceso de login). Las páginas de registro y login dejan de ser accesibles en el header, y ahora hay una de "perfil" (que falta mejorar bastante) y una de "cerrar sesión".
* Hicimos algunos cambios de estilo (en especial en categorías).

