export const metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de TodoServicios.",
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Términos y Condiciones</h1>
      <p className="mt-1 text-sm text-muted">Última actualización: julio de 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 text-base font-semibold">1. Qué es TodoServicios</h2>
          <p>
            TodoServicios es una plataforma que conecta a personas que necesitan
            contratar servicios para el hogar (gasfitería, electricidad,
            carpintería, mecánica automotriz, pintura, jardinería,
            cerrajería, aseo y limpieza, entre otros) con prestadores
            independientes que ofrecen esos servicios. Al crear una cuenta o
            usar el sitio, aceptas estos términos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">
            2. TodoServicios es un intermediario, no un empleador
          </h2>
          <p>
            Los prestadores que aparecen en TodoServicios son trabajadores
            independientes. No son empleados, contratistas ni representantes
            de TodoServicios. TodoServicios no supervisa, dirige ni garantiza el
            trabajo realizado por los prestadores, y no es parte del acuerdo
            comercial que se forma entre un cliente y un prestador. La
            relación de servicio, el precio y las condiciones del trabajo se
            acuerdan directamente entre ambas partes.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">3. Tu cuenta</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Debes entregar información real y mantenerla actualizada (nombre,
              correo y, si corresponde, los datos de tu perfil de prestador).
            </li>
            <li>
              Eres responsable de mantener la confidencialidad de tu
              contraseña y de toda actividad que ocurra en tu cuenta.
            </li>
            <li>
              Puedes registrarte como cliente, como prestador, o ambos con
              cuentas separadas. No está permitido crear cuentas falsas ni
              suplantar a otra persona o negocio.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">
            4. Solicitudes, chat y pagos
          </h2>
          <p>
            TodoServicios facilita el contacto entre cliente y prestador a
            través de solicitudes de servicio y un chat dentro de la
            plataforma. TodoServicios{" "}
            <strong>no procesa ni intermedia pagos</strong>: cualquier cobro
            por el servicio se acuerda y realiza directamente entre cliente y
            prestador, fuera de la plataforma. No compartas datos bancarios ni
            información sensible de pago dentro del chat.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">5. Reseñas y calificaciones</h2>
          <p>
            Las reseñas solo pueden dejarse por un cliente que efectivamente
            envió una solicitud a un prestador y esta fue marcada como
            completada. Las reseñas deben reflejar una experiencia real y no
            pueden contener contenido difamatorio, discriminatorio o falso.
            TodoServicios puede eliminar reseñas que incumplan esta regla.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">6. Uso aceptable</h2>
          <p>No está permitido usar TodoServicios para:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Publicar contenido falso, ofensivo, discriminatorio o ilegal.
            </li>
            <li>
              Acosar, amenazar o discriminar a otros usuarios.
            </li>
            <li>
              Intentar eludir las funciones de seguridad de la plataforma
              (por ejemplo, el enmascarado de datos de contacto en el chat).
            </li>
            <li>
              Usar los datos de otros usuarios para fines distintos a
              coordinar un servicio a través de TodoServicios.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">
            7. Suspensión y término de cuentas
          </h2>
          <p>
            TodoServicios puede suspender o eliminar una cuenta que incumpla
            estos términos, sin perjuicio de otras acciones que correspondan.
            Puedes dejar de usar la plataforma en cualquier momento.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">
            8. Limitación de responsabilidad
          </h2>
          <p>
            TodoServicios entrega la plataforma &ldquo;tal cual&rdquo; y no
            garantiza la calidad, seguridad, legalidad ni idoneidad de los
            servicios ofrecidos por los prestadores, ni la veracidad absoluta
            de los perfiles o reseñas. La insignia de
            &ldquo;Verificado&rdquo; indica una
            revisión básica realizada por el equipo de TodoServicios, no una
            garantía de desempeño. En la medida permitida por la ley,
            TodoServicios no es responsable por daños derivados de un servicio
            contratado a través de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">9. Cambios a estos términos</h2>
          <p>
            Podemos actualizar estos términos ocasionalmente. Si hacemos
            cambios importantes, lo indicaremos en esta página con la fecha
            de la última actualización.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">10. Ley aplicable y contacto</h2>
          <p>
            Estos términos se rigen por las leyes de la República de Chile.
            Si tienes dudas sobre estos términos, escríbenos a{" "}
            <a
              href="mailto:contacto@todoservicios.cl"
              className="text-primary hover:underline"
            >
              contacto@todoservicios.cl
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
