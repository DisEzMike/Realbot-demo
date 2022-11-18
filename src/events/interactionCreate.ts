import { RealBotDB } from './../db/index';
import {
	CommandInteraction,
	ButtonInteraction,
	InteractionType,
	AutocompleteInteraction,
	Events,
	TextChannel,
} from 'discord.js';
// import { Fail } from '../components/embeds'
import COMMAND, { CommandType } from '../components/interface';
import { RealBot } from '../components/realbot';
import setupConfig from '../db/models/setupconfig';
import wait from 'node:timers/promises';

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(
		interaction:
			| CommandInteraction
			| ButtonInteraction
			| AutocompleteInteraction,
		client: RealBot,
		db: RealBotDB
	) {
		if (interaction.isAutocomplete()) {
			const command = <COMMAND>(
				client.commands.get(interaction.commandName)
			);
			if (!command) return;

			try {
				await command.autocomplete(interaction);
			} catch (err) {
				console.error();
			}
		}

		if (interaction.isCommand()) {
			const command = <COMMAND>(
				client.commands.get(interaction.commandName)
			);
			if (!command) return;

			try {
				await command.execute(interaction, client, db);

				let music_commands = client.command_list
					.filter((x) => x.category.toLocaleLowerCase() == 'music')
					.map((x) => {
						return x.name;
					});

				if (music_commands.includes(interaction.commandName)) {
					let config = await db.SetupConfig.findOne<setupConfig>({
						type: 'music',
						guildId: interaction.guildId,
					});

					if (!config) {
						await wait.setTimeout(2000);
						await interaction.followUp(
							`${interaction.user.toString()} If you want to get more events of **Realbot Music**. Plase type \`/setup type:Music Channel\` !`
						);
					}

					if (config?.channelId === interaction.channelId) {
						await interaction.deleteReply();
					}
				}
			} catch (err) {
				console.error();
			}
		}

		if (interaction.isButton()) {
			const buttonId = interaction.customId;

			const btn = buttonId.split('_');

			const command = client.commands.get(btn[0]);
			if (!command) return;
			command.execute(interaction, client, db, btn[1]);
		}
	},
};
