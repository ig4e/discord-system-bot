import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'kick',
	description: 'أمر الكيك',
	requiredUserPermissions: [PermissionFlagsBits.KickMembers]
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const emebedManager = new EmbedManager({ message });
		const user = await args.pick('user').catch(() => args.pick('string'));
		const reason = await args.rest('string').catch(() => null);

		if (!user) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [emebedManager.error({ description: `استعمال خاطئ\n\`${prefix}kick @mention reason?\`` })] });
		}

		const member = await message.guild?.members.fetch(typeof user === 'string' ? user : user.id)!;

		try {
			await member.kick(reason ?? undefined);
			return message.reply({
				embeds: [
					emebedManager.success({
						description: `تم طرد ${member.user.username} من السيرفر`
					})
				]
			});
		} catch (error) {
			return message.reply({ embeds: [emebedManager.error({ description: 'لا يمكنني طرد هذا العضو' })] });
		}
	}
}
