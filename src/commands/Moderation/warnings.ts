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

		if (!warnings.length) return message.reply({ embeds: [embedManager.info({ description: 'No warnings have been issued.' })] });

		if (!message.member!.permissions.has(PermissionFlagsBits.KickMembers) && user.id !== message.author.id) {
			return message.reply({ embeds: [embedManager.warning({ description: 'Missing Perms' })] });
		}

		return new PaginatedMessageEmbedFields({})
			.setTemplate({ title: 'Warning List', color: Colors.Blue })
			.setItems(
				warnings.map((warn) => ({
					name: `Warn Num(${warn.id})`,
					value: codeBlock(warn.reason ?? 'No reason') + `\n* ⏱ ${time(warn.createdAt)}\n* By: <@${warn.givenBy}>`,
					inline: false
				}))
			)
			.setItemsPerPage(5)
			.make()
			.run(message);

		//return message.channel.send('Hello world!');
	}
}
