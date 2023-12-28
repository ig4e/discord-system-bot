import { ColorResolvable } from 'discord.js';
import { join } from 'path';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export const colors: {
	readonly info: ColorResolvable;
	readonly success: ColorResolvable;
	readonly danger: ColorResolvable;
	readonly warning: ColorResolvable;
} = {
	info: 'Blue',
	success: 'Green',
	danger: 'Red',
	warning: 'Orange'
};
