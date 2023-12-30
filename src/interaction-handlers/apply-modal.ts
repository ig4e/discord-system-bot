import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock, type ModalSubmitInteraction, type TextBasedChannel } from 'discord.js';
import { config } from '../config';
import { EmbedManager } from '../lib/embeds';
import { db } from '../db';
import { ApplyStatus } from '../db/models/apply';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
	public async run(interaction: ModalSubmitInteraction) {
		const embedManager = new EmbedManager({ interaction: interaction as any });
		const author = interaction.member;
		const questions = config.applyQuestions.map((question) => {
			return {
				...question,
				answer: interaction.fields.getTextInputValue(question.id)
			};
		});

		const appliesChannel = (await interaction.guild?.channels.fetch(config.channels.apply.send)) as TextBasedChannel;

		const accept = new ButtonBuilder().setCustomId('apply-actions-accept').setLabel('قبول').setStyle(ButtonStyle.Success);
		const deny = new ButtonBuilder().setCustomId('apply-actions-deny').setLabel('رفض').setStyle(ButtonStyle.Danger);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(accept, deny);

		const applyMessage = await appliesChannel.send({
			embeds: [
				embedManager
					.info({
						title: `تقديم دخول الادارة`,
						description: `* المقدم: ${interaction.member}`
					})
					.addFields(
						questions.map((question, index) => ({
							name: `${index + 1} - ${question.label}`,
							value: codeBlock(question.answer)
						}))
					)
			],
			components: [row]
		});

		await db.applies.create({
			_id: applyMessage.id,
			status: ApplyStatus.Pending,
			userId: author?.user.id,
			questions: questions.map((question) => ({ label: question.label, answer: question.answer }))
		});

		await interaction.reply({
			embeds: [embedManager.success({ description: 'تم تقديم طلبك' })],
			ephemeral: true
		});
	}

	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId !== 'apply-modal' && interaction.isModalSubmit()) return this.none();
		if (!interaction.inGuild()) return this.none();

		return this.some();
	}
}
