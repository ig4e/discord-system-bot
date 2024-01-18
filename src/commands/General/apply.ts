import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { config } from '../../config';
import { Time } from '@sapphire/time-utilities';

@ApplyOptions<Command.Options>({
	description: 'أمر التقديم',
	cooldownDelay: Time.Hour,
	cooldownLimit: 1
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });

		if (message.channelId !== config.channels.apply.receive) {
			return message.channel.send({ embeds: [embedManager.error({ description: 'لا يمكنك استخدام هذا الأمر في هذا الروم' })] });
		}

		const confirm = new ButtonBuilder().setCustomId('apply-confirm').setLabel('متابعة').setStyle(ButtonStyle.Primary);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm);

		return message.reply({
			embeds: [embedManager.info({ title: 'أظهار الاسئلة', description: `أضغط متابعة لاظهار اسئلة التقدم الى الادارة` })],
			components: [row]
		});
	}
}
