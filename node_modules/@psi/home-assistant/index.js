import 'dotenv/config';
import axios from 'axios';

const homeassistant_url = process.env.HOMEASSISTANT_URL ?? 'http://homeassistant.local:8123';

export const power = async (state) => {
    await axios({
        method: 'post',
        url: `${homeassistant_url}/api/services/switch/${state}`,
        headers: { 'Authorization': `Bearer ${process.env.HOMEASSISTANT_TOKEN}` },
        data: {
            "entity_id": `${process.env.HOMELAB_ENTITYID}`
        }
    });
}