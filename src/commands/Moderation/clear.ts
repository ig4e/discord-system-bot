import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { PermissionFlagsBits, type Message, ChannelType, codeBlock } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

const MAX_DELETE_AMOUNT = 100;

@ApplyOptions<Command.Options>({
	name: 'clear',
	aliases: ['مسح'],
	description: 'أمر الكلير',
	requiredUserPermissions: [PermissionFlagsBits.ManageMessages]
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		if (message.channel.type !== ChannelType.GuildText) return;
		const embedManager = new EmbedManager({ message });
		let amount = await args.pick('number').catch(() => 100);

		if (!amount) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [embedManager.error({ description: `استعمال خاطئ\n\`${prefix}clear amount\`` })] });
		}

		if (amount > 1000) amount = 1000;

		try {
			await message.reply({ embeds: [embedManager.info({ description: `جارى المسح...` })] }).then(() => message.delete());

			let remainingMessages = amount + 1;
			let deletedMessagesAmount = 0;

			while (remainingMessages > 0) {
				const messagesToDelete = Math.min(remainingMessages, MAX_DELETE_AMOUNT);

				const messages = await message.channel.messages.fetch({ limit: messagesToDelete });
				const validMessages = messages.filter((msg) => Date.now() - msg.createdTimestamp <= 1209600000);

				if (validMessages.every((msg) => Date.now() - msg.createdTimestamp > 1209600000)) {
					break;
				}

				const deleted = await message.channel.bulkDelete(validMessages);
				await new Promise((resolve) => setTimeout(resolve, 2000));

				remainingMessages -= validMessages.size;
				deletedMessagesAmount += deleted.size;
			}

			return message.channel
				.send({
					embeds: [embedManager.success({ description: codeBlock(`تم مسح ${deletedMessagesAmount} رسالة`) })]
				})
				.then((message) => setTimeout(() => message.delete(), 2000));
		} catch (error) {
			return message.channel
				.send({ embeds: [embedManager.error({ description: 'لم استطع مسح الرسائل، يرجى مراجعة صلاحياتي.' })] })
				.then((message) => setTimeout(() => message.delete(), 2000));
		}
	}
}
