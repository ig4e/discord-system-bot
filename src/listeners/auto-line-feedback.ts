import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import { config } from '../config';
import { createAttachment } from '../lib/utils';

@ApplyOptions<Listener.Options>({
	name: 'auto-line-feedback',
	once: false,
	event: Events.MessageCreate,
	enabled: true
})
export class UserEvent extends Listener {
	public override async run(message: Message) {
		if (message.author.id === message.client.id) return;

		if (config.channels.autoLine.includes(message.channel.id)) {
			const { attachment: lineImage } = await createAttachment('line');

			message.channel.send({ files: [lineImage] });
		}

		if (config.channels.feedback.includes(message.channel.id)) {
			const { attachment: lineImage } = await createAttachment('line');

			Promise.all([message.channel.send({ files: [lineImage] }), message.react(config.icons.success), message.react(config.icons.error)]);
		}

		return;
	}
}
