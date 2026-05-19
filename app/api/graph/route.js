import { NextResponse } from 'next/server';
import driver from '@/lib/neo4j';

export async function GET(request) {
    const session = driver.session();
    try {
        const { searchParams } = new URL(request.url);
        const caseId = searchParams.get('caseId');

        const nodesResult = await session.run(
            `MATCH (n) WHERE n.caseId = $caseId RETURN n`,
            { caseId }
        );
        const nodes = nodesResult.records.map(r => {
            const node = r.get('n');
            return { ...node.properties, label: node.labels[0], id: node.properties.id };
        });

        const linksResult = await session.run(
            `MATCH (a {caseId: $caseId})-[r]->(b {caseId: $caseId}) RETURN a.id AS source, b.id AS target, r`,
            { caseId }
        );
        const links = linksResult.records.map(r => {
            const rel = r.get('r');
            let cleanAmount = rel.properties.amount;
            if (cleanAmount && typeof cleanAmount === 'object' && cleanAmount.low !== undefined) {
                cleanAmount = cleanAmount.toNumber();
            }
            return { ...rel.properties, source: r.get('source'), target: r.get('target'), type: rel.type, amount: cleanAmount };
        });

        return NextResponse.json({ success: true, data: { nodes, links } });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
        await session.close();
    }
}
