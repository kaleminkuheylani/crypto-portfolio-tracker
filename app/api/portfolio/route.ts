import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { Portfolio } from '../../../models/Portfolio';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType') as 'google' | 'email';

    if (!userId || !userType) {
      return NextResponse.json({ error: 'userId ve userType gerekli' }, { status: 400 });
    }

    let portfolio = await Portfolio.findOne({ userId, userType });
    
    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId,
        userType,
        items: [],
      });
    }

    return NextResponse.json(portfolio.items);
  } catch (error) {
    console.error('Portfolio GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { action, userId, userType } = body;

    if (!userId || !userType) {
      return NextResponse.json({ error: 'userId ve userType gerekli' }, { status: 400 });
    }

    let portfolio = await Portfolio.findOne({ userId, userType });
    
    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId,
        userType,
        items: [],
      });
    }

    if (action === 'add') {
      const { coinId, symbol, name, image, amount, buyPrice } = body;
      
      const existingItem = portfolio.items.find(item => item.coinId === coinId);
      if (existingItem) {
        return NextResponse.json({ error: 'Bu varlık zaten portföyünüzde' }, { status: 400 });
      }

      portfolio.items.push({
        coinId,
        symbol,
        name,
        image,
        amount,
        buyPrice,
        addedAt: new Date(),
      });

      await portfolio.save();
      return NextResponse.json({ success: true, items: portfolio.items });
    }

    if (action === 'remove') {
      const { coinId } = body;
      
      portfolio.items = portfolio.items.filter(item => item.coinId !== coinId);
      await portfolio.save();
      
      return NextResponse.json({ success: true, items: portfolio.items });
    }

    if (action === 'update') {
      const { coinId, amount, buyPrice } = body;
      
      const item = portfolio.items.find(item => item.coinId === coinId);
      if (!item) {
        return NextResponse.json({ error: 'Varlık bulunamadı' }, { status: 404 });
      }

      if (amount !== undefined) item.amount = amount;
      if (buyPrice !== undefined) item.buyPrice = buyPrice;
      
      await portfolio.save();
      return NextResponse.json({ success: true, items: portfolio.items });
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Portfolio POST error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
