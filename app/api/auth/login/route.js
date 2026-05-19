import { NextResponse } from 'next/server';
import driver from '@/lib/neo4j';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const session = driver.session();
  try {
    const { username, password } = await request.json();
    const query = `MATCH (u:User {username: $username}) RETURN u`;
    const result = await session.run(query, { username });

    if (result.records.length === 0) {
      return NextResponse.json({ success: false, error: 'User tidak ditemukan' }, { status: 404 });
    }

    const userNode = result.records[0].get('u').properties;
    const isPasswordMatch = await bcrypt.compare(password, userNode.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, error: 'Password salah' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { id: userNode.id, username: userNode.username }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}
