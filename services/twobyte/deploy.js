import "dotenv/config";
import path from "node:path";
import { readdirSync } from "fs";
import { pathToFileURL } from "node:url";
import { REST, Routes } from "discord.js";

const commands = [];
const commandFiles = readdirSync("./commands", { withFileTypes: true }).filter(
  (file) => file.isFile() && file.name.endsWith(".js"),
);

// Load commands
for await (const file of commandFiles) {
  const filepath = pathToFileURL(path.resolve(file.path, file.name));
  const command = (await import(filepath)).default;
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  let res = await rest.put(
    Routes.applicationCommands(process.env.BOT_CLIENT_ID),
    {
      body: commands,
    },
  );

  console.log(res);

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
