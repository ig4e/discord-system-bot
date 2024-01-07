import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'unban',
	aliases: ['فك'],
	preconditions: ['GuildOnly'],
	requiredUserPermissions: [PermissionFlagsBits.BanMembers],
	description: 'unban cmd'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const emebedManager = new EmbedManager({ message });
		const userId = await args.pick('string');
		const reason = await args.rest('string').catch(() => null);

		if (!userId) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [emebedManager.error({ description: `Unkown Usage\n\`${prefix}unban userId reason?\`` })] });
		}

		const guildBan = await message.guild?.bans.fetch(userId);

		if (!guildBan) return message.reply({ embeds: [emebedManager.error({ description: 'I cant find the user in my ban list' })] });

		try {
			await message.guild?.bans.remove(guildBan.user, reason ?? undefined);

			return message.reply({
				embeds: [emebedManager.success({ description: `Unbanned ${guildBan.user.username} !` })]
			});
		} catch (error) {
			return message.reply({ embeds: [emebedManager.error({ description: 'Missing Perms' })] });
		}
	}
}
