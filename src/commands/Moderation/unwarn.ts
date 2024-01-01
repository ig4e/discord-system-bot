import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { db } from '../../db';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const embedManager = new EmbedManager({ message });
		const user = await args.pick('user').catch(() => undefined);
		const warnNumber = await args.pick('integer').catch(() => undefined);

		if (!user) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [embedManager.error({ description: `استعمال خاطئ\n\`${prefix}unwarn @mention warn_number\`` })] });
		}

		if (!warnNumber) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [embedManager.error({ description: `استعمال خاطئ\n\`${prefix}unwarn @mention warn_number\`` })] });
		}

		if (!message.guild) return;

		const warnMember = await message.guild.members.fetch(user.id)!;
		const warnAuthor = message.member!;

		if (user.id === message.author.id) {
			return message.reply({ embeds: [embedManager.warning({ description: 'لا يمكنك أزالة تحذيرات من نفسك' })] });
		}

		if (warnMember.roles.highest.position >= warnAuthor.roles.highest.position) {
			return message.reply({ embeds: [embedManager.warning({ description: 'لا يمكنك  أزالة تحذير شخص اعلى منك' })] });
		}

		const warn = await db.warns.findOne({ userId: user.id, _id: warnNumber });

		if (!warn) {
			return message.reply({ embeds: [embedManager.error({ description: `لا يوجد تحذير بهذا الرقم` })] });
		}

		await warn.deleteOne();

		return message.reply({
			embeds: [embedManager.success({ description: `تم حذف التحذير ${warnMember.user.username}!` })]
		});
	}
}
