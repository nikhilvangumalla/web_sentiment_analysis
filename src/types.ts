import { Collection } from 'mongodb';

interface ClassificationObject {
	category: string;
	sentence: string;
	sentiment: string;
}

export interface Review {
	classification: ClassificationObject[];
	features: Features;
	productID: string;
}
interface Features {
	[prop: string]: FeatureObject;
}
interface FeatureObject {
	negatives: number;
	positives: number;
	related: string[];
}

export interface Database {
	reviews: Collection<Review>;
}
