import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { config } from '../../config';

@ApplyOptions<Command.Options>({
	name: 'line',
	aliases: ['line', 'خط'],
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		return message.channel.send({ files: [config.images.lineURL] });
	}
}
