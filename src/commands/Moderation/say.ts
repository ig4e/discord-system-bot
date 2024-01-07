import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { Message, PermissionFlagsBits, TextBasedChannel } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'say',
	description: 'say cmd',
	requiredUserPermissions: [PermissionFlagsBits.ManageChannels]
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('message').setDescription('msg').setRequired(true))
				.addChannelOption((option) => option.setName('channel').setDescription('channel').setRequired(false))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const emebedManager = new EmbedManager({ interaction });

		const channel = (interaction.options.getChannel('channel', false) ?? interaction.channel) as TextBasedChannel;
		const message = interaction.options.getString('message', true);

		await channel.send(message);

		await interaction.reply({ embeds: [emebedManager.success({ description: `Done` })], ephemeral: true });
	}

	public override async messageRun(message: Message, args: Args) {
		const embedManager = new EmbedManager({ message });
		const channel = (await args.pick('channel').catch(() => message.channel)) as TextBasedChannel;
		const messageContent = await args.rest('string').catch(() => undefined);

		if (!messageContent) {
			const prefix = await this.container.client.fetchPrefix(message);
			return message.reply({ embeds: [embedManager.error({ description: `Unkown Usage\n\`${prefix}say #channel? message\`` })] });
		}

		return await channel.send(messageContent);
	}
}
