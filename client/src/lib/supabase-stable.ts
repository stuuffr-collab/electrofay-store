// Simplified client to prevent refresh issues
// Using local data only for stability

export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: null, error: { message: 'Using local data' } }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Using local data' } }),
    eq: () => ({ data: null, error: { message: 'Using local data' } })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Using local data' } }),
      remove: () => Promise.resolve({ error: { message: 'Using local data' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
};

export default supabase;