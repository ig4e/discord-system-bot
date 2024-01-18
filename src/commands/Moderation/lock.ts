import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { ChannelType, PermissionFlagsBits, type Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'lock',
	aliases: ['قفل'],
	description: 'أمر قفل الشانلات',
	requiredUserPermissions: [PermissionFlagsBits.ManageChannels]
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const emebedManager = new EmbedManager({ message });
		const channel = await args.pick('channel').catch(() => message.channel);

		if (!message.guild) return;
		if (channel.type !== ChannelType.GuildText) return;

		try {
			await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
				SendMessages: false
			});

			return message.reply({
				embeds: [emebedManager.success({ description: `تم قفل الروم.` })]
			});
		} catch (error) {
			return message.reply({
				embeds: [emebedManager.error({ description: 'لم استطع قفل الروم، يرجى مراجعة صلاحياتي وترتيب رتبتي.' })]
			});
		}
	}
}
