import { MongoClient, ServerApiVersion, Collection, Db } from 'mongodb';

export class RealBotDB {
	private client!: MongoClient;
	private db!: Db;
	public Config!: Collection;
	public Acceptguild!: Collection;
	public SetupConfig!: Collection;
	public Riot!: Collection;
	constructor() {
		this.client = new MongoClient(process.env.MONGO_URL!, {
			serverApi: ServerApiVersion.v1,
		});
	}

	async connect(type = true) {
		try {
			await this.client.connect();
			this.db = this.getDB();
			this.Config = this.db.collection('config');
			this.Acceptguild = this.db.collection('acceptguild');
			this.SetupConfig = this.db.collection('setupconfig');
			this.Riot = this.db.collection('riot');
			if (type) console.log('Database has connected!');
		} catch (err) {
			console.error(err);
		}
	}

	async disconnect() {
		try {
			await this.client.close();
			console.log('Database has disconnected!');
		} catch (err) {
			console.error(err);
		}
	}

	getDB() {
		return this.client.db(process.env.DB_NAME);
	}
}
