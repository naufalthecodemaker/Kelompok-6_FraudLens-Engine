import { NextResponse } from 'next/server';
import driver from '@/lib/neo4j';

export async function GET(request) {
    const session = driver.session();
    try {
        const { searchParams } = new URL(request.url);
        const caseId = searchParams.get('caseId');

        const ssnQuery = `
      MATCH (c1:Customer)-[:HAS_IDENTIFICATION]->(s:SSN)<-[:HAS_IDENTIFICATION]-(c2:Customer)
      WHERE c1.caseId = $caseId AND c2.caseId = $caseId AND c1.id <> c2.id
      RETURN DISTINCT s.name AS entityName, s.id AS entityId
    `;

        const phoneQuery = `
      MATCH (c1:Customer)-[:USES_PHONE]->(p:Phone)<-[:USES_PHONE]-(c2:Customer)
      WHERE c1.caseId = $caseId AND c2.caseId = $caseId AND c1.id <> c2.id
      RETURN DISTINCT p.name AS entityName, p.id AS entityId
    `;

        const deviceQuery = `
      MATCH (a:Account)-[:LOGGED_IN_FROM]->(d:Device)
      WHERE a.caseId = $caseId AND d.caseId = $caseId
      WITH d, count(DISTINCT a) AS accountCount
      WHERE accountCount > 1
      RETURN DISTINCT d.name AS entityName, d.id AS entityId
    `;

        const cycleQuery = `
      MATCH path = (a:Account)-[:TRANSFERRED_TO*1..5]->(a)
      WHERE all(node IN nodes(path) WHERE node.caseId = $caseId)
      UNWIND nodes(path) AS cycleNode
      RETURN DISTINCT cycleNode.name AS entityName, cycleNode.id AS entityId
    `;

        const ssnResult = await session.run(ssnQuery, { caseId });
        const phoneResult = await session.run(phoneQuery, { caseId });
        const deviceResult = await session.run(deviceQuery, { caseId });
        const cycleResult = await session.run(cycleQuery, { caseId });

        const extractNames = (res) => res.records.map(r => r.get('entityName') || r.get('entityId'));

        const ssnDetails = extractNames(ssnResult);
        const phoneDetails = extractNames(phoneResult);
        const deviceDetails = extractNames(deviceResult);
        const cycleDetails = extractNames(cycleResult);

        let score = 0;
        if (ssnDetails.length > 0) score += 25;
        if (phoneDetails.length > 0) score += 25;
        if (deviceDetails.length > 0) score += 25;
        if (cycleDetails.length > 0) score += 25;

        const checklist = [
            {
                id: 'ssn',
                title: 'Duplikasi Identitas Negara (SSN/NIK)',
                description: ssnDetails.length > 0
                    ? 'Terdeteksi penggunaan nomor NIK/SSN yang sama oleh beberapa akun customer yang berbeda.'
                    : 'Tidak terdeteksi adanya duplikasi NIK/SSN. Seluruh akun customer menggunakan identitas unik yang valid.',
                triggered: ssnDetails.length > 0,
                details: ssnDetails,
                detailLabel: 'Identitas Terduplikasi:'
            },
            {
                id: 'phone',
                title: 'Duplikasi Kontak Telekomunikasi (Phone)',
                description: phoneDetails.length > 0
                    ? 'Terdeteksi penggunaan nomor telepon yang sama oleh beberapa akun customer yang berbeda.'
                    : 'Tidak terdeteksi adanya duplikasi nomor telepon. Kontak telekomunikasi antar customer terpisah dengan aman.',
                triggered: phoneDetails.length > 0,
                details: phoneDetails,
                detailLabel: 'Kontak Terduplikasi:'
            },
            {
                id: 'device',
                title: 'Kolusi Perangkat Terdeteksi',
                description: deviceDetails.length > 0
                    ? 'Terdeteksi aktivitas beberapa rekening finansial berbeda diakses dari satu infrastruktur hardware yang sama.'
                    : 'Tidak terdeteksi adanya kolusi perangkat. Akses rekening finansial tersebar normal di berbagai hardware unik.',
                triggered: deviceDetails.length > 0,
                details: deviceDetails,
                detailLabel: 'Hardware Terkolusi:'
            },
            {
                id: 'cycle',
                title: 'Circular Transfer / Money Laundering',
                description: cycleDetails.length > 0
                    ? 'Terdeteksi pola aliran dana melingkar tanpa ujung untuk memanipulasi volume sirkulasi transaksi keuangan.'
                    : 'Tidak terdeteksi adanya sirkulasi transfer melingkar. Aliran dana antar rekening berjalan wajar dan linear.',
                triggered: cycleDetails.length > 0,
                details: cycleDetails,
                detailLabel: 'Rekening Terlibat Putaran:'
            }
        ];

        return NextResponse.json({
            success: true,
            data: { fraudPercentage: score, checklist }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } finally {
        await session.close();
    }
}
