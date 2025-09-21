import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

import dotenv from "dotenv"

dotenv.config();

// limiter that allows # request per # seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter:Ratelimit.slidingWindow(100,"10 s")
})

export default ratelimit