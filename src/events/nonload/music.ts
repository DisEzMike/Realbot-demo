import { RealBotDB } from './../../db/index';
import { Player, Queue } from 'discord-player';
import { AttachmentBuilder, Message, TextChannel } from 'discord.js';
import wait from 'node:timers/promises';
import { RealBot } from '../../components/realbot';
import setupConfig from '../../db/models/setupconfig';
import { mainEmbed } from '../../components/music-embed';

module.exports.registerPlayerEvents = (
	client: RealBot,
	player: Player,
	db: RealBotDB
) => {
	player.on('error', (queue: Queue<any>, error) => {
		try {
			console.log(
				`[${queue.guild.name}] Error emitted from the queue: ${error.message}`
			);
		} catch (e) {
			console.error;
		}
	});
	player.on('connectionError', (queue: Queue<any>, error) => {
		try {
			console.log(
				`[${queue.guild.name}] Error emitted from the connection: ${error.message}`
			);
		} catch (e) {
			console.error;
		}
	});

	player.on('trackStart', async (queue: Queue<any>, track) => {
		try {
			let config = await db.SetupConfig.findOne<setupConfig>({
				type: 'music',
				guildId: queue.guild.id,
			});
			let message = main(queue.metadata.channel, config?.messageId);
			if (!message) return;
			queue.metadata.channel
				.send(
					`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`
				)
				.then(async (msg: Message) => {
					await wait.setTimeout(5000);
					msg.delete();
				});

			message.edit({
				embeds: [
					mainEmbed(
						`**${track.title}\n${track.url}** \`(${track.duration})\``,
						track.thumbnail
					),
				],
			});
		} catch (e) {
			console.error;
		}
	});

	player.on('trackAdd', (queue: Queue<any>, track) => {
		try {
			queue.metadata.channel
				.send(`🎶 | Track **${track.title}** queued!`)
				.then(async (msg: Message) => {
					await wait.setTimeout(5000);
					msg.delete();
				});
		} catch (e) {
			console.error;
		}
	});

	player.on('botDisconnect', async (queue: Queue<any>) => {
		try {
			let config = await db.SetupConfig.findOne<setupConfig>({
				type: 'music',
				guildId: queue.guild.id,
			});
			let message = main(queue.metadata.channel, config?.messageId);
			if (!message) return;
			queue.metadata.channel
				.send(
					'❌ | I was manually disconnected from the voice channel, clearing queue!'
				)
				.then(async (msg: Message) => {
					await wait.setTimeout(5000);
					msg.delete();
				});
			if (!queue.destroyed) queue.destroy();
			message.edit({
				embeds: [mainEmbed()],
			});
		} catch (e) {
			console.error;
		}
	});

	player.on('channelEmpty', async (queue: Queue<any>) => {
		try {
			let config = await db.SetupConfig.findOne<setupConfig>({
				type: 'music',
				guildId: queue.guild.id,
			});
			let message = main(queue.metadata.channel, config?.messageId);
			if (!message) return;
			queue.metadata.channel
				.send('❌ | Nobody is in the voice channel, leaving...')
				.then(async (msg: Message) => {
					await wait.setTimeout(5000);
					msg.delete();
				});
			if (!queue.destroyed) queue.destroy();
			message.edit({
				embeds: [mainEmbed()],
			});
		} catch (e) {
			console.error;
		}
	});

	player.on('queueEnd', async (queue: Queue<any>) => {
		try {
			let config = await db.SetupConfig.findOne<setupConfig>({
				type: 'music',
				guildId: queue.guild.id,
			});
			let message = main(queue.metadata.channel, config?.messageId);
			if (!message) return;
			queue.metadata.channel
				.send('✅ | Queue finished!')
				.then(async (msg: Message) => {
					await wait.setTimeout(5000);
					msg.delete();
				});
			if (!queue.destroyed) queue.destroy();
			message.edit({
				embeds: [mainEmbed()],
			});
		} catch (e) {
			console.error;
		}
	});
};

function main(channel: TextChannel, id: string = '') {
	// channel.members.find((x) => console.log(x.id));
	return channel.messages.cache.get(id);
}
