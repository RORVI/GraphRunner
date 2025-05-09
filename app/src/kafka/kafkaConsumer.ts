import { Kafka, EachMessagePayload } from 'kafkajs';
import { handleIngestion } from '../services/ingestService';
import { logger } from '../logger/logs'; 
import dotenv from 'dotenv';
import Ajv from 'ajv';

dotenv.config();

console.log('[KAFKA INIT] mode:', process.env.KAFKA_MODE);
console.log('[KAFKA INIT] brokers:', process.env.KAFKA_BROKER_LOCALHOST);

const mode = process.env.KAFKA_MODE || 'local';

const brokers =
  mode === 'docker'
    ? [process.env.KAFKA_BROKER_DOCKER || 'kafka:9092']
    : [process.env.KAFKA_BROKER_LOCALHOST || 'localhost:9092'];

const kafka = new Kafka({
    clientId: 'graph-runner-consumer',
    brokers,
});

export const kafkaConsumer = kafka.consumer({ groupId: 'graphrunner-group' });

const ajv = new Ajv();
const schema = {
  type: 'object',
  properties: {
    vertices: { type: 'array' },
    edges: { type: 'array' },
  },
  required: ['vertices', 'edges'],
  additionalProperties: false,
};
const validate = ajv.compile(schema);

export async function startKafkaConsumer() {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: 'graphrunner.ingest', fromBeginning: false });

  logger.info('[Kafka] Consumer connected and subscribed to graphrunner.ingest');

  await kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      try {
        const value = message.value?.toString();
        if (!value) return;

        const parsed = JSON.parse(value);
        if (!validate(parsed)) {
          logger.warn('[Kafka] Invalid message schema:', ajv.errorsText(validate.errors));
          return;
        }

        const { vertices, edges } = parsed as { vertices: any[]; edges: any[] };
        await handleIngestion(vertices, edges);

        logger.info(`[Kafka] Ingested message from partition ${partition}`);
      } catch (err) {
        logger.error('[Kafka] Error processing message:', err);
      }
    },
  });
}


