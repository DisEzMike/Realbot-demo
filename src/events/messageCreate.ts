import { RealBotDB } from './../db/index';
import {
	ChannelType,
	Events,
	GuildMember,
	GuildMemberManager,
	Message,
	TextChannel,
} from 'discord.js';
import { RealBot } from '../components/realbot';
import setupConfig from '../db/models/setupconfig';
import wait from 'node:timers/promises';

module.exports = {
	name: Events.MessageCreate,
	async execute(message: Message, client: RealBot, db: RealBotDB) {
		if (message.author.bot) return;
		if (message.channel.type == ChannelType.DM) return;

		let guildId = message.guildId!;

		let config = await db.SetupConfig.findOne<setupConfig>({
			type: 'music',
			guildId: message.guildId,
		});

		if (config?.channelId === message.channelId) {
			let channel = message.guild?.channels.cache.get(
				config.channelId
			) as TextChannel;
			if (!channel) return;

			message.channel.lastMessage?.delete();

			let member = message.member;

			if (!member?.voice.channel) {
				return await channel
					.send('You are not in a voice channel!')
					.then(async (msg) => {
						await wait.setTimeout(5000);
						msg.delete();
					});
			}

			const query = message.content;

			const searchResult = await client.player.search(query as '', {
				requestedBy: member.user,
			});
			if (!searchResult || !searchResult.tracks.length)
				return void channel
					.send({
						content: `❌ | Track **${query}** not found!`,
					})
					.then(async (msg) => {
						await wait.setTimeout(5000);
						msg.delete();
					});

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
				if (!queue.connection)
					await queue.connect(member.voice.channel!);
			} catch {
				queue.destroy();
				return await channel
					.send({
						content: 'Could not join your voice channel!',
					})
					.then(async (msg) => {
						await wait.setTimeout(5000);
						msg.delete();
					});
			}

			if (searchResult.playlist) {
				queue.addTracks(searchResult.tracks);
				channel
					.send({
						content: `⏱️ | Loading playlist **${searchResult.tracks[0].title}**!`,
					})
					.then(async (msg) => {
						await wait.setTimeout(5000);
						msg.delete();
					});
			} else {
				queue.addTrack(searchResult.tracks[0]);
				channel
					.send({
						content: `⏱️ | Loading track **${searchResult.tracks[0].title}**!`,
					})
					.then(async (msg) => {
						await wait.setTimeout(5000);
						msg.delete();
					});
			}

			if (!queue.playing) return queue.play();
		}
	},
};
