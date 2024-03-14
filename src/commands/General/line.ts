import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { createAttachment } from '../../lib/utils';

@ApplyOptions<Command.Options>({
	name: 'line',
	aliases: ['line', 'خط'],
	description: 'أمر الخط'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const { attachment: lineImage } = await createAttachment('line');

		return message.channel.send({ files: [lineImage] });
	}
}
