require('dotenv').config({ path: '.env.local' });
const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Missing environment variables.');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const corsRules = [
  {
    AllowedHeaders: ['*'],
    AllowedMethods: ['PUT', 'POST', 'GET', 'HEAD', 'DELETE'],
    AllowedOrigins: ['*'], // For production, you might want to restrict this to your Vercel domain
    ExposeHeaders: ['ETag'],
    MaxAgeSeconds: 3000,
  },
];

async function setCors() {
  try {
    const command = new PutBucketCorsCommand({
      Bucket: R2_BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: corsRules,
      },
    });

    await s3Client.send(command);
    console.log('CORS configuration applied successfully.');
  } catch (error) {
    console.error('Error applying CORS configuration:', error);
  }
}

setCors();
