import scala.collection.Seq

ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "3.7.1"

val fs2Version = "3.12.0"
val http4sVersion = "0.23.30"
val circeVersion = "0.14.14"
val logbackVersion = "1.5.18"
val slf4jVersion = "2.0.17"

lazy val root = (project in file("."))
  .enablePlugins(GuardrailPlugin)
  .settings(
    name := "TuleapScrapper",
    libraryDependencies ++= Seq(
      // Cats
      "org.typelevel" %% "cats-core" % "2.13.0",
      "org.typelevel" %% "cats-effect" % "3.6.1",

      // FS2
      "co.fs2" %% "fs2-core" % fs2Version,
      "co.fs2" %% "fs2-io" % fs2Version,

      // Circe
      "io.circe" %% "circe-core" % circeVersion,
      "io.circe" %% "circe-literal" % circeVersion,
      "io.circe" %% "circe-generic" % circeVersion,

      // http4s
      "org.http4s" %% "http4s-core" % http4sVersion,
      "org.http4s" %% "http4s-dsl" % http4sVersion,
      "org.http4s" %% "http4s-circe" % http4sVersion,
      "org.http4s" %% "http4s-ember-client" % http4sVersion,

      // Logging
      "org.slf4j" % "slf4j-api" % slf4jVersion,

      // Runtime
      "ch.qos.logback" % "logback-classic" % logbackVersion % "runtime",
      "ch.qos.logback" % "logback-core" % logbackVersion % "runtime",
      "org.scalatest" %% "scalatest" % "3.2.19" % Test
    ),
    Compile / guardrailTasks := (Compile / guardrailDiscoveredOpenApiFiles).value
      .flatMap { openApiFile =>
        List(
          ScalaClient(
            openApiFile.file,
            pkg = openApiFile.pkg,
            framework = "http4s"
          )
        )
      }
  )
