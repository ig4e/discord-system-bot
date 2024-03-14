import {
	container,
	type ChatInputCommandSuccessPayload,
	type Command,
	type ContextMenuCommandSuccessPayload,
	type MessageCommandSuccessPayload
} from '@sapphire/framework';
import { cyan } from 'colorette';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AttachmentBuilder, type APIUser, type Guild, type User } from 'discord.js';
import { ApplyStatus } from '../db/models/apply';
import { TicketAction } from './tickets';
import fs from 'fs/promises';
import { config } from '../config';
import path from 'path';

dayjs.extend(relativeTime);
dayjs.locale('ar');

export { dayjs };

export function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	let successLoggerData: ReturnType<typeof getSuccessLoggerData>;

	if ('interaction' in payload) {
		successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
	} else {
		successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
	}

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

function getShardInfo(id: number) {
	return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
	return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
	return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
	if (guild === null) return 'Direct Messages';
	return `${guild.name}[${cyan(guild.id)}]`;
}

export function translateApplyStatus(status: ApplyStatus) {
	let translatedStatus = 'غير معروف';

	switch (status) {
		case ApplyStatus.Pending:
			translatedStatus = 'قيد الانتظار';
			break;
		case ApplyStatus.Accepted:
			translatedStatus = 'مقبول';
			break;
		case ApplyStatus.Denied:
			translatedStatus = 'مرفوض';
			break;
	}

	return translatedStatus;
}

export function translateTicketActions(action: TicketAction) {
	let translatedAction = 'غير معروف';

	// 'create' | 'open' | 'close' | 'claim' | 'unclaim' | 'add' | 'remove' | 'lock' | 'unlock' | 'delete';

	switch (action) {
		case 'create':
			translatedAction = 'إنشاء تذكرة';
			break;
		case 'open':
			translatedAction = 'فتح التذكرة';
			break;
		case 'close':
			translatedAction = 'إغلاق التذكرة';
			break;
		case 'claim':
			translatedAction = 'أستلام التذكرة';
			break;
		case 'unclaim':
			translatedAction = 'إلغاء أستلام التذكرة';
			break;
		case 'add':
			translatedAction = 'إضافة عضو';
			break;
		case 'remove':
			translatedAction = 'إزالة عضو';
			break;
		case 'delete':
			translatedAction = 'حذف التذكرة';
			break;
	}

	return translatedAction;
}

export async function createAttachment(imageKey: keyof typeof config.images) {
	const fileName = config.images[imageKey];
	const fileBuffer = await resolveImage(fileName);
	return { attachment: new AttachmentBuilder(fileBuffer, { name: fileName }), fileName, attachmentLocalUrl: `attachment://${fileName}` };
}

export function resolveImage(fileName: string) {
	return fs.readFile(path.join(__dirname, '../images', fileName));
}
