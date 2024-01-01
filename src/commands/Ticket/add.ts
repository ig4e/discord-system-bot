import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { TicketManager } from '../../lib/tickets';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const embedManager = new EmbedManager({ message });
		const ticketManager = new TicketManager({ message });
		const user = await args.pick('user').catch(() => args.pick('string'));

		if (!user) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [embedManager.error({ description: `استعمال خاطئ\n\`${prefix}add @mention\`` })] });
		}

		return await ticketManager
			.add({ userId: typeof user === 'string' ? user : user.id })
			.then(() => {
				return message.reply({ embeds: [embedManager.success({ description: `تم أضافة ${user}` })] });
			})
			.catch((error) => {
				return message.reply({ embeds: [embedManager.error({ description: error.message })] });
			});
	}
}
