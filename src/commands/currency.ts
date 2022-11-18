import { RealBotDB } from './../db/index';
import {
	CommandInteraction,
	EmbedBuilder,
	APIEmbedField,
	CommandInteractionOptionResolver,
	AutocompleteInteraction,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { RealBot } from '../components/realbot';
import axios from 'axios';

let currencyList = require('../components/currency');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('currency')
		.setDescription('เช็กค่าเงิน')
		.addStringOption((ops) =>
			ops
				.setName('from')
				.setDescription(
					'แปลงค่าเงินจาก ค่าเริ่มต้น USD *ถ้าหาไม่เจอค้นหาเลย!'
				)
				.setAutocomplete(true)
		)
		.addStringOption((ops) =>
			ops
				.setName('to')
				.setDescription(
					'แปลงค่าเงินเป็น ค่าเริ่มต้น THB *ถ้าหาไม่เจอค้นหาเลย!'
				)
				.setAutocomplete(true)
		)
		.addNumberOption((ops) =>
			ops
				.setName('amount')
				.setDescription('จำนวนเงิน ค่าเริ่มต้น 1')
				.setRequired(false)
		),
	async autocomplete(interaction: AutocompleteInteraction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices = new Array(...currencyList);

		let filtered = choices.filter((x) =>
			x.search.includes(focusedOption.value)
		);
		filtered = filtered.slice(0, 25);

		interaction.respond(
			filtered!.map((choice) => ({
				name: choice.name,
				value: choice.value,
			}))
		);
	},
	async execute(
		interaction: CommandInteraction,
		client: RealBot,
		db: RealBotDB
	) {
		await interaction.deferReply();

		let Cfrom = interaction.options.get('from')?.value
			? (interaction.options.get('from')?.value! as string)
			: ['USA', 'USD'].join('_');
		let Cto = interaction.options.get('to')?.value
			? (interaction.options.get('to')?.value as string)
			: ['Thailand', 'THB'].join('_');
		const amount = interaction.options.get('amount')?.value
			? interaction.options.get('amount')?.value
			: 1;

		let url = `https://api.fastforex.io/convert?from=${
			Cfrom.split('_')[1]
		}&to=${Cto.split('_')[1]}&amount=${amount}&api_key=demo`;

		const embed = new EmbedBuilder().setTitle(`ℹ️\tReal Home`);
		try {
			const res = await axios({
				url: url,
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0',
				},
			});
			const data = res.data;

			const field: APIEmbedField[] = [
				{
					name: `${Cfrom.split('_')[0]} (\`${data.base}\`)`,
					value: `**${amount}**`,
					inline: true,
				},
				{
					name: `${Cto.split('_')[0]} (\`${
						Object.keys(data.result)[0]
					}\`)`,
					value: `**${
						Math.floor(data.result.rate * data.amount * 10000) /
						10000
					}**`,
					inline: true,
				},
				{
					name: `Exchange rate (\`${Object.keys(data.result)[0]}\`)`,
					value: `**${data.result.rate}**`,
				},
			];
			embed.setColor('DarkBlue').setFields(field);

			interaction.editReply({
				embeds: [embed],
			});
		} catch (e) {
			console.error();

			embed
				.setColor('DarkRed')
				.setDescription(
					`\`${Cfrom + '` or `' + Cto.split('_')[1]}\` doesn't exist.`
				);
			interaction.editReply({
				embeds: [embed],
			});
		}
	},
};
