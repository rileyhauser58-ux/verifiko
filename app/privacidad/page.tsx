export const metadata = {
  title: "Política de Privacidad",
  description: "Cómo TodoServicios recopila, usa y protege tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Política de Privacidad</h1>
      <p className="mt-1 text-sm text-muted">Última actualización: julio de 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 text-base font-semibold">1. Qué datos recopilamos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Datos de cuenta:</strong> nombre completo, correo
              electrónico, tipo de cuenta (cliente o prestador) y contraseña
              (almacenada de forma cifrada por nuestro proveedor de
              autenticación, nunca en texto plano).
            </li>
            <li>
              <strong>Datos de perfil (prestadores):</strong> descripción del
              negocio, años de experiencia, rubros, comunas de cobertura y
              foto de perfil.
            </li>
            <li>
              <strong>Contenido que generas:</strong> mensajes de solicitud,
              conversaciones del chat, reseñas y calificaciones.
            </li>
            <li>
              <strong>Datos técnicos básicos</strong> necesarios para mantener
              tu sesión iniciada (cookies de autenticación).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">2. Para qué usamos tus datos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Crear y mantener tu cuenta, y permitirte iniciar sesión.</li>
            <li>
              Mostrar los perfiles de prestadores a otros usuarios que buscan
              un servicio.
            </li>
            <li>
              Permitir el envío de solicitudes, el chat entre cliente y
              prestador, y el sistema de reseñas.
            </li>
            <li>
              Calcular y mostrar la calificación promedio de un prestador.
            </li>
            <li>
              Detectar uso indebido de la plataforma (por ejemplo, intentos de
              compartir datos de contacto en el chat antes de que exista una
              solicitud aceptada).
            </li>
          </ul>
          <p className="mt-2">
            No usamos tus datos para publicidad de terceros ni los vendemos a
            nadie.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">3. Con quién se comparten tus datos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Otros usuarios:</strong> tu nombre, foto de perfil y (si
              eres prestador) tu descripción, rubros, comunas y reseñas son
              visibles públicamente. Tu correo electrónico nunca se muestra a
              otros usuarios.
            </li>
            <li>
              <strong>Proveedores de infraestructura:</strong> usamos Supabase
              (base de datos, autenticación y almacenamiento de archivos) y
              Vercel (hosting) para operar la plataforma. Estos proveedores
              procesan datos en nuestro nombre, bajo sus propias políticas de
              seguridad.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">4. Seguridad</h2>
          <p>
            El acceso a tus datos está protegido con reglas de seguridad a
            nivel de base de datos (Row Level Security): cada usuario solo
            puede ver y modificar la información que le corresponde según su
            rol y su participación en una solicitud o conversación. Las
            contraseñas nunca se almacenan en texto plano.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">5. Cookies</h2>
          <p>
            Usamos únicamente cookies necesarias para mantener tu sesión
            iniciada. No usamos cookies de seguimiento ni de publicidad.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">6. Cuánto tiempo guardamos tus datos</h2>
          <p>
            Guardamos tus datos mientras tengas una cuenta activa. Si eliminas
            tu cuenta, o nos pides eliminar tus datos, los borramos salvo que
            debamos conservar cierta información por obligación legal (por
            ejemplo, para resolver una disputa entre usuarios).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">7. Tus derechos</h2>
          <p>
            De acuerdo con la Ley N° 19.628 sobre Protección de la Vida
            Privada, puedes solicitar acceder, rectificar, eliminar u oponerte
            al uso de tus datos personales. Para ejercer estos derechos,
            escríbenos a{" "}
            <a
              href="mailto:contacto@todoservicios.cl"
              className="text-primary hover:underline"
            >
              contacto@todoservicios.cl
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold">8. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. Si hacemos
            cambios importantes, lo indicaremos en esta página con la fecha de
            la última actualización.
          </p>
        </section>
      </div>
    </div>
  );
}
