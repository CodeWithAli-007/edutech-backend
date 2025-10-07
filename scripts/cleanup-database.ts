import 'dotenv/config';
import { AppDataSource } from '../src/utils/data-source';
import { User, RoleEnumType } from '../src/entities/User.entity';
import { Institute } from '../src/entities/institute.entity';
import { UserDetails } from '../src/entities/userDetails.entity';
import { Course } from '../src/entities/course.entity';
import { Lesson } from '../src/entities/lesson.entity';

async function cleanupDatabase() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connected successfully!');

    // First, let's see what users exist
    console.log('\n📋 Current Users:');
    const allUsers = await AppDataSource.getRepository(User).find();
    allUsers.forEach(user => {
      console.log(`  - ${user.userName} (${user.email}) - Role: ${user.role}`);
    });

    // Find admin users
    const adminUsers = await AppDataSource.getRepository(User).find({
      where: { role: RoleEnumType.ADMIN }
    });

    console.log(`\n🔑 Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach(admin => {
      console.log(`  - ${admin.userName} (${admin.email})`);
    });

    if (adminUsers.length === 0) {
      console.log('❌ No admin users found! Cannot proceed with cleanup.');
      return;
    }

    // Get the first admin user for updated_by references
    const primaryAdmin = adminUsers[0];
    console.log(`\n👤 Using admin: ${primaryAdmin.userName} (${primaryAdmin.user_id}) for updated_by references`);

    // Start cleanup process
    console.log('\n🧹 Starting database cleanup...');

    // 1. Delete all lessons
    console.log('Deleting all lessons...');
    await AppDataSource.getRepository(Lesson).delete({});
    console.log('✅ Lessons deleted');

    // 2. Delete all courses
    console.log('Deleting all courses...');
    await AppDataSource.getRepository(Course).delete({});
    console.log('✅ Courses deleted');

    // 3. Delete all user details
    console.log('Deleting all user details...');
    await AppDataSource.getRepository(UserDetails).delete({});
    console.log('✅ User details deleted');

    // 4. Delete all institutes
    console.log('Deleting all institutes...');
    await AppDataSource.getRepository(Institute).delete({});
    console.log('✅ Institutes deleted');

    // 5. Delete all non-admin users
    console.log('Deleting non-admin users...');
    const nonAdminUsers = await AppDataSource.getRepository(User).find({
      where: { role: RoleEnumType.TEACHER }
    });
    
    // Also delete other roles if they exist
    const otherUsers = await AppDataSource.getRepository(User).find({
      where: [
        { role: RoleEnumType.INSTITUTE_ADMIN },
        { role: RoleEnumType.STUDENT }
      ]
    });

    const usersToDelete = [...nonAdminUsers, ...otherUsers];
    console.log(`Found ${usersToDelete.length} non-admin users to delete:`);
    usersToDelete.forEach(user => {
      console.log(`  - ${user.userName} (${user.email}) - Role: ${user.role}`);
    });

    if (usersToDelete.length > 0) {
      await AppDataSource.getRepository(User).remove(usersToDelete);
      console.log('✅ Non-admin users deleted');
    }

    // 6. Update admin users' institute references to null
    console.log('Updating admin users...');
    for (const admin of adminUsers) {
      admin.instituteId = null;
      await AppDataSource.getRepository(User).save(admin);
    }
    console.log('✅ Admin users updated');

    // Final verification
    console.log('\n📋 Remaining Users:');
    const remainingUsers = await AppDataSource.getRepository(User).find();
    remainingUsers.forEach(user => {
      console.log(`  - ${user.userName} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Admin users preserved: ${adminUsers.length}`);
    console.log(`  - Non-admin users deleted: ${usersToDelete.length}`);
    console.log(`  - All lessons deleted`);
    console.log(`  - All courses deleted`);
    console.log(`  - All institutes deleted`);
    console.log(`  - All user details deleted`);

  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('\nDatabase connection closed.');
  }
}

cleanupDatabase();
