case class Project(
    id: String,
    uri: String,
    label: String
)

case class Tracker(
    id: String,
    uri: String,
    label: String
)

case class User(
    id: String,
    uri: String,
    displayName: String,
    username: String
)

case class Epic(
    id: String,
    uri: String,
    xref: String,
    tracker: Tracker,
    project: Project,
    submetted_by_user: User,
    remaining: String,
    sprint: String
)

case class Story(
    storyId: String,
    epicId: Int,
    summary: String,
    status: String,
    estimation: String,
    remaining: String,
    sprint: String
)
