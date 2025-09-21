import { NextResponse } from 'next/server'
import { register } from 'prom-client'

export async function GET() {
  try {
    // Check if metrics are working
    const metrics = await register.getSingleMetricAsString('process_cpu_user_seconds_total')
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      instance: process.env.INSTANCE_ID || 'unknown'
    }
    
    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
