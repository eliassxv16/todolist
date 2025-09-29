# Aplicación Lista de Tareas (To-Do List App)

## Descripción

Esta es una aplicación web de lista de tareas (To-Do List) con un diseño moderno. La app permite gestionar tareas diarias de manera eficiente, con soporte para categorías, fechas de vencimiento, filtros, edición, eliminación y modo oscuro. Todo el contenido está traducido al español para una experiencia localizada.

La aplicación es completamente frontend, no requiere servidor backend y se ejecuta directamente en el navegador. Utiliza LocalStorage para persistir las tareas entre sesiones.

## Características

- **Agregar Tareas**: Ingresa texto, selecciona categoría (Personal, Trabajo, Urgente) y fecha de vencimiento opcional.
- **Editar Tareas**: Haz clic en el ícono de edición para modificar el texto de una tarea.
- **Marcar como Completada**: Alterna el estado de completado con el botón de check.
- **Eliminar Tareas**: Usa el ícono de basura para remover tareas.
- **Filtros**: 
  - Todo: Muestra todas las tareas.
  - Pendiente: Solo tareas incompletas.
  - Completado: Solo tareas completadas.
  - Urgente: Solo tareas de categoría "Urgente".
- **Ordenamiento**: Las tareas se ordenan por fecha de vencimiento (completadas al final). Las vencidas se destacan en rojo.
- **Modo Oscuro**: Alterna entre tema claro y oscuro, persistente en LocalStorage.
- **Persistencia**: Las tareas se guardan automáticamente en el navegador.
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla con animaciones suaves.
- **Idioma**: Totalmente en español.

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica.
- **CSS3**: Estilos con glassmorphism (efectos de vidrio esmerilado), variables CSS para temas, transiciones y animaciones.
- **JavaScript (Vanilla)**: Lógica de la app, manipulación del DOM, eventos, LocalStorage y filtros/sorting.
- **Fuentes**: JetBrains Mono de Google Fonts para un aspecto moderno y legible.

No se usan frameworks externos; es una app ligera y autónoma.

## Instalación y Ejecución

1. Clona o descarga los archivos del proyecto en una carpeta local.
2. Abre `index.html` en cualquier navegador web moderno (Chrome, Firefox, Safari, Edge).
3. ¡Listo! La app se ejecuta sin necesidad de instalación o servidor.

Ejemplo de comando en terminal (si estás en el directorio del proyecto):
```
# En Windows
start index.html

# En macOS/Linux
open index.html
```

## Estructura de Archivos

- `index.html`: Estructura principal de la página.
- `styles.css`: Estilos y diseño.
- `script.js`: Lógica de la aplicación (agregar, editar, filtrar, etc.).
- `README.md`: Este archivo.

## Capturas de Pantalla y Demo

### Enlace de la Demo
(https://eliassxv16.github.io/todolist/)

### Vista Principal (Tema Claro)
![Vista Principal Clara](/img/claro.png)  

### Vista con Tareas (Tema Oscuro)
![Vista con Tareas Oscuro](/img/oscuro.png)  

## Posibles Mejoras

- Integración con backend (e.g., Firebase) para sincronización multi-dispositivo.
- Notificaciones push para fechas de vencimiento.
- Exportar/Importar tareas en JSON o CSV.
- Soporte para más categorías personalizables.
- Pruebas unitarias con Jest.

## Licencia

Este proyecto está bajo licencia MIT. Siéntete libre de usarlo, modificarlo o contribuir.

## Contribuir

¡Contribuciones son bienvenidas! Abre un issue o pull request en el repositorio.

Desarrollado por [Elias Halloumi El Amraoui].
