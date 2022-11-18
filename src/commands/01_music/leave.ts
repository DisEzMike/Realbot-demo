import { RealBotDB } from '../../db/index';
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { RealBot } from '../../components/realbot';
import setupConfig from '../../db/models/setupconfig';
import { mainEmbed } from '../../components/music-embed';

module.exports = {
	data: new SlashCommandBuilder().setName('leave').setDescription('บ้ายบาย'),
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

		let config = await db.SetupConfig.findOne<setupConfig>({
			type: 'music',
			guildId: guildId,
		});

		let channel = null;

		if (!!config) {
			channel = interaction.guild?.channels.cache.get(
				config.channelId
			) as TextChannel;
		}

		if (!!channel) {
			let message = channel.messages.cache.get(config?.messageId!);
			message?.edit({
				embeds: [mainEmbed()],
			});
		}

		queue.destroy();

		return interaction.reply({ content: '👋 | I gonna leave, Bye!' });
	},
};
