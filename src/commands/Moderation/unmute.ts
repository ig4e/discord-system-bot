import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'unmute',
	aliases: ['تكلم'],
	description: 'أمر فك الميوت',
	requiredUserPermissions: [PermissionFlagsBits.ManageMessages]
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const emebedManager = new EmbedManager({ message });
		const user = await args.pick('user').catch(() => args.pick('string'));
		const reason = await args.rest('string').catch(() => undefined);

		if (!user) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [emebedManager.error({ description: `استعمال خاطئ\n\`${prefix}unmute @mention reason?\`` })] });
		}

		const member = await message.guild?.members.fetch(typeof user === 'string' ? user : user.id)!;

		try {
			await member.timeout(null, reason);
			return message.reply({
				embeds: [emebedManager.success({ description: `تم فك الاسكات عن ${member.user.username}!` })]
			});
		} catch (error) {
			console.log(error);
			return message.reply({
				embeds: [emebedManager.error({ description: 'لم استطع فك الاسكات عن هذا العضو، يرجى مراجعة صلاحياتي وترتيب رتبتي.' })]
			});
		}
	}
}
