import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { type ButtonInteraction } from 'discord.js';
import { TicketCategoryId } from '../db/models/ticket';
import { EmbedManager } from '../lib/embeds';
import { TicketManager } from '../lib/tickets';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const embedManager = new EmbedManager({ interaction: interaction as any });
		const ticketManager = new TicketManager({ interaction: interaction as any });
		const ticketCategory = interaction.customId.split(':')[1] as TicketCategoryId;
		await interaction.deferReply({ ephemeral: true });

		const { ticketChannel } = await ticketManager.create({ categoryId: ticketCategory });

		return await interaction.editReply({
			embeds: [embedManager.success({ description: `${ticketChannel}, تم انشاء تذكرتك بنجاح` })]
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (!interaction.inGuild()) return this.none();
		if (!interaction.customId.includes('ticket-m')) return this.none();

		return this.some();
	}
}
