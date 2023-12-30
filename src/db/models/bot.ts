import { getModelForClass, prop } from '@typegoose/typegoose';

export enum StatusType {
	Playing = 0,
	Streaming = 1,
	Listening = 2,
	Watching = 3,
	Custom = 4,
	Competing = 5
}

export enum Status {
	Online = 'online',
	Idle = 'idle',
	DoNotDisturb = 'dnd',
	Invisible = 'invisible'
}

class BotStatus {
	@prop({ default: 'System bot' })
	name: string;
	@prop({ enum: Status, default: Status.Online })
	status: Status;
	@prop({ enum: StatusType, default: StatusType.Watching })
	type: StatusType;
}

class Bot {
	@prop()
	public _id!: string;
	@prop()
	status: BotStatus;
}

export const BotModel = getModelForClass(Bot);
