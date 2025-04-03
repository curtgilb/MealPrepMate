import { storage } from "@/infrastructure/object_storage/storage.js";

const bucketPolicy = `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::$$$/*"
            ]
        }
    ]
}`;

export async function deleteBuckets() {
  const buckets = await storage.listBuckets();
  const promises: Promise<string[]>[] = [];

  for (const bucket of buckets) {
    promises.push(
      new Promise((resolve, reject) => {
        const bucketObjects: string[] = [];
        const stream = storage.listObjectsV2(bucket.name, "", true);
        stream.on("data", function (obj) {
          if (obj.name) bucketObjects.push(obj.name);
        });
        stream.on("end", () => {
          resolve(bucketObjects);
        });

        stream.on("error", (err) => reject(err));
      })
    );
  }
  const files = await Promise.all(promises);
  for (const [i, file] of files.entries()) {
    await storage.removeObjects(buckets[i].name, file);
    await storage.removeBucket(buckets[i].name);
  }
}

export async function createBuckets() {
  const buckets = ["imports", "images", "receipts"];
  for (const bucket of buckets) {
    await storage.makeBucket(bucket);
    await storage.setBucketPolicy(bucket, bucketPolicy.replace("$$$", bucket));
  }
}
