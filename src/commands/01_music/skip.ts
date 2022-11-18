import { RealBotDB } from '../../db/index';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { RealBot } from '../../components/realbot';

module.exports = {
	data: new SlashCommandBuilder().setName('skip').setDescription('ข้ามเพลง'),
	async execute(
		interaction: CommandInteraction,
		client: RealBot,
		db: RealBotDB
	) {
		const guildId = interaction.guildId as string;
		// const member = interaction.member as GuildMember

		const queue = client.player.getQueue(guildId);
		if (!queue || !queue.playing)
			return interaction.reply({
				content: '❌ | No music is being played!',
			});
		const currentTrack = queue.current;
		const success = queue.skip();
		return interaction.reply({
			content: success
				? `✅ | Skipped **${currentTrack}**!`
				: '❌ | Something went wrong!',
		});
	},
};
