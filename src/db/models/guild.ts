import { getModelForClass, prop } from '@typegoose/typegoose';

class Guild {
	@prop()
	public _id!: string;
	@prop({ default: '!' })
	prefix: string;
}

export const GuildModel = getModelForClass(Guild);
