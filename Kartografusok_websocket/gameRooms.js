import { db } from "./sequelize.js";

export const gameRoom = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on("create-room", async (ack) => {
      try {
        const { uuid } = await db.rooms.create();
        socket.join(uuid);

        const room = await db.rooms.findOne({
          where: { uuid },
        });

        ack({ status: "ok", roomId: uuid });
      } catch (e) {
        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });

    socket.on("join-room", async (uuid, user, ack) => {
      try {

        const allRooms = io.sockets.adapter.rooms;
        if (!Array.from(allRooms.keys()).includes(uuid)) {
          throw new Error("Nincs ilyen szoba id a socket.io szerveren");
        }

        // szoba state lekérése
        // nincs benne db-ben a uuid, meghal a db query
        const room = await db.rooms.findOne({
          where: { uuid },
        });
        if (!room) {
          throw new Error("Nincs ilyen szoba id az adatbázisban");
        }

        // Már a szobában van a kliens
        if (socket.rooms.has(uuid)) {
          throw new Error("A kliens már a szobában van");
        }

        socket.join(uuid);
        socket.broadcast
          .to(uuid)
          .emit("player-joined", { roomId: uuid, player: user });


        ack({ status: "ok", state: room.state });
      } catch (e) {

        if (typeof ack === "function") {
          ack({ status: "error", message: e.message });
        }
      }
    });

    socket.on("sync-state", async (uuid, state, broadcast, ack) => {
      try {
        // nincs ilyen szoba
        const allRooms = io.sockets.adapter.rooms;
        if (!Array.from(allRooms.keys()).includes(uuid)) {
          throw new Error("Nincs ilyen szoba id a socket.io szerveren");
        }

        // szoba state lekérése
        // nincs benne db-ben a uuid, meghal a db query
        const room = await db.rooms.findOne({
          where: { uuid },
        });
        if (!room) {
          throw new Error("Nincs ilyen szoba id az adatbázisban");
        }

        if (!socket.rooms.has(uuid)) {
          throw new Error("A kliens nincs a szobában");
        }

        // db módosítás
        await db.rooms.update(
          { state: JSON.stringify(state) },
          { where: { uuid } }
        );

        // broadcastolás mindenkinek
        let sender;
        if (broadcast) {
          sender = socket.broadcast.to(uuid);
        } else {
          sender = io.to(uuid);
        }
        sender.emit("state-changed", { roomId: uuid, state });
        
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
          throw new Error("Nincs ilyen szoba id a socket.io szerveren");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("A kliens nincs a szobában");
        }

        // send to everybody
        let sender;
        if (broadcast) {
          sender = socket.broadcast.to(uuid);
        } else {
          sender = io.to(uuid);
        }
        sender.emit("action-sent", action);

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
          throw new Error("Nincs ilyen szoba id a socket.io szerveren");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("A kliens nincs a szobában");
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
          throw new Error("Nincs ilyen szoba id a socket.io szerveren");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("A kliens nincs a szobában");
        }

        // szoba state lekérése
        // nincs benne db-ben a uuid, meghal a db query
        const room = await db.rooms.findOne({
          where: { uuid },
        });
        if (!room) {
          throw new Error("Nincs ilyen szoba id az adatbázisban");
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
          throw new Error("Nincs ilyen szoba id a socket.io szerveren");
        }

        // szoba state lekérése
        // nincs benne db-ben a uuid, meghal a db query
        const room = await db.rooms.findOne({
          where: { uuid },
        });
        if (!room) {
          throw new Error("Nincs ilyen szoba id az adatbázisban");
        }

        // Nincs a szobában a kliens
        if (!socket.rooms.has(uuid)) {
          throw new Error("A kliens nincs a szobában");
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
