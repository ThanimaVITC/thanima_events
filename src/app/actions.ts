'use server';

import {merchOrderSchema} from '@/app/schema';
import clientPromise from '@/lib/mongodb';

export async function submitApplication(data: unknown) {
  try {
    const formData = data as FormData;
    const rawData = Object.fromEntries(formData.entries());

    // Convert isMember string to boolean
    const dataToValidate = {
      ...rawData,
      isMember: rawData.isMember === 'true',
    };

    const parsedData = merchOrderSchema.safeParse(dataToValidate);

    if (!parsedData.success) {
      console.error('Validation Error:', parsedData.error.flatten());
      return {success: false, error: 'Invalid data provided.'};
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);

    const orderData = {
      ...parsedData.data,
      submittedAt: new Date(),
      paymentStatus: 'pending',
    };

    const collection = db.collection('merch_orders');
    const result = await collection.insertOne(orderData);

    if (!result.insertedId) {
      return {success: false, error: 'Failed to save the order.'};
    }

    console.log('New merch order received and saved:', orderData);

    return {success: true};
  } catch (error) {
    console.error('Error submitting order:', error);
    return {success: false, error: 'An unexpected error occurred.'};
  }
}
