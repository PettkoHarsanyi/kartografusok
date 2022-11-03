import { db } from "./sequelize.js";

const MAX_ROOM_SIZE = 5;

export const gameRoom = (io) => {
  io.on("connection", (socket) => {
    console.log("Game room: connected", socket.id);

    socket.on("create-room", async (ack) => {
      try {
        const { uuid } = await db.rooms.create();
        socket.join(uuid);

        const room = await db.rooms.findOne({
          where: { uuid },
        });
        console.log("room created with id: " + uuid)
        console.log("room content: ")
        console.log(room);
        ack({ status: "ok", roomId: uuid });
      } catch (e) {
        console.log("room hasn't been created")
        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });

    socket.on("join-room", async (uuid, ack) => {
      try {
        // nincs ilyen szoba
        console.log(socket.id)
        console.log(" attempts to join room " + uuid)

        const allRooms = io.sockets.adapter.rooms;
        if (!Array.from(allRooms.keys()).includes(uuid)) {
          throw new Error("No such room id on the socket.io server.");
        }

        console.log(" 1 ")

        // szoba state lekérése
        // nincs benne db-ben a uuid, meghal a db query
        const room = await db.rooms.findOne({
          where: { uuid },
        });
        if (!room) {
          throw new Error("No such room id in database.");
        }

        console.log(" 2 ")


        // Már a szobában van a kliens
        if (socket.rooms.has(uuid)) {
          throw new Error("The client is already in this room.");
        }

        console.log(" 3 ")


        socket.join(uuid);
        socket.broadcast
          .to(uuid)
          .emit("player-joined", { roomId: uuid, socketId: socket.id });

        console.log(" 4 ")

        console.log(socket + " has joined to room: " + uuid)
        console.log("the rooms content now is:")
        console.log(room);
        // visszaadás
        ack({ status: "ok", state: room.state });
      } catch (e) {
        console.log(socket + " couldn't join room: " + uuid)

        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });

    socket.on("sync-state", async (uuid, state, broadcast, ack) => {
      try {
        // nincs ilyen szoba
        const allRooms = io.sockets.adapter.rooms;
        console.log("az uuid: " + uuid);
        if (!Array.from(allRooms.keys()).includes(uuid)) {
          throw new Error("No such room id on the socket.io server.");
        }

        // szoba state lekérése
        // nincs benne db-ben a uuid, meghal a db query
        const room = await db.rooms.findOne({
          where: { uuid },
        });
        if (!room) {
          throw new Error("No such room id in database.");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("The client is not in this room.");
        }

        // db módosítás
        await db.rooms.update(
          { state: JSON.stringify(state) },
          { where: { uuid } }
        );

        // send to everybody
        let sender;
        if (broadcast) {
          sender = socket.broadcast.to(uuid);
        } else {
          sender = io.to(uuid);
        }
        sender.emit("state-changed", { roomId: uuid, state });
        
        console.log(room);

        ack({ status: "ok" });
      } catch (e) {
        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });

    socket.on("sync-action", async (uuid, action, broadcast, ack) => {
      try {
        // nincs ilyen szoba
        const allRooms = io.sockets.adapter.rooms;
        if (!Array.from(allRooms.keys()).includes(uuid)) {
          throw new Error("No such room id on the socket.io server.");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("The client is not in this room.");
        }

        // send to everybody
        let sender;
        if (broadcast) {
          sender = socket.broadcast.to(uuid);
        } else {
          sender = io.to(uuid);
        }
        sender.emit("action-sent", { roomId: uuid, action });

        ack({ status: "ok" });
      } catch (e) {
        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });

    socket.on("leave-room", async (uuid, ack) => {
      try {
        // nincs ilyen szoba
        const allRooms = io.sockets.adapter.rooms;
        if (!Array.from(allRooms.keys()).includes(uuid)) {
          throw new Error("No such room id on the socket.io server.");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("The client is not in this room.");
        }

        // broadcast
        socket.leave(uuid);
        socket.broadcast
          .to(uuid)
          .emit("player-left", { roomId: uuid, socketId: socket.id });

        ack({ status: "ok" });
      } catch (e) {
        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });

    socket.on("close-room", async (uuid, ack) => {
      try {
        // nincs ilyen szoba
        const allRooms = io.sockets.adapter.rooms;
        if (!Array.from(allRooms.keys()).includes(uuid)) {
          throw new Error("No such room id on the socket.io server.");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("The client is not in this room.");
        }

        // szoba state lekérése
        // nincs benne db-ben a uuid, meghal a db query
        const room = await db.rooms.findOne({
          where: { uuid },
        });
        if (!room) {
          throw new Error("No such room id in database.");
        }

        // szoba lezárása
        allRooms.get(uuid).roomSize = allRooms.get(uuid).size;

        // kliensek értesítése
        const clients = Array.from(allRooms.get(uuid));
        clients.forEach((socketId, i) => {
          io.to(socketId).emit("room-is-full", {
            roomId: uuid,
            player: i + 1,
            state: room.state,
          });
        });

        ack({ status: "ok", state: room.state });
      } catch (e) {
        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });

    socket.on("get-state", async (uuid, ack) => {
      try {
        // nincs ilyen szoba
        const allRooms = io.sockets.adapter.rooms;
        if (!Array.from(allRooms.keys()).includes(uuid)) {
          throw new Error("No such room id on the socket.io server.");
        }

        // szoba state lekérése
        // nincs benne db-ben a uuid, meghal a db query
        const room = await db.rooms.findOne({
          where: { uuid },
        });
        if (!room) {
          throw new Error("No such room id in database.");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("The client is not in this room.");
        }

        ack({ status: "ok", state: room.state });
      } catch (e) {
        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });
  });
};
