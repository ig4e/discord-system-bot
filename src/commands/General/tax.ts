import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
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

		const rawAmount = await args.pick('string').catch(async () => {
			const prefix = await this.container.client.fetchPrefix(message);
			await message.channel.send({ embeds: [emebedManager.error({ description: `استعمال خاطئ\n\`${prefix}tax amount\`` })] });
			return null;
		});

		if (!rawAmount) return;

		const parsedAmount = this.convertShortNumber(rawAmount.toLocaleLowerCase());
		const tax = Math.round(parsedAmount * 0.05);

		return message.reply(`> ${parsedAmount + tax}`);
	}

	convertShortNumber(value: string) {
		let multiplier = 1;
		switch (value.slice(-1)) {
			case 'k':
				multiplier = 1000;
				break;
			case 'm':
				multiplier = 1000000;
				break;
			case 'b':
				multiplier = 1000000000;
				break;
			default:
				break;
		}

		if (multiplier !== 1) {
			return parseFloat(value.slice(0, -1)) * multiplier;
		} else {
			return parseFloat(value);
		}
	}
}
