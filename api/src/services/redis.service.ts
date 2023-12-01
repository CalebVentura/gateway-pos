import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Redis from 'redis';
import config from 'src/config';

@Injectable()
export class RedisService implements OnModuleInit {
  private client;
  private readonly logger = new Logger();

  async setWithExpiration(
    key: string,
    value: string,
    expirationSeconds: number,
  ): Promise<string | null> {
    await this.client.connect();
    const dataPaymentRedis = await this.client.set(key, value, {
      EX: expirationSeconds,
      NX: true,
    });
    await this.client.disconnect();
    return dataPaymentRedis;
  }

  async get(key: string) {
    await this.client.connect();
    const dataPaymentRedis = await this.client.get(key);
    await this.client.disconnect();
    return JSON.parse(dataPaymentRedis);
  }

  onModuleInit() {
    this.client = Redis.createClient({
      url: config().redis.url,
    });
    this.client.on('error', (error) => {
      this.logger.error(error);
    });
    this.client.on('ready', () => {
      this.logger.log('RedisService ready');
    });
  }
}
