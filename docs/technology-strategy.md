# Estrategia de evolución tecnológica

## Principio

THALEX SYSTEMS debe **evolucionar sin fricción**: la arquitectura no debe depender de forma permanente de proveedores específicos. La lógica del negocio se define por **reglas de negocio documentadas**, no por la tecnología actual.

## Arquitectura actual

| Capa | Proveedor actual |
| --- | --- |
| Frontend (landing, portal, panel) | Vercel |
| Backend administrado | Supabase (Auth, PostgreSQL, Edge Functions) |
| Base operacional | Supabase PostgreSQL |
| Correo | Resend |

## Arquitectura futura posible

El sistema debe estar preparado para migrar a:

- **Backend propio** — Node.js, Spring Boot u otra tecnología.
- **Base de datos propia** — PostgreSQL o MySQL administrada por THALEX.
- **Infraestructura administrada por THALEX** — VPS propio, servicios cloud propios.
- **Proveedores de nube** — AWS u otros, según conveniencia.

## Qué significa en la práctica

- Los **flujos, estados y reglas** de negocio se documentan independientes de la tecnología (ver [data-model.md](./data-model.md)).
- El acceso a datos debe usar **abstracciones** (repositorios/servicios) para que cambiar de backend no reescriba la lógica.
- El correo, la autenticación y el storage se tratan como **servicios intercambiables**.
- La configuración (proveedor, URLs, credenciales) vive en configuración, nunca en código de negocio.

## Reglas

- No acoplar reglas de negocio a APIs específicas de un proveedor.
- Toda integración de proveedor se documenta y se aísla detrás de una interfaz.
- Las migraciones de infraestructura son cambios de configuración, no cambios de negocio.
