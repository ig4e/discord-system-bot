import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import ms from 'ms';
import { Time } from '@sapphire/time-utilities';

@ApplyOptions<Command.Options>({
	name: 'mute',
	aliases: ['إسكات', 'ميوت'],
	description: 'أمر الميوت',
	requiredUserPermissions: [PermissionFlagsBits.ManageMessages]
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const emebedManager = new EmbedManager({ message });
		const user = await args.pick('user').catch(() => args.pick('string'));
		const duration = await args.pick('string').catch(() => ms(Time.Day * 27));
		const parsedDuration = ms(duration);
		const reason = await args.rest('string').catch(() => undefined);

		if (!user) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [emebedManager.error({ description: `استعمال خاطئ\n\`${prefix}mute @mention duration? reason?\`` })] });
		}

		const member = await message.guild?.members.fetch(typeof user === 'string' ? user : user.id)!;

		try {
			if (parsedDuration) {
				await member.timeout(parsedDuration, reason);
			} else {
				await member.timeout(Time.Day * 27, duration);
			}

			return message.reply({
				embeds: [emebedManager.success({ description: `تم إسكات ${member.user.username}!` })]
			});
		} catch (error) {
			return message.reply({ embeds: [emebedManager.error({ description: 'لم استطع أسكات هذا العضو، يرجى مراجعة صلاحياتي وترتيب رتبتي.' })] });
		}
	}
}
