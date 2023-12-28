import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'call',
	aliases: ['نداء', 'come', 'تعال'],
	description: 'أمر النداء'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const emebedManager = new EmbedManager({ message });

		try {
			const user = await args.pick('user').catch(() => {
				const prefix = this.container.client.fetchPrefix(message);
				message.channel.send({ embeds: [emebedManager.error({ description: `استعمال خاطئ\n\`${prefix}come @mention\`` })] });

				return null;
			});

			if (!user) return;

			await user.send({
				embeds: [
					emebedManager.info({
						title: `نداء`,
						description: `${user},\n* المنادي: ${message.author}\n* الشانل: ${message.channel}`
					})
				]
			});

			return message.channel.send({ embeds: [emebedManager.success({ description: 'تم النداء' })] });
		} catch (error) {
			return message.channel.send({ embeds: [emebedManager.error({ description: 'حدث خطأ' })] });
		}
	}
}
