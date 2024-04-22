import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true, // более детальный вывод в консоль
	preset: 'ts-jest', // компилит ts в js
	modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};

export default config;
