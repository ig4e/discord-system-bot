import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, type ButtonInteraction } from 'discord.js';
import { config } from '../config';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const modal = new ModalBuilder().setCustomId('apply-modal').setTitle('My Modal');

		const modalQuestions = config.applyQuestions.map((question) => {
			return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(question.id)
					.setLabel(question.label)
					.setPlaceholder(question.placeholder)
					.setMaxLength(question.maxLength)
					.setMinLength(question.minLength)
					.setStyle(question.type)
					.setRequired(question.required)
			);
		});

		modal.addComponents(...modalQuestions);

		await interaction.showModal(modal);
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'apply-confirm') return this.none();

		return this.some();
	}
}
