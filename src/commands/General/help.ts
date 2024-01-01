import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });
		const prefix = await this.container.client.fetchPrefix(message);

		return message.reply({
			embeds: [
				embedManager.info({
					title: `المساعدة`,
					description: `${prefix}ping - التحقق من البنق`
				})
			]
		});
	}
}
