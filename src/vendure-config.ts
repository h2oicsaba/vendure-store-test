import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';


const IS_DEV = process.env.APP_ENV === 'dev';
// Set the port from environment variable or default to 3000
const serverPort = process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 3000;

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        // Development settings
        adminApiPlayground: IS_DEV,
        adminApiDebug: IS_DEV,
        shopApiPlayground: IS_DEV,
        shopApiDebug: IS_DEV,
        cors: true,
        middleware: [
            {
                handler: (req: any, res: any, next: any) => {
                    // Set trust proxy for express-rate-limit
                    if (req.app && typeof req.app.set === 'function') {
                        req.app.set('trust proxy', 2);
                    }
                    next();
                },
                route: '',
            },
            {
                route: 'health',
                handler: (req: import('express').Request, res: import('express').Response) => {
                    res.json({
                        status: 'ok',
                        timestamp: new Date().toISOString(),
                        environment: process.env.NODE_ENV || 'development',
                        nodeVersion: process.version
                    });
                },
            },
        ],
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: false,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {},
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            // Always use relative URLs for assets to avoid hardcoding domains
            // This works with the volume mount configuration
            assetUrlPrefix: undefined,
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            // Use the default template loader which uses the templates embedded in the plugin
            // instead of loading from the filesystem
            // This avoids issues with the volume mount
            // templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
            globalTemplateVars: {
                // The following variables will change depending on your storefront implementation.
                // Here we are assuming a storefront running at http://localhost:8080.
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:8080/verify',
                passwordResetUrl: 'http://localhost:8080/password-reset',
                changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
            },
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: serverPort, // Use the same port as the main server
            adminUiConfig: {
                apiHost: undefined, // Use relative URLs
                apiPort: undefined,
            },

        }),
    ],
};
