import "dotenv/config";
import path from "node:path";
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

const EVENTS_PATH = path.resolve(".", "events");
const COMMANDS_PATH = path.resolve(".", "commands");
// const COMMANDS_PATH = path.resolve(".", "dev-commands");

const EVENT_FILES = readdirSync(EVENTS_PATH, { withFileTypes: true }).filter(
    (file) => file.isFile() && file.name.endsWith(".js")
);

const COMMAND_FILES = readdirSync(COMMANDS_PATH, {
    withFileTypes: true,
}).filter((file) => file.isFile() && file.name.endsWith(".js"));

let botClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
    ],
});

botClient.commands = new Collection();

// Load Events
for await (const file of EVENT_FILES) {
    const filepath = pathToFileURL(path.resolve(file.path, file.name));
    const event = (await import(filepath)).default;

    if (event.once) {
        botClient.once(event.name, (...args) => event.execute(...args));
    } else {
        botClient.on(event.name, (...args) => event.execute(...args));
    }
}

// Load Commands
for await (const file of COMMAND_FILES) {
    const filepath = pathToFileURL(path.resolve(file.path, file.name));
    const command = (await import(filepath)).default;

    if ("data" in command && "execute" in command) {
        botClient.commands.set(command.data.name, command);
    } else {
        console.warn(`[WARNING] The command at ${filepath} is missing a required "data" or "execute" property.`);
    }
}

botClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return console.error(`[ERROR] No command matching ${interaction.commandName} found.`);

    try {
        await command.execute(interaction, botClient);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});

botClient.login(process.env.BOT_TOKEN);
