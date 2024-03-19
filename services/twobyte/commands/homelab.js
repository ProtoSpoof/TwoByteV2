import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { power } from "@psi/home-assistant";

const SUB_GROUP = new SlashCommandSubcommandGroupBuilder()
    .setName("power")
    .setDescription("Toggle the homelab's power")
    .addSubcommand(new SlashCommandSubcommandBuilder().setName("on").setDescription("Turn the homelab on."))
    .addSubcommand(new SlashCommandSubcommandBuilder().setName("off").setDescription("Turn the homelab off."));

const SUBCOMMANDS = {
    power: {
        on: async (interaction) => {
            await power("turn_on");
            await interaction.reply({
                content: "I've turned ON the homelab server for you!",
                ephemeral: true,
            });
        },
        off: async (interaction) => {
            await power("turn_off");
            await interaction.reply({
                content: "I've turned OFF the homelab server for you!",
                ephemeral: true,
            });
        },
    },
};

export default {
    data: new SlashCommandBuilder()
        .setName("homelab")
        .setDescription("Interact with the homelab.")
        .addSubcommandGroup(SUB_GROUP)
        .setDMPermission(false),
    async execute(interaction) {
        await SUBCOMMANDS[interaction.options._group][interaction.options._subcommand](interaction);
    },
};
