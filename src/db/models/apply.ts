import { getModelForClass, prop } from '@typegoose/typegoose';

export enum ApplyStatus {
	Accepted = 'accepted',
	Denied = 'denied',
	Pending = 'pending'
}

class Questions {
	@prop({ required: true })
	label: string;
	@prop({ required: true })
	answer: string;
}

class Apply {
	@prop()
	public _id!: string;

	@prop({ required: true })
	userId: string;

	@prop({ enum: ApplyStatus, default: ApplyStatus.Pending })
	status: ApplyStatus;

	@prop({ type: [Questions] })
	questions: Questions[];
}

export const ApplyModel = getModelForClass(Apply);
