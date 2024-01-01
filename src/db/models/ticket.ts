import { getModelForClass, mongoose, plugin, prop } from '@typegoose/typegoose';
import AutoIncrementFactory from 'mongoose-sequence';
import { config } from '../../config';

const AutoIncrement = AutoIncrementFactory(mongoose as any) as any;

export type TicketCategoryId = (typeof config.ticket.category)[number]['id'];

export enum TicketStatus {
	Open = 'open',
	Closed = 'closed'
}

@plugin(AutoIncrement, { inc_field: 'number', start_seq: 1 })
class Ticket {
	@prop({ required: true })
	number: number;

	@prop({ required: true })
	userId: string;

	@prop({ required: false })
	messageId: string;

	@prop({ required: true })
	channelId: string;

	@prop({ enum: TicketStatus, default: TicketStatus.Open })
	status: TicketStatus;

	@prop({ default: false })
	claimed: boolean;

	@prop({ required: false })
	claimedBy: string;

	@prop({ type: String, required: true })
	categoryId: TicketCategoryId;
}

export const TicketModel = getModelForClass(Ticket);
