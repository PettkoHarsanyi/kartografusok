DIVISION
-   id:         Id
-   name:       String

GAME
-   id:         Id
-   gameId: Number
-   user:       User
-   gameDate:   Date
-   points:     Number
-   messages:   Message[]

MESSAGE
-   id:         Id
-   game:       Game
-   user:       User
-   message:    String
-   sendDate:   Date

ROLE
-   id:         Id
-   name:       String

USER
-   id:         Id
-   name:       String
-   userName:   String
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
-   messages:    Message[]



-------------------------------------------------

Connections:

User N <=--> 1 Role | Role 1 <--=> N User
User N <=--> 1 Division | Division 1 <--=> N User
User 1 <--=> N Game | Game N <=--> 1 User
User 1 <--=> N Message | Message N <=--> 1 User
Game 1 <--=> N Message | Message N <=--> 1 Game