import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { TicketManager } from '../../lib/tickets';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });
		const ticketManager = new TicketManager({ message });

		return await ticketManager
			.open()
			.then(() => {
				return message.reply({ embeds: [embedManager.success({ description: `تم فتح التذكرة من قبل ${message.author}` })] });
			})
			.catch((error) => {
				return message.reply({ embeds: [embedManager.error({ description: error.message })] });
			});
	}
}
