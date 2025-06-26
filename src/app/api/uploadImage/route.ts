// app/api/upload/route.ts

import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/userSchema';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { imageBase64 } = body;

  if (!imageBase64) {
    return NextResponse.json(
      { success: false, message: 'No image provided' },
      { status: 400 }
    );
  }

  try {

        const searchUser = await User.findOne({email:session.user.email})

        if(searchUser.profileImage==""){

          const result = await cloudinary.uploader.upload(imageBase64, {
            folder: `userUploads/${session.user.email}`,
          });
      
          console.log(searchUser)
          searchUser.profileImage = result.secure_url
          searchUser.save()
      
          return NextResponse.json({
            success: true,
            url: result.secure_url,
          });
        }

        else{
          return NextResponse.json({
            status:200
          })
        }


  } 
  
  
  catch (error: any) {
    console.error('Cloudinary upload error:', error.message || error);
    return NextResponse.json(
      { success: false, message: 'Upload failed', error: error.message },
      { status: 500 }
    );
  }
}
