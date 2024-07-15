import { NextRequest, NextResponse } from 'next/server';
import { requestCounter } from './requestcount';
import { activeRequestsGauge } from './requestcount';
import { httpRequestDurationMicroseconds } from './requestcount';

export async function middleware(req: NextRequest) {
  const startTime = Date.now();
  activeRequestsGauge.inc();

  const response = await fetch(req.nextUrl.href, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  const endTime = Date.now();
  const duration = endTime - startTime;

  requestCounter.inc({
    method: req.method,
    route: req.nextUrl.pathname,
    status_code: response.status,
  });

  httpRequestDurationMicroseconds.observe(
    {
      method: req.method,
      route: req.nextUrl.pathname,
      code: response.status,
    },
    duration
  );

  activeRequestsGauge.dec();

  return NextResponse.next();
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}