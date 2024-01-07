import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'call',
	aliases: ['نداء', 'come', 'تعال'],
	description: 'Calling Someone'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const embedManager = new EmbedManager({ message });

		try {
			const user = await args.pick('user').catch(() => undefined);
			const reason = await args.rest('string').catch(() => undefined);

			if (!user) {
				const prefix = await this.container.client.fetchPrefix(message);
				return message.reply({ embeds: [embedManager.error({ description: `Unkown Usage\n\`${prefix}come @mention reason?\`` })] });
			}

			await user.send({
				embeds: [
					embedManager.info({
						title: `Call`,
						description: `${user},\n* from: ${message.author}\n* channel: ${message.channel}\n* reason: ${reason ?? 'no reason'}`
					})
				]
			});

			return message.reply({ embeds: [embedManager.success({ description: 'Done' })] });
		} catch (error) {
			return message.reply({ embeds: [embedManager.error({ description: 'An error occurred try again' })] });
		}
	}
}
