import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';
import { db } from '../../db';

@ApplyOptions<Command.Options>({
	name: 'set-prefix',
	aliases: ['setprefix', 'set prefix'],
	description: 'Chnages the prefix',
	preconditions: ['OwnerOnly']
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const emebedManager = new EmbedManager({ message });
		const newPrefix = await args.pick('string').catch(() => undefined);
		const currentPrefix = await this.container.client.fetchPrefix(message);

		if (!newPrefix) {
			return message.reply({ embeds: [emebedManager.info({ description: `> Current Prefix: ${currentPrefix}` })] });
		}

		await db.guilds.findByIdAndUpdate(message.guildId, { prefix: newPrefix });

		return message.reply({
			embeds: [emebedManager.success({ description: `Done Changed the prefix to ${newPrefix}` })]
		});
	}
}
