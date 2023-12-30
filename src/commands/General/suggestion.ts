import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { GuildTextBasedChannel } from 'discord.js';
import { config } from '../../config';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'suggestion',
	description: 'أقتراح للمطور او للبوت',
	runIn: 'GUILD_TEXT',
	cooldownDelay: Time.Hour,
	cooldownLimit: 1
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('for')
						.setDescription('نوع الاقتراح')
						.addChoices({ name: 'للمطور', value: 'developer' }, { name: 'للبوت', value: 'bot' })
						.setRequired(true)
				)
				.addStringOption((option) => option.setName('suggestion').setDescription('أقتراحك').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const embedManager = new EmbedManager({ interaction });
		const forOption = interaction.options.getString('for', true) as 'developer' | 'bot';
		const suggestion = interaction.options.getString('suggestion', true);

		const suggestionChannel = (await interaction.guild?.channels.fetch(
			forOption === 'bot' ? config.channels.suggestions.bot : config.channels.suggestions.developer
		)) as GuildTextBasedChannel;

		const suggestionMessage = await suggestionChannel.send({
			embeds: [embedManager.info({ title: `اقتراح لل${forOption === 'bot' ? 'مطور' : 'بوت'}`, description: suggestion })]
		});

		await Promise.all([suggestionMessage.react(config.icons.success), suggestionMessage.react(config.icons.error)]);

		return interaction.reply({
			embeds: [embedManager.success({ description: 'تم ارسال اقتراحك بنجاح' })]
		});
	}
}
