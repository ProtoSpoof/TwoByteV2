import { ActivityType } from "discord.js";

export const updatePresence = async (status, client) => {
    if (status.online) {
        client.user.setStatus('online');
    } else {
        client.user.setStatus('dnd');
    }

    client.user.setActivity(
        `${process.env.MINECRAFT_PUBLIC_IP || process.env.MINECRAFT_IP}`,
        {
            state: `Status: ${status.online ? "ONLINE" : "OFFLINE"} | Players: ${status.players.online}`,
            type: ActivityType.Watching
        }
    );
}