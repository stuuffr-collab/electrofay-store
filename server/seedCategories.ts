import { pool } from './db';
import { categories } from '../client/src/lib/categories';

async function seedCategories() {
  console.log('🌱 Starting category seeding process...');
  console.log(`📦 Found ${categories.length} categories to process`);

  const client = await pool.connect();
  
  try {
    let categoriesInserted = 0;
    let subcategoriesInserted = 0;

    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      const category = categories[categoryIndex];
      
      // Extract icon name from the component reference
      const iconName = category.icon.name || category.icon.displayName || 'Box';
      
      console.log(`\n📁 Processing category: ${category.nameEn} (${category.id})`);
      
      // Upsert category using raw SQL
      const categoryQuery = `
        INSERT INTO categories (id, name, name_en, icon, description, description_en, color, gradient, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) 
        DO UPDATE SET
          name = EXCLUDED.name,
          name_en = EXCLUDED.name_en,
          icon = EXCLUDED.icon,
          description = EXCLUDED.description,
          description_en = EXCLUDED.description_en,
          color = EXCLUDED.color,
          gradient = EXCLUDED.gradient,
          sort_order = EXCLUDED.sort_order,
          is_active = EXCLUDED.is_active,
          updated_at = NOW()
        RETURNING id;
      `;
      
      const categoryValues = [
        category.id,
        category.name,
        category.nameEn,
        iconName,
        category.description,
        category.descriptionEn,
        category.color,
        category.gradient,
        categoryIndex,
        true
      ];

      try {
        const result = await client.query(categoryQuery, categoryValues);
        console.log(`✅ Category inserted/updated: ${category.nameEn} (icon: ${iconName})`);
        categoriesInserted++;
      } catch (error: any) {
        console.error(`❌ Error inserting category ${category.id}:`, error.message);
        continue;
      }

      // Process subcategories
      if (category.subcategories && category.subcategories.length > 0) {
        console.log(`  📋 Processing ${category.subcategories.length} subcategories...`);
        
        for (let subIndex = 0; subIndex < category.subcategories.length; subIndex++) {
          const subcategory = category.subcategories[subIndex];
          
          // Extract icon name from the component reference
          const subIconName = subcategory.icon.name || subcategory.icon.displayName || 'Box';
          
          // Upsert subcategory using raw SQL
          const subcategoryQuery = `
            INSERT INTO subcategories (id, category_id, name, name_en, icon, description, description_en, sort_order, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id)
            DO UPDATE SET
              category_id = EXCLUDED.category_id,
              name = EXCLUDED.name,
              name_en = EXCLUDED.name_en,
              icon = EXCLUDED.icon,
              description = EXCLUDED.description,
              description_en = EXCLUDED.description_en,
              sort_order = EXCLUDED.sort_order,
              is_active = EXCLUDED.is_active,
              updated_at = NOW()
            RETURNING id;
          `;
          
          const subcategoryValues = [
            subcategory.id,
            category.id,
            subcategory.name,
            subcategory.nameEn,
            subIconName,
            subcategory.description,
            subcategory.descriptionEn,
            subIndex,
            true
          ];

          try {
            const result = await client.query(subcategoryQuery, subcategoryValues);
            console.log(`  ✅ Subcategory: ${subcategory.nameEn} (icon: ${subIconName})`);
            subcategoriesInserted++;
          } catch (error: any) {
            console.error(`  ❌ Error inserting subcategory ${subcategory.id}:`, error.message);
            continue;
          }
        }
      }
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories inserted/updated: ${categoriesInserted}`);
    console.log(`   - Subcategories inserted/updated: ${subcategoriesInserted}`);

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the seed function
seedCategories()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
