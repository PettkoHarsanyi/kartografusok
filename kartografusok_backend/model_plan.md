USER
-   id:         Id
-   username:   String
-   email:      String
-   password:   String?
-   points:     Number
-   weekly:     Number
-   role:       Role
-   division:   Division
-   picture:    String?
-   banned:     Bool
-   muted:      Bool
-   game:       Game
-   message:    Message

DIVISION
-   id:         Id
-   name:       String

ROLE
-   id:         Id
-   name:       String

GAME
-   id:         Id
-   user:       User
-   gameDate:   Date
-   points:     Number
-   messages:   Message

MESSAGE
-   id:         Id
-   game:       Game
-   user:       User
-   message:    String
-   sendDate:   Date

-------------------------------------------------

Connections:

User N <=--> 1 Role | Role 1 <--=> N User
User N <=--> 1 Division | Division 1 <--=> N User
User N <=-=> M Game | Game M <=-=> N User
User 1 <--=> N Message | Message N <=--> 1 User
Game 1 <--=> N Message | Message N <=--> 1 Game