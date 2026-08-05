# Plan de acción de Techfix

El trabajo se dividirá en etapas cortas, cerradas y verificables. Cada etapa debe dejar la plataforma en un estado utilizable antes de comenzar la siguiente.

## Etapa 0 — Recuperar una base desplegable

**Objetivo:** conseguir que el código actual pueda instalarse, compilarse y publicarse de forma reproducible.

- Clonar y preparar el entorno local.
- Fijar la versión de Node.js.
- Resolver el despliegue fallido.
- Configurar las rutas SPA para que `/admin` no devuelva un error 404.
- Eliminar el archivo `App.jsx` obsoleto de la raíz.
- Alinear Tailwind y limpiar configuraciones contradictorias.
- Agregar verificaciones mínimas de lint y build.

**Criterio de finalización:** `/`, `/login` y `/admin` cargan correctamente en un despliegue nuevo.

## Etapa 1 — Blindar Supabase

**Objetivo:** convertir la base remota en infraestructura versionada y segura.

- Inventariar tablas, funciones y políticas existentes.
- Crear migraciones reproducibles.
- Versionar políticas RLS, restricciones e índices.
- Definir permisos claros para visitantes, clientes y administradores.
- Probar accesos anónimos, autenticados y administrativos.

**Criterio de finalización:** ningún cliente puede leer o modificar información que no le corresponde.

## Etapa 2 — Flujo principal de tickets

**Objetivo:** dejar funcional el corazón operativo del negocio.

- Incorporar validación robusta en el formulario.
- Crear tickets de manera segura.
- Generar códigos de seguimiento no predecibles.
- Mostrar una confirmación clara al usuario.
- Manejar errores y reintentos.
- Probar el flujo completo.

**Criterio de finalización:** un usuario puede registrar un ticket y un administrador autorizado puede verlo de manera confiable.

## Etapa 3 — Panel administrativo

**Objetivo:** permitir la operación diaria sin depender de controles visuales inseguros.

- Implementar autenticación y autorización efectivas.
- Gestionar estados de tickets.
- Registrar un historial básico de cambios.
- Agregar filtros y búsqueda.
- Proteger los datos personales.
- Controlar la exportación de información.

**Criterio de finalización:** solamente un administrador autorizado puede gestionar tickets.

## Etapa 4 — Notificaciones

**Objetivo:** enviar correos sin convertir la plataforma en un relay de spam.

- Rediseñar la Edge Function de notificaciones.
- Recibir únicamente un identificador de ticket desde el cliente.
- Obtener los datos desde el servidor.
- Validar el usuario, su rol y la transición de estado.
- Incorporar limitación de frecuencia y CAPTCHA donde corresponda.
- Verificar correctamente las respuestas de Resend.

**Criterio de finalización:** la creación de tickets y los cambios de estado generan correos seguros y trazables.

## Etapa 5 — Asistente con Gemini

**Objetivo:** recuperar el chatbot sin exponer credenciales.

- Mover la integración con Gemini a una función del servidor.
- Rotar cualquier clave que haya sido expuesta en el cliente.
- Limitar el consumo y el tamaño de los mensajes.
- Controlar errores, abuso y costos.
- Evitar el envío innecesario de datos personales.

**Criterio de finalización:** no existe ninguna clave privada dentro del bundle público.

## Etapa 6 — Calidad y automatización

**Objetivo:** impedir que una mejora rompa funcionalidades existentes.

- Resolver dependencias vulnerables.
- Reemplazar `xlsx` si no puede corregirse.
- Agregar pruebas unitarias y de integración.
- Incorporar pruebas de humo para los flujos principales.
- Crear CI para lint, build, pruebas y auditoría.
- Proteger la rama `main`.

**Criterio de finalización:** cada cambio recibe validación automática antes de integrarse.

## Etapa 7 — Producto y experiencia

**Objetivo:** mejorar la plataforma sobre fundamentos confiables.

- Revisar catálogo, carrito y checkout por WhatsApp.
- Mejorar accesibilidad y experiencia móvil.
- Optimizar rendimiento y SEO.
- Diseñar estados vacíos, de carga y de error.
- Incorporar métricas y observabilidad.
- Actualizar la documentación operativa.

**Criterio de finalización:** los recorridos públicos y administrativos son claros, rápidos y medibles.

## Reglas de trabajo

Cada etapa debe tener:

- un alcance pequeño;
- criterios de aceptación explícitos;
- verificación propia;
- un commit o pull request independiente;
- posibilidad de revertirse sin afectar las etapas siguientes.

No se mezclarán cambios de seguridad, diseño y funcionalidades sin una justificación explícita.
