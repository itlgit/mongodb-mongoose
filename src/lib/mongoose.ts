import mongoose from 'mongoose';

/**
 * Connect to MongoDB using MONGODB_URI env var.
 * Caches the connection on globalThis to avoid creating multiple connections
 * during hot reloads in development (Next.js).
 */
const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
	// It's often better to throw early so developers notice missing config.
	// However some environments may call this file without DB access (e.g., static export),
	// so we only warn here.
	console.warn('MONGODB_URI is not set. MongoDB connection will not be established.');
}

type MongooseSingleton = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

declare global {
	// eslint-disable-next-line no-var
	var _mongoose: MongooseSingleton | undefined;
}

// Use globalThis so code runs in environments where `global` is not defined
if (!globalThis._mongoose) {
	globalThis._mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
	if (globalThis._mongoose!.conn) {
		return globalThis._mongoose!.conn as typeof mongoose;
	}

	if (!MONGODB_URI) {
		throw new Error('MONGODB_URI is not defined');
	}

	if (!globalThis._mongoose!.promise) {
		globalThis._mongoose!.promise = mongoose.connect(MONGODB_URI, {
			// use new URL parser, unified topology and other options are default in mongoose v6+
		}).then(() => mongoose);
	}

	globalThis._mongoose!.conn = await globalThis._mongoose!.promise;
	return globalThis._mongoose!.conn as typeof mongoose;
}

export default connectToDatabase;
