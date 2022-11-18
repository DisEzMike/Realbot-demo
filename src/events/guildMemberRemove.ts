import { RealBotDB } from './../db/index';
import {
	Events,
	GuildMember,
	GuildMemberManager,
	TextChannel,
} from 'discord.js';
import { RealBot } from '../components/realbot';
import setupConfig from '../db/models/setupconfig';

const greeting = (user: string) => {
	const list = [`${user}, Bye!`, `${user}, see ya!`];
	return list[Math.floor(Math.random() * list.length)];
};

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member: GuildMember, client: RealBot, db: RealBotDB) {
		console.log(
			`(system) [${member.guild.name}] ${member.user.tag} has lefted the server!`
		);

		let isSet = await db.SetupConfig.findOne<setupConfig>({
			type: 'welcome',
			guildId: member.guild.id,
		});

		if (!isSet) return;
		let channel = member.client.channels.cache.get(isSet.channelId);
		if (!channel) return;
		channel = channel as TextChannel;

		await channel.send(greeting(member.user.toString()));
	},
};
