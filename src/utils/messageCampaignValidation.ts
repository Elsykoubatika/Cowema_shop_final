
// Helper functions to validate and cast types
export const validateCampaignChannel = (channel: string): 'email' | 'whatsapp' => {
  if (channel === 'email' || channel === 'whatsapp') {
    return channel;
  }
  return 'whatsapp'; // default fallback
};

export const validateCampaignStatus = (status: string): 'draft' | 'sending' | 'completed' | 'failed' => {
  if (status === 'draft' || status === 'sending' || status === 'completed' || status === 'failed') {
    return status;
  }
  return 'draft'; // default fallback
};

export const validateSendStatus = (status: string): 'pending' | 'sent' | 'delivered' | 'read' | 'failed' => {
  if (status === 'pending' || status === 'sent' || status === 'delivered' || status === 'read' || status === 'failed') {
    return status;
  }
  return 'pending'; // default fallback
};

// Helper function to safely convert JSONB to array
export const ensureArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [];
};
