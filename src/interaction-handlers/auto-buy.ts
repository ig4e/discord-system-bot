import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { codeBlock, type StringSelectMenuInteraction } from 'discord.js';
import { EmbedManager } from '../lib/embeds';
import { config } from '../config';
import { Time } from '@sapphire/time-utilities';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class MenuHandler extends InteractionHandler {
	public override async run(interaction: StringSelectMenuInteraction) {
		if (!interaction.inGuild()) return;
		const embedManager = new EmbedManager({ interaction: interaction as any });
		const [_customId, userId] = interaction.customId.split(':');
		const roleId = interaction.values[0];
		const roleData = config.roles.buy.find((role) => role.id === roleId)!;
		const priceWithTax = Math.round(roleData.price + roleData.price * 0.05);
		const member = await interaction.guild?.members.fetch(userId)!;

		const [message] = await Promise.all([
			interaction.message.edit({
				embeds: [
					embedManager.info({
						title: `شراء رتبة`,
						description: `* الرتبة: <@&${roleId}>\n* السعر: ${roleData?.price}*\n* السعر بعد الضريبة: ${priceWithTax}\n* التحويل الى: ${config.transferTo
							.map((id) => `<@${id}>`)
							.join(', ')}\nامر التحويل:\n ${config.transferTo
							.map((id) => codeBlock(`#credits ${id} ${priceWithTax}`))
							.join('')}\n* يوجد لديك خمس دقائق لتحويل المبلغ`
					})
				]
			}),
			interaction.deferReply().then(() => interaction.deleteReply())
		]);

		const transferMessage = await message.channel
			.awaitMessages({
				max: 1,
				time: Time.Minute * 5,
				filter: (message) => {
					if (message.author.id !== config.probotId) return false;
					if (!message.content.includes(':moneybag:')) return false;
					if (!message.content.includes(member.user.username)) return false;
					if (!config.transferTo.some((id) => message.content.includes(id))) return false;

					const amount = parseInt(
						message.content
							.split('`')
							.filter((s) => s.includes('$'))[0]
							?.trim()
					);

					if (amount < priceWithTax - 1000) {
						return false;
					} else {
						return true;
					}
				},
				dispose: true,
				errors: ['time']
			})
			.catch(() => {
				interaction.followUp({
					embeds: [
						embedManager.error({
							title: 'تم الغاء الشراء',
							description: `انتهي الوقت, يرجي عدم التحويل بعد هذة الرسالة والا سوف يتم تجاهل التحويل`
						})
					]
				});
				return undefined;
			});

		if (transferMessage?.first()) {
			await member.roles.add(roleId);

			interaction.followUp({
				embeds: [
					embedManager.success({
						title: 'تم الشراء',
						description: `تم أضافة الرتبة بنجاح`
					})
				]
			});
		}
	}

	public override parse(interaction: StringSelectMenuInteraction) {
		const [customId, userId] = interaction.customId.split(':');
		if (customId !== 'auto-buy' || interaction.member?.user.id !== userId) return this.none();

		return this.some();
	}
}
