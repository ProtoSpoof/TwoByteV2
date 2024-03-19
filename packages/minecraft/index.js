import axios from 'axios';
import cron from 'node-cron';
import { MinecraftServerListPing } from 'minecraft-status';

export const getPlayerCount = async (ip) => {

}
export const getServerStatus = async (ip) => {
    try {
        let res = await MinecraftServerListPing.ping(process.env.MINECRAFT_PROTOCOL_VERSION, ip);
        res.online = true;
        return res;
    } catch (error) {
        return { online: false, players: { online: 0 } }
    }
}

export const monitorServerStatus = (ip, callback) => {
    cron.schedule('* * * * *', async () => {
        let status = await getServerStatus(ip);
        await callback(status);
    });
}