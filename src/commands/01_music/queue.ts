import { RealBotDB } from './../../db/index';
import { RealBot } from '../../components/realbot';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
	ButtonInteraction,
	CommandInteraction,
	GuildMember,
	TextChannel,
	EmbedBuilder,
	APIEmbedField,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js';
// import { NotInRoom, NotInQueue } from '../../components/embeds/music'
import RealBotMusic from '../../components/realbot_music';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('รายการเพลง'),
	async execute(
		interaction: CommandInteraction | ButtonInteraction,
		client: RealBot,
		db: RealBotDB,
		action: 'next' | 'back'
	) {
		// await interaction.deferReply()

		const guildId = interaction.guildId as string;
		// const member = interaction.member as GuildMember

		let queue = client.player.getQueue(guildId);
		if (!queue || !queue.playing) {
			return await interaction.reply({
				content: '❌ | Queue was end!',
			});
		}

		let page = client.queuepage;

		if (action == 'next') {
			page += 1;
		} else if (action == 'back') {
			if (page > 0) page -= 1;
		} else {
			page = 0;
		}

		client.queuepage = page;

		let bot = new RealBotMusic(interaction.guildId!, client);
		let data: any = await bot.queues(
			undefined,
			interaction as CommandInteraction,
			client
		);

		if (interaction.isButton()) {
			const channelId = interaction.channelId;
			const messageId = interaction.message.id;
			const channel = client.channels.cache.get(channelId) as TextChannel;
			client.queuepage = page;
			channel.messages.fetch(messageId).then((message) => {
				message.edit(data);
				interaction.deferUpdate();
			});
		} else {
			client.queuepage = 0;
			await interaction.reply(data);
		}
	},
};
