import fs from 'fs';
import EVENT from '../components/interface';
import { RealBot } from '../components/realbot';

module.exports = (client: RealBot, db: any) => {
	const event_files = fs
		.readdirSync(`./src/events`)
		.filter((f) => f.endsWith(process.env.fileType!));
	console.log(`Loading Events...`);
	for (let event_file of event_files) {
		const props: EVENT = require(`../events/${
			event_file.split('.')[0]
		}${process.env.fileType!}`);
		client.on(props.name, (...arg) => props.execute(...arg, client, db));
	}

	console.log(`Events Loaded!`);
};
