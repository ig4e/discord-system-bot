import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import {
	ActionRowBuilder,
	Message,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	PermissionFlagsBits,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { config } from '../../config';

/*


Title:
Description:
Footer:
Color:
Image:

*/

export const embedFields = [
	{
		id: 'title',
		label: 'Title',
		type: TextInputStyle.Short,
		placeholder: 'القوانين',
		minLength: 3,
		maxLength: 100,
		required: true
	},
	{
		id: 'description',
		label: 'Description',
		type: TextInputStyle.Paragraph,
		placeholder: '....',
		minLength: 3,
		maxLength: 1000,
		required: false
	},
	{
		id: 'footer',
		label: 'Footer',
		type: TextInputStyle.Short,
		placeholder: 'القوانين',
		minLength: 3,
		maxLength: 100,
		required: false
	},
	{
		id: 'color',
		label: 'Color',
		type: TextInputStyle.Short,
		placeholder: config.colors.primary,
		minLength: 3,
		maxLength: 100,
		required: false
	},
	{
		id: 'image',
		label: 'Image',
		type: TextInputStyle.Short,
		placeholder: 'https://cdn.discordapp.com/attachments/1192098302171299871/1192103879563825182/IMG_4822.png',
		minLength: 3,
		maxLength: 1000,
		required: false
	}
] as const;

@ApplyOptions<Command.Options>({
	name: 'embed',
	description: 'أمر صنع ايمبيد',
	requiredUserPermissions: [PermissionFlagsBits.ManageMessages]
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
		const modal = new ModalBuilder().setCustomId('embed-modal').setTitle('أرسل ايمبد');
		const embedModalInputs = embedFields.map((field) => {
			return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(field.id)
					.setLabel(field.label)
					.setPlaceholder(field.placeholder)
					.setMaxLength(field.maxLength)
					.setMinLength(field.minLength)
					.setStyle(field.type)
					.setRequired(field.required)
			);
		});

		modal.addComponents(...embedModalInputs);
		await interaction.showModal(modal);
	}

	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });

		return message.reply({ embeds: [embedManager.error({ description: `` })] });
	}
}
