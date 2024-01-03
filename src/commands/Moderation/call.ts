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
		const embedManager = new EmbedManager({ message });

		try {
			const user = await args.pick('user').catch(() => undefined);
			const reason = await args.rest('string').catch(() => undefined);

			if (!user) {
				const prefix = await this.container.client.fetchPrefix(message);
				return message.reply({ embeds: [embedManager.error({ description: `استعمال خاطئ\n\`${prefix}come @mention reason?\`` })] });
			}

			await user.send({
				embeds: [
					embedManager.info({
						title: `نداء`,
						description: `${user},\n* المنادي: ${message.author}\n* الشانل: ${message.channel}\n* السبب: ${reason ?? 'لا يوجد سبب'}`
					})
				]
			});

			return message.reply({ embeds: [embedManager.success({ description: 'تم النداء' })] });
		} catch (error) {
			return message.reply({ embeds: [embedManager.error({ description: 'حدث خطأ' })] });
		}
	}
}
