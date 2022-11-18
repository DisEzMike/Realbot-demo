import { RealBotDB } from './../db/index';
import {
	CommandInteraction,
	EmbedBuilder,
	APIEmbedField,
	PermissionFlagsBits,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { RealBot } from '../components/realbot';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('detail')
		.setDescription('เกี่ยวกับบอท'),
	async execute(
		interaction: CommandInteraction,
		client: RealBot,
		db: RealBotDB
	) {
		await interaction.deferReply();

		let distance = new Date().getTime() - client.runningTime;

		// console.log(distance)

		let fields: APIEmbedField[] = [
			{
				name: 'Start Date',
				value: new Date(client.runningTime).toDateString(),
				inline: true,
			},
			{ name: 'Start Time', value: getText(distance), inline: true },
			// { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true }
		];
		const embed = new EmbedBuilder()
			.setTitle(`🤖\tReal Home`)
			.setColor('DarkGreen')
			.addFields(fields)
			.setTimestamp();

		// console.log('Test')

		interaction
			.editReply({
				embeds: [embed],
			})
			.then((msg) => {
				let id = msg.id;

				let y = 1;
				var x: any = setInterval(() => {
					let message = interaction.channel?.messages.cache.get(id);
					if (!message) return clearInterval(x);
					distance = new Date().getTime() - client.runningTime;

					fields[1].value = getText(distance);
					embed.setFields(fields);

					interaction.editReply({
						embeds: [embed],
					});

					if (y > 301) {
						embed.setFields(fields);

						interaction.editReply({
							embeds: [embed],
						});
						clearInterval(x);
					}
					y += 1;
				}, 1000);
			});
	},
};

function getText(distance: number): string {
	let text = '';
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor(
		(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	if (days > 0) text += `**${days}** ` + (days > 1 ? 'days ' : 'day ');
	if (hours > 0) text += `**${hours}** ` + (hours > 1 ? 'hours ' : 'hour ');
	if (minutes > 0)
		text += `**${minutes}** ` + (minutes > 1 ? 'minutes ' : 'minute ');
	if (seconds > 0)
		text += `**${seconds}** ` + (seconds > 1 ? 'seconds' : 'second');

	return text;
}
