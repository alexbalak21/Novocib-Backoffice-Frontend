/**
 * Types for stock items and GraphQL request/response shapes.
 */

export interface Item {
	id: string | number;
	name: string;
	description?: string | null;
}

export interface GetItemsResponse {
	items: Item[];
}

export interface GetItemVariables {
	id: string | number;
}

export interface GetItemResponse {
	item: Item | null;
}

export interface CreateItemVariables {
	name: string;
	description?: string | null;
}

export interface CreateItemResponse {
	createItem: Item;
}

export interface UpdateItemVariables {
	id: string | number;
	name: string;
	description?: string | null;
}

export interface UpdateItemResponse {
	updateItem: Item;
}

export interface DeleteItemVariables {
	id: string | number;
}

export interface DeleteItemResponse {
	deleteItem: boolean;
}

export type ItemsQueryResult = GetItemsResponse;

