import type { Events, MessageCommandDeniedPayload } from '@sapphire/framework';
import { Listener, type UserError } from '@sapphire/framework';
import { dayjs } from '../../../lib/utils';

export class UserEvent extends Listener<typeof Events.MessageCommandDenied> {
	public override async run({ context, message: content, identifier }: UserError, { message }: MessageCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;

		if (identifier === 'preconditionCooldown') {
			return message.reply({
				content: `${message.author}, يرجى الإنتظار (متبقي ${dayjs(Date.now() + (context as any).remaining).fromNow(true)})`,
				allowedMentions: { users: [message.author.id], roles: [] }
			});
		}

		return message.reply({ content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
