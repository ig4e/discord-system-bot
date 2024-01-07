import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { TicketManager } from '../../lib/tickets';

@ApplyOptions<Command.Options>({
	name: 'claim',
	aliases: ['استلام'],
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });
		const ticketManager = new TicketManager({ message });

		return await ticketManager
			.claim()
			.then(() => {
				return message.reply({ embeds: [embedManager.success({ description: `The ticked been claimed by: ${message.author}` })] });
			})
			.catch((error) => {
				return message.reply({ embeds: [embedManager.error({ description: error.message })] });
			});
	}
}
