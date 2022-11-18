import { RealBotDB } from './../db/index';
import { Events } from 'discord.js';
import { RealBot } from '../components/realbot';

module.exports = {
	name: Events.Error,
	async execute(err: Error) {
		console.log(`The bot was shut down on ${new Date().toDateString()}`);
		console.error(err.message);
	},
};
