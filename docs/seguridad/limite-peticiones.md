# Límite de peticiones (costo $0)

Dos capas, ambas gratis:

| Capa | Qué frena | Dónde se configura | Límite gratis |
|---|---|---|---|
| **Vercel WAF** (borde) | Ráfagas contra `/api/*` antes de que lleguen al servidor | Panel de Vercel (1 regla en Hobby) | 1.000.000 de peticiones permitidas; el plan Hobby no cobra |
| **Upstash Redis** (código) | Fuerza bruta al panel (contraseña y código), inscripciones y contacto, contando igual en todas las instancias | Variables de entorno | 500.000 comandos/mes; solo cobra si se registra una tarjeta |

No registrar tarjeta en Upstash: así nunca hay cobro (al llegar al tope, las peticiones a Upstash fallan y el código sigue con el límite en memoria).

## 1. Regla en Vercel WAF

Vercel → proyecto → **Firewall** → **Configure** → **+ New Rule**:

- Nombre: `api-rafagas`
- If: **Request Path** · *starts with* · `/api/`
- Then: **Rate Limit** · Fixed Window · **60 s** · **30 peticiones** · clave **IP** · acción **Default (429)**
- **Save Rule** → **Review Changes** → **Publish**

Empezar con la acción **Log** un par de días si se quiere ver el tráfico antes de bloquear.

## 2. Upstash

1. Vercel → proyecto → **Storage** (Marketplace) → **Upstash for Redis** → plan **Free** (o crear la base en <https://console.upstash.com> sin tarjeta).
2. Región: la más cercana a Vercel (`us-east-1`).
3. Copiar **REST URL** y **REST TOKEN** a las variables `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` (si se conecta desde el Marketplace se crean solas) → **Redeploy**.

Consumo esperado: 2 comandos por intento de acceso, inscripción o mensaje: muy por debajo del tope.
