# Deploying to Railway

This guide explains how to deploy your Vendure store to Railway.

## Prerequisites

- A Railway account (sign up at [railway.app](https://railway.app/))
- GitHub account (for repository connection)
- Basic knowledge of Railway's dashboard

## Deployment Steps

### 1. Push your code to a GitHub repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 2. Create a new Railway project

1. Go to [Railway](https://railway.app/) and log in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the branch to deploy (usually `main` or `master`)

### 3. Set up the database

1. In your Railway project, click "New" and select "Database"
2. Choose "PostgreSQL"
3. Once created, go to the "Variables" tab and copy the database connection URL
4. Add the following environment variables to your Railway project:
   ```
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=railway
   DB_USERNAME=postgres
   DB_PASSWORD=your-db-password
   ```

### 4. Configure environment variables

Add the following required environment variables to your Railway project (Settings > Variables):

```
NODE_ENV=production
PORT=3000
COOKIE_SECRET=your-secure-cookie-secret
SUPERADMIN_USERNAME=your-admin-username
SUPERADMIN_PASSWORD=your-strong-password
DB_SCHEMA=public
```

### 5. Deploy your application

1. Railway will automatically detect your project type and start deploying
2. Go to the "Deployments" tab to monitor the deployment progress
3. Once deployed, you'll get a URL for your application

### 6. Access the admin interface

1. Visit `YOUR_RAILWAY_URL/admin`
2. Log in with the admin credentials you set in the environment variables
3. Complete the initial setup wizard

## Custom Domains

To use a custom domain:

1. Go to your project in Railway
2. Click on "Settings" > "Domains"
3. Add your custom domain and follow the DNS setup instructions

## Environment Variables Reference

See `.env.example` for a complete list of available environment variables you can configure.

## Troubleshooting

- Check the logs in the Railway dashboard for any errors
- Ensure all required environment variables are set
- The build process might take several minutes for the first deployment
- If you encounter database connection issues, verify your database credentials and connection URL
