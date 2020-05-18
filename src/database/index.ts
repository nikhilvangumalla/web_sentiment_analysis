import { MongoClient } from 'mongodb';
import { Database } from '../types';

const url = `mongodb://localhost:27017`;

export const connectDatabase = async (): Promise<Database> => {
	const client = await MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const db = client.db('sentiment-analysis');
	return {
		reviews: db.collection('reviews'),
	};
};
