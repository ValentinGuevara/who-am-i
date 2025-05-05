import { after } from 'next/server';

export async function POST(request: Request) {
//     const result = await fetch('https://my-analytics-service.example.com/blog/1');

//   const  result.json();
  after(async () => {
    // For example, log or increment analytics in the background
    console.log('Analytics incremented');
  });

  return new Response(JSON.stringify({ message: 'ok' }));
}
