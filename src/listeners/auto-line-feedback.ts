import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import { config } from '../config';

@ApplyOptions<Listener.Options>({
	name: 'auto-line-feedback',
	once: false,
	event: Events.MessageCreate,
	enabled: true
})
export class UserEvent extends Listener {
	public override run(message: Message) {
		if (message.author.id === message.client.id) return;

		if (config.channels.autoLine.includes(message.channel.id)) {
			message.channel.send({ files: [config.images.lineURL] });
		}

		if (config.channels.feedback.includes(message.channel.id)) {
			Promise.all([
				message.channel.send({ files: [config.images.lineURL] }),
				message.react(config.icons.success),
				message.react(config.icons.error)
			]);
		}

		return;
	}
}
