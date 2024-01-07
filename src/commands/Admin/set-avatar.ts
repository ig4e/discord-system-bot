import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	description: 'Changes bot avatar',
	preconditions: ['OwnerOnly']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addAttachmentOption((option) => option.setName('avatar').setDescription('bot pic').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const emebedManager = new EmbedManager({ interaction });
		const avatar = interaction.options.getAttachment('avatar', true);
		await interaction.deferReply({ ephemeral: true });

		try {
			if (avatar.contentType?.includes('image')) {
				await this.container.client.user?.setAvatar(avatar.url);
			}

			return await interaction.editReply({
				embeds: [emebedManager.success({ description: 'Done' }).setImage(avatar.url)]
			});
		} catch (error) {
			return interaction.editReply({ embeds: [emebedManager.error({ description: 'An error occurred try again' })] });
		}
	}
}
