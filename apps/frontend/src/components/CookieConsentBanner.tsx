'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface CookieConsentBannerProps {
  onAccept: () => void
  onReject: () => void
}

export function CookieConsentBanner({ onAccept, onReject }: CookieConsentBannerProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-md">
      <Card className="p-4 shadow-lg border-2 bg-white">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🍪</span>
            <h3 className="font-semibold text-gray-900">Privacy-First Analytics</h3>
          </div>
          
          {!showDetails ? (
            <p className="text-sm text-gray-600">
              We use privacy-focused analytics to understand how you interact with our site. 
              No personal data is collected.
            </p>
          ) : (
            <div className="text-sm text-gray-600 space-y-2">
              <div>
                <p className="font-medium text-gray-800">What we collect:</p>
                <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                  <li>Page views and button clicks (anonymous)</li>
                  <li>Browser type and device info</li>
                  <li>Time spent on pages</li>
                  <li>A/B test variant assignment</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium text-gray-800">What we DON&apos;T collect:</p>
                <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                  <li>Your name, email, or personal information</li>
                  <li>Your exact location or IP address</li>
                  <li>Anything that identifies you personally</li>
                  <li>Cross-site tracking or third-party data</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs">
                <p className="font-medium text-blue-800">🔒 GDPR Compliant</p>
                <p className="text-blue-700">Data hosted in EU, encrypted, and deletable on request.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={onAccept} 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Accept Analytics
            </Button>
            <Button 
              onClick={onReject} 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              Essential Only
            </Button>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:underline w-full text-left"
          >
            {showDetails ? '▼ Less details' : '▶ More details & privacy info'}
          </button>
        </div>
      </Card>
    </div>
  )
}
