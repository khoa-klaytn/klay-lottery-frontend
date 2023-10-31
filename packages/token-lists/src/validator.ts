import Ajv from 'ajv'
import schema from './schema/sweepstakes.json'

export const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)
