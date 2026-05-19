import { NextResponse } from 'next/server';
import driver from '@/lib/neo4j';

export async function POST(request) {
  const session = driver.session();
  try {
    const { sourceId, targetId, type, amount, caseId } = await request.json();
    const query = `
      MATCH (a {caseId: $caseId}), (b {caseId: $caseId})
      WHERE a.id = $sourceId AND b.id = $targetId
      CREATE (a)-[r:${type} {amount: $amount, caseId: $caseId, date: $date}]->(b)
      RETURN r
    `;
    await session.run(query, {
      sourceId,
      targetId,
      type,
      caseId,
      amount: amount ? parseInt(amount) : 0,
      date: new Date().toISOString().split('T')[0]
    });
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
    const { sourceId, targetId, type, caseId } = await request.json();
    const query = `
      MATCH (a {caseId: $caseId})-[r:${type}]->(b {caseId: $caseId})
      WHERE a.id = $sourceId AND b.id = $targetId
      DELETE r
    `;
    await session.run(query, { sourceId, targetId, type, caseId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}
