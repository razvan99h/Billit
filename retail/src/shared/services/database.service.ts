import { Product } from '../models/product.model';
import { StoreInfo } from '../models/store-info.model';

const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
});

const DatabaseService = {
    async getStoreInfo(): Promise<StoreInfo> {
        const response: StoreInfo = await fetch('assets/database/database.json', {headers})
            .then(response => response.json());
        response.products = response.products.map((productJSON: any) => Product.fromDatabaseJSON(productJSON));
        return response;
    }
};

export { DatabaseService };