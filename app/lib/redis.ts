import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN!,
})

await redis.set('foo', 'bar')
const data = await redis.get('foo')
const keys = await redis.keys('*')

console.log(data, '222222redis  data', keys, 'keys')

// 获取所有的 Redis keys
export async function getAllKeys() {
  try {
    // 使用 KEYS 命令获取所有的 keys
    const keys = await redis.keys('*')
    console.log(keys, '获取所有的 keys')

    return keys
  } catch (error) {
    console.error('Error fetching Redis keys:', error)
    throw error
  }
}
