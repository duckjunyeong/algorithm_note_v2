import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { SharedArray } from 'k6/data';

// ============================================================================
// Configuration
// ============================================================================

/**
 * USAGE EXAMPLES:
 *
 * 1. Smoke Test (default - 10 users, 1 minute):
 *    k6 run realistic-load-test.js
 *
 * 2. Load Test (100-500 users, 10 minutes):
 *    TEST_PROFILE=load k6 run realistic-load-test.js
 *
 * 3. Stress Test (500-1000 users, 15 minutes):
 *    TEST_PROFILE=stress k6 run realistic-load-test.js
 *
 * 4. Spike Test (sudden traffic surge, 5 minutes):
 *    TEST_PROFILE=spike k6 run realistic-load-test.js
 *
 * 5. Soak Test (sustained load, 30 minutes):
 *    TEST_PROFILE=soak k6 run realistic-load-test.js
 *
 * Set custom BASE_URL and AUTH_TOKEN:
 *    BASE_URL=https://api.example.com AUTH_TOKEN=your_token TEST_PROFILE=load k6 run realistic-load-test.js
 */

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zM0FpR2hTa0tmOWgxZUxrSGV3ZlcxUmlEZ0EiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NjM3MDQ0MjksImZ2YSI6WzM5OTAsLTFdLCJpYXQiOjE3NjM3MDQzNjksImlzcyI6Imh0dHBzOi8vc3RhYmxlLXlldGktNzAuY2xlcmsuYWNjb3VudHMuZGV2IiwianRpIjoiN2E2ZjE1YjAzZWVmZTY0MWM2YTQiLCJuYmYiOjE3NjM3MDQzNTksInB1YmxpY19tZXRhZGF0YSI6eyJyb2xlIjoibWVtYmVyIn0sInNpZCI6InNlc3NfMzVlSzZlNmNNdFhjQ0hUU0Ntd0NsRlEyRkFiIiwic3RzIjoiYWN0aXZlIiwic3ViIjoidXNlcl8zM1Y4dGJsbzhOTkRjc0dhczhsSENDZjZ2M1oiLCJ2IjoyfQ.T9PrPjXCd83jtSS7MW8H_qbokgkjNci20RVh2HglObf1KxE1A6SEm5DfuHn94tvMdzX4Fxvf9IGtgR1XgcG9HwMVaPe5p5FgDuZtXnJRRR_eXcSYYUVl43nn7QPi6jaYTXiYU9_AjwLREaLTHGLa91Ka24GdclvKuFV2gaaRM2GGuOJrDQy1s7f2ooUJgkAYHJJyhRaOIcsVIF7wHLKkrT6601_KLKnnUuWmJR3ecmx1m5OQ_MC_rTvzdUPRxp4mzaFBlg0RfznLLAMTpwCAJJdqUtEguWz1jca0A3aREoyMywKapbiiqgxgwlWu-kCjv7Tc1d8VpD1d0GU1OOXMtg";
const TEST_PROFILE = __ENV.TEST_PROFILE || 'smoke';
const PRESERVE_DATA = __ENV.PRESERVE_DATA === 'true';
const GENERATE_DUMMY_DATA = __ENV.GENERATE_DUMMY_DATA === 'true';

// Data generation targets for medium scale (100K-500K total records)
const DATA_TARGETS = {
  categories: 50000,        // 50K categories
  reviewCards: 200000,      // 200K review cards
  questionsPerCard: 3,      // Average 3 questions per card = 600K questions
  answersPerQuestion: 1,    // Average 1 answer per question = 600K answers
};

// Validate required environment variables
if (!AUTH_TOKEN) {
  throw new Error('AUTH_TOKEN environment variable is required. Please set it before running the test.');
}

// ============================================================================
// Test Profile Definitions
// ============================================================================

const TEST_PROFILES = {
  // Smoke Test - Basic functionality validation (10 users, 1 minute)
  smoke: {
    name: 'Smoke Test',
    description: '10 concurrent users, 1 minute - Basic functionality validation',
    stages: [
      { duration: '30s', target: 10 },
      { duration: '30s', target: 10 },
    ],
    thresholds: {
      'http_req_duration': ['p(95)<500'],
      'http_req_failed': ['rate<0.01'],
      'http_req_duration{endpoint:health}': ['p(95)<100'],

      // Category endpoints
      'http_req_duration{endpoint:categories-POST_create}': ['p(95)<200'],
      'http_req_duration{endpoint:categories-GET_list}': ['p(95)<150'],
      'http_req_duration{endpoint:categories-GET_ID}': ['p(95)<100'],

      // Review Card endpoints
      'http_req_duration{endpoint:reviewCards-CREATE}': ['p(95)<400'],
      'http_req_duration{endpoint:reviewCards-GET_list}': ['p(95)<300'],
      'http_req_duration{endpoint:reviewCards-GET_ID}': ['p(95)<200'],
      'http_req_duration{endpoint:reviewCards-GET_stats}': ['p(95)<250'],
      'http_req_duration{endpoint:reviewCards-GET_status}': ['p(95)<200'],
      'http_req_duration{endpoint:reviewCards-PATCH_status}': ['p(95)<150'],
      'http_req_duration{endpoint:reviewCards-POST_review}': ['p(95)<150'],
      'http_req_duration{endpoint:reviewCards-GET_results}': ['p(95)<200'],
      'http_req_duration{endpoint:reviewCards-PUT_result}': ['p(95)<200'],

      // Activity endpoints
      'http_req_duration{endpoint:activity-POST_completion}': ['p(95)<200'],
      'http_req_duration{endpoint:activity-GET_streak}': ['p(95)<150'],
      'http_req_duration{endpoint:activity-GET_history}': ['p(95)<300'],

      // Answer endpoints
      'http_req_duration{endpoint:answers-POST_create}': ['p(95)<200'],
      'http_req_duration{endpoint:answers-GET_byQuestion}': ['p(95)<200'],
    },
  },

  // Load Test - Normal operating conditions (100-500 users, 10 minutes)
  load: {
    name: 'Load Test',
    description: '100-500 concurrent users, 10 minutes - Normal load testing',
    stages: [
      { duration: '2m', target: 100 },   // Ramp up to 100 users
      { duration: '3m', target: 300 },   // Ramp up to 300 users
      { duration: '3m', target: 500 },   // Ramp up to 500 users
      { duration: '2m', target: 0 },     // Ramp down to 0
    ],
    thresholds: {
      'http_req_duration': ['p(95)<1000'],     // More lenient for higher load
      'http_req_failed': ['rate<0.05'],        // Allow up to 5% errors under load
      'http_req_duration{endpoint:health}': ['p(95)<200'],

      // Category endpoints
      'http_req_duration{endpoint:categories-POST_create}': ['p(95)<600'],
      'http_req_duration{endpoint:categories-GET_list}': ['p(95)<500'],
      'http_req_duration{endpoint:categories-GET_ID}': ['p(95)<400'],

      // Review Card endpoints
      'http_req_duration{endpoint:reviewCards-CREATE}': ['p(95)<1200'],
      'http_req_duration{endpoint:reviewCards-GET_list}': ['p(95)<800'],
      'http_req_duration{endpoint:reviewCards-GET_ID}': ['p(95)<600'],
      'http_req_duration{endpoint:reviewCards-GET_stats}': ['p(95)<700'],
      'http_req_duration{endpoint:reviewCards-GET_status}': ['p(95)<700'],
      'http_req_duration{endpoint:reviewCards-PATCH_status}': ['p(95)<500'],
      'http_req_duration{endpoint:reviewCards-POST_review}': ['p(95)<500'],
      'http_req_duration{endpoint:reviewCards-GET_results}': ['p(95)<600'],
      'http_req_duration{endpoint:reviewCards-PUT_result}': ['p(95)<600'],

      // Activity endpoints
      'http_req_duration{endpoint:activity-POST_completion}': ['p(95)<600'],
      'http_req_duration{endpoint:activity-GET_streak}': ['p(95)<500'],
      'http_req_duration{endpoint:activity-GET_history}': ['p(95)<800'],

      // Answer endpoints
      'http_req_duration{endpoint:answers-POST_create}': ['p(95)<600'],
      'http_req_duration{endpoint:answers-GET_byQuestion}': ['p(95)<600'],
    },
  },

  // Stress Test - Beyond normal capacity (500-1000 users, 15 minutes)
  stress: {
    name: 'Stress Test',
    description: '500-1000 concurrent users, 15 minutes - Stress testing to find breaking point',
    stages: [
      { duration: '3m', target: 500 },   // Ramp up to 500 users
      { duration: '4m', target: 750 },   // Ramp up to 750 users
      { duration: '4m', target: 1000 },  // Ramp up to 1000 users
      { duration: '2m', target: 1000 },  // Stay at peak
      { duration: '2m', target: 0 },     // Ramp down
    ],
    thresholds: {
      'http_req_duration': ['p(95)<2000'],     // Very lenient for stress conditions
      'http_req_failed': ['rate<0.10'],        // Allow up to 10% errors under stress
      'http_req_duration{endpoint:health}': ['p(95)<500'],

      // Category endpoints
      'http_req_duration{endpoint:categories-POST_create}': ['p(95)<1200'],
      'http_req_duration{endpoint:categories-GET_list}': ['p(95)<1000'],
      'http_req_duration{endpoint:categories-GET_ID}': ['p(95)<800'],

      // Review Card endpoints
      'http_req_duration{endpoint:reviewCards-CREATE}': ['p(95)<2500'],
      'http_req_duration{endpoint:reviewCards-GET_list}': ['p(95)<1500'],
      'http_req_duration{endpoint:reviewCards-GET_ID}': ['p(95)<1200'],
      'http_req_duration{endpoint:reviewCards-GET_stats}': ['p(95)<1500'],
      'http_req_duration{endpoint:reviewCards-GET_status}': ['p(95)<1500'],
      'http_req_duration{endpoint:reviewCards-PATCH_status}': ['p(95)<1000'],
      'http_req_duration{endpoint:reviewCards-POST_review}': ['p(95)<1000'],
      'http_req_duration{endpoint:reviewCards-GET_results}': ['p(95)<1200'],
      'http_req_duration{endpoint:reviewCards-PUT_result}': ['p(95)<1200'],

      // Activity endpoints
      'http_req_duration{endpoint:activity-POST_completion}': ['p(95)<1200'],
      'http_req_duration{endpoint:activity-GET_streak}': ['p(95)<1000'],
      'http_req_duration{endpoint:activity-GET_history}': ['p(95)<1500'],

      // Answer endpoints
      'http_req_duration{endpoint:answers-POST_create}': ['p(95)<1200'],
      'http_req_duration{endpoint:answers-GET_byQuestion}': ['p(95)<1200'],
    },
  },

  // Spike Test - Sudden traffic surge (0-500-0 users, 5 minutes)
  spike: {
    name: 'Spike Test',
    description: '0-500-0 concurrent users, 5 minutes - Sudden traffic surge simulation',
    stages: [
      { duration: '30s', target: 0 },      // Start with 0
      { duration: '1m', target: 500 },     // Sudden spike to 500
      { duration: '2m', target: 500 },     // Maintain spike
      { duration: '1m', target: 0 },       // Sudden drop
      { duration: '30s', target: 0 },      // Cool down
    ],
    thresholds: {
      'http_req_duration': ['p(95)<1500'],
      'http_req_failed': ['rate<0.10'],    // Expect some failures during spike
      'http_req_duration{endpoint:health}': ['p(95)<300'],

      // Category endpoints
      'http_req_duration{endpoint:categories-POST_create}': ['p(95)<800'],
      'http_req_duration{endpoint:categories-GET_list}': ['p(95)<600'],
      'http_req_duration{endpoint:categories-GET_ID}': ['p(95)<500'],

      // Review Card endpoints
      'http_req_duration{endpoint:reviewCards-CREATE}': ['p(95)<1500'],
      'http_req_duration{endpoint:reviewCards-GET_list}': ['p(95)<1000'],
      'http_req_duration{endpoint:reviewCards-GET_ID}': ['p(95)<800'],
      'http_req_duration{endpoint:reviewCards-GET_stats}': ['p(95)<900'],
      'http_req_duration{endpoint:reviewCards-GET_status}': ['p(95)<900'],
      'http_req_duration{endpoint:reviewCards-PATCH_status}': ['p(95)<600'],
      'http_req_duration{endpoint:reviewCards-POST_review}': ['p(95)<600'],
      'http_req_duration{endpoint:reviewCards-GET_results}': ['p(95)<800'],
      'http_req_duration{endpoint:reviewCards-PUT_result}': ['p(95)<800'],

      // Activity endpoints
      'http_req_duration{endpoint:activity-POST_completion}': ['p(95)<800'],
      'http_req_duration{endpoint:activity-GET_streak}': ['p(95)<600'],
      'http_req_duration{endpoint:activity-GET_history}': ['p(95)<1000'],

      // Answer endpoints
      'http_req_duration{endpoint:answers-POST_create}': ['p(95)<800'],
      'http_req_duration{endpoint:answers-GET_byQuestion}': ['p(95)<800'],
    },
  },

  // Soak Test - Sustained load over extended period (200 users, 30 minutes)
  soak: {
    name: 'Soak Test',
    description: '200 concurrent users, 30 minutes - Extended duration to detect memory leaks',
    stages: [
      { duration: '3m', target: 200 },    // Ramp up
      { duration: '24m', target: 200 },   // Sustained load
      { duration: '3m', target: 0 },      // Ramp down
    ],
    thresholds: {
      'http_req_duration': ['p(95)<800'],
      'http_req_failed': ['rate<0.02'],
      'http_req_duration{endpoint:health}': ['p(95)<150'],

      // Category endpoints
      'http_req_duration{endpoint:categories-POST_create}': ['p(95)<500'],
      'http_req_duration{endpoint:categories-GET_list}': ['p(95)<400'],
      'http_req_duration{endpoint:categories-GET_ID}': ['p(95)<350'],

      // Review Card endpoints
      'http_req_duration{endpoint:reviewCards-CREATE}': ['p(95)<1000'],
      'http_req_duration{endpoint:reviewCards-GET_list}': ['p(95)<700'],
      'http_req_duration{endpoint:reviewCards-GET_ID}': ['p(95)<500'],
      'http_req_duration{endpoint:reviewCards-GET_stats}': ['p(95)<600'],
      'http_req_duration{endpoint:reviewCards-GET_status}': ['p(95)<600'],
      'http_req_duration{endpoint:reviewCards-PATCH_status}': ['p(95)<400'],
      'http_req_duration{endpoint:reviewCards-POST_review}': ['p(95)<400'],
      'http_req_duration{endpoint:reviewCards-GET_results}': ['p(95)<500'],
      'http_req_duration{endpoint:reviewCards-PUT_result}': ['p(95)<500'],

      // Activity endpoints
      'http_req_duration{endpoint:activity-POST_completion}': ['p(95)<500'],
      'http_req_duration{endpoint:activity-GET_streak}': ['p(95)<400'],
      'http_req_duration{endpoint:activity-GET_history}': ['p(95)<700'],

      // Answer endpoints
      'http_req_duration{endpoint:answers-POST_create}': ['p(95)<500'],
      'http_req_duration{endpoint:answers-GET_byQuestion}': ['p(95)<500'],
    },
  },
};

// Select profile based on environment variable
const selectedProfile = TEST_PROFILES[TEST_PROFILE];
if (!selectedProfile) {
  throw new Error(`Invalid TEST_PROFILE: ${TEST_PROFILE}. Available profiles: ${Object.keys(TEST_PROFILES).join(', ')}`);
}

// Export selected test configuration
export const options = {
  stages: selectedProfile.stages,
  thresholds: selectedProfile.thresholds,
};

// ============================================================================
// Test Data & Shared State
// ============================================================================

// Sample test data for creating review cards
const sampleProblems = new SharedArray('problems', function() {
  return [
    {
      title: 'Binary Search Implementation',
      url: 'https://leetcode.com/problems/binary-search/',
      taskType: 'concept',
      taskField: 'Binary Search',
      questions: [
        { text: 'What is the time complexity of binary search?' },
        { text: 'What are the edge cases to consider?' },
        { text: 'How do you handle the mid calculation to prevent overflow?' }
      ]
    },
    {
      title: 'Two Sum Problem',
      url: 'https://leetcode.com/problems/two-sum/',
      taskType: 'implementation',
      taskField: 'Hash Table',
      questions: [
        { text: 'What is the optimal approach using a hash map?' },
        { text: 'What is the space-time tradeoff?' }
      ]
    },
    {
      title: 'Merge Sort Algorithm',
      url: 'https://leetcode.com/problems/sort-an-array/',
      taskType: 'concept',
      taskField: 'Sorting',
      questions: [
        { text: 'Explain the divide and conquer approach' },
        { text: 'What is the space complexity?' },
        { text: 'When is merge sort preferred over quicksort?' }
      ]
    }
  ];
});

// Track created resources for cleanup
let createdResources = {
  categories: [],
  reviewCards: [],
  answers: []
};

// ============================================================================
// Helper Functions
// ============================================================================

function getHeaders() {
  return {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

function makeRequest(method, endpoint, body = null, tags = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const params = {
    headers: getHeaders(),
    tags: tags,
  };

  let response;
  if (method === 'GET') {
    response = http.get(url, params);
  } else if (method === 'POST') {
    response = http.post(url, JSON.stringify(body), params);
  } else if (method === 'PUT') {
    response = http.put(url, JSON.stringify(body), params);
  } else if (method === 'PATCH') {
    response = http.patch(url, JSON.stringify(body), params);
  } else if (method === 'DELETE') {
    response = http.del(url, null, params);
  }

  return response;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ============================================================================
// Test Scenarios
// ============================================================================

/**
 * Scenario 1: Health Check
 * Validates that the API is up and running
 */
function healthCheck() {
  group('Health Check', () => {
    const response = makeRequest('GET', '/test/health', null, { endpoint: 'health' });

    check(response, {
      'health check status is 200': (r) => r.status === 200,
      'health check response time < 100ms': (r) => r.timings.duration < 100,
    });
  });
}

/**
 * Scenario 2: User Authentication Validation
 * Verifies that the JWT token is valid and user info can be retrieved
 */
function validateAuthentication() {
  group('Authentication Validation', () => {
    const response = makeRequest('GET', '/test/user', null, { endpoint: 'auth' });

    check(response, {
      'auth check status is 200': (r) => r.status === 200,
      'user info retrieved successfully': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.clerkUserId !== undefined;
        } catch {
          return false;
        }
      }
    });
  });
}

/**
 * Scenario 3: Category Management
 * Creates, reads, and deletes categories
 */
function categoryManagement() {
  group('Category Management', () => {
    // Create a category
    const categoryData = {
      name: `Test Category ${Date.now()}`,
      color: randomColor()
    };

    const createResponse = makeRequest('POST', '/categories', categoryData, { endpoint: 'categories-POST_create' });

    const categoryCreated = check(createResponse, {
      'category created with status 200/201': (r) => r.status === 200 || r.status === 201,
      'category has valid response': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.categoryId !== undefined;
        } catch {
          return false;
        }
      }
    });

    if (categoryCreated && createResponse.status < 300) {
      const category = JSON.parse(createResponse.body);
      createdResources.categories.push(category.categoryId);

      // Get all categories
      const listResponse = makeRequest('GET', '/categories', null, { endpoint: 'categories-GET_list' });
      check(listResponse, {
        'category list retrieved': (r) => r.status === 200,
        'category list is array': (r) => {
          try {
            return Array.isArray(JSON.parse(r.body));
          } catch {
            return false;
          }
        }
      });

      // Get specific category
      const getResponse = makeRequest('GET', `/categories/${category.categoryId}`, null, { endpoint: 'categories-GET_ID' });
      check(getResponse, {
        'specific category retrieved': (r) => r.status === 200,
      });
    }
  });
}

/**
 * Scenario 4: Review Card Lifecycle
 * Complete lifecycle: Create -> Read -> Update -> Review -> Results
 */
function reviewCardLifecycle() {
  group('Review Card Lifecycle', () => {
    // First, create a category for the review card
    const categoryData = {
      name: `Test Category for Review ${Date.now()}`,
      color: randomColor()
    };

    const categoryResponse = makeRequest('POST', '/categories', categoryData, { endpoint: 'categories' });

    if (categoryResponse.status < 300) {
      const category = JSON.parse(categoryResponse.body);
      createdResources.categories.push(category.categoryId);

      // Select a random problem from test data
      const problem = sampleProblems[randomInt(0, sampleProblems.length - 1)];

      // Create a review card
      const reviewCardData = {
        title: `${problem.title} - Test ${Date.now()}`,
        categoryId: category.categoryId,
        importance: randomInt(5, 10),
        reviewCycle: randomInt(3, 14),
        url: problem.url,
        taskType: problem.taskType,
        taskField: problem.taskField,
        questions: problem.questions
      };

      const createResponse = makeRequest('POST', '/reviewCard/create', reviewCardData, { endpoint: 'reviewCards-CREATE' });

      const cardCreated = check(createResponse, {
        'review card created': (r) => r.status === 200 || r.status === 201,
        'review card has ID': (r) => {
          try {
            const body = JSON.parse(r.body);
            return body.reviewCardId !== undefined;
          } catch {
            return false;
          }
        }
      });

      if (cardCreated && createResponse.status < 300) {
        const card = JSON.parse(createResponse.body);
        createdResources.reviewCards.push(card.reviewCardId);

        // Read the review card
        const getResponse = makeRequest('GET', `/reviewCard/${card.reviewCardId}`, null, { endpoint: 'reviewCards-GET_ID' });
        check(getResponse, {
          'review card retrieved': (r) => r.status === 200,
        });

        // Update review card status
        const statusUpdate = { isActive: true };
        const updateStatusResponse = makeRequest('PATCH', `/reviewCard/${card.reviewCardId}/status`, statusUpdate, { endpoint: 'reviewCards-PATCH_status' });
        check(updateStatusResponse, {
          'review card status updated': (r) => r.status === 200,
        });

        // Increment review count
        const reviewResponse = makeRequest('POST', `/reviewCard/${card.reviewCardId}/review`, null, { endpoint: 'reviewCards-POST_review' });
        check(reviewResponse, {
          'review count incremented': (r) => r.status === 200,
        });

        // Get review card results
        const resultsResponse = makeRequest('GET', `/reviewCard/${card.reviewCardId}/results`, null, { endpoint: 'reviewCards-GET_results' });
        check(resultsResponse, {
          'review card results retrieved': (r) => r.status === 200,
        });

        // Update review result
        const resultUpdate = {
          understandingLevel: randomInt(1, 5),
          difficultyLevel: randomInt(1, 5),
          notes: `Test notes from load test at ${new Date().toISOString()}`
        };
        const updateResultResponse = makeRequest('PUT', `/reviewCard/${card.reviewCardId}/result`, resultUpdate, { endpoint: 'reviewCards-PUT_result' });
        check(updateResultResponse, {
          'review card result updated': (r) => r.status === 200,
        });
      }
    }
  });
}

/**
 * Scenario 5: Study Session Simulation
 * Simulates a realistic study session workflow
 */
function studySessionSimulation() {
  group('Study Session Simulation', () => {
    // Get active review cards
    const activeCardsResponse = makeRequest('GET', '/reviewCard/status?isActive=true', null, { endpoint: 'reviewCards-GET_status' });

    check(activeCardsResponse, {
      'active cards retrieved': (r) => r.status === 200,
    });

    // Get review card stats
    const statsResponse = makeRequest('GET', '/reviewCard/stats', null, { endpoint: 'reviewCards-GET_stats' });
    check(statsResponse, {
      'review card stats retrieved': (r) => r.status === 200,
    });

    // Record activity completion (simulating end of study session)
    const activityData = {
      activityDate: new Date().toISOString().split('T')[0],
      reviewCardsCompleted: randomInt(1, 5),
      questionsAnswered: randomInt(5, 20),
      studyTimeMinutes: randomInt(15, 60)
    };

    const activityResponse = makeRequest('POST', '/activity/completion', activityData, { endpoint: 'activity-POST_completion' });
    check(activityResponse, {
      'activity completion recorded': (r) => r.status === 200 || r.status === 201,
    });

    // Get streak info
    const streakResponse = makeRequest('GET', '/activity/streak', null, { endpoint: 'activity-GET_streak' });
    check(streakResponse, {
      'streak info retrieved': (r) => r.status === 200,
    });

    // Get activity history (last 30 days)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const historyResponse = makeRequest('GET', `/activity/history?startDate=${startDate}&endDate=${endDate}`, null, { endpoint: 'activity-GET_history' });
    check(historyResponse, {
      'activity history retrieved': (r) => r.status === 200,
    });
  });
}

/**
 * Scenario 6: Answer Submission
 * Creates and retrieves answers for questions
 */
function answerSubmission() {
  group('Answer Submission', () => {
    // Get all review cards to find questions
    const cardsResponse = makeRequest('GET', '/reviewCard', null, { endpoint: 'reviewCards-GET_list' });

    if (cardsResponse.status === 200) {
      try {
        const cards = JSON.parse(cardsResponse.body);
        if (Array.isArray(cards) && cards.length > 0) {
          const randomCard = cards[randomInt(0, Math.min(cards.length - 1, 4))]; // Pick from first 5 cards

          if (randomCard && randomCard.questions && randomCard.questions.length > 0) {
            const question = randomCard.questions[0];

            // Submit an answer
            const answerData = {
              questionId: question.questionId,
              userAnswer: `Test answer for load testing - ${Date.now()}`,
              isCorrect: Math.random() > 0.5
            };

            const createAnswerResponse = makeRequest('POST', '/answers/create', answerData, { endpoint: 'answers-POST_create' });
            const answerCreated = check(createAnswerResponse, {
              'answer created': (r) => r.status === 200 || r.status === 201,
            });

            if (answerCreated && createAnswerResponse.status < 300) {
              const answer = JSON.parse(createAnswerResponse.body);
              if (answer.answerId) {
                createdResources.answers.push(answer.answerId);
              }

              // Retrieve answers for the question
              const getAnswersResponse = makeRequest('GET', `/answers/question/${question.questionId}`, null, { endpoint: 'answers-GET_byQuestion' });
              check(getAnswersResponse, {
                'answers retrieved for question': (r) => r.status === 200,
              });
            }
          }
        }
      } catch (e) {
        console.error('Error in answer submission scenario:', e);
      }
    }
  });
}

/**
 * Scenario 7: Mixed Load (Realistic User Behavior)
 * Combines multiple operations with weighted probabilities
 * Optimized for high-load scenarios
 */
function mixedLoadScenario() {
  const rand = Math.random();

  // 50% - Read operations (browsing, checking stats)
  // Increased from 40% to better simulate real-world read-heavy workloads
  if (rand < 0.5) {
    const readOperations = [
      () => makeRequest('GET', '/reviewCard', null, { endpoint: 'reviewCards-GET_list' }),
      () => makeRequest('GET', '/reviewCard/stats', null, { endpoint: 'reviewCards-GET_stats' }),
      () => makeRequest('GET', '/categories', null, { endpoint: 'categories-GET_list' }),
      () => makeRequest('GET', '/activity/streak', null, { endpoint: 'activity-GET_streak' }),
      () => makeRequest('GET', '/reviewCard/status?isActive=true', null, { endpoint: 'reviewCards-GET_status' }),
    ];
    const operation = readOperations[randomInt(0, readOperations.length - 1)];
    const response = operation();
    check(response, {
      'mixed load - read operation successful': (r) => r.status === 200,
    });
  }
  // 25% - Review card operations (reduced from 30% to balance load)
  else if (rand < 0.75) {
    reviewCardLifecycle();
  }
  // 15% - Answer submission (reduced from 20%)
  else if (rand < 0.90) {
    answerSubmission();
  }
  // 10% - Study session activities
  else {
    studySessionSimulation();
  }
}

// ============================================================================
// Main Test Function
// ============================================================================

export default function() {
  // Run different scenarios based on weighted probability
  const scenarioChoice = Math.random();

  if (scenarioChoice < 0.15) {
    // 15% - Category management
    categoryManagement();
  } else if (scenarioChoice < 0.30) {
    // 15% - Review card lifecycle
    reviewCardLifecycle();
  } else if (scenarioChoice < 0.45) {
    // 15% - Study session
    studySessionSimulation();
  } else if (scenarioChoice < 0.55) {
    // 10% - Answer submission
    answerSubmission();
  } else {
    // 50% - Mixed load (read-heavy workload)
    mixedLoadScenario();
  }

  // Profile-based think time between user actions
  // Load and stress tests: 0s (measure max throughput)
  // Other profiles: realistic think time
  if (TEST_PROFILE === 'load' || TEST_PROFILE === 'stress') {
    sleep(0);
  } else {
    sleep(randomInt(1, 3));
  }
}

// ============================================================================
// Dummy Data Generation Functions
// ============================================================================

/**
 * Generate categories in parallel batches
 * @param {number} count - Number of categories to create
 * @param {number} batchSize - Number of concurrent requests per batch
 * @returns {Array} Array of created category IDs
 */
function generateCategories(count, batchSize = 100) {
  console.log(`📁 Generating ${count} categories...`);
  const categoryIds = [];
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  let created = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < count; i += batchSize) {
    const batchRequests = [];
    const currentBatch = Math.min(batchSize, count - i);

    // Prepare parallel requests
    for (let j = 0; j < currentBatch; j++) {
      const categoryData = {
        name: `Category-${i + j + 1}`,
        color: colors[(i + j) % colors.length]
      };

      batchRequests.push({
        method: 'POST',
        url: `${BASE_URL}/categories`,
        body: JSON.stringify(categoryData),
        params: { headers: getHeaders() }
      });
    }

    // Execute batch in parallel
    const responses = http.batch(batchRequests);

    // Process responses
    responses.forEach((response, idx) => {
      if (response.status >= 200 && response.status < 300) {
        try {
          const category = JSON.parse(response.body);
          if (category.categoryId) {
            categoryIds.push(category.categoryId);
            created++;
          }
        } catch (e) {
          failed++;
        }
      } else {
        failed++;
      }
    });

    // Progress update every 10 batches
    if ((i / batchSize) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (created / elapsed).toFixed(0);
      console.log(`   Progress: ${created}/${count} (${rate}/s) - Failed: ${failed}`);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Created ${created} categories in ${totalTime}s (${(created / totalTime).toFixed(0)}/s)`);

  return categoryIds;
}

/**
 * Generate review cards in parallel batches
 * @param {Array} categoryIds - Array of category IDs to assign cards to
 * @param {number} count - Number of review cards to create
 * @param {number} batchSize - Number of concurrent requests per batch
 * @returns {Array} Array of created review card IDs
 */
function generateReviewCards(categoryIds, count, batchSize = 50) {
  console.log(`📚 Generating ${count} review cards...`);
  const cardIds = [];
  const taskTypes = ['concept', 'implementation', 'optimization', 'debugging'];
  const taskFields = ['Binary Search', 'Hash Table', 'Sorting', 'Dynamic Programming', 'Graph', 'Tree', 'Array', 'String'];

  let created = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < count; i += batchSize) {
    const batchRequests = [];
    const currentBatch = Math.min(batchSize, count - i);

    for (let j = 0; j < currentBatch; j++) {
      const cardIndex = i + j;
      const categoryId = categoryIds[cardIndex % categoryIds.length];

      const cardData = {
        title: `Review Card ${cardIndex + 1}`,
        categoryId: categoryId,
        importance: randomInt(5, 10),
        reviewCycle: randomInt(3, 14),
        url: `https://leetcode.com/problems/problem-${cardIndex + 1}/`,
        taskType: taskTypes[cardIndex % taskTypes.length],
        taskField: taskFields[cardIndex % taskFields.length],
        questions: [
          { text: `What is the approach for problem ${cardIndex + 1}?` },
          { text: `What is the time complexity?` },
          { text: `What are the edge cases?` }
        ]
      };

      batchRequests.push({
        method: 'POST',
        url: `${BASE_URL}/reviewCard/create`,
        body: JSON.stringify(cardData),
        params: { headers: getHeaders() }
      });
    }

    const responses = http.batch(batchRequests);

    responses.forEach((response) => {
      if (response.status >= 200 && response.status < 300) {
        try {
          const card = JSON.parse(response.body);
          if (card.reviewCardId) {
            cardIds.push(card.reviewCardId);
            created++;
          }
        } catch (e) {
          failed++;
        }
      } else {
        failed++;
      }
    });

    if ((i / batchSize) % 20 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (created / elapsed).toFixed(0);
      console.log(`   Progress: ${created}/${count} (${rate}/s) - Failed: ${failed}`);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Created ${created} review cards in ${totalTime}s (${(created / totalTime).toFixed(0)}/s)`);

  return cardIds;
}

/**
 * Check if dummy data already exists in the database
 * @returns {Object} Object with counts of existing data
 */
function checkExistingData() {
  console.log('🔍 Checking for existing dummy data...');

  const categoriesResponse = makeRequest('GET', '/categories', null, { endpoint: 'categories-GET_list' });
  const reviewCardsResponse = makeRequest('GET', '/reviewCard', null, { endpoint: 'reviewCards-GET_list' });

  let categoriesCount = 0;
  let reviewCardsCount = 0;

  try {
    if (categoriesResponse.status === 200) {
      const categories = JSON.parse(categoriesResponse.body);
      categoriesCount = Array.isArray(categories) ? categories.length : 0;
    }
  } catch (e) {
    console.warn('⚠️  Could not parse categories response');
  }

  try {
    if (reviewCardsResponse.status === 200) {
      const cards = JSON.parse(reviewCardsResponse.body);
      reviewCardsCount = Array.isArray(cards) ? cards.length : 0;
    }
  } catch (e) {
    console.warn('⚠️  Could not parse review cards response');
  }

  return {
    categories: categoriesCount,
    reviewCards: reviewCardsCount
  };
}

// ============================================================================
// Setup & Teardown
// ============================================================================

export function setup() {
  console.log('🚀 Starting load test...');
  console.log(`📍 Target URL: ${BASE_URL}`);
  console.log(`📊 Test Profile: ${selectedProfile.name}`);
  console.log(`📝 Description: ${selectedProfile.description}`);
  console.log(`🔑 Authentication: JWT Token configured`);
  console.log(`💾 Preserve Data: ${PRESERVE_DATA ? 'Yes' : 'No'}`);
  console.log(`🔨 Generate Dummy Data: ${GENERATE_DUMMY_DATA ? 'Yes' : 'No'}`);
  console.log('');
  console.log('📈 Load stages:');
  selectedProfile.stages.forEach((stage, index) => {
    console.log(`   ${index + 1}. ${stage.duration} → ${stage.target} users`);
  });

  // Validate that the API is reachable
  const healthResponse = http.get(`${BASE_URL}/test/health`);
  if (healthResponse.status !== 200) {
    throw new Error(`API health check failed. Status: ${healthResponse.status}`);
  }

  // Validate authentication token
  const authResponse = http.get(`${BASE_URL}/test/user`, {
    headers: getHeaders()
  });
  if (authResponse.status !== 200) {
    throw new Error(`Authentication validation failed. Status: ${authResponse.status}. Please check your AUTH_TOKEN.`);
  }

  console.log('');
  console.log('✅ Pre-flight checks passed');

  // Dummy data generation phase
  let generatedData = {
    categories: [],
    reviewCards: []
  };

  if (GENERATE_DUMMY_DATA) {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔨 DUMMY DATA GENERATION PHASE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📊 Target: ${DATA_TARGETS.categories.toLocaleString()} categories, ${DATA_TARGETS.reviewCards.toLocaleString()} review cards`);
    console.log('');

    const overallStartTime = Date.now();

    // Check existing data if PRESERVE_DATA is enabled
    if (PRESERVE_DATA) {
      const existingData = checkExistingData();
      console.log(`📦 Found ${existingData.categories.toLocaleString()} categories, ${existingData.reviewCards.toLocaleString()} review cards`);

      // Skip generation if sufficient data exists
      if (existingData.categories >= DATA_TARGETS.categories &&
          existingData.reviewCards >= DATA_TARGETS.reviewCards) {
        console.log('✅ Sufficient data already exists. Skipping generation.');
        console.log('💡 Set PRESERVE_DATA=false to force regeneration');
        console.log('═══════════════════════════════════════════════════════════');

        return {
          startTime: new Date().toISOString(),
          profileName: selectedProfile.name,
          dataGenerated: false,
          existingData: existingData
        };
      }

      // Calculate remaining data to generate
      const categoriesToGenerate = Math.max(0, DATA_TARGETS.categories - existingData.categories);
      const reviewCardsToGenerate = Math.max(0, DATA_TARGETS.reviewCards - existingData.reviewCards);

      console.log(`🔨 Will generate: ${categoriesToGenerate.toLocaleString()} categories, ${reviewCardsToGenerate.toLocaleString()} review cards`);
      console.log('');

      // Generate missing data
      if (categoriesToGenerate > 0) {
        generatedData.categories = generateCategories(categoriesToGenerate);
      }

      if (reviewCardsToGenerate > 0) {
        // Fetch all existing categories to use for card assignment
        const categoriesResponse = makeRequest('GET', '/categories', null, { endpoint: 'categories-GET_list' });
        let allCategoryIds = [];

        if (categoriesResponse.status === 200) {
          try {
            const categories = JSON.parse(categoriesResponse.body);
            allCategoryIds = categories.map(c => c.categoryId);
          } catch (e) {
            console.warn('⚠️  Could not parse categories for card generation');
          }
        }

        if (allCategoryIds.length > 0) {
          generatedData.reviewCards = generateReviewCards(allCategoryIds, reviewCardsToGenerate);
        } else {
          console.error('❌ No categories available for review card generation');
        }
      }
    } else {
      // Generate all data from scratch
      console.log('🔨 Generating fresh dummy data...');
      console.log('');

      // Step 1: Generate categories
      generatedData.categories = generateCategories(DATA_TARGETS.categories);
      console.log('');

      // Step 2: Generate review cards
      if (generatedData.categories.length > 0) {
        generatedData.reviewCards = generateReviewCards(generatedData.categories, DATA_TARGETS.reviewCards);
      } else {
        console.error('❌ No categories created. Cannot generate review cards.');
      }
    }

    const overallEndTime = Date.now();
    const totalTime = ((overallEndTime - overallStartTime) / 1000).toFixed(1);
    const totalRecords = generatedData.categories.length + generatedData.reviewCards.length;

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 DATA GENERATION SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Categories created: ${generatedData.categories.length.toLocaleString()}`);
    console.log(`✅ Review cards created: ${generatedData.reviewCards.length.toLocaleString()}`);
    console.log(`⏱️  Total time: ${totalTime}s`);
    console.log(`📈 Average rate: ${(totalRecords / totalTime).toFixed(0)} records/s`);
    console.log(`💾 Estimated DB size: ~${(totalRecords * 0.001).toFixed(1)} MB`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
  }

  return {
    startTime: new Date().toISOString(),
    profileName: selectedProfile.name,
    dataGenerated: GENERATE_DUMMY_DATA,
    generatedData: generatedData
  };
}

export function teardown(data) {
  console.log('\n🧹 Cleaning up test data...');

  let deletedCount = 0;
  let failedCount = 0;

  // Delete review cards first (due to foreign key constraints)
  console.log(`📦 Deleting ${createdResources.reviewCards.length} review cards...`);
  for (const cardId of createdResources.reviewCards) {
    try {
      const response = makeRequest('DELETE', `/reviewCard/${cardId}`);
      if (response.status === 204 || response.status === 200) {
        deletedCount++;
      } else {
        failedCount++;
        console.log(`⚠️  Failed to delete review card ${cardId}: status ${response.status}`);
      }
    } catch (e) {
      failedCount++;
      console.log(`⚠️  Error deleting review card ${cardId}:`, e);
    }
  }

  // Delete categories
  console.log(`📁 Deleting ${createdResources.categories.length} categories...`);
  for (const categoryId of createdResources.categories) {
    try {
      const response = makeRequest('DELETE', `/categories/${categoryId}`);
      if (response.status === 204 || response.status === 200) {
        deletedCount++;
      } else {
        failedCount++;
        console.log(`⚠️  Failed to delete category ${categoryId}: status ${response.status}`);
      }
    } catch (e) {
      failedCount++;
      console.log(`⚠️  Error deleting category ${categoryId}:`, e);
    }
  }

  console.log('\n📊 Cleanup Summary:');
  console.log(`✅ Successfully deleted: ${deletedCount} resources`);
  if (failedCount > 0) {
    console.log(`⚠️  Failed to delete: ${failedCount} resources`);
  }

  console.log('\n🏁 Load test completed!');
  console.log(`📊 Profile: ${data.profileName}`);
  console.log(`⏱️  Started at: ${data.startTime}`);
  console.log(`⏱️  Ended at: ${new Date().toISOString()}`);
  console.log('\n💡 Tip: Check the k6 output above for detailed performance metrics and threshold results.');
}
