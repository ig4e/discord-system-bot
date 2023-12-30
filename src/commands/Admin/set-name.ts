import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'set-name',
	description: 'أمر تغيير الاسم',
	preconditions: ['OwnerOnly']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('name').setDescription('أسم البوت').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const embedManager = new EmbedManager({ interaction });
		const name = interaction.options.getString('name', true);

		await this.container.client.user?.setUsername(name);

		await interaction.reply({ embeds: [embedManager.success({ description: `تم تغيير اسم البوت بنجاح` })] });
	}
}
