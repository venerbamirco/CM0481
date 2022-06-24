import { RequestValidator } from './request_validator';
import { Environment } from '../environment';

const { isBase64 } = require('is-base64');

export class TaskRequestValidator extends RequestValidator {

	protected getRequestSchema() {
		return {
			id: {
				in: ['body'],
				isLength: {
					options: { min: Environment.sizeId, max: Environment.sizeId },
					errorMessage: 'id missing or invalid'
				}
			},
			input: {
				in: ['body'],
				isLength: {
					options: { min: 0, max: Environment.maxInput },
					errorMessage: 'input missing or invalid'
				},
				customSanitizer: {
					options: (value: string) => {
						if (!!value){
							return value;
						}
						return '';
					}
				}
			},
			flags: {
				in: ['body'],
				custom: {
					options: (value : string[]) => {
						return (!value || (value.length >= 0 && value.length <= Environment.maxFlags));
					},
					errorMessage: 'flags missing or invalid'
				},
				customSanitizer: {
					options: (value: string[]) => {
						if (!!value && value.length > 0){
							return value;
						}
						return [];
					}
				}
			},
			sourceCode: {
				in: ['body'],
				custom: {
					options: (value : string) => {
						return ((value.length > 0 && value.length <= Environment.maxSourceCode) && isBase64(value));
					},
					errorMessage: 'sourceCode missing or invalid'
				},
				customSanitizer: {
					options: (value: string) => {
						return Buffer.from(value, 'base64');
					}
				}
			},
			timeLimit: {
				in: ['body'],
				custom: {
					options: (value : number) => {
						return (!value || (value > 0 && value <= Environment.maxTimeout));
					},
					errorMessage: 'timeLimit missing or invalid'
				},
				customSanitizer: {
					options: (value: number) => {
						return Environment.defaultTimeout;
					}
				}
			},
			memoryLimit: {
				in: ['body'],
				custom: {
					options: (value : number) => {
						return (!value || (value > 0 && value <= Environment.maxMemory));
					},
					errorMessage: 'memoryLimit missing or invalid'
				},
				customSanitizer: {
					options: (value: number) => {
						return Environment.defaultMemory;
					}
				}
			},
			executeProgram: {
				in: ['body'],
				customSanitizer: {
					options: (value: boolean) => {
						if (value == true || value == false){
							return value;
						}
						return false;
					}
				}
			}
		};
	}
}