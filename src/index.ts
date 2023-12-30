import { LogLevel, SapphireClient } from '@sapphire/framework';
import { mongoose } from '@typegoose/typegoose';
import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';
import { BotModel } from './db/models/bot';
import { GuildModel } from './db/models/guild';
import './lib/setup';
import { Time } from '@sapphire/time-utilities';
import { config } from './config';

const client = new SapphireClient({
	defaultPrefix: '!',
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
	loadMessageCommandListeners: true,
	fetchPrefix: async (message) => {
		let guild = await GuildModel.findById(message.guild?.id);

		if (!guild) {
			guild = await new GuildModel({ _id: message.guild?.id }).save();
		}

		return guild?.prefix ? guild?.prefix : '!';
	},
	defaultCooldown: {
		delay: Time.Second * 2,
		limit: 2,
		filteredUsers: config.owners
	}
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await mongoose.connect('mongodb+srv://admin:1234@cluster0.gywq2as.mongodb.net/sysbotdev?retryWrites=true&w=majority');
		client.logger.info('[DB] logged in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

client.on(Events.ClientReady, async (client) => {
	setTimeout(() => setBotPresence(client), 5000);
	setInterval(async () => setBotPresence(client), 1000 * 60);
});

async function setBotPresence(client: Client<true>) {
	try {
		let bot = await BotModel.findById(client.id);
		if (!bot) bot = await new BotModel({ _id: client.id, status: {} }).save();

		client.user.setPresence({
			status: bot.status.status,
			activities: [
				{
					name: bot.status.name,
					type: bot.status.type as unknown as ActivityType,
					url: bot.status.type === 1 ? 'https://www.twitch.tv/shroud' : undefined
				}
			]
		});
	} catch {}
}

main();
