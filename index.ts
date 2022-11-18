import fs from 'fs';
import { RealBot } from './src/components/realbot';
import { Config } from './src/db/models';
import { Player } from 'discord-player';
const { registerPlayerEvents } = require('./src/events/nonload/music');
require('dotenv').config();

const main = async () => {
	const client = new RealBot();
	client.runningTime = new Date().getTime();
	const db = await client.db();

	client.player = new Player(client);
	registerPlayerEvents(client, client.player, db);

	//Handler
	const handle_files = fs
		.readdirSync(`./src/handlers`)
		.filter((f) => f.endsWith(process.env.fileType!));

	for (let handle_file of handle_files) {
		require(`./src/handlers/${handle_file.split('.')[0]}${process.env
			.fileType!}`)(client, db);
	}
	client.login(process.env.TOKEN);
};

main();
