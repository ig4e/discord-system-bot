import type { ChatInputCommandDeniedPayload, Events } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';
import { dayjs } from '../../../lib/utils';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	public override async run({ identifier, context, message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;
		const updatedOrDeferred = interaction.deferred || interaction.replied;

		if (identifier === 'preconditionCooldown') {
			return interaction[updatedOrDeferred ? 'editReply' : 'reply']({
				content: `${interaction.member}, يرجى الإنتظار (متبقي ${dayjs(Date.now() + (context as any).remaining).fromNow(true)})`,
				allowedMentions: { users: [interaction.member!.user.id], roles: [] },
				ephemeral: updatedOrDeferred ? undefined : true
			});
		}

		if (updatedOrDeferred) {
			return interaction.editReply({
				content,
				allowedMentions: { users: [interaction.user.id], roles: [] }
			});
		}

		return interaction.reply({
			content,
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral: true
		});
	}
}
