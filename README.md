# Payments App - AlquilAutos

## Descripción

La **Payments App** es un sistema que integra una pasarela de cobros. Se encarga de procesar de manera segura las transacciones financieras entre Alquiladores y Propietarios mediante la integración con el SDK de Mercado Pago (Sandbox).

La aplicación expone una API REST para interactuar de forma segura con el resto de los servicios distribuidos y cuenta con una base de datos propia en PostgreSQL (vía Prisma ORM) para registrar y persistir de manera inmutable el historial de cobros y estados de pago.

## Deploy

- **Link de la App (Vercel):** [https://proyecto-c-payments-alquilautos-c0lcdch49-ap-abb9dd6f.vercel.app/]

---

## Instrucciones de Acceso por Usuario

La autenticación y gestión de sesiones está centralizada bajo un único entorno de **Clerk**. Los permisos de acceso locales se aplican de manera restrictiva según los roles (`role`) inyectados en el JWT del usuario.

### 1. Administrador (`admin`)

- **Permisos:** Acceso exclusivo al panel de supervisión y analíticas (`/admin`) para la auditoría de cobros globales, métricas y buscador dinámico de transacciones.
- **Credenciales de prueba:**
  - **Usuario:** `admin.payments@alquilautos.com` (O el email de tu cuenta de pruebas)
  - **Contraseña:** [Ingresar contraseña de prueba]

## Consideraciones extra

Para realizar un pago entrar por url a /checkout, esta pantalla es una mockeada que cuando las aplicaciones estén conectadas estará en el front de la aplicación buyerApp, de momento sirve tanto para realizar y validar el funcionamiento de pagos como para disparar endpoints consecuentemente.
