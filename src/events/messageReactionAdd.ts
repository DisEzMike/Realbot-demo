import { MessageReaction, User, Events } from 'discord.js';
import setupConfig from '../db/models/setupconfig';
import RealBotMusic from '../components/realbot_music';
import { RealBotDB } from './../db/index';
import { RealBot } from './../components/realbot';

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(
		messageReaction: MessageReaction,
		user: User,
		client: RealBot,
		db: RealBotDB
	) {
		if (user.bot) return;

		const config = await db.SetupConfig.findOne<setupConfig>({
			guildId: messageReaction.message.guildId,
			type: 'music',
		});

		if (!config) return;
		if (messageReaction.message.channelId != config.channelId) return;

		setTimeout(() => messageReaction.users.remove(user.id), 100);
		const emoji = messageReaction.emoji.name;

		const music = new RealBotMusic(
			messageReaction.message.guildId!,
			client
		);

		switch (emoji) {
			case '⏯️':
				music.switchPlayorPause(messageReaction);
				break;
			case '⏭️':
				music.skip(messageReaction);
				break;
			case '🔀':
				music.shuffle(messageReaction);
				break;
			case '🎶':
				music.queues(messageReaction);
				break;
			case '🔊':
				music.volume(messageReaction, 20);
				break;
			case '🔉':
				music.volume(messageReaction, -20);
				break;
			case '🗑️':
				music.clear(messageReaction);
				break;
			default:
				break;
		}
	},
};
