import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { PresenceStatusData } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { db } from '../../db';

@ApplyOptions<Command.Options>({
	description: 'تغيير حالة البوت',
	preconditions: ['OwnerOnly']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('name').setDescription('أسم الحالة').setRequired(true))
				.addStringOption((option) =>
					option
						.setName('status')
						.setDescription('الحالة')
						.addChoices(
							{ name: 'Online', value: 'online' },
							{ name: 'Idle', value: 'idle' },
							{ name: 'Do Not Disturb', value: 'dnd' },
							{ name: 'Invisible', value: 'invisible' }
						)
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('type')
						.setDescription('نوع الحالة')
						.addChoices(
							{ name: 'Playing', value: 0 },
							{ name: 'Streaming', value: 1 },
							{ name: 'Listening', value: 2 },
							{ name: 'Watching', value: 3 },
							{ name: 'Custom', value: 4 },
							{ name: 'Competing', value: 5 }
						)
						.setRequired(true)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const emebedManager = new EmbedManager({ interaction });
		const name = interaction.options.getString('name', true);
		const status = interaction.options.getString('status', true) as PresenceStatusData;
		const type = interaction.options.getInteger('type', true);

		await db.bots.findByIdAndUpdate(this.container.client.user!.id, {
			status: {
				name: name,
				type: type,
				status: status
			}
		});

		this.container.client.user?.setPresence({
			status: status,
			activities: [{ name: name, type: type, url: type === 1 ? 'https://www.twitch.tv/shroud' : undefined }]
		});

		return interaction.reply({ embeds: [emebedManager.success({ description: `تم تغيير حالة البوت بنجاح` })] });
	}
}
