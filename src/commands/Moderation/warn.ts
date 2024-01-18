import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { db } from '../../db';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: [PermissionFlagsBits.ManageRoles],
	preconditions: ['GuildOnly']
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const embedManager = new EmbedManager({ message });
		const user = await args.pick('user').catch(() => undefined);
		const reason = await args.pick('string').catch(() => undefined);

		if (!user) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [embedManager.error({ description: `استعمال خاطئ\n\`${prefix}warn @mention reason?\`` })] });
		}

		if (!message.guild) return;

		const warnMember = await message.guild.members.fetch(user.id)!;
		const warnAuthor = message.member!;

		if (user.id === message.author.id) {
			return message.reply({ embeds: [embedManager.warning({ description: 'لا يمكنك تحذير نفسك' })] });
		}

		if (warnMember.roles.highest.position >= warnAuthor.roles.highest.position) {
			return message.reply({ embeds: [embedManager.warning({ description: 'لا يمكنك تحذير شخص اعلى منك' })] });
		}

		const botRolePosition = message.guild.members.me!.roles.highest.position;
		if (warnMember.roles.highest.position >= botRolePosition) {
			return message.reply({ embeds: [embedManager.warning({ description: 'لا يمكنني تحذير شخص اعلى مني' })] });
		}

		await db.warns.create({ reason: reason, userId: user.id, givenBy: message.author.id });

		warnMember.send({
			embeds: [
				embedManager.warning({
					title: `تم تحذيرك!`,
					description: reason ? reason : 'لا يوجد سبب'
				})
			]
		});
		return message.reply({
			embeds: [embedManager.success({ description: `تم تحذير ${warnMember.user.username}!` })]
		});
	}
}
