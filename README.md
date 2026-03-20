## Manga images upload toS3

### FE sends file metadata to BE to validate files and generate S3 upload URL, this allowed FE to directly upload data to S3

**Pros**

- BE does not stream file bytes
- Lower BE CPU/memory pressure
- Lower latency
- Scales better for many concurrent uploads

**Cons**

- More care needed around validation, key naming, expiration, and post-upload confirmation

### FE -> BE -> S3

**Pros**

- BE can inspect every file before forwarding
- Easier to centralize auth, rate limits, antivirus/scanning hooks, buisness rules
- Bucket can stay full private

**Cons**

- BE handles all file traffic
- More compute, more memory, more timeouts/retries to manage
- Paying for bytes that could have directly went to S3

## Current implementation is FE -> S3

**Why**

- Cost, sending 7mil PUT requests to S3 costs around 35$, adding more Compute power on BE Server will cost way above that
- Easier to scale
