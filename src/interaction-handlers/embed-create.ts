import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ColorResolvable, ModalSubmitInteraction } from 'discord.js';
import { EmbedManager } from '../lib/embeds';
import { embedFields } from '../commands/Moderation/embed';
import { config } from '../config';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
	public async run(interaction: ModalSubmitInteraction) {
		const embedManager = new EmbedManager({ interaction: interaction as any });
		const fields = embedFields.map((field) => {
			return {
				...field,
				answer: interaction.fields.getTextInputValue(field.id)
			};
		});

		await interaction.deferReply({ ephemeral: true });

		try {
			const finalEmbed = embedManager
				.primary({
					enableTitleIcon: false,
					title: fields.find((f) => f.id === 'title')?.answer,
					description: fields.find((f) => f.id === 'description')?.answer
				})
				.setColor((fields.find((f) => f.id === 'color')?.answer as ColorResolvable) || config.colors.primary);

			const footer = fields.find((f) => f.id === 'footer')?.answer || null;
			const image = fields.find((f) => f.id === 'image')?.answer || null;

			if (footer) {
				finalEmbed.setFooter({ text: footer, iconURL: interaction.guild?.iconURL() || 'https://1.c' });
			}

			if (image) {
				finalEmbed.setImage(image);
			}

			await interaction.channel?.send({
				embeds: [finalEmbed]
			});

			return await interaction.editReply({ embeds: [embedManager.success({ description: 'تم الإرسال بنجاح' })] });
		} catch (error) {
			console.log(error);
			return await interaction.editReply({ embeds: [embedManager.error({ description: (error as Error).message })] });
		}
	}

	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId !== 'embed-modal') return this.none();

		return this.some();
	}
}
