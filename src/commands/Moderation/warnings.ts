import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { time, type Message, Colors, PermissionFlagsBits } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { PaginatedMessageEmbedFields } from '@sapphire/discord.js-utilities';
import { db } from '../../db';
import { codeBlock } from '@sapphire/utilities';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const embedManager = new EmbedManager({ message });
		const user = await args.pick('user').catch(() => message.author);
		const warnings = await db.warns.find({ userId: user.id });

		if (!warnings.length) return message.reply({ embeds: [embedManager.info({ description: 'لا يوجد تحذيرات' })] });

		if (!message.member!.permissions.has(PermissionFlagsBits.KickMembers) && user.id !== message.author.id) {
			return message.reply({ embeds: [embedManager.warning({ description: 'ليس لديك الصلاحيات لعرض تحذيرات شخص أخر' })] });
		}

		return new PaginatedMessageEmbedFields({})
			.setTemplate({ title: 'التخذيرات', color: Colors.Blue })
			.setItems(
				warnings.map((warn) => ({
					name: `تحذير رقم (${warn._id})`,
					value: codeBlock(warn.reason ?? 'لا يوجد') + `\n* ⏱ ${time(warn.createdAt)}\n* بواسطة: <@${warn.givenBy}>`,
					inline: false
				}))
			)
			.setItemsPerPage(5)
			.make()
			.run(message);

		//return message.channel.send('Hello world!');
	}
}
