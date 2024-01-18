import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	name: 'ping',
	aliases: ['pong', 'بينج'],
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const emebedManager = new EmbedManager({ message });

		const pongMsg = await message.reply({ embeds: [emebedManager.info({ description: `جارى التحميل...` })] });

		return pongMsg.edit({
			embeds: [
				emebedManager.success({
					title: `سرعة الاتصال`,
					description: `Ping:${Math.round(this.container.client.ws.ping)}ms.\nAPI Latency:${
						pongMsg.createdTimestamp - message.createdTimestamp
					}ms.`
				})
			]
		});
	}
}
