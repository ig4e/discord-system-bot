import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'ban',
	aliases: ['حظر'],
	preconditions: ['GuildOnly'],
	requiredUserPermissions: [PermissionFlagsBits.BanMembers],
	description: 'أمر البان'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const embedManager = new EmbedManager({ message });
		const user = await args.pick('user').catch(() => args.pick('string'));
		const reason = await args.rest('string').catch(() => null);

		if (!user) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [embedManager.error({ description: `استعمال خاطئ\n\`${prefix}ban @mention reason?\`` })] });
		}

		const member = await message.guild?.members.fetch(typeof user === 'string' ? user : user.id)!;

		try {
			await member.ban({ reason: reason ?? undefined });
			return message.reply({
				embeds: [embedManager.success({ description: `تم حظر ${member.user.username} من السيرفر! ✈️` })]
			});
		} catch (error) {
			return message.reply({ embeds: [embedManager.error({ description: 'لم استطع حظر هذا العضو، يرجى مراجعة صلاحياتي وترتيب رتبتي.' })] });
		}
	}
}
