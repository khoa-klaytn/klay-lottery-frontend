import { CORS_ALLOW, handleCors, wrapCorsHeader } from '@sweepstakes/worker-utils'
import { Router } from 'itty-router'
import { missing } from 'itty-router-extras'

const router = Router()

router.options('*', handleCors(CORS_ALLOW, `GET, POST, OPTIONS`, `*`))

router.all('*', () => missing('Not found'))

addEventListener('fetch', (event) =>
  event.respondWith(
    router
      .handle(event.request, event)
      .then((res) => wrapCorsHeader(event.request, res, { allowedOrigin: CORS_ALLOW })),
  ),
)
