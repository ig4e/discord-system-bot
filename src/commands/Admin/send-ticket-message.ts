import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { config } from '../../config';

@ApplyOptions<Command.Options>({
	name: 'send-ticket-message',
	description: 'send ticket msg',
	requiredUserPermissions: [PermissionFlagsBits.ManageGuild]
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });

		const embed = embedManager
			.primary({
				enableTitleIcon: false,
				title: 'Buy Slot',
				description: `Choose a button below to create a ticket`
			})
			.setImage(config.images.ticketMessageImage)
			.setFooter({ iconURL: message.guild?.iconURL()!, text: `We are here to serve you` });

		const buttons = config.ticket.category.map((button) => {
			return new ButtonBuilder({ emoji: button.emoji ?? undefined })
				.setCustomId(`ticket-m:${button.id}`)
				.setLabel(button.label)
				.setStyle(ButtonStyle.Secondary);
		});

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);

		return message.channel.send({
			embeds: [embed],
			components: [row]
		});
	}
}
