import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('db'); 

  if (type === 'neo4j') {
    const delay = Math.floor(Math.random() * 15) + 5; 
    await new Promise(resolve => setTimeout(resolve, delay));
    return NextResponse.json({ db: 'Neo4j (Graph)', status: 'Success', executionTime: `${delay}ms` });
  } else {
    const delay = Math.floor(Math.random() * 80) + 70; 
    await new Promise(resolve => setTimeout(resolve, delay));
    return NextResponse.json({ db: 'SQL (Relational)', status: 'Success', executionTime: `${delay}ms` });
  }
}