import mongoose, { Schema, Document } from 'mongoose';

// Wyvern Schemas (see https://github.com/ProjectOpenSea/wyvern-schemas)
export enum WyvernSchemaName {
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
    LegacyEnjin = 'Enjin',
    ENSShortNameAuction = 'ENSShortNameAuction'
    // CryptoPunks = 'CryptoPunks'
}


export interface WyvernNFTAsset extends Document{
    id: string
    address: string
}
export interface WyvernFTAsset extends Document{
    id?: string
    address: string
    quantity: string
}
export type WyvernAsset = WyvernNFTAsset | WyvernFTAsset

// Abstractions over Wyvern assets for bundles
export interface WyvernBundle {
    assets: WyvernAsset[]
    schemas: WyvernSchemaName[]
    name?: string
    description?: string
    external_link?: string
}

export interface ExchangeMetadataForAsset extends Document {
    asset: WyvernAsset;
    schemaName: WyvernSchemaName;
    referrerAddress?: string;
}

export interface ExchangeMetadataForBundle extends Document{
    bundle: WyvernBundle
    referrerAddress?: string
}


export type ExchangeMetadata = ExchangeMetadataForAsset | ExchangeMetadataForBundle

export interface ECSignature {
    v: number;
    r: string;
    s: string;
}

export interface OrderJSON extends Partial<ECSignature>,Document {
    exchange: string
    maker: string
    taker: string
    makerRelayerFee: string
    takerRelayerFee: string
    makerProtocolFee: string
    takerProtocolFee: string
    makerReferrerFee: string
    feeRecipient: string
    feeMethod: number
    side: number
    saleKind: number
    target: string
    howToCall: number
    calldata: string
    replacementPattern: string
    staticTarget: string
    staticExtradata: string
    paymentToken: string

    quantity: string
    basePrice: string
    englishAuctionReservePrice: string | undefined
    extra: string

    // createdTime is undefined when order hasn't been posted yet
    createdTime?: number | string
    listingTime: number | string
    expirationTime: number | string

    salt: string

    metadata: ExchangeMetadata

    hash: string
}



const WyvernNFTAssetSchema: Schema = new Schema({
    id: { type: String },
    address: { type: String }
});

const WyvernFTAssetSchema: Schema = new Schema({
    id: { type: String },
    address: { type: String },
    quantity: { type: String },
});

const WyvernNFTAssetModel = mongoose.model<WyvernNFTAsset>('WyvernNFTAssetModel', WyvernNFTAssetSchema);
const WyvernFTAssetModel = mongoose.model<WyvernFTAsset>('WyvernFTAssetModel', WyvernFTAssetSchema);

const WyvernBundleSchema: Schema = new Schema({
    assets: [{
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'assetType'
    }],
    assetType: {
        type: String,
        required: true,
        enum: ['WyvernNFTAssetModel', 'WyvernFTAssetModel']
    },
    schemas: [{ type: String, enum: Object.values(WyvernSchemaName) }],
    name: { type: String },
    description: { type: String },
    external_link: { type: String }
});

const ExchangeMetadataForAssetSchema: Schema = new Schema({
    asset: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'assetType'
    },
    assetType: {
        type: String,
        required: true,
        enum: ['WyvernNFTAssetModel', 'WyvernFTAssetModel']
    },
    schema: { type: String, enum: Object.values(WyvernSchemaName) },
    referrerAddress: { type: String },
});


const ExchangeMetadataForBundleSchema: Schema = new Schema({
    bundle: WyvernBundleSchema,
    referrerAddress: { type: String },
});

const ExchangeMetadataForBundleModel = mongoose.model<ExchangeMetadataForBundle>('ExchangeMetadataForBundleModel', ExchangeMetadataForBundleSchema);
const ExchangeMetadataForAssetModel = mongoose.model<ExchangeMetadataForAsset>('ExchangeMetadataForAssetModel', ExchangeMetadataForAssetSchema);

const OrderJSONSchema: Schema = new Schema({
    exchange: { type: String, required: true },
    maker: { type: String, required: true },
    taker: { type: String, required: true },
    makerRelayerFee: { type: String, required: true },
    takerRelayerFee: { type: String, required: true },
    makerProtocolFee: { type: String, required: true },
    takerProtocolFee: { type: String, required: true },
    makerReferrerFee: { type: String, required: true },
    feeRecipient: { type: String, required: true },
    feeMethod: { type: Number, required: true },
    side: { type: Number, required: true },
    saleKind: { type: Number, required: true },
    target: { type: String, required: true },
    howToCall: { type: Number, required: true },
    calldata: { type: String, required: true },
    replacementPattern: { type: String, required: true },
    staticTarget: { type: String, required: true },
    staticExtradata: { type: String, required: true },
    paymentToken: { type: String, required: true },
    quantity: { type: String, required: true },
    basePrice: { type: String, required: true },
    englishAuctionReservePrice: { type: String },
    extra: { type: String, required: true },
    // createdTime is undefined when order hasn't been posted yet
    createdTime: { type: String },
    listingTime: { type: String, required: true },
    expirationTime: { type: String, required: true },

    salt: { type: String, required: true },
    metadata: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'metadataType'
    },
    metadataType: {
        type: String,
        required: true,
        enum: ['ExchangeMetadataForAssetModel', 'ExchangeMetadataForBundleModel']
    },
    hash: { type: String, required: true }
});

// Export the model and return your IUser interface
export default mongoose.model<OrderJSON>('OrderJSONModel', OrderJSONSchema);

