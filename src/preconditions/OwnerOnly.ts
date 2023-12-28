import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuCommandInteraction, Message } from 'discord.js';
import { config } from '../config';

export class OwnerOnlyPrecondition extends Precondition {
	public override async messageRun(message: Message) {
		// for Message Commands
		return this.checkOwner(message.author.id);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		// for Slash Commands
		return this.checkOwner(interaction.user.id);
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
		// for Context Menu Command
		return this.checkOwner(interaction.user.id);
	}

	private async checkOwner(userId: string) {
		return config.owners!.includes(userId) ? this.ok() : this.error({});
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}
