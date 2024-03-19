import { Events } from "discord.js";
import { monitorServerStatus, getServerStatus } from "@psi/minecraft";
import { updatePresence } from "../utils.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.mcStatusMonitor = monitorServerStatus(
      process.env.MINECRAFT_IP,
      async (status) => {
        await updatePresence(status, client);
      },
    );
    await updatePresence(
      await getServerStatus(process.env.MINECRAFT_IP),
      client,
    );
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
