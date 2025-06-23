import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/utils/db/redis/redis.service';
import * as sts from 'qcloud-cos-sts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}
  async qcloudCredential() {
    const credential: string | null =
      await this.redisService.get('qcloudCredential');
    if (credential) {
      return JSON.parse(credential);
    }
    const actions = [
      'PutObject',
      'InitiateMultipartUpload',
      'ListMultipartUploads',
      'ListParts',
      'UploadPart',
      'CompleteMultipartUpload',
      'AbortMultipartUpload',
    ];
    const policy = sts.getPolicy([
      {
        action: actions.map((item: string) => `name/cos:${item}`),
        bucket: this.configService.get('COS_UPLOAD_BUCKET'),
        region: this.configService.get('COS_UPLOAD_REGION'),
        prefix: '*',
      },
    ]);
    const res = await sts.getCredential({
      secretId: this.configService.get('COS_SECRET_ID'),
      secretKey: this.configService.get('COS_SECRET_KEY'),
      policy: policy,
      durationSeconds: +this.configService.get('COS_CREDENTIAL_DURATION'),
    });
    await this.redisService.set(
      'qcloudCredential',
      JSON.stringify(res),
      +this.configService.get('COS_CREDENTIAL_DURATION') * 1000,
    );
    return res;
  }
}
