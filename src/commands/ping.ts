import { RealBotDB } from './../db/index';
import { CommandInteraction, EmbedBuilder, APIEmbedField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { RealBot } from '../components/realbot';

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('ปิ๊งป่อง'),
	async execute(
		interaction: CommandInteraction,
		client: RealBot,
		db: RealBotDB
	) {
		await interaction.deferReply();

		const fields: APIEmbedField[] = [
			{
				name: 'Latency',
				value: `${Date.now() - interaction.createdTimestamp}ms`,
				inline: true,
			},
			{
				name: 'API Latency',
				value: `${Math.round(client.ws.ping)}ms`,
				inline: true,
			},
		];
		const embed = new EmbedBuilder()
			.setTitle(`🏓\tReal Home`)
			.setColor('DarkGreen')
			.addFields(fields);

		interaction.editReply({
			embeds: [embed],
		});
	},
};
