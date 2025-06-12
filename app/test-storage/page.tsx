'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestStoragePage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runStorageTest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-storage')
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Failed to run test',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testCMSAPI = async () => {
    setLoading(true)
    try {
      // Test GET
      console.log('Testing CMS GET...')
      const getResponse = await fetch('/api/cms')
      const getData = await getResponse.json()
      console.log('CMS GET response:', getData)

      // Test POST with a small update
      console.log('Testing CMS POST...')
      const testUpdate = {
        ...getData,
        home: {
          ...getData.home,
          hero: {
            ...getData.home.hero,
            title: `Test Update - ${new Date().toLocaleTimeString()}`
          }
        }
      }
      
      const postResponse = await fetch('/api/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUpdate),
      })
      
      const postResult = await postResponse.json()
      console.log('CMS POST response:', postResult)
      
      setTestResult({
        success: true,
        message: 'CMS API test completed',
        tests: {
          get: getResponse.ok,
          post: postResponse.ok,
          verified: postResult.verified
        },
        details: {
          get: getData ? 'Data retrieved successfully' : 'No data retrieved',
          post: postResult.message || 'Save completed',
          dataSize: JSON.stringify(getData).length
        }
      })
    } catch (error) {
      setTestResult({
        success: false,
        error: 'CMS API test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🧪 Storage Test Dashboard</CardTitle>
          <CardDescription>
            Test your Vercel KV storage and CMS functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runStorageTest}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Testing...' : '🧪 Test KV Storage'}
            </Button>
            <Button 
              onClick={testCMSAPI}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? 'Testing...' : '📋 Test CMS API'}
            </Button>
          </div>

          {testResult && (
            <Card className={`mt-4 ${testResult.success ? 'border-green-500' : 'border-red-500'}`}>
              <CardHeader>
                <CardTitle className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                  {testResult.success ? '✅ Test Passed' : '❌ Test Failed'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Message:</strong> {testResult.message || testResult.error}</p>
                  
                  {testResult.tests && (
                    <div>
                      <strong>Test Results:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {Object.entries(testResult.tests).map(([key, value]) => (
                          <li key={key} className={value ? 'text-green-600' : 'text-red-600'}>
                            {key}: {value ? '✅ Pass' : '❌ Fail'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {testResult.details && (
                    <div>
                      <strong>Details:</strong>
                      <pre className="bg-gray-100 p-2 rounded text-sm mt-1 overflow-auto">
                        {typeof testResult.details === 'string' 
                          ? testResult.details 
                          : JSON.stringify(testResult.details, null, 2)
                        }
                      </pre>
                    </div>
                  )}
                  
                  {testResult.timestamp && (
                    <p className="text-sm text-gray-500">
                      <strong>Timestamp:</strong> {testResult.timestamp}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">📋 How to Check Storage</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2">
                <p><strong>1. Environment Variables:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>Check that KV_REST_API_URL is set</li>
                  <li>Check that KV_REST_API_TOKEN is set</li>
                  <li>These should be in your Vercel dashboard or .env.local</li>
                </ul>
                
                <p><strong>2. Console Logs:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>Open browser DevTools (F12)</li>
                  <li>Check the Console tab for detailed storage logs</li>
                  <li>Look for 🔍, 💾, ✅, and ❌ emoji indicators</li>
                </ul>
                
                <p><strong>3. CMS Test:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>Go to <code>/admin</code> to test the CMS interface</li>
                  <li>Edit any field and click "Save Changes"</li>
                  <li>Refresh the page to see if changes persist</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
} 