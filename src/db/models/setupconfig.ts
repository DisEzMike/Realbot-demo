import type { ObjectId } from 'mongodb';

export default class setupConfig {
	constructor(
		public guildId: string,
		public channelId: string,
		public type: string,
		public messageId?: string,
		public id?: ObjectId
	) {}
}
