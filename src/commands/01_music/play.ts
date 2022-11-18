import { RealBotDB } from '../../db/index';
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { RealBot } from '../../components/realbot';
import setupConfig from '../../db/models/setupconfig';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('เล่นเพลง')
		.addStringOption((ops) =>
			ops.setName('query').setRequired(true).setDescription('ใส่เพลง')
		),
	async execute(
		interaction: CommandInteraction,
		client: RealBot,
		db: RealBotDB
	) {
		await interaction.deferReply();

		const guildId = interaction.guildId as string;
		const member = interaction.member as GuildMember;

		if (!member.voice.channelId)
			return interaction.editReply({
				content: 'You are not in a voice channel!',
			});
		if (
			interaction.guild?.members.me?.voice.channelId &&
			member.voice.channelId !==
				interaction.guild?.members.me?.voice.channelId
		)
			return await interaction.editReply({
				content: 'You are not in my voice channel!',
			});
		const query = interaction.options.get('query')!.value;

		const searchResult = await client.player.search(query as '', {
			requestedBy: interaction.user,
		});
		if (!searchResult || !searchResult.tracks.length)
			return void interaction.editReply({
				content: `❌ | Track **${query}** not found!`,
			});

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
		let queue = client.player.getQueue(guildId);

		if (!queue) {
			queue = client.player.createQueue(guildId, {
				ytdlOptions: {
					filter: 'audioonly',
					highWaterMark: 1 << 30,
					dlChunkSize: 0,
				},
				metadata: {
					channel: channel,
				},
			});
		}

		// verify vc connection
		try {
			if (!queue.connection) await queue.connect(member.voice.channel!);
		} catch {
			queue.destroy();
			return await interaction.editReply({
				content: 'Could not join your voice channel!',
			});
		}

		if (searchResult.playlist) {
			queue.addTracks(searchResult.tracks);
			interaction.editReply({
				content: `⏱️ | Loading playlist **${searchResult.tracks[0].title}**!`,
			});
		} else {
			queue.addTrack(searchResult.tracks[0]);
			interaction.editReply({
				content: `⏱️ | Loading track **${searchResult.tracks[0].title}**!`,
			});
		}

		if (!queue.playing) return queue.play();
	},
};
