import { Client, ActivityType, Events } from 'discord.js';
import { Config } from '../db/models';
import { RealBotDB } from './../db/index';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { RealBot } from '../components/realbot';

module.exports = {
	name: Events.ClientReady,
	once: false,
	async execute(bot: Client, client: RealBot, db: RealBotDB) {
		// console.log(`Logged in as ${client.user?.tag}!`);
		console.log(`==========================`);
		console.log('Real-Bot Starting...');
		console.log(`Logged in as ${client.user!.tag}!`);
		console.log(`==========================`);
		console.log();

		// get command handler
		const client_id = client.user!.id;
		client.myId = client_id;

		const commands = client.command_list;

		const rest = new REST({
			version: '10',
		}).setToken(process.env.TOKEN!);
		(async () => {
			try {
				await rest.put(Routes.applicationCommands(client_id), {
					body: commands,
				});
				console.log('Successfully registered commands globally!');
				console.log();
			} catch (err) {
				if (err) console.error(err);
			}
		})();

		// Set the Activities of the bot user
		client.user!.setStatus('dnd');
		changeActivities(client);
	},
};

const changeActivities = (client: Client) => {
	let i = 0,
		x;
	setInterval(() => {
		x = 'our Home ❤️';
		switch (i) {
			case 1:
				x = 'our Home ❤️';
				break;
			case 2:
				x = `${client.guilds.cache.size} houses 🏠`;
				break;
			case 3:
				x = `/help !`;
			default:
				i = 0;
		}
		client.user!.setPresence({
			activities: [{ name: x as '', type: ActivityType.Watching }],
		});
		i++;
	}, 3000);
};
