import type { ObjectId } from 'mongodb'

export default class AccecptGuild {
  constructor(public guildId: string, public id?: ObjectId) {}
}
