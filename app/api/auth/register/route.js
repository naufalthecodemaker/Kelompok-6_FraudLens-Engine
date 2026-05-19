import { NextResponse } from 'next/server';
import driver from '@/lib/neo4j';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const session = driver.session();
  try {
    const { username, password } = await request.json();
    const checkQuery = `MATCH (u:User {username: $username}) RETURN u`;
    const checkResult = await session.run(checkQuery, { username });
    
    if (checkResult.records.length > 0) {
      return NextResponse.json({ success: false, error: 'Username sudah terdaftar' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = '_' + Math.random().toString(36).substr(2, 9);
    const createQuery = `
      CREATE (u:User {id: $id, username: $username, password: $hashedPassword})
      RETURN u
    `;
    await session.run(createQuery, { id, username, hashedPassword });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}
