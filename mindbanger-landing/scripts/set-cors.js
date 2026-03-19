
require('dotenv').config({ path: '.env.local' });
const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

// R2 Endpoints without bucket name but with account ID
const accountId = process.env.R2_ACCESS_KEY_ID; // The client ID is usually not account ID but I need endpoint
// The user provided R2_ENDPOINT=https://a902ada96ba92f1cee7f6c83c09c8aae.r2.cloudflarestorage.com
// This includes account id.

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const corsCommand = new PutBucketCorsCommand({
  Bucket: process.env.R2_BUCKET_NAME,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['PUT', 'POST', 'GET', 'HEAD'],
        AllowedOrigins: ['*'], // Allow any origin for now to fix issues
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000,
      },
    ],
  },
});

async function run() {
  try {
    console.log('Applying CORS to bucket:', process.env.R2_BUCKET_NAME);
    await s3Client.send(corsCommand);
    console.log('Success! CORS rules updated.');
  } catch (err) {
    console.error('Error applying CORS:', err);
  }
}

run();
