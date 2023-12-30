import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { codeBlock, type ButtonInteraction, type GuildMember } from 'discord.js';
import { config } from '../config';
import { EmbedManager } from '../lib/embeds';
import { db } from '../db';
import { ApplyStatus } from '../db/models/apply';
import { translateApplyStatus } from '../lib/utils';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const embedManager = new EmbedManager({ interaction: interaction as any });
		const accepted = interaction.customId.includes(`accept`);
		await interaction.deferReply({ ephemeral: true });

		const apply = await db.applies.findById(interaction.message.id);

		if (!apply) {
			return interaction.editReply({ embeds: [embedManager.error({ description: 'حدث خطأ أثناء الحصول على التقديم' })] });
		}

		const member = await interaction.guild?.members.fetch(apply.userId);

		if (!member) return interaction.editReply({ embeds: [embedManager.error({ description: 'حدث خطأ أثناء الحصول على العضو' })] });

		if (accepted) {
			await member?.roles.add(config.roles.afterApplyAccept, 'قبول التقديم');

			await member?.send({ embeds: [embedManager.success({ description: 'تم قبول تقديمك' })] });

			await apply.updateOne({ status: ApplyStatus.Accepted });

			await interaction.message.edit(
				this.generateApplyMessage({ interaction, member, questions: apply.questions, status: ApplyStatus.Accepted })
			);

			return await interaction.editReply({
				embeds: [embedManager.success({ description: 'تم قبول التقديم' })]
			});
		} else {
			await member?.send({ embeds: [embedManager.error({ description: 'تم رفض تقديمك' })] });

			await apply.updateOne({ status: ApplyStatus.Denied });

			await interaction.message.edit(
				this.generateApplyMessage({ interaction, member, questions: apply.questions, status: ApplyStatus.Denied })
			);

			return await interaction.editReply({
				embeds: [embedManager.error({ description: 'تم رفض التقديم' })]
			});
		}
	}

	generateApplyMessage({
		interaction,
		member,
		questions,
		status
	}: {
		interaction: any;
		member: GuildMember;
		questions: { label: string; answer: string }[];
		status: ApplyStatus;
	}) {
		const embedManager = new EmbedManager({ interaction: interaction as any });

		return {
			embeds: [
				embedManager[ApplyStatus.Accepted === status ? 'success' : 'error']({
					title: `تقديم دخول الادارة`,
					description: `* المقدم: ${member}\n* الحالة: ${translateApplyStatus(status)}`
				}).addFields(
					questions.map((question, index) => ({
						name: `${index + 1} - ${question.label}`,
						value: codeBlock(question.answer)
					}))
				)
			],
			components: []
		};
	}

	public override parse(interaction: ButtonInteraction) {
		if (!interaction.customId.includes(`apply-actions`)) return this.none();

		return this.some();
	}
}
