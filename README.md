# Payments App - AlquilAutos

## Descripción

La **Payments App** es un sistema que integra una pasarela de cobros. Se encarga de procesar de manera segura las transacciones financieras entre Alquiladores y Propietarios mediante la integración con el SDK de Mercado Pago (Sandbox).

La aplicación expone una API REST para interactuar de forma segura con el resto de los servicios distribuidos y cuenta con una base de datos propia en PostgreSQL (vía Prisma ORM) para registrar y persistir de manera inmutable el historial de cobros y estados de pago.

## Deploy

- **Link de la App (Vercel):** <https://proyecto-c-payments-alquilautos.vercel.app/>

---

## Instrucciones de Acceso por Usuario

La autenticación y gestión de sesiones está centralizada bajo un único entorno de **Clerk**. Los permisos de acceso locales se aplican de manera restrictiva según los roles (`role`) inyectados en el JWT del usuario.

### 1. Administrador (`admin`)

- **Permisos:** Acceso exclusivo al panel de supervisión y analíticas (`/admin`) para la auditoría de cobros globales, métricas y buscador dinámico de transacciones.
- **Credenciales de prueba:**
  - **Usuario:** `admin@gmail.com`
  - **Contraseña:** soyAdministrador

## Flujo de prueba recomendado

1. Ingresar a <https://proyecto-c-payments-alquilautos.vercel.app/>
2. Iniciar sesión con `admin@gmail.com` / `soyAdministrador`
3. Ir a `/checkout/[id_reserva]` para simular un pago
4. Completar los datos en la zona de test y hacer clic en **"Crear pago de prueba"**
5. Una vez creado, hacer clic en **"Pagar con Mercado Pago"**
6. En la pantalla de Mercado Pago, usar los datos de las cuenta de comprador de prueba o la tarjeta de prueba (ver abajo)
7. Volver a `/admin` para ver la transacción registrada en el panel

## Consideraciones extra

Para realizar un pago entrar por url a `/checkout/[id_reserva]`. Esta pantalla es una versión mockeada que, cuando las aplicaciones estén conectadas, estará en el front de la aplicación buyerApp. De momento sirve tanto para realizar y validar el funcionamiento de pagos como para disparar endpoints consecuentemente.

Antes de apretar pagar, poner los datos en el apartado de test para simular el POST que liga la PaymentsApp con la SellerApp. Recordar revisar que no haya ningún pago con la misma id de reserva en la tabla de transacciones.

Además es recomendable probar la integración de Mercado Pago en incógnito debido a que podria reconocer una cuenta existente en la computadora no compatible con el modo sandbox.

### Información para usar MP en modo Sandbox

**Cuenta de comprador de prueba:**
- País: Argentina
- User ID: 3407519040
- Usuario: TESTUSER486819439060381846
- Contraseña: PY7xHg3Hjm
- Código de verificación: 519040

**Tarjetas de prueba (funcionan en sandbox sin validación):**

| Tipo | Número | CVV | Vencimiento |
|---|---|---|---|
| Mastercard | `5031 7557 3453 0604` | `123` | `11/30` |

> **Nota:** El email solicitado en el formulario de pago de Mercado Pago puede ser cualquiera (ej. `test@test.com`), no valida en sandbox.
