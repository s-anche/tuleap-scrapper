import cats.effect.{Concurrent, IO, Resource}
import org.http4s.client.Client
import org.http4s.{Header, Uri}
import org.http4s.ember.client.EmberClientBuilder
import org.typelevel.ci.CIString

trait TuleapService:
  def getEpic(id: String): IO[Epic]

object TuleapService:
  def resource(
      baseUri: Uri,
      token: String
  )(using Concurrent[IO]): Resource[IO, TuleapService] = EmberClientBuilder
    .default[IO]
    .build
    .map { rawClient =>
      val headerName = CIString("X-Auth-AccessKey") // or "Authorization", etc.
      val authHeader = Header.Raw(headerName, token)

      new TuleapService:
        private val api = baseUri.withPath("/api")

        override def getEpic(id: String): IO[Epic] =
          rawClient.get(api / "projects")(_.as[Epic])
    }
