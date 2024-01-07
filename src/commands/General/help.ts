import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });
		const prefix = await this.container.client.fetchPrefix(message);

		return message.reply({
			embeds: [
				embedManager.info({
					title: `Help Menu`,
					description: `${prefix}ping - Check the bot latency\n${prefix}line - Send a Line\n${prefix}tax - Calculate probot tax\n${prefix}ban - Ban a user\n${prefix}call - Dm a user \n${prefix}clear - clear 100 msg in the chat\n${prefix}kick - kick a user\n${prefix}lock - lock the chat \n${prefix}unlock - unlock the chat\n${prefix}mute - muting a user \n${prefix}unmute - unmute a user\n${prefix}say - to make the bot send a msg \n${prefix}unban - unban a user \n${prefix}warn - warning a user \n${prefix}unwarn - unwarn a user\n${prefix}warnings - warnings list\n${prefix}add - adding a user to the ticket\n${prefix}claim - claiming the ticket\n${prefix}close - يقوم بقفلclosing the ticket\n${prefix}delete - deleting the ticket\n${prefix}tlock - lock the ticket for the claimed user\n${prefix}open - reopen the ticket\n${prefix}unclaim - unclaiming the ticket \n${prefix}tunlock - reopene the ticket chat\n${prefix}send-ticket-message - send the ticket panel\n/set-avatar - change bot avatarn/set-name - change bot name\n/set-prefix - set a new prefix\n/set-status - change the bot status\n/embed - send a embed msg`})
			]
		});
	}
}
