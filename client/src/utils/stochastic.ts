/**
 * Generates a random date between 30 minutes and 1 week from now.
 * @returns An object containing the random date and a description of the time difference.
 */
export function generateRandomDate(): { date: Date; description: string } {
  const now = new Date();
  const minOffset = 30 * 60 * 1000; // 30 minutes in milliseconds
  const maxOffset = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
  
  const randomOffset = Math.floor(Math.random() * (maxOffset - minOffset + 1) + minOffset);
  const randomDate = new Date(now.getTime() + randomOffset);
  
  let description: string;
  
  if (randomOffset < 60 * 60 * 1000) {
    // Less than an hour, return in minutes
    const minutes = Math.floor(randomOffset / (60 * 1000));
    description = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (randomOffset < 24 * 60 * 60 * 1000) {
    // Less than a day, return in hours
    const hours = Math.floor(randomOffset / (60 * 60 * 1000));
    description = `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (randomOffset < 7 * 24 * 60 * 60 * 1000) {
    // Less than a week, return in days
    const days = Math.floor(randomOffset / (24 * 60 * 60 * 1000));
    description = `${days} day${days !== 1 ? 's' : ''}`;
  } else {
    // Exactly one week
    description = '1 week';
  }
  
  return { date: randomDate, description };
}
