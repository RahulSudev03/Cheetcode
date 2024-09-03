import { NextResponse } from 'next/server';
import piston from 'piston-client';

const client = piston({ server: 'https://emkc.org' });

export async function POST(req) {
  const { code, language } = await req.json();

  try {
    const result = await client.execute(language || 'javascript', code);
    return NextResponse.json({ output: result.run.output });
  } catch (error) {
    console.error('Error running code:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
