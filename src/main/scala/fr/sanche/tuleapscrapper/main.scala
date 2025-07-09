package fr.sanche.tuleapscrapper

import cats.effect.{ExitCode, IO, IOApp}
import io.circe.generic.auto.*
import io.circe.syntax.*


object MyApp extends IOApp:

  def run(args: List[String]): IO[ExitCode] =
    for
        _ <- IO.println("Beginning")
        token = "tlp-k1-100.90d5d6ce925eb30ca817cc5569407ae606a70928e2e1960d7685a626ff82cc8e"
        // Pour chaque epic
        // Récuperer les informations des epics
        // Récuperer les informations des features
        // Récuperer les informations des stories
        _ <- IO.println(
          User(
            "id: String",
            "uri: String",
            "displayName: String",
            "username: String"
          ).asJson
        )
        _ <- IO.println("End")
    yield ExitCode.Success
