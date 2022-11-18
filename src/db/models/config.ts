import type { ObjectId } from 'mongodb'

export default class Config {
  constructor(
    public name: string,
    public value: string | boolean,
    public id?: ObjectId,
  ) {}
}
