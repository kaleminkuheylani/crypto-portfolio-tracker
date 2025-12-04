import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { Alert } from '../../../models/Alert';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType') as 'google' | 'email';

    if (!userId || !userType) {
      return NextResponse.json({ error: 'userId ve userType gerekli' }, { status: 400 });
    }

    const alerts = await Alert.find({ userId, userType, isActive: true })
      .sort({ createdAt: -1 });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Alerts GET error:', error);
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

    if (action === 'create') {
      const { coinId, coinSymbol, coinImage, targetPrice, condition } = body;
      
      const alert = await Alert.create({
        userId,
        userType,
        coinId,
        coinSymbol,
        coinImage,
        targetPrice,
        condition,
      });

      return NextResponse.json(alert);
    }

    if (action === 'delete') {
      const { alertId } = body;
      
      await Alert.findByIdAndDelete(alertId);
      return NextResponse.json({ success: true });
    }

    if (action === 'trigger') {
      const { alertId } = body;
      
      await Alert.findByIdAndUpdate(alertId, {
        isActive: false,
        isTriggered: true,
        triggeredAt: new Date(),
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'check') {
      const { prices } = body;
      
      const activeAlerts = await Alert.find({ userId, userType, isActive: true });
      const triggered: any[] = [];

      for (const alert of activeAlerts) {
        const currentPrice = prices[alert.coinId];
        if (!currentPrice) continue;

        let shouldTrigger = false;
        if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          await Alert.findByIdAndUpdate(alert._id, {
            isActive: false,
            isTriggered: true,
            triggeredAt: new Date(),
          });
          triggered.push({
            ...alert.toObject(),
            currentPrice,
          });
        }
      }

      return NextResponse.json({ triggered });
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Alerts POST error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
