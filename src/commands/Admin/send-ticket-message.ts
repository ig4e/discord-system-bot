import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { config } from '../../config';
import { createAttachment } from '../../lib/utils';

@ApplyOptions<Command.Options>({
	name: 'send-ticket-message',
	description: 'بعت رسالة التيكت',
	requiredUserPermissions: [PermissionFlagsBits.ManageGuild]
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });
		const ticketMessageImage = await createAttachment('ticketMessage');

		const embed = embedManager
			.primary({
				enableTitleIcon: false,
				title: 'انا لخدمتك',
				description: `افتح تيكيت دخيلك`
			})
			.setImage(ticketMessageImage.attachmentLocalUrl)
			.setFooter({ iconURL: message.guild?.iconURL()!, text: `سنكون دائما سعداء لخدمتك` });

		const buttons = config.ticket.category.map((button) => {
			return new ButtonBuilder({ emoji: button.emoji ?? undefined })
				.setCustomId(`ticket-m:${button.id}`)
				.setLabel(button.label)
				.setStyle(ButtonStyle.Secondary);
		});

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);

		return message.channel.send({
			embeds: [embed],
			components: [row],
			files: [ticketMessageImage.attachment]
		});
	}
}
