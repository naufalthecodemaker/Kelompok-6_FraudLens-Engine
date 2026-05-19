import { NextResponse } from 'next/server';
import driver from '@/lib/neo4j';

export async function POST(request) {
  const session = driver.session();
  try {
    const { id, name, label, caseId } = await request.json();
    const query = `CREATE (n:${label} {id: $id, name: $name, caseId: $caseId}) RETURN n`;
    await session.run(query, { id, name, caseId });
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
    const caseId = searchParams.get('caseId');
    const query = `MATCH (n {id: $id, caseId: $caseId}) DETACH DELETE n`;
    await session.run(query, { id, caseId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}
