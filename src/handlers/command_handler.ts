import fs from 'fs';
import COMMAND, { CommandType } from '../components/interface';
import { RealBot } from '../components/realbot';

module.exports = (client: RealBot) => {
	console.log();
	client.command_list = [];
	const command_files = fs
		.readdirSync(`./src/commands`)
		.filter((f) => f.endsWith(process.env.fileType!));
	console.log(`Loading Commands...`);
	for (let command_file of command_files) {
		const props = <COMMAND>(
			require(`../commands/${command_file.split('.')[0]}${process.env
				.fileType!}`)
		);
		let data = <CommandType>props.data.toJSON();
		data.category = 'General';
		client.command_list.push(data);
		client.commands.set(props.data.name, props);
	}

	const subcommand_files = fs
		.readdirSync(`./src/commands`)
		.filter((f) => !f.endsWith(process.env.fileType!));
	for (let file of subcommand_files) {
		const command_files = fs
			.readdirSync(`./src/commands/${file}`)
			.filter((f) => f.endsWith(process.env.fileType!));
		let i = 1;
		for (let command_file of command_files) {
			const props = <COMMAND>(
				require(`../commands/${file}/${
					command_file.split('.')[0]
				}${process.env.fileType!}`)
			);
			if (file != 'admin') {
				let data = <CommandType>props.data.toJSON();
				let file_name = file.split('_')[1];
				if (i == 1) {
					client.category.push(
						file_name.charAt(0).toUpperCase() + file_name.slice(1)
					);
				}
				data.category =
					file_name.charAt(0).toUpperCase() + file_name.slice(1);
				client.command_list.push(data);
				client.commands.set(props.data.name, props);
				i++;
			} else {
				client.commands.set(props.name, props);
			}
		}
	}

	console.log(`Commands Loaded!`);
};
