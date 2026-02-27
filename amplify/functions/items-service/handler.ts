import type { Handler } from 'aws-lambda';

interface ItemEvent {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LIST';
  payload?: {
    id?: string;
    title?: string;
    description?: string;
    status?: 'ACTIVE' | 'DONE' | 'ARCHIVED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  userId?: string;
}

interface ServiceResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp: string;
}

/**
 * Items microservice handler.
 * Validates and processes item operations before they hit DynamoDB.
 */
export const handler: Handler<ItemEvent, ServiceResponse> = async (event) => {
  console.log('[items-service] Invoked with:', JSON.stringify(event));

  const timestamp = new Date().toISOString();

  try {
    switch (event.action) {
      case 'CREATE': {
        if (!event.payload?.title) {
          return { success: false, error: 'Title is required', timestamp };
        }
        if (event.payload.title.length > 200) {
          return { success: false, error: 'Title too long (max 200 chars)', timestamp };
        }
        // Enrichment: set default priority if not provided
        const enriched = {
          ...event.payload,
          priority: event.payload.priority ?? 'MEDIUM',
          status: 'ACTIVE',
        };
        console.log('[items-service] CREATE validated:', enriched);
        return { success: true, data: enriched, timestamp };
      }

      case 'UPDATE': {
        if (!event.payload?.id) {
          return { success: false, error: 'Item ID is required for update', timestamp };
        }
        console.log('[items-service] UPDATE validated for id:', event.payload.id);
        return { success: true, data: event.payload, timestamp };
      }

      case 'DELETE': {
        if (!event.payload?.id) {
          return { success: false, error: 'Item ID is required for delete', timestamp };
        }
        console.log('[items-service] DELETE validated for id:', event.payload.id);
        return { success: true, data: { deleted: event.payload.id }, timestamp };
      }

      case 'LIST': {
        console.log('[items-service] LIST requested by user:', event.userId);
        return { success: true, data: { userId: event.userId }, timestamp };
      }

      default:
        return { success: false, error: 'Unknown action', timestamp };
    }
  } catch (err) {
    console.error('[items-service] Error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Internal error',
      timestamp,
    };
  }
};
