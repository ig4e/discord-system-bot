import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { StringSelectMenuBuilder, type Message, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js';
import { config } from '../../config';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'buy',
	aliases: ['شراء'],
	description: 'شراء رتب'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });
		const select = new StringSelectMenuBuilder()
			.setCustomId(`auto-buy:${message.author.id}`)
			.setPlaceholder('عرض الرتب')
			.addOptions(
				config.roles.buy.map((role) =>
					new StringSelectMenuOptionBuilder().setLabel(role.name).setValue(role.id).setDescription(`السعر: ${role.price}`)
				)
			);

		const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

		return message.reply({
			embeds: [embedManager.info({ title: 'اختر رتبة للشراء' })],
			components: [row]
		});
	}
}
