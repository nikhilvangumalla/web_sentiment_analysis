require('dotenv').config();
import express, { Application, response } from 'express';
import cors from 'cors';
import axios from 'axios';
import qs from 'qs';
const fs = require('fs');
import { Scraper } from './scraper';
import { connectDatabase } from './database';
import { Review, Database } from './types';

const app: Application = express();
let db: Database;
app.use(cors());
app.set('view engine', 'pug');
app.set('views', 'src/views');
app.use(express.urlencoded());

app.use(express.static('./src/public'));

app.get('/', (_req, res) => {
	res.render('homepage');
});

const deleteFile = (productID: string) => {
	try {
		fs.unlinkSync(`./../sentiment_analysis_ml_part/${productID}.csv`);
		console.log('successfully deleted');
	} catch (error) {
		console.log(error);
	}
};

app.post('/', async (req, res) => {
	const productURL = req.body.productURL;
	const url_parts = productURL.split('/');
	const productID =
		url_parts[4] == 'dp' || url_parts[4] == 'product'
			? url_parts[5]
			: url_parts[4];
	const checkDB = await db.reviews.findOne({ productID });
	if (!checkDB) {
		await Scraper(productURL);
		const { data } = await axios('http://localhost:5000', {
			method: 'POST',
			headers: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			},
			data: qs.stringify({
				filename: `${productID}.csv`,
			}),
		});
		await db.reviews.insertOne(data);
		await deleteFile(productID);
	}
	res.redirect(`http://localhost:9000/result/${productID}`);
});

app.get('/result/:productID', async (req, res) => {
	const review = (await db.reviews.findOne({
		productID: req.params.productID,
	})) as Review;
	res.render('result', {
		review: review,
	});
});

const mountDatabase = async () => {
	db = await connectDatabase();
	app.listen(process.env.PORT, () => {
		console.log(`[server/app]: http://localhost:${process.env.PORT}`);
	});
};

mountDatabase();
