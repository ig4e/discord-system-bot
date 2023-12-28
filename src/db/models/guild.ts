import { getModelForClass, prop } from '@typegoose/typegoose';

class Guild {
	@prop({ default: '!' })
	prefix: string;
}

export const GuildModel = getModelForClass(Guild);
