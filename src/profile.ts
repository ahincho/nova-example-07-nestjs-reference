import { defineProfile } from '@ahincho/nova-nestjs';

/**
 * El perfil de una organización ficticia: lo que todos sus servicios harían
 * igual, declarado una sola vez.
 *
 * En una organización de verdad esto vive en su propio paquete y lo importan
 * todos sus servicios. Acá está en el ejemplo para mostrar el mecanismo sin
 * depender del paquete de nadie.
 *
 * Lo que resuelve se ve en la ruta heredada de salud. Sin perfil había que
 * declararla dos veces -en el módulo de salud y en bootstrap()- y mantenerlas
 * iguales a mano; si se separaban, la ruta quedaba en `/api/v1/api/v1/health`
 * y el target group dejaba de encontrarla. Declarada acá, las dos la toman de
 * un solo lugar.
 */
export const exampleProfile = defineProfile({
  name: 'nova-example',

  bootstrap: {
    // El prefijo versiona la API; las sondas quedan fuera de él solas.
    globalPrefix: 'api/v1',
  },

  health: {
    // La ruta que el target group ya revisa. Un servicio que nace hoy sólo
    // necesita `/health/live` y `/health/ready`; uno que ya está desplegado no
    // puede mover la suya sin recrear el target group, así que la sirve en
    // paralelo hasta que la infraestructura apunte a la nueva.
    legacyPath: 'api/v1/health',
  },
});
