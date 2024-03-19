import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { power } from "@psi/home-assistant";
import { getServerStatus } from "@psi/minecraft";

const SUBGROUPS = [
    new SlashCommandSubcommandGroupBuilder()
        .setName("power")
        .setDescription("Control the Minecraft server power state.")
        .addSubcommand(new SlashCommandSubcommandBuilder().setName("on").setDescription("Turn the server on."))
        .addSubcommand(new SlashCommandSubcommandBuilder().setName("off").setDescription("Turn the server off.")),
];

const SUBCOMMANDS = {
    power: {
        on: async (interaction) => {
            await power("turn_on");
            await interaction.reply({
                content: "I've turned ON the Minecraft server for you!",
                ephemeral: true,
            });
        },
        off: async (interaction) => {
            await interaction.deferReply({ ephemeral: true });
            let serverStatus = await getServerStatus(process.env.MINECRAFT_IP);

            if (serverStatus.online === false) {
                return await interaction.followUp({
                    content:
                        "The Minecraft server seems to be off already. If you think this is an error contact an admin.",
                    ephemeral: true,
                });
            }

            if (serverStatus?.players?.online) {
                return await interaction.followUp({
                    content:
                        "There are still people connected to the Minecraft server. If you think this is an error contact an admin.",
                    ephemeral: true,
                });
            }

            await power("turn_off");
            await interaction.followUp({
                content: "I've turned OFF the Minecraft server for you!",
                ephemeral: true,
            });
        },
    },
};

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName("minecraft")
    .setDescription("Interact with the Minecraft server.")
    .setDMPermission(false);

SUBGROUPS.forEach((subgroup) => {
    SLASH_COMMAND.addSubcommandGroup(subgroup);
});

export default {
    data: SLASH_COMMAND,
    async execute(interaction, client) {
        await SUBCOMMANDS[interaction.options._group][interaction.options._subcommand](interaction, client);
    },
};
