import type { ObjectId } from 'mongodb'

export default class Riot {
  constructor(
    public puuid: string,
    public username: string,
    public access_token: string,
    public userId: string,
    public expire_token: string,
    public cookie?: any,
    public id?: ObjectId,
  ) {}
}
