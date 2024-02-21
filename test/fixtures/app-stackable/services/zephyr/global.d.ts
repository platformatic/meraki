import { FastifyInstance } from 'fastify'
import { StackableExampleConfig, PlatformaticApp } from 'stackable-example'
  
declare module 'fastify' {
  interface FastifyInstance {
    platformatic: PlatformaticApp<StackableExampleConfig>
  }
}
