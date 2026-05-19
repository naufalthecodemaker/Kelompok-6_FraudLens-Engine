import { NextResponse } from 'next/server';
import driver from '@/lib/neo4j';

export async function PUT(request, { params }) {
  const session = driver.session();
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { title } = await request.json();
    const query = `MATCH (c:Case {id: $id}) SET c.title = $title RETURN c`;
    await session.run(query, { id, title });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function DELETE(request, { params }) {
  const session = driver.session();
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    await session.run(`MATCH (c:Case {id: $id}) DETACH DELETE c`, { id });
    await session.run(`MATCH (n {caseId: $id}) DETACH DELETE n`, { id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}
