import { getModelForClass, prop } from '@typegoose/typegoose';

class Counter {
	@prop()
	id: string;
	@prop()
	seq: number;
}

export const CounterModel = getModelForClass(Counter, { options: { customName: 'counters' } });
