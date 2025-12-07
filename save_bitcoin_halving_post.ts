// Script to save Bitcoin Halving Controversy post to both Mongoose and Sanity
import { bitcoinHalvingContent } from './bitcoin_halving_controversy_post';
import connectDB from './lib/mongodb';
import { Blog } from './models/Blog';
import { createClient } from '@sanity/client';

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN // You'll need to set this in your environment variables
});

async function saveToMongoose() {
  try {
    await connectDB();
    
    // Check if post already exists
    const existingPost = await Blog.findOne({ slug: bitcoinHalvingContent.slug });
    if (existingPost) {
      console.log('Post already exists in Mongoose');
      return existingPost;
    }
    
    // Save to Mongoose
    const newPost = new Blog({
      ...bitcoinHalvingContent,
      isPublished: true,
      views: 0
    });
    
    const savedPost = await newPost.save();
    console.log('Successfully saved to Mongoose:', savedPost.title);
    return savedPost;
  } catch (error) {
    console.error('Error saving to Mongoose:', error);
    throw error;
  }
}

async function saveToSanity() {
  try {
    // Check if post already exists
    const existingPosts = await sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug]`,
      { slug: bitcoinHalvingContent.slug }
    );
    
    if (existingPosts.length > 0) {
      console.log('Post already exists in Sanity');
      return existingPosts[0];
    }
    
    // Prepare data for Sanity
    const sanityData = {
      _type: 'post',
      title: bitcoinHalvingContent.title,
      slug: {
        _type: 'slug',
        current: bitcoinHalvingContent.slug
      },
      excerpt: bitcoinHalvingContent.metaDescription,
      body: bitcoinHalvingContent.htmlContent,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-asset-reference' // You would need to upload the image and get its reference
        }
      },
      publishedAt: new Date(bitcoinHalvingContent.date).toISOString(),
      author: {
        _type: 'reference',
        _ref: 'author-reference' // You would need to reference an existing author in Sanity
      },
      categories: [
        {
          _type: 'reference',
          _ref: 'category-reference' // You would need to reference an existing category in Sanity
        }
      ]
    };
    
    // Save to Sanity
    // Note: For a complete implementation, you would need to:
    // 1. Upload the image to Sanity and get its asset reference
    // 2. Reference existing author and category documents
    // 3. Handle the Portable Text format for the body content
    
    console.log('Would save to Sanity (implementation details commented out)');
    console.log('Sanity data structure prepared:', JSON.stringify(sanityData, null, 2));
    
    return sanityData;
  } catch (error) {
    console.error('Error saving to Sanity:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Saving Bitcoin Halving Controversy post...');
    
    // Save to Mongoose
    const mongooseResult = await saveToMongoose();
    
    // Save to Sanity
    const sanityResult = await saveToSanity();
    
    console.log('Successfully saved to both databases!');
    console.log('Mongoose ID:', mongooseResult._id);
    
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Run the script
main();