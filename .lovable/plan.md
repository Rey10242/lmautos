
# Auto-remover "Recién Ingresado" después de 7 días

## Enfoque

Crear una Edge Function programada (cron job) que se ejecute diariamente y desmarque `recien_ingresado = false` en todos los vehículos cuya `fecha_ingreso` tenga más de 7 días.

## Pasos

### 1. Crear Edge Function `auto-remove-new-badge`
- Consulta vehículos donde `recien_ingresado = true` y `fecha_ingreso < now() - interval '7 days'`
- Actualiza esos registros poniendo `recien_ingresado = false`
- Usa el service role key para bypass de RLS

### 2. Programar ejecución diaria con pg_cron
- Habilitar extensiones `pg_cron` y `pg_net`
- Crear cron job que ejecute la función una vez al día a las 3:00 AM

### Detalle técnico
- La función usa `SUPABASE_SERVICE_ROLE_KEY` (ya configurado) para hacer el UPDATE sin restricciones de RLS
- El campo `fecha_ingreso` ya existe en la tabla `vehicles` y se usa como referencia temporal
- No se toca el campo `destacado`, solo `recien_ingresado`
