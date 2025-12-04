import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { UserGoogle, UserEmail } from '../../../models/User';
import { Portfolio } from '../../../models/Portfolio';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { action } = body;

    if (action === 'register-email') {
      const { email, password, name } = body;
      
      const existingUser = await UserEmail.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı' }, { status: 400 });
      }

      const user = await UserEmail.create({
        email,
        passwordHash: hashPassword(password),
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      });

      await Portfolio.create({
        userId: user._id,
        userType: 'email',
        items: [],
      });

      return NextResponse.json({
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: 'email',
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      });
    }

    if (action === 'login-email') {
      const { email, password } = body;
      
      const user = await UserEmail.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
      }

      if (user.passwordHash !== hashPassword(password)) {
        return NextResponse.json({ error: 'Şifre yanlış' }, { status: 401 });
      }

      return NextResponse.json({
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: 'email',
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      });
    }

    if (action === 'google-auth') {
      const { googleId, email, name, avatar } = body;
      
      let user = await UserGoogle.findOne({ googleId });
      
      if (!user) {
        user = await UserGoogle.create({
          googleId,
          email,
          name,
          avatar,
        });

        await Portfolio.create({
          userId: user._id,
          userType: 'google',
          items: [],
        });
      }

      return NextResponse.json({
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: 'google',
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      });
    }

    if (action === 'get-user') {
      const { userId, userType } = body;
      
      let user;
      if (userType === 'google') {
        user = await UserGoogle.findById(userId);
      } else {
        user = await UserEmail.findById(userId);
      }

      if (!user) {
        return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
      }

      return NextResponse.json({
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: userType,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      });
    }

    if (action === 'update-premium') {
      const { userId, userType, isPremium, expiresAt } = body;
      
      let user;
      if (userType === 'google') {
        user = await UserGoogle.findByIdAndUpdate(
          userId,
          { isPremium, premiumExpiresAt: expiresAt },
          { new: true }
        );
      } else {
        user = await UserEmail.findByIdAndUpdate(
          userId,
          { isPremium, premiumExpiresAt: expiresAt },
          { new: true }
        );
      }

      if (!user) {
        return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
      }

      return NextResponse.json({ success: true, isPremium: user.isPremium });
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
