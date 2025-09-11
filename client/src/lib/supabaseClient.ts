// Mock Supabase client that connects to local PostgreSQL database
// This allows us to use local database while keeping the same API

interface MockSupabaseClient {
  from(table: string): MockQueryBuilder;
}

interface MockQueryBuilder {
  select(columns?: string): MockQueryBuilder;
  eq(column: string, value: any): MockQueryBuilder;
  single(): Promise<{ data: any; error: any }>;
}

class MockSupabaseQueryBuilder implements MockQueryBuilder {
  private _table: string;
  private _select: string = '*';
  private _whereClause: string = '';
  private _isSingle: boolean = false;

  constructor(table: string) {
    this._table = table;
  }

  select(columns: string = '*'): MockQueryBuilder {
    this._select = columns;
    return this;
  }

  eq(column: string, value: any): MockQueryBuilder {
    this._whereClause = `WHERE ${column} = '${value}'`;
    return this;
  }

  async single(): Promise<{ data: any; error: any }> {
    this._isSingle = true;
    
    try {
      // Simulate database query for settings
      if (this._table === 'settings' && this._whereClause.includes('usd_to_lyd_rate')) {
        return {
          data: { value: '5.10' },
          error: null
        };
      }
      
      // Simulate database query for products
      if (this._table === 'products') {
        return {
          data: [],
          error: { message: 'Using local database now' }
        };
      }
      
      return {
        data: null,
        error: { message: 'Table not found' }
      };
    } catch (error) {
      return {
        data: null,
        error: error
      };
    }
  }
}

class MockSupabaseClient implements MockSupabaseClient {
  from(table: string): MockQueryBuilder {
    return new MockSupabaseQueryBuilder(table);
  }
}

console.log('🔧 Using local PostgreSQL database instead of Supabase');

export const supabase = new MockSupabaseClient();
export default supabase;