import { RequestError } from '@octokit/request-error'
import { StatusCodes } from 'http-status-codes'

export interface NotFoundError extends RequestError {
  status: StatusCodes.NOT_FOUND
}

// TODO: Add error
export const isNotFoundError = (value: unknown): value is NotFoundError => {
  return value instanceof RequestError && value.status === StatusCodes.NOT_FOUND
}
