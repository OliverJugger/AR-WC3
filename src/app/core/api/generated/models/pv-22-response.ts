/* tslint:disable */
/* eslint-disable */
import { PaginatedResponse } from './paginated-response';
import { Pv22Data } from './pv-22-data';
export type Pv22Response = PaginatedResponse & {
} & {
'data'?: Array<Pv22Data>;
};
