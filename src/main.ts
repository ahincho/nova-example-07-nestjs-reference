import { appEnvironment, bootstrap } from '@ahincho/nova-nestjs';
import { AppModule } from './app.module';
import { exampleProfile } from './profile';

// El main.ts completo. El ValidationPipe con la fábrica del sobre, el bind a
// 0.0.0.0, el puerto leído de PORT, los hooks de apagado y la exclusión de las
// sondas del prefijo global los pone bootstrap(); nada de eso se copia por
// servicio.
void bootstrap(AppModule, {
  // El mismo perfil que recibe NovaModule: trae el prefijo global y la ruta
  // heredada de salud, que así queda fuera del prefijo sin repetirla. Si no
  // coincidiera con el del módulo, el arranque cortaría.
  profile: exampleProfile,
  cors: { origins: process.env['CORS_ALLOWED_ORIGINS'] ?? '' },

  // La interfaz queda en /docs y el documento en /docs/json, fuera del prefijo
  // global: el prefijo versiona la API y la documentación no es parte de lo
  // versionado.
  openapi: {
    title: 'Nova Example',
    description: 'El servicio de ejemplo de la plataforma',

    // `appEnvironment()` lee NODE_ENV, que es lo que inyecta la task
    // definition. Sin inyectar nada cae en `production`, el más restrictivo:
    // un contenedor que nadie configuró no publica la documentación.
    enabled: appEnvironment() !== 'production',
    // En false porque este servicio no declara `auth`. Con el guard global
    // encendido habría que sacarlo: el documento tiene que decir que todo pide
    // token, porque es lo que pasa de verdad.
    bearerAuth: false,
  },
});
