import 'dotenv/config';
import MigrationDataSource from './src/utils/migration-data-source';

async function runMigrations() {
  try {
    console.log('🔄 Initializing migration data source...');
    await MigrationDataSource.initialize();
    
    console.log('🔄 Running pending migrations...');
    const migrations = await MigrationDataSource.runMigrations();
    
    if (migrations.length === 0) {
      console.log('✅ No pending migrations found.');
    } else {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach(migration => {
        console.log(`   - ${migration.name}`);
      });
    }
    
    console.log('🎉 Migration process completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  } finally {
    if (MigrationDataSource.isInitialized) {
      await MigrationDataSource.destroy();
      console.log('🔌 Database connection closed.');
    }
  }
}

runMigrations();
