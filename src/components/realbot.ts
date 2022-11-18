import { Player } from 'discord-player';
import {
	Client,
	ClientOptions,
	Collection,
	GatewayIntentBits,
} from 'discord.js';
import { RealBotDB } from '../db';
import COMMAND, { CommandType } from './interface';

export class RealBot extends Client {
	public commands: Collection<string, COMMAND>;
	public command_list!: CommandType[];
	public category: string[];
	public player!: Player;
	public riot;
	public queuepage: number;
	public helppage: number;
	public myId!: string;
	public runningTime: number = 0;

	constructor(
		options: ClientOptions = {
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildPresences,
			],
		}
	) {
		super(options);
		this.riot = new Array();
		this.commands = new Collection();
		this.category = new Array('General');
		this.queuepage = 0;
		this.helppage = 0;
	}

	async db(type: boolean = true) {
		const db = new RealBotDB();
		await db.connect(type);
		return db;
	}
}
