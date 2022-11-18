import {
	CommandInteraction,
	TextChannel,
	EmbedBuilder,
	ButtonInteraction,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	embedLength,
} from 'discord.js';
import { RealBotDB } from './../db/index';
import { RealBot } from '../components/realbot';
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('คำสั่งทั้งหมด'),
	async execute(
		interaction: CommandInteraction | ButtonInteraction,
		client: RealBot,
		db: RealBotDB,
		action: 'next' | 'back'
	) {
		await interaction.deferReply();

		let embed = new EmbedBuilder()
			.setTitle(`ℹ️\tReal Home`)
			.setColor('DarkBlue');
		let text = '**คำสั่งทั้งหมด**\n';
		const list = client.command_list.filter((x) => x.category != 'Admin');

		const totalPages = Math.ceil(list.length / 15) || 1;
		let page = client.helppage;

		if (action == 'next') {
			page += 1;
		} else if (action == 'back') {
			if (page > 0) page -= 1;
		} else {
			page = 0;
		}

		if (page + 1 > totalPages)
			return await interaction.reply(
				`ไม่มีหน้านี้. มีทั้งหมด ${totalPages} หน้า`
			);

		const data = list.slice(page * 15, page * 15 + 15).map((command, i) => {
			return command;
		});

		embed.spliceFields(0, embedLength(embed.data));
		client.category.forEach((category) => {
			let text = '';
			data.forEach((command) => {
				if (command.category == category) {
					text += `\`/${command.name}\`  ${command.description}\n`;
				}
			});
			if (text != '') {
				embed.addFields([
					{ name: category, value: text, inline: true },
				]);
			}
		});

		embed.setDescription(text);
		embed.setFooter({
			text: `หน้า ${page + 1} จากทั้งหมด ${totalPages} หน้า`,
		});

		const row = new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setCustomId('help_back')
				.setStyle(ButtonStyle.Primary)
				.setLabel('ย้อนกลับ')
				.setDisabled(page < 1),
			new ButtonBuilder()
				.setCustomId('help_next')
				.setStyle(ButtonStyle.Secondary)
				.setLabel('หน้าถัดไป')
				.setDisabled(page == totalPages - 1)
		);

		if (interaction.isButton()) {
			const channelId = interaction.channelId;
			const messageId = interaction.message.id;
			const channel = (await client.channels.fetch(
				channelId
			)) as TextChannel;
			client.helppage = page;
			channel.messages.fetch(messageId).then((message) => {
				message.edit({ components: [row as any], embeds: [embed] });
				interaction
					.reply({ content: 'เปลี่ยนหน้าเรียบร้อยแล้ว' })
					.then(() => interaction.deleteReply());
			});
		} else {
			client.helppage = 0;
			await interaction.editReply({
				components: [row as any],
				embeds: [embed],
			});
		}
	},
};
