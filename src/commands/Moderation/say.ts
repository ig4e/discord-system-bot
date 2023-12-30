import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { PermissionFlagsBits, TextBasedChannel } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'say',
	description: 'امر',
	requiredUserPermissions: [PermissionFlagsBits.ManageChannels]
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addChannelOption((option) => option.setName('channel').setDescription('شانل الرسالة').setRequired(true))
				.addStringOption((option) => option.setName('message').setDescription('الرسالة').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const emebedManager = new EmbedManager({ interaction });

		const channel = interaction.options.getChannel('channel', true) as TextBasedChannel;
		const message = interaction.options.getString('message', true);

		await channel.send(message);

		await interaction.reply({ embeds: [emebedManager.success({ description: `تم أرسال الرسالة بنجاح` })], ephemeral: true });
	}
}
