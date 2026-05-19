import { NextResponse } from 'next/server';
import driver from '@/lib/neo4j';

export async function GET(request) {
  const session = driver.session();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const result = await session.run(
      `MATCH (c:Case {userId: $userId}) RETURN c`,
      { userId }
    );
    const data = result.records.map(r => {
      const node = r.get('c');
      return { id: node.properties.id, ...node.properties };
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request) {
  const session = driver.session();
  try {
    const { userId, name } = await request.json();
    const id = 'CASE_' + Math.random().toString(36).substring(2, 11).toUpperCase();
    await session.run(
      `CREATE (c:Case {id: $id, userId: $userId, name: $name, caseName: $name}) RETURN c`,
      { id, userId, name }
    );
    return NextResponse.json({ success: true, data: { id, name } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(request) {
  const session = driver.session();
  try {
    const { id, name } = await request.json();
    await session.run(
      `MATCH (c:Case {id: $id}) SET c.name = $name, c.caseName = $name RETURN c`,
      { id, name }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function DELETE(request) {
  const session = driver.session();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await session.run(
      `MATCH (c:Case {id: $id}) DETACH DELETE c`,
      { id }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}
