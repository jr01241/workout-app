const { prisma } = require('../lib/db');

async function testDatabaseOperations() {
  try {
    // Clean up any existing test data
    console.log('Cleaning up test data...');
    await prisma.exerciseLog.deleteMany({});
    await prisma.workoutSession.deleteMany({});
    await prisma.chatMessage.deleteMany({});
    await prisma.user.deleteMany({});

    // Create a test user
    console.log('\nCreating test user...');
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });
    console.log('Created user:', user);

    // Create a workout session
    console.log('\nCreating workout session...');
    const workoutSession = await prisma.workoutSession.create({
      data: {
        date: new Date(),
        name: 'Morning Workout',
        notes: 'Feeling strong today!',
        userId: user.id,
      },
    });
    console.log('Created workout session:', workoutSession);

    // Create exercise logs
    console.log('\nCreating exercise logs...');
    const exerciseLog = await prisma.exerciseLog.create({
      data: {
        exerciseName: 'Bench Press',
        weightKg: 80,
        sets: 3,
        repsPerSet: [10, 8, 8],
        notes: 'Increased weight by 2.5kg',
        workoutSessionId: workoutSession.id,
      },
    });
    console.log('Created exercise log:', exerciseLog);

    // Create a chat message
    console.log('\nCreating chat message...');
    const chatMessage = await prisma.chatMessage.create({
      data: {
        role: 'user',
        content: 'How was my workout today?',
        userId: user.id,
      },
    });
    console.log('Created chat message:', chatMessage);

    // Read operations with relationships
    console.log('\nFetching user with related data...');
    const userWithData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        workoutSessions: {
          include: {
            exerciseLogs: true,
          },
        },
        chatMessages: true,
      },
    });
    console.log('User with related data:', JSON.stringify(userWithData, null, 2));

    // Update operations
    console.log('\nUpdating workout session...');
    const updatedSession = await prisma.workoutSession.update({
      where: { id: workoutSession.id },
      data: {
        notes: 'Great workout, feeling accomplished!',
      },
    });
    console.log('Updated workout session:', updatedSession);

    // Delete operations
    console.log('\nDeleting test data...');
    await prisma.exerciseLog.deleteMany({});
    await prisma.workoutSession.deleteMany({});
    await prisma.chatMessage.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Test data deleted successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseOperations()
  .then(() => console.log('Database operations test completed'))
  .catch(console.error);
