import { ColorResolvable } from 'discord.js';
import { join } from 'path';
import { config } from '../config';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export type ColorType = {
	readonly primary: ColorResolvable;
	readonly info: ColorResolvable;
	readonly success: ColorResolvable;
	readonly danger: ColorResolvable;
	readonly warning: ColorResolvable;
};

export const colors = config.colors as any as ColorType;
