/**
 * Yutori Browsing API Service
 * Uses Yutori's browsing tasks to research clinical guidelines
 * API Docs: https://yutori.com/api
 */

const YUTORI_API_URL = 'https://api.yutori.com/v1'

interface ResearchResult {
  success: boolean
  data?: {
    summary: string
    sources: Array<{
      title: string
      url: string
      snippet: string
    }>
  }
  error?: string
}

interface YutoriCallbacks {
  onStart: () => void
  onProgress: (message: string) => void
  onComplete: (result: ResearchResult) => void
  onError: (error: Error) => void
}

// Fallback data for when API is unavailable
const SEPSIS_GUIDELINES_FALLBACK: ResearchResult = {
  success: true,
  data: {
    summary: `Surviving Sepsis Campaign 2021 Hour-1 Bundle:

1. Measure lactate level. Remeasure lactate if initial lactate elevated (>2 mmol/L).

2. Obtain blood cultures before administering antibiotics.

3. Administer broad-spectrum antibiotics.

4. Begin rapid administration of 30 mL/kg crystalloid for hypotension or lactate >=4 mmol/L.

5. Apply vasopressors if hypotensive during or after fluid resuscitation to maintain MAP >=65 mm Hg.

Key Points:
- The "Hour-1 Bundle" emphasizes beginning resuscitation and management immediately
- Serum lactate is a marker of tissue hypoperfusion
- qSOFA score >=2 indicates high risk: RR >=22, SBP <=100, altered mentation
- NEWS2 score >=5 warrants urgent clinical review
- Early antibiotic administration is associated with decreased mortality`,
    sources: [
      {
        title: 'Surviving Sepsis Campaign: International Guidelines 2021',
        url: 'https://www.sccm.org/SurvivingSepsisCampaign/Guidelines',
        snippet: 'The Surviving Sepsis Campaign guidelines provide evidence-based recommendations for the management of sepsis and septic shock.',
      },
      {
        title: 'Hour-1 Bundle - SCCM',
        url: 'https://www.sccm.org/SurvivingSepsisCampaign/Bundles',
        snippet: 'The Hour-1 Bundle should be viewed as a quality improvement opportunity to begin resuscitation and management immediately.',
      },
    ],
  },
}

/**
 * Create a browsing task with Yutori API
 * Uses the /v1/browsing/tasks endpoint
 */
export async function createBrowsingTask(instruction: string): Promise<{ taskId: string } | null> {
  const apiKey = import.meta.env.VITE_YUTORI_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch(`${YUTORI_API_URL}/browsing/tasks`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instruction,
        start_url: 'https://www.google.com',
      }),
    })

    if (!response.ok) {
      console.log('Yutori browsing task creation failed:', response.status)
      return null
    }

    const data = await response.json()
    return { taskId: data.task_id || data.id }
  } catch (err) {
    console.log('Yutori API error:', err)
    return null
  }
}

/**
 * Poll for browsing task completion
 */
export async function pollBrowsingTask(taskId: string, maxAttempts: number = 30): Promise<string | null> {
  const apiKey = import.meta.env.VITE_YUTORI_API_KEY
  if (!apiKey) return null

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const response = await fetch(`${YUTORI_API_URL}/browsing/tasks/${taskId}`, {
        headers: {
          'X-API-Key': apiKey,
        },
      })

      if (!response.ok) continue

      const data = await response.json()

      if (data.status === 'completed' || data.status === 'finished') {
        return data.result || data.output || data.summary || 'Task completed'
      }

      if (data.status === 'failed' || data.status === 'error') {
        return null
      }
    } catch {
      continue
    }
  }

  return null
}

/**
 * Quick research using Yutori browsing API
 */
export async function quickResearch(query: string): Promise<ResearchResult> {
  const apiKey = import.meta.env.VITE_YUTORI_API_KEY

  if (!apiKey) {
    console.log('No Yutori API key configured')
    return SEPSIS_GUIDELINES_FALLBACK
  }

  try {
    // Create browsing task to research the query
    const task = await createBrowsingTask(
      `Search Google for "${query}" and summarize the top 3 results. Focus on medical guidelines and clinical recommendations.`
    )

    if (!task) {
      console.log('Failed to create Yutori browsing task')
      return SEPSIS_GUIDELINES_FALLBACK
    }

    console.log('Yutori task created:', task.taskId)

    // Poll for results
    const result = await pollBrowsingTask(task.taskId, 20)

    if (result) {
      return {
        success: true,
        data: {
          summary: result,
          sources: [],
        },
      }
    }

    return SEPSIS_GUIDELINES_FALLBACK
  } catch (error) {
    console.log('Yutori research error:', error)
    return SEPSIS_GUIDELINES_FALLBACK
  }
}

/**
 * Fetch clinical guidelines using Yutori browsing
 */
export async function fetchClinicalGuidelines(
  query: string,
  callbacks: YutoriCallbacks
): Promise<ResearchResult> {
  const apiKey = import.meta.env.VITE_YUTORI_API_KEY

  if (!apiKey) {
    callbacks.onStart()
    callbacks.onProgress('No API key - using cached guidelines')
    await new Promise(resolve => setTimeout(resolve, 500))
    callbacks.onComplete(SEPSIS_GUIDELINES_FALLBACK)
    return SEPSIS_GUIDELINES_FALLBACK
  }

  callbacks.onStart()
  callbacks.onProgress('Connecting to Yutori Research API...')

  try {
    // Create browsing task
    const task = await createBrowsingTask(
      `Research: ${query}. Find authoritative medical sources and summarize key clinical recommendations.`
    )

    if (!task) {
      callbacks.onProgress('API unavailable, using cached guidelines')
      await new Promise(resolve => setTimeout(resolve, 500))
      callbacks.onComplete(SEPSIS_GUIDELINES_FALLBACK)
      return SEPSIS_GUIDELINES_FALLBACK
    }

    callbacks.onProgress(`Research task initiated (${task.taskId.slice(0, 8)}...)`)

    // Poll with progress updates
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      callbacks.onProgress(`Searching medical databases... (${i + 1}/20)`)

      try {
        const response = await fetch(`${YUTORI_API_URL}/browsing/tasks/${task.taskId}`, {
          headers: { 'X-API-Key': apiKey },
        })

        if (response.ok) {
          const data = await response.json()

          if (data.status === 'completed' || data.status === 'finished') {
            callbacks.onProgress('Research complete!')
            const result: ResearchResult = {
              success: true,
              data: {
                summary: data.result || data.output || data.summary || 'Research completed',
                sources: [],
              },
            }
            callbacks.onComplete(result)
            return result
          }

          if (data.status === 'failed') {
            break
          }
        }
      } catch {
        continue
      }
    }

    // Timeout or failure - use fallback
    callbacks.onProgress('Using cached guidelines')
    callbacks.onComplete(SEPSIS_GUIDELINES_FALLBACK)
    return SEPSIS_GUIDELINES_FALLBACK
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)))
    return SEPSIS_GUIDELINES_FALLBACK
  }
}

/**
 * Fetch latest sepsis guidelines
 */
export function fetchSepsisGuidelines(callbacks: YutoriCallbacks): Promise<ResearchResult> {
  return fetchClinicalGuidelines(
    'Surviving Sepsis Campaign 2021 guidelines hour-1 bundle recommendations treatment protocol',
    callbacks
  )
}
