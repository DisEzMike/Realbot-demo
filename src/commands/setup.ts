import { RealBotDB } from './../db/index';
import {
	CommandInteraction,
	TextChannel,
	ChannelType,
	CategoryChannel,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { RealBot } from '../components/realbot';
import setupConfig from '../db/models/setupconfig';
import wait from 'node:timers/promises';
import { mainEmbed } from '../components/music-embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('ตั้งค่าห้อง')
		.addStringOption((ops) =>
			ops
				.setName('type')
				.setDescription('ประเภทการตั้งค่า')
				.setRequired(true)
				.addChoices(
					{ name: 'Greeting Channel', value: 'welcome' },
					{ name: 'Music Channel', value: 'music' }
				)
		),
	async execute(
		interaction: CommandInteraction,
		client: RealBot,
		db: RealBotDB
	) {
		await interaction.deferReply();
		const setupType = interaction.options.get('type')!.value as string;
		const guildId = interaction.guildId!;

		switch (setupType) {
			case 'welcome':
				let welcome = await db.SetupConfig.findOne<setupConfig>({
					type: 'welcome',
					guildId: guildId,
				});

				if (welcome) {
					const channel = interaction.guild?.channels.cache.get(
						welcome.channelId
					) as TextChannel | undefined;

					if (channel) channel.delete();

					const newChannel = await createChannel(
						interaction,
						'welcome'
					)!;

					await db.SetupConfig.updateOne(
						{
							guildId: guildId,
							type: 'welcome',
							channelId: channel?.id,
						},
						{
							$set: {
								guildId: guildId,
								channelId: newChannel.id,
								type: 'welcome',
							},
						}
					);

					await interaction.editReply({
						content: `Successfully create ${newChannel.toString()} room.`,
					});
					await wait.setTimeout(10000);
					interaction.deleteReply();
				} else {
					const channel = await createChannel(interaction, 'welcome');

					await db.SetupConfig.insertOne({
						guildId: guildId,
						channelId: channel.id,
						type: 'welcome',
					});

					await interaction.editReply({
						content: `Successfully create ${channel.toString()} room.`,
					});
					await wait.setTimeout(10000);
					interaction.deleteReply();
				}
				break;
			case 'music':
				let music = await db.SetupConfig.findOne<setupConfig>({
					type: 'music',
					guildId: guildId,
				});

				if (music) {
					const cat = await realbotCat(interaction);

					const channel = interaction.guild?.channels.cache.get(
						music.channelId
					) as TextChannel | undefined;

					if (channel) channel.delete();

					const newChannel = await createChannel(
						interaction,
						'🎵︰𝑹𝒆𝒂𝒍𝒃𝒐𝒕-𝑴𝒖𝒔𝒊𝒄',
						cat
					)!;

					newChannel
						.send({
							embeds: [mainEmbed()],
						})
						.then(async (msg) => {
							msg.react('⏯️'); //stop or start
							msg.react('⏭️'); // skip
							msg.react('🔀'); // shuffle
							msg.react('🎶'); // queue
							msg.react('🔉'); // volume down
							msg.react('🔊'); // volume up
							msg.react('🗑️'); // clear

							await db.SetupConfig.updateOne(
								{
									guildId: guildId,
									type: 'music',
									channelId: channel?.id,
								},
								{
									$set: {
										guildId: guildId,
										channelId: newChannel.id,
										type: 'music',
										messageId: msg.id,
									},
								}
							);
						});

					let queue = client.player.getQueue(guildId);
					if (queue) queue.metadata = { channel: newChannel };

					await interaction.editReply({
						content: `Successfully create ${newChannel.toString()} room.`,
					});
					await wait.setTimeout(10000);
					interaction.deleteReply();
				} else {
					const cat = await realbotCat(interaction);

					const channel = await createChannel(
						interaction,
						'🎵︰𝑹𝒆𝒂𝒍𝒃𝒐𝒕-𝑴𝒖𝒔𝒊𝒄',
						cat
					);
					channel
						.send({
							embeds: [mainEmbed()],
						})
						.then(async (msg) => {
							msg.react('⏯️'); //stop or start
							msg.react('⏭️'); // skip
							msg.react('🔀'); // shuffle
							msg.react('🎶'); // queue
							msg.react('🔉'); // volume down
							msg.react('🔊'); // volume up
							msg.react('🗑️'); // clear

							await db.SetupConfig.insertOne({
								guildId: guildId,
								channelId: channel.id,
								type: 'music',
								messageId: msg.id,
							});
						});

					let queue = client.player.getQueue(guildId);
					if (queue) queue.metadata = { channel: channel };

					await interaction.editReply({
						content: `Successfully create ${channel.toString()} room.`,
					});
					await wait.setTimeout(10000);
					interaction.deleteReply();
				}

				break;
			default:
				break;
		}
	},
};

async function realbotCat(interaction: CommandInteraction) {
	let cat = interaction.guild?.channels.cache.find(
		(x) => x.name == 'Realbot Zone'
	) as CategoryChannel | undefined;

	if (!cat) {
		cat = await interaction.guild?.channels.create({
			name: 'Realbot Zone',
			type: ChannelType.GuildCategory,
		})!;
	}

	cat.setPosition(0);

	return cat;
}

async function createChannel(
	interaction: CommandInteraction,
	name: string,
	cat?: CategoryChannel
) {
	return (await interaction.guild?.channels
		.create({
			name: name,
			type: ChannelType.GuildText,
			parent: cat,
		})
		.catch(console.error)!) as TextChannel;
}
