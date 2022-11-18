import { QueryType } from 'discord-player';
import { RealBot } from './realbot';
import {
	CommandInteraction,
	MessageReaction,
	TextChannel,
	UserResolvable,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js';
// import { addText, Playing } from '../components/embeds/music'
// import { PrimaryBtn, SecondaryBtn } from '../components/button'

export default class RealBotMusic {
	constructor(private guildId: string, private client: RealBot) {}

	async switchPlayorPause(
		messageReaction?: MessageReaction,
		interaction?: CommandInteraction
	) {
		let queue = this.getQueue();
		if (!queue) return;
		if (!queue.playing) return;
		let paused = queue.connection.paused;
		queue.setPaused(!paused);

		if (messageReaction) {
			let channel = this.client.channels.cache.get(
				messageReaction.message.channelId
			) as TextChannel;
			channel
				.send({
					content: !paused
						? '⏸️ | pause a music'
						: '▶️ | playing a music',
				})
				.then((msg) => setTimeout(() => msg.delete(), 1000));
		}

		if (interaction) {
			await interaction.channel?.send({
				content: !paused
					? '⏸️ | pause a music'
					: '▶️ | playing a music',
			});
		}
	}

	async skip(
		messageReaction?: MessageReaction,
		interaction?: CommandInteraction
	) {
		let queue = this.getQueue();
		if (!queue) return;
		if (!queue.playing) return;
		const currentTrack = queue.current;
		let paused = queue.connection.paused;
		if (paused) queue.setPaused(false);
		let success = queue.skip();

		if (messageReaction) {
			let channel = this.client.channels.cache.get(
				messageReaction.message.channelId
			) as TextChannel;
			await channel
				.send({
					content: success
						? `✅ | Skipped **${currentTrack}**!`
						: '❌ | Something went wrong!',
				})
				.then((msg) => setTimeout(() => msg.delete(), 1000));
		}

		if (interaction) {
			await interaction.channel!.send({
				content: success
					? `✅ | Skipped **${currentTrack}**!`
					: '❌ | Something went wrong!',
			});
		}
		return;
	}

	async shuffle(
		messageReaction?: MessageReaction,
		interaction?: CommandInteraction
	) {
		let queue = this.getQueue();
		if (!queue) return;
		if (!queue.playing) return;
		queue.setPaused(false);
		let success = queue.shuffle();

		let text = '';
		if (queue.tracks.length == 0) {
			text = 'ไม่มีเพลงในคิว';
		} else {
			text = 'สลับเพลงในคิวแล้ว';
		}

		if (messageReaction) {
			let channel = this.client.channels.cache.get(
				messageReaction.message.channelId
			) as TextChannel;
			channel
				.send({
					content: success
						? `✅ | Shuffle a queue!`
						: '❌ | Something went wrong!',
				})
				.then((msg) => setTimeout(() => msg.delete(), 1000));
		}

		if (interaction) {
			interaction.channel?.send({
				content: success
					? `✅ | Shuffle a queue!`
					: '❌ | Something went wrong!',
			});
		}
	}

	async queues(
		messageReaction?: MessageReaction,
		interaction?: CommandInteraction,
		client?: RealBot
	) {
		let queue = this.getQueue();
		if (!queue) return;
		let queueString = '';

		if (queue.tracks.length == 0) {
			queueString = 'ไม่มีเพลงในคิว';
		} else {
			queueString = queue.tracks
				.slice(0, 20)
				.map((song, i) => {
					return `**${i + 1}.** ${song.title.slice(0, 40)} \`(${
						song.duration
					})\``;
				})
				.join('\n');
			if (queue.tracks.length > 20) {
				queueString += `\n...และอีกทั้งหมด ${
					queue.tracks.length - 20
				} เพลง`;
			}
		}

		if (messageReaction) {
			let channel = this.client.channels.cache.get(
				messageReaction.message.channelId
			) as TextChannel;

			let embed = new EmbedBuilder()
				.setTitle('Realbot Music')
				.setDescription(queueString);

			return channel
				.send({ embeds: [embed] })
				.then((msg) => setTimeout(() => msg.delete(), 5000));
		}

		if (interaction) {
			const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
			let page = client!.queuepage;

			if (page + 1 > totalPages)
				return await interaction.reply(
					`ไม่มีหน้านี้. มีทั้งหมด ${totalPages} หน้า`
				);

			queueString = queue.tracks
				.slice(page * 10, page * 10 + 10)
				.map((song, i) => {
					return `**${page * 10 + i + 1}.** ${song.title.slice(
						0,
						40
					)} \`(${song.duration})\``;
				})
				.join('\n');

			const currentSong = queue.current;

			let embed = new EmbedBuilder()
				.setTitle('Realbot Music')
				.setDescription(
					`**กำลังเล่น**\t${currentSong.title} \`(${currentSong.duration})\`\n` +
						queueString
				)
				.setFooter({
					text: `หน้า ${page + 1} จากทั้งหมด ${totalPages} หน้า`,
				});

			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder()
					.setCustomId('queue_back')
					.setStyle(ButtonStyle.Primary)
					.setLabel('ย้อนกลับ')
					.setDisabled(page < 1),
				new ButtonBuilder()
					.setCustomId('queue_next')
					.setStyle(ButtonStyle.Secondary)
					.setLabel('หน้าถัดไป')
					.setDisabled(page == totalPages - 1)
			);
			return { components: [row], embeds: [embed] };
		}
	}

	volume(messageReaction: MessageReaction, addvalume: number) {
		let queue = this.getQueue();
		if (!queue) return;
		let volume = queue.volume;
		queue.setVolume(volume + addvalume);
	}

	async clear(
		messageReaction?: MessageReaction,
		interaction?: CommandInteraction
	) {
		let queue = this.getQueue();
		if (!queue) return;
		queue.clear();

		if (messageReaction) {
			let channel = this.client.channels.cache.get(
				messageReaction.message.channelId
			) as TextChannel;
			return channel
				.send({ content: '🗑️ | Queue cleared.' })
				.then((msg) => setTimeout(() => msg.delete(), 1000));
		}

		if (interaction) {
			await interaction.channel?.send({ content: '🗑️ | Queue cleared.' });
		}
	}

	getQueue() {
		let queue = this.client.player.getQueue(this.guildId);
		if (!queue) {
			queue = this.client.player.createQueue(this.guildId, {
				ytdlOptions: {
					filter: 'audioonly',
					highWaterMark: 1 << 30,
					dlChunkSize: 0,
				},
			});
		}
		return queue;
	}
}
