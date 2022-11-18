import { RealBotDB } from '../../db/index';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { RealBot } from '../../components/realbot';

module.exports = {
	data: new SlashCommandBuilder().setName('clear').setDescription('ล้างคิว'),
	async execute(
		interaction: CommandInteraction,
		client: RealBot,
		db: RealBotDB
	) {
		const guildId = interaction.guildId as string;
		// const member = interaction.member as GuildMember

		const queue = client.player.getQueue(guildId);
		if (!queue)
			return interaction.reply({ content: '❌ | Queue was end!' });

		queue.clear();

		return interaction.reply({ content: '🗑️ | Queue cleared.' });
	},
};
