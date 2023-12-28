import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import humanize from 'human-format';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'tax',
	aliases: ['tax', 'ضريبة'],
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const emebedManager = new EmbedManager({ message });

		const rawAmount = await args.pick('string').catch(() => {
			const prefix = this.container.client.fetchPrefix(message);
			message.channel.send({ embeds: [emebedManager.error({ description: `استعمال خاطئ\n\`${prefix}tax amount\`` })] });

			return null;
		});

		if (!rawAmount) return;

		const parsedAmount = humanize.parse(rawAmount);
		const tax = Math.round(parsedAmount * 0.05);

		return message.channel.send(`> ${parsedAmount + tax}`);
	}
}
