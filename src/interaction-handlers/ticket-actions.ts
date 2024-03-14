import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type ButtonInteraction } from 'discord.js';
import { EmbedManager } from '../lib/embeds';
import { TicketManager } from '../lib/tickets';
import { config } from '../config';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const embedManager = new EmbedManager({ interaction: interaction as any });
		const ticketManager = new TicketManager({ interaction: interaction as any });
		const action = interaction.customId.split(':')[1] as 'claim' | 'lock' | 'unlock' | 'close' | 'unclaim' | 'open' | 'delete';
		await interaction.deferReply();

		if (!interaction.inGuild() || !interaction.channel) return;

		if (action === 'claim') {
			await ticketManager
				.claim()
				.then(() => {
					return interaction.editReply({ embeds: [embedManager.success({ description: `تم أستلام التذكرة من قبل ${interaction.user}` })] });
				})
				.catch((error) => {
					return interaction.editReply({ embeds: [embedManager.error({ description: error.message })] });
				});
		} else if (action === 'unclaim') {
			await ticketManager
				.unclaim()
				.then(() => {
					return interaction.editReply({
						embeds: [embedManager.success({ description: `تم الغاء أستلام التذكرة من قبل ${interaction.user}` })]
					});
				})
				.catch((error) => {
					return interaction.editReply({ embeds: [embedManager.error({ description: error.message })] });
				});
		}

		if (action === 'lock') {
			await ticketManager
				.lock()
				.then(() => {
					return interaction.editReply({ embeds: [embedManager.success({ description: `تم قفل التذكرة من قبل ${interaction.user}` })] });
				})
				.catch((error) => {
					return interaction.editReply({ embeds: [embedManager.error({ description: error.message })] });
				});
		}

		if (action === 'unlock') {
			await ticketManager
				.unlock()
				.then(() => {
					return interaction.editReply({
						embeds: [embedManager.success({ description: `تم الغاء قفل التذكرة من قبل ${interaction.user}` })]
					});
				})
				.catch((error) => {
					return interaction.editReply({ embeds: [embedManager.error({ description: error.message })] });
				});
		}

		if (action === 'close') {
			//ticket-a:

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setCustomId(`ticket-a:delete`).setLabel(`حذف التذكرة`).setEmoji(config.icons.error).setStyle(ButtonStyle.Danger)
			);

			await ticketManager
				.close()
				.then(() => {
					return interaction.editReply({
						components: [row],
						embeds: [embedManager.success({ description: `تم أغلاق التذكرة من قبل ${interaction.user}` })]
					});
				})
				.catch((error) => {
					return interaction.editReply({ embeds: [embedManager.error({ description: error.message })] });
				});
		}

		if (action === 'delete') {
			await ticketManager.delete().catch((error) => {
				return interaction.editReply({ embeds: [embedManager.error({ description: error.message })] });
			});
		}

		if (action === 'open') {
			await ticketManager
				.open()
				.then(() => {
					return interaction.editReply({ embeds: [embedManager.success({ description: `تم فتح التذكرة من قبل ${interaction.user}` })] });
				})
				.catch((error) => {
					return interaction.editReply({ embeds: [embedManager.error({ description: error.message })] });
				});
		}

		return;
	}

	public override parse(interaction: ButtonInteraction) {
		if (!interaction.inGuild()) return this.none();
		if (!interaction.customId.includes('ticket-a')) return this.none();
		return this.some();
	}
}
