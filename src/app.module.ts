import { Module } from '@nestjs/common';
import { NovaModule } from '@ahincho/nova-nestjs';
import { CoursesModule } from './features/courses/courses.module';
import { exampleProfile } from './profile';
import { academic } from './upstream/academic/academic.config';
import { AcademicModule } from './upstream/academic/academic.module';

@Module({
  imports: [
    NovaModule.forRoot({
      // Las convenciones de la organización: el prefijo y la ruta heredada de
      // salud. Lo que se declara abajo se suma a ellas o las pisa.
      profile: exampleProfile,

      // Declara el upstream. Si ACADEMIC_URL no está inyectada, el servicio no
      // arranca y el error la nombra, en vez de responder 500 la primera vez
      // que alguien llame la ruta que la necesita.
      config: { load: [academic] },

      // La ruta heredada viene del perfil; acá va sólo lo de este servicio.
      health: {
        // Tras SIGTERM el servicio sigue vivo esta ventana y termina lo que
        // tenga en vuelo; `ready` y la ruta heredada contestan 503 mientras
        // tanto.
        //
        // No es esto lo que saca la tarea de rotación: ECS desregistra el
        // target y espera el deregistration delay ANTES de mandar la señal,
        // así que cuando el proceso se entera ya no le llega tráfico. Esta
        // ventana existe para que no se corte una petición a la mitad.
        //
        // Menor que el stopTimeout de la tarea -30 s por defecto-, porque
        // pasado ese plazo llega un SIGKILL a mitad del drenaje.
        gracefulShutdownTimeoutMs: 5000,

        readinessChecks: [
          {
            name: 'academic',
            // Un chequeo de disponibilidad mira lo que el servicio necesita
            // para atender. Acá alcanza con que la configuración resolviera.
            //
            // A propósito no llama al upstream: si `ready` cayera cuando
            // academic se cae, el orquestador mataría tareas sanas de este
            // servicio por un problema que no es suyo.
            check: () => Boolean(process.env['ACADEMIC_URL']),
          },
        ],
      },
    }),
    AcademicModule,
    CoursesModule,
  ],
})
export class AppModule {}
