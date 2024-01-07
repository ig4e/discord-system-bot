import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { TicketManager } from '../../lib/tickets';

@ApplyOptions<Command.Options>({
	name: 'tlock',
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });
		const ticketManager = new TicketManager({ message });

		return await ticketManager
			.lock()
			.then(() => {
				return message.reply({ embeds: [embedManager.success({ description: `ticket chat been locked by: ${message.author}` })] });
			})
			.catch((error) => {
				return message.reply({ embeds: [embedManager.error({ description: error.message })] });
			});
	}
}
