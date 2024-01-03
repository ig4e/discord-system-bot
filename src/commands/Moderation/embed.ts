import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	description: 'أمر صنع ايمبيد'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		//interaction.showModal()
	}

	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });

		return message.reply({ embeds: [embedManager.error({ description: `` })] });
	}
}
