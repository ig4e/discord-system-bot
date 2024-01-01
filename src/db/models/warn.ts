import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose as any) as any;

@plugin(AutoIncrement, { id: 'warn_seq', inc_field: 'id', start_seq: 1, reference_fields: ['userId'] })
class Warn {
	@prop()
	id!: number;

	@prop({ required: false })
	reason: string;

	@prop()
	userId!: string;

	@prop()
	givenBy!: string;

	@prop({ type: Date, default: () => new Date() })
	createdAt: Date;
}

export const WarnModel = getModelForClass(Warn);
